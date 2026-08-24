import { MEDIA_CONFIG } from './media/giveawayData';
import { ContestPost, Participant } from './types';

/**
 * Automatically maps the settings from `src/media/giveawayData.ts` into the app.
 */

export interface GiveawayConfig {
  winnerCount: number;
  countdownSeconds: number;
  post: ContestPost;
  designatedWinners: Participant[];
  allParticipants: Participant[];
}

// Convert MEDIA_CONFIG.winners into Participant array
const designatedWinners: Participant[] = MEDIA_CONFIG.winners.map((w, idx) => ({
  id: `winner-${idx + 1}`,
  username: w.username,
  fullName: w.fullName,
  avatarUrl: w.profileImage,
  comment: w.comment,
  hasGif: w.hasGif,
  likesCount: 15 + idx * 7,
  timeAgo: `${idx + 1}d`,
  isValid: true,
}));

// Create pool of participants including the 4 winners and extra entries for realistic shuffle
const extraParticipants: Participant[] = [
  {
    id: 'p5',
    username: 'anas_k_mon_mad_boy_kl_52',
    fullName: 'Anas K',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    comment: '🤠🤠😈💜',
    likesCount: 5,
    timeAgo: '1d',
    isValid: true,
  },
  {
    id: 'p6',
    username: 'quail.675259',
    fullName: 'Quail Manoj',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    comment: 'Manoj 😍😍😍😍',
    likesCount: 9,
    timeAgo: '4d',
    isValid: true,
  },
  {
    id: 'p7',
    username: 'mibin_v_mathew',
    fullName: 'Mibin V Mathew',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    comment: '🙌🙌',
    likesCount: 11,
    timeAgo: '2d',
    isValid: true,
  },
  {
    id: 'p8',
    username: 'fernado_shajan',
    fullName: 'Fernando Shajan',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    comment: '🔥🔥',
    likesCount: 16,
    timeAgo: '3d',
    isValid: true,
  },
  {
    id: 'p9',
    username: 'anilu_alexander',
    fullName: 'Anilu Alexander',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    comment: '🔥🔥🔥',
    likesCount: 22,
    timeAgo: '1d',
    isValid: true,
  },
  {
    id: 'p10',
    username: 'akhilaachan_next_level',
    fullName: 'Akhil Achan Next Level',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    comment: '🔥',
    likesCount: 7,
    timeAgo: '2d',
    isValid: true,
  },
];

export const GIVEAWAY_CONFIG: GiveawayConfig = {
  winnerCount: MEDIA_CONFIG.winnerCount || 4,
  countdownSeconds: 8,
  post: {
    id: 'post_01',
    title: MEDIA_CONFIG.giveawayTitle,
    authorUsername: MEDIA_CONFIG.authorUsername,
    authorName: MEDIA_CONFIG.authorName,
    authorAvatar: MEDIA_CONFIG.authorAvatar,
    postImage: MEDIA_CONFIG.videoImage,
    caption: MEDIA_CONFIG.videoCaption,
    commentsCount: MEDIA_CONFIG.commentsCount,
    likesCount: MEDIA_CONFIG.likesCount,
    isVerified: true,
    resultCode: MEDIA_CONFIG.resultCode || 'REHEUV',
    resultLink: MEDIA_CONFIG.resultLink || 'smpl.rs/g/REHEUV',
  },
  designatedWinners,
  allParticipants: [...designatedWinners, ...extraParticipants],
};
