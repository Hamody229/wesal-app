import type { Product } from "./Product";

export type AnalysisResponse = {
  items: Product[];
  cheapest: Product | null;
  expensive: Product | null;
  bestValue: Product | null;
};
