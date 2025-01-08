import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientList = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Client List</h1>
      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Client list will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;