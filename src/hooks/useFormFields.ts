import { useState, useEffect } from "react";
import { FormField } from "@/types";

export const useFormFields = () => {
  const [fields, setFields] = useState<FormField[]>([
    { id: "name", label: "Full Name", type: "text", required: true },
    { id: "email", label: "Email", type: "email", required: true },
    { id: "phone", label: "Phone Number", type: "phone", required: false },
    { id: "street", label: "Street Address", type: "text", required: false },
    { id: "suburb", label: "Suburb", type: "text", required: false },
    { id: "city", label: "City", type: "text", required: false },
    { id: "postcode", label: "Post Code", type: "text", required: false },
    { id: "birth_date", label: "Date of Birth", type: "date", required: false },
    { id: "preferred_contact", label: "Preferred Contact Method", type: "select", required: false, options: ["Email", "Phone", "Mail"] },
    { id: "newsletter", label: "Subscribe to Newsletter", type: "checkbox", required: false },
    { id: "notes", label: "Additional Notes", type: "textarea", required: false },
  ]);

  // TODO: In a real application, this would fetch from an API or local storage
  useEffect(() => {
    console.log("Loading form fields configuration");
    // This is where you would load the fields configuration
    // For now, we're using the default fields
  }, []);

  return { fields };
};