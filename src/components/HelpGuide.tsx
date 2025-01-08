import {
  HelpCircle,
  BookOpen,
  Video,
  MessageCircle,
  Mail,
  X
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const HelpGuide = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full shadow-lg"
        onClick={() => setIsVisible(true)}
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Need Help?
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsVisible(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
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