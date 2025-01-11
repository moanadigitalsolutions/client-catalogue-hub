import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trackActivity } from "@/utils/activity";

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit: hookFormSubmit, reset } = useForm();

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (data) reset(data);
      } catch (error) {
        console.error('Error fetching client:', error);
        toast.error('Error fetching client details');
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id, reset]);

  const handleSubmit = async (data: any) => {
    try {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? 'Edit Client' : 'New Client'}</CardTitle>
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
  );
};

export default ClientForm;