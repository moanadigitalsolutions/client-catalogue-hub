import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useFormFieldsSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up form fields subscription...');
    
    const channel = supabase
      .channel('form-fields-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_fields'
        },
        (payload) => {
          console.log('Form fields change detected:', payload);
          // Invalidate and refetch form fields
          queryClient.invalidateQueries({ queryKey: ['formFields'] });
          
          // Show toast notification
          const event = payload.eventType;
          const messages = {
            INSERT: 'New form field added',
            UPDATE: 'Form field updated',
            DELETE: 'Form field removed'
          };
          toast.success(messages[event as keyof typeof messages]);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up form fields subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};