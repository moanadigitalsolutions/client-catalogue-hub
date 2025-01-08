import { format } from "date-fns";
import { Check, X, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClientDeletionRequest } from "@/types";

interface DeletionRequestsTableProps {
  requests: (ClientDeletionRequest & {
    clients: { name: string } | null;
    profiles: { name: string } | null;
  })[];
  processingId: string | null;
  onUpdateRequest: (id: string, status: 'approved' | 'rejected', userId: string) => void;
}

export const DeletionRequestsTable = ({ 
  requests, 
  processingId, 
  onUpdateRequest 
}: DeletionRequestsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Requested By</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.clients?.name || 'Unknown Client'}</TableCell>
              <TableCell>{request.profiles?.name || 'Unknown User'}</TableCell>
              <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
              <TableCell>{format(new Date(request.created_at), 'PPp')}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === 'approved'
                      ? 'success'
                      : request.status === 'rejected'
                      ? 'destructive'
                      : 'default'
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell>
                {request.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => onUpdateRequest(
                        request.id,
                        'approved',
                        request.requested_by,
                      )}
                      disabled={!!processingId}
                    >
                      {processingId === request.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateRequest(
                        request.id,
                        'rejected',
                        request.requested_by,
                      )}
                      disabled={!!processingId}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};