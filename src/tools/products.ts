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


export async function getAProduct(productID: string){
    try {
        const res = await apiClient.getProductById(productID);
        return {
            success: true,
            data: res,
        };
    } catch (error){
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}