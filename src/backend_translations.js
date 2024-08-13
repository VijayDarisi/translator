const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config();
const {
  extractJsonContent,
  createChatSession,
  createFile,
} = require("./utils");
const { generationConfig, convertToLanguages } = require("../config");

async function run() {
  // Get Gemini API Key from environmental variables
  const geminiApiKey = process.env.GEMINI_API_KEY;

  const chatSession = createChatSession(
    GoogleGenerativeAI,
    geminiApiKey,
    generationConfig
  );

  const inputFilePath =
    convertToLanguages.inputPath === ""
      ? "backend_input.json"
      : convertToLanguages.inputPath;

  const inputJson = JSON.parse(fs.readFileSync(inputFilePath, "utf8"));

  if (!inputJson) {
    console.log("Input is missing");
    return;
  }

  // Define the input JSON object
  const input = inputJson["en"];

  const prompt = `Translate the following text into the specified languages. 
  Do not generate any additional text or explanations.
   Return the output in the same JSON format as provided, with the translations filled in for each language code.

Input String: ${input}


Languages: ${convertToLanguages.languages}


Output JSON Format:

{
 "en": "....",
 "fr": "...",
 "bg": "...",
 "ru": "..."
}
`;

  const result = await chatSession.sendMessage(prompt);
  const inputText = result.response.text(); // Extract the text from the response
  const content = extractJsonContent(inputText); // Extract JSON content

  console.log(content);

  const outputFilePath =
    convertToLanguages.outputPath == ""
      ? `./backend_output.json`
      : `${convertToLanguages.outputPath}/backend_output.json`;
  const outputJsonString = JSON.stringify(content, null, 2);
  createFile(fs, outputFilePath, outputJsonString);
}

run();
