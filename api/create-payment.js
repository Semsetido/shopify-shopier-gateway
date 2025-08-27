import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Sadece GET destekleniyor" });
  }

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  // Test için sahte sipariş bilgileri
  const order_id = Date.now().toString();
  const amount = "100.00"; // test için 100 TL
  const buyer_name = "Test Kullanıcı";
  const buyer_email = "test@example.com";
  const buyer_address = "İstanbul, Türkiye";

  // İmza oluştur
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

    // Shopier ödeme linkine yönlendir
    return res.redirect(response.data.checkout_url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı" });
  }
}
