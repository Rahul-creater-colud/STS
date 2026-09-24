export type FoodCategory = 'Cooked Meals' | 'Bakery & Bread' | 'Fresh Produce' | 'Packaged & Dry' | 'Dairy & Beverages';

export type DietaryType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain';

export type RescueStatus = 
  | 'Pending Match'
  | 'Matched'
  | 'Volunteer Assigned'
  | 'En Route to Pickup'
  | 'Food Picked Up'
  | 'In Transit'
  | 'Delivered'
  | 'Cancelled';

export type UrgencyLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface LocationCoordinates {
  lat: number;
  lng: number;
  address: string;
  area: string;
  landmark?: string;
}

export interface FoodDonation {
  id: string;
  donorName: string;
  donorType: 'Restaurant' | 'Hotel' | 'Hostel' | 'Event Banquet' | 'Corporate Cafeteria';
  donorContact: string;
  foodName: string;
  category: FoodCategory;
  dietary: DietaryType;
  quantityMeals: number;
  weightKg?: number;
  preparedTime: string;
  pickupWindowStart: string;
  pickupDeadline: string;
  location: LocationCoordinates;
  status: RescueStatus;
  matchedShelterId?: string;
  matchedShelterName?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  packaging: string;
  storageTemp: 'Hot (>60°C)' | 'Room Temp (20-25°C)' | 'Chilled (<5°C)';
  notes?: string;
  createdAt: string;
}

export interface ShelterRequest {
  id: string;
  shelterName: string;
  shelterCode: string;
  contactPerson: string;
  phone: string;
  location: LocationCoordinates;
  requiredMeals: number;
  receivedMeals: number;
  dietaryPreference: DietaryType;
  urgency: UrgencyLevel;
  deadlineTime: string;
  status: 'Open' | 'Partially Fulfilled' | 'Fully Fulfilled' | 'Closed';
  notes?: string;
  beneficiaryCount: number;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'Electric Two-Wheeler' | 'Motorcycle' | 'Cargo Van' | 'Auto Rickshaw' | 'Car';
  vehicleNumber: string;
  rating: number;
  completedRescues: number;
  status: 'Available' | 'On Active Rescue' | 'Offline';
  currentLocation: { lat: number; lng: number; area: string };
  activeRescueId?: string;
}

export interface RouteTimelineEvent {
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
}

export interface RescueMission {
  id: string;
  rescueCode: string;
  donationId: string;
  shelterRequestId: string;
  donorName: string;
  donorLocation: LocationCoordinates;
  shelterName: string;
  shelterLocation: LocationCoordinates;
  volunteerId: string;
  volunteerName: string;
  volunteerPhone: string;
  volunteerVehicle: string;
  volunteerRating: number;
  mealsCount: number;
  foodName: string;
  category: FoodCategory;
  dietary: DietaryType;
  status: RescueStatus;
  etaMinutes: number;
  totalDistanceKm: number;
  pickupCompletedTime?: string;
  deliveredTime?: string;
  timeline: RouteTimelineEvent[];
  routeCoordinates: [number, number][]; // [lat, lng] array
  currentVolunteerCoord: [number, number];
  verificationOtp?: string;
}

export interface SmartMatchOption {
  shelter: ShelterRequest;
  matchScore: number; // 0-100%
  distanceKm: number;
  etaMinutes: number;
  urgencyBonus: number;
  quantityMatchPercentage: number;
  scoreBreakdown: {
    proximity: number;     // max 35
    quantityFit: number;   // max 25
    timeUrgency: number;   // max 25
    dietarySafety: number; // max 15
  };
  reasoning: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'match' | 'dispatch' | 'pickup' | 'delivery' | 'urgent';
  read: boolean;
  actionUrl?: string;
}

export type ActiveScreen = 
  | 'landing'
  | 'dashboard'
  | 'donations'
  | 'requests'
  | 'smart-match'
  | 'volunteer-mobile'
  | 'live-tracking'
  | 'analytics';
