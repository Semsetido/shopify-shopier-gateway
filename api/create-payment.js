export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Sadece GET destekleniyor" });
  }

  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  const order_id = Date.now().toString();
  const amount = "50.00";
  const buyer_name = "Test Kullanıcı";
  const buyer_email = "test@example.com";
  const buyer_address = "İstanbul, Türkiye";

  // imza
  const crypto = await import("crypto");
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(order_id + amount)
    .digest("hex");

  // Shopier URL'sine yönlendir
  const checkoutUrl = `https://www.shopier.com/ShowProduct/api_pay4.php?api_key=${apiKey}&order_id=${order_id}&amount=${amount}&buyer_name=${encodeURIComponent(buyer_name)}&buyer_email=${encodeURIComponent(buyer_email)}&buyer_address=${encodeURIComponent(buyer_address)}&signature=${signature}&success_url=${process.env.SUCCESS_URL}&fail_url=${process.env.FAIL_URL}`;

  return res.redirect(checkoutUrl);
}
