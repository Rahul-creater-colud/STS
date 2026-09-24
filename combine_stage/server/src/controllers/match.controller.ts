import type { Request, Response, NextFunction } from 'express';
import FoodDonation from '../models/FoodDonation.js';
import ShelterRequest from '../models/ShelterRequest.js';
import Volunteer from '../models/Volunteer.js';
import RescueMission from '../models/RescueMission.js';
import AppNotification from '../models/AppNotification.js';
import { rankShelters, haversineKm } from '../services/matchEngine.service.js';
import { data, json } from './helpers.js';
import { HttpError } from '../middleware/errorHandler.js';
import { newId } from '../utils/idGenerator.js';

export async function getMatches(req: Request, res: Response, next: NextFunction) {
  try {
    const donation = await FoodDonation.findById(req.params.donationId);
    if (!donation) throw new HttpError(404, 'Donation not found');
    const shelters = await ShelterRequest.find({ status: { $in: ['Open', 'Partially Fulfilled'] } });
    data(res, rankShelters(donation.toJSON() as never, shelters.map((s) => s.toJSON()) as never[]));
  } catch (error) { next(error); }
}

export async function dispatchMatch(req: Request, res: Response, next: NextFunction) {
  let donationReserved = false;
  let volunteerReserved = false;
  let shelterReserved = false;
  let donationId = '';
  let volunteerId = '';
  let shelterId = '';
  let mealCount = 0;
  let missionCreated = false;
  let createdMissionMongoId = '';

  try {
    const donation = await FoodDonation.findById(req.body.donationId);
    const shelter = await ShelterRequest.findById(req.body.shelterId);
    if (!donation || !shelter) throw new HttpError(404, 'Donation or shelter request not found');

    const matches = rankShelters(donation.toJSON() as never, [shelter.toJSON() as never]);
    if (!matches.some((match) => String(match.shelter.id) === String(shelter.id))) {
      throw new HttpError(400, 'This shelter is not eligible for the donation');
    }

    let selectedVolunteer = req.body.volunteerId
      ? await Volunteer.findById(req.body.volunteerId)
      : null;
    if (!req.body.volunteerId) {
      const available = await Volunteer.find({ status: 'Available' });
      available.sort((a, b) => haversineKm(a.currentLocation, donation.location) - haversineKm(b.currentLocation, donation.location));
      selectedVolunteer = available[0] ?? null;
    }
    if (!selectedVolunteer) throw new HttpError(400, 'No available volunteer');

    mealCount = Math.min(donation.quantityMeals, shelter.requiredMeals - shelter.receivedMeals - (shelter.reservedMeals || 0));
    if (mealCount < 1) throw new HttpError(400, 'Shelter request is already fulfilled or reserved');

    donationId = String(donation.id);
    volunteerId = String(selectedVolunteer.id);
    shelterId = String(shelter.id);

    const reservedDonation = await FoodDonation.findOneAndUpdate(
      { _id: donation._id, status: { $in: ['Pending Match', 'Matched'] } },
      { $set: { status: 'Volunteer Assigned', matchedShelterId: shelterId, matchedShelterName: shelter.shelterName, assignedVolunteerId: volunteerId, assignedVolunteerName: selectedVolunteer.name } },
      { new: true },
    );
    if (!reservedDonation) throw new HttpError(409, 'Donation is already assigned or closed');
    donationReserved = true;

    const reservedVolunteer = await Volunteer.findOneAndUpdate(
      { _id: selectedVolunteer._id, status: 'Available' },
      { $set: { status: 'On Active Rescue' } },
      { new: true },
    );
    if (!reservedVolunteer) throw new HttpError(409, 'Volunteer is no longer available');
    volunteerReserved = true;

    const reservedShelter = await ShelterRequest.findOneAndUpdate(
      {
        _id: shelter._id,
        status: { $in: ['Open', 'Partially Fulfilled'] },
        $expr: { $lte: [{ $add: ['$receivedMeals', { $ifNull: ['$reservedMeals', 0] }, mealCount] }, '$requiredMeals'] },
      },
      { $inc: { reservedMeals: mealCount } },
      { new: true },
    );
    if (!reservedShelter) throw new HttpError(409, 'Shelter request no longer has enough unreserved capacity');
    shelterReserved = true;

    const distance = haversineKm(reservedVolunteer.currentLocation, donation.location) + haversineKm(donation.location, shelter.location);
    const mission = await RescueMission.create({
      rescueCode: `SSR-${newId().slice(0, 8).toUpperCase()}`,
      donationId,
      shelterRequestId: shelterId,
      donorName: donation.donorName,
      donorLocation: donation.location,
      shelterName: shelter.shelterName,
      shelterLocation: shelter.location,
      volunteerId,
      volunteerName: reservedVolunteer.name,
      volunteerPhone: reservedVolunteer.phone,
      volunteerVehicle: reservedVolunteer.vehicleType,
      volunteerRating: reservedVolunteer.rating,
      mealsCount: mealCount,
      foodName: donation.foodName,
      category: donation.category,
      dietary: donation.dietary,
      status: 'Volunteer Assigned',
      etaMinutes: Math.round(distance * 2.8 + 6),
      totalDistanceKm: Number(distance.toFixed(1)),
      timeline: [{ time: new Date().toISOString(), title: 'Volunteer assigned', description: `${reservedVolunteer.name} accepted the rescue`, status: 'current' }],
      routeCoordinates: [[donation.location.lat, donation.location.lng], [shelter.location.lat, shelter.location.lng]],
      currentVolunteerCoord: [reservedVolunteer.currentLocation.lat, reservedVolunteer.currentLocation.lng],
      verificationOtp: String(Math.floor(1000 + Math.random() * 9000)),
    });
    missionCreated = true;
    createdMissionMongoId = String(mission._id);

    const attachedMission = await Volunteer.updateOne({ _id: reservedVolunteer._id, status: 'On Active Rescue' }, { $set: { activeRescueId: String(mission.id) } });
    if (!attachedMission.modifiedCount) throw new HttpError(409, 'Volunteer assignment changed; dispatch was rolled back');
    await AppNotification.create({ title: 'Volunteer Dispatched', message: `${reservedVolunteer.name} is collecting ${mealCount} meals from ${donation.donorName}.`, type: 'dispatch', read: false, actionUrl: `/live-tracking/${mission.id}` }).catch((error) => console.error('Could not create dispatch notification:', error));
    data(res, json(mission), 201);
  } catch (error) {
    if (missionCreated) await RescueMission.deleteOne({ _id: createdMissionMongoId }).catch(() => undefined);
    {
      if (shelterReserved) await ShelterRequest.updateOne({ _id: shelterId }, { $inc: { reservedMeals: -mealCount } }).catch(() => undefined);
      if (volunteerReserved) await Volunteer.updateOne({ _id: volunteerId }, { $set: { status: 'Available' }, $unset: { activeRescueId: 1 } }).catch(() => undefined);
      if (donationReserved) await FoodDonation.updateOne({ _id: donationId, status: 'Volunteer Assigned' }, { $set: { status: 'Pending Match' }, $unset: { matchedShelterId: 1, matchedShelterName: 1, assignedVolunteerId: 1, assignedVolunteerName: 1 } }).catch(() => undefined);
    }
    next(error);
  }
}
