import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getAllProducts, getAProduct } from "./tools/products.ts";
import { z } from "zod";
import { initiatePayment, orderItems, submitOTP } from "./tools/order.ts";

// Create server instance
export function createServer() {
  const server = new McpServer({
    name: "Mpampa MCP Server",
    version: "1.0.0",
  });

  server.registerTool(
    "get_products",
    {
      description:
        "Get all the products from Mpampa Cereals for the user to select",
      inputSchema: {},
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
      };
    }
  );

  server.registerTool(
    "get_one_product",
    {
      description:
        "Fetch the information for a particular product. If the name is made up of one or more words, break it down to smaller letters and put hyphens" +
        "in between the words",
      inputSchema: z.object({
        productID: z
          .string()
          .describe("The product ID for the item being searched for"),
      }),
    },
    async (call) => {
      const result = await getAProduct(call.productID);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  const ItemsSchema = z.object({
    productID: z.string(),
    productName: z.string(),
    productSize: z.string(),
    type: z.string().optional(),
    productQuantity: z.number().int().positive(),
    productImage: z.string(),
    productPrice: z.number().int().positive(),
    itemID: z.string(),
  });

  const ShippingAddressSchema = z.object({
    fullName: z.string(),
    phone: z.string(),
    address: z.string(),
    email: z.string(),
  });

  const CreateOrderInputSchema = z.object({
    customerID: z.string().optional(),
    items: z.array(ItemsSchema).min(1, "Order must have at least one item"),
    shippingAddress: ShippingAddressSchema,
    deliveryCost: z.number().nonnegative().optional(),
    discount: z.number().nonnegative().optional(),
    totalAmount: z
      .number()
      .nonnegative()
      .describe(
        "Calculate the total amount for the order and place the value here."
      ),
    orderStatus: z.any().default("pending"),
    transactionReference: z.string().optional(),
    network: z.string().toLowerCase().default("mtn"),
    paymentStatus: z.any().default("pending"),
  });

  const VerifyOTPInputSchema = z.object({
    transactionReference: z.string().describe("The transaction reference from the charge just created"),
    otp: z.string().describe("The OTP code received by the user"),
    orderData: z.object({
        customerID: z.string().optional(),
        items: z.array(ItemsSchema).min(1, "Order must have at least one item"),
        shippingAddress: ShippingAddressSchema,
        deliveryCost: z.number().nonnegative().optional(),
        discount: z.number().nonnegative().optional(),
        totalAmount: z.number().nonnegative().describe(
        "Calculate the total amount for the order and place the value here."
        ),
        orderStatus: z.any().default("pending"),
        paymentStatus: z.any().default("pending"),
  }).describe("The original order data we got from the user and submitted to the place_order tool"),
  });

  server.registerTool(
    "place_order",
    {
      description:
        "Place an order for the user based on the information they give you; e.g. the product and the quantity they want." +
        "If they don't provide all the necessary details, prompt them to add the remaining details needed to place the order before doing so" +
        "Make The default paymentStatus and orderStatus pending. Ignore the fields marked as optional",
      inputSchema: CreateOrderInputSchema,
    },
    async (call) => {
      // Test split code
      const split_code = process.env.SPLIT_CODE_PROD;
      const resOne = await initiatePayment(
        call.totalAmount * 100,
        call.shippingAddress.email,
        split_code,
        call.shippingAddress.phone,
        call.network
      );

      if (!resOne.success) {
        throw new Error("Failed to initiate payment");
      }

      const transactionReference = resOne.data?.data.data.reference;

      if (!transactionReference) {
        throw new Error("No transaction reference received")
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
            message: "Payment initiated successfully. An OTP has been sent to the customer's phone.",
            transactionReference: transactionReference,
            nextStep: "Please ask the user for the OTP code and use the 'verify_otp_and_complete_order' tool to complete the order.",
          }, null, 2),
          },
        ],
      };
    }
  );

  server.registerTool(
    "verify_otp_and_complete_order",
    {
      description: "Verify the OTP provided by the user after initiating the charge, and complete" +
      "the order placement if verification is successful.",
      inputSchema: VerifyOTPInputSchema,
    },
    async (call) => {

      const verificationRes = await submitOTP(call.otp, call.transactionReference);

      if (!verificationRes.success) {
      throw new Error("OTP verification failed. Please check the code and try again.");
      }

      // Now complete the order
      const orderData = {
        ...call.orderData,
        transactionReference: call.transactionReference,
      }

      const result = await orderItems(orderData);

      return {
        content: [{
          type: "text",
          text: JSON.stringify({
            message: "Order placed successfully!",
            orderDetails: result,
          }, null, 2)
        }]
      }
    }
  )

  return server
}
