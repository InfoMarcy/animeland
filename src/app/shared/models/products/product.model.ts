export class Product {
    id: string;
    name: string;
    price: number;
    category?: string;
    subcategory?: string;
    cost?: number;
    profit?: number;
    description?: string;
    stock_quantity?: number;
    stock_location?: string;
    created_at?: Date = new Date;
    isFavorite?: Boolean;
}
