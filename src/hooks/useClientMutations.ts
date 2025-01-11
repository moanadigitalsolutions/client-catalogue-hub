import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { trackActivity } from "@/utils/activity";

interface ClientFormData {
  [key: string]: any;
}

export const useClientMutations = (id?: string) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isEditing = Boolean(id);

  const mutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
      if (!user) throw new Error("User must be authenticated");
      
      console.log('Saving client data:', data);
      
      // Map birth_date to dob for database
      const dbData = { ...data };
      if (dbData.birth_date) {
        dbData.dob = dbData.birth_date;
        delete dbData.birth_date;
      }
      
      if (isEditing) {
        const { error } = await supabase
          .from('clients')
          .update(dbData)
          .eq('id', id);
        if (error) throw error;

        // Track client update activity
        await supabase.from('client_activities').insert({
          client_id: id,
          user_id: user.id,
          activity_type: 'updated',
          description: 'Client information updated'
        });

        // Track user activity
        await trackActivity('Updated client information');
      } else {
        const { data: newClient, error } = await supabase
          .from('clients')
          .insert([dbData])
          .select()
          .single();
        if (error) throw error;

        // Track client creation activity
        await supabase.from('client_activities').insert({
          client_id: newClient.id,
          user_id: user.id,
          activity_type: 'created',
          description: 'Client profile created'
        });

        // Track user activity
        await trackActivity('Created new client');
      }
    },
    onSuccess: () => {
      console.log('Client saved successfully');
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client-activities'] });
      queryClient.invalidateQueries({ queryKey: ['user-activities'] });
      toast.success(`Client ${isEditing ? 'updated' : 'created'} successfully`);
    },
    onError: (error) => {
      console.error('Error saving client:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} client`);
    },
  });

  return mutation;
};