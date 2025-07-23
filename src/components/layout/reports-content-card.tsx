import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ReportsContentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}

export default function ReportsContentCard({ icon: Icon, title, description, children }: ReportsContentCardProps) {
  return (
    // <Card className="w-full">
    <Card className="md:col-span-6 lg:col-span-3">
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
    </Card>
  );
}
