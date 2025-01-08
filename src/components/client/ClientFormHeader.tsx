import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClientFormHeaderProps {
  isEditing: boolean;
}

export const ClientFormHeader = ({ isEditing }: ClientFormHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Client" : "New Client"}
        </h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>
                {isEditing 
                  ? "Update your client's information here. All fields marked with * are required."
                  : "Add a new client to your database. Fill in their details - fields marked with * are required."}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => navigate("/clients")}
        >
          Cancel
        </Button>
        {isEditing && (
          <Button
            variant="outline"
            onClick={() => navigate(`/clients`)}
          >
            View All Clients
          </Button>
        )}
      </div>
    </div>
  );
};