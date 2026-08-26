import { MEDIA_CONFIG, InstagramWinner } from '../media/giveawayData';
import { ContestPost, Participant } from '../types';

export interface FullGiveawayData {
  winnerCount: number;
  countdownSeconds: number;
  giveawayTitle: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  videoImage: string;
  videoCaption: string;
  commentsCount: number;
  likesCount: number;
  resultCode: string;
  resultLink: string;
  winners: InstagramWinner[];
  extraParticipants: Participant[];
}

export const STORAGE_KEY = 'simpliers_giveaway_media_config_v2';

export const DEFAULT_EXTRA_PARTICIPANTS: Participant[] = [
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

export const getDefaultGiveawayData = (): FullGiveawayData => {
  return {
    winnerCount: MEDIA_CONFIG.winnerCount || 4,
    countdownSeconds: 8,
    giveawayTitle: MEDIA_CONFIG.giveawayTitle || "Anna George's Giveaway",
    authorName: MEDIA_CONFIG.authorName || "Anna George",
    authorUsername: MEDIA_CONFIG.authorUsername || "___anna__geor...",
    authorAvatar: MEDIA_CONFIG.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    videoImage: MEDIA_CONFIG.videoImage || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",
    videoCaption: MEDIA_CONFIG.videoCaption || "എന്റെ പിന്നാലെ ഒരു വലിയ ലോകമേ ഇണ്ടെന്ന് ‼️‼️",
    commentsCount: MEDIA_CONFIG.commentsCount || 17,
    likesCount: MEDIA_CONFIG.likesCount || 391,
    resultCode: MEDIA_CONFIG.resultCode || "REHEUV",
    resultLink: MEDIA_CONFIG.resultLink || "smpl.rs/g/REHEUV",
    winners: MEDIA_CONFIG.winners && MEDIA_CONFIG.winners.length > 0 ? [...MEDIA_CONFIG.winners] : [
      {
        username: "itsmebinsabu",
        fullName: "Mebin Sabu",
        profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        comment: "Rider pro max 🤟",
        hasGif: false,
      },
      {
        username: "spin.torque",
        fullName: "Spin Torque Auto",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        comment: "Race speed ready",
        hasGif: true,
      },
      {
        username: "i___am___sonya",
        fullName: "Sonya Mary",
        profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        comment: "Angane parappichu vidu paapppaaa 🔥🔥🔥🥰🥰",
        hasGif: false,
      },
      {
        username: "alluanepaul",
        fullName: "Allu Anne Paul",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        comment: "Super video! Winning this 🔥",
        hasGif: false,
      },
    ],
    extraParticipants: DEFAULT_EXTRA_PARTICIPANTS,
  };
};

export const loadStoredGiveawayData = (): FullGiveawayData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultGiveawayData(),
        ...parsed,
      };
    }
  } catch (err) {
    console.error('Failed to load giveaway configuration from localStorage:', err);
  }
  return getDefaultGiveawayData();
};

export const saveStoredGiveawayData = (data: FullGiveawayData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save giveaway configuration to localStorage:', err);
  }
};

export const resetStoredGiveawayData = (): FullGiveawayData => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
  return getDefaultGiveawayData();
};

/**
 * Reads any File object from user's filesystem and converts it to a Base64 data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    reader.onerror = () => reject(reader.error || new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
};

/**
 * Converts the FullGiveawayData into runtime ContestPost, designatedWinners, and allParticipants
 */
export const buildRuntimeConfig = (data: FullGiveawayData) => {
  const designatedWinners: Participant[] = data.winners.map((w, idx) => ({
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

  const post: ContestPost = {
    id: 'post_01',
    title: data.giveawayTitle,
    authorUsername: data.authorUsername,
    authorName: data.authorName,
    authorAvatar: data.authorAvatar,
    postImage: data.videoImage,
    caption: data.videoCaption,
    commentsCount: data.commentsCount,
    likesCount: data.likesCount,
    isVerified: true,
    resultCode: data.resultCode || 'REHEUV',
    resultLink: data.resultLink || 'smpl.rs/g/REHEUV',
  };

  const allParticipants: Participant[] = [
    ...designatedWinners,
    ...(data.extraParticipants && data.extraParticipants.length > 0
      ? data.extraParticipants
      : DEFAULT_EXTRA_PARTICIPANTS),
  ];

  return {
    winnerCount: Math.min(data.winnerCount || 4, designatedWinners.length || 1),
    countdownSeconds: data.countdownSeconds || 8,
    post,
    designatedWinners,
    allParticipants,
  };
};

/**
 * Generate TypeScript code string that can be pasted into `src/media/giveawayData.ts`
 */
export const generateTypeScriptCode = (data: FullGiveawayData): string => {
  return `/**
 * ============================================================================
 * SIMPLIERS GIVEAWAY MEDIA & WINNERS CONFIGURATION
 * File Path: src/media/giveawayData.ts
 * ============================================================================
 */

export interface InstagramWinner {
  username: string;
  fullName: string;
  profileImage: string;
  comment: string;
  hasGif?: boolean;
}

export const MEDIA_CONFIG = {
  winnerCount: ${data.winnerCount},

  giveawayTitle: ${JSON.stringify(data.giveawayTitle)},
  authorName: ${JSON.stringify(data.authorName)},
  authorUsername: ${JSON.stringify(data.authorUsername)},
  authorAvatar: ${JSON.stringify(data.authorAvatar)},

  videoImage: ${JSON.stringify(data.videoImage)},
  videoCaption: ${JSON.stringify(data.videoCaption)},

  commentsCount: ${data.commentsCount},
  likesCount: ${data.likesCount},
  resultCode: ${JSON.stringify(data.resultCode)},
  resultLink: ${JSON.stringify(data.resultLink)},

  winners: ${JSON.stringify(data.winners, null, 4)} as InstagramWinner[],
};
`;
};
