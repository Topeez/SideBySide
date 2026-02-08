import { DashboardLayoutType } from "@/app/actions/profile";

type WidgetClasses = {
  closestEvent: string;
  loveNote: string;
  todo: string;
  calendar: string;
  profile: string;
};

export const layoutConfig: Record<DashboardLayoutType, WidgetClasses> = {
  // Klasický layout (jako máš teď)
  default: {
    closestEvent: "col-span-12 md:col-span-8",
    loveNote: "col-span-12 md:col-span-4",
    todo: "col-span-12 md:col-span-4",
    calendar: "col-span-12 md:col-span-4",
    profile: "col-span-12 md:col-span-4",
  },
  // Focus layout - Úkoly jsou velké, události menší
  focus: {
    closestEvent: "col-span-12 md:col-span-6",
    loveNote: "col-span-12 md:col-span-6",
    todo: "col-span-12 md:col-span-8 row-span-2", // Velké úkoly
    calendar: "col-span-12 md:col-span-4",
    profile: "col-span-12 md:col-span-4",
  },
  // Calendar layout - Kalendář je dominantní
  calendar: {
    closestEvent: "col-span-12 md:col-span-8",
    loveNote: "col-span-12 md:col-span-4",
    profile: "col-span-12 md:col-span-4",
    calendar: "col-span-12 md:col-span-8 row-span-2", // Velký kalendář
    todo: "col-span-12 md:col-span-4",
  },
};
