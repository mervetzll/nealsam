export type Question = {
  title: string;
  options: string[];
  multiple?: boolean;
};

export type RiskLevel = "low" | "medium" | "high";

export type Gift = {
  title: string;
  category: string;
  subCategory: string;
  priceMin: number;
  priceMax: number;
  recipients: string[];
  interests: string[];
  styles: string[];
  occasions: string[];
  urgency: string[];
  riskLevel: RiskLevel;
  reason: string;
  note: string;
  searchQuery: string;
};

export type ScoredGift = Gift & {
  score: number;
  matchPercent: number;
};