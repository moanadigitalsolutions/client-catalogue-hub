import { useQuery } from "@tanstack/react-query";
import { FormField } from "@/types";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const useFormFields = () => {
  const { data: fields = [] } = useQuery({
    queryKey: ['formFields'],
    queryFn: async () => {
      console.log('Fetching form fields configuration...');
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error fetching form fields:', error);
        toast.error('Failed to load form fields');
        throw error;
      }

      console.log('Form fields configuration loaded:', data);
      return data as FormField[];
    },
  });

  return { fields };
};