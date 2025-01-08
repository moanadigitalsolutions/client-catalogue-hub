export type FieldType = 
  | "text"
  | "number"
  | "date"
  | "email"
  | "textarea"
  | "checkbox"
  | "radio"
  | "select"
  | "phone"
  | "url"
  | "time";

export interface FormField {
  id: string;
  label: string;
  field_id: string;
  type: FieldType;
  required: boolean;
  options?: string[];
  order_index: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type UserRole = "admin" | "employee";