
export const APP_CONFIG = {
  MEDIA_UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/quicktime'],
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 6,
    MAX_POST_CONTENT_LENGTH: 500,
    MAX_COMMENT_LENGTH: 280,
  },
  UI: {
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 5000,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  LIKES: '/likes',
  HISTORY: '/history',
  SEARCH: '/search',
  POST_DETAIL: (id: string) => `/post/${id}`,
  USER_PROFILE: (username: string) => `/user/${username}`,
} as const;

export const THEME_CONFIG = {
  LOGO_LIGHT: "/lovable-uploads/93af301e-74f3-46b0-8935-2af2039cabcf.png",
  LOGO_DARK: "/lovable-uploads/00b1e86b-2813-433a-9aea-d914e445fe0a.png",
} as const;
