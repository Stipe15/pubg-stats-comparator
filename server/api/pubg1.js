export default async function handler(req, res) {
  const { playerName } = req.query;

  if (!playerName) {
    return res.status(400).json({ error: "Missing playerName" });
  }

  try {
    const response = await fetch(`https://api.pubg.com/shards/steam/players?filter[playerNames]=${playerName}`, {
      headers: {
        "Accept": "application/vnd.api+json",
        "Authorization": `Bearer ${process.env.PUBG_API_KEY}`,
      },
    });

    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server Error" });
  }
}
