import { createRecord, getFields, getRecordsByFilter } from "../../lib/airtable";

export default async function createCoffeeStore(req, res) {
  let records = [];

  try {
    if (req.method === "POST") {
      const { id, name, address, neighbourhood, imgUrl } = req.body;

      if (id) {
        records = await getRecordsByFilter(id);

        if (records.length <= 0) {
          if (name) {
            const createdStoreRecords = await createRecord({
              id: id.toString(),
              name,
              address,
              neighbourhood,
              voting: 0,
              imgUrl,
            });
            records = getFields(createdStoreRecords);
          } else return res.status(400).json("name is required.");
        }

        return res.status(200).json(records);
      } else return res.status(400).json("Id is required.");
    } else return res.status(404).send(`The request ${res.method} is not valid.`);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "There is an API error", error });
  }
}
