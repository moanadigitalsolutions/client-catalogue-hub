export type UserRole = "admin" | "employee";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export type FieldType = 
  | "text" 
  | "number" 
  | "date" 
  | "email" 
  | "textarea" 
  | "file" 
  | "checkbox"
  | "radio"
  | "select"
  | "rating"
  | "phone"
  | "url"
  | "time";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}