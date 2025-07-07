import { ReactNode } from 'react';

export default function ProjectDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  // The layout for project detail pages
  // We'll implement the activity feed sidebar here later
  return (
    <div className="h-full">
      {children}
    </div>
  );
}