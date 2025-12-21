

// Configuration
import type {
    Order,
    OrderResponse,
    PaystackChargeResponse,
    Product
} from "../types/data.ts";

const API_BASE_URL = process.env.API_BASE_URL;




class BackendAPI {
    private baseUrl: string | undefined;

    constructor(baseUrl: string | undefined) {
        this.baseUrl = baseUrl;
    }

    // Helper method for making requests
    private async customRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            let data: T;
            // @ts-ignore
            data = await response.json();
            return data;
        } catch (error) {
            console.error(`Request failed for ${endpoint}:`, error);
            throw error;
        }
    }


    // Products method

    async getAllProducts(): Promise<Product[]> {
        return this.customRequest<Product[]>(`/products/all`);
    }

    async getProductById(productId: string): Promise<Product> {
        return this.customRequest<Product>(`/products/one?productID=${productId}`);
    }


    // Order
    async initiatePayment(amount: number, email: string, split_code: string | undefined, phoneNumber: string, network: string): Promise<PaystackChargeResponse>{
        const body = {
            amount,
            email,
            split_code,
            phoneNumber,
            network
        }

        return this.customRequest<PaystackChargeResponse>(`/orders/paystack/charge`, {
            method: 'POST',
            body: JSON.stringify(body)
        })
    }

    async addToTemporaryCart(order: Partial<Order>): Promise<OrderResponse> {
        return this.customRequest<OrderResponse>(`/orders/temporary`, {
            method: 'POST',
            body: JSON.stringify(order),
        });
    }



}

export const apiClient = new BackendAPI(API_BASE_URL);
