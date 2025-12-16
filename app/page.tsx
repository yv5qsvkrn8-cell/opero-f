"use client";

/* ===========================================================================================
   PLIK: page.tsx (v100.3 - OSTATECZNE OMIJANI BŁĘDU STARTOWEGO)
   =========================================================================================== */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  LayoutDashboard, Home as HomeIcon, Calendar, MessageSquare, Shield, Search, Bell, Users, 
  PieChart as PieChartIcon, Calculator, Check, AlertCircle, Sparkles, Repeat, 
  ChevronLeft, ChevronRight, X, ImageIcon, Briefcase, Camera, MapPin, Plus, CheckSquare, TrendingUp,
  Link as LinkIcon, Download, Stamp, Loader2, Printer, Mail, Lock, ArrowRight, RefreshCw, CircleAlert, FileSignature, Building2, User,
  DownloadCloud, Info, DollarSign, Hammer, ArrowUpRight
} from 'lucide-react';

// IMPORT ZMIENIONYCH DANYCH ZE STORE
import { USERS, INITIAL_PROPERTIES, INITIAL_LEADS, INTERNAL_MARKET_ADS, globalStyles, DISTRICTS_DATA, INITIAL_EVENTS, FINISHING_STANDARDS } from './store';

// IMPORT KOMPONENTÓW
import { 
    NavItem, DashboardView, PropertiesView, CrmView, MarketingAIView, AdminView,
    CalendarView, ScriptsView, InternalMarketView, AnalyticsView, FinanceView,
    OnboardingTour, TeamView, DistrictAnalysisView, PdfGeneratorView, MailView, LoginView
} from './components';
import { S } from './styles'; // Zakładamy import S ze styles.js

// TYPY (Uproszczone do celów demonstracyjnych)
type User = { id: number; email: string; name: string; role: string; password?: string; avatar: string }; 
type Property = { id: number; title: string; price: number; area: number; status: string; user_id?: number; approvalStatus?: string; phone?: string; revealedPhone?: boolean; };
type Lead = { id: number; name: string; source: string; type: string; status: string; revealed: boolean; phone: string; };
type Event = { id: number; title: string; day: number; time: string; }; 
type Announcement = { id: number; text: string; priority: 'urgent' | 'normal'; author: string; }; 

// PORT BACKENDOWY (Render)
const API_BASE_URL = 'https://operox-backend.onrender.com/api'; 
const SCRAPE_API_URL = 'https://operox-backend.onrender.com/api/scrape_data'; 
const API_KEY = 'YOUR_SECRET_API_KEY'; 

// --- STATE UI I FORMS (Rozdzielone) ---

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Inicjalizacja DANYMI TESTOWYMI (Zabezpieczenie przed pustą bazą)
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES as any);
  const [users, setUsers] = useState<User[]>(USERS as any);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS as any);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS as any);

  const [internalAds, setInternalAds] = useState(INTERNAL_MARKET_ADS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // *** KLUCZOWA ZMIANA: WYMUSZAMY START NA WIDOKU 'properties' ***
  const [activeTab, setActiveTab] = useState('properties'); 

  const [isLoading, setIsLoading] = useState(false);
  const [isScraping, setIsScraping] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [crmModalOpen, setCrmModalOpen] = useState(false);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  
  const [crmSearchTerm, setCrmSearchTerm] = useState('');
  const [propertySearchTerm, setPropertySearchTerm] = useState('');
  const [filters, setFilters] = useState({ 
      priceMin: '', priceMax: '', areaMin: '', areaMax: '', rooms: 'all', floor: 'all', standard: 'all',
      street: '', sellerType: 'all' 
  });
  const [showFilters, setShowFilters] = useState(false);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);
  
  // --- FUNKCJA POBIERANIA DANYCH (ZABEZPIECZONA) ---
  const fetchDataForUser = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);

    try {
        // 1. POBIERANIE WŁAŚCIWOŚCI
        const propRes = await fetch(`${API_BASE_URL}/properties?user_id=${currentUser.id || ''}`, {
            headers: { 'X-Api-Key': API_KEY } 
        });
        let propData: Property[] = [];
        if (propRes.ok) { propData = await propRes.json(); }
        
        // ZABEZPIECZENIE PROPERTIES: Aktualizuj tylko jeśli są poprawne i niepuste dane z API
        if (Array.isArray(propData) && propData.length > 0) {
            setProperties(propData);
        } else {
             // Jeśli API puste, zostawiamy dane testowe z INITIAL_PROPERTIES (które są w useState)
        }


        // 2. POBIERANIE DANYCH INICJALNYCH (Users, Leads, Events)
        const initRes = await fetch(`${API_BASE_URL}/init_data`, {
            headers: { 'X-Api-Key': API_KEY }
        });
        const initData = await initRes.json();
        
        // Aktualizacja USERS (z fallbackiem)
        if (initData.users && Array.isArray(initData.users) && initData.users.length > 0) setUsers(initData.users);

        // Aktualizacja LEADS:
        if (Array.isArray(initData.leads) && initData.leads.length > 0) setLeads(initData.leads);
        
        // Aktualizacja EVENTS:
        if (Array.isArray(initData.events) && initData.events.length > 0) setEvents(initData.events);

        // Wczytanie ogłoszeń (jeśli są)
        if (initData.announcements) setAnnouncements(initData.announcements);


    } catch (err) {
        console.error("Błąd pobierania danych:", err);
        addToast("Błąd połączenia z API. Działanie na danych lokalnych (store.js).", "error");
    } finally {
        setIsLoading(false);
    }
  }, [currentUser, addToast]);


  // --- 2. HAKI EFEKTÓW ---

  useEffect(() => {
    if (currentUser) {
      fetchDataForUser();
    }
  }, [currentUser, fetchDataForUser]);


  // --- 3. LOGIKA APLIKACJI (HANDLE FUNCTIONS) ---
  
  const handleLogin = (email: string, password_candidate: string) => {
    const user = users.find(u => u.email === email && u.password === password_candidate);

    if (user) {
        setCurrentUser(user);
        addToast(`Witaj, ${user.name}!`, 'success');
        return true;
    } 
    // Awaryjne logowanie na "admin" (jeśli pominięto hasło w store.js)
    else if (password_candidate === 'admin' && users.some(u => u.email === email && u.role === 'CEO')) {
        const adminUser = users.find(u => u.email === email) || users.find(u => u.role === 'CEO');
        if (adminUser) {
            setCurrentUser(adminUser);
            addToast(`Witaj, ${adminUser.name} (Admin)!`, 'warning');
            return true;
        }
    }
    return false;
  };

  const handleLogout = () => {
      setCurrentUser(null);
      setActiveTab('dashboard');
      addToast('Wylogowano pomyślnie!', 'info');
  };

  const handleAddProperty = (newProperty: Property) => {
    setProperties(prev => [...prev, newProperty]);
    setPropertyModalOpen(false);
    addToast('Nieruchomość dodana lokalnie! Użyj Importu do synchronizacji.', 'success');
  };
  
  const handleClaimProperty = async (propertyId: number) => {
      if (!currentUser) return;
      
      setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, user_id: currentUser.id, approvalStatus: 'approved' } : p));
      
      try {
          await fetch(`${API_BASE_URL}/properties/${propertyId}/claim`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: currentUser.id })
          });
          addToast(`Lead ID ${propertyId} przejęty!`, 'success');
          fetchDataForUser();
      } catch {
          addToast("Zapisano lokalnie, błąd serwera przy przejmowaniu.", "warning");
      }
  };


  const handleMoveEvent = async (id: number, day: number) => { 
      setEvents(prev => prev.map(e => e.id===id ? {...e, day} : e)); 
      addToast("Wydarzenie przeniesione (zmiana lokalna).", "info");
  };

  const handleApproveProperty = (propertyId: number) => {
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, approvalStatus: 'approved' } : p));
    addToast('Oferta zaakceptowana!', 'success');
  };

  const handleRevealPhone = async (propertyId: number, offerUrl: string) => {
    if (properties.find(p => p.id === propertyId)?.revealedPhone) return;

    try {
        setIsScraping(true);
        addToast("Próbuję pobrać numer...", "info");
        const res = await fetch(`${API_BASE_URL}/reveal-phone`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: offerUrl })
        });
        const data = await res.json();
        if (data.phone) {
            setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, phone: data.phone, revealedPhone: true } : p));
            addToast(`Numer: ${data.phone}`, "success");
            return data.phone;
        }
    } catch {
        addToast("Nie udało się pobrać numeru.", "error");
    } finally {
        setIsScraping(false);
    }
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, revealedPhone: true } : p));
    return null;
  };

  const executeScrape = async () => {
      setIsScraping(true); 
      addToast(`Rozpoczynam Import! (Render Standard RAM: OK)`, "warning");

      try {
          const res = await fetch(SCRAPE_API_URL, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portals: ['otodom', 'olx'] })
          });
          
          if (!res.ok) throw new Error("Błąd sieci lub skrapera");
          
          const newLeads = await res.json(); 
          fetchDataForUser();
          addToast(`Znaleziono ${newLeads.length} nowych ofert!`, "success");
      } catch (err) { 
          addToast("Błąd scrapera. Sprawdź logi Backendu.", "error"); 
      } finally { 
          setIsScraping(false); 
      }
  };

  const handleAddEmployee = (newEmp: any) => {
    setUsers(prev => [...prev, newEmp]);
    addToast('Pracownik dodany (tylko lokalnie)', 'success');
    setEmployeeModalOpen(false);
  };

  const handleAddLead = (newLead: any) => {
    setLeads(prev => [...prev, newLead]);
    addToast('Klient dodany (tylko lokalnie)', 'success');
    setCrmModalOpen(false);
  };

  const handleAddEvent = (newEvent: Event) => {
    setEvents(prev => [...prev, newEvent]);
    addToast('Wydarzenie dodane (tylko lokalnie)', 'success');
    setEventModalOpen(false);
  };

  const handleAddAnnouncement = (text: string, priority: 'urgent' | 'normal') => {
    setAnnouncements(prev => [{ id: Date.now(), text, priority, author: currentUser?.name || 'Admin' } as Announcement, ...prev]);
    addToast('Komunikat wysłany!', 'success');
    setAnnouncementModalOpen(false);
  };
  
  const handleDeleteAnnouncement = (id: number) => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      addToast('Komunikat usunięty.', 'info');
  };
  
  const handleAddWatermark = () => { addToast("Logo dodane (Symulacja)", "success"); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (data: any) => void, data: any) => { 
      const f = e.target.files?.[0]; 
      if(f){ 
          const r = new FileReader(); 
          r.onload=()=>setter({...data, [e.target.name==='avatar'?'avatar':'image']: r.result as string}); 
          r.readAsDataURL(f); 
      }
  };
  const handleImportFromLink = () => { addToast("Funkcja w budowie (backend required).", "info"); };

  // --- MODAL DATA (Uproszczone Formularze dla ModalComponent z components.js) ---
  const [newPropertyData, setNewPropertyData] = useState<any>({});
  const [newClientData, setNewClientData] = useState<any>({});
  const [newEventData, setNewEventData] = useState<any>({});
  const [newEmployeeData, setNewEmployeeData] = useState<any>({});


  // Ekran ładowania
  if (isLoading && !currentUser) {
    return (
        <div className={S.login.wrapper}>
            <div className={S.layout.flexCenter + " h-screen w-full"}>
                <Loader2 className="animate-spin text-[#D4AF37]" size={48} />
                <p className="ml-4 text-white text-xl">Ładowanie danych...</p>
            </div>
        </div>
    );
  }

  // Ekran logowania
  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }
  
  // Główny Dashboard
  return (
    <div className="flex h-screen bg-[#F8F9FB] font-sans text-slate-800 overflow-hidden relative">
      <style>{globalStyles}</style>
      
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Sidebar */}
      <aside className={`w-72 bg-black text-white flex flex-col justify-between shadow-2xl z-20 flex-shrink-0 transition-all duration-300`}>
           <div className="overflow-y-auto scrollbar-hide">
              <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img src="/logo.jpg" alt="OperoX Logo" className="w-full h-full object-contain" />
                  </div>
                  <h1 className="text-xl font-serif font-bold tracking-wide text-white">
                       Opero<span className="text-[#D4AF37]">X</span>
                  </h1>
              </div>
            
              <nav className="px-2 py-6 space-y-1">
                 <NavItem icon={LayoutDashboard} label="Pulpit" id="dashboard" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 <NavItem icon={HomeIcon} label="Oferty & Mapa" id="properties" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={properties.filter(p => p.approvalStatus === 'new_lead').length} color={null} />
                 <NavItem icon={Users} label="Klienci (CRM)" id="crm" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={leads.filter(l => l.status === 'new').length} color={null} />
                 <NavItem icon={Calendar} label="Kalendarz" id="calendar" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={events.length} color={null} />
                 <NavItem icon={PieChartIcon} label="Analityka" id="analytics" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 <NavItem icon={MapPin} label="Dzielnice" id="districts" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 <NavItem icon={DollarSign} label="Finanse" id="finance" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 <NavItem icon={Sparkles} label="Marketing AI" id="marketing" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 <NavItem icon={FileSignature} label="PDF Generator" id="pdf_generator" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 <NavItem icon={Hammer} label="Scripts" id="scripts" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 <NavItem icon={Repeat} label="Giełda Off-Market" id="internal_market" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={internalAds.length} color={null} />
                 <NavItem icon={User} label="Zespół HR" id="team" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={0} color={null} />
                 {currentUser.role === 'CEO' && <NavItem icon={Lock} label="Admin Panel" id="admin" activeTab={activeTab} setTab={setActiveTab} collapsed={false} badge={announcements.length} color={null} />}
              </nav>
            </div>
   
           <div className="p-4 bg-black border-t border-slate-800 flex flex-col gap-4">
               <div className="flex flex-col gap-2">
                   <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentUser.role === 'CEO' ? 'bg-amber-600' : 'bg-slate-700'} overflow-hidden`}>
                           {currentUser.avatar.length > 2 ? <img src={currentUser.avatar} className="w-full h-full object-cover" alt="User Avatar" /> : currentUser.avatar}
                       </div>
                       <div>
                           <p className="text-sm font-bold truncate w-32">{currentUser.name}</p>
                           <p className="text-[10px] text-amber-500">{currentUser.role}</p>
                       </div>
                   </div>
                   <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-1">Wyloguj się</button>
               </div>
           </div>
        </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10">
          <h2 className="text-2xl font-serif font-bold text-slate-900 capitalize">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('_', ' ')}</h2>
          <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-500 gap-2 focus-within:ring-2 ring-amber-500 transition-all w-64">
                  <Search size={16} />
                  <input type="text" placeholder="Szukaj..." className="outline-none w-full bg-transparent" value={propertySearchTerm} onChange={(e) => setPropertySearchTerm(e.target.value)} />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-amber-600 transition" onClick={() => addToast("Brak nowych powiadomień. Stan systemu: OK.", "info")}><Bell size={24} />{announcements.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>}</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FB]">
          {/* Używamy tutaj zabezpieczonych danych state'u */}
          {activeTab === 'dashboard' && <DashboardView properties={properties} announcements={announcements} leads={leads} events={events} currentUser={currentUser} />}
          
          {activeTab === 'properties' && <PropertiesView 
              properties={properties} 
              currentUser={currentUser} 
              onApprove={handleApproveProperty} 
              onClaim={handleClaimProperty}
              searchTerm={propertySearchTerm} 
              openAddModal={() => setPropertyModalOpen(true)} 
              addToast={addToast} 
              onRevealPhone={handleRevealPhone}
              filters={filters} 
              setFilters={setFilters} 
              showFilters={showFilters} 
              setShowFilters={setShowFilters} 
              onScrape={executeScrape} // Uruchomienie skrapera
              isScraping={isScraping}
          />}
          {activeTab === 'crm' && <CrmView leads={leads} setLeads={setLeads} addToast={addToast} crmSearchTerm={crmSearchTerm} setCrmSearchTerm={setCrmSearchTerm} setCrmModalOpen={setCrmModalOpen} />}
          {activeTab === 'mail' && <MailView currentUser={currentUser} />}
          {activeTab === 'pdf_generator' && <PdfGeneratorView properties={properties} users={users} currentUser={currentUser} />}
          {activeTab === 'team' && <TeamView users={users} openAddModal={() => setEmployeeModalOpen(true)} currentUser={currentUser} />}
          {activeTab === 'districts' && <DistrictAnalysisView />}
          {activeTab === 'finance' && <FinanceView properties={properties} />}
          {activeTab === 'calendar' && <CalendarView events={events} openAddEvent={() => setEventModalOpen(true)} onMoveEvent={handleMoveEvent} />}
          {activeTab === 'marketing' && <MarketingAIView properties={properties} />}
          {activeTab === 'scripts' && <ScriptsView />}
          {activeTab === 'internal_market' && <InternalMarketView ads={internalAds} setAds={setInternalAds} user={currentUser} addToast={addToast} />}
          {activeTab === 'admin' && <AdminView user={currentUser} announcements={announcements as any} onAddAnnouncement={handleAddAnnouncement} onDeleteAnnouncement={handleDeleteAnnouncement} />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </div>
      </main>

      {/* --- MODALE --- */}

      {/* Wszystkie modale (AdPropertyModal, AddEventModal, AddEmployeeModal, AddLeadModal, AddAnnouncementModal) muszą być zdefiniowane w components.js */}
      <AddPropertyModal isOpen={propertyModalOpen} onClose={() => setPropertyModalOpen(false)} onSave={handleAddProperty} users={users as any} addToast={addToast} />
      <AddEventModal isOpen={eventModalOpen} onClose={() => setEventModalOpen(false)} onSave={handleAddEvent} currentUser={currentUser} addToast={addToast} />
      <AddEmployeeModal isOpen={employeeModalOpen} onClose={() => setEmployeeModalOpen(false)} onSave={handleAddEmployee} addToast={addToast} />
      <AddLeadModal isOpen={crmModalOpen} onClose={() => setCrmModalOpen(false)} onSave={handleAddLead} addToast={addToast} currentUser={currentUser} />
      <AddAnnouncementModal isOpen={announcementModalOpen} onClose={() => setAnnouncementModalOpen(false)} onSave={handleAddAnnouncement} addToast={addToast} />
      
      {/* Toast Render (zakładamy, że jest w components.js) */}
      {/* Wymagane, aby dodać komponent Toast do components.js */}
      {/* Toast jest renderowany na górze komponentu */}

    </div>
  );
}