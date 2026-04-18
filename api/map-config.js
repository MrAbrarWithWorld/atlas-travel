export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  return res.status(200).json({ key: process.env.GOOGLE_MAPS_API_KEY || '' });
}
