import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gradient-to-br from-fuchsia-200 via-pink-200 to-fuchsia-300 animate-pulse rounded-md",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
