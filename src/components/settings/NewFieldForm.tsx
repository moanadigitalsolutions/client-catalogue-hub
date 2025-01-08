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
    type: "text",
    required: false,
  });

  const handleAddField = async () => {
    if (!newField.label.trim()) {
      toast.error("Please enter a field label");
      return;
    }

    const field_id = newField.label.toLowerCase().replace(/\s+/g, "_");
    
    if (existingFields.some((field) => field.id === field_id)) {
      toast.error("A field with this name already exists");
      return;
    }

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

    onFieldAdded(data as FormField);
    setNewField({ label: "", type: "text", required: false });
    toast.success("Field added successfully");
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
              <RadioGroupItem value="file" id="file" />
              <Label htmlFor="file">File Upload</Label>
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
              <RadioGroupItem value="rating" id="rating" />
              <Label htmlFor="rating">Rating</Label>
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

        <Button onClick={handleAddField} className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>
    </div>
  );
};