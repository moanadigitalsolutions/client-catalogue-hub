import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUpload } from "@/components/client/DocumentUpload";
import { ClientHistory } from "@/components/client/ClientHistory";
import { trackActivity } from "@/utils/activity";

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit: hookFormSubmit, reset } = useForm();

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        console.log('Fetching client details for:', id);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) {
          console.log('Client data fetched:', data);
          reset(data);
        }
      } catch (error) {
        console.error('Error fetching client:', error);
        toast.error('Error fetching client details');
      }
    };

    fetchClient();
  }, [id, reset]);

  const handleSubmit = async (data: any) => {
    try {
      console.log('Submitting client data:', data);
      if (id) {
        // Update existing client
        const { error } = await supabase
          .from('clients')
          .update(data)
          .eq('id', id);
        
        if (error) throw error;
        
        await trackActivity('Updated client profile');
        toast.success('Client updated successfully');
      } else {
        // Create new client
        const { error } = await supabase
          .from('clients')
          .insert([data]);
        
        if (error) throw error;
        
        await trackActivity('Created new client');
        toast.success('Client created successfully');
      }
      
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Error saving client');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {id ? 'Edit Client' : 'New Client'}
        </h1>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          {id && (
            <>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={hookFormSubmit(handleSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register('name')} required />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email')} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('phone')} />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" {...register('company')} />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" {...register('website')} />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" {...register('notes')} />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/clients')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {id ? 'Update Client' : 'Create Client'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {id && (
          <>
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <DocumentUpload clientId={id} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ClientHistory clientId={id} />
                </CardContent>
              </Card>
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ClientForm;