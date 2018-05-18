import { Product } from '../products/product.model';

export class Order {
    id: string;
    uid: string;
    products: Product[] = [];
    totalProducts = 0;
    amount: number;
    created_at: number;
    constructor() {

    }
}
