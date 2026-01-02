import { Hono } from "hono";
import { cors } from "hono/cors";
import { streamSSE } from "hono/streaming";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { createServer } from "./server";

const app = new Hono();

// Enable CORS
app.use("*", cors());

// Store active sessions
const sessions = new Map<string, SSEServerTransport>();

// Health check
app.get("/health", (c) => {
    return c.json({ status: "ok", server: "Mpampa MCP Server", runtime: "bun" });
});

// SSE endpoint - initiates connection
app.get("/sse", async (c) => {
    const server = createServer();

    return streamSSE(c, async (stream) => {
        const transport = new SSEServerTransport("/messages", {
            setHeader: (name: string, value: string) => {
                c.header(name, value);
            },
            write: (data: string) => {
                stream.writeSSE({ data });
            },
        } as any);

        const sessionId = crypto.randomUUID();
        sessions.set(sessionId, transport);

        // Send session ID to client
        await stream.writeSSE({ 
            event: "endpoint",
            data: `/messages?sessionId=${sessionId}` 
        });

        await server.connect(transport);

        // Keep connection alive
        while (true) {
            await stream.sleep(30000);
            await stream.writeSSE({ event: "ping", data: "" });
        }
    });
});

// Messages endpoint - receives client messages
app.post("/messages", async (c) => {
    const sessionId = c.req.query("sessionId");

    if (!sessionId) {
        return c.json({ error: "Missing sessionId" }, 400);
    }

    const transport = sessions.get(sessionId);
    if (!transport) {
        return c.json({ error: "Session not found" }, 404);
    }

    const body = await c.req.json();
    await transport.handleMessage(body);

    return c.json({ success: true });
});

const port = parseInt(process.env.PORT || "3000");

console.log(`Mpampa MCP Server running on port ${port}`);
console.log(`SSE endpoint: http://localhost:${port}/sse`);

export default {
    port,
    fetch: app.fetch,
};