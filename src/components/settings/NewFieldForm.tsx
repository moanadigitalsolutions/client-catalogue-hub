import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { FieldType, FormField } from "@/types";
import { supabase } from "@/lib/supabase";

interface NewFieldFormProps {
  onFieldAdded: (field: FormField) => void;
  existingFields: FormField[];
}

export const NewFieldForm = ({ onFieldAdded, existingFields }: NewFieldFormProps) => {
  const [newField, setNewField] = useState<Omit<FormField, "id">>({
    label: "",
    field_id: "",
    type: "text",
    required: false,
    order_index: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddField = async () => {
    try {
      if (!newField.label.trim()) {
        toast.error("Please enter a field label");
        return;
      }

      setIsSubmitting(true);
      
      // Generate field_id from label
      const field_id = newField.label
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
      
      if (existingFields.some((field) => field.field_id === field_id)) {
        toast.error("A field with this name already exists");
        return;
      }

      console.log('Adding new form field:', { ...newField, field_id });

      const { data, error } = await supabase
        .from('form_fields')
        .insert({
          field_id,
          label: newField.label,
          type: newField.type,
          required: newField.required,
          order_index: existingFields.length,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding field:', error);
        toast.error('Failed to add field');
        return;
      }

      console.log('Form field added successfully:', data);
      onFieldAdded(data as FormField);
      setNewField({ 
        label: "", 
        field_id: "", 
        type: "text", 
        required: false, 
        order_index: existingFields.length + 1 
      });
      toast.success("Field added successfully");
    } catch (error) {
      console.error('Error in handleAddField:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Add New Field</h3>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="fieldLabel">Field Label</Label>
          <Input
            id="fieldLabel"
            value={newField.label}
            onChange={(e) =>
              setNewField({ ...newField, label: e.target.value })
            }
            placeholder="Enter field label"
          />
        </div>

        <div className="grid gap-2">
          <Label>Field Type</Label>
          <RadioGroup
            value={newField.type}
            onValueChange={(value: FieldType) =>
              setNewField({ ...newField, type: value })
            }
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="text" />
              <Label htmlFor="text">Text</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="number" id="number" />
              <Label htmlFor="number">Number</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="date" id="date" />
              <Label htmlFor="date">Date</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email">Email</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="textarea" id="textarea" />
              <Label htmlFor="textarea">Large Text</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="checkbox" id="checkbox" />
              <Label htmlFor="checkbox">Checkbox</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="radio" id="radio" />
              <Label htmlFor="radio">Radio Group</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="select" id="select" />
              <Label htmlFor="select">Dropdown</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="phone" id="phone" />
              <Label htmlFor="phone">Phone</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="url" id="url" />
              <Label htmlFor="url">Website URL</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="time" id="time" />
              <Label htmlFor="time">Time</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="required"
            checked={newField.required}
            onChange={(e) =>
              setNewField({ ...newField, required: e.target.checked })
            }
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="required">Required field</Label>
        </div>

        <Button 
          onClick={handleAddField} 
          className="w-full"
          disabled={isSubmitting}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Adding Field...' : 'Add Field'}
        </Button>
      </div>
    </div>
  );
};