export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ message: "Shopier Gateway çalışıyor ✅" });
  }

  return res.status(200).json({ message: "POST çalışıyor ama henüz Shopier yok" });
}
