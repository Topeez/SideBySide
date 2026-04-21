import React from "react";
import { Button, buttonVariants } from "./ui/button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface ActionButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    isLoading?: boolean;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
    (
        {
            children,
            onClick,
            size,
            type = "button",
            variant,
            className,
            disabled,
            isLoading,
            ...props
        },
        ref
    ) => {
        return (
            <Button
                ref={ref}
                type={type}
                onClick={onClick}
                variant={variant}
                size={size}
                disabled={disabled || isLoading}
                className={cn(
                    "inset-shadow-muted inset-shadow-xs gap-2 shadow-md border-none text-button-text cursor-pointer",
                    className,
                    "disabled:shadow-none disabled:inset-shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                )}
                {...props}
            >
                {children}
            </Button>
        );
    }
);

ActionButton.displayName = "ActionButton";

export default ActionButton;