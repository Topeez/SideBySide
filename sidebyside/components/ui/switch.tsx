"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";
import { MoonIcon, SunMediumIcon } from "lucide-react";

const Switch = React.forwardRef<
    React.ElementRef<typeof SwitchPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & {
        icon?: React.ReactNode;
        thumbClassName?: string;
    }
>(({ className, icon, thumbClassName, ...props }, ref) => (
    <SwitchPrimitive.Root
        className={cn(
            "peer inline-flex items-center data-[state=checked]:bg-primary data-[state=unchecked]:bg-input disabled:opacity-50 shadow-xs border-2 border-transparent rounded-full focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background w-9 h-5 transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0",
            className,
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitive.Thumb
            className={cn(
                "flex justify-center items-center bg-background shadow-lg rounded-full ring-0 w-4 h-4 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 pointer-events-none",
                thumbClassName,
            )}
        >
            {icon ? icon : null}
        </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
));
Switch.displayName = SwitchPrimitive.Root.displayName;

const SwitchCustomizationDemo = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    return (
        <Switch
            icon={
                isDarkMode ? (
                    <MoonIcon className="w-4 h-4" />
                ) : (
                    <SunMediumIcon className="w-4 h-4" />
                )
            }
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
            className="w-12 h-7"
            thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
        />
    );
};

export default SwitchCustomizationDemo;
