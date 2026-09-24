import { Router } from 'express';
import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import { validateRequest } from '../middleware/validate.js';
import { allowRoles, authenticate } from '../middleware/auth.js';
import { login, me, register } from '../controllers/auth.controller.js';
import { createDonation, listDonations, getDonation } from '../controllers/donation.controller.js';
import { createRequest, listRequests } from '../controllers/request.controller.js';
import { listVolunteers } from '../controllers/volunteer.controller.js';
import { getMatches, dispatchMatch } from '../controllers/match.controller.js';
import { activeMission, getMission, updateMissionStatus, updateMissionLocation } from '../controllers/mission.controller.js';
import { listNotifications, markRead, markAllRead } from '../controllers/notification.controller.js';
import { overview } from '../controllers/analytics.controller.js';

const r = Router();
const id = (name: string) => param(name).isMongoId().withMessage('Must be a valid MongoDB id');
const location = (prefix = 'location') => [
  body(`${prefix}.lat`).isFloat({ min: -90, max: 90 }),
  body(`${prefix}.lng`).isFloat({ min: -180, max: 180 }),
  body(`${prefix}.address`).isString().trim().notEmpty(),
  body(`${prefix}.area`).isString().trim().notEmpty(),
  body(`${prefix}.landmark`).optional().isString(),
];

r.get('/', (_req, res) => res.json({ message: 'Surplus-to-Shelter API is running', status: 'ok' }));
r.get('/health', (_req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
r.post('/auth/register', [
  body('name').isString().trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').isString().isLength({ min: 12, max: 128 }),
  body('role').optional().isIn(['donor', 'ngo', 'volunteer']),
  validateRequest,
], register);
r.post('/auth/login', [body('email').isEmail().normalizeEmail(), body('password').isString().notEmpty(), validateRequest], login);
r.get('/auth/me', authenticate, me);

// Every application/data endpoint requires a signed-in account.
r.use(authenticate);

r.get('/donations', listDonations);
r.get('/donations/:id', id('id'), validateRequest, getDonation);
r.post('/donations', allowRoles('donor', 'admin'), [
  body('donorName').isString().trim().notEmpty(),
  body('donorType').isIn(['Restaurant', 'Hotel', 'Hostel', 'Event Banquet', 'Corporate Cafeteria']),
  body('donorContact').isString().trim().notEmpty(),
  body('foodName').isString().trim().notEmpty(),
  body('category').isIn(['Cooked Meals', 'Bakery & Bread', 'Fresh Produce', 'Packaged & Dry', 'Dairy & Beverages']),
  body('dietary').isIn(['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain']),
  body('quantityMeals').isInt({ min: 1 }),
  body('preparedTime').isISO8601(),
  body('pickupWindowStart').isISO8601(),
  body('pickupDeadline').isISO8601(),
  ...location(),
  body('packaging').isString().notEmpty(),
  body('storageTemp').isIn(['Hot (>60°C)', 'Room Temp (20-25°C)', 'Chilled (<5°C)']),
  body('weightKg').optional().isFloat({ min: 0 }),
  body('notes').optional().isString(),
  validateRequest,
], createDonation);

r.get('/requests', listRequests);
r.post('/requests', allowRoles('ngo', 'admin'), [
  body('shelterName').isString().trim().notEmpty(),
  body('shelterCode').isString().trim().notEmpty(),
  body('contactPerson').isString().trim().notEmpty(),
  body('phone').isString().trim().notEmpty(),
  ...location(),
  body('requiredMeals').isInt({ min: 1 }),
  body('dietaryPreference').isIn(['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain']),
  body('urgency').isIn(['Low', 'Medium', 'High', 'Critical']),
  body('deadlineTime').isISO8601(),
  body('beneficiaryCount').isInt({ min: 0 }),
  body('notes').optional().isString(),
  validateRequest,
], createRequest);

r.get('/volunteers', listVolunteers);
r.get('/match/:donationId', id('donationId'), validateRequest, getMatches);
r.post('/match/dispatch', allowRoles('ngo', 'admin'), [body('donationId').isMongoId(), body('shelterId').isMongoId(), body('volunteerId').optional().isMongoId(), validateRequest], dispatchMatch);
r.get('/missions/active', activeMission);
r.get('/missions/:id', id('id'), validateRequest, getMission);
r.patch('/missions/:id/status', allowRoles('volunteer', 'admin'), [id('id'), body('status').isIn(['Pending Match', 'Matched', 'Volunteer Assigned', 'En Route to Pickup', 'Food Picked Up', 'In Transit', 'Delivered', 'Cancelled']), validateRequest], updateMissionStatus);
r.patch('/missions/:id/location', allowRoles('volunteer', 'admin'), [id('id'), body('currentVolunteerCoord').isArray({ min: 2, max: 2 }), body('currentVolunteerCoord.0').isFloat({ min: -90, max: 90 }), body('currentVolunteerCoord.1').isFloat({ min: -180, max: 180 }), body('etaMinutes').isInt({ min: 0 }), validateRequest], updateMissionLocation);
r.get('/notifications', listNotifications);
r.patch('/notifications/read-all', markAllRead);
r.patch('/notifications/:id/read', id('id'), validateRequest, markRead);
r.get('/analytics/overview', allowRoles('admin', 'ngo'), overview);

export default r;
