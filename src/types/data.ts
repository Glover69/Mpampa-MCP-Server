export interface Cart {
    cartID: string;
    customerID: string;
    email: string;
    items: Items[];
    totalItems: number;
    subtotal: number; // Total price of all items
    totalAmount: number; // Subtotal + delivery cost
    deliveryCost: number;
    discount?: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface Order {
    orderID: string;
    customerID?: string;
    items: Items[];
    shippingAddress: ShippingAddress;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    deliveryCost?: number;
    totalAmount: number;
    discount?: number; // In case a coupon is applied
    orderStatus:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "returned";
    transactionReference: string;
}

export interface Items {
    productID: string;
    productName: string;
    productSize: string;
    type?: string;
    productQuantity: number;
    productImage: string;
    productPrice: number;
    itemID: string
}

export interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    email: string;
}

export interface Product {
    productImage: string;
    status: "Published" | "Inactive" | "Draft";
    subImages: string[];
    productName: string;
    ingredients: string;
    ingredientsChips: IngredientsChips[];
    preparation: string[];
    productPrice: number;
    hasSizes: boolean;
    variations: Variations[];
    type?: any;
    averageReviewRating: number;
    reviewsCount: number;
    reviewsTotalValue: number;
    totalStock: number;
    productID: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IngredientsChips {
    ingredient: string;
    image: string;
}

export interface Variations {
    size: string;
    price: number;
    stock: number;
}