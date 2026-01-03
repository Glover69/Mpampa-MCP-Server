import type {Data, InitializeTransactionResponse, Order, PaystackChargeResponse} from "../types/data.ts";
import {apiClient} from "../api/backend.ts";


export async function orderItems(order: Partial<Order>){
    try {
        const result = await apiClient.addToTemporaryCart(order)
        return {
            success: true,
            data: result,
        };
    } catch (error){
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

export async function initiatePayment(amount: number, email: string, split_code: string | undefined, phoneNumber: string, network: string): Promise<{
    message: string;
    status: boolean;
    success: boolean;
    data?: PaystackChargeResponse;
}>{

    try {
        const res = await apiClient.initiatePayment(amount, email, split_code, phoneNumber, network)
        return {
            message: res.message, status: false,
            success: true,
            data: res
        };
    } catch (error: any) {
        return {
            message: error.message || "Unknown error",
            success: false,
            status: false,
        };
    }
}


export async function submitOTP(otp: string, reference: string): Promise<{
    message: string;
    status: boolean;
    success: boolean;
    data?: PaystackChargeResponse;
}>{

    try {
        const res = await apiClient.verifyOTP(otp, reference)
        return {
            message: res.message, status: false,
            success: true,
            data: res
        };
    } catch (error: any) {
        return {
            message: error.message || "Unknown error",
            success: false,
            status: false,
        };
    }

}
