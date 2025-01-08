import { supabase } from "@/lib/supabase";

export const trackActivity = async (activityType: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_activities')
      .insert([
        { user_id: user.id, activity_type: activityType }
      ]);
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};