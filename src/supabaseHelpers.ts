import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Appointment } from './types';
import { SERVICES } from './data';

/**
 * Maps a single row from the Supabase appointments table into a frontend Appointment object.
 */
export function mapRowToAppointment(row: any): Appointment {
  // Safely find the corresponding rich frontend Service metadata by name
  const serviceObj =
    SERVICES.find(
      (s) => s.name.toLowerCase() === (row.servicio || '').toLowerCase()
    ) || SERVICES[0];

  // Parse fecha_hora (string representation like YYYY-MM-DD HH:MM or ISO timestamp)
  let date = '2026-06-11';
  let time = '10:00';
  if (row.fecha_hora) {
    const cleanStr = row.fecha_hora.replace('T', ' ');
    const parts = cleanStr.split(' ');
    if (parts[0]) date = parts[0];
    if (parts[1]) {
      time = parts[1].substring(0, 5); // Trim to HH:MM format
    }
  }

  return {
    // Keep the DB row ID as primary handle, fallback to unique string if not present
    id: row.id !== undefined ? String(row.id) : `db-apt-${Math.random()}`,
    clientName: row.cliente_nombre || 'Cliente Universitario',
    clientPhone: row.client_phone || '+56 9 1111 2222',
    clientEmail: row.client_email || 'estudiante@correo.cl',
    service: serviceObj,
    date: date,
    time: time,
    professional: row.barbero || 'Andrés',
    status: (row.estado || 'pending') as Appointment['status'],
    totalPrice: serviceObj?.price || 6500,
  };
}

/**
 * Fetches all appointments from Supabase table and converts them to rich frontend Appointment objects.
 */
export async function getSupabaseAppointments(): Promise<Appointment[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('fecha_hora', { ascending: false });

    if (error) {
      console.error('Error fetching from Supabase:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(mapRowToAppointment);
  } catch (err) {
    console.error('Exception in getSupabaseAppointments:', err);
    return [];
  }
}

/**
 * Inserts a new appointment row into Supabase matching expected columns.
 */
export async function insertSupabaseAppointment(
  apt: Omit<Appointment, 'id'>
): Promise<Appointment | null> {
  if (!isSupabaseConfigured) {
    return null;
  }
  const payload = {
    cliente_nombre: apt.clientName,
    barbero: apt.professional,
    servicio: apt.service.name,
    fecha_hora: `${apt.date} ${apt.time}`,
    estado: apt.status,
    // Add columns conditionally in case client has added more
    client_phone: apt.clientPhone,
    client_email: apt.clientEmail,
    total_price: apt.totalPrice,
  };

  try {
    const { data, error } = await supabase
      .from('appointments')
      .insert([payload])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (data && data[0]) {
      return mapRowToAppointment(data[0]);
    }
    return null;
  } catch (err: any) {
    console.error('Exception in insertSupabaseAppointment:', err);
    throw err;
  }
}

/**
 * Updates the state (estado) of a specific appointment row.
 */
export async function updateSupabaseAppointmentStatus(
  id: string,
  newStatus: Appointment['status']
): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return false;
  }
  try {
    // If it's a legacy or local appointment that isn't stored in Supabase, we skip Supabase sync
    if (id.startsWith('apt-today-') || !id || isNaN(Number(id))) {
      console.log('Skipping Supabase update for legacy or client-side mock ID:', id);
      return false;
    }

    const { error } = await supabase
      .from('appointments')
      .update({ estado: newStatus })
      .eq('id', Number(id));

    if (error) {
      console.error('Error updating appointment in Supabase:', error.message);
      throw new Error(error.message);
    }

    return true;
  } catch (err: any) {
    console.error('Exception in updateSupabaseAppointmentStatus:', err);
    throw err;
  }
}
