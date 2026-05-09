export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — return Maps JS API key for frontend initialisation
  if (req.method === "GET") {
    res.setHeader("Cache-Control", "public, max-age=86400");
    const key = process.env.GOOGLE_JAVASCRIPT_API_KEY || process.env.GOOGLE_MAPS_API_KEY || '';
    return res.status(200).json({ key });
  }

  // POST { origin, destination } — compute driving route via Google Routes API
  if (req.method === "POST") {
    const { origin, destination } = req.body;
    if (!origin || !destination) return res.status(400).json({ error: "Origin and destination required" });

    try {
      const r = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.legs",
        },
        body: JSON.stringify({
          origin:      { location: { latLng: { latitude: origin.lat,      longitude: origin.lon      } } },
          destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lon } } },
          travelMode: "DRIVE",
          routingPreference: "TRAFFIC_UNAWARE",
        }),
      });
      const data = await r.json();
      if (!data.routes?.[0]) return res.status(200).json({ distance: null, duration: null });
      const route   = data.routes[0];
      const km      = Math.round(route.distanceMeters / 1000);
      const seconds = parseInt(route.duration);
      const hours   = Math.floor(seconds / 3600);
      const mins    = Math.floor((seconds % 3600) / 60);
      return res.status(200).json({ distance: `${km} km`, duration: hours > 0 ? `${hours}h ${mins}m` : `${mins}m` });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
