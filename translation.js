const fs = require("fs");
const fetch = require("node-fetch");

// LibreTranslate endpoint
const API_URL = "https://libretranslate.com/translate";

// Function to translate text
async function translateText(text, targetLang) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      q: text,
      source: "en",
      target: targetLang,
      format: "text"
    })
  });

  const data = await res.json();
  return data.translatedText;
}

// Main function
async function generateTranslations() {
  // Load English translation.json
  const en = JSON.parse(fs.readFileSync("./src/locales/en/translation.json", "utf-8"));

  const hi = {};
  const mr = {};

  for (const key in en) {
    console.log(`🔄 Translating: ${key} => ${en[key]}`);

    hi[key] = await translateText(en[key], "hi"); // Hindi
    mr[key] = await translateText(en[key], "mr"); // Marathi
  }

  // Save Hindi & Marathi JSON files
  fs.writeFileSync("./src/locales/hi/translation.json", JSON.stringify(hi, null, 2), "utf-8");
  fs.writeFileSync("./src/locales/mr/translation.json", JSON.stringify(mr, null, 2), "utf-8");

  console.log("✅ Translation files generated: hi, mr");
}

generateTranslations();
