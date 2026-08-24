/**
 * ============================================================================
 * SIMPLIERS GIVEAWAY MEDIA & WINNERS CONFIGURATION
 * File Path: src/media/giveawayData.ts
 * ============================================================================
 * Edit this file to customize:
 * 1. Video / Post thumbnail image (`videoImage`)
 * 2. Video caption (`videoCaption`)
 * 3. Giveaway title & author info
 * 4. The 4 Instagram Winners (Username, Profile Image, and Comment)
 * ============================================================================
 */

export interface InstagramWinner {
  username: string;       // Instagram handle (e.g., 'itsmebinsabu')
  fullName: string;       // Full name (e.g., 'Mebin Sabu')
  profileImage: string;   // Web URL or local image path (e.g., '/media/winner1.jpg')
  comment: string;        // The winner's comment text
  hasGif?: boolean;       // Set true if comment has a GIF badge
}

export const MEDIA_CONFIG = {
  // 1. NUMBER OF WINNERS (1 to 4)
  winnerCount: 4,

  // 2. VIDEO / POST DETAILS & THUMBNAIL
  giveawayTitle: "Anna George's Giveaway",
  authorName: "Anna George",
  authorUsername: "___anna__geor...",
  authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",

  // 👉 CHANGE THE VIDEO / POST IMAGE DISPLAYED WHILE DRAWING HERE:
  videoImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80",

  // 👉 CHANGE THE VIDEO CAPTION HERE:
  videoCaption: "എന്റെ പിന്നാലെ ഒരു വലിയ ലോകമേ ഇണ്ടെന്ന് ‼️‼️",

  commentsCount: 17,
  likesCount: 391,
  resultCode: "REHEUV",
  resultLink: "smpl.rs/g/REHEUV",

  // 3. THE 4 INSTAGRAM WINNERS WITH PROFILE IMAGES & COMMENTS:
  winners: [
    // --- WINNER 1 ---
    {
      username: "itsmebinsabu",
      fullName: "Mebin Sabu",
      profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
      comment: "Rider pro max 🤟",
      hasGif: false,
    },

    // --- WINNER 2 ---
    {
      username: "spin.torque",
      fullName: "Spin Torque Auto",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      comment: "Race speed ready",
      hasGif: true,
    },

    // --- WINNER 3 ---
    {
      username: "i___am___sonya",
      fullName: "Sonya Mary",
      profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      comment: "Angane parappichu vidu paapppaaa 🔥🔥🔥🥰🥰",
      hasGif: false,
    },

    // --- WINNER 4 ---
    {
      username: "alluanepaul",
      fullName: "Allu Anne Paul",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      comment: "Super video! Winning this 🔥",
      hasGif: false,
    },
  ] as InstagramWinner[],
};
