import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export const useClientDeletionRequests = () => {
  return useQuery({
    queryKey: ['clientDeletionRequests'],
    queryFn: async () => {
      console.log('Fetching client deletion requests...');
      const { data, error } = await supabase
        .from('client_deletion_requests')
        .select(`
          *,
          clients (name),
          profiles!client_deletion_requests_requested_by_profiles_fkey (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching client deletion requests:', error);
        throw error;
      }

      console.log('Client deletion requests:', data);
      return data;
    },
  });
};

export const useDocumentDeletionRequests = () => {
  return useQuery({
    queryKey: ['documentDeletionRequests'],
    queryFn: async () => {
      console.log('Fetching document deletion requests...');
      const { data, error } = await supabase
        .from('document_deletion_requests')
        .select(`
          *,
          client_documents (
            filename,
            client_id,
            clients (
              name
            )
          ),
          profiles (
            name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching document deletion requests:', error);
        throw error;
      }

      console.log('Document deletion requests:', data);
      return data;
    },
  });
};