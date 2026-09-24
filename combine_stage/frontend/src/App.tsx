import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { JudgeTourBanner } from './components/JudgeTourBanner';
import { StorylinePipeline } from './components/StorylinePipeline';
import { LandingPage } from './components/LandingPage';
import { MainDashboard } from './components/MainDashboard';
import { DonorDashboard } from './components/DonorDashboard';
import { NgoDashboard } from './components/NgoDashboard';
import { SmartMatchView } from './components/SmartMatchView';
import { VolunteerMobileView } from './components/VolunteerMobileView';
import { LiveTrackingView } from './components/LiveTrackingView';
import { AnalyticsView } from './components/AnalyticsView';
import { AddDonationModal } from './components/AddDonationModal';
import { CreateRequestModal } from './components/CreateRequestModal';
import { NotificationsCenter } from './components/NotificationsCenter';
import { Toast } from './components/Toast';
import { getCurrentUser, setAuthToken, signIn, signUp, type AppRole, type SignedInUser } from './services/api';

const AuthScreen: React.FC<{ onSignedIn: (user: SignedInUser) => void }> = ({ onSignedIn }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<Exclude<AppRole, 'admin'>>('donor');
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setBusy(true); setError(''); try { const result = mode === 'login' ? await signIn(email, password) : await signUp(name, email, password, role); setAuthToken(result.token); onSignedIn(result.user); } catch (e) { setError(e instanceof Error ? e.message : 'Could not sign in'); } finally { setBusy(false); } };
  return <main className="min-h-screen bg-slate-50 grid place-items-center p-4"><form onSubmit={submit} className="w-full max-w-md bg-white border rounded-2xl shadow p-7 space-y-4"><h1 className="text-2xl font-bold">Surplus-to-Shelter</h1><p className="text-sm text-slate-600">{mode === 'login' ? 'Sign in to continue' : 'Create a donor, NGO or volunteer account'}</p>{mode === 'register' && <><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full border rounded-lg p-3"/><select value={role} onChange={e=>setRole(e.target.value as Exclude<AppRole,'admin'>)} className="w-full border rounded-lg p-3"><option value="donor">Donor</option><option value="ngo">NGO</option><option value="volunteer">Volunteer</option></select></>}<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-lg p-3"/><input required minLength={mode==='register'?12:1} type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-lg p-3"/>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={busy} className="w-full bg-emerald-700 text-white rounded-lg p-3 font-semibold">{busy?'Please wait…':mode==='login'?'Sign in':'Create account'}</button><button type="button" onClick={()=>{setMode(mode==='login'?'register':'login');setError('')}} className="text-sm text-emerald-800">{mode==='login'?'New here? Create account':'Already registered? Sign in'}</button></form></main>;
};

const AppContent: React.FC = () => {
  const { activeScreen } = useApp();

  const [isAddDonationOpen, setIsAddDonationOpen] = useState(false);
  const [isCreateRequestOpen, setIsCreateRequestOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* 1. Hackathon Judge Pitch Banner */}
      <JudgeTourBanner />

      {/* 2. Global Top Navbar */}
      <Navbar 
        onOpenAddModal={() => setIsAddDonationOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* 3. 9-Stage Storyline Pipeline Bar (Rule 13) */}
      {activeScreen !== 'landing' && <StorylinePipeline />}

      {/* 4. Active Screen Router */}
      <main className="flex-1 flex flex-col">
        {activeScreen === 'landing' && (
          <LandingPage 
            onOpenAddModal={() => setIsAddDonationOpen(true)}
            onOpenCreateRequestModal={() => setIsCreateRequestOpen(true)}
          />
        )}

        {activeScreen === 'dashboard' && (
          <MainDashboard 
            onOpenAddDonationModal={() => setIsAddDonationOpen(true)}
            onOpenCreateRequestModal={() => setIsCreateRequestOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}

        {activeScreen === 'donations' && (
          <DonorDashboard 
            onOpenAddModal={() => setIsAddDonationOpen(true)}
          />
        )}

        {activeScreen === 'requests' && (
          <NgoDashboard 
            onOpenCreateRequestModal={() => setIsCreateRequestOpen(true)}
          />
        )}

        {activeScreen === 'smart-match' && (
          <SmartMatchView />
        )}

        {activeScreen === 'volunteer-mobile' && (
          <VolunteerMobileView />
        )}

        {activeScreen === 'live-tracking' && (
          <LiveTrackingView />
        )}

        {activeScreen === 'analytics' && (
          <AnalyticsView />
        )}
      </main>

      {/* 5. Modals & Drawers */}
      <AddDonationModal 
        isOpen={isAddDonationOpen}
        onClose={() => setIsAddDonationOpen(false)}
      />

      <CreateRequestModal 
        isOpen={isCreateRequestOpen}
        onClose={() => setIsCreateRequestOpen(false)}
      />

      <NotificationsCenter 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      {/* 6. Reactive System Toast */}
      <Toast />

    </div>
  );
};

export function App() {
  const [user, setUser] = useState<SignedInUser | null>(null); const [checking, setChecking] = useState(true);
  useEffect(() => { getCurrentUser().then(setUser).catch(() => setAuthToken(null)).finally(() => setChecking(false)); }, []);
  if (checking) return <div className="min-h-screen grid place-items-center">Connecting…</div>;
  if (!user) return <AuthScreen onSignedIn={setUser} />;
  return <AppProvider authenticatedRole={user.role}><AppContent /></AppProvider>;
}

export default App;
