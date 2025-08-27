import crypto from "crypto";
import axios from "axios";
import qs from "qs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { order_id, amount, buyer_name, buyer_email, buyer_address } = req.body;

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  // Shopier için imza oluşturma
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(order_id + amount)
    .digest("hex");

  try {
    const data = qs.stringify({
      api_key: apiKey,
      order_id,
      amount,
      buyer_name,
      buyer_email,
      buyer_address,
      signature,
      success_url: process.env.SUCCESS_URL,
      fail_url: process.env.FAIL_URL
    });

    const response = await axios.post("https://www.shopier.com/api/checkout", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    return res.json({ checkout_url: response.data.checkout_url });
  } catch (err) {
    console.error("Shopier API Hatası:", err.response?.data || err.message);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı" });
  }
}
