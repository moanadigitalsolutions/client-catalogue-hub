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
          profiles!document_deletion_requests_requested_by_profiles_fkey (
            name
          )
        `)
        .eq('status', 'pending')  // Only fetch pending requests
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching document deletion requests:', error);
        throw error;
      }

      // Filter out duplicate requests for the same document, keeping only the most recent
      const uniqueRequests = data?.reduce((acc: any[], request: any) => {
        const existingIndex = acc.findIndex(
          r => r.document_id === request.document_id
        );
        
        if (existingIndex === -1) {
          acc.push(request);
        } else if (new Date(request.created_at) > new Date(acc[existingIndex].created_at)) {
          acc[existingIndex] = request;
        }
        
        return acc;
      }, []);

      console.log('Document deletion requests:', uniqueRequests);
      return uniqueRequests;
    },
  });
};
