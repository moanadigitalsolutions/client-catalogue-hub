import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const UserBadge = () => {
  const { user } = useAuth();

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <User className="h-3 w-3" />
      {user?.email}
    </Badge>
  );
};

export default UserBadge;