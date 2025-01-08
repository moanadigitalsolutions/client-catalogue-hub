import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PlusCircle, Trash2 } from "lucide-react";
import { FormField, FieldType } from "@/types";

export const FormFieldsSettings = () => {
  const [fields, setFields] = useState<FormField[]>([
    { id: "name", label: "Full Name", type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    { id: "phone", label: "Phone Number", type: "phone", required: false },
    { id: "address", label: "Address", type: "textarea", required: false },
    { id: "birth_date", label: "Date of Birth", type: "date", required: false },
    { id: "preferred_contact", label: "Preferred Contact Method", type: "select", required: false, options: ["Email", "Phone", "Mail"] },
    { id: "newsletter", label: "Subscribe to Newsletter", type: "checkbox", required: false },
    { id: "notes", label: "Additional Notes", type: "textarea", required: false },
  ]);
  
  const [newField, setNewField] = useState<Omit<FormField, "id">>({
    label: "",
    type: "text",
    required: false,
  });

  const handleAddField = () => {
    if (!newField.label.trim()) {
      toast.error("Please enter a field label");
      return;
    }

    const id = newField.label.toLowerCase().replace(/\s+/g, "_");
    
    if (fields.some((field) => field.id === id)) {
      toast.error("A field with this name already exists");
      return;
    }

    setFields([...fields, { ...newField, id }]);
    setNewField({ label: "", type: "text", required: false });
    toast.success("Field added successfully");
  };

  const handleRemoveField = (id: string) => {
    if (["name", "email"].includes(id)) {
      toast.error("Cannot remove required system fields");
      return;
    }
    
    setFields(fields.filter((field) => field.id !== id));
    toast.success("Field removed successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Fields Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Existing Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Fields</h3>
            <div className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
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
                    onClick={() => handleRemoveField(field.id)}
                    disabled={["name", "email"].includes(field.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Field */}
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
        </div>
      </CardContent>
    </Card>
  );
};