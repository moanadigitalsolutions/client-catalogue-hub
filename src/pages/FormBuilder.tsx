import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FormField } from "@/types";
import { FormFieldList } from "@/components/settings/FormFieldList";
import { NewFieldForm } from "@/components/settings/NewFieldForm";
import { FormPreview } from "@/components/settings/FormPreview";
import { Eye, Save } from "lucide-react";

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Fetch existing form if editing
  const { data: form, isLoading: isLoadingForm } = useQuery({
    queryKey: ['registration-form', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('registration_forms')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  // Update form fields when form data is loaded
  useEffect(() => {
    if (form) {
      setTitle(form.title);
      setDescription(form.description || "");
      setFields(form.elements || []);
    }
  }, [form]);

  // Save form mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const formData = {
        title,
        description,
        elements: fields,
        public_url_key: Math.random().toString(36).substring(2, 15)
      };

      if (id) {
        const { data, error } = await supabase
          .from('registration_forms')
          .update(formData)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('registration_forms')
          .insert([formData])
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration-forms'] });
      toast.success('Form saved successfully');
      navigate('/registration');
    },
    onError: (error) => {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    }
  });

  if (isLoadingForm) {
    return <div>Loading form...</div>;
  }

  if (isPreviewMode) {
    return (
      <FormPreview
        title={title}
        description={description}
        fields={fields}
        onClose={() => setIsPreviewMode(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{id ? 'Edit Form' : 'Create New Form'}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/registration')}>
            Cancel
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsPreviewMode(true)}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={() => saveMutation.mutate()}
            disabled={!title || saveMutation.isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Form Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter form title"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter form description"
            />
          </div>

          <div className="space-y-4">
            <FormFieldList
              fields={fields}
              onFieldsUpdate={setFields}
            />
            <NewFieldForm
              onFieldAdded={(field) => setFields([...fields, field])}
              existingFields={fields}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormBuilder;