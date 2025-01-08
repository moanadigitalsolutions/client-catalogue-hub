import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { FormField } from "@/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface SortableFieldProps {
  field: FormField;
  onRemove: (id: string) => void;
}

const SortableField = ({ field, onRemove }: SortableFieldProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: field.id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 bg-secondary rounded-lg"
    >
      <div className="flex items-center space-x-3">
        <button {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
        <div>
          <span className="font-medium">{field.label}</span>
          <span className="ml-2 text-sm text-muted-foreground">
            ({field.type}
            {field.required ? ", required" : ""})
          </span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(field.id)}
        disabled={["name", "email"].includes(field.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface FormFieldListProps {
  fields: FormField[];
  onFieldsUpdate: (fields: FormField[]) => void;
}

export const FormFieldList = ({ fields, onFieldsUpdate }: FormFieldListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      const newFields = arrayMove(fields, oldIndex, newIndex);
      
      // Update order_index in database
      const updates = newFields.map((field, index) => ({
        id: field.id,
        order_index: index,
      }));

      const { error } = await supabase
        .from('form_fields')
        .upsert(updates);

      if (error) {
        console.error('Error updating field order:', error);
        toast.error('Failed to update field order');
        return;
      }

      onFieldsUpdate(newFields);
      toast.success("Field order updated");
    }
  };

  const handleRemoveField = async (id: string) => {
    if (["name", "email"].includes(id)) {
      toast.error("Cannot remove required system fields");
      return;
    }
    
    const { error } = await supabase
      .from('form_fields')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing field:', error);
      toast.error('Failed to remove field');
      return;
    }
    
    onFieldsUpdate(fields.filter((field) => field.id !== id));
    toast.success("Field removed successfully");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Current Fields</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map(field => field.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {fields.map((field) => (
              <SortableField
                key={field.id}
                field={field}
                onRemove={handleRemoveField}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};