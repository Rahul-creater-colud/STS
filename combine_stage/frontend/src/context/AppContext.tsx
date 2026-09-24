import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  FoodDonation, 
  ShelterRequest, 
  Volunteer, 
  RescueMission, 
  AppNotification, 
  ActiveScreen,
  RescueStatus
} from '../types';
import { 
  INITIAL_DONATIONS, 
  INITIAL_REQUESTS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_ACTIVE_MISSION, 
  INITIAL_NOTIFICATIONS, 
  OVERALL_KPIS 
} from '../data/mockData';
import * as api from '../services/api';

const isoAfterMinutes = (minutes: number) => new Date(Date.now() + minutes * 60_000).toISOString();

interface AppContextType {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  userRole: 'admin' | 'donor' | 'ngo' | 'volunteer';
  setUserRole: (role: 'admin' | 'donor' | 'ngo' | 'volunteer') => void;
  donations: FoodDonation[];
  requests: ShelterRequest[];
  volunteers: Volunteer[];
  activeMission: RescueMission;
  notifications: AppNotification[];
  kpis: typeof OVERALL_KPIS;
  selectedDonationForMatch: FoodDonation | null;
  setSelectedDonationForMatch: (donation: FoodDonation | null) => void;
  selectedLocationFilter: string;
  setSelectedLocationFilter: (loc: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isJudgeMode: boolean;
  setIsJudgeMode: (val: boolean) => void;
  isSimulatingGps: boolean;
  setIsSimulatingGps: (val: boolean) => void;
  // Actions
  addDonation: (newDonation: Omit<FoodDonation, 'id' | 'createdAt' | 'status'>) => void;
  addRequest: (newRequest: Omit<ShelterRequest, 'id' | 'receivedMeals' | 'status'>) => void;
  dispatchMatch: (donationId: string, shelterId: string, volunteerId?: string) => void;
  updateMissionStatus: (status: RescueStatus) => void;
  advanceVolunteerStep: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  triggerJudgeDemo: (type: 'banquet_surplus' | 'urgent_request' | 'instant_rescue') => void;
  toastMessage: { title: string; desc: string; type: 'success' | 'info' | 'warning' } | null;
  setToastMessage: (msg: { title: string; desc: string; type: 'success' | 'info' | 'warning' } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode; authenticatedRole: 'admin' | 'donor' | 'ngo' | 'volunteer' }> = ({ children, authenticatedRole }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('dashboard');
  const [userRole, setUserRole] = useState<'admin' | 'donor' | 'ngo' | 'volunteer'>(authenticatedRole);
  const [donations, setDonations] = useState<FoodDonation[]>(INITIAL_DONATIONS);
  const [requests, setRequests] = useState<ShelterRequest[]>(INITIAL_REQUESTS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [activeMission, setActiveMission] = useState<RescueMission>(INITIAL_ACTIVE_MISSION);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [kpis, setKpis] = useState(OVERALL_KPIS);
  const [selectedDonationForMatch, setSelectedDonationForMatch] = useState<FoodDonation | null>(INITIAL_DONATIONS[1]); // Jaipur Marriott by default
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All Jaipur');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isJudgeMode, setIsJudgeMode] = useState<boolean>(true);
  const [isSimulatingGps, setIsSimulatingGps] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    Promise.allSettled([api.getDonations(), api.getRequests(), api.getVolunteers(), api.getActiveMission(), api.getNotifications()]).then(([donationsResult, requestsResult, volunteersResult, missionResult, notificationsResult]) => {
      if (donationsResult.status === 'fulfilled') { setDonations(donationsResult.value); setSelectedDonationForMatch(donationsResult.value[0] ?? null); }
      if (requestsResult.status === 'fulfilled') setRequests(requestsResult.value);
      if (volunteersResult.status === 'fulfilled') setVolunteers(volunteersResult.value);
      if (missionResult.status === 'fulfilled' && missionResult.value) setActiveMission(missionResult.value);
      if (notificationsResult.status === 'fulfilled') setNotifications(notificationsResult.value);
      if (authenticatedRole === 'admin' || authenticatedRole === 'ngo') api.getAnalytics().then(metrics => setKpis(previous => ({ ...previous, ...metrics }))).catch(() => undefined);
      const failure = [donationsResult, requestsResult, volunteersResult, missionResult, notificationsResult].find(result => result.status === 'rejected');
      if (failure?.status === 'rejected') setToastMessage({ title: 'Some backend data did not load', desc: failure.reason instanceof Error ? failure.reason.message : 'Check the API connection.', type: 'warning' });
    });
  }, [authenticatedRole]);

  // Auto clear toast after 4s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // GPS Simulation interval
  useEffect(() => {
    if (!isSimulatingGps) return;
    const interval = setInterval(() => {
      setActiveMission(prev => {
        const coords = prev.routeCoordinates;
        if (!coords || coords.length < 2) return prev;
        
        // Find next step in coords
        const currentCoord = prev.currentVolunteerCoord;
        const currentIndex = coords.findIndex(c => c[0] === currentCoord[0] && c[1] === currentCoord[1]);
        const nextIndex = currentIndex >= 0 && currentIndex < coords.length - 1 ? currentIndex + 1 : 0;
        const nextCoord = coords[nextIndex];
        
        const newEta = Math.max(1, prev.etaMinutes - 2);

        // If reached end
        if (nextIndex === coords.length - 1) {
          setIsSimulatingGps(false);
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          setToastMessage({
            title: 'Rescue Arrived at Destination',
            desc: `Volunteer arrived at ${prev.shelterName}. Ready for confirmation!`,
            type: 'success'
          });
        }

        return {
          ...prev,
          currentVolunteerCoord: nextCoord,
          etaMinutes: newEta
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulatingGps]);

  const addDonation = async (newDon: Omit<FoodDonation, 'id' | 'createdAt' | 'status'>) => {
    try {
      const saved = await api.createDonation(newDon);
      setDonations(prev => [saved, ...prev]);
      setSelectedDonationForMatch(saved);
      setToastMessage({ title: 'Donation saved', desc: `${saved.quantityMeals} meals are now in the matching queue.`, type: 'success' });
    } catch (error) {
      setToastMessage({ title: 'Could not save donation', desc: error instanceof Error ? error.message : 'API request failed.', type: 'warning' });
    }
  };

  const addRequest = async (newReq: Omit<ShelterRequest, 'id' | 'receivedMeals' | 'status'>) => {
    try {
      const saved = await api.createRequest(newReq);
      setRequests(prev => [saved, ...prev]);
      setToastMessage({ title: 'Request saved', desc: `${saved.requiredMeals} meals requested.`, type: 'success' });
    } catch (error) {
      setToastMessage({ title: 'Could not save request', desc: error instanceof Error ? error.message : 'API request failed.', type: 'warning' });
    }
  };

  const dispatchMatch = async (donationId: string, shelterId: string, volunteerId?: string) => {
    try { const mission = await api.dispatchMatch(donationId, shelterId, volunteerId); setActiveMission(mission); setDonations(await api.getDonations()); setRequests(await api.getRequests()); setVolunteers(await api.getVolunteers()); setToastMessage({ title: 'Dispatch confirmed', desc: `${mission.mealsCount} meals assigned to ${mission.shelterName}.`, type: 'success' }); return; }
    catch (error) { setToastMessage({ title: 'Dispatch failed', desc: error instanceof Error ? error.message : 'API request failed.', type: 'warning' }); return; }
  };

  const updateMissionStatus = async (newStatus: RescueStatus) => {
    try {
      const saved = await api.updateMissionStatus(activeMission.id, newStatus);
      setActiveMission(saved); setRequests(await api.getRequests()); setDonations(await api.getDonations());
      if (newStatus === 'Delivered') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setKpis(previous => ({ ...previous, successfulDeliveries: previous.successfulDeliveries + 1, activeDeliveries: Math.max(0, previous.activeDeliveries - 1) }));
        setToastMessage({ title: 'Mission accomplished', desc: `${saved.mealsCount} meals delivered to ${saved.shelterName}.`, type: 'success' });
      }
      return;
    }
    catch (error) { setToastMessage({ title: 'Mission update failed', desc: error instanceof Error ? error.message : 'API request failed.', type: 'warning' }); }
  };

  const advanceVolunteerStep = () => {
    if (activeMission.status === 'Volunteer Assigned') updateMissionStatus('En Route to Pickup');
    else if (activeMission.status === 'En Route to Pickup') updateMissionStatus('Food Picked Up');
    else if (activeMission.status === 'Food Picked Up') updateMissionStatus('In Transit');
    else if (activeMission.status === 'In Transit') {
      updateMissionStatus('Delivered');
    }
  };

  const markNotificationRead = async (id: string) => {
    try { await api.markNotificationRead(id); } catch (error) { setToastMessage({ title: 'Notification update failed', desc: error instanceof Error ? error.message : 'API request failed.', type: 'warning' }); return; }
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = async () => {
    try { await api.markAllNotificationsRead(); } catch (error) { setToastMessage({ title: 'Notification update failed', desc: error instanceof Error ? error.message : 'API request failed.', type: 'warning' }); return; }
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const triggerJudgeDemo = (type: 'banquet_surplus' | 'urgent_request' | 'instant_rescue') => {
    if (type === 'banquet_surplus') {
      addDonation({
        donorName: 'Maharani Palace Grand Banquet',
        donorType: 'Event Banquet',
        donorContact: '+91 98299 87654',
        foodName: 'Wedding Feast: Shahi Paneer, Biryani, Naan & Gulab Jamun',
        category: 'Cooked Meals',
        dietary: 'Vegetarian',
        quantityMeals: 180,
        weightKg: 75,
        preparedTime: isoAfterMinutes(-10),
        pickupWindowStart: isoAfterMinutes(20),
        pickupDeadline: isoAfterMinutes(140),
        location: {
          lat: 26.8920,
          lng: 75.8080,
          address: 'Ashok Marg, Near Statue Circle',
          area: 'C-Scheme',
          landmark: 'Banquet Gate 1'
        },
        packaging: 'Industrial warmers & thermal catering bins',
        storageTemp: 'Hot (>60°C)',
        notes: 'High volume luxury wedding surplus. Ready for bulk distribution.'
      });
      setActiveScreen('smart-match');
    } else if (type === 'urgent_request') {
      addRequest({
        shelterName: 'Jaipur Railway Station Night Transit Shelter',
        shelterCode: 'SH-JAIPUR-031',
        contactPerson: 'Rameshwar Lal',
        phone: '+91 94140 11928',
        location: {
          lat: 26.9200,
          lng: 75.7870,
          address: 'Station Road, Jaipur Junction Entrance',
          area: 'Railway Station / Sindhi Camp',
          landmark: 'Behind Platform 1 Waiting Hall'
        },
        requiredMeals: 100,
        dietaryPreference: 'Vegetarian',
        urgency: 'Critical',
        deadlineTime: isoAfterMinutes(90),
        notes: 'Sudden influx of 90+ stranded passengers and workers due to severe night chill.',
        beneficiaryCount: 110
      });
      setActiveScreen('requests');
    } else if (type === 'instant_rescue') {
      // Execute 1-click rescue demo
      if (selectedDonationForMatch && requests[0]) dispatchMatch(selectedDonationForMatch.id, requests[0].id);
      else setToastMessage({ title: 'No rescue available', desc: 'Create or seed a donation and shelter request first.', type: 'warning' });
      setActiveScreen('live-tracking');
      setIsSimulatingGps(true);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        userRole,
        setUserRole,
        donations,
        requests,
        volunteers,
        activeMission,
        notifications,
        kpis,
        selectedDonationForMatch,
        setSelectedDonationForMatch,
        selectedLocationFilter,
        setSelectedLocationFilter,
        searchQuery,
        setSearchQuery,
        isJudgeMode,
        setIsJudgeMode,
        isSimulatingGps,
        setIsSimulatingGps,
        addDonation,
        addRequest,
        dispatchMatch,
        updateMissionStatus,
        advanceVolunteerStep,
        markNotificationRead,
        markAllNotificationsRead,
        triggerJudgeDemo,
        toastMessage,
        setToastMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
