import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FieldDescriptionProps {
  fieldId: string;
}

export const FieldDescription = ({ fieldId }: FieldDescriptionProps) => {
  // Default descriptions for system fields
  const descriptions: Record<string, string> = {
    name: "Enter the client's full name as it appears on official documents",
    email: "Primary email address for communications",
    phone: "Best contact number to reach the client",
    street: "Street address including unit/apartment number if applicable",
    suburb: "Suburb or district name",
    city: "City or town name",
    postcode: "Postal or ZIP code",
    gender: "Client's preferred gender identity",
    qualification: "Relevant qualifications or certifications",
    website: "Client's website URL if available"
  };

  // For custom fields, generate a generic description
  const getDescription = (id: string) => {
    if (descriptions[id]) {
      return descriptions[id];
    }
    // Generate a generic description for custom fields
    return `Enter the ${id.replace(/_/g, ' ').toLowerCase()}`;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground inline-block ml-1 cursor-help" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{getDescription(fieldId)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};