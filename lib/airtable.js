import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID),
  table = base("coffee-stores");

const createRecord = (values) =>
  table.create([
    {
      fields: { ...values },
    },
  ]);

const getFields = (records) => records.map((record) => ({ recordId: record.id, ...record.fields }));

const getRecordsByFilter = async (id) => {
  try {
    const coffeeStoreRecords = await table.select({ filterByFormula: `id="${id}"` }).firstPage();

    return getFields(coffeeStoreRecords);
  } catch (error) {
    throw error;
  }
};

export { table, getRecordsByFilter, getFields, createRecord };
