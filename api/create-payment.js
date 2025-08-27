import crypto from "crypto";

export default async function handler(req, res) {
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
    const response = await fetch("https://www.shopier.com/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        apiKey,
        order_id,
        amount,
        buyer_name,
        buyer_email,
        buyer_address,
        signature,
        success_url: process.env.SUCCESS_URL,
        fail_url: process.env.FAIL_URL,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || "Shopier isteği başarısız");
    }

    return res.json({ checkout_url: data.checkout_url });
  } catch (err) {
    console.error("Shopier Hatası:", err.message);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı", detail: err.message });
  }
}
