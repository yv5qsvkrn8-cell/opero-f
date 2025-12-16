// KOD components.js (WERSJA Z MAKSYMALNYMI ZABEZPIECZENIAMI)
"use client";

/* ==========================================================================================
   PLIK: components.js (v96.2 - FINALNY FIX AWARII FRONTENDU)
   ========================================================================================== */

import React, { useState, useMemo, useEffect } from 'react';
import {
  LayoutDashboard, Home, Calendar, MessageSquare, FileText,
  Settings, Bell, Users, DollarSign, PieChart as PieChartIcon, Map as MapIcon,
  SquareCheck, Shield, Search, Plus, Filter, ExternalLink, 
  ArrowUpRight, Printer, Download, RefreshCw, CircleAlert, Clock, MapPin, 
  Calculator, X, Check, Loader2, Pen, Trash2, AlertTriangle, Info, 
  Sparkles, Wand2, Copy, Trophy, Eye, EyeOff, Mail, UserPlus,
  Radar, Hammer, Repeat, Brain, Palette, ChevronLeft, ChevronRight, UploadCloud, 
  HelpCircle, Phone, SlidersHorizontal, Image as ImageIcon, Camera, Globe, 
  DownloadCloud, Briefcase, Star, TrendingUp, BadgeCheck, Percent, Hash, Map as MapIcon2,
  Lock, ArrowRight, Building2, User, FilterX, MousePointerClick
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar } from 'recharts';

// IMPORT DANYCH
import { GDANSK_STATS, AGENT_RANKING, SCRIPTS, SOURCE_STATS, DISTRICTS_DATA, FINISHING_STANDARDS } from './store';

// IMPORT STYLI (Z pliku styles.js)
import { S } from './styles';

// ZMIENNE GLOBALNE
const BRAND_NAME = 'OperoX';
const BRAND_LOGO_URL = '/logo.jpg';

// --- NAWIGACJA ---
export const NavItem = ({ icon, label, activeTab, setTab, id, collapsed, badge, color }) => {
  const isActive = activeTab === id;

  return (
    <div 
      onClick={() => setTab(id)} 
      className={`${S.nav.container} ${collapsed ? 'justify-center' : 'justify-between'} ${isActive ? S.nav.active : S.nav.inactive} ${color || ''}`}
    >
      <div className="flex items-center gap-3">
          {React.cloneElement(icon, { size: 20, className: `transition-colors ${isActive ? "text-black drop-shadow-sm" : ""}` })}
          {!collapsed && <span className="text-sm tracking-wide">{label}</span>}
      </div>
      
      {badge > 0 && (
          <span className={`absolute ${collapsed ? 'top-2 right-2 w-3 h-3' : 'relative px-2 py-0.5'} ${isActive ? S.nav.badgeActive : S.nav.badgeInactive} text-[10px] rounded-full font-bold flex items-center justify-center shadow-sm`}>
              {collapsed ? '' : badge}
          </span>
      )}
    </div>
  );
};

// --- KOMPONENT: MAPA ---
const MapComponent = ({ properties, onSelect }) => {
    return (
        <div className="bg-slate-200 rounded-xl h-[600px] w-full relative overflow-hidden shadow-inner border border-slate-300 group">
            <div className="absolute inset-0 opacity-40 bg-[url('https://upload.wikimedia.org/wikipedia/commons/b/b3/Gdansk_map.png')] bg-cover bg-center grayscale group-hover:grayscale-0 transition duration-700"></div>
            {properties.map(p => (
                <div 
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:z-50 hover:scale-125 transition duration-300"
                    style={{ left: `${p.coordX || 50}%`, top: `${p.coordY || 50}%` }}
                >
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white ${p.status === 'Sprzedane' ? 'bg-red-500' : 'bg-amber-500'}`}>
                        <Home size={14} className="text-white" />
                        <div className="absolute bottom-full mb-2 hidden group-hover:block min-w-[120px] bg-white text-slate-800 text-xs p-2 rounded shadow-xl z-50 text-center font-bold">
                            {p.title}<br/>
                            <span className="text-amber-600">{(p.price/1000).toFixed(0)}k PLN</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- KOMPONENT: MINI KALKULATOR ---
const QuickCreditCalc = ({ price }) => {
    const [wklad, setWklad] = useState(price * 0.2); 
    const years = 25;
    const rate = 0.075; 
    const amount = price - wklad;
    const months = years * 12;
    const monthlyPayment = (amount * rate) / 12 / (1 - Math.pow(1 + rate / 12, -months));

    return (
        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm animate-in slide-in-from-top-2 shadow-inner">
            <div className="flex justify-between items-center mb-2 border-b border-amber-200 pb-1">
                <span className="font-bold text-amber-900 flex items-center gap-1"><Calculator size={12}/> Szybka Rata</span>
                <span className="text-[10px] text-amber-600">RRSO ~8.1%</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                    <label className={S.text.label}>Cena</label>
                    <div className="font-bold text-slate-700">{price.toLocaleString()}</div>
                </div>
                <div>
                    <label className={S.text.label}>Wkład ({Math.round(wklad/price*100)}%)</label>
                    <input type="range" min="0" max={price} step={5000} value={wklad} onChange={e=>setWklad(Number(e.target.value))} className="w-full h-1 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                    <div className="text-xs text-right font-mono">{wklad.toLocaleString()}</div>
                </div>
            </div>
            <div className="bg-[#0F172A] text-white p-2 rounded text-center flex justify-between items-center px-4">
                <span className="text-[10px] text-slate-400 uppercase">Rata miesięczna:</span>
                <div className="text-lg font-bold text-amber-400">{monthlyPayment.toFixed(0)} PLN</div>
            </div>
        </div>
    );
};

// --- 1. WIDOK: NIERUCHOMOŚCI ---
export const PropertiesView = ({ properties, currentUser, onApprove, onClaim, searchTerm, openAddModal, addToast, onRevealPhone, filters, setFilters, showFilters, setShowFilters, onScrape, isScraping }) => {
    const [viewMode, setViewMode] = useState('list');
    const [activeSubTab, setActiveSubTab] = useState('portfolio'); 
    const [openCalcId, setOpenCalcId] = useState(null);
    const [loadingPhoneId, setLoadingPhoneId] = useState(null);

    const toggleCalc = (id) => setOpenCalcId(openCalcId === id ? null : id);
    const handleRevealClick = async (id, offerUrl) => {
        setLoadingPhoneId(id);
        await onRevealPhone(id, offerUrl);
        setLoadingPhoneId(null);
    };

    const FilterButton = ({ active, label, onClick, icon: Icon }) => (
        <button onClick={onClick} className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 border ${active ? 'bg-amber-500 border-amber-500 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:border-amber-300'}`}>{Icon && <Icon size={14}/>} {label}</button>
    );

    const FilterInput = ({ placeholder, value, onChange, suffix, icon: Icon }) => (
        <div className="relative w-full">{Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>}<input type="number" placeholder={placeholder} className={`${S.input.base} ${Icon ? 'pl-9 pr-8' : 'pl-3 pr-8'}`} value={value} onChange={onChange}/>{suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">{suffix}</span>}</div>
    );

    const filtered = useMemo(() => {
        // Zabezpieczenie przed błędem, jeśli properties jest null/undefined
        const safeProperties = properties && Array.isArray(properties) ? properties : [];
        
        let baseProps = activeSubTab === 'portfolio' ? safeProperties.filter(p => p.approvalStatus !== 'new_lead') : safeProperties.filter(p => p.approvalStatus === 'new_lead');
        return baseProps.filter(p => {
            const term = searchTerm.toLowerCase();
            const matchesSearch = p.title.toLowerCase().includes(term) || p.city.toLowerCase().includes(term) || (p.street && p.street.toLowerCase().includes(term));
            if (!matchesSearch) return false;
            if (filters.priceMin && p.price < Number(filters.priceMin)) return false;
            if (filters.priceMax && p.price > Number(filters.priceMax)) return false;
            if (filters.areaMin && p.area < Number(filters.areaMin)) return false;
            if (filters.areaMax && p.area > Number(filters.areaMax)) return false;
            if (filters.rooms !== 'all' && p.rooms !== Number(filters.rooms)) return false;
            if (filters.standard && filters.standard !== 'all' && p.standard !== filters.standard) return false;
            if (filters.street && (!p.street || !p.street.toLowerCase().includes(filters.street.toLowerCase()))) return false;
            if (filters.sellerType && filters.sellerType !== 'all' && (p.sellerType || 'agency') !== filters.sellerType) return false;
            return true;
        });
    }, [properties, searchTerm, filters, activeSubTab]);

    return (
        <div className={S.layout.gridContainer}>
            {/* TABS & MENU */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-4">
                <div className="flex gap-4">
                    <button onClick={() => setActiveSubTab('portfolio')} className={`text-lg font-bold pb-2 transition border-b-2 px-2 flex items-center gap-2 ${activeSubTab === 'portfolio' ? 'text-[#0F172A] border-amber-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>{currentUser.role === 'CEO' ? 'Wszystkie Oferty' : 'Moje Portfolio'}</button>
                    <button onClick={() => setActiveSubTab('marketplace')} className={`text-lg font-bold pb-2 transition border-b-2 px-2 flex items-center gap-2 ${activeSubTab === 'marketplace' ? 'text-[#0F172A] border-amber-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}>
                        <DownloadCloud size={20}/> Giełda Leadów
                        {properties.filter(p => p.approvalStatus === 'new_lead').length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{properties.filter(p => p.approvalStatus === 'new_lead').length}</span>}
                    </button>
                </div>
                <div className="flex gap-3 flex-wrap items-center">
                    {activeSubTab === 'portfolio' && (
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mr-2">
                            <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition ${viewMode === 'list' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><FileText size={16}/></button>
                            <button onClick={() => setViewMode('map')} className={`p-2 rounded-md transition ${viewMode === 'map' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}><MapIcon size={16}/></button>
                        </div>
                    )}
                    <button onClick={onScrape} disabled={isScraping} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border transition ${isScraping ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white border-green-200 text-green-700 hover:bg-green-50'}`}>{isScraping ? <Loader2 size={16} className="animate-spin"/> : <DownloadCloud size={16}/>} Import</button>
                    <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border transition ${showFilters ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm' : 'bg-white border-slate-200 text-slate-700'}`}><SlidersHorizontal size={16}/> Filtry {showFilters ? <ChevronRight size={16} className="rotate-90"/> : null}</button>
                    <button onClick={openAddModal} className={S.button.primary}><Plus size={16} /> Dodaj</button>
                </div>
            </div>

            {/* FILTERS PANEL */}
            {showFilters && (
                <div className={`${S.card.base} animate-in slide-in-from-top-4`}>
                    <div className={S.layout.sectionHeader}>
                         <h3 className="font-bold text-slate-800 flex items-center gap-2"><Filter size={18} className="text-amber-500"/> Zaawansowane Filtrowanie</h3>
                         <button onClick={()=>setFilters({priceMin:'',priceMax:'',areaMin:'',areaMax:'',rooms:'all',floor:'all', standard:'all', street: '', sellerType: 'all'})} className="text-xs text-red-500 font-bold hover:bg-red-50 px-3 py-1 rounded transition flex items-center gap-1"><FilterX size={14}/> Resetuj</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
                        <div><label className={S.text.label}>Zakres Cenowy</label><div className="flex gap-2"><FilterInput placeholder="Od" value={filters.priceMin} onChange={e=>setFilters({...filters, priceMin: e.target.value})} suffix="zł" /><FilterInput placeholder="Do" value={filters.priceMax} onChange={e=>setFilters({...filters, priceMax: e.target.value})} suffix="zł" /></div></div>
                        <div><label className={S.text.label}>Powierzchnia</label><div className="flex gap-2"><FilterInput placeholder="Od" value={filters.areaMin} onChange={e=>setFilters({...filters, areaMin: e.target.value})} suffix="m²" /><FilterInput placeholder="Do" value={filters.areaMax} onChange={e=>setFilters({...filters, areaMax: e.target.value})} suffix="m²" /></div></div>
                        <div><label className={S.text.label}>Ulica</label><div className="relative"><Search size={14} className={S.input.searchIcon}/><input type="text" placeholder="Wpisz nazwę ulicy..." className={`${S.input.base} ${S.input.searchField}`} value={filters.street} onChange={e=>setFilters({...filters, street: e.target.value})}/></div></div>
                        <div><label className={S.text.label}>Sprzedawca</label><div className="flex gap-2 bg-slate-50 p-1 rounded-lg border border-slate-100"><button onClick={()=>setFilters({...filters, sellerType: 'all'})} className={`flex-1 text-[10px] font-bold py-1.5 rounded transition ${filters.sellerType === 'all' ? 'bg-white shadow text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>Wszyscy</button><button onClick={()=>setFilters({...filters, sellerType: 'private'})} className={`flex-1 text-[10px] font-bold py-1.5 rounded transition ${filters.sellerType === 'private' ? 'bg-white shadow text-green-700' : 'text-slate-400 hover:text-slate-600'}`}>Prywatni</button><button onClick={()=>setFilters({...filters, sellerType: 'agency'})} className={`flex-1 text-[10px] font-bold py-1.5 rounded transition ${filters.sellerType === 'agency' ? 'bg-white shadow text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}>Firmy</button></div></div>
                        <div className="lg:col-span-2"><label className={S.text.label}>Liczba Pokoi</label><div className="flex gap-2"><FilterButton active={filters.rooms === 'all'} label="Wszystkie" onClick={()=>setFilters({...filters, rooms: 'all'})} /><FilterButton active={filters.rooms === '1'} label="1" onClick={()=>setFilters({...filters, rooms: '1'})} /><FilterButton active={filters.rooms === '2'} label="2" onClick={()=>setFilters({...filters, rooms: '2'})} /><FilterButton active={filters.rooms === '3'} label="3" onClick={()=>setFilters({...filters, rooms: '3'})} /><FilterButton active={filters.rooms === '4'} label="4+" onClick={()=>setFilters({...filters, rooms: '4'})} /></div></div>
                        <div className="lg:col-span-2"><label className={S.text.label}>Standard Wykończenia</label><div className="flex flex-wrap gap-2"><button onClick={()=>setFilters({...filters, standard: 'all'})} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${filters.standard === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>Wszystkie</button>{FINISHING_STANDARDS.map(std => (<button key={std.id} onClick={()=>setFilters({...filters, standard: std.id})} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${filters.standard === std.id ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>{std.label}</button>))}</div></div>
                    </div>
                </div>
            )}

            {/* LISTA OFERT */}
            {activeSubTab === 'marketplace' && filtered.length === 0 && (
                <div className="p-16 text-center text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <DownloadCloud size={64} className="mx-auto mb-4 opacity-30 text-slate-400"/>
                    <h3 className="font-bold text-xl text-slate-600 mb-2">Brak nowych leadów</h3>
                    <p className="text-sm max-w-md mx-auto mb-6">Użyj przycisku "Import", aby pobrać nowe ogłoszenia z portali.</p>
                    <button onClick={onScrape} className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl shadow hover:bg-amber-600 transition">Rozpocznij Import</button>
                </div>
            )}

            {viewMode === 'list' ? (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(p => {
                        const standardObj = FINISHING_STANDARDS.find(s => s.id === p.standard) || { label: 'Standard', color: 'bg-slate-100 text-slate-500' };
                        const isPrivate = p.sellerType === 'private';
                        const isLoadingPhone = loadingPhoneId === p.id;
                        const isNewLead = p.approvalStatus === 'new_lead';

                        return (
                            <div key={p.id} className={`bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 items-start relative hover:shadow-md transition duration-300 ${isNewLead ? 'border-l-4 border-l-blue-500 bg-blue-50/20' : p.approvalStatus === 'pending' ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'}`}>
                                {isNewLead && <div className={`absolute top-2 right-2 ${S.badge.newLead} text-[10px] px-3 py-1 rounded border flex items-center gap-1`}><Sparkles size={10}/> Nowy Lead</div>}
                                {p.approvalStatus === 'pending' && <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">Oczekuje na akceptację</div>}
                                
                                <div className="w-full md:w-64 h-48 relative flex-shrink-0 group overflow-hidden rounded-lg bg-slate-100 cursor-pointer" onClick={() => p.offerUrl?.startsWith('http') ? window.open(p.offerUrl, '_blank') : null}>
                                    <img src={p.image || "https://via.placeholder.com/300"} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="property" />
                                    <div className="absolute top-2 left-2 text-white text-[10px] px-2 py-1 rounded font-bold uppercase bg-slate-800">{p.source || 'Import'}</div>
                                    {p.offerUrl?.startsWith('http') && <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"><span className="bg-white text-slate-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><ExternalLink size={12}/> Zobacz Ofertę</span></div>}
                                </div>

                                <div className="flex-1 w-full flex flex-col justify-between h-full min-h-[12rem]">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="w-3/4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={isPrivate ? S.badge.green : S.badge.blue}>{isPrivate ? <><User size={10}/> Osoba Prywatna</> : <><Building2 size={10}/> Firma / Biuro</>}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{p.title}</h3>
                                                <p className="text-sm text-slate-500 mb-2 flex items-center gap-1 mt-1"><MapPin size={14}/> {p.city}, {p.district}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold font-serif text-[#0F172A]">{p.price.toLocaleString()} PLN</p>
                                                <p className="text-xs text-slate-400 mt-1 font-mono">{p.area > 0 ? Math.round(p.price/p.area).toLocaleString() : '-'} zł/m²</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${standardObj.color}`}>{standardObj.label}</span>
                                            <div className="flex gap-3 text-xs text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100"><span className="font-bold flex items-center gap-1"><Home size={12}/> {p.area} m²</span><span className="border-l border-slate-300 pl-3">{p.rooms} Pok.</span><span className="border-l border-slate-300 pl-3">Piętro: {p.floor || '-'}</span></div>
                                        </div>
                                    </div>
                                    <div className="border-t border-slate-100 pt-3 flex flex-wrap justify-between items-center mt-auto gap-2">
                                        <div className="flex gap-2">
                                            <button onClick={() => !p.revealedPhone && handleRevealClick(p.id, p.offerUrl)} disabled={isLoadingPhone} className={`flex items-center gap-2 px-3 py-1.5 rounded border transition text-xs font-bold ${p.revealedPhone ? 'bg-white border-green-500 text-green-700 cursor-default' : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 cursor-pointer'}`}>
                                                {isLoadingPhone ? <Loader2 size={14} className="animate-spin"/> : <Phone size={14}/>} {p.revealedPhone ? (p.phone || "Brak numeru") : "Pokaż numer"}
                                            </button>
                                            <button onClick={() => toggleCalc(p.id)} className={S.button.outline}><Calculator size={14}/> {openCalcId === p.id ? 'Ukryj Ratę' : 'Oblicz Ratę'}</button>
                                        </div>
                                        <div className="flex gap-2">
                                            {isNewLead ? (
                                                <button onClick={() => onClaim(p.id)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition flex items-center gap-2 animate-pulse hover:scale-105"><MousePointerClick size={16}/> PRZEJMIJ LEADA</button>
                                            ) : (
                                                p.approvalStatus === 'pending' && currentUser.role === 'CEO' && <><button onClick={() => addToast("Odrzucono", "error")} className={S.button.danger}>Odrzuć</button><button onClick={() => onApprove(p.id)} className={S.button.success}>Akceptuj</button></>
                                            )}
                                        </div>
                                    </div>
                                    {openCalcId === p.id && <QuickCreditCalc price={p.price} />}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <MapComponent properties={filtered} onSelect={(p) => addToast(`Wybrano: ${p.title}`)} />
            )}
        </div>
    );
};

// --- 2. CRM VIEW ---
export const CrmView = ({ leads, setLeads, addToast, crmSearchTerm, setCrmSearchTerm, setCrmModalOpen }) => {
    // Zabezpieczenie przed błędem, jeśli leads jest null/undefined
    const safeLeads = leads && Array.isArray(leads) ? leads : [];
    
    const filteredLeads = safeLeads.filter(lead => lead.name.toLowerCase().includes(crmSearchTerm.toLowerCase()) || String(lead.id).includes(crmSearchTerm) || lead.phone.includes(crmSearchTerm));
    const toggleReveal = (id) => { setLeads(prev => prev.map(l => l.id === id ? { ...l, revealed: true } : l)); addToast("Numer odkryty.", "warning"); };

    return (
        <div className={S.layout.gridContainer}>
            <div className={S.card.base + " flex flex-col md:flex-row justify-between items-center gap-4"}>
                <div className="flex-1 w-full"><h3 className={S.text.title}>Baza Kontaktów CRM</h3><p className={S.text.subtitle}>Zarządzaj relacjami z klientami</p><div className={S.input.searchContainer}><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="text-slate-400" size={20}/></div><input type="text" className={`${S.input.base} pl-10 pr-4 py-3`} placeholder="Szukaj po: Nazwisku, ID, Telefonie..." value={crmSearchTerm} onChange={(e) => setCrmSearchTerm(e.target.value)}/></div></div>
                <button onClick={() => setCrmModalOpen(true)} className={S.button.primary + " px-6 py-4 rounded-xl"}><UserPlus size={20}/> Dodaj Klienta</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-100"><tr><th className="p-4">ID / Klient</th><th className="p-4">Typ & Źródło</th><th className="p-4">Preferencje</th><th className="p-4">Status</th><th className="p-4">Kontakt</th></tr></thead><tbody className="divide-y divide-slate-100">{filteredLeads.map(lead => (<tr key={lead.id} className="hover:bg-slate-50 transition group"><td className="p-4"><div className="text-[10px] text-amber-600 font-mono font-bold mb-1">ID: {lead.id}</div><div className="font-bold text-slate-800">{lead.name}</div></td><td className="p-4">{lead.type === 'buyer' ? <span className={S.badge.green}><TrendingUp size={12}/> Kupujący</span> : <span className={S.badge.blue}><Home size={12}/> Sprzedający</span>}<div className="text-[10px] text-slate-400">Źródło: {lead.source || 'Brak'}</div></td><td className="p-4"><div className="text-sm text-slate-600 font-medium">{lead.type === 'buyer' ? `Budżet: ${lead.budget} PLN` : `Cena: ${lead.priceExpectation} PLN`}</div></td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${lead.status === 'new' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{lead.status === 'new' ? 'Nowy' : lead.status}</span></td><td className="p-4"><div className={`flex items-center gap-2 px-3 py-1.5 rounded-md w-fit cursor-pointer border transition ${lead.revealed ? 'bg-white border-green-500 text-green-700' : 'bg-slate-100 border-transparent text-slate-500 hover:bg-slate-200'}`} onClick={() => toggleReveal(lead.id)}>{lead.revealed ? <span className="font-mono font-bold">{lead.phone}</span> : <span className="font-mono tracking-widest">***-***-***</span>}{lead.revealed ? <Eye size={14}/> : <EyeOff size={14}/>}</div></td></tr>))}</tbody></table></div>
        </div>
    );
};

// --- 3. WIDOK: KALENDARZ (DRAG & DROP) ---
export const CalendarView = ({ events, openAddEvent, onMoveEvent }) => { 
    // Zabezpieczenie przed błędem, jeśli events jest null/undefined
    const safeEvents = events && Array.isArray(events) ? events : [];
    
    const handleDragStart = (e, eventId) => { e.dataTransfer.setData("eventId", eventId); }; 
    const handleDrop = (e, targetDay) => { e.preventDefault(); const eventId = e.dataTransfer.getData("eventId"); if (eventId) onMoveEvent(Number(eventId), targetDay); }; 

    return (
        <div className="flex flex-col h-full slide-up gap-6">
            <div className={S.card.base + " flex justify-between items-center"}>
                <h3 className="font-bold text-2xl text-slate-800 flex items-center gap-2"><Calendar className="text-amber-500"/> Kalendarz</h3>
                <button onClick={openAddEvent} className={S.button.primary}><Plus size={16}/> Dodaj</button>
            </div>
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50">{['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'].map(day => (<div key={day} className="p-3 text-center text-xs font-bold text-slate-500 uppercase">{day}</div>))}</div>
                <div className="grid grid-cols-7 grid-rows-5 flex-1 bg-slate-100 gap-px border-b border-l border-slate-200">
                    {Array.from({length: 31}, (_, i) => i + 1).map(day => { 
                        const dayEvents = safeEvents.filter(e => e.day === day); 
                        return (
                            <div key={day} onDragOver={e=>e.preventDefault()} onDrop={(e) => handleDrop(e, day)} className={`bg-white min-h-[100px] p-2 relative group hover:bg-slate-50 transition-colors ${day === 12 ? 'bg-blue-50/30' : ''}`}>
                                <span className="text-sm font-bold text-slate-400">{day}</span>
                                <div className="mt-2 space-y-1">{dayEvents.map(ev => (<div key={ev.id} draggable onDragStart={(e) => handleDragStart(e, ev.id)} className="p-1.5 rounded-lg border text-[10px] cursor-grab bg-slate-100 border-slate-200">{ev.title}</div>))}</div>
                            </div>
                        ); 
                    })}
                </div>
            </div>
        </div>
    ); 
};

// --- 4. WIDOK: ZESPÓŁ ---
export const TeamView = ({ users, openAddModal, currentUser }) => { 
    return (
        <div className={S.layout.gridContainer}>
            <div className={S.card.base + " flex justify-between items-center"}>
                <div><h3 className={S.text.title}>Twój Zespół</h3><p className={S.text.subtitle}>Zarządzaj dostępami</p></div>
                {currentUser.role === 'CEO' && <button onClick={openAddModal} className={S.button.gold}><Plus size={18}/> Dodaj Pracownika</button>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id} className={S.card.base + " hover:shadow-md transition group relative flex flex-col pt-12 overflow-visible"}>
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0F172A] to-[#1e293b] rounded-t-2xl"></div>
                        <div className="w-16 h-16 bg-white rounded-xl border-4 border-white shadow-md flex items-center justify-center overflow-hidden absolute top-4 left-6">{user.avatar.length > 2 ? <img src={user.avatar} className="w-full h-full object-cover"/> : <span className="text-2xl font-bold text-slate-700">{user.avatar}</span>}</div>
                        <h3 className="font-bold text-lg text-slate-900 mt-2">{user.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{user.role}</p>
                        <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs">
                             <div>{user.email}</div><div>{user.phone}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    ); 
};

// --- 5. WIDOK: FINANSE & WYCENA (POPRAWIONY - KOMPLETNY) ---
export const FinanceView = ({ properties }) => { 
    // Stan dla Wyceny
    const [formData, setFormData] = useState({ district: 'Gdańsk Wrzeszcz', area: 50, rooms: 2, floor: 1, totalFloors: 4, year: 2000, standard: 'normal', balcony: false, elevator: false, parking: false, storage: false, garden: false }); 
    const [valuation, setValuation] = useState(null); 
    const [showReport, setShowReport] = useState(false);

    // Stan dla Kalkulatora Kredytowego (TO WRÓCIŁO)
    const [creditPrice, setCreditPrice] = useState(500000); 
    const [wklad, setWklad] = useState(100000); 
    const [lata, setLata] = useState(25); 

    // Logika Wyceny
    const DISTRICT_PRICES = { 'Gdańsk Wrzeszcz': 14500, 'Gdańsk Oliwa': 16200, 'Gdańsk Śródmieście': 18500, 'Gdańsk Przymorze': 13800, 'Gdańsk Zaspa': 12900, 'Gdańsk Południe': 9800, 'Gdańsk Morena': 11500, 'Gdańsk Jelitkowo': 24000 }; 
    
    const calculateValuation = () => { 
        let basePriceSqM = DISTRICT_PRICES[formData.district] || 12000; 
        if (formData.standard === 'low') basePriceSqM *= 0.85; 
        if (formData.standard === 'high') basePriceSqM *= 1.15; 
        if (formData.standard === 'premium') basePriceSqM *= 1.30; 
        if (formData.floor === 0 && !formData.garden) basePriceSqM *= 0.95; 
        if (formData.floor > 0 && formData.floor < 4) basePriceSqM *= 1.05; 
        let estimatedValue = basePriceSqM * formData.area; 
        if (formData.parking) estimatedValue += 35000; 
        if (formData.storage) estimatedValue += 10000; 
        if (formData.balcony) estimatedValue += 5000; 
        setValuation({ min: Math.round(estimatedValue * 0.92), max: Math.round(estimatedValue * 1.08), optimal: Math.round(estimatedValue) }); 
    };

    const handlePrintReport = () => { setShowReport(true); setTimeout(() => { window.print(); setShowReport(false); }, 500); }; 

    // Logika Kalkulatora Kredytowego
    const kwotaKredytu = creditPrice - wklad; 
    const oprocentowanie = 0.075; 
    const iloscRat = lata * 12; 
    const rata = (kwotaKredytu * oprocentowanie) / 12 / (1 - Math.pow(1 + oprocentowanie / 12, -iloscRat)); 

    return (
        <div className={S.layout.gridContainer}>
            {/* SEKJA 1: WYCENA NIERUCHOMOŚCI */}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className={`${S.card.base} w-full lg:w-1/2 no-print`}>
                    <h3 className={S.text.title + " mb-4 flex items-center gap-2"}><Radar className="text-amber-500"/> Parametry Nieruchomości (Wycena)</h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div><label className={S.text.label}>Dzielnica</label><select className={S.input.base} value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})}>{Object.keys(DISTRICT_PRICES).map(d => <option key={d} value={d}>{d}</option>)}</select></div>
                        <div><label className={S.text.label}>Metraż (m²)</label><input type="number" className={S.input.base} value={formData.area} onChange={e => setFormData({...formData, area: Number(e.target.value)})}/></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div><label className={S.text.label}>Pokoje</label><input type="number" className={S.input.base} value={formData.rooms} onChange={e => setFormData({...formData, rooms: Number(e.target.value)})}/></div>
                        <div><label className={S.text.label}>Piętro</label><input type="number" className={S.input.base} value={formData.floor} onChange={e => setFormData({...formData, floor: Number(e.target.value)})}/></div>
                        <div><label className={S.text.label}>Rok</label><input type="number" className={S.input.base} value={formData.year} onChange={e => setFormData({...formData, year: Number(e.target.value)})}/></div>
                    </div>
                    <div className="mb-4">
                        <label className={S.text.label}>Standard</label>
                        <div className="grid grid-cols-4 gap-2 mt-1">{['low', 'normal', 'high', 'premium'].map(s => (<button key={s} onClick={() => setFormData({...formData, standard: s})} className={`py-2 rounded text-xs font-bold capitalize border ${formData.standard === s ? 'bg-amber-100 border-amber-500 text-amber-800' : 'bg-white border-slate-200 text-slate-500'}`}>{s}</button>))}</div>
                    </div>
                    <button onClick={calculateValuation} className={S.button.primary + " w-full py-3"}>Przelicz Wartość</button>
                </div>
                
                <div className="w-full lg:w-1/2 no-print">
                    {valuation ? (
                        <div className={S.card.base + " h-full flex flex-col justify-center items-center text-center animate-in fade-in"}>
                            <h2 className="text-5xl font-serif font-bold text-[#0F172A]">{valuation.optimal.toLocaleString()} PLN</h2>
                            <p className={S.text.subtitle + " mt-2"}>({Math.round(valuation.optimal/formData.area).toLocaleString()} zł/m²)</p>
                            <div className="w-full h-2 bg-gradient-to-r from-green-400 via-amber-400 to-red-400 rounded-full my-6 opacity-30"></div>
                            <div className="flex justify-between w-full text-xs font-bold text-slate-500 px-4">
                                <span>Szybka: {valuation.min.toLocaleString()}</span>
                                <span>Wysoka: {valuation.max.toLocaleString()}</span>
                            </div>
                            <button onClick={handlePrintReport} className={S.button.outline + " mt-8 w-full justify-center"}><Printer size={16}/> Generuj Raport PDF</button>
                        </div>
                    ) : (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center h-full text-slate-400 font-bold">Wprowadź dane i kliknij "Przelicz"</div>
                    )}
                </div>
            </div>

            {/* SEKJA 2: KALKULATOR KREDYTOWY (TO, CZEGO BRAKOWAŁO) */}
            <div className={`${S.card.base} no-print`}>
                <h3 className={S.text.title + " mb-6 flex items-center gap-2"}><Calculator className="text-amber-500"/> Kalkulator Kredytowy (Pełny)</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div><label className={S.text.label + " flex justify-between"}><span>Cena Nieruchomości</span> <span className="text-slate-800">{creditPrice.toLocaleString()} PLN</span></label><input type="range" min="200000" max="2000000" step="10000" value={creditPrice} onChange={e=>setCreditPrice(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"/></div>
                        <div><label className={S.text.label + " flex justify-between"}><span>Wkład Własny</span> <span className="text-slate-800">{wklad.toLocaleString()} PLN</span></label><input type="range" min="0" max={creditPrice} step="5000" value={wklad} onChange={e=>setWklad(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"/></div>
                        <div><label className={S.text.label + " flex justify-between"}><span>Okres Kredytowania</span> <span className="text-slate-800">{lata} lat</span></label><input type="range" min="5" max="35" step="1" value={lata} onChange={e=>setLata(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer mt-2"/></div>
                    </div>
                    <div className="flex flex-col justify-center items-center bg-[#0F172A] rounded-2xl p-8 text-white text-center shadow-lg">
                        <p className="text-slate-400 text-sm uppercase tracking-widest mb-2">Szacowana Rata Miesięczna</p>
                        <h2 className="text-5xl font-serif font-bold mb-4 text-[#D4AF37]">{rata.toFixed(0)} PLN</h2>
                        <div className="text-xs text-slate-500 space-y-1">
                            <p>Kwota kredytu: {(creditPrice - wklad).toLocaleString()} PLN</p>
                            <p>Oprocentowanie: {(oprocentowanie * 100).toFixed(1)}% (RRSO ~8.1%)</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEKJA 3: RAPORT PDF (UKRYTY DO DRUKU) */}
            <div id="pdf-content" className={`absolute top-0 left-0 bg-white w-[210mm] min-h-[297mm] z-[9999] ${showReport ? 'block' : 'hidden'}`}>
                <div className="h-32 bg-[#0F172A] flex justify-between items-center px-12 text-white">
                    <div>
                        <div className="w-12 h-12 mb-2"><img src={BRAND_LOGO_URL} alt="Logo" className="w-full h-full object-contain" /></div>
                        <h1 className="text-3xl font-serif font-bold tracking-widest">{BRAND_NAME}</h1>
                        <p className="text-xs uppercase tracking-widest mt-1 opacity-80">Raport Wyceny</p>
                    </div>
                    <div className="text-right"><p className="text-sm opacity-70">Data</p><p className="text-lg font-bold">{new Date().toLocaleDateString()}</p></div>
                </div>
                <div className="p-12">
                    {valuation && (<div><h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-2">Analiza Wartości</h2><div className="bg-slate-50 p-8 rounded-xl border border-slate-200"><h1 className="text-center text-6xl font-serif font-bold text-[#0F172A] mb-8">{valuation.optimal.toLocaleString()} PLN</h1></div></div>)}
                    <div className="mt-16 text-center text-xs text-slate-400 border-t pt-4"><p>Wygenerowano w systemie {BRAND_NAME}.</p></div>
                </div>
            </div>
        </div>
    ); 
};

// --- 6. WIDOK: MARKETING AI ---
export const MarketingAIView = ({ properties }) => { 
    // Zabezpieczenie przed błędem, jeśli properties jest null/undefined
    const safeProperties = properties && Array.isArray(properties) ? properties : [];
    
    const [isGenerating, setIsGenerating] = useState(false); 
    const [text, setText] = useState(''); 
    const handleGen = () => { setIsGenerating(true); setTimeout(() => { setText(`✨ WYJĄTKOWA OFERTA ✨\n\nZapraszamy do zapoznania się z ofertą...`); setIsGenerating(false); }, 1500); } 
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full slide-up">
            <div className={S.card.base}>
                <h3 className={S.text.title + " mb-6"}>Generator Opisów AI</h3>
                <button onClick={handleGen} disabled={isGenerating} className={S.button.gold + " w-full justify-center"}>{isGenerating ? <Loader2 className="animate-spin"/> : <Wand2/>} Generuj Opis</button>
            </div>
            <div className="bg-slate-100 p-8 rounded-xl relative"><textarea className={S.input.base + " h-24 resize-none"} placeholder="Tutaj pojawi się opis..." readOnly></textarea></div>
        </div>
    ); 
};

// --- 7. WIDOK: SKRYPTY ROZMÓW ---
export const ScriptsView = () => ( <div className="grid grid-cols-1 md:grid-cols-3 gap-6 slide-up">{SCRIPTS.map((script, idx) => (<div key={idx} className={S.card.base + " hover:shadow-md transition"}><div className="text-xs font-bold uppercase text-amber-500 mb-2">{script.category}</div><h3 className={S.text.title + " mb-4"}>{script.title}</h3><p className="text-sm text-slate-600 italic bg-slate-50 p-4 rounded-lg">"{script.content}"</p></div>))}</div> );

// --- 8. WIDOK: WEWNĘTRZNA GIEŁDA ---
export const InternalMarketView = ({ ads, setAds, user, addToast }) => { 
    const [newAd, setNewAd] = useState({ title: '', budget: '' }); 
    const addAd = () => { if(!newAd.title) return; setAds([...ads, { id: Date.now(), type: 'szukam', title: newAd.title, budget: newAd.budget, author: user.name }]); setNewAd({ title: '', budget: '' }); addToast("Dodano ogłoszenie"); }; 
    return (
        <div className={S.card.base + " slide-up"}>
            <h3 className={S.text.title + " mb-4 flex items-center gap-2 text-orange-600"}><Repeat /> Giełda Off-Market</h3>
            <div className="flex gap-4 mb-6 p-4 bg-orange-50 rounded-xl border border-orange-100"><input type="text" placeholder="Czego szuka Twój klient?" className="flex-1 p-2 border rounded" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} /><button onClick={addAd} className="bg-orange-500 text-white px-4 py-2 rounded font-bold hover:bg-orange-600">Dodaj</button></div>
            <div className="space-y-3">{ads.map(ad => (<div key={ad.id} className="flex justify-between items-center p-4 border border-slate-100 rounded-lg hover:shadow-md transition bg-white"><span className="font-bold text-slate-800">{ad.title}</span><span className="flex items-center gap-1 text-sm text-slate-500"><Users size={12}/> {ad.author}</span></div>))}</div>
        </div>
    ); 
};

// --- 9. WIDOK: ANALITYKA ---
export const AnalyticsView = () => ( <div className={S.layout.gridContainer}><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className={S.card.base}><h3 className={S.text.title + " mb-4"}>Skuteczność Źródeł</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={SOURCE_STATS}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="leads" fill="#f59e0b" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div></div></div></div> );

// --- 10. WIDOK: DASHBOARD (PEŁNY, LIVE DATA + NOWE STYLE) ---
export const DashboardView = ({ properties, announcements, leads, events, currentUser }) => { 
    
    // ZABEZPIECZENIE: Upewniamy się, że leads, events i properties są zawsze tablicami
    const safeProperties = properties && Array.isArray(properties) ? properties : [];
    const safeLeads = leads && Array.isArray(leads) ? leads : [];
    const safeEvents = events && Array.isArray(events) ? events : [];

    // 1. OBLICZENIA NA ŻYWO (REAL-TIME DATA)
    const totalPortfolio = safeProperties.reduce((acc, curr) => acc + curr.price, 0); 
    const potentialCommission = totalPortfolio * 0.025; // Zakładamy 2.5% prowizji
    const activeLeads = safeLeads.length; 
    
    // Obliczanie źródeł leadów dynamicznie dla wykresu
    const leadsSourceData = useMemo(() => {
        const counts = {};
        safeLeads.forEach(l => {
            const src = l.source || 'Inne';
            counts[src] = (counts[src] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    }, [safeLeads]);
    
    // Najbliższe spotkania (posortowane po dniu)
    const upcomingEvents = [...safeEvents]
        .sort((a, b) => a.day - b.day)
        .slice(0, 3);

    // Ostatni klienci (używamy bezpiecznej listy)
    const recentLeads = [...safeLeads].reverse().slice(0, 4);

    return (
        <div className={S.layout.gridContainer}>
            
            {/* A. KOMUNIKATY */}
            {announcements.length > 0 && (
                <div className="space-y-2">
                    {announcements.map(a => (
                        <div key={a.id} className={`p-4 rounded-r-xl shadow-sm flex items-start gap-4 border-l-4 bg-white ${a.priority === 'urgent' ? 'border-red-500' : 'border-amber-500'}`}>
                            <div className={`p-2 rounded-full ${a.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                {a.priority === 'urgent' ? <AlertTriangle size={20} /> : <Bell size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{a.priority === 'urgent' ? 'PILNE:' : 'INFO:'} {a.author}</h4>
                                <p className="text-sm text-slate-600">{a.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* B. GŁÓWNA KARTA (PREMIUM BLACK) */}
            <div className={S.card.black}>
                <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Cześć, {currentUser.name.split(' ')[0]}! 👋</h2>
                        <p className="text-slate-400">Twoje portfolio wygląda imponująco. Masz <span className="text-[#D4AF37] font-bold">{safeProperties.length}</span> aktywnych ofert.</p>
                        
                        {/* Pasek Celu */}
                        <div className="mt-6 max-w-md">
                            <div className="flex justify-between text-xs text-slate-400 mb-2">
                                <span>Cel miesięczny (Obrót)</span>
                                <span>{(totalPortfolio / 10000000 * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F7E7CE]" style={{ width: `${Math.min((totalPortfolio / 10000000 * 100), 100)}%` }}></div>
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                                <span>0 PLN</span>
                                <span>Cel: 10 mln PLN</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-right bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Potencjalna Prowizja</p>
                        <p className="text-3xl font-serif text-[#D4AF37] font-bold">{potentialCommission.toLocaleString()} PLN</p>
                    </div>
                </div>
            </div>

            {/* C. KARTY KPI (4 KAFELKI) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={S.card.base + " hover:-translate-y-1 transition duration-300"}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Home size={24}/></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">+2 w tym tyg.</span>
                    </div>
                    <p className={S.text.label}>Wartość Ofert</p>
                    <h3 className={S.text.valueBig}>{(totalPortfolio/1000000).toFixed(2)} mln</h3>
                </div>

                <div className={S.card.base + " hover:-translate-y-1 transition duration-300"}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Users size={24}/></div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{activeLeads} łącznie</span>
                    </div>
                    <p className={S.text.label}>Aktywni Klienci</p>
                    <h3 className={S.text.valueBig}>{activeLeads}</h3>
                </div>

                <div className={S.card.base + " hover:-translate-y-1 transition duration-300"}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Star size={24}/></div>
                    </div>
                    <p className={S.text.label}>Skuteczność</p>
                    <h3 className={S.text.valueBig}>12%</h3>
                    <p className="text-xs text-slate-400 mt-1">Konwersja leadów</p>
                </div>

                <div className={S.card.base + " hover:-translate-y-1 transition duration-300"}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp size={24}/></div>
                    </div>
                    <p className={S.text.label}>Sprzedaż (YTD)</p>
                    <h3 className={S.text.valueBig}>2.5 mln</h3>
                </div>
            </div>

            {/* D. WYKRESY I TABELE (DOŁ) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. WYKRES ŹRÓDEŁ */}
                <div className={`${S.card.base} lg:col-span-2`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className={S.text.title}>Skąd przychodzą klienci?</h3>
                        <select className="text-xs border rounded p-1 text-slate-500 bg-slate-50"><option>Ten miesiąc</option></select>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={leadsSourceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                {/* Używamy koloru złotego/amber dla słupków */}
                                <Bar dataKey="value" fill="#d97706" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. AGENDA I NOWI KLIENCI */}
                <div className="flex flex-col gap-6">
                    {/* Najbliższe Wydarzenia */}
                    <div className={`${S.card.base} flex-1`}>
                        <h3 className={S.text.title + " mb-4"}>Najbliższe Wydarzenia</h3>
                        {upcomingEvents.length > 0 ? (
                            <div className="space-y-4">
                                {upcomingEvents.map(ev => (
                                    <div key={ev.id} className="flex gap-4 items-start">
                                        <div className="flex flex-col items-center min-w-[3rem] bg-slate-50 rounded-lg p-2 border border-slate-100">
                                            <span className="text-xs text-slate-400 font-bold uppercase">GRU</span>
                                            <span className="text-lg font-bold text-slate-800">{ev.day}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{ev.title}</p>
                                            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><Clock size={12}/> {ev.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">Brak zadań na najbliższe dni.</p>
                        )}
                    </div>

                    {/* Nowi Klienci */}
                    <div className={S.card.base}>
                        <h3 className={S.text.title + " mb-4"}>Nowi Klienci</h3>
                        <div className="space-y-3">
                            {recentLeads.map(l => (
                                <div key={l.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                                            {l.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-700">{l.name}</p>
                                            <p className="text-[10px] text-slate-400">{l.source}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono bg-slate-50 px-2 py-1 rounded text-slate-500 border border-slate-100">
                                        {l.budget ? (l.budget/1000)+'k' : '-'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ); 
};
// --- 11. KOMPONENT: ONBOARDING ---
export const OnboardingTour = ({ close }) => ( 
    <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl max-w-lg shadow-2xl relative animate-in zoom-in-95">
            <h2 className="text-2xl font-bold text-center mb-2">Witaj w {BRAND_NAME}!</h2>
            <button onClick={close} className={S.button.primary + " w-full py-3 mt-6"}>Rozpocznij Pracę</button>
        </div>
    </div> 
);

// --- 12. WIDOK: ADMIN ---
export const AdminView = ({ user, announcements, onAddAnnouncement, onDeleteAnnouncement }) => { 
  const [text, setText] = useState(''); const [priority, setPriority] = useState('normal'); 
  if (user.role !== 'CEO') return <div className="flex flex-col items-center justify-center h-full text-slate-400"><Shield size={64} className="mb-4 text-slate-200" /><h2 className="text-xl font-bold">Brak Dostępu</h2></div>; 
  return (<div className={S.layout.gridContainer}><div className={S.card.base}><h3 className={S.text.title + " mb-4"}>📢 Wyślij komunikat</h3><div className="flex flex-col gap-4"><textarea className={S.input.base + " h-24 resize-none"} value={text} onChange={(e) => setText(e.target.value)} /><button onClick={() => { if(text) { onAddAnnouncement(text, priority); setText(''); } }} className={S.button.gold}>Wyślij</button></div></div></div>); 
};

// --- 13. WIDOK: ANALIZA DZIELNIC ---
export const DistrictAnalysisView = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(DISTRICTS_DATA[0]);
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] slide-up">
      <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100"><h3 className={S.text.title}>Dzielnice Gdańska</h3></div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2">{DISTRICTS_DATA.map(d => (<div key={d.id} onClick={() => setSelectedDistrict(d)} className={`p-4 rounded-xl cursor-pointer transition border ${selectedDistrict.id === d.id ? 'bg-amber-50 border-amber-200' : 'bg-white border-transparent hover:bg-slate-50'}`}><span className="font-bold text-slate-700">{d.name}</span></div>))}</div>
      </div>
      <div className={`${S.card.base} flex-1 overflow-y-auto`}>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">{selectedDistrict.name}</h2>
          <p className="text-slate-600 mb-8 italic">"{selectedDistrict.desc}"</p>
          <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={selectedDistrict.stats}><PolarGrid stroke="#e2e8f0" /><PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} /><PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} /><RechartsRadar name={selectedDistrict.name} dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} /><Tooltip/></RadarChart></ResponsiveContainer></div>
      </div>
    </div>
  );
};

// --- 14. WIDOK: GENERATOR OFERT PDF (PEŁNA LOGIKA) ---
export const PdfGeneratorView = ({ properties, users, currentUser }) => { 
    // Zabezpieczenie przed błędem, jeśli properties jest null/undefined
    const safeProperties = properties && Array.isArray(properties) ? properties : [];

    const [selectedProps, setSelectedProps] = useState([]);
    const [pdfData, setPdfData] = useState({
        clientName: 'Szanowny Panie Janie',
        introText: 'W nawiązaniu do naszej rozmowy, przesyłam wyselekcjonowane oferty...',
        agentId: currentUser.id
    });

    const toggleProperty = (id) => {
        if (selectedProps.includes(id)) { setSelectedProps(selectedProps.filter(p => p !== id)); } 
        else { if (selectedProps.length >= 4) { alert("Max 4 oferty."); return; } setSelectedProps([...selectedProps, id]); }
    };

    const selectedAgent = users.find(u => u.id === Number(pdfData.agentId)) || currentUser;
    const handlePrint = () => window.print();

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] slide-up">
            {/* Lewa kolumna: Konfiguracja */}
            <div className={`${S.card.base} w-full lg:w-1/3 flex flex-col overflow-hidden p-0`}>
                <div className="p-6 border-b border-slate-100 bg-slate-50"><h3 className={S.text.title}>Kreator PDF</h3></div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <label className={S.text.label}>Nagłówek</label><input className={S.input.base} value={pdfData.clientName} onChange={e => setPdfData({...pdfData, clientName: e.target.value})} />
                    <label className={S.text.label}>Treść</label><textarea className={S.input.base + " h-24 resize-none"} value={pdfData.introText} onChange={e => setPdfData({...pdfData, introText: e.target.value})} />
                    <label className={S.text.label}>Wybierz Oferty ({selectedProps.length}/4)</label>
                    <div className="border rounded-lg overflow-hidden max-h-60 overflow-y-auto bg-slate-50">{safeProperties.map(p => (<div key={p.id} onClick={() => toggleProperty(p.id)} className={`p-3 flex items-center gap-3 cursor-pointer border-b hover:bg-white transition ${selectedProps.includes(p.id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}><img src={p.image} className="w-10 h-10 object-cover rounded"/><div className="flex-1"><p className="text-xs font-bold truncate">{p.title}</p></div>{selectedProps.includes(p.id) && <Check size={16} className="text-blue-500"/>}</div>))}</div>
                </div>
                <div className="p-6 border-t border-slate-100"><button onClick={handlePrint} className={S.button.primary + " w-full justify-center"}><Printer size={18}/> Drukuj / PDF</button></div>
            </div>

            {/* Prawa kolumna: Podgląd A4 (Styl Inline dla wymiarów druku) */}
            <div className="flex-1 bg-slate-200 overflow-y-auto rounded-2xl p-8 flex justify-center">
                <div id="pdf-content" className="bg-white w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col">
                    <div className="h-24 bg-[#0F172A] flex justify-between items-center px-10 text-white">
                        <div><h1 className="text-2xl font-serif font-bold tracking-widest">{BRAND_NAME}</h1><p className="text-[10px] uppercase">Premium Real Estate</p></div>
                        <div className="text-right"><p className="text-sm font-bold text-amber-500">{new Date().toLocaleDateString()}</p></div>
                    </div>
                    <div className="px-10 py-8"><h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">{pdfData.clientName}</h2><p className="text-slate-600 text-sm italic">"{pdfData.introText}"</p></div>
                    <div className="flex-1 px-10 pb-8"><div className="grid grid-cols-2 gap-8">{selectedProps.map(id => { const pData = safeProperties.find(x => x.id === id); return pData ? (<div key={pData.id}><div className="h-48 w-full bg-slate-100 rounded-sm overflow-hidden mb-3"><img src={pData.image} className="w-full h-full object-cover"/></div><h3 className="font-bold text-slate-800 text-sm">{pData.title}</h3><p className="text-amber-600 font-bold">{pData.price.toLocaleString()} PLN</p></div>) : null; })}</div></div>
                    <div className="bg-slate-50 px-10 py-6 border-t border-slate-200 mt-auto flex justify-between items-center"><div><p className="font-bold text-slate-800">{selectedAgent.name}</p><p className="text-xs text-amber-600">{selectedAgent.phone}</p></div><div className="text-right text-[10px] text-slate-400"><p>{BRAND_NAME}</p><p>www.operox.pl</p></div></div>
                </div>
            </div>
        </div>
    ); 
};

// --- 15. WIDOK: POCZTA (PEŁNA LOGIKA) ---
export const MailView = ({ currentUser }) => { 
    const [emails, setEmails] = useState([]);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        // Symulacja pobierania danych (lub realny fetch w przyszłości)
        setTimeout(() => {
             setEmails([{id: 1, from: 'Jan Kowalski', subject: 'Zapytanie o ofertę', content: 'Dzień dobry, jestem zainteresowany...', read: false, date: '10:30'}]);
             setLoading(false);
        }, 500);
    }, []);

    const handleSendReply = () => { if(!replyText) return; alert(`Wysłano: ${replyText}`); setReplyText(''); };

    return (
        <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden slide-up">
            <div className="w-64 bg-slate-50 border-r border-slate-100 p-4">
                <button className={S.button.gold + " w-full justify-center mb-6"}><Pen size={18}/> Nowa</button>
                <div className="space-y-1"><div className="flex justify-between items-center px-4 py-2 bg-white rounded shadow-sm font-bold text-slate-800"><span>Odebrane</span><span className="text-xs bg-blue-100 text-blue-600 px-2 rounded-full">{emails.length}</span></div></div>
            </div>
            <div className="w-80 border-r border-slate-100 overflow-y-auto bg-white">
                {loading ? <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto"/></div> : emails.map(e => (
                    <div key={e.id} onClick={() => setSelectedEmail(e)} className={`p-4 border-b cursor-pointer hover:bg-slate-50 ${selectedEmail?.id === e.id ? 'bg-amber-50 border-l-4 border-l-amber-500' : ''}`}>
                        <h4 className="font-bold text-sm text-slate-800">{e.from}</h4><p className="text-xs text-slate-500 truncate">{e.subject}</p>
                    </div>
                ))}
            </div>
            <div className="flex-1 flex flex-col bg-white p-8">
                {selectedEmail ? (
                    <>
                        <h2 className="text-xl font-bold mb-4">{selectedEmail.subject}</h2>
                        <div className="flex-1 overflow-y-auto text-slate-600 text-sm mb-4 bg-slate-50 p-4 rounded">{selectedEmail.content}</div>
                        <div className="relative"><textarea className={S.input.base + " h-24 resize-none"} placeholder="Odpisz..." value={replyText} onChange={e => setReplyText(e.target.value)}/><button onClick={handleSendReply} className="absolute bottom-3 right-3 bg-slate-800 text-white px-4 py-1 text-xs rounded">Wyślij</button></div>
                    </>
                ) : <div className="flex items-center justify-center h-full text-slate-400">Wybierz wiadomość</div>}
            </div>
        </div>
    ); 
};

// --- 16. EKRAN LOGOWANIA: PREMIUM DARK ---
export const LoginView = ({ onLogin }) => {
    const [email, setEmail] = useState('adam@grandestates.pl');
    const [password, setPassword] = useState('admin');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            const success = onLogin(email, password);
            if (!success) { setError('Nieprawidłowe dane logowania.'); setIsLoading(false); }
        }, 1000);
    };

    const BACKGROUND_PATH = '/tlo.jpg'; 
    const LOGO_PATH = '/logo.png';

    return (
        <div className={S.login.wrapper}>
            <div className={S.login.bgOverlay} style={{ backgroundImage: `url(${BACKGROUND_PATH})`, backgroundSize: 'cover' }}></div>
            <div className="relative z-20 w-full flex flex-col items-center justify-center p-4">
                <div className={S.login.card} style={{ boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(199,164,110,0.3)' }}>
                    <div className="flex justify-center mb-10 mt-2"><div className="w-32 h-32"><img src={LOGO_PATH} alt="OperoX Logo" className="w-full h-full object-contain" /></div></div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1"><label className={S.text.label}>Username</label><input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className={S.login.input} placeholder="Username"/></div>
                        <div className="space-y-1"><label className={S.text.label}>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={S.login.input} placeholder="Password"/></div>
                        {error && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg flex items-center gap-2"><CircleAlert size={14}/> {error}</div>}
                        <button type="submit" disabled={isLoading} className={S.login.button}>{isLoading ? <Loader2 className="animate-spin" size={20}/> : 'Log In'}</button>
                    </form>
                </div>
            </div>
        </div>
    ); 
};