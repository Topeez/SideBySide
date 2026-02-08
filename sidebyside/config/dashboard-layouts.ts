import { DashboardLayoutType } from "@/app/actions/profile";

type WidgetClasses = {
  closestEvent: string;
  loveNote: string;
  todo: string;
  calendar: string;
  profile: string;
};

export const layoutConfig: Record<DashboardLayoutType, WidgetClasses> = {
  default: {
    closestEvent: "col-span-12 md:col-span-8",
    loveNote: "col-span-12 md:col-span-4",
    todo: "col-span-12 md:col-span-4",
    calendar: "col-span-12 md:col-span-4",
    profile: "col-span-12 md:col-span-4",
  },
  focus: {
    closestEvent: "col-span-12 md:col-span-6",
    loveNote: "col-span-12 md:col-span-6",
    todo: "col-span-12 md:col-span-8 row-span-2", 
    calendar: "col-span-12 md:col-span-4",
    profile: "col-span-12 md:col-span-4",
  },
  calendar: {
    closestEvent: "col-span-12 md:col-span-8",
    loveNote: "col-span-12 md:col-span-4",
    profile: "col-span-12 md:col-span-4",
    calendar: "col-span-12 md:col-span-8 row-span-2",
    todo: "col-span-12 md:col-span-4",
  },
};
