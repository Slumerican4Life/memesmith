
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
