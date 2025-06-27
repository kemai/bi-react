
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { Link2 } from "lucide-react";
import LookerEmbedFrame from "./looker-embed-frame";

interface LookerStudioCardProps {
  className?: string;
}

export default function LookerStudioCard({ className }: LookerStudioCardProps) {
  const REPORT_ID = "2afacd1f-b32e-4c12-baff-dd379e85fdea";
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Looker Studio</CardTitle>
        </div>
        <CardDescription>Connect your Looker Studio account to fetch and visualize your data seamlessly.</CardDescription>
      </CardHeader>
     <CardContent className="p-0">
        <LookerEmbedFrame reportId={REPORT_ID} height={450} />
      </CardContent>
      <CardFooter>
        {/* <Button className="w-full" aria-label="Connect Looker Studio Account">
          <Link2 className="mr-2 h-4 w-4" /> Connect Account
        </Button> */}
      </CardFooter>
    </Card>
  );
}
