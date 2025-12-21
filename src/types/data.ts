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



export interface OrderResponse {
    message: string,
    order: Order
}

export interface InitializeTransactionResponse {
    status: boolean;
    message: string;
    data: Data;
}

export interface Data {
    authorization_url: string;
    access_code: string;
    reference: string;
}



export interface PaystackLog {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    input: any[];
    history: Array<{
        type: string;
        message: string;
        time: number;
    }>;
}

export interface PaystackAuthorization {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
}

export interface PaystackCustomer {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: Record<string, any> | null;
    risk_action: string;
    international_format_phone: string | null;
}

export interface PaystackSplit {
    id: number;
    name: string;
    type: string;
    currency: string;
    integration: number;
    domain: string;
    split_code: string;
    active: boolean;
    bearer_type: string;
    bearer_subaccount: number | null;
    created_at: string;
    updated_at: string;
}

export interface PaystackSubaccount {
    id: number;
    subaccount_code: string;
    business_name: string;
    description: string;
    primary_contact_name: string | null;
    primary_contact_email: string | null;
    primary_contact_phone: string | null;
    metadata: Record<string, any> | null;
    percentage_charge: number;
    settlement_bank: string;
    account_number: string;
}

export interface PaystackPlanObject {
    id: number | null;
    name: string | null;
    plan_code: string | null;
    description: string | null;
    amount: number | null;
    interval: string | null;
    send_invoices: boolean | null;
    send_sms: boolean | null;
    currency: string | null;
}

export interface PaystackTransactionData {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: number | Record<string, any>;
    log: PaystackLog;
    fees: number;
    fees_split: any | null;
    authorization: PaystackAuthorization;
    customer: PaystackCustomer;
    plan: any | null;
    split: PaystackSplit;
    order_id: string | null;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any | null;
    source: any | null;
    fees_breakdown: any | null;
    connect: any | null;
    transaction_date: string;
    plan_object: PaystackPlanObject;
    subaccount: PaystackSubaccount;
}

export interface PaystackChargeResponse {
    status: boolean;
    message: string;
    data: {
        status: boolean;
        message: string;
        data: PaystackTransactionData;
    };
}