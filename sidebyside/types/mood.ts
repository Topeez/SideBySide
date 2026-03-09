export interface MoodCheckInProps {
  myMood: string | null;
  myMoodUpdatedAt: string | null;
  partnerMood: string | null;
  partnerMoodUpdatedAt: string | null;
  myNickname: string;
  partnerNickname: string;
  myAvatar?: string | null;
  partnerAvatar?: string | null;
  compact?: boolean;
}