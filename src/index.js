const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();

const {
  extractJsonContent,
  getUniqueLanguageCodes,
  createFolder,
  createOrUpdateFile,
  createPrompt,
  createChatSession,
} = require("./utils");
const { generationConfig, countryLanguageMapping, paths } = require("../config");

async function run() {
  // Get Gemini API Key from environmental variables
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const chatSession = createChatSession(
    GoogleGenerativeAI,
    geminiApiKey,
    generationConfig
  );

  const inputFilePath = paths.inputPath === "" ? "input.json" : paths.inputPath;

  const inputJson = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));

  if (!inputJson) {
    console.log("Input is missing");
    return;
  }

  // Define the input JSON object
  const input = JSON.stringify(inputJson);

  const translations = { en: inputJson };

  // Get unique languages from the values of the object
  const languageCodesForTranslations = getUniqueLanguageCodes(
    countryLanguageMapping
  );

  console.log("Translating...");

  for (const languageCode of languageCodesForTranslations) {
    const prompt = createPrompt(languageCode, input);

    const result = await chatSession.sendMessage(prompt);
    const inputText = result.response.text(); // Extract the text from the response
    const content = extractJsonContent(inputText); // Extract JSON content

    if (content) {
      translations[languageCode] = content;
    }
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

  console.log(translations); // Print the object with all translations
}

run();
