import { FormFieldsSettings } from "@/components/settings/FormFieldsSettings";
import { UserManagement } from "@/components/settings/UserManagement";

const Settings = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <UserManagement />
      
      <FormFieldsSettings />
    </div>
  );
};

export default Settings;