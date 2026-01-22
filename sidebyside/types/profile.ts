export interface Profile {
  full_name: string | null;
  nickname: string | null;
  email: string | null;
  bio: string | null;
  clothing_size_top: string | null;
  clothing_size_bottom: string | null;
  shoe_size: string | null;
  ring_size: string | null;
  love_language: string | null;
  favorite_color: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any | null;
}

export interface ProfileData {
  user_id: string;
  email: string;
  full_name: string;
  nickname?: string;
  avatar_url?: string;
}