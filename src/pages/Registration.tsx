import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Registration = () => {
  const navigate = useNavigate();
  const { data: forms, isLoading } = useQuery({
    queryKey: ['registration-forms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('registration_forms')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return <div>Loading forms...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registration Forms</h2>
        <Button onClick={() => navigate('/registration/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Form
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms?.map((form) => (
          <Card key={form.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{form.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {form.description || 'No description'}
              </p>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/registration/${form.id}`)}
                >
                  Edit Form
                </Button>
                {form.public_url_key && (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const url = `${window.location.origin}/forms/${form.public_url_key}`;
                      navigator.clipboard.writeText(url);
                    }}
                  >
                    Copy Public Link
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {forms?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No forms created yet</p>
            <Button onClick={() => navigate('/registration/new')}>
              Create Your First Form
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Registration;