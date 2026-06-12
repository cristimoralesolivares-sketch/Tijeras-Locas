import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Activity, 
  CheckCircle, 
  ChevronLeft,
  ChevronRight, 
  Calendar, 
  Flame, 
  User, 
  Check,
  RotateCcw,
  Scissors,
  DollarSign,
  Briefcase,
  AlertCircle,
  HelpCircle,
  Sliders,
  CalendarDays,
  Zap,
  BarChart3,
  ListOrdered
} from 'lucide-react';
import { SERVICES, BARBERS, WORK_HOURS, DAYS_OF_WEEK } from '../data';
import { Appointment, User as UserType, Service } from '../types';

interface ProDashboardProps {
  currentUser: UserType;
  appointments: Appointment[];
  onUpdateAppointments: (updated: Appointment[]) => void;
  onAddBookingRedirect: () => void;
}

export const ProDashboard: React.FC<ProDashboardProps> = ({ 
  currentUser,
  appointments,
  onUpdateAppointments,
  onAddBookingRedirect
}) => {
  const isAdmin = currentUser.role === 'admin';

  // State to filter Master Agenda by Day in the Dashboard
  const [selectedAgendaDay, setSelectedAgendaDay] = useState<string>('2026-06-11'); // Initial Thursday June 11, 2026

  // State to track simulated promotions spawned for low-demand hour gaps
  const [activePromotions, setActivePromotions] = useState<Array<{hour: string; discount: number; code: string}>>([]);

  // Restores state of the whole booking system (Appointments) to default
  const handleResetAppointments = () => {
    if (window.confirm('¿Desea restablecer el estado inicial de las citas de Tijeras Locas para demostración?')) {
      // Re-seed original data
      onUpdateAppointments(appointments);
      localStorage.removeItem('tijeras_locas_appointments');
      window.location.reload();
    }
  };

  // Change status of a specific appointment
  const handleUpdateStatus = (id: string, newStatus: 'completed' | 'no-show' | 'cancelled' | 'pending') => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: newStatus };
      }
      return apt;
    });
    onUpdateAppointments(updated);
  };

  // Filter appointments according to user rights
  const getVisibleAppointments = () => {
    if (isAdmin) {
      return appointments.filter(apt => apt.date === selectedAgendaDay);
    } else {
      // Filter by current barbero name
      return appointments.filter(
        apt => apt.professional.toLowerCase() === currentUser.name.toLowerCase() && apt.date === selectedAgendaDay
      );
    }
  };

  const visibleAppointments = getVisibleAppointments();

  // --- BUSINESS INTELLIGENCE COMPUTATIONS (STRICTLY FOR ADMIN ANDRES) ---
  
  // 1. Team Performance: appointments count and revenue per barber
  const getTeamPerformance = () => {
    const barberPerf = BARBERS.map(name => {
      const barberApts = appointments.filter(a => a.professional === name);
      const completedApts = barberApts.filter(a => a.status === 'completed');
      const revenue = completedApts.reduce((sum, a) => sum + a.totalPrice, 0);
      return {
        name,
        totalBookings: barberApts.length,
        completedCount: completedApts.length,
        noShowCount: barberApts.filter(a => a.status === 'no-show').length,
        revenue
      };
    });
    return barberPerf;
  };

  const teamPerformance = getTeamPerformance();

  // 2. Service Analysis: most requested vs least requested
  const getServiceAnalysis = () => {
    const counts = SERVICES.map(service => {
      const serviceApts = appointments.filter(a => a.service.id === service.id);
      const timesBooked = serviceApts.length;
      return {
        serviceName: service.name,
        timesBooked,
        revenue: serviceApts.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.totalPrice, 0)
      };
    }).sort((a, b) => b.timesBooked - a.timesBooked); // Descending requested

    return counts;
  };

  const serviceAnalysis = getServiceAnalysis();
  const mostRequested = serviceAnalysis[0];
  const leastRequested = serviceAnalysis[serviceAnalysis.length - 1];

  // 3. Time Optimization: heatmaps and empty gaps analysis
  const getHourlyOccupancy = () => {
    const reports = WORK_HOURS.map(hour => {
      const concurrentBookings = appointments.filter(a => a.date === selectedAgendaDay && a.time === hour && a.status !== 'cancelled');
      const chairsBooked = concurrentBookings.length; // max 3 (Andres, Meylin, Lissy)
      const occupants = concurrentBookings.map(c => c.professional);
      const isGaps = chairsBooked < 3;
      return {
        hour,
        chairsBooked,
        occupants,
        isGaps,
        percentage: Math.round((chairsBooked / 3) * 100)
      };
    });
    return reports;
  };

  const hourlyOccupancy = getHourlyOccupancy();

  // Trigger quick university discount promo code for low occupancy hours
  const handleGeneratePromoForHour = (hour: string) => {
    const code = `HAPPY-${hour.replace(':', '')}-${Math.floor(10 + Math.random() * 90)}`;
    setActivePromotions(prev => [...prev, { hour, discount: 20, code }]);
  };

  return (
    <div className="space-y-8 text-left" id="pro-dashboard-root">
      
      {/* Dynamic Header Banner */}
      <div 
        className="relative overflow-hidden rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md bg-white"
        id="hero-banner-dashboard"
      >
        <div className="space-y-1.5 text-left z-10">
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-indigo-650 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-indigo-700 font-black">
              {isAdmin ? 'MÓDULO DE ADMINISTRACIÓN GENERAL' : `MÓDULO DE AGENDA CENTRALIZADA • STAFF`}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase text-slate-900 tracking-wide">
            {isAdmin ? `Dashboard de Andrés` : `Agenda de ${currentUser.name}`}
          </h2>
          <p className="text-xs text-slate-600 max-w-xl font-sans leading-relaxed">
            {isAdmin 
              ? 'Control total del itinerario de barberos, análisis de finanzas y optimización automática de horas vacías.'
              : 'Lista de turnos asignados del día. Marca rápidamente el estado de asistencia de los estudiantes.'}
          </p>
        </div>

        {isAdmin && (
          <div className="flex gap-2 shrink-0 z-10">
            <button
              onClick={handleResetAppointments}
              className="px-4 py-2 bg-slate-50 border border-slate-250 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs uppercase tracking-wider font-sans font-black transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
              title="Restaurar de fábrica las citas para demostración limpia"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar Entorno</span>
            </button>
          </div>
        )}
      </div>

      {/* ADMIN INTEL: BUSINESS INTELLIGENCE SUITE (STRICTLY SECURED & VISIBLE ONLY FOR ADMIN ANDRES) */}
      {isAdmin ? (
        <div className="space-y-6" id="admin-bi-suite">
          
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <BarChart3 className="w-5 h-5 text-indigo-700" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
              Inteligencia de Negocios (KPIs Andrés)
            </h3>
          </div>

          {/* KPI grid row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. TEAM PERFORMANCE KPI CARD */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-indigo-600 flex flex-col justify-between text-left space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-widest text-[#4f46e5] uppercase font-black block">
                  Rendimiento del Equipo (Sillas)
                </span>
                <p className="text-xs text-slate-600 font-bold font-sans leading-relaxed">
                  Citas completadas e ingresos generados acumulados.
                </p>
              </div>

              {/* Responsive comparison graph */}
              <div className="space-y-3 pt-2">
                {teamPerformance.map(perf => {
                  const maxRevenue = Math.max(...teamPerformance.map(p => p.revenue), 1);
                  const barPercentage = Math.round((perf.revenue / maxRevenue) * 100);
                  return (
                    <div key={perf.name} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-sans font-semibold">
                        <span className="text-slate-900 font-extrabold">{perf.name}</span>
                        <span className="text-slate-600">
                          {perf.completedCount} completadas • <strong className="text-emerald-750">${perf.revenue.toLocaleString('es-CL')}</strong>
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(5, barPercentage)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] font-sans text-slate-700">
                ⭐ Líder esta semana: <strong className="text-slate-950 font-black">{
                  teamPerformance.reduce((prev, current) => (prev.revenue > current.revenue) ? prev : current).name
                }</strong>
              </div>
            </div>

            {/* 2. SERVICES DEMAND ANALYTICS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-violet-600 flex flex-col justify-between text-left space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-widest text-violet-700 uppercase font-black block">
                  Demanda de Servicios
                </span>
                <p className="text-xs text-slate-600 font-bold font-sans leading-relaxed">
                  Identifica qué cortes son más populares en el campus.
                </p>
              </div>

              {/* Ranks analysis rendering with graphical indicators */}
              <div className="space-y-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-emerald-800 font-black uppercase block">🔥 MÁS SOLICITADO</span>
                    <span className="text-xs font-black text-slate-900 truncate max-w-[160px] block">{mostRequested?.serviceName}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                    {mostRequested?.timesBooked} citas
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-indigo-750 font-black uppercase block">💤 MENOS SOLICITADO</span>
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[160px] block">{leastRequested?.serviceName}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-indigo-750 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200">
                    {leastRequested?.timesBooked} citas
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-sans text-slate-600 leading-relaxed font-semibold">
                💡 Tip de Andrés: Incentiva {leastRequested?.serviceName || 'otros servicios'} publicando promociones rápidas.
              </p>
            </div>

            {/* 3. HOURS OPTIMIZATION HEATMAP & GAP RECOMMENDATIONS */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-blue-650 flex flex-col justify-between text-left space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono tracking-widest text-blue-700 uppercase font-black block">
                  Optimización de Cuchillas
                </span>
                <p className="text-xs text-slate-600 font-bold font-sans leading-relaxed">
                  Lanza un Happy Hour para ocupar las horas vacías de hoy.
                </p>
              </div>

              {/* Heatmap summary indicator */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {hourlyOccupancy.map(occ => {
                  let colorClass = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50';
                  if (occ.chairsBooked === 1) colorClass = 'bg-indigo-50 border-indigo-200 text-indigo-700 font-black';
                  if (occ.chairsBooked === 2) colorClass = 'bg-indigo-100 border-indigo-300 text-indigo-805 font-black';
                  if (occ.chairsBooked === 3) colorClass = 'bg-indigo-600 border-indigo-700 text-white font-black';

                  return (
                    <div 
                      key={occ.hour} 
                      className={`py-1.5 border font-mono text-[9px] font-black text-center rounded-lg relative group transition-all shadow-sm ${colorClass}`}
                      title={`${occ.chairsBooked}/3 Barberos reservados a las ${occ.hour}`}
                    >
                      <span>{occ.hour}</span>
                      {occ.chairsBooked === 0 && (
                        <div className="absolute top-[2px] right-[2px] w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] text-slate-700 font-sans font-bold block">Próxima hora libre: <strong className="text-emerald-700 font-black">{
                  hourlyOccupancy.find(o => o.chairsBooked === 0)?.hour || 'Todo ocupado'
                } hrs</strong></span>
                
                {/* Simulated promotional launch trigger */}
                <button
                  type="button"
                  onClick={() => {
                    const firstEmpty = hourlyOccupancy.find(o => o.chairsBooked === 0);
                    if (firstEmpty) {
                      handleGeneratePromoForHour(firstEmpty.hour);
                    } else {
                      alert('¡Todos los bloques están tomados hoy!');
                    }
                  }}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider font-mono hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Zap className="w-3 h-3 animate-bounce" />
                  <span>Automatizar Happy Hour</span>
                </button>
              </div>

            </div>

          </div>

          {/* Spawned promotions slider listing generated coupons dynamically */}
          {activePromotions.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-indigo-50 p-4 border border-dashed border-indigo-200 rounded-2xl text-left space-y-3"
            >
              <div className="flex items-center gap-2 text-xs font-black text-indigo-900 uppercase">
                <CheckCircle className="w-4 h-4 text-indigo-700 animate-pulse" />
                <span>Happy Hour Activado en el Campus Universitario (Prueba Real)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activePromotions.map((promo, idx) => (
                  <div key={idx} className="bg-white border-2 border-indigo-200 px-3.5 py-2 rounded-xl text-[10.5px] font-sans font-bold space-y-1 shadow-sm">
                    <span className="text-slate-900 block">Código: <strong className="text-indigo-700 font-mono font-black tracking-widest">{promo.code}</strong></span>
                    <span className="text-emerald-700 block">🔖 -20% en Bloque Horario {promo.hour} hrs</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      ) : (
        /* LOCK WARNING STATS IN PRO WORKER DISALLOW FINANCIAL EXPOSURE */
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex items-center space-x-3 text-left">
          <AlertCircle className="w-5 h-5 text-slate-550 shrink-0" />
          <p className="text-[11px] font-sans font-bold text-slate-700 uppercase tracking-wide">
            🔒 Panel Financiero restringido para el empleado actual ({currentUser.name}). Sólo disponible para Andrés.
          </p>
        </div>
      )}

      {/* AGENDA SECTION */}
      <div className="space-y-4" id="agenda-section">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-700" />
            <h3 className="text-sm font-black text-slate-950 uppercase tracking-wider">
              {isAdmin ? 'Agenda Maestra Universitaria (Andrés + Lissy + Meylin)' : `Itinerario de Silla: ${currentUser.name}`}
            </h3>
          </div>

          {/* Quick agenda day switcher */}
          <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl" id="agenda-day-switcher">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedAgendaDay === day.date;
              return (
                <button
                  type="button"
                  key={day.date}
                  onClick={() => setSelectedAgendaDay(day.date)}
                  className={`px-3 py-1.5 text-[9px] font-mono font-black uppercase rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {day.short} ({day.date.substring(8)})
                </button>
              );
            })}
          </div>
        </div>

        {/* AGENDA GRID: SIDE BY SIDE FOR ADMIN (MASTER AGENDA) OR RESTRICTED SINGLE COLUMN FOR EMPLOYEES */}
        {isAdmin ? (
          /* MASTER AGENDA: 3 SIDE CLOSING COLUMNS */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="master-agenda-grid">
            {BARBERS.map(barberName => {
              const barberApts = appointments.filter(
                a => a.professional === barberName && a.date === selectedAgendaDay
              );

              return (
                <div key={barberName} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-4 text-left">
                  <div className="border-b border-slate-150 pb-2 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      💈 {barberName}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-700 font-extrabold bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                      {barberApts.length} turnos
                    </span>
                  </div>

                  {barberApts.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-[11px] font-sans font-bold border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 bg-slate-50">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <span>Silla vacía hoy</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {barberApts.map(apt => {
                        const statusColors = {
                          pending: 'bg-amber-50 text-amber-805 border-amber-250',
                          completed: 'bg-emerald-50 text-emerald-805 border-emerald-250',
                          cancelled: 'bg-rose-50 text-rose-805 border-rose-250',
                          'no-show': 'bg-slate-100 text-slate-600 border-slate-200'
                        };

                        return (
                          <div 
                            key={apt.id} 
                            className="bg-white p-3.5 rounded-xl border-2 border-slate-100 hover:border-slate-300 transition-colors space-y-2.5 shadow-sm"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[11px] font-mono font-black text-indigo-750">
                                🕒 {apt.time} hrs
                              </span>
                              <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-mono tracking-widest font-black uppercase ${statusColors[apt.status]}`}>
                                {apt.status === 'pending' ? 'PENDIENTE' : apt.status === 'completed' ? 'COMPLETADO' : apt.status === 'cancelled' ? 'CANCELADO' : 'NO ASISTIÓ'}
                              </span>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-xs font-black text-slate-950 block">{apt.clientName}</span>
                              <span className="text-[11px] text-slate-600 block font-bold font-sans truncate">{apt.service.name}</span>
                            </div>

                            {/* Admin agenda actions */}
                            <div className="flex gap-1 pt-1.5 border-t border-slate-100 justify-end flex-wrap">
                              {apt.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'completed')}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black font-sans uppercase cursor-pointer"
                                    title="Marcar cita como finalizada exitosamente"
                                  >
                                    Corte Listo
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'no-show')}
                                    className="px-2 py-1 bg-slate-100 border border-slate-250 text-slate-700 hover:bg-slate-200 rounded-lg text-[9px] font-sans font-black uppercase cursor-pointer"
                                    title="Marcar cliente ausente"
                                  >
                                    Faltó
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                                    className="px-2 py-1 bg-white border border-rose-250 text-rose-700 hover:bg-rose-50 rounded-lg text-[9px] font-sans font-black uppercase cursor-pointer"
                                    title="Cancelar turno"
                                  >
                                    Cancelar
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ) : (
          /* RESTRICTED AGENDA SINGLE BARBER COLUMN */
          <div className="bg-white rounded-3xl p-5 border border-slate-205 text-left max-w-xl mx-auto space-y-4 shadow-sm" id="restricted-agenda-wrapper">
            <div className="border-b border-slate-200 pb-2.5 flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider block bg-transparent">
                  💈 Mis Turnos del Día
                </span>
              </div>
              <span className="text-[10px] font-mono text-indigo-700 font-extrabold bg-indigo-50 border border-indigo-150 rounded-full px-2 py-0.5">
                {visibleAppointments.length} reservados
              </span>
            </div>

            {visibleAppointments.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-xs font-mono border border-dashed border-slate-200 rounded-xl space-y-1.5 bg-slate-50">
                <Clock className="w-6 h-6 mx-auto text-slate-400 animate-pulse" />
                <p className="font-sans font-bold">No tienes ningún turno asignado hoy.</p>
                <p className="text-[10px] text-slate-500">¡Aprovecha y toma un descanso o ayuda en el local!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-150 space-y-2">
                {visibleAppointments.map(apt => {
                  const statusColors = {
                    pending: 'bg-amber-50 text-amber-805 border-amber-250',
                    completed: 'bg-emerald-50 text-emerald-850 border-emerald-250',
                    cancelled: 'bg-rose-50 text-rose-805 border-rose-250',
                    'no-show': 'bg-slate-100 text-slate-600 border-slate-200'
                  };

                  return (
                    <div 
                      key={apt.id} 
                      className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 p-2 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-center bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 min-w-[70px] shadow-sm">
                          <span className="block text-xs font-mono font-black text-indigo-700">{apt.time}</span>
                          <span className="block text-[8px] text-slate-600 font-black font-mono uppercase mt-0.5">Turno</span>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-black text-slate-900 uppercase">{apt.clientName}</h4>
                          <span className="text-[11px] text-slate-650 block font-bold font-sans truncate">{apt.service.name}</span>
                          <span className="text-[10px] text-indigo-700 font-mono font-bold block">📞 {apt.clientPhone}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-lg border-2 text-[8px] font-mono tracking-widest font-black uppercase ${statusColors[apt.status]}`}>
                          {apt.status === 'pending' ? 'PENDIENTE' : apt.status === 'completed' ? 'COMPLETADO' : apt.status === 'cancelled' ? 'CANCELADO' : 'NO ASISTIÓ'}
                        </span>

                        {apt.status === 'pending' && (
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'completed')}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black font-sans uppercase cursor-pointer"
                              title="El cliente ha sido atendido y el pago se ha verificado"
                            >
                              Completada
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(apt.id, 'no-show')}
                              className="px-2.5 py-1.5 bg-slate-100 border border-slate-250 text-slate-700 hover:bg-slate-200 rounded-lg text-[9px] font-black font-sans uppercase cursor-pointer"
                              title="Marcar que el cliente universitario no llegó al local"
                            >
                              Faltó
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
        )}

      </div>

    </div>
  );
};
