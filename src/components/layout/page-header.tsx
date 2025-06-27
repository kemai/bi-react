
import type { FC } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8 text-center md:text-left w-full">
      <h1 className="text-3xl font-bold text-primary">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground mt-2">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
