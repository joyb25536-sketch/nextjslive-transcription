import { supabase } from './supabaseClient';

// Interfaces remain the same
interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  notes?: string;
  date: string;
  time: string;
  timezone?: string;
  appointment_utc?: string;
  created_at: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

interface BrokerApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  experience_level: string;
  license_status?: string;
  message?: string;
  resume_url?: string;
  status: string;
  created_at: string;
}

interface LocationEvent {
  id: string;
  title: string;
  event_date: string;
  location: string;
  start_time: string;
  end_time: string;
  status: string;
  description?: string;
  created_at: string;
}

interface Location {
  city: string;
  address: string;
  updated_at: string;
}

// Appointments
export async function getAppointments(): Promise<Appointment[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
  return data || [];
}

export async function addAppointment(apt: Omit<Appointment, 'id' | 'created_at'>): Promise<Appointment> {
  if (!supabase) throw new Error('Database not available');
  
  const { data, error } = await supabase
    .from('appointments')
    .insert([apt])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding appointment:', error);
    throw error;
  }
  return data;
}

// Contacts
export async function getContacts(): Promise<Contact[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
  return data || [];
}

export async function addContact(contact: Omit<Contact, 'id' | 'created_at'>): Promise<Contact> {
  if (!supabase) throw new Error('Database not available');
  
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding contact:', error);
    throw error;
  }
  return data;
}

// Broker Applications
export async function getBrokerApplications(): Promise<BrokerApplication[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('broker_applications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching broker applications:', error);
    return [];
  }
  return data || [];
}

export async function addBrokerApplication(app: Omit<BrokerApplication, 'id' | 'created_at'>): Promise<BrokerApplication> {
  if (!supabase) throw new Error('Database not available');
  
  const { data, error } = await supabase
    .from('broker_applications')
    .insert([app])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding broker application:', error);
    throw error;
  }
  return data;
}

export async function updateBrokerApplication(id: string, updates: Partial<BrokerApplication>): Promise<BrokerApplication | null> {
  if (!supabase) throw new Error('Database not available');
  
  const { data, error } = await supabase
    .from('broker_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating broker application:', error);
    return null;
  }
  return data;
}

// Location Events
export async function getLocationEvents(): Promise<LocationEvent[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('location_events')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching location events:', error);
    return [];
  }
  return data || [];
}

export async function addLocationEvent(event: Omit<LocationEvent, 'id' | 'created_at'>): Promise<LocationEvent> {
  if (!supabase) throw new Error('Database not available');
  
  const { data, error } = await supabase
    .from('location_events')
    .insert([event])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding location event:', error);
    throw error;
  }
  return data;
}

// Location
export async function getLocation(): Promise<Location | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .single();
  
  if (error) {
    console.error('Error fetching location:', error);
    return null;
  }
  return data;
}