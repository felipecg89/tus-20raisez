import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface BuilderContentProps {
  model: string;
  content?: any;
  className?: string;
}

/**
 * Component for rendering Builder.io content
 * 
 * This component will use the @builder.io/react package when it's installed.
 * Until then, it provides a fallback UI for development.
 * 
 * Usage:
 * <BuilderContent model="navbar" />
 * <BuilderContent model="login-page" />
 * <BuilderContent model="agents-dashboard" />
 */
export const BuilderContent: React.FC<BuilderContentProps> = ({
  model,
  content,
  className,
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [model]);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-slate-200 rounded ${className}`}>
        <div className="h-40 bg-slate-300 rounded"></div>
      </div>
    );
  }

  // If content is provided, render it
  if (content) {
    return <div className={className}>{content}</div>;
  }

  // Fallback UI showing placeholder
  return (
    <div className={`border-2 border-dashed border-slate-400 p-4 rounded ${className}`}>
      <div className="text-center text-slate-600">
        <p className="font-semibold mb-2">Builder.io Content: {model}</p>
        <p className="text-sm mb-4">
          This content will be rendered from Builder.io once configured.
        </p>
        
        {/* Display current user context for testing */}
        {user && (
          <div className="text-xs bg-slate-100 p-2 rounded mt-2">
            <p>
              Logged in as: <strong>{user.email}</strong>
            </p>
            <p>
              Role: <strong className="capitalize">{user.role}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Hook for fetching Builder.io content
 * Placeholder for future implementation when @builder.io/react is installed
 */
export const useBuilderContent = (model: string) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // TODO: Implement actual Builder.io API call when package is installed
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      }
    };

    fetchContent();
  }, [model]);

  return { content, loading, error };
};
