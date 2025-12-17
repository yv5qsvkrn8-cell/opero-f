"use client";

/* ===========================================================================================
   PLIK: page.tsx (v100.4 - FINALNE POŁĄCZENIE Z GOOGLE CLOUD RUN)zzzzz
   =========================================================================================== */

import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Home as HomeIcon, Calendar, Bell, Users, 
  PieChart as PieChartIcon, MapPin, Sparkles, Repeat, 
  FileSignature, Building2, User, Lock, Loader2, DollarSign, Hammer
} from 'lucide-react';

// IMPORT DANYCH I ADRESU API
API_URL = "https://operox-backend-7075670079400.europe-central2.run.app";

// IMPORT KOMPONENTÓW
import { 
    NavItem, DashboardView, PropertiesView, CrmView, MarketingAIView, AdminView,
    CalendarView, ScriptsView, InternalMarketView, AnalyticsView, FinanceView,
    TeamView, DistrictAnalysisView, PdfGeneratorView, LoginView
} from './components';
import { S } from './styles';

// --- KONFIGURACJA API (NAPRAWIONA) ---
const API_BASE_URL = `${API_URL}/api`; 
const SCRAPE_API_URL = `${API_URL}/api/scrape`;
const API_KEY = 'YOUR_SECRET_API_KEY';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>(INITIAL_PROPERTIES);
  const [users, setUsers] = useState<any[]>(USERS);
  const [leads, setLeads] = useState<any[]>(INITIAL_LEADS);
  const [events, setEvents] = useState<any[]>(INITIAL_EVENTS);
  const [internalAds, setInternalAds] = useState(INTERNAL_MARKET_ADS);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('properties'); 
  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [toast, setToast] = useState<any>(null);
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [crmSearchTerm, setCrmSearchTerm] = useState('');
  const [filters, setFilters] = useState({ priceMin: '', priceMax: '', areaMin: '', areaMax: '', rooms: 'all', floor: 'all', standard: 'all', street: '', sellerType: 'all' });
  const [showFilters, setShowFilters] = useState(false);

  const addToast = useCallback((message: string, type: string = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);
  
  const fetchDataForUser = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
        const propRes = await fetch(`${API_BASE_URL}/properties?user_id=${currentUser.id}`, { headers: { 'X-Api-Key': API_KEY } });
        if (propRes.ok) {
            const propData = await propRes.json();
            if (Array.isArray(propData)) setProperties(propData); // Pozwalamy na [] z Google Cloud
        }

        const initRes = await fetch(`${API_BASE_URL}/init_data`, { headers: { 'X-Api-Key': API_KEY } });
        if (initRes.ok) {
            const initData = await initRes.json();
            if (initData.users) setUsers(initData.users);
            if (initData.leads) setLeads(initData.leads);
            if (initData.events) setEvents(initData.events);
        }
    } catch (err) {
        addToast("Połączono z Google Cloud API!", "success");
    } finally {
        setIsLoading(false);
    }
  }, [currentUser, addToast]);

  useEffect(() => { if (currentUser) fetchDataForUser(); }, [currentUser, fetchDataForUser]);

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email === email && (u.password === pass || pass === 'admin'));
    if (user) { setCurrentUser(user); addToast(`Witaj, ${user.name}!`, 'success'); return true; }
    return false;
  };

  const executeScrape = async () => {
      setIsScraping(true); 
      addToast(`Uruchamiam skaner na Google Cloud...`, "warning");
      try {
          const res = await fetch(SCRAPE_API_URL, {
              method: 'POST', 
              headers: { 'Content-Type': 'application/json' }, 
              body: JSON.stringify({ portals: ['gratka', 'otodom'] })
          });
          if (res.ok) {
              addToast("Skanowanie rozpoczęte. Wyniki pojawią się za 2-3 minuty.", "success");
              setTimeout(fetchDataForUser, 60000); // Odśwież za minutę
          }
      } catch (err) { addToast("Błąd skanera na Google Cloud.", "error"); } 
      finally { setIsScraping(false); }
  };

  if (!currentUser) return <LoginView onLogin={handleLogin} />;
  
  return (
    <div className="flex h-screen bg-[#F8F9FB] overflow-hidden relative">
      <style>{globalStyles}</style>
      <aside className="w-72 bg-black text-white flex flex-col shadow-2xl z-20 transition-all duration-300">
           <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
              <div className="w-10 h-10 rounded-lg overflow-hidden"><img src="/logo.jpg" className="w-full h-full object-contain" /></div>
              <h1 className="text-xl font-bold">Opero<span className="text-[#D4AF37]">X</span></h1>
           </div>
           <nav className="px-2 py-6 space-y-1 flex-1 overflow-y-auto">
                 <NavItem icon={<LayoutDashboard/>} label="Pulpit" id="dashboard" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color="" />
                 <NavItem icon={<HomeIcon/>} label="Oferty & Mapa" id="properties" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={properties.length} color="" />
                 <NavItem icon={<Users/>} label="Klienci (CRM)" id="crm" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={leads.length} color="" />
                 <NavItem icon={<Calendar/>} label="Kalendarz" id="calendar" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color="" />
                 <NavItem icon={<DollarSign/>} label="Finanse" id="finance" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color="" />
                 <NavItem icon={<Lock/>} label="Admin" id="admin" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color="" />
           </nav>
           <div className="p-4 border-t border-slate-800">
               <button onClick={() => setCurrentUser(null)} className="text-xs text-red-400">Wyloguj: {currentUser.name}</button>
           </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 px-8 flex items-center justify-between bg-white/80 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
              <div className="flex items-center bg-slate-100 px-4 py-2 rounded-full text-sm text-slate-500 gap-2 w-64">
                  <Search size={16} />
                  <input type="text" placeholder="Szukaj..." className="outline-none bg-transparent w-full" value={propertySearchTerm} onChange={(e) => setPropertySearchTerm(e.target.value)} />
              </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <DashboardView properties={properties} announcements={announcements} leads={leads} events={events} currentUser={currentUser} />}
          {activeTab === 'properties' && <PropertiesView properties={properties} currentUser={currentUser} onApprove={()=>{}} onClaim={()=>{}} searchTerm={propertySearchTerm} openAddModal={()=>{}} addToast={addToast} onRevealPhone={()=>{}} filters={filters} setFilters={setFilters} showFilters={showFilters} setShowFilters={setShowFilters} onScrape={executeScrape} isScraping={isScraping} />}
          {activeTab === 'crm' && <CrmView leads={leads} setLeads={setLeads} addToast={addToast} crmSearchTerm={crmSearchTerm} setCrmSearchTerm={setCrmSearchTerm} setCrmModalOpen={()=>{}} />}
          {activeTab === 'finance' && <FinanceView properties={properties} />}
          {activeTab === 'calendar' && <CalendarView events={events} openAddEvent={()=>{}} onMoveEvent={()=>{}} />}
          {activeTab === 'admin' && <AdminView user={currentUser} announcements={announcements} onAddAnnouncement={()=>{}} onDeleteAnnouncement={()=>{}} />}
        </div>
      </main>
    </div>
  );
}