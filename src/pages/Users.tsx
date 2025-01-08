import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from "@/components/users/UserList";
import { UserInvite } from "@/components/users/UserInvite";

const Users = () => {
  return (
    <div className="container space-y-8 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      
      <div className="grid gap-6">
        <UserInvite />
        <UserList />
      </div>
    </div>
  );
};

export default Users;