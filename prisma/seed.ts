import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "demo@smartstock.dev";
  const password = await bcrypt.hash("password123", 12);

  let merchant = await prisma.merchant.findUnique({ where: { email } });
  if (!merchant) {
    merchant = await prisma.merchant.create({
      data: { email, name: "Demo Merchant", password },
    });
  }

  await prisma.saleItem.deleteMany({ where: { sale: { merchantId: merchant.id } } });
  await prisma.sale.deleteMany({ where: { merchantId: merchant.id } });
  await prisma.product.deleteMany({ where: { merchantId: merchant.id } });

  const products = [
    { name: "Wireless Mouse", description: "Ergonomic 2.4GHz wireless mouse with silent clicks and adjustable DPI up to 1600. Includes USB receiver and 18-month battery life on a single AA.", price: 29.99, stock: 120 },
    { name: "Mechanical Keyboard", description: "Full-size RGB mechanical keyboard with hot-swappable blue switches. Aluminum frame, detachable USB-C cable, rated for 50M keystrokes.", price: 89.99, stock: 60 },
    { name: "USB-C Cable", description: "Braided nylon USB-C to USB-C cable, 2 meters, supports up to 100W Power Delivery and 480 Mbps data transfer.", price: 12.99, stock: 200 },
    { name: "Laptop Stand", description: "Aluminum laptop stand with 6 adjustable height levels. Improved airflow for cooling, folds flat for travel, supports up to 17-inch laptops.", price: 49.99, stock: 35 },
    { name: "Webcam 1080p", description: "Full HD 1080p webcam with auto focus, 78-degree field of view, built-in stereo mic, and privacy shutter. USB plug-and-play for Windows/Mac.", price: 59.99, stock: 18 },
    { name: "Noise Cancelling Headphones", description: "Over-ear Bluetooth headphones with active noise cancellation, 30-hour battery, USB-C fast charge (10 min = 5 hours), and multipoint pairing.", price: 199.99, stock: 25 },
    { name: "Monitor 27-inch", description: "27-inch 1440p IPS monitor at 144Hz with 1ms response time, 99% sRGB, height-adjustable stand, and USB-C 65W power delivery to charge your laptop.", price: 329.99, stock: 12 },
    { name: "Docking Station", description: "USB-C docking station with dual HDMI 4K@60Hz output, gigabit Ethernet, 4x USB-A 3.0, SD card reader, and 100W passthrough charging.", price: 149.99, stock: 30 },
    { name: "External SSD 1TB", description: "Portable 1TB USB 3.2 Gen2 SSD with 1050 MB/s read speed, aluminum housing, shock-resistant, and includes USB-C and USB-A cables.", price: 109.99, stock: 8 },
    { name: "Desk Lamp LED", description: "LED desk lamp with 5 brightness levels and 3 color temperatures (2700K-6500K). Touch control, USB charging port, foldable arm, and memory function.", price: 39.99, stock: 75 },
  ];

  const created = [];
  for (const p of products) {
    created.push(
      await prisma.product.create({
        data: { ...p, merchantId: merchant.id },
      })
    );
  }

  // one big sale per day from July 18 to Oct 18 2026
  const start = new Date("2026-07-18");
  const end = new Date("2026-10-18");
  const days = Math.floor((end.getTime() - start.getTime()) / 86400000);

  const customers = [
    { name: "Rahim Uddin", email: "rahim@example.com" },
    { name: "Sultana Begum", email: "sultana@example.com" },
    { name: "Karim Hossain", email: "karim@example.com" },
    { name: "Nasrin Akter", email: "nasrin@example.com" },
    { name: "Faruk Ahmed", email: "faruk@example.com" },
    { name: "Mitu Khatun", email: "mitu@example.com" },
    { name: "Jamal Uddin", email: "jamal@example.com" },
    { name: "Riya Chowdhury", email: "riya@example.com" },
    { name: null, email: null }, // some sales without customer info
    { name: null, email: null },
  ];

  for (let d = 0; d <= days; d++) {
    const date = new Date(start.getTime() + d * 86400000);

    // 1-3 items per sale
    const itemCount = Math.floor(Math.random() * 3) + 1;
    const usedProducts = new Set<string>();
    const items = [];

    for (let j = 0; j < itemCount; j++) {
      let product = created[Math.floor(Math.random() * created.length)];
      if (usedProducts.has(product.id)) {
        product = created[(created.indexOf(product) + 1) % created.length];
      }
      usedProducts.add(product.id);

      const maxQty = Math.max(1, Math.floor(product.stock / 10));
      const quantity = Math.max(1, Math.floor(Math.random() * maxQty) + 1);

      items.push({
        productId: product.id,
        quantity,
        productName: product.name,
        unitPrice: product.price,
      });
    }

    const customer = customers[Math.floor(Math.random() * customers.length)];

    await prisma.sale.create({
      data: {
        merchantId: merchant.id,
        customerName: customer.name,
        customerEmail: customer.email,
        createdAt: date,
        items: { create: items },
      },
    });
  }

  console.log("Seed complete: 10 products, ~93 days of multi-item sales");
  console.log(`Login: ${email} / password123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
