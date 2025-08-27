import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Sadece GET destekleniyor" });
  }

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  // Şimdilik test için sabit değerler
  const order_id = Date.now().toString(); 
  const amount = "50.00"; // Test için 50 TL
  const buyer_name = "Test Kullanıcı";
  const buyer_email = "test@example.com";
  const buyer_address = "İstanbul, Türkiye";

  // Shopier imzası
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(order_id + amount)
    .digest("hex");

  try {
    const response = await axios.post("https://www.shopier.com/api/checkout", {
      apiKey,
      order_id,
      amount,
      buyer_name,
      buyer_email,
      buyer_address,
      signature,
      success_url: process.env.SUCCESS_URL,
      fail_url: process.env.FAIL_URL,
    });

    // Shopier'in döndüğü ödeme linkine yönlendir
    return res.redirect(response.data.checkout_url);
  } catch (err) {
    console.error("Shopier error:", err?.response?.data || err.message);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı" });
  }
}
