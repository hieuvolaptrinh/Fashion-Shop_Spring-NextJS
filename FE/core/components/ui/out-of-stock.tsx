import { cn } from "@/core/lib/utils";

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
        "relative w-full overflow-hidden border border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 text-center",
        variant.container,
        className,
      )}
    >
      <div className={cn("flex items-center justify-center", variant.spacing)}>
        <div className="relative">
          <div
            className={cn(
              "flex items-center justify-center rounded-full bg-gray-300",
              variant.iconMain,
            )}
          >
            <svg
              className={cn("text-gray-500", variant.iconInner)}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div
            className={cn(
              "absolute flex items-center justify-center rounded-full bg-red-500",
              variant.iconBadge,
            )}
          >
            <svg
              className={cn("text-white", variant.iconBadgeInner)}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        {showMessage && (
          <span className={cn("font-medium text-gray-600", variant.text)}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}
