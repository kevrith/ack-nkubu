import { supabase } from '@/lib/supabase';

export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  type: 'event' | 'notice' | 'pastoral_care' | 'sermon';
}

export async function sendEmailNotification(notification: EmailNotification): Promise<boolean> {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: notification,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Email notification error:', error);
    return false;
  }
}

export async function notifyNewEvent(eventId: string): Promise<void> {
  const { data: event } = await supabase
    .from('events')
    .select('title, description, start_datetime, location')
    .eq('id', eventId)
    .single();

  if (!event) return;

  const { data: members } = await supabase
    .from('profiles')
    .select('id')
    .eq('is_active', true);

  if (!members) return;

  // Send via Supabase Edge Function
  await supabase.functions.invoke('send-bulk-email', {
    body: {
      recipients: members.map(m => m.id),
      subject: `New Event: ${event.title}`,
      template: 'event_notification',
      data: event,
    },
  });
}

export async function notifyPastoralCareUpdate(requestId: string, status: string): Promise<void> {
  const { data: request } = await supabase
    .from('pastoral_care_requests')
    .select('requester_id, type')
    .eq('id', requestId)
    .single();

  if (!request) return;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', request.requester_id)
    .single();

  if (!profile) return;

  await sendEmailNotification({
    to: profile.id,
    subject: 'Pastoral Care Request Update',
    body: `Your ${request.type} request has been updated to: ${status}`,
    type: 'pastoral_care',
  });
}
