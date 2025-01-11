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
import { FormPreview } from "@/components/settings/FormPreview";
import { Eye, Save, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";

const FormBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Fetch existing form fields
  const { data: availableFields = [] } = useQuery({
    queryKey: ['formFields'],
    queryFn: async () => {
      console.log('Fetching available form fields...');
      const { data, error } = await supabase
        .from('form_fields')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error fetching form fields:', error);
        toast.error('Failed to load available fields');
        throw error;
      }

      console.log('Available form fields loaded:', data);
      return data as FormField[];
    },
  });

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
      if (!user) throw new Error("User must be logged in");
      
      const formData = {
        title,
        description,
        elements: fields,
        created_by: user.id,
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

  const handleAddFields = (selectedFields: FormField[]) => {
    const newFields = [...fields];
    selectedFields.forEach(field => {
      if (!fields.find(f => f.field_id === field.field_id)) {
        newFields.push(field);
      }
    });
    setFields(newFields);
    toast.success('Fields added to form');
  };

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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Form Fields</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fields
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Fields to Form</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4">
                      {availableFields.map((field) => (
                        <div key={field.id} className="flex items-start space-x-3 p-2 hover:bg-secondary rounded-lg">
                          <Checkbox
                            id={field.id}
                            checked={fields.some(f => f.field_id === field.field_id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                handleAddFields([field]);
                              } else {
                                setFields(fields.filter(f => f.field_id !== field.field_id));
                              }
                            }}
                          />
                          <div className="space-y-1">
                            <label
                              htmlFor={field.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {field.label}
                            </label>
                            <p className="text-sm text-muted-foreground">
                              Type: {field.type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
            
            {fields.length > 0 ? (
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id || index}
                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  >
                    <div>
                      <span className="font-medium">{field.label}</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({field.type}
                        {field.required ? ", required" : ""})
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFields(fields.filter((_, i) => i !== index))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No fields added to the form yet. Click "Add Fields" to select from available fields.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormBuilder;