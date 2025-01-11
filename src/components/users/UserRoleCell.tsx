import { UserRoleSelect } from "./UserRoleSelect";
import { QueryClient } from "@tanstack/react-query";

interface UserRoleCellProps {
  userId: string;
  currentRole: string;
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