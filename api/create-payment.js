export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST destekleniyor" });
  }

  const { order_id, amount, buyer_name, buyer_email, buyer_address } = req.body;

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  try {
    const response = await fetch("https://www.shopier.com/ShowProduct/api_pay4.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        api_key: apiKey,
        api_secret: apiSecret,
        order_id,
        amount,
        buyer_name,
        buyer_email,
        buyer_address,
        success_url: process.env.SUCCESS_URL,
        fail_url: process.env.FAIL_URL,
      }),
    });

    const html = await response.text();

    // Shopier checkout sayfasını döndürür, sen de bunu client’a gönder
    return res.status(200).send(html);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Ödeme linki oluşturulamadı" });
  }
}
