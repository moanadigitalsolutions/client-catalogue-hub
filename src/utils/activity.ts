import { supabase } from "@/lib/supabase";

export const trackActivity = async (activityType: string) => {
  try {
    console.log('Tracking activity:', activityType);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_activities')
      .insert([
        { 
          user_id: user.id, 
          activity_type: activityType,
        }
      ]);
      
    if (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
    
    console.log('Activity tracked successfully');
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};