import { FormFieldsSettings } from "@/components/settings/FormFieldsSettings";
import { UserManagement } from "@/components/settings/UserManagement";
import { DataImportExport } from "@/components/settings/DataImportExport";

const Settings = () => {
  return (
    <div className="container space-y-8 p-4">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <UserManagement />
      
      <FormFieldsSettings />

      <DataImportExport />
    </div>
  );
};

export default Settings;