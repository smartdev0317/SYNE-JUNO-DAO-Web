import { FC, ReactNode, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

const Boundary: FC<{ fallback?: ReactNode; children: any }> = ({
  children,
  fallback,
}) => {
  const renderError = (error?: Error) => <span>Oops!!</span>;
  return (
    <ErrorBoundary fallback={renderError}>
      <Suspense fallback={fallback ?? null}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default Boundary;

/* utils */
export const bound = (children: ReactNode, fallback?: ReactNode) => (
  <Boundary fallback={fallback}>{children}</Boundary>
);
