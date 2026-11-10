export const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "CONTENT_EDITOR",
  "SUPPORT",
  "ANALYST",
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const USER_ROLES = ["USER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const MASCOT_CATEGORIES = ["PLANT", "ANIMAL", "FANTASY"] as const;
export type MascotCategory = (typeof MASCOT_CATEGORIES)[number];

export const MASCOT_RARITIES = ["COMMON", "RARE", "EPIC", "LEGENDARY"] as const;
export type MascotRarity = (typeof MASCOT_RARITIES)[number];

export const MASCOT_UNLOCK_TYPES = [
  "FREE",
  "COINS",
  "POINTS",
  "STREAK_MILESTONE",
] as const;
export type MascotUnlockType = (typeof MASCOT_UNLOCK_TYPES)[number];

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: UserRole;
  enabled: boolean;
  countryCode: string | null;
  countryName: string | null;
  timezone: string | null;
  goldCoins: number;
  rankPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalFocusMinutes: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
}

export interface Mascot {
  id: string;
  name: string;
  description: string | null;
  category: MascotCategory;
  rarity: MascotRarity;
  unlockType: MascotUnlockType;
  costCoins: number;
  costPoints: number;
  requiredStreakDays: number;
  riveAssetPath: string;
  previewImageUrl: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  ownedCount?: number;
}

export interface ActivityPoint {
  date: string;
  activeUsers: number;
  focusMinutes: number;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers7d: number;
  newUsers7d: number;
  totalMascots: number;
  activeMascots: number;
  totalFocusMinutes: number;
  activity: ActivityPoint[];
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  username: string;
  role?: string;
}

export interface ProfileResponse {
  id: string;
  username: string;
  displayName: string | null;
  countryCode: string | null;
  timezone: string | null;
  avatarUrl: string | null;
  rankPoints: number;
  goldCoins: number;
  totalFocusMinutes: number;
  currentStreak: number;
  longestStreak: number;
  role?: string;
}

export interface FocusCategory {
  id: string;
  name: string;
  iconName: string | null;
  colorHex: string | null;
  isSystem: boolean;
  profileId: string | null;
  createdAt: string;
}

export const BADGE_CATEGORIES = [
  "STREAK",
  "TIME",
  "SPECIAL",
  "COMMUNITY",
] as const;
export type BadgeCategory = (typeof BADGE_CATEGORIES)[number];

export const BADGE_PROGRESS_TYPES = [
  "COUNT",
  "SUM",
  "STREAK",
] as const;
export type BadgeProgressType = (typeof BADGE_PROGRESS_TYPES)[number];

export interface Badge {
  id: string;
  title: string;
  description: string;
  category: BadgeCategory;
  progressType: BadgeProgressType;
  targetValue: number;
  unit: string;
  iconName: string | null;
  iconUrl: string | null;
  createdAt: string;
  updatedAt?: string;
}
