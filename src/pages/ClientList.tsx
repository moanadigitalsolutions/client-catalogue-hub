import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ClientList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients', searchTerm, currentPage],
    queryFn: async () => {
      console.log('Fetching clients from Supabase...');
      try {
        // First check if the table exists
        const { data: tables } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
          .eq('table_name', 'clients');

        if (!tables || tables.length === 0) {
          console.log('Clients table does not exist');
          toast.error('Database table not found. Please ensure the clients table is created.');
          return [];
        }

        let query = supabase
          .from('clients')
          .select('*')
          .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

        if (searchTerm) {
          query = query.or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching clients:', error);
          toast.error('Failed to fetch clients');
          throw error;
        }

        console.log('Fetched clients:', data);
        return data || [];
      } catch (err) {
        console.error('Error in query:', err);
        toast.error('Failed to fetch clients. Please check the database connection.');
        throw err;
      }
    },
    retry: 1,
  });

  if (error) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Client List</h1>
          <Button onClick={() => navigate("/clients/new")}>Add New Client</Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              Error loading clients. Please ensure the database is properly configured.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-8">Loading clients...</div>;
  }

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Client List</h1>
        <Button onClick={() => navigate("/clients/new")}>Add New Client</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {clients && clients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>
                        {client.street}, {client.suburb}, {client.city} {client.postcode}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/clients/${client.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No clients found. Add your first client to get started.
            </div>
          )}

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="cursor-pointer"
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="cursor-pointer"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientList;