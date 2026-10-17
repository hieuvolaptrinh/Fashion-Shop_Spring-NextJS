import { cn } from "@/core/lib/utils";
import { AlertCircle, X } from "lucide-react";

interface OutOfStockProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showMessage?: boolean;
  message?: string;
}

const sizeVariants = {
  sm: {
    container: "p-2 rounded-lg",
    iconMain: "h-4 w-4",
    iconInner: "h-2.5 w-2.5",
    iconBadge: "h-2.5 w-2.5 -top-0.5 -right-0.5",
    iconBadgeInner: "h-1.5 w-1.5",
    text: "text-xs",
    spacing: "space-x-2",
  },
  md: {
    container: "p-3 rounded-xl",
    iconMain: "h-5 w-5",
    iconInner: "h-3 w-3",
    iconBadge: "h-3 w-3 -top-1 -right-1",
    iconBadgeInner: "h-2 w-2",
    text: "text-sm",
    spacing: "space-x-2",
  },
  lg: {
    container: "p-4 rounded-xl",
    iconMain: "h-6 w-6",
    iconInner: "h-4 w-4",
    iconBadge: "h-4 w-4 -top-1 -right-1",
    iconBadgeInner: "h-2 w-2",
    text: "text-base",
    spacing: "space-x-3",
  },
};

export default function OutOfStock({
  size = "sm",
  className,
  showMessage = true,
  message = "Hết hàng",
}: OutOfStockProps) {
  const variant = sizeVariants[size];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-border/80 bg-muted/40 text-center",
        variant.container,
        className,
      )}
    >
      <div className={cn("flex items-center justify-center", variant.spacing)}>
        <div className="relative">
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-muted",
              variant.iconMain,
            )}
          >
            <AlertCircle className={cn("text-muted-foreground", variant.iconInner)} />
          </div>
          <div
            className={cn(
              "absolute flex items-center justify-center rounded-full bg-destructive text-destructive-foreground",
              variant.iconBadge,
            )}
          >
            <X className={variant.iconBadgeInner} />
          </div>
        </div>
        {showMessage && (
          <span className={cn("font-medium text-muted-foreground", variant.text)}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
