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
          
          // Show appropriate toast notification based on the event type
          switch (payload.eventType) {
            case 'INSERT':
              toast.success('New form field added');
              break;
            case 'UPDATE':
              toast.success('Form field updated');
              break;
            case 'DELETE':
              toast.success('Form field removed');
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to form fields changes');
        } else if (status === 'CLOSED') {
          console.log('Subscription to form fields changes closed');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error in form fields subscription channel');
          toast.error('Error connecting to real-time updates');
        }
      });

    return () => {
      console.log('Cleaning up form fields subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};