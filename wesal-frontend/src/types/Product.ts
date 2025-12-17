import type { Merchant } from "./Merchant";

export type Product = {
  _id?: string;
  name: string;
  category: string;
  price: number;
  quantity: number;

  merchantId?: string;

  merchant?: Merchant;
};
