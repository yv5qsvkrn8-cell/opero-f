"use client";

/* ==========================================================================================
   PLIK: page.tsx (v95.0 - WERSJA NAPRAWIONA - TYPESCRIPT FIX)
   ========================================================================================== */

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, Home, Calendar, MessageSquare, Shield, Search, Bell, Users, 
  PieChart as PieChartIcon, Calculator, Check, AlertCircle, Sparkles, Repeat, 
  ChevronLeft, ChevronRight, X, ImageIcon, Briefcase, Camera, MapPin, Plus, CheckSquare, TrendingUp,
  Link as LinkIcon, Download, Stamp, Loader2, Printer, Mail, Lock, ArrowRight, RefreshCw, CircleAlert, FileSignature, Building2, User,
  DownloadCloud
} from 'lucide-react';

// IMPORT ZMIENIONYCH DANYCH ZE STORE
import { USERS, INITIAL_PROPERTIES, INITIAL_LEADS, INTERNAL_MARKET_ADS, globalStyles, DISTRICTS_DATA, INITIAL_EVENTS, FINISHING_STANDARDS } from './store';

// IMPORT KOMPONENTÓW
import { 
    NavItem, DashboardView, PropertiesView, CrmView, MarketingAIView, AdminView,
    CalendarView, ScriptsView, InternalMarketView, AnalyticsView, FinanceView,
    OnboardingTour, TeamView, DistrictAnalysisView, PdfGeneratorView, MailView, LoginView
} from './components';

// PORT BACKENDOWY (Render)
const API_BASE_URL = 'https://operox-backend.onrender.com/api'; 
const SCRAPE_API_URL = 'https://operox-backend.onrender.com/api/scrape';

// --- DEFINICJA DOSTĘPNYCH PORTALI ---
const AVAILABLE_PORTALS = [
  { id: 'otodom', label: 'Otodom', color: 'bg-green-100 text-green-700 border-green-200' },
  { id: 'olx', label: 'OLX', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { id: 'trojmiasto', label: 'Trojmiasto.pl', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { id: 'gratka', label: 'Gratka', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'morizon', label: 'Morizon', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'nieruchomosci_online', label: 'Nieruchomosci-online', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'sprzedajemy', label: 'Sprzedajemy.pl', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { id: 'adresowo', label: 'Adresowo', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }
];

// NOWA ZMIENNA: Logo i Nazwa
const BRAND_NAME = 'OperoX'; 
const BRAND_LOGO_URL = '/logo.png'; 

export default function EstateProUnified() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [users, setUsers] = useState(USERS);
  // FIX: Dodano <any> aby uniknąć błędu 'currentUser possibly null'
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // --- DANE Z BAZY ---
  // FIX: Dodano <any[]> aby uniknąć błędu 'never[]'
  const [properties, setProperties] = useState<any[]>([]); 
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  
  // Dane lokalne
  // FIX: Dodano <any[]>
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [internalAds, setInternalAds] = useState(INTERNAL_MARKET_ADS);

  // --- STATE UI ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // FIX: Dodano <any[]> (to już miałeś, ale zostawiam dla pewności)
  const [toasts, setToasts] = useState<any[]>([]);
  const [isScraping, setIsScraping] = useState(false);

  // --- STANY DLA MODALI ---
  const [isScrapeModalOpen, setScrapeModalOpen] = useState(false);
  const [selectedPortals, setSelectedPortals] = useState(AVAILABLE_PORTALS.map(p => p.id));
  const [isPropertyModalOpen, setPropertyModalOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false); 
  const [isCrmModalOpen, setCrmModalOpen] = useState(false);
  
  // --- IMPORT DANYCH ---
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [crmSearchTerm, setCrmSearchTerm] = useState('');

  // --- FORMULARZE ---
  const [newPropertyData, setNewPropertyData] = useState({ 
      title: '', price: '', currency: 'PLN', area: '', rooms: '', floor: '', totalFloors: '', year: '', 
      city: 'Gdańsk', district: '', street: '', apartmentNumber: '',
      marketType: 'secondary', buildingType: 'block', 
      formOfOwnership: 'full', heating: 'city', desc: '', image: null as any,
      balcony: false, terrace: false, garden: false, elevator: false, parking: false, ac: false, monitoring: false,
      standard: 'refresh',
      sellerType: 'agency', 
      clientId: '', contractType: 'open', contractDuration: '12 miesięcy', commission: '2.5'
  });

  const [newClientData, setNewClientData] = useState({
      type: 'buyer', name: '', phone: '', email: '', pesel: '', 
      source: 'Polecenie',
      status: 'new',
      budget: '', preferences: '', propertyDetails: '', priceExpectation: '', notes: ''
  });

  const [newEventData, setNewEventData] = useState({ title: '', time: '12:00', client: '', type: 'presentation', linkedPropertyId: '' });
  
  const [newEmployeeData, setNewEmployeeData] = useState({ 
      name: '', role: 'Agent', experience: '', specialization: '', avatar: null as any,
      email: '', phone: '', license: '', commission: '' 
  });
  
  const [filters, setFilters] = useState({ 
      priceMin: '', priceMax: '', areaMin: '', areaMax: '', rooms: 'all', floor: 'all', standard: 'all',
      street: '', sellerType: 'all' 
  });
  const [showFilters, setShowFilters] = useState(false);

  // --- 1. POBIERANIE DANYCH (Z UWZGLĘDNIENIEM ROLI UŻYTKOWNIKA) ---
  useEffect(() => {
      if (isAuthenticated && currentUser) {
          fetchDataForUser();
      }
  }, [isAuthenticated, currentUser]);

  const fetchDataForUser = async () => {
      try {
          // FIX: Dodano ?. aby uniknąć błędu dostępu do id
          const propRes = await fetch(`${API_BASE_URL}/properties?user_id=${currentUser?.id || ''}`);
          if (propRes.ok) {
              const propData = await propRes.json();
              setProperties(propData);
          }
          
          const initRes = await fetch(`${API_BASE_URL}/init_data`);
          const initData = await initRes.json();
          
          if(initData.users && initData.users.length > 0) setUsers(initData.users);
          if(initData.leads) setLeads(initData.leads);
          if(initData.events) setEvents(initData.events);
      } catch (err) {
          console.error("Błąd pobierania danych:", err);
          // FIX: Dodano 'as any' dla bezpieczeństwa typów
          if (properties.length === 0) setProperties(INITIAL_PROPERTIES as any);
          addToast("Tryb offline (Błąd połączenia z API)", "error");
      }
  };

  // --- HANDLERS ---
  const addToast = (msg: string, type = 'success') => {
      const id = Date.now();
      // FIX: prev jest teraz typowane jako any[], więc TypeScript nie krzyczy
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
  };

  // --- LOGIKA PORTALI ---
  // FIX: Dodano typ :any do id
  const togglePortal = (id: any) => {
    if (selectedPortals.includes(id)) {
        setSelectedPortals(selectedPortals.filter(p => p !== id));
    } else {
        setSelectedPortals([...selectedPortals, id]);
    }
  };

  const toggleAllPortals = () => {
      if (selectedPortals.length === AVAILABLE_PORTALS.length) {
          setSelectedPortals([]);
      } else {
          setSelectedPortals(AVAILABLE_PORTALS.map(p => p.id));
      }
  };

  // --- LOGIN ---
  const handleLogin = async (email: string, password: string) => {
      try {
          const res = await fetch(`${API_BASE_URL}/login_mock`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
          });
          if (res.ok) {
              const userData = await res.json();
              if (userData.password === password) {
                  setCurrentUser(userData);
                  setIsAuthenticated(true);
                  addToast(`Witaj, ${userData.name}!`);
                  return true;
              }
          }
      } catch (e) { }

      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          addToast(`Witaj, ${user.name}!`);
          return true;
      } 
      else if (password === 'admin') {
          const emergencyUser = {
              id: 999, name: "Administrator Awaryjny", role: "CEO",
              email: email || "admin@estatepro.pl", avatar: "AD", sales: 0, deals: 0
          };
          setCurrentUser(emergencyUser);
          setIsAuthenticated(true);
          addToast(`Tryb awaryjny: Witaj, ${emergencyUser.name}!`, "warning");
          return true;
      }
      return false;
  };

  const handleLogout = () => { setIsAuthenticated(false); setCurrentUser(null); setProperties([]); };

  // --- DODAWANIE PRACOWNIKA ---
  const handleAddEmployee = async () => {
      if (!newEmployeeData.name) return addToast("Wpisz imię i nazwisko!", "error");
      
      const generatedPassword = Math.random().toString(36).slice(-8) + "!";
      const newEmp = { 
          id: Date.now(), ...newEmployeeData, password: generatedPassword,
          avatar: newEmployeeData.avatar || 'XX', sales: 0, deals: 0 
      };

     setUsers([...users, newEmp as any]);
      setEmployeeModalOpen(false);
      
      try {
          await fetch(`${API_BASE_URL}/users`, {
              method: 'POST', headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(newEmp)
          });
          addToast("Pracownik dodany!", "success");
      } catch { 
          addToast("Zapisano lokalnie (błąd serwera).", "warning");
      }
  };

  // --- DODAWANIE KLIENTA ---
  const handleAddClient = async () => { 
      const newLeadId = Date.now();
      const newLead = { id: newLeadId, ...newClientData, revealed: true, status: 'new' };
      setLeads([newLead, ...leads]); 
      setCrmModalOpen(false); 
      try {
          await fetch(`${API_BASE_URL}/leads`, {
              method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({id: newLeadId, ...newClientData})
          });
          addToast(`Klient dodany!`, "success"); 
      } catch { addToast("Zapisano lokalnie (błąd serwera).", "warning"); }
  };

  // --- DODAWANIE WYDARZENIA ---
  const handleAddEvent = async () => { 
      const newEv = { id: Date.now(), ...newEventData, day: 12 }; 
      setEvents([...events, newEv]);
      setEventModalOpen(false); 
      try {
          await fetch(`${API_BASE_URL}/events`, {
              method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newEv)
          });
          addToast("Spotkanie zapisane!", "success"); 
      } catch { addToast("Zapisano lokalnie.", "warning"); }
  };
  
  const handleMoveEvent = async (id: number, day: number) => { 
      setEvents(prev => prev.map(e => e.id===id ? {...e, day} : e)); 
  };

  // --- DODAWANIE OFERTY ---
  const handleAddProperty = async () => { 
      if(!newPropertyData.title) return addToast("Wpisz tytuł!", "error");

      const propData = {
          ...newPropertyData, 
          user_id: currentUser?.id,
          price: Number(newPropertyData.price), 
          area: Number(newPropertyData.area), 
          approvalStatus: currentUser?.role==='CEO'?'approved':'pending', 
          source: 'Ręcznie'
      };
      
      const optimisticProp = { id: Date.now(), ...propData, agent_id: currentUser?.id };
      setProperties([optimisticProp, ...properties]); 
      setPropertyModalOpen(false); 
      
      try {
          const res = await fetch(`${API_BASE_URL}/properties`, {
              method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(propData)
          });
          if(res.ok) {
              const savedProp = await res.json();
              setProperties(prev => prev.map(p => p.id === optimisticProp.id ? savedProp : p));
              addToast("Oferta zapisana!", "success");
          }
      } catch { addToast("Zapisano lokalnie (błąd serwera).", "warning"); }
  };

  const approveProperty = (id: number) => { 
      setProperties(prev => prev.map(p => p.id === id ? { ...p, approvalStatus: 'approved' } : p)); 
      fetch(`${API_BASE_URL}/properties/${id}/approve`, { method: 'POST' });
      addToast("Zatwierdzono!", "success"); 
  };
  
  // --- NOWE: PRZEJMOWANIE LEADA ZE SCRAPERA ---
  // FIX: Dodano typ :any
  const handleClaimProperty = async (id: any) => {
      try {
          const res = await fetch(`${API_BASE_URL}/properties/${id}/claim`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: currentUser?.id })
          });
          
          if (res.ok) {
              addToast("Lead przejęty! Znajdziesz go w 'Moje Portfolio'.", "success");
              fetchDataForUser();
          } else {
              addToast("Nie udało się przejąć leada.", "error");
          }
      } catch {
          addToast("Błąd serwera.", "error");
      }
  };

  // --- ODBIERANIE TELEFONU ---
  const handleRevealPhone = async (id: number, offerUrl: string) => {
      if (!offerUrl || !offerUrl.startsWith('http')) {
          setProperties(prev => prev.map(p => p.id === id ? { ...p, revealedPhone: true } : p));
          return null;
      }
      try {
          const res = await fetch(`${API_BASE_URL}/reveal-phone`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: offerUrl })
          });
          const data = await res.json();
          if (data.phone) {
              setProperties(prev => prev.map(p => p.id === id ? { ...p, phone: data.phone, revealedPhone: true } : p));
              return data.phone;
          }
      } catch (e) { }
      return null;
  };

  // --- FUNKCJA MASOWEGO SCRAPINGU ---
  const executeScrape = async () => {
      if (selectedPortals.length === 0) return addToast("Wybierz przynajmniej jeden portal!", "error");
      
      setScrapeModalOpen(false); 
      setIsScraping(true); 
      addToast(`Skanowanie portali...`, "warning");

      try {
          const res = await fetch(SCRAPE_API_URL, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ portals: selectedPortals })
          });
          
          if (!res.ok) throw new Error("Błąd sieci");
          
          const newLeads = await res.json(); 
          setProperties(prev => [...newLeads, ...prev]); 
          addToast(`Znaleziono ${newLeads.length} nowych ofert!`, "success");
      } catch (err) { 
          addToast("Błąd scrapera (sprawdź backend).", "error"); 
      } finally { 
          setIsScraping(false); 
      }
  };

  const handleImportFromLink = async () => {
      if (!importUrl) return addToast("Wklej link!", "error");
      setIsImporting(true);
      setTimeout(() => {
          setIsImporting(false);
          addToast("Funkcja w budowie (backend required).", "info");
          setImportUrl('');
      }, 1000);
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
  
  const addAnnouncement = (text: string, priority: string) => { setAnnouncements([{ id: Date.now(), text, priority, author: currentUser?.name || 'Admin' }, ...announcements]); };
  const deleteAnnouncement = (id: number) => setAnnouncements(prev => prev.filter(a => a.id !== id));

  if (!isAuthenticated) return <div className="font-sans text-slate-800"><style>{globalStyles}</style><LoginView onLogin={handleLogin} /></div>;

  return (
    <div className="flex h-screen bg-[#F8F9FB] font-sans text-slate-800 overflow-hidden relative">
      <style>{globalStyles}</style>
      {showOnboarding && <OnboardingTour close={() => setShowOnboarding(false)} />}
      <div className="fixed top-5 right-5 z-[300] flex flex-col gap-2 pointer-events-none">{toasts.map(t => (<div key={t.id} className={`pointer-events-auto px-4 py-3 rounded-lg shadow-xl text-white font-bold text-sm slide-up flex items-center gap-2 ${t.type==='error'?'bg-red-500':'bg-[#0F172A]'}`}>{t.type==='error'?<CircleAlert size={16}/>:<Check size={16}/>}{t.msg}</div>))}</div>

      {/* --- MODALE --- */}

      {/* 1. MODAL: PRACOWNIK */}
      {isEmployeeModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6 border-b pb-4"><h3 className="font-bold text-lg flex items-center gap-2"><Briefcase className="text-amber-500"/> Nowy Pracownik</h3><button onClick={() => setEmployeeModalOpen(false)}><X size={20} /></button></div>
                  <div className="space-y-4">
                      <div className="flex justify-center mb-4"><div className="relative w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden"><input type="file" name="avatar" onChange={(e) => handleImageUpload(e, setNewEmployeeData, newEmployeeData)} className="absolute inset-0 opacity-0 cursor-pointer z-20" />{newEmployeeData.avatar ? <img src={newEmployeeData.avatar} className="w-full h-full object-cover" alt="Avatar Preview"/> : <Camera size={24} className="text-slate-400"/>}</div></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase">Imię i Nazwisko</label><input className="w-full p-3 border rounded-lg" value={newEmployeeData.name} onChange={e => setNewEmployeeData({...newEmployeeData, name: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 uppercase">Telefon</label><input className="w-full p-3 border rounded-lg" value={newEmployeeData.phone} onChange={e => setNewEmployeeData({...newEmployeeData, phone: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-500 uppercase">Email</label><input className="w-full p-3 border rounded-lg" value={newEmployeeData.email} onChange={e => setNewEmployeeData({...newEmployeeData, email: e.target.value})} /></div></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase">Stanowisko</label><select className="w-full p-3 border rounded-lg bg-white" value={newEmployeeData.role} onChange={e => setNewEmployeeData({...newEmployeeData, role: e.target.value})}><option value="Agent">Agent</option><option value="Manager">Manager</option></select></div>
                      <button onClick={handleAddEmployee} className="w-full py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition shadow-lg mt-2">Dodaj i Wyślij Hasło</button>
                  </div>
              </div>
          </div>
      )}

      {/* 2. MODAL: OFERTA */}
      {isPropertyModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
                  <div className="flex justify-between items-center p-6 border-b border-slate-100">
                      <div><h3 className="font-bold text-xl text-slate-800">Nowe Ogłoszenie</h3><p className="text-xs text-slate-500">Uzupełnij parametry oferty i warunki umowy</p></div>
                      <button onClick={() => setPropertyModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition"><X size={20} /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-center shadow-sm">
                          <LinkIcon className="text-blue-500 shrink-0"/>
                          <input className="flex-1 bg-white border border-blue-200 rounded-lg p-2 text-sm focus:ring-2 ring-blue-400 outline-none" placeholder="Wklej link do ogłoszenia (Otodom, OLX)..." value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />
                          <button onClick={handleImportFromLink} disabled={isImporting} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition flex items-center gap-2">{isImporting ? <Loader2 className="animate-spin" size={16}/> : <Download size={16}/>}{isImporting ? 'Pobieranie...' : 'Pobierz dane'}</button>
                      </div>

                      <div className="flex gap-6">
                          <div className="w-1/3">
                              <div className="aspect-[4/3] border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-100 hover:border-amber-400 transition relative overflow-hidden group">
                                  <input type="file" onChange={(e) => handleImageUpload(e, setNewPropertyData, newPropertyData)} className="absolute inset-0 opacity-0 cursor-pointer z-10" accept="image/*" name="image" />
                                  {newPropertyData.image ? (
                                      <><img src={newPropertyData.image} alt="Preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold gap-2">Zmień zdjęcie</div>
                                      <button onClick={(e) => { e.stopPropagation(); handleAddWatermark(); }} className="absolute bottom-2 right-2 bg-white text-slate-900 text-[10px] px-2 py-1 rounded font-bold flex items-center gap-1 shadow-lg z-20 hover:bg-amber-500"><Stamp size={10}/> Dodaj Logo</button></>
                                  ) : (<><Camera size={32} className="mb-2"/><span className="text-xs font-bold uppercase">Dodaj Foto</span></>)}
                              </div>
                          </div>
                          <div className="w-2/3 space-y-4">
                              <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tytuł ogłoszenia</label><input className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 ring-amber-500 outline-none font-bold text-lg" placeholder="np. Słoneczny apartament..." value={newPropertyData.title} onChange={e => setNewPropertyData({...newPropertyData, title: e.target.value})} /></div>
                              <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Cena (PLN)</label><input type="number" className="w-full p-3 border border-slate-200 rounded-lg font-mono" placeholder="0" value={newPropertyData.price} onChange={e => setNewPropertyData({...newPropertyData, price: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Czynsz Admin.</label><input type="number" className="w-full p-3 border border-slate-200 rounded-lg font-mono" placeholder="opcjonalne" /></div></div>
                          </div>
                      </div>

                      <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                          <h4 className="font-bold text-amber-800 mb-4 flex items-center gap-2"><FileSignature size={18}/> Warunki Umowy i Właściciel</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                  <label className="text-xs font-bold text-amber-700 uppercase block mb-1">Wybierz Właściciela (Z bazy CRM)</label>
                                  <select className="w-full p-3 border border-amber-200 rounded-lg bg-white focus:ring-2 ring-amber-500" value={newPropertyData.clientId} onChange={e => setNewPropertyData({...newPropertyData, clientId: e.target.value})}>
                                      <option value="">-- Wybierz klienta --</option>
                                      {leads.map(l => <option key={l.id} value={l.id}>{l.name} (ID: {l.id})</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-amber-700 uppercase block mb-1">Rodzaj Umowy</label>
                                  <select className="w-full p-3 border border-amber-200 rounded-lg bg-white" value={newPropertyData.contractType} onChange={e => setNewPropertyData({...newPropertyData, contractType: e.target.value})}>
                                      <option value="open">Umowa Otwarta (Zwykła)</option>
                                      <option value="exclusive">Na Wyłączność (Premium)</option>
                                  </select>
                              </div>
                          </div>
                          <div className="mb-4">
                              <label className="text-xs font-bold text-amber-700 uppercase block mb-1">Typ Sprzedawcy</label>
                              <div className="flex gap-4">
                                  <button onClick={() => setNewPropertyData({...newPropertyData, sellerType: 'agency'})} className={`flex-1 py-2 rounded border flex items-center justify-center gap-2 font-bold text-sm ${newPropertyData.sellerType === 'agency' ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-white border-slate-200 text-slate-500'}`}><Building2 size={16}/> Firma / Agencja</button>
                                  <button onClick={() => setNewPropertyData({...newPropertyData, sellerType: 'private'})} className={`flex-1 py-2 rounded border flex items-center justify-center gap-2 font-bold text-sm ${newPropertyData.sellerType === 'private' ? 'bg-green-100 border-green-500 text-green-800' : 'bg-white border-slate-200 text-slate-500'}`}><User size={16}/> Osoba Prywatna</button>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="text-xs font-bold text-amber-700 uppercase block mb-1">Prowizja (%)</label><input type="number" step="0.1" className="w-full p-3 border border-amber-200 rounded-lg" value={newPropertyData.commission} onChange={e => setNewPropertyData({...newPropertyData, commission: e.target.value})} /></div>
                              <div><label className="text-xs font-bold text-amber-700 uppercase block mb-1">Czas trwania umowy</label><input type="text" className="w-full p-3 border border-amber-200 rounded-lg" placeholder="np. 12 miesięcy" value={newPropertyData.contractDuration} onChange={e => setNewPropertyData({...newPropertyData, contractDuration: e.target.value})} /></div>
                          </div>
                      </div>

                      <div>
                          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><MapPin size={18} className="text-amber-500"/> Lokalizacja i Parametry</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                             <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Miasto</label><input type="text" className="w-full p-2.5 border rounded-lg bg-slate-50" value={newPropertyData.city} onChange={e => setNewPropertyData({...newPropertyData, city: e.target.value})} /></div>
                             <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Dzielnica</label><select className="w-full p-2.5 border rounded-lg bg-white" value={newPropertyData.district} onChange={e => setNewPropertyData({...newPropertyData, district: e.target.value})}><option value="">-- Wybierz --</option>{DISTRICTS_DATA.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}</select></div>
                             <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Ulica</label><input type="text" className="w-full p-2.5 border rounded-lg" placeholder="np. Długa" value={newPropertyData.street} onChange={e => setNewPropertyData({...newPropertyData, street: e.target.value})} /></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                             <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nr Lokalu (Poufne)</label><input type="text" className="w-full p-2.5 border border-red-100 bg-red-50 rounded-lg text-red-800" placeholder="np. 4B" value={newPropertyData.apartmentNumber} onChange={e => setNewPropertyData({...newPropertyData, apartmentNumber: e.target.value})} /></div>
                             <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Metraż (m²)</label><input type="number" className="w-full p-2.5 border rounded-lg" value={newPropertyData.area} onChange={e => setNewPropertyData({...newPropertyData, area: e.target.value})} /></div>
                             <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Pokoje</label><input type="number" className="w-full p-2.5 border rounded-lg" value={newPropertyData.rooms} onChange={e => setNewPropertyData({...newPropertyData, rooms: e.target.value})} /></div>
                             <div>
                                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Standard</label>
                                <select className="w-full p-2.5 border rounded-lg bg-white" value={newPropertyData.standard} onChange={e => setNewPropertyData({...newPropertyData, standard: e.target.value})}>
                                    {FINISHING_STANDARDS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                </select>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="flex gap-2"><div className="w-1/2"><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Piętro</label><input type="number" className="w-full p-2.5 border rounded-lg" value={newPropertyData.floor} onChange={e => setNewPropertyData({...newPropertyData, floor: e.target.value})} /></div><div className="w-1/2"><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Z</label><input type="number" className="w-full p-2.5 border rounded-lg" placeholder="max" value={newPropertyData.totalFloors} onChange={e => setNewPropertyData({...newPropertyData, totalFloors: e.target.value})} /></div></div>
                              <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Rok Budowy</label><input type="number" className="w-full p-2.5 border rounded-lg" placeholder="np. 2020" value={newPropertyData.year} onChange={e => setNewPropertyData({...newPropertyData, year: e.target.value})} /></div>
                          </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100"><h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Udogodnienia i Media</h4><div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6"><label className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition"><input type="checkbox" className="w-4 h-4 accent-amber-500" checked={newPropertyData.balcony} onChange={e => setNewPropertyData({...newPropertyData, balcony: e.target.checked})} /> <span className="text-sm font-medium">Balkon</span></label><label className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition"><input type="checkbox" className="w-4 h-4 accent-amber-500" checked={newPropertyData.garden} onChange={e => setNewPropertyData({...newPropertyData, garden: e.target.checked})} /> <span className="text-sm font-medium">Ogródek</span></label><label className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition"><input type="checkbox" className="w-4 h-4 accent-amber-500" checked={newPropertyData.terrace} onChange={e => setNewPropertyData({...newPropertyData, terrace: e.target.checked})} /> <span className="text-sm font-medium">Taras</span></label><label className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition"><input type="checkbox" className="w-4 h-4 accent-amber-500" checked={newPropertyData.elevator} onChange={e => setNewPropertyData({...newPropertyData, elevator: e.target.checked})} /> <span className="text-sm font-medium">Winda</span></label><label className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition"><input type="checkbox" className="w-4 h-4 accent-amber-500" checked={newPropertyData.parking} onChange={e => setNewPropertyData({...newPropertyData, parking: e.target.checked})} /> <span className="text-sm font-medium">Garaż/Miejsce</span></label><label className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition"><input type="checkbox" className="w-4 h-4 accent-amber-500" checked={newPropertyData.monitoring} onChange={e => setNewPropertyData({...newPropertyData, monitoring: e.target.checked})} /> <span className="text-sm font-medium">Monitoring</span></label><label className="flex items-center gap-2 cursor-pointer hover:text-amber-600 transition"><input type="checkbox" className="w-4 h-4 accent-amber-500" checked={newPropertyData.ac} onChange={e => setNewPropertyData({...newPropertyData, ac: e.target.checked})} /> <span className="text-sm font-medium">Klimatyzacja</span></label></div></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Opis nieruchomości</label><textarea className="w-full p-4 border border-slate-200 rounded-lg h-32 resize-none focus:ring-2 ring-amber-500 outline-none" placeholder="Opisz zalety, okolicę, standard wykończenia..." value={newPropertyData.desc} onChange={e => setNewPropertyData({...newPropertyData, desc: e.target.value})}></textarea><div className="flex justify-end mt-2"><button onClick={() => setNewPropertyData({...newPropertyData, desc: `✨ WYJĄTKOWA OFERTA W DZIELNICY ${newPropertyData.district || '...'} ✨\n\nZapraszamy do zapoznania się z ofertą ${newPropertyData.rooms}-pokojowego mieszkania o powierzchni ${newPropertyData.area} m².\n\nATUTY:\n- Doskonała lokalizacja\n- ${newPropertyData.balcony ? 'Przestronny balkon' : 'Funkcjonalny układ'}\n- ${newPropertyData.parking ? 'Miejsce postojowe w cenie' : 'Ogólnodostępne miejsca parkingowe'}\n\nZapraszam do kontaktu!`})} className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:underline"><Sparkles size={12}/> Generuj opis AI (Wzór)</button></div></div>
                  </div>
                  <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50 rounded-b-2xl">
                      <div className="flex gap-3 ml-auto"><button onClick={() => setPropertyModalOpen(false)} className="px-6 py-3 rounded-lg font-bold text-slate-600 hover:bg-white transition border border-transparent hover:border-slate-200">Anuluj</button><button onClick={handleAddProperty} className="px-8 py-3 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition shadow-lg shadow-amber-500/20 flex items-center gap-2"><Plus size={18}/> Dodaj Ofertę</button></div>
                  </div>
              </div>
          </div>
      )}

      {/* 3. MODAL: KLIENT CRM */}
      {isCrmModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95">
                  <div className="flex justify-between items-center p-6 border-b border-slate-100">
                      <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2"><Briefcase className="text-amber-500"/> Nowy Klient</h3>
                      <button onClick={() => setCrmModalOpen(false)}><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-8">
                      <div className="flex gap-4 mb-6"><button onClick={() => setNewClientData({...newClientData, type: 'buyer'})} className={`flex-1 py-3 rounded-lg font-bold border-2 transition flex items-center justify-center gap-2 ${newClientData.type === 'buyer' ? 'border-green-500 bg-green-50 text-green-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}><TrendingUp size={20}/> Kupujący</button><button onClick={() => setNewClientData({...newClientData, type: 'seller'})} className={`flex-1 py-3 rounded-lg font-bold border-2 transition flex items-center justify-center gap-2 ${newClientData.type === 'seller' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}><Home size={20}/> Sprzedający</button></div>
                      <div className="space-y-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-2 mb-4">Dane Kontaktowe</h4>
                          <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 block mb-1">Imię i Nazwisko *</label><input className="w-full p-3 border rounded-lg" placeholder="Jan Kowalski" value={newClientData.name} onChange={e => setNewClientData({...newClientData, name: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-500 block mb-1">Telefon *</label><input type="tel" className="w-full p-3 border rounded-lg" placeholder="500 123 456" value={newClientData.phone} onChange={e => setNewClientData({...newClientData, phone: e.target.value})} /></div></div>
                          <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 block mb-1">Email</label><input type="email" className="w-full p-3 border rounded-lg" placeholder="jan@gmail.com" value={newClientData.email} onChange={e => setNewClientData({...newClientData, email: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-500 block mb-1">PESEL</label><input type="text" className="w-full p-3 border rounded-lg" placeholder="Opcjonalnie" value={newClientData.pesel} onChange={e => setNewClientData({...newClientData, pesel: e.target.value})} /></div></div>
                          
                          <div className="mt-2">
                              <label className="text-xs font-bold text-slate-500 block mb-1">Źródło Pozyskania</label>
                              <select className="w-full p-3 border rounded-lg bg-white" value={newClientData.source} onChange={e => setNewClientData({...newClientData, source: e.target.value})}>
                                  <option value="Polecenie">Z polecenia</option>
                                  <option value="Otodom">Portal Internetowy (Otodom/OLX)</option>
                                  <option value="Social Media">Social Media (FB/IG)</option>
                                  <option value="Baner">Baner / Reklama zewnętrzna</option>
                                  <option value="Telefon">Zimny Telefon</option>
                                  <option value="Inne">Inne</option>
                              </select>
                          </div>

                          <h4 className="text-xs font-bold text-slate-400 uppercase border-b pb-2 mb-4 mt-6">{newClientData.type === 'buyer' ? 'Preferencje' : 'Dane Nieruchomości'}</h4>
                          {newClientData.type === 'buyer' ? (<div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 block mb-1">Budżet (max)</label><input type="number" className="w-full p-3 border rounded-lg" placeholder="600000" value={newClientData.budget} onChange={e => setNewClientData({...newClientData, budget: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-500 block mb-1">Lokalizacja</label><input type="text" className="w-full p-3 border rounded-lg" placeholder="np. Wrzeszcz" value={newClientData.preferences} onChange={e => setNewClientData({...newClientData, preferences: e.target.value})} /></div></div>) : (<div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 block mb-1">Cena Ofertowa</label><input type="number" className="w-full p-3 border rounded-lg" placeholder="900000" value={newClientData.priceExpectation} onChange={e => setNewClientData({...newClientData, priceExpectation: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-500 block mb-1">Adres</label><input type="text" className="w-full p-3 border rounded-lg" placeholder="ul. Długa 5" value={newClientData.propertyDetails} onChange={e => setNewClientData({...newClientData, propertyDetails: e.target.value})} /></div></div>)}
                          <div className="mt-4"><label className="text-xs font-bold text-slate-500 block mb-1">Notatki</label><textarea className="w-full p-3 border rounded-lg h-24 resize-none" placeholder="Np. klient gotówkowy..." value={newClientData.notes} onChange={e => setNewClientData({...newClientData, notes: e.target.value})}></textarea></div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl"><button onClick={() => setCrmModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800">Anuluj</button><button onClick={handleAddClient} className="px-8 py-3 bg-[#0F172A] text-white font-bold rounded-lg hover:bg-slate-800 transition shadow-lg">Zapisz Klienta</button></div>
              </div>
          </div>
      )}

      {/* 4. MODAL: WYDARZENIE */}
      {isEventModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
                  <div className="flex justify-between items-center mb-4 border-b pb-4"><h3 className="font-bold text-lg">Nowe Wydarzenie</h3><button onClick={() => setEventModalOpen(false)}><X size={20}/></button></div>
                  <div className="space-y-4">
                      <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Typ Spotkania</label><div className="grid grid-cols-2 gap-2"><button onClick={() => setNewEventData({...newEventData, type: 'presentation'})} className={`p-2 rounded border text-sm font-bold flex items-center justify-center gap-2 ${newEventData.type === 'presentation' ? 'bg-amber-100 border-amber-500 text-amber-700' : 'border-slate-200'}`}>🏠 Prezentacja</button><button onClick={() => setNewEventData({...newEventData, type: 'notary'})} className={`p-2 rounded border text-sm font-bold flex items-center justify-center gap-2 ${newEventData.type === 'notary' ? 'bg-red-100 border-red-500 text-red-700' : 'border-slate-200'}`}>⚖️ Notariusz</button><button onClick={() => setNewEventData({...newEventData, type: 'meeting'})} className={`p-2 rounded border text-sm font-bold flex items-center justify-center gap-2 ${newEventData.type === 'meeting' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-slate-200'}`}>🤝 Spotkanie</button><button onClick={() => setNewEventData({...newEventData, type: 'call'})} className={`p-2 rounded border text-sm font-bold flex items-center justify-center gap-2 ${newEventData.type === 'call' ? 'bg-green-100 border-green-500 text-green-700' : 'border-slate-200'}`}>📞 Telefon</button></div></div>
                      <div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tytuł / Cel</label><input className="w-full p-2 border rounded" placeholder="np. Oglądanie mieszkania" value={newEventData.title} onChange={e => setNewEventData({...newEventData, title: e.target.value})} /></div>
                      <div className="grid grid-cols-2 gap-4"><div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Godzina</label><input type="time" className="w-full p-2 border rounded" value={newEventData.time} onChange={e => setNewEventData({...newEventData, time: e.target.value})} /></div><div><label className="text-xs font-bold text-slate-500 uppercase block mb-1">Klient</label><input className="w-full p-2 border rounded" placeholder="Jan Kowalski" value={newEventData.client} onChange={e => setNewEventData({...newEventData, client: e.target.value})} /></div></div>
                      <button onClick={handleAddEvent} className="w-full bg-[#0F172A] text-white font-bold py-3 rounded hover:bg-slate-800 transition">Dodaj do Kalendarza</button>
                  </div>
              </div>
          </div>
      )}

      {/* 5. MODAL: WYBÓR PORTALI (SCRAPING) */}
      {isScrapeModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col animate-in zoom-in-95 overflow-hidden">
                  <div className="bg-[#0F172A] p-6 text-white flex justify-between items-center">
                      <div>
                          <h3 className="font-bold text-xl flex items-center gap-2"><DownloadCloud size={24} className="text-amber-500"/> Import Ofert</h3>
                          <p className="text-xs text-slate-400">Wybierz serwisy ogłoszeniowe do przeszukania</p>
                      </div>
                      <button onClick={() => setScrapeModalOpen(false)} className="text-slate-400 hover:text-white transition"><X size={24}/></button>
                  </div>
                  
                  <div className="p-6 bg-slate-50 flex-1">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-slate-500 uppercase">Dostępne Portale</span>
                          <button onClick={toggleAllPortals} className="text-xs font-bold text-blue-600 hover:underline">
                              {selectedPortals.length === AVAILABLE_PORTALS.length ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
                          </button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                          {AVAILABLE_PORTALS.map(portal => (
                              <div 
                                  key={portal.id} 
                                  onClick={() => togglePortal(portal.id)}
                                  className={`p-3 rounded-xl border-2 cursor-pointer transition flex items-center justify-between group ${selectedPortals.includes(portal.id) ? 'bg-white border-amber-500 shadow-sm' : 'bg-slate-100 border-transparent opacity-60 hover:opacity-100'}`}
                              >
                                  <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${selectedPortals.includes(portal.id) ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                                      <span className="font-bold text-slate-700 text-sm">{portal.label}</span>
                                  </div>
                                  {selectedPortals.includes(portal.id) && <Check size={16} className="text-amber-600"/>}
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
                      <button onClick={() => setScrapeModalOpen(false)} className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition">Anuluj</button>
                      <button 
                          onClick={executeScrape} 
                          disabled={selectedPortals.length === 0}
                          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                          {isScraping ? <Loader2 className="animate-spin" size={20}/> : <Download size={20}/>}
                          Rozpocznij Import
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* SIDEBAR I GŁÓWNA ZAWARTOŚĆ */}
        {/* ZMIANA: bg-[#0F172A] na bg-black (czarne tło) */}
        <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-black text-white flex flex-col justify-between shadow-2xl z-20 flex-shrink-0 transition-all duration-300`}>
           <div className="overflow-y-auto scrollbar-hide">
              <div className={`p-6 flex items-center gap-3 border-b border-slate-800/50 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {/* LOGO: Zostaje /logo.jpg */}
                      <img src={BRAND_LOGO_URL} alt="OperoX Logo" className="w-full h-full object-contain" />
                  </div>
                  {!isSidebarCollapsed && (
                      <h1 className="text-xl font-serif font-bold tracking-wide text-white">
                           {/* ZMIANA: Ręczny wpis z kolorem dla X na ZŁOTY (#D4AF37) */}
                           Opero<span className="text-[#D4AF37]">X</span>
                      </h1>
                  )}
              </div>
            
              {/* ... reszta nawigacji ... */}
              <nav className="px-2 py-6 space-y-1">
                  <NavItem icon={<LayoutDashboard />} label="Pulpit" id="dashboard" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Home />} label="Oferty & Mapa" id="properties" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Users />} label="Klienci (CRM)" id="crm" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Mail />} label="Poczta" id="mail" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Printer />} label="Generator PDF" id="pdf_generator" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<MapPin />} label="Analiza Dzielnic" id="districts" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Briefcase />} label="Zespół HR" id="team" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Calculator />} label="Finanse & Wycena" id="finance" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Calendar />} label="Kalendarz" id="calendar" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Sparkles />} label="Marketing AI" id="marketing" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<MessageSquare />} label="Skrypty Rozmów" id="scripts" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  <NavItem icon={<Repeat />} label="Giełda Off-Market" id="internal_market" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                  {currentUser?.role === 'CEO' && (
                      <>
                           <NavItem icon={<Shield />} label="Panel CEO" id="admin" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                           <NavItem icon={<PieChartIcon />} label="Analityka" id="analytics" activeTab={activeTab} setTab={setActiveTab} collapsed={isSidebarCollapsed} />
                      </>
                  )}
              </nav>
           </div>
   
           {/* ZMIANA: Dół sidebara też na bg-black (lub bardzo ciemny szary dla odcięcia) */}
           <div className="p-4 bg-black border-t border-slate-800 flex flex-col gap-4">
               <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="self-end text-slate-400 hover:text-white p-1">
                   {isSidebarCollapsed ? <ChevronRight size={20}/> : <ChevronLeft size={20}/>}
               </button>
               {!isSidebarCollapsed && (
                   <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentUser?.role === 'CEO' ? 'bg-amber-600' : 'bg-slate-700'} overflow-hidden`}>
                               {currentUser?.avatar.length > 2 ? <img src={currentUser.avatar} className="w-full h-full object-cover" alt="User Avatar" /> : currentUser?.avatar}
                           </div>
                           <div>
                               <p className="text-sm font-bold truncate w-32">{currentUser?.name}</p>
                               <p className="text-[10px] text-amber-500">{currentUser?.role}</p>
                           </div>
                       </div>
                       <button onClick={handleLogout} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 mt-1">Wyloguj się</button>
                   </div>
               )}
           </div>
        </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 px-8 flex items-center justify-between flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10">
          <h2 className="text-2xl font-serif font-bold text-slate-900 capitalize">{activeTab === 'properties' ? 'Baza Nieruchomości' : activeTab}</h2>
          <div className="flex items-center gap-4"><div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-full border border-slate-200 text-sm text-slate-500 gap-2 focus-within:ring-2 ring-amber-500 transition-all w-64"><Search size={16} /><input type="text" placeholder="Szukaj..." className="outline-none w-full bg-transparent" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div><button className="relative p-2 text-slate-400 hover:text-amber-600 transition"><Bell size={24} />{announcements.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>}</button></div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#F8F9FB]">
          {activeTab === 'dashboard' && <DashboardView properties={properties} announcements={announcements} leads={leads} events={events} currentUser={currentUser} />}
          {activeTab === 'properties' && <PropertiesView 
              properties={properties} 
              currentUser={currentUser} 
              onApprove={approveProperty} 
              searchTerm={searchTerm} 
              openAddModal={() => setPropertyModalOpen(true)} 
              addToast={addToast} 
              // Przekazujemy logikę ujawniania numeru
              onRevealPhone={handleRevealPhone}
              filters={filters} 
              setFilters={setFilters} 
              showFilters={showFilters} 
              setShowFilters={setShowFilters} 
              // ZMIANA: Zamiast od razu pobierać, otwieramy modal
              onScrape={() => setScrapeModalOpen(true)} 
              isScraping={isScraping} 
              // NOWE: Przekazujemy funkcję claimowania
              onClaim={handleClaimProperty}
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
          {activeTab === 'admin' && <AdminView user={currentUser} announcements={announcements} onAddAnnouncement={addAnnouncement} onDeleteAnnouncement={deleteAnnouncement} />}
          {activeTab === 'analytics' && <AnalyticsView />}
        </div>
      </main>
    </div>
  );
}