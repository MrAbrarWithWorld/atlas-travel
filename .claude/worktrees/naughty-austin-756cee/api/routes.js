export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { origin, destination } = req.body;
  if (!origin || !destination) return res.status(400).json({ error: "Origin and destination required" });

  try {
    const res2 = await fetch(`https://routes.googleapis.com/directions/v2:computeRoutes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.legs"
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lon } } },
        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lon } } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE"
      })
    });
    const data = await res2.json();
    if (!data.routes?.[0]) return res.status(200).json({ distance: null, duration: null });
    const route = data.routes[0];
    const meters = route.distanceMeters;
    const seconds = parseInt(route.duration);
    const km = Math.round(meters / 1000);
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const durationText = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    return res.status(200).json({ distance: `${km} km`, duration: durationText });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
