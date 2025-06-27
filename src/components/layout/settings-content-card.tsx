import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SettingsContentCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
  iconClassName?: string;
}

export default function SettingsContentCard({ icon: Icon, title, description, children, iconClassName }: SettingsContentCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <div className="mb-2">
          <Icon className={`h-12 w-12 text-primary ${iconClassName || ''}`} />
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
