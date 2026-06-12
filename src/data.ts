import { Service, Appointment } from './types';

export const BARBERS = [
  'Andrés',
  'Lissy',
  'Meylin'
];

export const SERVICES: Service[] = [
  {
    id: 'corte-clasico',
    name: 'Corte Clásico Varón',
    category: 'CORTE',
    price: 6500,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=600&auto=format&fit=crop',
    description: 'Corte tradicional a tijera o máquina. Sencillo, limpio y prolijo para el día a día.',
    details: [
      'Corte personalizado tradicional',
      'Peinado prolijo con pomada o cera suave'
    ]
  },
  {
    id: 'corte-fade',
    name: 'Degradado / Fade Humilde',
    category: 'CORTE',
    price: 8500,
    duration: 35,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop',
    description: 'Un fade nítido (degradado lateral) para refrescar el estilo con un precio súper accesible.',
    details: [
      'Degradado a elección (bajo, medio, alto)',
      'Perfilado de contornos a ras con navaja tradicional'
    ]
  },
  {
    id: 'perfilado-barba',
    name: 'Perfilado de Barba',
    category: 'BARBA',
    price: 5000,
    duration: 25,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop',
    description: 'Delineado y rebaje de barba con máquina y navaja de afeitar para un contorno limpio.',
    details: [
      'Rebaje uniforme del vello facial',
      'Perfilado de mejillas y cuello con navaja tradicional'
    ]
  },
  {
    id: 'tintura-express',
    name: 'Teñido de Cabello Express',
    category: 'TINTURA',
    price: 9000,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
    description: 'Cobertura rápida o teñido básico masculino para un cambio de look express.',
    details: [
      'Lavado capilar previo',
      'Aplicación express de tintura o matizante de canas',
      'Secado rápido'
    ]
  },
  {
    id: 'lavado-simple',
    name: 'Lavado Capilar Simple',
    category: 'CORTE',
    price: 3000,
    duration: 15,
    image: 'https://images.unsplash.com/photo-1593702295094-aec22597af65?q=80&w=600&auto=format&fit=crop',
    description: 'Lavado revitalizante de cabello con champú de mentol fresco y masaje express.',
    details: [
      'Lavado con champú de menta refrescante',
      'Masaje capilar suave y secado'
    ]
  },
  {
    id: 'corte-barba-vip',
    name: 'Corte VIP + Perfilado de Barba Estelar',
    category: 'CORTE',
    price: 12500,
    duration: 50,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=600&auto=format&fit=crop',
    description: 'Nuestro servicio de vanguardia. Corte premium, degradado personalizado, lavado profundo con masaje capilar y perfilado de barba completo con toallas calientes.',
    details: [
      'Corte de cabello personalizado con lavado de sienes',
      'Delineado tradicional con toalla de vapor',
      'Loción mentolada fresca'
    ]
  },
  {
    id: 'corte-tintura-premium',
    name: 'Teñido + Corte Universitario Premium',
    category: 'TINTURA',
    price: 14000,
    duration: 75,
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=600&auto=format&fit=crop',
    description: 'El combo definitivo para universitarios. Incluye tinte premium o decoloración parcial express más un corte fade ultra-nítido.',
    details: [
      'Tinte de color express de alta calidad',
      'Corte fade nítido a ras',
      'Peinado esculpido'
    ]
  },
  {
    id: 'fade-diseno-vip',
    name: 'Corte Fade con Diseño + Masaje Capilar VIP',
    category: 'CORTE',
    price: 11500,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop',
    description: 'Degradado moderno con diseño de líneas a navaja, más lavado con shampoo hidratante y masaje de cuero cabelludo muy relajante.',
    details: [
      'Degradado a elección (skin fade, taper)',
      'Diseño artístico lateral simple',
      'Lavado capilar con masaje relajante'
    ]
  }
];

// Seeded appointments for "Tijeras Locas" around Thursday 2026-06-11
export const INITIAL_APPOINTMENTS: Appointment[] = [
  // --- THURSDAY 2026-06-11 (TODAY) ---
  {
    id: 'apt-today-pf1',
    clientName: 'Pedro Pascal',
    clientPhone: '+56977771234',
    clientEmail: 'pedro.pascal@correo.cl',
    service: {
      id: 'corte-barba-vip',
      name: 'Corte VIP + Perfilado de Barba Estelar',
      category: 'CORTE',
      price: 12500,
      duration: 50,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-11',
    time: '13:00',
    professional: 'Andrés',
    status: 'pending',
    totalPrice: 12500
  },
  {
    id: 'apt-today-pf2',
    clientName: 'Leonardo DiCaprio',
    clientPhone: '+56988884321',
    clientEmail: 'leo.dicaprio@correo.cl',
    service: {
      id: 'corte-tintura-premium',
      name: 'Teñido + Corte Universitario Premium',
      category: 'TINTURA',
      price: 14000,
      duration: 75,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-11',
    time: '17:00',
    professional: 'Lissy',
    status: 'pending',
    totalPrice: 14000
  },
  {
    id: 'apt-today-pf3',
    clientName: 'Keanu Reeves',
    clientPhone: '+56999991111',
    clientEmail: 'keanu@matrix.cl',
    service: {
      id: 'fade-diseno-vip',
      name: 'Corte Fade con Diseño + Masaje Capilar VIP',
      category: 'CORTE',
      price: 11500,
      duration: 45,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-11',
    time: '11:00',
    professional: 'Meylin',
    status: 'completed',
    totalPrice: 11500
  },
  {
    id: 'apt-today-pf4',
    clientName: 'Ben Brereton',
    clientPhone: '+56933334444',
    clientEmail: 'benny@chile.cl',
    service: {
      id: 'corte-barba-vip',
      name: 'Corte VIP + Perfilado de Barba Estelar',
      category: 'CORTE',
      price: 12500,
      duration: 50,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-11',
    time: '15:00',
    professional: 'Andrés',
    status: 'pending',
    totalPrice: 12500
  },
  {
    id: 'apt-today-pf5',
    clientName: 'Claudio Bravo',
    clientPhone: '+56955556666',
    clientEmail: 'claudio.bravo@correo.cl',
    service: {
      id: 'fade-diseno-vip',
      name: 'Corte Fade con Diseño + Masaje Capilar VIP',
      category: 'CORTE',
      price: 11500,
      duration: 45,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-11',
    time: '19:00',
    professional: 'Meylin',
    status: 'pending',
    totalPrice: 11505
  },
  {
    id: 'apt-today-pf6',
    clientName: 'Robert Downey Jr.',
    clientPhone: '+56934343434',
    clientEmail: 'tony.stark@correo.cl',
    service: {
      id: 'corte-tintura-premium',
      name: 'Teñido + Corte Universitario Premium',
      category: 'TINTURA',
      price: 14000,
      duration: 75,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-11',
    time: '14:00',
    professional: 'Lissy',
    status: 'pending',
    totalPrice: 14000
  },
  {
    id: 'apt-today-1',
    clientName: 'Eduardo Valenzuela',
    clientPhone: '+56988223344',
    clientEmail: 'edu.valenzuela@correo.cl',
    service: SERVICES[0], // Corte Clásico (6.5k)
    date: '2026-06-11',
    time: '09:00',
    professional: 'Lissy',
    status: 'completed',
    totalPrice: 6500
  },
  {
    id: 'apt-today-2',
    clientName: 'Sebastián Pinilla',
    clientPhone: '+56977334455',
    clientEmail: 'seba.pini@correo.cl',
    service: SERVICES[1], // Fade Humilde (8.5k)
    date: '2026-06-11',
    time: '10:00',
    professional: 'Lissy',
    status: 'completed',
    totalPrice: 8500
  },
  {
    id: 'apt-today-3',
    clientName: 'Javier Toledo',
    clientPhone: '+56966442211',
    clientEmail: 'javito@correo.cl',
    service: SERVICES[2], // Perfilado barba (5k)
    date: '2026-06-11',
    time: '11:00',
    professional: 'Meylin',
    status: 'completed',
    totalPrice: 5000
  },
  {
    id: 'apt-today-4',
    clientName: 'Martín Cárcamo',
    clientPhone: '+56955551122',
    clientEmail: 'martin@correo.cl',
    service: SERVICES[2], // Perfilado barba (5k)
    date: '2026-06-11',
    time: '12:00',
    professional: 'Meylin',
    status: 'no-show',
    totalPrice: 5000
  },
  {
    id: 'apt-today-5',
    clientName: 'Rodrigo Errázuriz',
    clientPhone: '+56911223344',
    clientEmail: 'vip.rodrigo@gmail.com',
    service: SERVICES[1], // Fade (8.5k)
    date: '2026-06-11',
    time: '14:00',
    professional: 'Andrés',
    status: 'pending',
    totalPrice: 8500
  },
  {
    id: 'apt-today-6',
    clientName: 'Ignacio Larraín',
    clientPhone: '+56944331199',
    clientEmail: 'nachol@correo.cl',
    service: SERVICES[1], // Fade (8.5k)
    date: '2026-06-11',
    time: '15:00',
    professional: 'Lissy',
    status: 'pending',
    totalPrice: 8500
  },
  {
    id: 'apt-today-7',
    clientName: 'Matías Fernández',
    clientPhone: '+56914141414',
    clientEmail: 'matias14@correo.cl',
    service: SERVICES[3], // Teñido (9k)
    date: '2026-06-11',
    time: '16:00',
    professional: 'Andrés',
    status: 'pending',
    totalPrice: 9000
  },
  {
    id: 'apt-today-8',
    clientName: 'Gabriel Boric',
    clientPhone: '+56922335566',
    clientEmail: 'gabriel@presidencia.cl',
    service: SERVICES[2], // Perfilado barba (5k)
    date: '2026-06-11',
    time: '18:00',
    professional: 'Meylin',
    status: 'pending',
    totalPrice: 5000
  },

  // --- PAST DAYS THIS WEEK ---
  {
    id: 'apt-past-pf1',
    clientName: 'Brad Pitt',
    clientPhone: '+56999912122',
    clientEmail: 'brad.pitt@correo.cl',
    service: {
      id: 'corte-barba-vip',
      name: 'Corte VIP + Perfilado de Barba Estelar',
      category: 'CORTE',
      price: 12500,
      duration: 50,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-10',
    time: '16:00',
    professional: 'Andrés',
    status: 'completed',
    totalPrice: 12500
  },
  {
    id: 'apt-past-pf2',
    clientName: 'Johnny Depp',
    clientPhone: '+56910101011',
    clientEmail: 'johnny.depp@correo.cl',
    service: {
      id: 'corte-tintura-premium',
      name: 'Teñido + Corte Universitario Premium',
      category: 'TINTURA',
      price: 14000,
      duration: 75,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-09',
    time: '14:00',
    professional: 'Lissy',
    status: 'completed',
    totalPrice: 14000
  },
  {
    id: 'apt-past-pf3',
    clientName: 'Gary Medel',
    clientPhone: '+56958585858',
    clientEmail: 'pitbull@correo.cl',
    service: {
      id: 'fade-diseno-vip',
      name: 'Corte Fade con Diseño + Masaje Capilar VIP',
      category: 'CORTE',
      price: 11500,
      duration: 45,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-08',
    time: '11:00',
    professional: 'Meylin',
    status: 'completed',
    totalPrice: 11505
  },
  {
    id: 'apt-past-pf4',
    clientName: 'Charles Aránguiz',
    clientPhone: '+56920202020',
    clientEmail: 'aranguiz@correo.cl',
    service: {
      id: 'corte-barba-vip',
      name: 'Corte VIP + Perfilado de Barba Estelar',
      category: 'CORTE',
      price: 12500,
      duration: 50,
      image: '',
      description: '',
      details: []
    },
    date: '2026-06-10',
    time: '10:00',
    professional: 'Andrés',
    status: 'completed',
    totalPrice: 12500
  },
  {
    id: 'apt-past-1',
    clientName: 'Álvaro Díaz',
    clientPhone: '+5697771122',
    clientEmail: 'alvaro@correo.cl',
    service: SERVICES[1], // Fade (8.5k)
    date: '2026-06-08',
    time: '11:00',
    professional: 'Andrés',
    status: 'completed',
    totalPrice: 8500
  },
  {
    id: 'apt-past-2',
    clientName: 'Felipe Avello',
    clientPhone: '+56911227788',
    clientEmail: 'avello@pecesito.cl',
    service: SERVICES[1], // Fade (8.5k)
    date: '2026-06-09',
    time: '15:00',
    professional: 'Andrés',
    status: 'completed',
    totalPrice: 8500
  },
  {
    id: 'apt-past-3',
    clientName: 'Pedro Ruminot',
    clientPhone: '+56911334455',
    clientEmail: 'pedro@correo.cl',
    service: SERVICES[0], // Corte (6.5k)
    date: '2026-06-10',
    time: '13:00',
    professional: 'Andrés',
    status: 'completed',
    totalPrice: 6500
  },
  {
    id: 'apt-past-4',
    clientName: 'Christian Bale',
    clientPhone: '+56944332211',
    clientEmail: 'bale@batman.cl',
    service: SERVICES[3], // Teñido (9k)
    date: '2026-06-08',
    time: '15:00',
    professional: 'Lissy',
    status: 'completed',
    totalPrice: 9000
  },
  {
    id: 'apt-past-5',
    clientName: 'Alexis Sánchez',
    clientPhone: '+56999988877',
    clientEmail: 'alexis@maravilla.cl',
    service: SERVICES[1], // Fade (8.5k)
    date: '2026-06-10',
    time: '12:00',
    professional: 'Lissy',
    status: 'completed',
    totalPrice: 8500
  },
  {
    id: 'apt-past-7',
    clientName: 'Arturo Vidal',
    clientPhone: '+56923232323',
    clientEmail: 'king@correo.cl',
    service: SERVICES[1], // Fade (8.5k)
    date: '2026-06-08',
    time: '10:00',
    professional: 'Meylin',
    status: 'completed',
    totalPrice: 8500
  }
];

export const WORK_HOURS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00'
];

export const DAYS_OF_WEEK = [
  { short: 'Lun', label: 'Lunes', date: '2026-06-08' },
  { short: 'Mar', label: 'Martes', date: '2026-06-09' },
  { short: 'Mie', label: 'Miércoles', date: '2026-06-10' },
  { short: 'Jue', label: 'Jueves', date: '2026-06-11' }, // Today
  { short: 'Vie', label: 'Viernes', date: '2026-06-12' },
  { short: 'Sab', label: 'Sábado', date: '2026-06-13' }
];
