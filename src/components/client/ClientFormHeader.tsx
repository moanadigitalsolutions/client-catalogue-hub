import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ClientFormHeaderProps {
  isEditing: boolean;
}

export const ClientFormHeader = ({ isEditing }: ClientFormHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">
        {isEditing ? "Edit Client" : "New Client"}
      </h1>
      <Button
        variant="outline"
        onClick={() => navigate("/clients")}
      >
        Cancel
      </Button>
    </div>
  );
};