# MCP Server for Mpampa Cereals

A Model Context Protocol (MCP) server that enables AI assistants to make purchases from Mpampa Cereals. Shop, browse products and complete purchases through natural conversation with AI (In test mode at the moment).

## 🚀 What is MCP?

MCP is a standard developed by Claude that allows AI assistants like Claude to interact with external systems and APIs. This particular server acts as a bridge between your AI and the Mpampa Cereals systems, allowing you to order and look up products using natural language.

**Example conversation:**

```
User: Show me products under GHS 50.00
AI: [searches products] Here are 5 laptops in your budget...

User: Add the small Hausa Koko to my cart
AI: [adds to cart] Added! Your cart total is now GHS 35.00

```

## 📋 Prerequisites

- Claude Desktop preferably (for the mean time)



## 🎯 Available Tools

- There are three main tools being used right now to make this possible:
- **`get_products`** - This one fetches all products, their variations, ingredients and prices from Mpampa Cereals (src/assets/screenshots/get-products.png)

- **`get_one_product`** - This tool fetches more details about a specific product you ask of. So for example, in the screenshot below, our prompt asked Claude to find more information about Tom Brown. All information provided is directly from Mpampa Cereals' systems. (src/assets/screenshots/get-products.png)

- **`place_order`** - The tool that does the magic 🪄 after all information has been collected. So you could tell Claude to order a product for you, and it'll go ahead and use this tool to do that, but before it does that, it'll prompt you to input details like your phone number, address and email just so the output appears the same compared to orders made on the website (.src/assets/screenshots/get-products.png)

![NB: The phone number shown in the screenshot is a test phone number from Paystack]


## 💳 How the payment side of things work

So because this is all in test mode now, as mentioned earlier, we use the test phone number from Paystack to see how things work. Now the website uses the **Initialize Payment API**, where users are redirected to a gateway to input their phone number and make payment. That requires human interaction and because this is an LLM, we can't render the gateway for the user to have the same flow (at least we don't know of any way)

And so we take another approach: Paystack has a **Charge API**, where users just would have to add their mobile money provider (that's the only channel we support for the mean time) to the additional information they provide before Claude uses the **`place_order`** tool. In the mean time, because it's the test number, the test payment goes through and the order is successful (as we saw in the previous screenshot)

## Demo

- Just a quick demo to show how it works in practice
