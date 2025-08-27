import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { order_id, amount, buyer_name, buyer_surname, buyer_email, buyer_phone } = req.body;

  try {
    const response = await axios.post(
      "https://www.shopier.com/ShowProduct/api_pay4.php",
      {
        API_key: process.env.SHOPIER_API_KEY,
        API_secret: process.env.SHOPIER_API_SECRET,
        product_name: "Sipariş", // sabit yazabilirsin
        product_type: 1,         // ürün = 1
        currency: 0,             // TL = 0
        order_id,
        amount,
        buyer_name,
        buyer_surname,
        buyer_email,
        buyer_phone,
        success_url: process.env.SUCCESS_URL,
        fail_url: process.env.FAIL_URL,
      }
    );

    return res.json({ checkout_url: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı" });
  }
}
