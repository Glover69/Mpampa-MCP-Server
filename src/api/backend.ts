



// Configuration
import type {Product} from "../types/data.ts";

const API_BASE_URL = 'http://localhost:8080/api';


class BackendAPI {
    private baseUrl: string;

    constructor(baseUrl: string) {
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



}

export const apiClient = new BackendAPI(API_BASE_URL);
