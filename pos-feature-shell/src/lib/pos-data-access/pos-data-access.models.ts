export interface ProductAdminStore {
  user?: {
    credentials: {
      username: string;
      password: string;
    };
  };
  products: Product[];
  transactions: Transaction[];
}

export interface ProductCartDetails {
  id: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Product {
  id: string;
  stock: number;
  price: number;
  name: string;
  date_created?: string;
}

export interface Transaction {
  id: string;
  items: ProductCartDetails[];
  date_created: string; // YYYY-MM-DD
  amount: number;
  cashAmount: number;
  change: number;
}
