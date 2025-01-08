import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DeletionRequestsTable } from "./DeletionRequestsTable";
import { DeletionRequestsLoading } from "./DeletionRequestsLoading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useClientDeletionRequests, useDocumentDeletionRequests } from "./queries/useDeletionRequests";
import { useClientDeletionRequestMutation, useDocumentDeletionRequestMutation } from "./mutations/useDeletionRequestMutations";

export const DeletionRequests = () => {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { 
    data: clientRequests, 
    isLoading: isLoadingClientRequests, 
    error: clientError 
  } = useClientDeletionRequests();

  const { 
    data: documentRequests, 
    isLoading: isLoadingDocRequests, 
    error: docError 
  } = useDocumentDeletionRequests();

  const updateClientRequestMutation = useClientDeletionRequestMutation(setProcessingId);
  const updateDocRequestMutation = useDocumentDeletionRequestMutation(setProcessingId);

  if (isLoadingClientRequests || isLoadingDocRequests) {
    return <DeletionRequestsLoading />;
  }

  if (clientError || docError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Deletion Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Error loading deletion requests. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deletion Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="clients">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="clients">Client Requests</TabsTrigger>
            <TabsTrigger value="documents">Document Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="clients">
            {clientRequests && clientRequests.length > 0 ? (
              <DeletionRequestsTable
                requests={clientRequests}
                processingId={processingId}
                onUpdateRequest={(id, status, userId) => 
                  updateClientRequestMutation.mutate({ id, status, userId })}
              />
            ) : (
              <Alert>
                <AlertDescription>
                  No client deletion requests found.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="documents">
            {documentRequests && documentRequests.length > 0 ? (
              <DeletionRequestsTable
                requests={documentRequests.map(req => ({
                  ...req,
                  clients: { name: req.client_documents?.clients?.name || 'Unknown Client' },
                  profiles: { name: req.profiles?.name || 'Unknown User' }
                }))}
                processingId={processingId}
                onUpdateRequest={(id, status, userId) => 
                  updateDocRequestMutation.mutate({ id, status, userId })}
              />
            ) : (
              <Alert>
                <AlertDescription>
                  No document deletion requests found.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};