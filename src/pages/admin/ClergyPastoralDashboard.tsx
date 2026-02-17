import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { PastoralCareRequest } from '@/types/pastoral';
import { Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

export function ClergyPastoralDashboard() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<PastoralCareRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress'>('pending');

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      let query = supabase
        .from('pastoral_care_requests')
        .select(`
          *,
          requester:profiles!pastoral_care_requests_requester_id_fkey(full_name, phone),
          assigned_clergy:profiles!pastoral_care_requests_assigned_clergy_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Failed to load requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'in_progress' && !requests.find(r => r.id === id)?.assigned_clergy_id) {
        updates.assigned_clergy_id = user?.id;
      }
      if (status === 'completed') {
        updates.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('pastoral_care_requests')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      loadRequests();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const addNote = async (id: string, note: string) => {
    try {
      const { error } = await supabase
        .from('pastoral_care_requests')
        .update({ clergy_notes: note })
        .eq('id', id);

      if (error) throw error;
      loadRequests();
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'acknowledged': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-playfair text-navy">Pastoral Care Dashboard</h1>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'in_progress'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg capitalize ${
              filter === f
                ? 'bg-navy text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No requests found</p>
          </div>
        ) : (
          requests.map((request: any) => (
            <div key={request.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-navy/10 text-navy rounded-full text-xs font-medium">
                      {request.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  {!request.is_confidential && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <User className="h-4 w-4" />
                      <span>{request.requester?.full_name}</span>
                      {request.contact_phone && <span>• {request.contact_phone}</span>}
                    </div>
                  )}

                  <p className="text-gray-700 mb-3">{request.details}</p>

                  {request.preferred_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>
                        Preferred: {new Date(request.preferred_date).toLocaleDateString()}
                        {request.preferred_time && ` at ${request.preferred_time}`}
                      </span>
                    </div>
                  )}

                  {request.assigned_clergy && (
                    <p className="text-sm text-gray-600 mt-2">
                      Assigned to: {request.assigned_clergy.full_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(request.id, 'acknowledged')}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'in_progress')}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700"
                      >
                        Start Working
                      </button>
                    </>
                  )}
                  {request.status === 'in_progress' && (
                    <button
                      onClick={() => updateStatus(request.id, 'completed')}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Complete
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clergy Notes
                  </label>
                  <textarea
                    defaultValue={request.clergy_notes || ''}
                    onBlur={(e) => addNote(request.id, e.target.value)}
                    className="w-full border border-gray-300 rounded p-2 text-sm"
                    rows={2}
                    placeholder="Add private notes..."
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
