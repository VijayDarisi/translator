const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();
const XLSX = require("xlsx");

const {
  extractJsonContent,
  getUniqueLanguageCodes,
  createFolder,
  createOrUpdateFile,
  createPrompt,
  createChatSession,
  createRowsAndColumns,
} = require("./utils");
const {
  generationConfig,
  countryLanguageMapping: totalCLM,
  paths,
} = require("../config");

function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunk = array.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

async function run(countryLanguageMapping) {
  // Get Gemini API Key from environmental variables
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const chatSession = createChatSession(
    GoogleGenerativeAI,
    geminiApiKey,
    generationConfig
  );

  const inputFilePath = paths.inputPath === "" ? "input.json" : paths.inputPath;

  let inputJson = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));
  if (!inputJson) {
    console.log("Input is missing");
    return;
  }
  let inputEntries = Object.entries(inputJson);
  const batchSize = 50;
  const batches = chunkArray(inputEntries, batchSize);

  for (const batch of batches) {
    const inputJson = Object.fromEntries(batch);
    // Define the input JSON object
    const input = JSON.stringify(inputJson);

    const translations = { en: inputJson };

    // Get unique languages from the values of the object
    const languageCodesForTranslations = getUniqueLanguageCodes(
      countryLanguageMapping
    );

    console.log("Translating...");

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (const languageCode of languageCodesForTranslations) {
      const prompt = createPrompt(languageCode, input);

      const result = await chatSession.sendMessage(prompt);
      const inputText = result.response.text(); // Extract the text from the response
      const content = extractJsonContent(inputText); // Extract JSON content

      if (content) {
        translations[languageCode] = content;
      }

      // Wait for 2 seconds before the next iteration
      // await delay(2000);
    }

    console.log("Translation Done.");
    console.log("Storing your translated jsons");

    for (const [countryCode, languageCodes] of Object.entries(
      countryLanguageMapping
    )) {
      for (const languageCode of languageCodes) {
        const folderName =
          paths.outputPath === ""
            ? `./locales/${countryCode}-${languageCode}`
            : `${paths.outputPath}/${countryCode}-${languageCode}`;

        createFolder(fs, folderName);

        const outputFilePath = `${folderName}/${paths.outputJsonFileName}.json`;
        const outputJsonString = translations[languageCode];

        createOrUpdateFile(fs, outputFilePath, outputJsonString);
      }
    }

    // Creating Excel sheet
    if (paths.isExcelSheetNeeded) {
      // Prepare data for the sheet
      let data = [];
      let keys = Object.keys(translations["en"]);
      let sNo = 1;

      createRowsAndColumns(
        data,
        keys,
        sNo,
        translations,
        countryLanguageMapping
      );

      // Convert data to worksheet
      let worksheet = XLSX.utils.aoa_to_sheet(data);

      // Create a new workbook
      let workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Translations");

      const outputExcel =
        paths.outputExcelPath == ""
          ? "./translations.xlsx"
          : paths.outputExcelPath;

      // Write to Excel file
      XLSX.writeFile(workbook, outputExcel);

      console.log("Excel file created successfully.");
    }

    console.log(translations); // Print the object with all translations}
  }
}

async function main() {
  const batchSize = 5;
  for (const country in totalCLM) {
    const n = totalCLM[country].length;
    for (let i = 0 * batchSize; i < n; ) {
      await run({ [country]: totalCLM[country].slice(i, i + batchSize) });
      // await new Promise((resolve)=>setTimeout(resolve, 3000));
      // console.log({[country] : totalCLM[country].slice(i, i + batchSize)});
      i += batchSize;
      console.log(i);
    }
  }
}

main();
