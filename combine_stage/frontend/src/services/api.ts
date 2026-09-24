import type {
  AppNotification,
  FoodDonation,
  RescueMission,
  RescueStatus,
  ShelterRequest,
  SmartMatchOption,
  Volunteer,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api').replace(/\/$/, '');

type ApiEnvelope<T> = { data: T };
type DonationFilters = Partial<Pick<FoodDonation, 'status' | 'category' | 'dietary'>>;
type RequestFilters = Partial<Pick<ShelterRequest, 'urgency' | 'status'>>;
type DonationInput = Omit<FoodDonation, 'id' | 'createdAt' | 'status'>;
type RequestInput = Omit<ShelterRequest, 'id' | 'receivedMeals' | 'status'>;
export type AppRole = 'admin' | 'donor' | 'ngo' | 'volunteer';
export interface SignedInUser { id: string; name: string; email: string; role: AppRole }
const TOKEN_KEY = 'surplus-to-shelter-token';
export const setAuthToken = (token: string | null) => token ? sessionStorage.setItem(TOKEN_KEY, token) : sessionStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(sessionStorage.getItem(TOKEN_KEY) ? { Authorization: `Bearer ${sessionStorage.getItem(TOKEN_KEY)}` } : {}), ...init.headers },
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const error = body && typeof body === 'object' && 'error' in body ? body.error : null;
    const message = typeof error === 'string' ? error : error && typeof error === 'object' && 'message' in error && typeof error.message === 'string' ? error.message : `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  if (body && typeof body === 'object' && 'data' in body) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

export const signIn = (email: string, password: string) =>
  request<{ token: string; user: SignedInUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const signUp = (name: string, email: string, password: string, role: Exclude<AppRole, 'admin'>) =>
  request<{ token: string; user: SignedInUser }>('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) });
export const getCurrentUser = () => request<SignedInUser>('/auth/me');

function queryString(values: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) if (value) params.set(key, value);
  const query = params.toString();
  return query ? `?${query}` : '';
}

export const getDonations = (filters: DonationFilters = {}) =>
  request<FoodDonation[]>(`/donations${queryString(filters)}`);

export const getDonation = (donationId: string) =>
  request<FoodDonation>(`/donations/${encodeURIComponent(donationId)}`);

export const createDonation = (donation: DonationInput) =>
  request<FoodDonation>('/donations', { method: 'POST', body: JSON.stringify(donation) });

export const getRequests = (filters: RequestFilters = {}) =>
  request<ShelterRequest[]>(`/requests${queryString(filters)}`);

export const createRequest = (shelterRequest: RequestInput) =>
  request<ShelterRequest>('/requests', { method: 'POST', body: JSON.stringify(shelterRequest) });

export const getVolunteers = (status?: Volunteer['status']) =>
  request<Volunteer[]>(`/volunteers${queryString({ status })}`);

export const getMatches = (donationId: string) =>
  request<SmartMatchOption[]>(`/match/${encodeURIComponent(donationId)}`);

export const dispatchMatch = (donationId: string, shelterId: string, volunteerId?: string) =>
  request<RescueMission>('/match/dispatch', {
    method: 'POST',
    body: JSON.stringify({ donationId, shelterId, ...(volunteerId ? { volunteerId } : {}) }),
  });

export const getActiveMission = () => request<RescueMission | null>('/missions/active');

export const getMission = (missionId: string) =>
  request<RescueMission>(`/missions/${encodeURIComponent(missionId)}`);

export const updateMissionStatus = (missionId: string, status: RescueStatus) =>
  request<RescueMission>(`/missions/${encodeURIComponent(missionId)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const updateMissionLocation = (
  missionId: string,
  currentVolunteerCoord: [number, number],
  etaMinutes: number,
) =>
  request<RescueMission>(`/missions/${encodeURIComponent(missionId)}/location`, {
    method: 'PATCH',
    body: JSON.stringify({ currentVolunteerCoord, etaMinutes }),
  });

export const getNotifications = () => request<AppNotification[]>('/notifications');

export const markNotificationRead = (notificationId: string) =>
  request<AppNotification>(`/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH' });

export const markAllNotificationsRead = () =>
  request<{ updated: boolean }>('/notifications/read-all', { method: 'PATCH' });

export interface AnalyticsOverview {
  mealsRescued: number;
  activeDonations: number;
  activeDeliveries: number;
  partnerNgos: number;
  activeVolunteers: number;
  successfulDeliveries: number;
  co2SavedKg: number;
  foodValueRescuedInr: number;
  avgDeliveryTimeMinutes: number;
  avgRouteDistanceKm: number;
  successfulMatchRate: number;
  failedRescueRate: number;
}

export const getAnalytics = () => request<AnalyticsOverview>('/analytics/overview');

export const getHealth = () =>
  request<{ status: 'ok'; db: 'connected' | 'disconnected' }>('/health');
