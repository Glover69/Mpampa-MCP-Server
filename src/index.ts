import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {getAllProducts, getAProduct} from "./tools/products.ts";
import {z} from "zod";

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


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Mpampa MCP Server running!");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});