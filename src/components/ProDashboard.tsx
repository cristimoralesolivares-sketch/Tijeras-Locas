import React, { useState, useEffect } from 'react';
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
  ListOrdered,
  Users,
  UserPlus,
  ShieldAlert
} from 'lucide-react';
import { SERVICES, BARBERS, WORK_HOURS, getTodaySantiago, getWorkingWeek } from '../data';
import { Appointment, User as UserType, Service } from '../types';
import { supabase, isSupabaseConfigured } from '../supabaseClient';
import { getSupabaseAppointments, updateSupabaseAppointmentStatus } from '../supabaseHelpers';

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
  const [selectedAgendaDay, setSelectedAgendaDay] = useState<string>(() => getTodaySantiago());

  // State to track simulated promotions spawned for low-demand hour gaps
  const [activePromotions, setActivePromotions] = useState<Array<{hour: string; discount: number; code: string}>>([]);

  // Admin staff management states
  const [activeAdminTab, setActiveAdminTab] = useState<'analytics' | 'staff'>('analytics');
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('');
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<'barbero' | 'admin' | 'cliente'>('barbero');
  const [staffActionMsg, setStaffActionMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);

  // Fetch all registered users via /api/admin/users
  const fetchRegisteredUsers = async () => {
    if (!isSupabaseConfigured) {
      setRegisteredUsers([
        { id: '1', name: 'Andrés (Admin)', email: 'andres@tijeraslocas.cl', phone: '+56911112222', role: 'admin', created_at: new Date().toISOString() },
        { id: '2', name: 'Lissy', email: 'lissy@tijeraslocas.cl', phone: '+56994151797', role: 'barbero', created_at: new Date().toISOString() },
        { id: '3', name: 'Meylin', email: 'meylin@tijeraslocas.cl', phone: '+56971088802', role: 'barbero', created_at: new Date().toISOString() }
      ]);
      return;
    }
    setIsLoadingUsers(true);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const token = session?.access_token || '';
      
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok && data.users) {
        setRegisteredUsers(data.users);
      } else {
        console.error('Error fetching users:', data.error);
      }
    } catch (err) {
      console.error('Exception fetching users:', err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin && activeAdminTab === 'staff') {
      fetchRegisteredUsers();
    }
  }, [activeAdminTab, isAdmin]);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail || !newStaffPassword || !newStaffName || !newStaffPhone) {
      setStaffActionMsg({ text: 'Por favor complete todos los campos.', type: 'error' });
      return;
    }
    
    setIsSubmittingStaff(true);
    setStaffActionMsg(null);
    try {
      if (!isSupabaseConfigured) {
        const mockNewUser = {
          id: `mock-${Date.now()}`,
          name: newStaffName,
          email: newStaffEmail,
          phone: newStaffPhone,
          role: newStaffRole,
          created_at: new Date().toISOString()
        };
        setRegisteredUsers(prev => [mockNewUser, ...prev]);
        setStaffActionMsg({ text: `[DEMO] Cuenta para ${newStaffName} creada con éxito.`, type: 'success' });
        setNewStaffEmail('');
        setNewStaffPassword('');
        setNewStaffName('');
        setNewStaffPhone('');
        setIsSubmittingStaff(false);
        return;
      }

      const session = (await supabase.auth.getSession()).data.session;
      const token = session?.access_token || '';

      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: newStaffEmail,
          password: newStaffPassword,
          name: newStaffName,
          phone: newStaffPhone,
          role: newStaffRole
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setStaffActionMsg({ text: `¡Cuenta para ${newStaffName} creada con éxito!`, type: 'success' });
        setNewStaffEmail('');
        setNewStaffPassword('');
        setNewStaffName('');
        setNewStaffPhone('');
        fetchRegisteredUsers();
      } else {
        setStaffActionMsg({ text: `Error: ${data.error || 'No se pudo crear la cuenta.'}`, type: 'error' });
      }
    } catch (err: any) {
      setStaffActionMsg({ text: `Error: ${err.message || err}`, type: 'error' });
    } finally {
      setIsSubmittingStaff(false);
    }
  };

  const handleAutoSeedStaff = async () => {
    setIsSubmittingStaff(true);
    setStaffActionMsg(null);
    const initialStaff = [
      { email: 'andres@tijeraslocas.cl', password: 'Admin2026', name: 'Andrés', phone: '+56911112222', role: 'admin' },
      { email: 'lissy@tijeraslocas.cl', password: 'Lissy2026', name: 'Lissy', phone: '+56994151797', role: 'barbero' },
      { email: 'meylin@tijeraslocas.cl', password: 'Meylin2026', name: 'Meylin', phone: '+56971088802', role: 'barbero' }
    ];

    let successCount = 0;
    let errors: string[] = [];

    for (const staff of initialStaff) {
      try {
        if (!isSupabaseConfigured) {
          successCount++;
          continue;
        }

        const session = (await supabase.auth.getSession()).data.session;
        const token = session?.access_token || '';

        const response = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(staff)
        });

        const data = await response.json();
        if (response.ok && data.success) {
          successCount++;
        } else {
          errors.push(`${staff.name}: ${data.error}`);
        }
      } catch (e: any) {
        errors.push(`${staff.name}: ${e.message}`);
      }
    }

    if (!isSupabaseConfigured) {
      setRegisteredUsers(prev => [
        { id: '1', name: 'Andrés', email: 'andres@tijeraslocas.cl', phone: '+56911112222', role: 'admin', created_at: new Date().toISOString() },
        { id: '2', name: 'Lissy', email: 'lissy@tijeraslocas.cl', phone: '+56994151797', role: 'barbero', created_at: new Date().toISOString() },
        { id: '3', name: 'Meylin', email: 'meylin@tijeraslocas.cl', phone: '+56971088802', role: 'barbero', created_at: new Date().toISOString() }
      ]);
      setStaffActionMsg({ text: 'Staff inicial restaurado en modo demo', type: 'success' });
      setIsSubmittingStaff(false);
      return;
    }

    if (successCount === 3) {
      setStaffActionMsg({ text: '¡Se crearon las cuentas de Andrés, Lissy y Meylin de forma de fábrica!', type: 'success' });
    } else {
      setStaffActionMsg({
        text: `Se crearon ${successCount}/3 cuentas. Errores: ${errors.join(', ')}`,
        type: errors.length ? 'error' : 'success'
      });
    }
    fetchRegisteredUsers();
    setIsSubmittingStaff(false);
  };

  // Restores state of the whole booking system (Appointments) to default
  const handleResetAppointments = () => {
    if (window.confirm('¿Desea restablecer el estado inicial de las citas de Tijeras Locas para demostración?')) {
      window.location.reload();
    }
  };

  // Real-time listener for Supabase inserts / updates
  useEffect(() => {
    const refreshData = async () => {
      try {
        const fresh = await getSupabaseAppointments();
        if (fresh && fresh.length > 0) {
          // Merge Supabase items with initial/local items if needed, or simply replace/combine!
          // Since we want to preserve mock records for a perfect demo but layer in real DB records instantly,
          // we merge them. Any appointment with a string id starting with "apt-" is local mock data.
          const dbIds = new Set(fresh.map((f) => String(f.id)));
          const legacy = appointments.filter((a) => a.id.startsWith('apt-') && !dbIds.has(a.id));
          
          onUpdateAppointments([...fresh, ...legacy]);
        }
      } catch (err) {
        console.error('Error loading Supabase data:', err);
      }
    };

    // Run initial load
    refreshData();

    if (!isSupabaseConfigured) {
      return;
    }

    // Listen to real-time events on appointments table
    const channel = supabase
      .channel('app_realtime_appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Realtime change received in Dashboard:', payload);
          refreshData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Change status of a specific appointment
  const handleUpdateStatus = async (id: string, newStatus: 'completed' | 'no-show' | 'cancelled' | 'pending') => {
    try {
      const isDbId = !isNaN(Number(id)) || !id.startsWith('apt-');
      if (isDbId) {
        await updateSupabaseAppointmentStatus(id, newStatus);
      }
      const updated = appointments.map(apt => {
        if (apt.id === id) {
          return { ...apt, status: newStatus };
        }
        return apt;
      });
      onUpdateAppointments(updated);
    } catch (err: any) {
      console.error('Error updating status in Supabase:', err);
      alert(`No se pudo actualizar el estado de la cita en Supabase: ${err.message || err}`);
    }
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

  // Dynamic Real KPIs computed from Supabase Appointments State
  const todayAptsCount = appointments.filter(a => a.date === selectedAgendaDay && a.status !== 'cancelled').length;
  const completedTodayCount = appointments.filter(a => a.date === selectedAgendaDay && a.status === 'completed').length;
  const revenueTodayValue = appointments
    .filter(a => a.date === selectedAgendaDay && a.status === 'completed')
    .reduce((sum, a) => sum + (a.service?.price || 0), 0);

  const totalNonPending = appointments.filter(a => a.status === 'completed' || a.status === 'no-show').length;
  const totalNoShows = appointments.filter(a => a.status === 'no-show').length;
  const noShowRatePct = totalNonPending > 0 ? Math.round((totalNoShows / totalNonPending) * 100) : 0;

  // Comparative distribution breakdown per professional staff member
  const weeklyBarberStats = ['Andrés', 'Lissy', 'Meylin'].map(name => {
    const barberApts = appointments.filter(a => a.professional === name);
    const total = barberApts.length;
    const completed = barberApts.filter(a => a.status === 'completed').length;
    const pending = barberApts.filter(a => a.status === 'pending').length;
    const noShow = barberApts.filter(a => a.status === 'no-show').length;
    const revenue = barberApts
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + (a.service?.price || 0), 0);
    return {
      name,
      total,
      completed,
      pending,
      noShow,
      revenue
    };
  });

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

        {/* Quick Admin sub-tabs to switch between metrics and staff list */}
        {isAdmin && (
          <div className="flex bg-slate-100 p-1 border border-slate-200 rounded-xl gap-1 shrink-0 z-10 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveAdminTab('analytics')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeAdminTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              📊 Métricas y BI
            </button>
            <button
              type="button"
              onClick={() => setActiveAdminTab('staff')}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                activeAdminTab === 'staff'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              👥 Gestionar Staff
            </button>
          </div>
        )}
      </div>

      {/* ADMIN INTEL: BUSINESS INTELLIGENCE SUITE (STRICTLY SECURED & VISIBLE ONLY FOR ADMIN ANDRES) */}
      {isAdmin ? (
        <div className="space-y-6" id="admin-bi-suite">
          
          {activeAdminTab === 'analytics' ? (
            <>
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                <BarChart3 className="w-5 h-5 text-indigo-705" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest font-sans">
                  Inteligencia de Negocios en Tiempo Real (Santiago)
                </h3>
              </div>

              {/* Real calculated KPIs requested by user */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. REAL DAILY REVENUE */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-indigo-600 flex flex-col justify-between text-left space-y-4 shadow-sm font-medium">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono tracking-widest text-[#4f46e5] uppercase font-black block">
                      Ingresos de Hoy ({selectedAgendaDay})
                    </span>
                    <h3 className="text-3xl font-black text-slate-950 font-mono tracking-tight">
                      ${revenueTodayValue.toLocaleString('es-CL')} <span className="text-xs text-slate-500 font-sans font-medium">CLP</span>
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans font-semibold">
                    Calculado en tiempo real a partir de todas las citas ya marcadas como completadas hoy.
                  </p>
                </div>

                {/* 2. COMPLETED APPOINTMENTS COUNT */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-emerald-605 border-l-emerald-600 flex flex-col justify-between text-left space-y-4 shadow-sm font-medium">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono tracking-widest text-emerald-800 uppercase font-black block">
                      Citas Atendidas Hoy
                    </span>
                    <h3 className="text-3xl font-black text-slate-950 font-mono tracking-tight">
                      {completedTodayCount} <span className="text-xs text-slate-500 font-sans font-medium">de {todayAptsCount}</span>
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans font-semibold">
                    Visualiza y controla el avance de tu agenda en el Barrio Universitario hoy.
                  </p>
                </div>

                {/* 3. NO-SHOW RATE */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 border-l-4 border-l-rose-500 flex flex-col justify-between text-left space-y-4 shadow-sm font-medium">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono tracking-widest text-rose-650 uppercase font-black block">
                      Tasa de No-Show Histórica
                    </span>
                    <h3 className="text-3xl font-black text-rose-600 font-mono tracking-tight">
                      {noShowRatePct}%
                    </h3>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans font-semibold">
                    Porcentaje de clientes que reservaron un horario y no se presentaron a la barbería.
                  </p>
                </div>

              </div>

              {/* WEEKLY APPOINTMENT GRAPH PER BARBER */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                
                {/* Visual Chart layout */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider font-sans border-b border-indigo-50 pb-2">
                    📊 Distribución Semanal de Citas por Barbero
                  </h4>
                  
                  <div className="space-y-5 py-2">
                    {weeklyBarberStats.map((perf) => {
                      return (
                        <div key={perf.name} className="space-y-2 text-left">
                          <div className="flex justify-between items-center text-[10px] font-mono font-black uppercase">
                            <span className="text-slate-900 font-sans">💈 {perf.name}</span>
                            <span className="text-slate-500">
                              {perf.total} cita(s) • <span className="text-emerald-705 font-bold text-emerald-600">${perf.revenue.toLocaleString('es-CL')}</span>
                            </span>
                          </div>
                          
                          {/* Progress composite bar graphs for completed, pending, and no-shows */}
                          <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex shadow-inner border border-slate-200">
                            {perf.total === 0 ? (
                              <div className="flex items-center justify-center w-full text-[9px] text-slate-500 font-sans font-semibold">
                                Sin citas agendadas aún
                              </div>
                            ) : (
                              <>
                                <div 
                                  style={{ width: `${(perf.completed / perf.total) * 100}%` }} 
                                  className="bg-emerald-500 h-full flex items-center justify-center text-[9px] text-white font-mono font-bold"
                                  title={`${perf.completed} Completados`}
                                >
                                  {perf.completed > 0 && perf.completed}
                                </div>
                                <div 
                                  style={{ width: `${(perf.pending / perf.total) * 100}%` }} 
                                  className="bg-amber-500 h-full flex items-center justify-center text-[9px] text-slate-950 font-mono font-bold"
                                  title={`${perf.pending} Pendientes`}
                                >
                                  {perf.pending > 0 && perf.pending}
                                </div>
                                <div 
                                  style={{ width: `${(perf.noShow / perf.total) * 100}%` }} 
                                  className="bg-slate-400 h-full flex items-center justify-center text-[9px] text-white font-mono font-bold"
                                  title={`${perf.noShow} Faltó`}
                                >
                                  {perf.noShow > 0 && perf.noShow}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-center gap-3 text-[8.5px] font-mono uppercase bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" /> Completado
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Pendiente
                    </span>
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded bg-slate-400 inline-block" /> Faltó
                    </span>
                  </div>
                </div>

                {/* Demand Heatmap */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 text-left">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider font-sans">
                      ⏰ Optimizador de Sillas Vacías
                    </h4>
                    <span className="text-[9px] font-mono bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-1.5 py-0.5 rounded">
                      Promo Trigger
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-medium font-sans leading-relaxed">
                    Las horas críticas con baja ocupación se listan abajo en base a los barberos libres de tu staff. Haz clic en "Promo" para gatillar su respectivo descuento.
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1.5">
                    {hourlyOccupancy.map((occ) => {
                      const isLow = occ.chairsBooked < 2;
                      return (
                        <div 
                          key={occ.hour} 
                          className={`p-2.5 rounded-xl border flex flex-col justify-between text-left transition-all ${
                            isLow 
                              ? 'bg-rose-50/40 border-rose-200' 
                              : 'bg-indigo-50/20 border-indigo-100'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-mono font-black text-slate-900 block">{occ.hour} hrs</span>
                            <span className="text-[9px] text-slate-500 font-sans font-bold block">{occ.chairsBooked}/3 Sillas</span>
                          </div>
                          
                          {isLow ? (
                            <button
                              type="button"
                              onClick={() => handleGeneratePromoForHour(occ.hour)}
                              className="w-full mt-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[8.5px] font-black font-sans uppercase transition-colors uppercase tracking-wider cursor-pointer"
                            >
                              🔖 Promo
                            </button>
                          ) : (
                            <span className="text-[8.5px] text-indigo-600 font-bold uppercase tracking-wider text-center block mt-2 pt-1">
                              Ocupado 👍
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
              
              {/* Active coupon prompts bar */}
              {activePromotions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl text-left space-y-2.5 shadow-sm"
                >
                  <span className="text-[9.5px] font-mono tracking-widest text-[#4f46e5] font-black block">
                    PROMOCIONES ESCOLARES ACTIVAS EN TIEMPO REAL
                  </span>
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
            </>
          ) : (
            // STAFF WORKSPACE TAB: CREATE STAFF ACCOUNTS AND VIEW SIGNED UP USERS
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="staff-workspace-admin">
              
              {/* Left Column: Form to create a staff member */}
              <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 border-b border-slate-150 pb-2">
                  <UserPlus className="w-4 h-4 text-indigo-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans">
                    Registrar Miembro del Staff
                  </h4>
                </div>
                
                <p className="text-[10.5px] text-slate-650 leading-relaxed font-sans font-semibold">
                  Crea cuentas de barberos y administradores sin tener que acceder al dashboard oficial de Supabase. El sistema asignará el rol en su metadata de forma segura a través del servidor.
                </p>

                <form onSubmit={handleCreateStaff} className="space-y-3.5 pt-2 text-left">
                  <div>
                    <label className="text-[9.5px] font-mono font-black text-slate-600 uppercase block mb-1">Nombre Completo</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Andrés Silva"
                      value={newStaffName}
                      onChange={e => setNewStaffName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-medium hover:bg-slate-100/55 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono font-black text-slate-600 uppercase block mb-1">Correo Electrónico (Staff)</label>
                    <input 
                      type="email" 
                      required
                      placeholder="Ej. andres@tijeraslocas.cl"
                      value={newStaffEmail}
                      onChange={e => setNewStaffEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-medium hover:bg-slate-100/55 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono font-black text-slate-600 uppercase block mb-1">Teléfono Móvil (+569...)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. +56911223344"
                      value={newStaffPhone}
                      onChange={e => setNewStaffPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-medium hover:bg-slate-100/55 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono font-black text-slate-600 uppercase block mb-1">Contraseña de Acceso</label>
                    <input 
                      type="password" 
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      value={newStaffPassword}
                      onChange={e => setNewStaffPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans font-medium hover:bg-slate-100/55 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-mono font-black text-slate-600 uppercase block mb-1">Rol en el Local</label>
                    <select
                      value={newStaffRole}
                      onChange={e => setNewStaffRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-sans font-bold hover:bg-slate-100/55 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 focus:bg-white outline-none"
                    >
                      <option value="barbero">Barbero Especialista (Silla)</option>
                      <option value="admin">Administrador General</option>
                      <option value="cliente">Cliente Regular</option>
                    </select>
                  </div>

                  {staffActionMsg && (
                    <div className={`p-3 rounded-xl border text-[11px] font-sans font-bold ${
                      staffActionMsg.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}>
                      {staffActionMsg.text}
                    </div>
                  )}

                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      type="submit"
                      disabled={isSubmittingStaff}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                    >
                      {isSubmittingStaff ? 'Registrando en Supabase...' : '➕ Registrar Cuenta Staff'}
                    </button>

                    <button
                      type="button"
                      onClick={handleAutoSeedStaff}
                      disabled={isSubmittingStaff}
                      className="w-full py-2 bg-slate-50 border border-slate-200 text-slate-705 hover:bg-slate-100 hover:text-slate-900 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer"
                      title="Registra inmediatamente Andrés, Lissy y Meylin con sus contraseñas por defecto"
                    >
                      ⚡ Crear Andrés, Lissy y Meylin (1-Clic)
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: List of all users registered */}
              <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider font-sans">
                      Lista de Usuarios Registrados
                    </h4>
                  </div>
                  <button 
                    type="button"
                    onClick={fetchRegisteredUsers}
                    className="p-1 px-2.5 hover:bg-slate-100 rounded-lg text-[9px] font-mono uppercase bg-slate-50 border border-slate-250 font-extrabold text-[#4f46e5] cursor-pointer"
                  >
                    Actualizar
                  </button>
                </div>

                {isLoadingUsers ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-2">
                    <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-black">Cargando cuentas...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 flex flex-col">
                    {registeredUsers.length === 0 ? (
                      <p className="py-12 text-center text-xs text-slate-500 font-bold">No se han recuperado cuentas de usuario de la DB aún. Haz clic en "Actualizar" o "Crear Andrés, Lissy y Meylin" para inicializar el staff.</p>
                    ) : (
                      registeredUsers.map((u: any) => {
                        const rolesColors = {
                          admin: 'bg-indigo-50 border-indigo-200 text-indigo-700 font-black',
                          barbero: 'bg-emerald-50 border-emerald-250 text-emerald-800 font-bold',
                          cliente: 'bg-slate-50 border-slate-200 text-slate-600'
                        };
                        return (
                          <div 
                            key={u.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 text-left hover:bg-slate-100/50 transition-colors"
                          >
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-xs font-black text-slate-900 uppercase block truncate">
                                {u.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 block truncate">
                                📩 {u.email}
                              </span>
                              <span className="text-[9.5px] font-mono text-indigo-650 block">
                                📞 {u.phone}
                              </span>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className={`px-2 py-0.5 rounded-lg border text-[8px] font-mono tracking-widest uppercase block text-center ${
                                rolesColors[u.role as keyof typeof rolesColors] || rolesColors.cliente
                              }`}>
                                {u.role === 'admin' ? 'ADMINISTRADOR' : u.role === 'barbero' ? 'BARBERO' : 'CLIENTE'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      ) : (
        /* LOCK WARNING STATS IN PRO WORKER DISALLOW FINANCIAL EXPOSURE */
        <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl flex items-center space-x-3 text-left">
          <AlertCircle className="w-5 h-5 text-slate-500 shrink-0" />
          <p className="text-[11px] font-sans font-bold text-slate-700 uppercase tracking-wide">
            🔒 Panel Financiero y de Personal restringido para el empleado actual ({currentUser.name}). Sólo disponible para Andrés.
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
            {getWorkingWeek().map((day) => {
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
