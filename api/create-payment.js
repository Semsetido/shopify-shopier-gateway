import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { order_id, amount, buyer_name, buyer_email, buyer_address } = req.body;

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  try {
    const response = await axios.post(
      "https://www.shopier.com/ShowProduct/api_pay4.php",
      {
        API_key: apiKey,
        API_secret: apiSecret,
        order_id,
        amount,
        buyer_name,
        buyer_email,
        buyer_address,
        success_url: process.env.SUCCESS_URL,
        fail_url: process.env.FAIL_URL
      }
    );

    // Shopier'den gelen checkout URL'sini geri gönder
    return res.json({ checkout_url: response.data.checkout_url });
  } catch (err) {
    console.error("Shopier hata:", err.response?.data || err.message);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı" });
  }
}
