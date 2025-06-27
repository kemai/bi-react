import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DataSourcesContentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  footerContent?: ReactNode;
}

export default function DataSourcesContentCard({ icon: Icon, title, description, children, footerContent }: DataSourcesContentCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <div className="mb-2">
          <Icon className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {footerContent && (
         <CardFooter className="justify-center">
             {footerContent}
         </CardFooter>
      )}
    </Card>
  );
}
