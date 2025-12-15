/* ==========================================================================================
   PLIK: styles.js - GLOBALNE STYLE I MOTYWY (BLACK & GOLD PREMIUM)
   ========================================================================================== */

export const S = {
    // --- 1. UKŁAD I ANIMACJE ---
    layout: {
        slideUp: "animate-in slide-in-from-bottom-4 duration-500",
        fadeIn: "animate-in fade-in duration-500",
        gridContainer: "space-y-6 animate-in slide-in-from-bottom-4 duration-500", // Połączone slideUp dla kontenerów
        sectionHeader: "flex justify-between items-center mb-6 pb-4 border-b border-slate-200",
        flexCenter: "flex items-center justify-center",
        flexBetween: "flex justify-between items-center",
    },

    // --- 2. KARTY I KONTENERY DANYCH ---
    card: {
        base: "bg-white p-6 rounded-2xl shadow-sm border border-slate-100",
        hover: "bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300",
        black: "bg-black text-white p-8 rounded-2xl shadow-xl border border-[#333] relative overflow-hidden group",
        glass: "bg-white/90 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl",
        flat: "bg-slate-50 p-4 rounded-xl border border-slate-200",
    },

    // --- 3. PRZYCISKI ---
    button: {
        // Główny przycisk (Czarny)
        primary: "bg-[#0F172A] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition shadow-lg flex items-center gap-2 justify-center",
        
        // Przycisk Premium (Złoty Gradient)
        gold: "bg-gradient-to-r from-[#D4AF37] to-[#B45309] text-white px-6 py-2 rounded-lg font-bold hover:shadow-lg hover:shadow-amber-500/30 transition flex items-center gap-2 justify-center",
        
        // Przycisk z obrysem (Outline)
        outline: "border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition flex items-center gap-2 justify-center bg-white",
        
        // Ikony i akcje
        icon: "p-2 rounded-full hover:bg-slate-100 text-slate-500 transition flex items-center justify-center",
        danger: "bg-red-50 text-red-600 px-3 py-1 rounded text-xs font-bold border border-red-200 hover:bg-red-100 transition",
        success: "bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700 transition",
    },

    // --- 4. INPUTY I FORMULARZE ---
    input: {
        base: "w-full bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition",
        searchContainer: "relative group w-full max-w-xl",
        searchIcon: "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#D4AF37] transition",
        searchField: "pl-10 pr-4 py-3", // Padding dla inputu z ikoną
        select: "w-full p-2.5 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#D4AF37]",
        textarea: "w-full p-4 border border-slate-200 rounded-lg resize-none outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition",
    },

    // --- 5. TEKSTY I TYPOGRAFIA ---
    text: {
        title: "text-xl font-bold text-slate-900",
        heading: "text-2xl font-serif font-bold text-slate-900",
        subtitle: "text-sm text-slate-500",
        gold: "text-[#D4AF37]",
        label: "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block",
        valueBig: "text-2xl font-bold text-slate-800",
        valueHuge: "text-5xl font-serif font-bold text-[#0F172A]", // Dla wyceny
    },

    // --- 6. BADGE I STATUSY ---
    badge: {
        base: "px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit",
        green: "bg-green-100 text-green-700 border border-green-200",
        blue: "bg-blue-100 text-blue-700 border border-blue-200",
        amber: "bg-amber-100 text-amber-800 border border-amber-200",
        red: "bg-red-100 text-red-700 border border-red-200",
        newLead: "bg-blue-100 text-blue-700 border border-blue-200 animate-pulse",
        dark: "bg-slate-800 text-white border border-slate-700",
    },

    // --- 7. NAWIGACJA (SIDEBAR) ---
    nav: {
        // Aktywny element: Złoty gradient + Cień
        active: "bg-gradient-to-r from-[#D4AF37] via-[#F7E7CE] to-[#D4AF37] text-black font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#F7E7CE]/50 scale-105 z-10",
        // Nieaktywny: Szary, hover na złoty
        inactive: "text-slate-400 hover:text-[#F7E7CE] hover:bg-white/5 border border-transparent",
        // Kontener przycisku
        container: "relative flex items-center px-4 py-3 mx-2 my-1.5 rounded-xl cursor-pointer transition-all duration-300 ease-in-out",
        // Badge (licznik)
        badgeActive: "bg-black text-[#D4AF37]",
        badgeInactive: "bg-red-600 text-white",
    },

    // --- 8. EKRAN LOGOWANIA ---
    login: {
        wrapper: "flex h-screen w-full relative overflow-hidden font-sans text-white",
        bgOverlay: "absolute inset-0 bg-black/50", // Przyciemnienie tła
        card: "w-[450px] p-10 bg-black/80 backdrop-blur-sm rounded-xl relative border-t-2 border-l-2 border-white/10 shadow-2xl",
        input: "w-full bg-white text-slate-900 rounded-lg py-3 px-4 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition shadow-inner",
        button: "w-full bg-gradient-to-t from-[#c7a46e] to-[#e4d3aa] text-black font-bold py-3.5 rounded-lg text-lg tracking-widest uppercase hover:shadow-lg hover:shadow-amber-500/30 transition active:scale-[0.99] flex items-center justify-center gap-2 mt-8 shadow-lg shadow-black/50",
    }
};