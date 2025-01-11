import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Pencil, Check, X } from "lucide-react";

interface UserNameEditorProps {
  user: {
    id: string;
    name: string | null;
    role: string;
  };
  isEditing: boolean;
  editingName: string;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
}

export const UserNameEditor = ({
  user,
  isEditing,
  editingName,
  onStartEdit,
  onSave,
  onCancel,
  onNameChange,
}: UserNameEditorProps) => {
  return (
    <div className="flex items-center gap-2">
      {user.role === 'admin' && <Shield className="h-4 w-4 text-blue-500" />}
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={editingName}
            onChange={(e) => onNameChange(e.target.value)}
            className="max-w-[200px]"
          />
          <Button variant="ghost" size="icon" onClick={onSave}>
            <Check className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>{user.name || 'Unnamed User'}</span>
          <Button variant="ghost" size="icon" onClick={onStartEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};