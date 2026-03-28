import type { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="max-w-[1600px] mx-auto p-6 animate-slide-in">
      {children}
    </div>
  );
}
