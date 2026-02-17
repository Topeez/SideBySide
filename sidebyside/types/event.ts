export type Event = {
    id: string;
    title: string;
    start_time: string;
    end_time?: string | null;
    location?: string | null;
    color?: string | null;
    couple_id?: string | null;
    created_at: string;
    is_birthday?: boolean;
    description?: string | null;
    type?: string | null;
    creator_id?: string | null;
};

export interface ClosestEventProps {
    nextEvent: Event | null;
    hasCouple: boolean;
    coupleId?: string;
}