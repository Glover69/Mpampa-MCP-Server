import {apiClient} from "../api/backend.ts";


export async function getAllProducts() {
    try {
        const result = await apiClient.getAllProducts();
        return {
            success: true,
            data: result,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}