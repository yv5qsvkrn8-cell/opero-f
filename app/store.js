/* ==========================================================================================
   PLIK: store.js (FULL DATA FOR PREMIUM VERSION)
   ========================================================================================== */

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

// --- NOWA KONFIGURACJA STANDARDÓW WYKOŃCZENIA (TO BYŁO BRAKUJĄCE) ---
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
    email: 'adam@grandestates.pl', 
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
    email: 'zofia@grandestates.pl', 
    password: 'user123', 
    avatar: 'ZA', 
    phone: '500 200 200', 
    license: '67890', 
    commission: 40, 
    deals: 28, 
    sales: 4200000, 
    specialization: 'Luksusowe' 
  },
  { 
    id: 3, 
    name: 'Julka Asystentka', 
    role: 'Support', 
    email: 'biuro@grandestates.pl', 
    password: 'biuro', 
    avatar: 'JA', 
    phone: '58 555 00 00', 
    license: '', 
    commission: 0, 
    deals: 0, 
    sales: 0 
  },
  { 
    id: 4, 
    name: 'Marek Handlowiec', 
    role: 'Agent', 
    email: 'marek@grandestates.pl', 
    password: 'marek', 
    avatar: 'MH', 
    phone: '500 300 300', 
    license: '11223', 
    commission: 30, 
    deals: 12, 
    sales: 850000 
  },
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
    },
    { 
      id: 1002, 
      type: 'seller', 
      name: 'Anna Nowak', 
      phone: '600987654', 
      email: 'anna.nowak@onet.pl',
      pesel: '92031509876',
      status: 'meeting',
      source: 'Facebook', 
      propertyDetails: 'Dom w Osowej, 150m2',
      priceExpectation: 1200000,
      notes: 'Spotkanie umówione na wtorek.',
      revealed: true 
    },
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
    
    // DANE WŁAŚCICIELA I UMOWY
    clientId: 1002, 
    ownerName: 'Anna Nowak',
    contractType: 'exclusive',
    contractDuration: '12 miesięcy',
    commission: 3.5,

    status: 'Na sprzedaż', 
    marketType: 'secondary', 
    buildingType: 'apartment',
    heating: 'city',
    
    // STANDARD
    standard: 'turnkey',

    balcony: true,
    elevator: true,
    parking: true,
    monitoring: true,
    approvalStatus: 'approved', 
    assignedTo: null, 
    source: 'System', 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=300&h=200', 
    desc: 'Luksusowy apartament w samym sercu Warszawy. Zapierający dech w piersiach widok.', 
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
  { 
    id: 1, 
    title: 'Akt Notarialny', 
    time: '10:00', 
    client: 'Michał Wiśniewski', 
    type: 'notary', 
    day: 5, 
    linkedPropertyId: 101 
  },
  { 
    id: 2, 
    title: 'Prezentacja Penthouse', 
    time: '14:30', 
    client: 'Anna Lewandowska', 
    type: 'presentation', 
    day: 12, 
    linkedPropertyId: 101 
  },
  { 
    id: 3, 
    title: 'Spotkanie w biurze', 
    time: '09:00', 
    client: 'Krzysztof Krawczyk', 
    type: 'meeting', 
    day: 15, 
    linkedPropertyId: null 
  },
];

export const AGENT_RANKING = [
  { id: 2, name: 'Zofia Agentka', sales: 4200000, deals: 3 },
  { id: 1, name: 'Adam Prezes', sales: 2500000, deals: 1 },
  { id: 4, name: 'Marek Handlowiec', sales: 850000, deals: 2 },
];

export const INTERNAL_MARKET_ADS = [
    { id: 1, type: 'szukam', title: 'Klient gotówkowy, 3 pokoje, Wrzeszcz', budget: '800k', author: 'Zofia Agentka' },
    { id: 2, type: 'coming_soon', title: 'Willa na Morenie (w przygotowaniu)', budget: '2.5mln', author: 'Adam Prezes' },
];

export const SCRIPTS = [
  { category: 'Zimny Telefon', title: 'Właściciel (Sprzedajemy.pl)', content: 'Dzień dobry, dzwonię z Grand Estates w nawiązaniu do oferty na portalu...' },
  { category: 'Negocjacje', title: 'Zbijanie ceny', content: 'Rozumiem Pana oczekiwania, jednak analiza cen transakcyjnych...' },
  { category: 'Finalizacja', title: 'Domknięcie umowy', content: 'Gratuluję decyzji! Mamy wolny termin u notariusza...' },
];

export const GDANSK_STATS = [
  { name: 'Śródmieście', cenaM2: 18500 }, { name: 'Oliwa', cenaM2: 16200 }, { name: 'Sopot', cenaM2: 24000 },
  { name: 'Gdynia Orł.', cenaM2: 21000 }, { name: 'Wrzeszcz', cenaM2: 15500 },
];

export const SOURCE_STATS = [
  { name: 'Otodom', leads: 45 }, { name: 'Sprzedajemy', leads: 32 }, { name: 'Facebook', leads: 18 }, { name: 'Polecenia', leads: 25 },
];

export const DISTRICTS_DATA = [
  { 
    id: 1, 
    name: 'Gdańsk Wrzeszcz', 
    desc: 'Serce komunikacyjne miasta. Idealne dla studentów i inwestorów. Mnóstwo usług, galerii (Bałtycka, Metropolia), ale głośno i tłoczno.',
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
  },
  { 
    id: 2, 
    name: 'Gdańsk Oliwa', 
    desc: 'Biznesowe i parkowe centrum. Prestiżowa, cicha dzielnica z Parkiem Oliwskim, ZOO i nowoczesnymi biurowcami (OBC, Alchemia).',
    stats: [
      { subject: 'Bezpieczeństwo', A: 9, fullMark: 10 },
      { subject: 'Komunikacja (SKM)', A: 9, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 7, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 10, fullMark: 10 },
      { subject: 'Prestiż', A: 10, fullMark: 10 },
      { subject: 'Edukacja', A: 9, fullMark: 10 }
    ],
    priceLevel: 'Bardzo Wysoka',
    bestFor: 'Rodzina, Manager, Senior'
  },
  { 
    id: 3, 
    name: 'Gdańsk Śródmieście', 
    desc: 'Turystyczne serce. Piękne kamienice, Starówka, Motława. Problemy z parkowaniem i hałas turystyczny. Top pod najem krótkoterminowy.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 6, fullMark: 10 },
      { subject: 'Komunikacja (SKM)', A: 8, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 9, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 4, fullMark: 10 },
      { subject: 'Prestiż', A: 9, fullMark: 10 },
      { subject: 'Edukacja', A: 7, fullMark: 10 }
    ],
    priceLevel: 'Bardzo Wysoka',
    bestFor: 'Inwestor (Dobowy), Turysta'
  },
  { 
    id: 4, 
    name: 'Gdańsk Południe (Ujeścisko/Lostowice)', 
    desc: 'Wielka sypialnia Gdańska. Nowe budownictwo, taniej, bezpiecznie dla rodzin, ale trudny dojazd do centrum w godzinach szczytu.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 8, fullMark: 10 },
      { subject: 'Komunikacja', A: 4, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 6, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 7, fullMark: 10 },
      { subject: 'Prestiż', A: 5, fullMark: 10 },
      { subject: 'Edukacja', A: 6, fullMark: 10 }
    ],
    priceLevel: 'Średnia/Niska',
    bestFor: 'Młoda Rodzina, Pierwsze Mieszkanie'
  },
  { 
    id: 5, 
    name: 'Gdańsk Przymorze', 
    desc: 'Najludniejsza dzielnica. Słynne falowce i nowe apartamentowce. Blisko morza, Parku Reagana i świetna infrastruktura handlowa.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 8, fullMark: 10 },
      { subject: 'Komunikacja (SKM)', A: 8, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 9, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 6, fullMark: 10 },
      { subject: 'Prestiż', A: 7, fullMark: 10 },
      { subject: 'Edukacja', A: 8, fullMark: 10 }
    ],
    priceLevel: 'Wysoka',
    bestFor: 'Rodzina, Inwestor, Student'
  },
  { 
    id: 6, 
    name: 'Gdańsk Zaspa', 
    desc: 'Osiedle-ogród z wielkiej płyty, słynące z murali. Dużo przestrzeni między blokami, blisko morza, świetna komunikacja tramwajowa i SKM.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 8, fullMark: 10 },
      { subject: 'Komunikacja (SKM)', A: 9, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 8, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 8, fullMark: 10 },
      { subject: 'Prestiż', A: 6, fullMark: 10 },
      { subject: 'Edukacja', A: 8, fullMark: 10 }
    ],
    priceLevel: 'Średnia/Wysoka',
    bestFor: 'Rodzina, Student, Senior'
  },
  { 
    id: 7, 
    name: 'Gdańsk Morena (Piecki-Migowo)', 
    desc: 'Położona na wzgórzach morenowych. Świetne widoki, nowa linia tramwajowa (PKM), dużo lasów dookoła. Bardzo popularna wśród rodzin.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 8, fullMark: 10 },
      { subject: 'Komunikacja (PKM)', A: 8, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 8, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 8, fullMark: 10 },
      { subject: 'Prestiż', A: 6, fullMark: 10 },
      { subject: 'Edukacja', A: 7, fullMark: 10 }
    ],
    priceLevel: 'Średnia',
    bestFor: 'Rodzina 2+2, Aktywni'
  },
  { 
    id: 8, 
    name: 'Gdańsk Jelitkowo', 
    desc: 'Ekskluzywna, nadmorska dzielnica granicząca z Sopotem. Niska zabudowa, hotele, plaża. Jedna z najdroższych lokalizacji.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 9, fullMark: 10 },
      { subject: 'Komunikacja', A: 6, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 5, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 10, fullMark: 10 },
      { subject: 'Prestiż', A: 10, fullMark: 10 },
      { subject: 'Edukacja', A: 5, fullMark: 10 }
    ],
    priceLevel: 'Ekstremalnie Wysoka',
    bestFor: 'Inwestor Premium, Rentier'
  },
  { 
    id: 9, 
    name: 'Gdańsk Chełm', 
    desc: 'Pierwsza dzielnica na "Górnym Tarasie". Bardzo blisko centrum (tramwaj), pełna infrastruktura. Gęsta zabudowa blokowa.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 7, fullMark: 10 },
      { subject: 'Komunikacja', A: 8, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 9, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 5, fullMark: 10 },
      { subject: 'Prestiż', A: 5, fullMark: 10 },
      { subject: 'Edukacja', A: 7, fullMark: 10 }
    ],
    priceLevel: 'Średnia',
    bestFor: 'Rodzina, Wynajem budżetowy'
  },
  { 
    id: 10, 
    name: 'Gdańsk Osowa', 
    desc: 'Peryferyjna dzielnica willowa przy obwodnicy. Własny mikroklimat, jeziora. Cicho, ale daleko do centrum (korki).',
    stats: [
      { subject: 'Bezpieczeństwo', A: 9, fullMark: 10 },
      { subject: 'Komunikacja', A: 4, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 7, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 9, fullMark: 10 },
      { subject: 'Prestiż', A: 7, fullMark: 10 },
      { subject: 'Edukacja', A: 8, fullMark: 10 }
    ],
    priceLevel: 'Średnia/Wysoka (Domy)',
    bestFor: 'Rodzina z dziećmi, Dom z ogrodem'
  },
  { 
    id: 11, 
    name: 'Gdańsk Brzeźno', 
    desc: 'Nadmorska dzielnica z molem i plażą. Mieszanka starych rybackich domków, bloków z PRL i nowych apartamentowców.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 7, fullMark: 10 },
      { subject: 'Komunikacja', A: 7, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 6, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 9, fullMark: 10 },
      { subject: 'Prestiż', A: 7, fullMark: 10 },
      { subject: 'Edukacja', A: 6, fullMark: 10 }
    ],
    priceLevel: 'Wysoka (przy plaży)',
    bestFor: 'Inwestor (Lato), Senior'
  },
  { 
    id: 12, 
    name: 'Gdańsk Jasień', 
    desc: 'Dynamicznie rozwijająca się dzielnica deweloperska. Nowoczesne osiedla, stosunkowo tanie mieszkania, ale mało zieleni wysokiej.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 8, fullMark: 10 },
      { subject: 'Komunikacja (PKM)', A: 6, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 6, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 6, fullMark: 10 },
      { subject: 'Prestiż', A: 5, fullMark: 10 },
      { subject: 'Edukacja', A: 6, fullMark: 10 }
    ],
    priceLevel: 'Średnia',
    bestFor: 'Start w dorosłość, Singiel'
  },
  { 
    id: 13, 
    name: 'Gdańsk Letnica', 
    desc: 'Dzielnica rewitalizowana wokół stadionu Polsat Plus Arena. Nowoczesne wieżowce, blisko tunelu pod Martwą Wisłą. Duży potencjał wzrostu.',
    stats: [
      { subject: 'Bezpieczeństwo', A: 7, fullMark: 10 },
      { subject: 'Komunikacja', A: 6, fullMark: 10 },
      { subject: 'Usługi/Sklepy', A: 5, fullMark: 10 },
      { subject: 'Zieleń/Cisza', A: 5, fullMark: 10 },
      { subject: 'Prestiż', A: 7, fullMark: 10 },
      { subject: 'Edukacja', A: 4, fullMark: 10 }
    ],
    priceLevel: 'Średnia/Wysoka',
    bestFor: 'Inwestor (Flip/Najem), Fan sportu'
  }
];