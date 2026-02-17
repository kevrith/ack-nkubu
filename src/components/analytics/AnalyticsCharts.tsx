import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar } from 'lucide-react';

const COLORS = ['#1a3a5c', '#c9a84c', '#3d6da8', '#a8873a', '#5a83b5'];

export function AnalyticsCharts() {
  const [memberGrowth, setMemberGrowth] = useState<any[]>([]);
  const [givingTrends, setGivingTrends] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);
  const [eventAttendance, setEventAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (profiles) {
      const monthlyData = profiles.reduce((acc: any, profile) => {
        const month = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {});

      setMemberGrowth(Object.entries(monthlyData).slice(-6).map(([month, count]) => ({ month, members: count })));
    }

    const { data: giving } = await supabase
      .from('giving_records')
      .select('amount_kes, giving_date')
      .order('giving_date', { ascending: true });

    if (giving) {
      const monthlyGiving = giving.reduce((acc: any, record) => {
        const month = new Date(record.giving_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        acc[month] = (acc[month] || 0) + parseFloat(record.amount_kes);
        return acc;
      }, {});

      setGivingTrends(Object.entries(monthlyGiving).slice(-6).map(([month, amount]) => ({ 
        month, 
        amount: Math.round(amount as number) 
      })));
    }

    const { data: categories } = await supabase
      .from('giving_records')
      .select('category, amount_kes');

    if (categories) {
      const categoryTotals = categories.reduce((acc: any, record) => {
        acc[record.category] = (acc[record.category] || 0) + parseFloat(record.amount_kes);
        return acc;
      }, {});

      setCategoryBreakdown(Object.entries(categoryTotals).map(([name, value]) => ({ 
        name: name.replace('_', ' '), 
        value: Math.round(value as number) 
      })));
    }

    const { data: events } = await supabase
      .from('events')
      .select(`
        title,
        event_rsvps(count)
      `)
      .eq('is_published', true)
      .order('start_datetime', { ascending: false })
      .limit(5);

    if (events) {
      setEventAttendance(events.map(e => ({
        event: e.title.substring(0, 20),
        attendees: e.event_rsvps?.[0]?.count || 0
      })).reverse());
    }

    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-12">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-navy" />
            <h3 className="text-lg font-semibold text-navy">Member Growth</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={memberGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="members" stroke="#1a3a5c" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-gold" />
            <h3 className="text-lg font-semibold text-navy">Giving Trends (KES)</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={givingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#c9a84c" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-navy" />
            <h3 className="text-lg font-semibold text-navy">Giving by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-navy" />
            <h3 className="text-lg font-semibold text-navy">Event Attendance</h3>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={eventAttendance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="event" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="attendees" fill="#1a3a5c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
