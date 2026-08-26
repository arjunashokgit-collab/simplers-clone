export interface PresetImage {
  id: string;
  name: string;
  category: 'post' | 'avatar';
  url: string;
}

export const POST_IMAGE_PRESETS: PresetImage[] = [
  {
    id: 'car-supercar',
    name: 'Red Supercar & Bike',
    category: 'post',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'tech-iphone',
    name: 'iPhone & Tech Gear',
    category: 'post',
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'luxury-watch',
    name: 'Luxury Watch & Style',
    category: 'post',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'travel-resort',
    name: 'Tropical Maldives Travel',
    category: 'post',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'gaming-setup',
    name: 'Gaming Setup & RGB',
    category: 'post',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sneakers-shoes',
    name: 'Hype Sneakers & Fashion',
    category: 'post',
    url: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&auto=format&fit=crop&q=80',
  },
];

export const AVATAR_PRESETS: PresetImage[] = [
  {
    id: 'avatar-female-1',
    name: 'Anna (Host)',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-male-1',
    name: 'Mebin',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-male-2',
    name: 'Alex',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-female-2',
    name: 'Sonya',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-female-3',
    name: 'Allu Anne',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-male-3',
    name: 'Rohan',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-male-4',
    name: 'David',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-female-4',
    name: 'Sophia',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
];

export const RANDOM_SAMPLE_PARTICIPANTS = [
  {
    username: 'rahul_rider_99',
    fullName: 'Rahul Krishnan',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    comment: 'Let’s goooo! 🔥 Need this win badly!',
  },
  {
    username: 'priya_sharma_vlogs',
    fullName: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    comment: 'Awesome giveaway! Hope I get lucky 🥰🎉',
  },
  {
    username: 'vipin_speedster',
    fullName: 'Vipin Das',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    comment: 'Best content ever bro 🚀💯',
  },
  {
    username: 'neha_k_official',
    fullName: 'Neha Kapoor',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    comment: 'Shared with all my friends! Fingers crossed 🤞✨',
  },
  {
    username: 'aditya_gamer_x',
    fullName: 'Aditya Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    comment: 'Insane ride! Simpliers is the best 👑',
  },
  {
    username: 'ananya_creative',
    fullName: 'Ananya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    comment: 'Count me in! Super excited ❤️✨',
  },
];
