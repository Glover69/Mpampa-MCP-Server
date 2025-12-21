# MCP Server for Mpampa Cereals

A Model Context Protocol (MCP) server that enables AI assistants to make purchases from Mpampa Cereals. Shop, browse products and complete purchases through natural conversation with AI.

## 🌟 Features

- **Product Search & Discovery** - Search and browse your product catalog conversationally
- **Mobile Money Payments** - Integrated Paystack mobile money payment support
- **Order Placements** - Place orders for your favorite products using natural language!

## 👷🏾‍♂️ Work in Progress

- **Smart Shopping Cart** - Add, remove, and manage items through AI
- **Real-time Updates** - Check payment and order status on demand
- **Order Management** - Create and track orders seamlessly

## 🚀 What is MCP?

The Model Context Protocol (MCP) is a standard developed by Claude that allows AI assistants like Claude to interact with external systems and APIs. This server acts as a bridge between AI conversations and your e-commerce backend for instance, enabling users to shop naturally through chat.

**Example conversation:**

```
User: Show me products under GHS 50.00
AI: [searches products] Here are 5 laptops in your budget...

User: Add the small Hausa Koko to my cart
AI: [adds to cart] Added! Your cart total is now GHS 35.00

```

## 📋 Prerequisites

- Claude Desktop app or MCP-compatible client



## 🎯 Available Tools

### Product Tools

- **`search_products`** - Search for products by query and category
- **`get_product_details`** - Get detailed information about a specific product

### Cart Tools (WIP)

- **`add_to_cart`** - Add items to shopping cart
- **`view_cart`** - View current cart contents and totals
- **`calculate_total`** - Calculate final pricing with shipping and taxes

### Order Tools

- **`place_order`** - Create order and initiate mobile money payment
  

## 💳 Payment Flow

1. User provides payment details (phone number, network)
2. MCP server calls Mpampa Backend to initiate Paystack payment
3. Paystack sends mobile money prompt to user’s phone
4. User approves payment on their device
5. Paystack webhook notifies your backend
6. Order status updates automatically
