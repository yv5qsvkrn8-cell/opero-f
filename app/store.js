/* ==========================================================================================
   PLIK: store.js (FIX: DODANO INTERNAL_MARKET_ADS)
   ========================================================================================== */

export const API_URL = "https://operox-backend-102470079400.europe-central2.run.app";

export const globalStyles = `
  @media print {
    @page { margin: 0; size: A4; }
    body * { visibility: hidden; }
    #pdf-content, #pdf-content * { visibility: visible; }
    #pdf-content { position: fixed; left: 0; top: 0; width: 100%; height: 100%; padding: 40px; background: white; z-index: 9999; }
    .no-print { display: none !important; }
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .fade-enter { opacity: 0; }
  .fade-enter-active { opacity: 1; transition: opacity 300ms; }
  .slide-up { animation: slideUp 0.4s ease-out; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
`;

export const FINISHING_STANDARDS = [
  { id: 'remont', label: 'Do remontu', color: 'bg-red-100 text-red-700' },
  { id: 'refresh', label: 'Do odświeżenia', color: 'bg-orange-100 text-orange-700' },
  { id: 'turnkey', label: 'Pod klucz', color: 'bg-emerald-100 text-emerald-700' },
  { id: 'developer', label: 'Deweloperski', color: 'bg-blue-100 text-blue-700' },
  { id: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-700' }
];

export const USERS = [
  { 
    id: 1, 
    name: 'Adam Prezes', 
    role: 'CEO', 
    email: 'admin@estatepro.pl', 
    password: 'admin', 
    avatar: 'AP', 
    phone: '500 100 100', 
    license: '12345', 
    commission: 50, 
    deals: 15, 
    sales: 2500000 
  },
  { 
    id: 2, 
    name: 'Zofia Agentka', 
    role: 'Senior Agent', 
    email: 'pracownik@estatepro.pl', 
    password: 'user', 
    avatar: 'ZA', 
    phone: '500 200 200', 
    license: '67890', 
    commission: 40, 
    deals: 28, 
    sales: 4200000, 
    specialization: 'Luksusowe' 
  }
];

export const INITIAL_LEADS = [
    { 
      id: 1001, 
      type: 'buyer', 
      name: 'Jan Kowalski', 
      phone: '500123456', 
      email: 'jan.kowalski@gmail.com',
      pesel: '85010112345',
      status: 'new', 
      source: 'Otodom', 
      budget: 600000,
      preferences: 'Mieszkanie 3 pok., Wrzeszcz lub Oliwa',
      notes: 'Klient gotówkowy, zależy mu na czasie.',
      revealed: false 
    }
];

export const INITIAL_PROPERTIES = [
  { 
    id: 101, 
    title: 'Penthouse Złota 44 (Demo)', 
    price: 4500000, 
    area: 120, 
    rooms: 4, 
    floor: 44, 
    totalFloors: 52,
    year: 2020, 
    city: 'Warszawa', 
    district: 'Śródmieście', 
    street: 'Złota',
    apartmentNumber: '44A', 
    clientId: 1002, 
    ownerName: 'Anna Nowak',
    contractType: 'exclusive',
    contractDuration: '12 miesięcy',
    commission: 3.5,
    status: 'Na sprzedaż', 
    marketType: 'secondary', 
    buildingType: 'apartment',
    heating: 'city',
    standard: 'turnkey',
    balcony: true,
    elevator: true,
    parking: true,
    monitoring: true,
    approvalStatus: 'approved', 
    assignedTo: null, 
    source: 'System', 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=300&h=200', 
    desc: 'Luksusowy apartament w samym sercu Warszawy.', 
    notes: 'Klient wymaga dyskrecji.', 
    nextAction: '2023-11-15', 
    coordX: 50, 
    coordY: 40, 
    phone: '600 987 654',
    offerUrl: '#', 
    revealedPhone: false 
  },
];

export const INITIAL_EVENTS = [
  { id: 1, title: 'Akt Notarialny', time: '10:00', client: 'Michał Wiśniewski', type: 'notary', day: 5, linkedPropertyId: 101 },
  { id: 2, title: 'Prezentacja Penthouse', time: '14:30', client: 'Anna Lewandowska', type: 'presentation', day: 12, linkedPropertyId: 101 }
];

// DODANO BRAKUJĄCĄ ZMIENNĄ
export const INTERNAL_MARKET_ADS = []; 

export const AGENT_RANKING = [
  { id: 2, name: 'Zofia Agentka', sales: 4200000, deals: 3 },
  { id: 1, name: 'Adam Prezes', sales: 2500000, deals: 1 }
];

export const DISTRICTS_DATA = [
  { 
    id: 1, 
    name: 'Gdańsk Wrzeszcz', 
    desc: 'Serce komunikacyjne miasta. Idealne dla studentów i inwestorów.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 7, fullMark: 10 },
      { subject: 'Komunikacja (SKM)', A: 10, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 10, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 5, fullMark: 10 },
      { subject: 'Prestiż', A: 8, fullMark: 10 },
      { subject: 'Edukacja', A: 9, fullMark: 10 }
    ],
    priceLevel: 'Wysoka',
    bestFor: 'Student, Inwestor, Singiel'
  }
];
