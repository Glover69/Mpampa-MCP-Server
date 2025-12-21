import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {getAllProducts, getAProduct} from "./tools/products.ts";
import {z} from "zod";
import {initiatePayment, orderItems} from "./tools/order.ts";

// Create server instance
const server = new McpServer({
    name: "Mpampa MCP Server",
    version: "1.0.0",
});


 server.registerTool(
     "get_products",
     {
         description: "Get all the products from Mpampa Cereals for the user to select",
         inputSchema: {

         },
     },
     async () => {
         const result = await getAllProducts();

         return {
             content: [
                 {
                     type: "text",
                     text: JSON.stringify(result, null, 2),
                 },
             ],
         }
     }
 )

server.registerTool(
    "get_one_product",
    {
        description: "Fetch the information for a particular product. If the name is made up of one or more words, break it down to smaller letters and put hyphens" +
            "in between the words",
        inputSchema: z.object({
            productID: z
                .string()
                .describe("The product ID for the item being searched for")
        }),
    },
    async ( call ) => {
        const result = await getAProduct(call.productID);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        }
    }
)

const ItemsSchema = z.object({
    productID: z.string(),
    productName: z.string(),
    productSize: z.string(),
    type: z.string().optional(),
    productQuantity: z.number().int().positive(),
    productImage: z.string(),
    productPrice: z.number().int().positive(),
    itemID: z.string()
});

const ShippingAddressSchema = z.object({
    fullName: z.string(),
    phone: z.string(),
    address: z.string(),
    email: z.string(),
});

export const CreateOrderInputSchema = z.object({
    customerID: z.string().optional(),
    items: z.array(ItemsSchema).min(1, "Order must have at least one item"),
    shippingAddress: ShippingAddressSchema,
    deliveryCost: z.number().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    totalAmount: z.number().nonnegative().describe("Calculate the total amount for the order and place the value here."),
    orderStatus: z.any().default("pending"),
    transactionReference: z.string().optional(),
    network: z.string().toLowerCase().default("mtn"),
    paymentStatus: z.any().default("pending")
});


server.registerTool(
    "place_order",
    {
        description: "Place an order for the user based on the information they give you; e.g. the product and the quantity they want." +
            "If they don't provide all the necessary details, prompt them to add the remaining details needed to place the order before doing so" +
            "Make The default paymentStatus and orderStatus pending. Ignore the fields marked as optional",
        inputSchema: CreateOrderInputSchema
    },
    async ( call ) => {

        // Test split code
        const split_code = process.env.SPLIT_CODE_TEST;
        const resOne = await initiatePayment((call.totalAmount * 100), call.shippingAddress.email, split_code, call.shippingAddress.phone, call.network)

        if (!resOne.success) {
            throw new Error("Failed to initiate payment");
        }

        if (resOne.data?.data.data.reference){
            call.transactionReference = resOne.data?.data.data.reference;
        }

        const result = await orderItems(call);

        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(result, null, 2),
                },
            ],
        }
    }
)


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Mpampa MCP Server running!");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});