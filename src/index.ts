import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllProducts } from "./tools/products.ts";

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


async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Mpampa MCP Server running!");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});