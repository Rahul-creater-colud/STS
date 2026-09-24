import type { Request, Response, NextFunction } from 'express';
import RescueMission from '../models/RescueMission.js';
import FoodDonation from '../models/FoodDonation.js';
import ShelterRequest from '../models/ShelterRequest.js';
import Volunteer from '../models/Volunteer.js';
import AppNotification from '../models/AppNotification.js';
import { data, json } from './helpers.js';
import { HttpError } from '../middleware/errorHandler.js';
import type { RescueStatus } from '../types.js';

const transitions: Record<RescueStatus, RescueStatus[]> = {
  'Pending Match': ['Matched', 'Volunteer Assigned', 'Cancelled'],
  Matched: ['Volunteer Assigned', 'Cancelled'],
  'Volunteer Assigned': ['En Route to Pickup', 'Cancelled'],
  'En Route to Pickup': ['Food Picked Up', 'Cancelled'],
  'Food Picked Up': ['In Transit', 'Cancelled'],
  'In Transit': ['Delivered', 'Cancelled'],
  Delivered: [],
  Cancelled: [],
};

export async function activeMission(_req: Request, res: Response, next: NextFunction) {
  try {
    const mission = await RescueMission.findOne({ status: { $nin: ['Delivered', 'Cancelled'] } }).sort({ createdAt: -1, _id: -1 });
    const result = mission ? json(mission) as Record<string, unknown> : null;
    if (result && res.locals.authUser.role !== 'admin') delete result.volunteerPhone;
    data(res, result);
  } catch (error) { next(error); }
}

export async function getMission(req: Request, res: Response, next: NextFunction) {
  try {
    const mission = await RescueMission.findById(req.params.id);
    if (!mission) throw new HttpError(404, 'Mission not found');
    const result = json(mission) as Record<string, unknown>;
    if (res.locals.authUser.role !== 'admin') delete result.volunteerPhone;
    data(res, result);
  } catch (error) { next(error); }
}

export async function updateMissionStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const mission = await RescueMission.findById(req.params.id);
    if (!mission) throw new HttpError(404, 'Mission not found');
    const nextStatus = req.body.status as RescueStatus;
    if (!transitions[mission.status as RescueStatus]?.includes(nextStatus)) {
      throw new HttpError(409, `Mission cannot move from ${mission.status} to ${nextStatus}`);
    }

    const now = new Date().toISOString();
    mission.status = nextStatus;
    mission.timeline.push({ time: now, title: nextStatus, description: `Mission status changed to ${nextStatus}`, status: nextStatus === 'Delivered' || nextStatus === 'Cancelled' ? 'completed' : 'current' });
    if (nextStatus === 'Food Picked Up') mission.pickupCompletedTime = now;
    if (nextStatus === 'Delivered') mission.deliveredTime = now;
    await mission.save();

    if (nextStatus === 'Delivered' || nextStatus === 'Cancelled') {
      await Volunteer.findByIdAndUpdate(mission.volunteerId, { $set: { status: 'Available' }, $unset: { activeRescueId: 1 } });
      const shelter = await ShelterRequest.findById(mission.shelterRequestId);
      if (shelter) {
        shelter.reservedMeals = Math.max(0, (shelter.reservedMeals || 0) - mission.mealsCount);
        if (nextStatus === 'Delivered') shelter.receivedMeals = Math.min(shelter.requiredMeals, shelter.receivedMeals + mission.mealsCount);
        shelter.status = shelter.receivedMeals >= shelter.requiredMeals ? 'Fully Fulfilled' : shelter.receivedMeals > 0 ? 'Partially Fulfilled' : 'Open';
        await shelter.save();
      }

      if (nextStatus === 'Delivered') {
        await FoodDonation.findByIdAndUpdate(mission.donationId, { $set: { status: 'Delivered' } });
        await Volunteer.findByIdAndUpdate(mission.volunteerId, { $inc: { completedRescues: 1 } });
        await AppNotification.create({ title: 'Delivery Completed Successfully', message: `Rescue ${mission.rescueCode} delivered ${mission.mealsCount} meals to ${mission.shelterName}.`, type: 'delivery', read: false });
      } else {
        await FoodDonation.findByIdAndUpdate(mission.donationId, { $set: { status: 'Cancelled' } });
      }
    }

    data(res, json(mission));
  } catch (error) { next(error); }
}

export async function updateMissionLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const mission = await RescueMission.findById(req.params.id);
    if (!mission) throw new HttpError(404, 'Mission not found');
    if (mission.status !== 'En Route to Pickup' && mission.status !== 'In Transit') throw new HttpError(409, 'Location can only be updated while a volunteer is travelling');
    mission.currentVolunteerCoord = req.body.currentVolunteerCoord;
    mission.etaMinutes = req.body.etaMinutes;
    await mission.save();
    data(res, json(mission));
  } catch (error) { next(error); }
}
