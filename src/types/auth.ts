
export interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  created_at: string;
  is_pro: boolean;
  wins?: number;
  losses?: number;
  profile_pic_url?: string | null;
}
