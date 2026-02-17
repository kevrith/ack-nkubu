import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Circle, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

interface ReadingPlan {
  name: string;
  description: string;
  duration: string;
  totalDays: number;
}

const PLANS: ReadingPlan[] = [
  { name: 'Bible in a Year', description: 'Read through the entire Bible in 365 days', duration: '365 days', totalDays: 365 },
  { name: 'New Testament in 90 Days', description: 'Complete the New Testament in 3 months', duration: '90 days', totalDays: 90 },
  { name: 'Psalms & Proverbs', description: 'Read Psalms and Proverbs in 60 days', duration: '60 days', totalDays: 60 },
  { name: 'Gospels in 30 Days', description: 'Read all four Gospels in one month', duration: '30 days', totalDays: 30 },
];

export function ReadingPlans() {
  const { user } = useAuthStore();
  const [activePlan, setActivePlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reading_plan_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setActivePlan(data);
    setLoading(false);
  };

  const startPlan = async (plan: ReadingPlan) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('reading_plan_progress')
      .upsert({
        user_id: user.id,
        plan_name: plan.name,
        current_day: 1,
        started_at: new Date().toISOString(),
        last_read_at: new Date().toISOString(),
      });

    if (!error) loadProgress();
  };

  const updateProgress = async () => {
    if (!activePlan) return;
    
    const { error } = await supabase
      .from('reading_plan_progress')
      .update({
        current_day: activePlan.current_day + 1,
        last_read_at: new Date().toISOString(),
      })
      .eq('id', activePlan.id);

    if (!error) loadProgress();
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  if (activePlan) {
    const plan = PLANS.find(p => p.name === activePlan.plan_name);
    const progress = (activePlan.current_day / (plan?.totalDays || 1)) * 100;

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-navy to-navy-600 text-white rounded-lg p-6">
          <h3 className="text-2xl font-playfair mb-2">{activePlan.plan_name}</h3>
          <p className="text-navy-100 mb-4">{plan?.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Day {activePlan.current_day} of {plan?.totalDays}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-navy-800 rounded-full h-3">
              <div 
                className="bg-gold h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={updateProgress}
            disabled={activePlan.current_day >= (plan?.totalDays || 0)}
            className="mt-4 px-6 py-2 bg-gold text-navy rounded-lg hover:bg-gold-600 disabled:opacity-50 font-medium"
          >
            {activePlan.current_day >= (plan?.totalDays || 0) ? '✓ Completed!' : 'Mark Day Complete'}
          </button>
        </div>

        <button
          onClick={() => setActivePlan(null)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Choose Different Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-navy mb-4">Choose a Reading Plan</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {PLANS.map((plan) => (
          <div key={plan.name} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <BookOpen className="h-6 w-6 text-navy flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h4 className="font-semibold text-navy mb-1">{plan.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                <span className="text-xs text-gray-500">{plan.duration}</span>
              </div>
            </div>
            <button
              onClick={() => startPlan(plan)}
              className="w-full mt-3 px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-600 flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
