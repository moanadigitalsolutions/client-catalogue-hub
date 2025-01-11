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
  | "time"
  | "currency";

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

export type DeletionRequestStatus = "pending" | "approved" | "rejected";

export interface ClientDeletionRequest {
  id: string;
  client_id: string;
  requested_by: string;
  reviewed_by?: string;
  status: DeletionRequestStatus;
  reason: string;
  created_at: string;
  updated_at: string;
}
