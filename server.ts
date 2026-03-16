import express from "express";
import { createServer as createViteServer } from "vite";
import twilio from "twilio";
import emailjs from "@emailjs/nodejs";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/deliver-order", async (req, res) => {
    try {
      const { orderId, customerEmail, productName, key } = req.body;
      console.log(`\n[EMAIL DELIVERY] =====================`);
      console.log(`Sending delivery email to: ${customerEmail}`);
      console.log(`Product: ${productName}`);
      console.log(`Key/Account Details: ${key}`);
      console.log(`========================================\n`);
      
      const serviceId = process.env.EMAILJS_SERVICE_ID;
      const templateId = process.env.EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.EMAILJS_PUBLIC_KEY;
      const privateKey = process.env.EMAILJS_PRIVATE_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.warn("EmailJS credentials not configured. Simulating email delivery.");
        return res.json({ success: true, simulated: true, message: "EmailJS not configured. Simulated delivery." });
      }

      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: customerEmail,
          product_name: productName,
          delivery_key: key,
          order_id: orderId,
        },
        {
          publicKey: publicKey,
          privateKey: privateKey,
        }
      );
      
      res.json({ success: true, simulated: false });
    } catch (error) {
      console.error("Email Delivery Error:", error);
      res.status(500).json({ success: false, error: "Failed to send email" });
    }
  });

  app.post("/api/notify-order", async (req, res) => {
    try {
      const { customerName, productName, price } = req.body;
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
      const adminPhone = process.env.ADMIN_PHONE_NUMBER || "+917337872234";

      if (!accountSid || !authToken || !twilioPhone) {
        console.warn("Twilio credentials not configured. Skipping SMS.");
        return res.json({ success: false, message: "Twilio not configured" });
      }

      const client = twilio(accountSid, authToken);
      await client.messages.create({
        body: `New Order! ${customerName} ordered ${productName} for ₹${price}. Check your admin dashboard to verify the UPI payment.`,
        from: twilioPhone,
        to: adminPhone,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("SMS Error:", error);
      res.status(500).json({ success: false, error: "Failed to send SMS" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
