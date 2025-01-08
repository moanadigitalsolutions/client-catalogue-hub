import {
  HelpCircle,
  BookOpen,
  Video,
  MessageCircle,
  Mail
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const HelpGuide = () => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Need Help?
        </CardTitle>
        <CardDescription>
          We're here to help you get the most out of your CRM
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => window.open("#", "_blank")}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Read the User Guide
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => window.open("#", "_blank")}
        >
          <Video className="mr-2 h-4 w-4" />
          Watch Tutorial Videos
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => window.open("#", "_blank")}
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat Support
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => window.location.href = "mailto:support@example.com"}
        >
          <Mail className="mr-2 h-4 w-4" />
          Email Support
        </Button>
      </CardContent>
    </Card>
  );
};