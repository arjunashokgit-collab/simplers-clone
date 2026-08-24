export interface Participant {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  comment: string;
  hasGif?: boolean;
  isVerified?: boolean;
  likesCount?: number;
  timeAgo?: string;
  isValid?: boolean;
}

export interface ContestPost {
  id: string;
  title: string;
  authorUsername: string;
  authorName: string;
  authorAvatar: string;
  postImage: string;
  caption: string;
  commentsCount: number;
  likesCount: number;
  isVerified: boolean;
  resultCode: string;
  resultLink: string;
}

export type ScreenState = 'setup' | 'receiving' | 'result_pre' | 'live_draw' | 'winners_saved';

export interface WinnerSlotState {
  slotIndex: number;
  currentParticipant: Participant;
  currentNumber: number;
  isFinalized: boolean;
  isValid: boolean;
}
