import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  Clock, 
  MapPin, 
  Layers, 
  Maximize2, 
  ShieldCheck, 
  Truck, 
  ChevronRight,
  Flame,
  Phone,
  CheckCircle2,
  Play,
  Pause
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MapProps {
  showFloatingPanel?: boolean;
  height?: string;
  onTrackRescueClick?: () => void;
}

export const InteractiveRescueMap: React.FC<MapProps> = ({ 
  showFloatingPanel = true,
  height = '540px',
  onTrackRescueClick 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  const { 
    donations, 
    requests, 
    volunteers, 
    activeMission, 
    setActiveScreen, 
    setSelectedDonationForMatch,
    isSimulatingGps,
    setIsSimulatingGps 
  } = useApp();

  const [selectedPinInfo, setSelectedPinInfo] = useState<{
    type: 'donor' | 'shelter' | 'volunteer';
    title: string;
    subtitle: string;
    detail: string;
    actionText?: string;
    action?: () => void;
  } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [26.8920, 75.8050], // Central Jaipur
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // Sleek modern CartoDB Positron tiles (light clean aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add zoom control top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers & Polylines whenever donations, requests, or volunteer coords change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Food Donors (🟢 Green Pins)
    donations.forEach(don => {
      const isUrgent = don.status === 'Pending Match';
      const donorIcon = L.divIcon({
        className: 'custom-donor-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs ${isUrgent ? 'pulse-emerald' : ''}">
              🍲
            </div>
            <div class="absolute -bottom-5 bg-slate-900/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none">
              ${don.quantityMeals}m
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([don.location.lat, don.location.lng], { icon: donorIcon });
      marker.on('click', () => {
        setSelectedPinInfo({
          type: 'donor',
          title: don.donorName,
          subtitle: `${don.foodName} (${don.quantityMeals} meals)`,
          detail: `Status: ${don.status} • Location: ${don.location.area}`,
          actionText: don.status === 'Pending Match' ? 'Run Smart Match' : 'View Donation',
          action: () => {
            setSelectedDonationForMatch(don);
            setActiveScreen('smart-match');
          }
        });
      });
      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Shelters & NGOs (🔵 Blue Pins)
    requests.forEach(req => {
      const shelterIcon = L.divIcon({
        className: 'custom-donor-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white font-bold text-xs pulse-blue">
              🏠
            </div>
            <div class="absolute -bottom-5 bg-blue-900/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none">
              Need: ${req.requiredMeals - req.receivedMeals}
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([req.location.lat, req.location.lng], { icon: shelterIcon });
      marker.on('click', () => {
        setSelectedPinInfo({
          type: 'shelter',
          title: req.shelterName,
          subtitle: `Needs ${req.requiredMeals} meals (Received: ${req.receivedMeals})`,
          detail: `Urgency: ${req.urgency} • Deadline: ${req.deadlineTime} • ${req.location.area}`,
          actionText: 'View Food Requests',
          action: () => setActiveScreen('requests')
        });
      });
      markersLayerRef.current?.addLayer(marker);
    });

    // 3. Active Volunteers (🟠 Orange Pins)
    volunteers.forEach(vol => {
      const isCurrentActive = vol.id === activeMission.volunteerId;
      const lat = isCurrentActive ? activeMission.currentVolunteerCoord[0] : vol.currentLocation.lat;
      const lng = isCurrentActive ? activeMission.currentVolunteerCoord[1] : vol.currentLocation.lng;

      const volIcon = L.divIcon({
        className: 'custom-donor-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <div class="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xl border-2 border-white font-bold text-sm pulse-orange">
              🛵
            </div>
            <div class="absolute -bottom-5 bg-orange-950 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap pointer-events-none">
              ${vol.name.split(' ')[0]}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const marker = L.marker([lat, lng], { icon: volIcon });
      marker.on('click', () => {
        setSelectedPinInfo({
          type: 'volunteer',
          title: `Volunteer: ${vol.name}`,
          subtitle: `${vol.vehicleType} • Rating: ${vol.rating}⭐`,
          detail: `Rescues: ${vol.completedRescues} • Status: ${vol.status}`,
          actionText: isCurrentActive ? 'Track Live Rescue' : undefined,
          action: isCurrentActive ? () => setActiveScreen('live-tracking') : undefined
        });
      });
      markersLayerRef.current?.addLayer(marker);
    });

    // 4. Draw Active Rescue Polylines (Restaurant → Volunteer → Shelter)
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (activeMission && activeMission.routeCoordinates.length > 0) {
      const poly = L.polyline(activeMission.routeCoordinates, {
        color: '#059669', // Emerald brand
        weight: 5,
        opacity: 0.85,
        dashArray: '8, 8',
        className: 'animated-route-line'
      }).addTo(map);

      polylineRef.current = poly;
    }
  }, [donations, requests, volunteers, activeMission, setActiveScreen, setSelectedDonationForMatch]);

  const handleCenterRescue = () => {
    if (!mapInstanceRef.current || !activeMission) return;
    mapInstanceRef.current.flyTo(activeMission.currentVolunteerCoord, 14, { duration: 1 });
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([26.8920, 75.8050], 13, { duration: 1 });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-white" style={{ height }}>
      
      {/* Map Container Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Left: Map Legend */}
      <div className="absolute top-4 left-4 z-10 glass-panel rounded-xl p-3 shadow-md border border-slate-200/80 text-xs">
        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-600" />
          Jaipur Live Logistics
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
            <span className="font-medium">Food Donation ({donations.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white shadow-xs"></span>
            <span className="font-medium">NGO / Shelter ({requests.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shadow-xs"></span>
            <span className="font-medium">Active Volunteer ({volunteers.length})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 pt-0.5">
            <span className="w-4 h-1 rounded-full bg-emerald-600"></span>
            <span className="text-[11px] text-slate-500 font-mono">Real-time Route</span>
          </div>
        </div>

        {/* Quick Map Controls */}
        <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex gap-1.5">
          <button
            onClick={handleCenterRescue}
            className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 border border-slate-200 transition cursor-pointer flex items-center gap-1"
            title="Center on active rescue vehicle"
          >
            <Navigation className="w-3 h-3 text-emerald-600" />
            Focus Rescue
          </button>
          <button
            onClick={handleResetView}
            className="px-2 py-1 bg-white hover:bg-slate-100 rounded text-[11px] font-semibold text-slate-700 border border-slate-200 transition cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Floating Panel: Active Rescue #1024 (as explicitly required in prompt) */}
      {showFloatingPanel && (
        <div className="absolute top-4 right-4 z-10 w-72 sm:w-80 glass-panel rounded-2xl p-4 shadow-xl border border-slate-200/90 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
              <span className="font-extrabold text-sm text-slate-900">
                Active Rescue #{activeMission.rescueCode.replace('RESCUE-', '')}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {activeMission.status}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Meals Rescued:</span>
              <span className="font-bold text-slate-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                {activeMission.mealsCount} meals ({activeMission.category})
              </span>
            </div>

            <div className="flex items-start justify-between text-slate-600 gap-2">
              <span className="font-medium shrink-0">Origin:</span>
              <span className="font-semibold text-slate-800 text-right truncate">
                {activeMission.donorName} ({activeMission.donorLocation.area})
              </span>
            </div>

            <div className="flex items-start justify-between text-slate-600 gap-2">
              <span className="font-medium shrink-0">Destination:</span>
              <span className="font-semibold text-blue-700 text-right truncate">
                {activeMission.shelterName}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Volunteer:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-orange-500" />
                {activeMission.volunteerName}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span className="font-medium">Estimated Arrival:</span>
              <span className="font-mono font-bold text-orange-600 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {activeMission.etaMinutes} mins
              </span>
            </div>
          </div>

          {/* Action Button: Track Rescue & GPS simulator toggle */}
          <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center gap-2">
            <button
              onClick={() => {
                if (onTrackRescueClick) onTrackRescueClick();
                else setActiveScreen('live-tracking');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl shadow-xs transition cursor-pointer"
            >
              <span>Track Rescue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsSimulatingGps(!isSimulatingGps)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                isSimulatingGps 
                  ? 'bg-orange-50 border-orange-300 text-orange-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title={isSimulatingGps ? 'Pause GPS movement' : 'Simulate GPS movement'}
            >
              {isSimulatingGps ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
            </button>
          </div>
        </div>
      )}

      {/* Selected Marker Quick Info Modal / Toast */}
      {selectedPinInfo && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-20 glass-panel rounded-xl p-3.5 shadow-xl border border-slate-200 animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {selectedPinInfo.type === 'donor' ? '🟢 Food Donor' : selectedPinInfo.type === 'shelter' ? '🔵 Shelter / NGO' : '🟠 Volunteer Driver'}
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{selectedPinInfo.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5">{selectedPinInfo.subtitle}</p>
              <p className="text-[11px] text-slate-500 mt-1">{selectedPinInfo.detail}</p>
            </div>
            <button
              onClick={() => setSelectedPinInfo(null)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
            >
              ×
            </button>
          </div>

          {selectedPinInfo.action && selectedPinInfo.actionText && (
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  selectedPinInfo.action?.();
                  setSelectedPinInfo(null);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
              >
                <span>{selectedPinInfo.actionText}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
