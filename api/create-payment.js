import crypto from "crypto";
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "Shopier Gateway çalışıyor ✅" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { order_id, amount, buyer_name, buyer_email, buyer_address } = req.body;

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  // Shopier imza
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
      fail_url: process.env.FAIL_URL
    });

    return res.json({ checkout_url: response.data.checkout_url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı" });
  }
}
