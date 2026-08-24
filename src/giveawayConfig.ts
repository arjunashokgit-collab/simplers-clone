import { ContestPost, Participant } from './types';

/**
 * ============================================================================
 * SIMPLIERS GIVEAWAY CONTROL FILE
 * ============================================================================
 * You can control everything on this website from this single file:
 * 
 * 1. `winnerCount`: How many winners to select (1, 2, 3, 4, etc.)
 * 2. `post.postImage`: The image / video thumbnail displayed in the selection screen
 * 3. `designatedWinners`: The exact winners who will appear in the result
 * 4. `allParticipants`: Pool of entries for shuffling and comments modal
 * ============================================================================
 */

export interface GiveawayConfig {
  winnerCount: number;
  countdownSeconds: number;
  post: ContestPost;
  designatedWinners: Participant[];
  allParticipants: Participant[];
}

export const GIVEAWAY_CONFIG: GiveawayConfig = {
  // 1. SELECT HOW MANY WINNERS YOU WANT (e.g. 1, 2, 3, 4, 5)
  winnerCount: 3,

  // Default countdown duration in seconds
  countdownSeconds: 8,

  // 2. CONTEST POST / VIDEO DETAILS & THUMBNAIL IMAGE
  post: {
    id: 'post_anna_george_01',
    title: "Anna George's Giveaway",
    authorUsername: '___anna__geor...',
    authorName: 'Anna George',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    
    // 👉 CHANGE THIS URL to your video thumbnail or post image!
    postImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    
    caption: 'എന്റെ പിന്നാലെ ഒരു വലിയ ലോകമേ ഇണ്ടെന്ന് ‼️‼️',
    commentsCount: 17,
    likesCount: 391,
    isVerified: true,
    resultCode: 'REHEUV',
    resultLink: 'smpl.rs/g/REHEUV',
  },

  // 3. DESIGNATED WINNERS (The people who will win the draw in exact order)
  // Add as many winners as your `winnerCount`!
  designatedWinners: [
    {
      id: 'winner-1',
      username: 'itsmebinsabu',
      fullName: 'Mebin Sabu',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      comment: 'Rider pro max 🤟',
      likesCount: 14,
      timeAgo: '2d',
      isValid: true,
    },
    {
      id: 'winner-2',
      username: 'spin.torque',
      fullName: 'Spin Torque Auto',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'Race speed ready',
      hasGif: true,
      likesCount: 28,
      timeAgo: '1d',
      isValid: true,
    },
    {
      id: 'winner-3',
      username: 'i___am___sonya',
      fullName: 'Sonya Mary',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      comment: 'Angane parappichu vidu paapppaaa 🔥🔥🔥🥰🥰',
      likesCount: 42,
      timeAgo: '3d',
      isValid: true,
    },
  ],

  // 4. PARTICIPANTS POOL (Used for the live shuffle animation and entries search)
  allParticipants: [
    {
      id: 'p1',
      username: 'itsmebinsabu',
      fullName: 'Mebin Sabu',
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      comment: 'Rider pro max 🤟',
      likesCount: 14,
      timeAgo: '2d',
      isValid: true,
    },
    {
      id: 'p2',
      username: 'spin.torque',
      fullName: 'Spin Torque Auto',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'Race speed ready',
      hasGif: true,
      likesCount: 28,
      timeAgo: '1d',
      isValid: true,
    },
    {
      id: 'p3',
      username: 'i___am___sonya',
      fullName: 'Sonya Mary',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      comment: 'Angane parappichu vidu paapppaaa 🔥🔥🔥🥰🥰',
      likesCount: 42,
      timeAgo: '3d',
      isValid: true,
    },
    {
      id: 'p4',
      username: 'alluanepaul',
      fullName: 'Allu Anne Paul',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      comment: '🔥',
      likesCount: 8,
      timeAgo: '2d',
      isValid: true,
    },
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
  ],
};
