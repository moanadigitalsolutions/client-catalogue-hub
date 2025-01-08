import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Settings = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Form Fields Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Settings configuration will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;