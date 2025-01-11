import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Link2, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Registration = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: forms, isLoading } = useQuery({
    queryKey: ['registration-forms'],
    queryFn: async () => {
      console.log('Fetching registration forms...');
      const { data, error } = await supabase
        .from('registration_forms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching forms:', error);
        throw error;
      }
      
      console.log('Forms loaded:', data);
      return data;
    }
  });

  const duplicateFormMutation = useMutation({
    mutationFn: async (formId: string) => {
      const { data: originalForm } = await supabase
        .from('registration_forms')
        .select('*')
        .eq('id', formId)
        .single();

      if (!originalForm) throw new Error('Form not found');

      const { data, error } = await supabase
        .from('registration_forms')
        .insert([{
          title: `${originalForm.title} (Copy)`,
          description: originalForm.description,
          elements: originalForm.elements,
          public_url_key: Math.random().toString(36).substring(2, 15)
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration-forms'] });
      toast.success('Form duplicated successfully');
    },
    onError: (error) => {
      console.error('Error duplicating form:', error);
      toast.error('Failed to duplicate form');
    }
  });

  const toggleFormStatusMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from('registration_forms')
        .update({ is_active })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration-forms'] });
      toast.success('Form status updated');
    },
    onError: (error) => {
      console.error('Error updating form status:', error);
      toast.error('Failed to update form status');
    }
  });

  if (isLoading) {
    return <div>Loading forms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registration Forms</h2>
        <Button onClick={() => navigate('/registration/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Form
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms?.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{form.title}</span>
                <Badge variant={form.is_active ? "default" : "secondary"}>
                  {form.is_active ? "Active" : "Archived"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {form.description || 'No description'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/registration/${form.id}`)}
                >
                  Edit Form
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateFormMutation.mutate(form.id)}
                  disabled={duplicateFormMutation.isPending}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                {form.public_url_key && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/forms/${form.public_url_key}`;
                      navigator.clipboard.writeText(url);
                      toast.success('Public link copied to clipboard');
                    }}
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFormStatusMutation.mutate({
                    id: form.id,
                    is_active: !form.is_active
                  })}
                >
                  <Archive className="h-4 w-4 mr-2" />
                  {form.is_active ? 'Archive' : 'Activate'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {forms?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No forms created yet</p>
            <Button onClick={() => navigate('/registration/new')}>
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Registration;