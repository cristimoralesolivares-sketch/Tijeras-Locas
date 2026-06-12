import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  X, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  RefreshCw, 
  Sliders,
  ChevronRight,
  Phone,
  Mail,
  Zap,
  ChevronLeft,
  CalendarDays,
  ShieldAlert
} from 'lucide-react';
import { SERVICES, BARBERS, WORK_HOURS, DAYS_OF_WEEK } from '../data';
import { Service, ServiceCategory, Appointment, User as UserType } from '../types';
import { BarberMap } from './BarberMap';

interface ClientBookingProps {
  currentUser: UserType;
  appointments: Appointment[];
  onBookingComplete: (newAppointment: Appointment) => void;
  onUpdateAppointments: (updatedAppointments: Appointment[]) => void;
}

export const ClientBooking: React.FC<ClientBookingProps> = ({
  currentUser,
  appointments,
  onBookingComplete,
  onUpdateAppointments,
}) => {
  // Mobile tabs: 'book' (Agendar nueva cita), 'history' (Mis citas) or 'contact' (Contacto / Ubicación)
  const [activeTab, setActiveTab] = useState<'book' | 'history' | 'contact'>('book');

  // Booking Flow States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<string>('Andrés');
  const [selectedDay, setSelectedDay] = useState<string>('2026-06-11'); // Initial to Thursday June 11, 2026
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('TODOS');

  // Reschedule States
  const [reschedulingAppointmentId, setReschedulingAppointmentId] = useState<string | null>(null);
  const [isSuccessSummary, setIsSuccessSummary] = useState(false);
  const [successAppointment, setSuccessAppointment] = useState<Appointment | null>(null);

  // Auto-scrolling or UI enhancements or resets
  const handleSelectService = (serv: Service) => {
    setSelectedService(serv);
    // Auto clear time slot to prevent stale hours when service changes
    setSelectedTime(null);
  };

  // Compute available time slots for the selected Day and selected Barber dynamically to avoid double booking
  const getOccupiedSlots = () => {
    return appointments
      .filter(apt => 
        apt.date === selectedDay && 
        apt.professional === selectedBarber && 
        apt.status !== 'cancelled'
      )
      .map(apt => apt.time);
  };

  const occupiedSlots = getOccupiedSlots();

  // Handle final agenda registration
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedTime) return;

    // Check once more to prevent double bookings
    const occupied = getOccupiedSlots();
    if (occupied.includes(selectedTime)) {
      alert('¡Conflicto de horario! Esta hora acaba de ser tomada. Por favor elija otra hora.');
      setSelectedTime(null);
      return;
    }

    if (reschedulingAppointmentId) {
      // It was a reschedule action!
      const updated = appointments.map(apt => {
        if (apt.id === reschedulingAppointmentId) {
          return {
            ...apt,
            service: selectedService,
            professional: selectedBarber,
            date: selectedDay,
            time: selectedTime,
            totalPrice: selectedService.price
          };
        }
        return apt;
      });
      onUpdateAppointments(updated);
      setReschedulingAppointmentId(null);
      
      const rescheduledApt = updated.find(a => a.id === reschedulingAppointmentId);
      if (rescheduledApt) {
        setSuccessAppointment(rescheduledApt);
        setIsSuccessSummary(true);
      }
      
      // Reset state
      setSelectedService(null);
      setSelectedTime(null);
    } else {
      // It is a brand new booking
      const newApt: Appointment = {
        id: `apt-${Math.floor(Math.random() * 90000) + 10000}`,
        clientName: currentUser.name,
        clientPhone: currentUser.phone,
        clientEmail: currentUser.email,
        service: selectedService,
        date: selectedDay,
        time: selectedTime,
        professional: selectedBarber,
        status: 'pending',
        totalPrice: selectedService.price
      };

      onBookingComplete(newApt);
      setSuccessAppointment(newApt);
      setIsSuccessSummary(true);

      // Reset selection
      setSelectedService(null);
      setSelectedTime(null);
    }
  };

  // Filter appointments for active history
  const myAppointments = appointments.filter(
    apt => apt.clientEmail.toLowerCase() === currentUser.email.toLowerCase()
  );

  const handleCancelAppointment = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      const updated = appointments.map(apt => {
        if (apt.id === id) {
          return { ...apt, status: 'cancelled' as const };
        }
        return apt;
      });
      onUpdateAppointments(updated);
    }
  };

  const handleStartReschedule = (apt: Appointment) => {
    setReschedulingAppointmentId(apt.id);
    setSelectedService(apt.service);
    setSelectedBarber(apt.professional);
    setSelectedDay(apt.date);
    setSelectedTime(null);
    setActiveTab('book');
  };

  // Filter services by active category
  const filteredServices = selectedCategory === 'TODOS'
    ? SERVICES
    : SERVICES.filter(s => s.category === selectedCategory);

  // Barber descriptions & fun avatars
  const BARBER_META = {
    'Andrés': {
      title: 'Dueño / Master Barber 💈',
      desc: 'El fundador y maestro del local, especialista en cortes clásicos y perfilados detallados.',
      color: 'from-indigo-600 to-indigo-450',
      initials: 'AN'
    },
    'Lissy': {
      title: 'Diseño & Textura Estelar ✂️',
      desc: 'Especialista en degradados modernos y teñidos express con excelente llegada.',
      color: 'from-fuchsia-500 to-indigo-600',
      initials: 'LI'
    },
    'Meylin': {
      title: 'Precisión & Perfilado de Barbas 📐',
      desc: 'Experta en navaja tradicional y perfilado de barba perfecto con toallas calientes.',
      color: 'from-teal-500 to-emerald-600',
      initials: 'ME'
    }
  };

  // If successfully reserved or rescheduled, show Summary
  if (isSuccessSummary && successAppointment) {
    return (
      <div className="max-w-2xl mx-auto py-12" id="booking-success-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 border border-slate-200 text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-indigo-50 border border-indigo-200 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="w-10 h-10 text-indigo-600" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-indigo-600 font-bold block">
              SISTEMA INTEGRAL DE RESERVA COMPLETADO
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase">
              ¡Turno Asegurado!
            </h2>
            <p className="text-sm text-slate-900 font-black max-w-md mx-auto">
              Tu turno ha quedado asignado y registrado para evitar cualquier conflicto de horario en "Tijeras Locas".
            </p>
          </div>

          {/* Ticket Information */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left font-mono space-y-3.5 max-w-md mx-auto shadow-inner">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">Turno ID</span>
              <span className="text-xs font-bold text-slate-800 uppercase">{successAppointment.id}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">Servicio</span>
              <span className="text-xs font-bold text-slate-800 text-right">{successAppointment.service.name}</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">Barbero Estrella</span>
              <span className="text-xs font-bold text-slate-800 font-sans">{successAppointment.professional}</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">Fecha agendada</span>
              <span className="text-xs font-bold text-indigo-600">{successAppointment.date}</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <span className="text-[9px] text-slate-500 uppercase">Hora confirmada</span>
              <span className="text-xs font-bold text-indigo-600">{successAppointment.time} hrs</span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[9px] text-slate-500 uppercase font-black">Preferencia Valor</span>
              <span className="text-sm font-bold text-emerald-600">${successAppointment.totalPrice.toLocaleString('es-CL')} CLP</span>
            </div>
          </div>

          {/* Navigation Integration Guidance on successful booking */}
          <div className="text-left max-w-md mx-auto border-t border-slate-150 pt-5 space-y-4">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start space-x-3 shadow-inner">
              <span className="text-xl">🗺️</span>
              <div className="space-y-1">
                <h4 className="text-xs font-black text-indigo-800 uppercase tracking-wider">
                  ¡Tu cita está lista! Así es como puedes llegar al local
                </h4>
                <p className="text-[10px] text-indigo-600 leading-normal font-sans">
                  Usa nuestro mapa dinámico a continuación con ruta integrada para calcular el tiempo estimado de viaje en tiempo real desde tu posición.
                </p>
              </div>
            </div>

            {/* Embedded interactive live map and router */}
            <BarberMap compact={true} />
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsSuccessSummary(false);
                setSuccessAppointment(null);
                setActiveTab('history');
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg font-sans"
            >
              Ver Mis Próximas Citas
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="client-booking-module">
      
      {/* Title greeting banner */}
      <div className="bg-white border border-slate-200/90 p-6 md:p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/40 rounded-full blur-2xl pointer-events-none" />
        <div className="text-center md:text-left z-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-700 font-extrabold block mb-1">
            Portal Universitario de Autogestión
          </span>
          <h2 className="text-2xl font-black text-slate-950 uppercase tracking-wide">
            Hola, {currentUser.name}! 📚
          </h2>
          <p className="text-xs text-slate-650 font-semibold max-w-xl mt-1 leading-relaxed">
            Reserva tu corte de pelo en menos de 30 segundos. Olvídate de la libreta de papel y asegura tu horario favorito directamente en el sistema.
          </p>
        </div>

        {/* Dynamic selector to switch client views */}
        <div className="flex flex-wrap bg-slate-100/95 p-1 border border-slate-205 rounded-xl gap-1 shrink-0 z-10 shadow-sm" id="client-navigation-rail">
          <button
            onClick={() => {
              setActiveTab('book');
              setIsSuccessSummary(false);
              setSuccessAppointment(null);
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'book'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📅 Reservar Turno
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              setIsSuccessSummary(false);
              setSuccessAppointment(null);
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer relative ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            <span>Mis Citas</span>
            {myAppointments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                {myAppointments.filter(a => a.status === 'pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('contact');
              setIsSuccessSummary(false);
              setSuccessAppointment(null);
            }}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
              activeTab === 'contact'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            📍 Ubicación y Ruta
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: RESERVAR NUEVO TURNO IN <30 SECONDS */}
        {activeTab === 'book' && (
          <motion.div
            key="tab-book-flow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 animate-fadeIn"
          >
            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Services List & Barbero Choice (8 cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. SELECCIÓN DE BARBERO */}
                <div className="glass bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-50 p-2 border border-indigo-100 rounded-lg text-indigo-700">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                        1. Seleccione su Barbera o Barbero
                      </h3>
                      <p className="text-[11px] text-slate-600 font-semibold font-sans">
                        Cada profesional atiende su propia disponibilidad para garantizar servicio inmediato.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {BARBERS.map((barber) => {
                      const isSelected = selectedBarber === barber;
                      const meta = BARBER_META[barber as keyof typeof BARBER_META] || {
                        title: 'Barbero Especialista',
                        desc: 'Especialista local',
                        color: 'from-slate-700 to-slate-900',
                        initials: 'B'
                       };

                      return (
                        <div
                          key={barber}
                          onClick={() => {
                            setSelectedBarber(barber);
                            setSelectedTime(null); // Force choose time slot again
                          }}
                          className={`p-4 rounded-xl border-2 cursor-pointer text-left transition-all shadow-sm ${
                            isSelected
                              ? 'bg-indigo-50/40 border-indigo-600 ring-4 ring-indigo-100'
                              : 'bg-white border-slate-205 hover:bg-slate-50 hover:border-slate-350'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${meta.color} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                              {meta.initials}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider truncate mb-0.5">
                                {barber}
                              </h4>
                              <p className="text-[9px] font-mono text-indigo-800 font-extrabold leading-tight truncate">
                                {meta.title}
                              </p>
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-2 font-sans font-medium leading-relaxed line-clamp-2">
                            {meta.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. SELECCIÓN DE SERVICIO */}
                <div className="glass bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-indigo-50 p-2 border border-indigo-100 rounded-lg text-indigo-700">
                        <Scissors className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                          {reschedulingAppointmentId ? '✏️ Reprogramando Cita' : '2. Elige el Servicio Requerido'}
                        </h3>
                        <p className="text-[10px] text-slate-600 font-bold font-sans">
                          Lista curada con servicios humildes para varones bajo los 10K.
                        </p>
                      </div>
                    </div>

                    {/* Filter categories */}
                    <div className="flex gap-1.5 overflow-x-auto self-stretch sm:self-auto pb-1" id="category-scroller">
                      {(['TODOS', 'CORTE', 'BARBA', 'TINTURA'] as ServiceCategory[]).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-[9px] font-mono tracking-wider uppercase font-black transition-all cursor-pointer shadow-sm ${
                            selectedCategory === cat
                              ? 'bg-indigo-600 text-white border border-indigo-700'
                              : 'bg-white border border-slate-200 text-slate-700 lg:hover:bg-slate-50 lg:hover:text-slate-900'
                          }`}
                        >
                          {cat === 'TINTURA' ? 'COLOR' : cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* List of dynamic services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="client-book-services-grid">
                    {filteredServices.map((serv) => {
                      const isSelected = selectedService?.id === serv.id;
                      return (
                        <div
                          key={serv.id}
                          onClick={() => handleSelectService(serv)}
                          className={`p-4 rounded-xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between shadow-sm hover:scale-[1.01] ${
                            isSelected
                              ? 'bg-indigo-50/40 border-indigo-600 ring-2 ring-indigo-50'
                              : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide font-sans leading-tight">
                                {serv.name}
                              </h4>
                              <span className="text-[10px] font-mono text-indigo-750 font-extrabold shrink-0">
                                ⏱️ {serv.duration}m
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 leading-normal font-sans font-medium line-clamp-2">
                              {serv.description}
                            </p>
                          </div>

                          <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100">
                            <span className="text-xs font-mono font-black text-slate-900">
                              ${serv.price.toLocaleString('es-CL')} <span className="text-[8px] text-slate-500 font-normal">CLP</span>
                            </span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full animate-scale" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Side: Date Picker & Time slot grid (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 3. CALENDARIO Y HORA */}
                <div className="glass bg-white rounded-2xl p-5 border border-slate-200/80 space-y-4 shadow-sm">
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-indigo-50 p-2 border border-indigo-100 rounded-lg text-indigo-700">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                        3. Bloque Itinerario
                      </h3>
                      <p className="text-[10px] text-slate-605 font-semibold font-sans">
                        Evitamos dobles reservas de forma automática.
                      </p>
                    </div>
                  </div>

                  {/* Selector rápido de fecha */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-slate-705 block font-black">Días de esta semana (Junio 2026):</span>
                    <div className="grid grid-cols-3 gap-2">
                      {DAYS_OF_WEEK.map((day) => {
                        const isDaySelected = selectedDay === day.date;
                        return (
                          <button
                            type="button"
                            key={day.date}
                            onClick={() => {
                              setSelectedDay(day.date);
                              setSelectedTime(null);
                            }}
                            className={`py-2 px-1 rounded-xl border transition-all cursor-pointer flex flex-col justify-center items-center shadow-sm ${
                              isDaySelected
                                ? 'bg-indigo-600 border-indigo-700 text-white font-black shadow-md'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-bold'
                            }`}
                          >
                            <span className="text-[8px] font-mono uppercase tracking-widest leading-none block">{day.short}</span>
                            <span className="text-xs font-mono font-black mt-1">{day.date.substring(8)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Horas disponibles dynamically locked out */}
                  <div className="space-y-2.5 pt-3 border-t border-slate-200">
                    <span className="text-[10px] font-mono text-slate-750 font-black block">
                      Selecciona una hora para {selectedBarber}:
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {WORK_HOURS.map((hr) => {
                        const isBooked = occupiedSlots.includes(hr);
                        const isTimeSelected = selectedTime === hr;

                        return (
                          <button
                            type="button"
                            key={hr}
                            disabled={isBooked}
                            onClick={() => setSelectedTime(hr)}
                            className={`py-2.5 px-2 text-xs font-mono rounded-lg font-bold border transition-all cursor-pointer shadow-sm ${
                              isBooked
                                ? 'bg-slate-100 border-slate-205 text-slate-400 opacity-40 cursor-not-allowed line-through font-normal'
                                : isTimeSelected
                                  ? 'bg-indigo-650 border-indigo-700 text-white shadow-md font-black animate-scale'
                                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-355'
                            }`}
                          >
                            <span>{hr}</span>
                            {isBooked && <span className="block text-[7px] text-red-600 font-extrabold tracking-tighter mt-0.5">OCUPADO</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Summary of Chosen values prior to submit */}
                  {selectedService && selectedDay && selectedTime ? (
                    <div className="bg-indigo-50 border-2 border-indigo-150 rounded-xl p-4 space-y-2 text-left">
                      <span className="text-[8px] font-mono uppercase font-black text-indigo-805 tracking-wider block">PRE-AGENDA LISTA</span>
                      <p className="text-xs font-black text-slate-900 capitalize leading-snug">{selectedService.name}</p>
                      <p className="text-[11px] font-sans text-slate-700">
                        • Barbero: <strong className="text-slate-900 font-black">{selectedBarber}</strong>
                      </p>
                      <p className="text-[11px] font-sans text-slate-705">
                        • Turno: <strong className="text-slate-900 font-black">{selectedDay} @ {selectedTime} hrs</strong>
                      </p>
                      <p className="text-xs font-black text-emerald-705 font-sans pt-1">
                        Total: ${selectedService.price.toLocaleString('es-CL')} CLP
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 text-center text-[10.5px] text-slate-500 rounded-xl font-sans font-semibold leading-relaxed">
                      Completa los pasos para activar el botón de reserva instantáneo.
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!selectedService || !selectedTime}
                    className={`w-full py-3.5 rounded-xl text-xs font-black tracking-widest uppercase font-sans transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                      selectedService && selectedTime
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                        : 'bg-slate-100 border border-slate-205 text-slate-400 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>{reschedulingAppointmentId ? 'REPROGRAMAR CITA' : 'AGENDAR EN 30s'}</span>
                  </button>

                  {reschedulingAppointmentId && (
                    <button
                      type="button"
                      onClick={() => {
                        setReschedulingAppointmentId(null);
                        setSelectedService(null);
                        setSelectedTime(null);
                      }}
                      className="w-full py-2 hover:bg-slate-100 text-slate-600 text-[10px] uppercase font-mono rounded-lg transition-colors cursor-pointer font-bold"
                    >
                      Cancelar Reprogramación
                    </button>
                  )}

                </div>
              </div>

            </form>
          </motion.div>
        )}

        {/* TAB 2: MY BOOKINGS HISTORY */}
        {activeTab === 'history' && (
          <motion.div
            key="tab-history"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="glass bg-white rounded-2xl p-5 md:p-6 border border-slate-205 shadow-sm space-y-4 text-left">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                  Historial de Turnos de {currentUser.name}
                </h3>
                <p className="text-[11px] text-slate-600 font-bold font-sans mt-1">
                  Aquí puedes supervisar tus próximas citas, reprogramar tus horarios o cancelarlas gratuitamente.
                </p>
              </div>

              {myAppointments.length === 0 ? (
                <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-500 space-y-2 flex flex-col items-center justify-center bg-slate-50/50">
                  <Sliders className="w-8 h-8 text-indigo-500 animate-pulse" />
                  <p className="text-xs font-black text-slate-800 font-mono">No tienes turnos registrados actualmente en esta sesión.</p>
                  <p className="text-[10px] text-slate-500 font-bold">¡Usa la pestaña "Reservar Turno" para agendar tu primer corte!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200 space-y-1">
                  {myAppointments.map(apt => {
                    const statusColors = {
                      pending: 'bg-amber-50 border-amber-300 text-amber-800',
                      completed: 'bg-emerald-50 border-emerald-300 text-emerald-800',
                      cancelled: 'bg-rose-50 border-rose-300 text-rose-800',
                      'no-show': 'bg-slate-100 border-slate-300 text-slate-600'
                    };

                    const isUpcoming = apt.status === 'pending';

                    return (
                      <div 
                        key={apt.id} 
                        className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-50 p-3 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="text-center bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 min-w-[75px] shadow-sm">
                            <span className="block text-xs font-mono font-black text-indigo-700">{apt.time}</span>
                            <span className="block text-[8px] text-slate-600 font-black font-mono uppercase tracking-widest mt-1">
                              {apt.date.slice(8)} JUN
                            </span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">
                              {apt.service.name}
                            </h4>
                            <p className="text-[11px] text-slate-650 font-bold font-sans">
                              • Barbero/a: <strong className="text-slate-850">{apt.professional}</strong>
                            </p>
                            <p className="text-[11px] text-indigo-700 font-bold font-sans">
                              • Código de cita: <strong className="text-indigo-900 font-mono">{apt.id}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                            <span className="block text-sm font-mono font-black text-slate-900 text-right">
                              ${apt.totalPrice.toLocaleString('es-CL')}
                            </span>
                            <span className={`inline-block px-2.5 py-0.5 rounded-full border-2 text-[8px] font-mono tracking-widest font-black uppercase mt-1.5 ${statusColors[apt.status]}`}>
                              {apt.status === 'pending' ? 'PENDIENTE' : apt.status === 'completed' ? 'COMPLETADO' : apt.status === 'cancelled' ? 'CANCELADO' : 'NO ASISTIÓ'}
                            </span>
                          </div>

                          {isUpcoming && (
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleStartReschedule(apt)}
                                className="px-2.5 py-1.5 text-[9px] font-mono tracking-wider font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer flex items-center gap-0.5 shadow-sm"
                                title="Cambiar fecha u hora de la cita"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>REPROGRAMAR</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCancelAppointment(apt.id)}
                                className="px-2.5 py-1.5 text-[9px] font-mono tracking-wider font-bold bg-white border border-slate-205 hover:border-red-500 hover:text-red-650 text-slate-600 rounded-lg cursor-pointer flex items-center gap-0.5 shadow-sm transition-all"
                                title="Cancelar la cita permanentemente"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>CANCELAR</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: CONTACT & LOCATION WEB MAP */}
        {activeTab === 'contact' && (
          <motion.div
            key="tab-contact"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 text-left"
          >
            <div className="bg-white border border-slate-205 p-5 md:p-6 rounded-3xl space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                  Contacto & Ubicación Exacta
                </h3>
                <p className="text-[11px] text-slate-605 font-bold font-sans mt-1">
                  Encuentra el local de atención en el Barrio Universitario y agenda con confianza.
                </p>
              </div>
              
              <BarberMap />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-700 font-black block">Horario Universitario</span>
                  <p className="text-xs text-slate-900 font-extrabold font-sans">Lunes a Sábado: 09:00 hrs - 19:00 hrs</p>
                  <p className="text-[10px] text-slate-550 font-bold font-sans">Domingos y feriados cerrado por descanso de personal.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-700 font-black block">Consultas directas</span>
                  <p className="text-xs text-slate-900 font-sans font-bold">WhatsApp de Atención: <span className="font-extrabold">+56 9 1111 2222</span></p>
                  <p className="text-xs text-slate-700 font-bold font-sans">Socios fundadores: Andrés, Lissy y Meylin</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
