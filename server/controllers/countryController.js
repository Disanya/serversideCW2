const db = require("../models/db");

//retrieving details related to the selected country name
exports.getCountry = async (req, res) => {
  const { name } = req.query;

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${name}`);
    const data = await response.json();

    if (!data || !data[0])
      return res.status(404).json({ error: "Country not found" });

    const country = data[0];
    const result = {
      name: country.name.common,
      capital: country.capital ? country.capital[0] : "N/A",
      currency: Object.values(country.currencies || {})[0]?.name || "N/A",
      languages: Object.values(country.languages || {}).join(", "),
      flag: country.flags?.svg || "",
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching country info" });
  }
};
