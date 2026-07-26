export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=86400");
  // GOOGLE_JAVASCRIPT_API_KEY = Maps JavaScript API key (frontend map)
  // Falls back to GOOGLE_MAPS_API_KEY if not set
  const key = process.env.GOOGLE_JAVASCRIPT_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
  return res.status(200).json({ key });
}
