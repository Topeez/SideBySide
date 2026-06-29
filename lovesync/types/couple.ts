export interface BucketItem {
  id: string;
  title: string;
  status: "planned" | "in_progress" | "completed";
  image_url?: string;
  target_date?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon: string;
}