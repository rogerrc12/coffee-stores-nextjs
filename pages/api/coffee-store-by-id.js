import { getRecordsByFilter } from "../../lib/airtable";

export default async function getCoffeeStoreById(req, res) {
  const { id } = req.query;

  try {
    if (id) {
      const coffeeStoreRecords = await getRecordsByFilter(id);

      if (coffeeStoreRecords.length > 0) {
        return res.status(200).json(coffeeStoreRecords);
      } else return res.status(200).json({ message: "record could not be found." });
    } else {
      return res.status(400).json({ message: "Id is missing!" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong!", error });
  }
}
