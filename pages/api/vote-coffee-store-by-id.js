import { getFields, getRecordsByFilter, table } from "../../lib/airtable";

export default async function voteCoffeeStoreById(req, res) {
  if (req.method === "PUT") {
    try {
      const { id } = req.query;

      if (!id) return res.status(422).json({ message: "id is missing" });

      const records = await getRecordsByFilter(id);

      if (records.length <= 0) return res.status(404).json({ message: "Coffee store not found with this id." });

      const record = records[0];

      const votingCount = parseInt(record.voting) + 1;

      const updateRecord = await table.update([
        {
          id: record.recordId,
          fields: {
            voting: votingCount,
          },
        },
      ]);

      if (!updateRecord) res.status(500).json({ message: "Something went wrong while updating" });

      const newRecord = getFields(updateRecord);

      return res.json(newRecord);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  } else return res.status(404).send(`The request ${req.method} is not valid.`);
}
