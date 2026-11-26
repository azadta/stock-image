export interface StockImage {
  _id: string;
  user: string;
  title: string;
  imageUrl: string;
  order: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = "login" | "register" | "verify";
