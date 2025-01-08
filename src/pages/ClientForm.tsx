import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ClientForm = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Client Information</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Client</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Client form will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;