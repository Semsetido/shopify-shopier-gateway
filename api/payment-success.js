import axios from "axios";

export default async function handler(req, res) {
  const { order_id, payment_status, amount } = req.body;

  if (payment_status !== "success") {
    return res.redirect("/payment-fail");
  }

  try {
    await axios.post(
      `https://${process.env.SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/orders/${order_id}/transactions.json`,
      {
        transaction: {
          kind: "sale",
          status: "success",
          amount,
          currency: "TRY"
        }
      },
      {
        headers: {
          "X-Shopify-Access-Token": process.env.SHOPIFY_API_TOKEN,
          "Content-Type": "application/json"
        }
      }
    );

    return res.redirect("/thank_you");
  } catch (err) {
    console.error(err);
    return res.redirect("/payment-fail");
  }
}
