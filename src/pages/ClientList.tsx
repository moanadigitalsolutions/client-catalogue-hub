import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useFormFields } from "@/hooks/useFormFields";

const ClientList = () => {
  const navigate = useNavigate();
  const { fields } = useFormFields();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Temporary mock data - replace with actual API data
  const mockClients = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      street: "123 Main St",
      suburb: "Downtown",
      city: "Metropolis",
      postCode: "12345",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      street: "456 Oak Ave",
      suburb: "Uptown",
      city: "Metropolis",
      postCode: "12346",
    },
  ];

  console.log("Current form fields:", fields);
  console.log("Search term:", searchTerm);

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
                {mockClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      {client.firstName} {client.lastName}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.phone}</TableCell>
                    <TableCell>
                      {client.street}, {client.suburb}, {client.city} {client.postCode}
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

          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
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