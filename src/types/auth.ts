
export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  created_at: string;
  profile_pic_url: string | null;
  wins: number;
  losses: number;
  is_pro: boolean;
}
