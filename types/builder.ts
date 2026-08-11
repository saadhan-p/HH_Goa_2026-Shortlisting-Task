export interface BuilderState {
  mode: 'card' | 'pfp';
  image: File | null;
  imageUrl: string | null;
  name: string;
  role: string;
  stack: string;
  builderTitle: string;
  zoom: number;
  positionX: number; // offset X percentage (-100 to 100)
  positionY: number; // offset Y percentage (-100 to 100)
}
