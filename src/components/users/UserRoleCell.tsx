import { UserRoleSelect } from "./UserRoleSelect";
import { QueryClient } from "@tanstack/react-query";
import { UserRole } from "@/types";

interface UserRoleCellProps {
  userId: string;
  currentRole: UserRole; // Changed from string to UserRole
  queryClient: QueryClient;
}

export const UserRoleCell = ({ userId, currentRole, queryClient }: UserRoleCellProps) => {
  return (
    <UserRoleSelect 
      userId={userId} 
      currentRole={currentRole} 
      onRoleChange={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
    />
  );
};