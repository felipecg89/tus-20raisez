import * as React from "react";

export const Spinner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  )
);
Spinner.displayName = "Spinner";
