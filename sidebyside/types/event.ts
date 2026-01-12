export type Event = {
    id: string;
    title: string;
    start_time: string;
    end_time?: string | null;
    location?: string | null;
    color?: string | null;
};

export interface ClosestEventProps {
    nextEvent: Event | null;
    hasCouple: boolean;
    coupleId?: string;
}