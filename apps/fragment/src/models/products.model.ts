export interface ProductBase {
  vendor_id: string;
  product_image_src: string; // link from AWS S3
  product_id: string;
  product_name: string;
  product_cost: number;
  product_sell_price: number;
  product_stock_amount: number;
  product_type: ProductType;
}

export type ProductType = 'WEIGHT' | 'UNITS' | 'LENGTH';
