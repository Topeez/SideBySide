import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
interface ActionButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    size?: VariantProps<typeof buttonVariants>["size"];
    type?: "button" | "submit" | "reset";
    variant?: VariantProps<typeof buttonVariants>["variant"];
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export default function ActionButton({
    children,
    onClick,
    size,
    type = "button",
    variant,
    className,
    disabled,
    isLoading,
}: ActionButtonProps) {
    return (
        <Button
            type={type}
            onClick={onClick}
            variant={variant}
            size={size}
            disabled={disabled || isLoading}
            className={cn(
                "inset-shadow-primary-foreground inset-shadow-xs gap-2 shadow-md border-none text-button-text cursor-pointer",
                className,
                "disabled:shadow-none disabled:inset-shadow-none disabled:cursor-not-allowed disabled:opacity-50",
            )}
        >
            {children}
        </Button>
    );
}
