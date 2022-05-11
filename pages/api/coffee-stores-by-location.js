import { getCoffeeStores } from "../../lib/coffee-store";

export default async function getCoffeeStoresByLocation(req, res) {
  const { latLong, limit } = req.query;

  try {
    const response = await getCoffeeStores(latLong, limit);

    return res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({ message: "There is an API error:", error });
  }
}
