import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface UserActionsProps {
  userId: string;
  currentUserId: string | undefined;
  loading: boolean;
  onDelete: (userId: string) => Promise<void>;
}

export const UserActions = ({ userId, currentUserId, loading, onDelete }: UserActionsProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onDelete(userId)}
      disabled={loading || userId === currentUserId}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
};