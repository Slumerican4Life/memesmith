
export interface TextPosition {
  x: number;
  y: number;
}

export interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  textPositions: {
    top: TextPosition;
    bottom: TextPosition;
  };
  pro_only?: boolean;
}

export interface Meme {
  id: string;
  user_id: string;
  template_id: string;
  template_url: string;
  top_text: string;
  bottom_text: string;
  meme_url: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  likes: number;
}
