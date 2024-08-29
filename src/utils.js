const path = require("path");
const fs = require("fs");

const extractJsonContent = (text) => {
  const match = text.match(/\{(.*)\}/s);
  if (match) {
    const jsonText = `{${match[1]}}`;
    try {
      return JSON.parse(jsonText);
    } catch (error) {
      console.error("Error decoding JSON:", error);
      return null;
    }
  }
  return null;
};

const getUniqueLanguageCodes = (countryLanguageMappingData) => {
  const allLanguages = Object.values(countryLanguageMappingData).flat();
  const uniqueLanguages = [...new Set(allLanguages)];
  const uniqueLanguagesWithoutEN = uniqueLanguages.filter(
    (language) => language !== "en"
  );

  return uniqueLanguagesWithoutEN;
};

const createFolder = (fs, folderPath) => {
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log("Directory created successfully!" + folderPath);
    } else {
      console.log("Directory already exists." + folderPath);
    }
  } catch (err) {
    console.error(err);
  }
};

const createOrUpdateFile = (fs, filePath, outputJson) => {
  const jsonString = JSON.stringify(outputJson, null, 2);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File does not exist, create a new one with jsonString
        fs.writeFile(filePath, jsonString, (err) => {
          if (err) {
            console.error("Error writing file:", err);
          } else {
            console.log(`File has been created successfully at ${filePath}.`);
          }
        });
      } else {
        console.error("Error reading file:", err);
      }
    } else {
      // File exists, append the new jsonString
      const outputData = JSON.parse(data);
      const newData = { ...outputData, ...JSON.parse(jsonString) };

      fs.writeFile(filePath, JSON.stringify(newData, null, 2), (err) => {
        if (err) {
          console.error("Error writing file:", err);
        } else {
          console.log(`File has been updated successfully at ${filePath}.`);
        }
      });
    }
  });
};

const createPrompt = (languageCode, input) => {
  return `
Given the following input object: ${input}

Translate the given object into the language with code: ${languageCode}

Provide the translated object in the same format as the input.

Example output:

"LanguageCode":{
....
}

Don't give any other generated text, just provide the translated object in the same format as the input object, with no other generated text.
`;
};

const createChatSession = (
  GoogleGenerativeAI,
  geminiApiKey,
  generationConfig
) => {
  if (!geminiApiKey) {
    console.log("Gemini API key is missing in the environment variables");
    return;
  }

  // Create genAI object from GoogleGenerativeAI using API Key
  const genAI = new GoogleGenerativeAI(geminiApiKey);

  // Generate Gemini API model by choosing model from environmental variable else defaultly setting it to "gemini-1.5-flash"
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
  });

  const chatSession = model.startChat({
    generationConfig,
    history: [],
    safetySettings : [
      {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": 'BLOCK_NONE',
      },
      {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": 'BLOCK_NONE',
      },
      {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": 'BLOCK_NONE',
      },
      {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": 'BLOCK_NONE',
      }
    ]
  });

  return chatSession;
};

const createRowsAndColumns = (
  data,
  keys,
  sNo,
  translations,
  countryLanguageMapping
) => {
  // Create headers
  let columns = ["S.No", "Key"];
  for (let country in countryLanguageMapping) {
    for (let lang of countryLanguageMapping[country]) {
      columns.push(`${country}-${lang}`);
    }
  }
  data.push(columns);

  // Fill the data rows
  for (let key of keys) {
    let row = [sNo, key];
    for (let country in countryLanguageMapping) {
      for (let lang of countryLanguageMapping[country]) {
        row.push(translations[lang][key] || "");
      }
    }
    data.push(row);
    sNo++;
  }
};

//
const gatherTranslations = (jsonFileName, dirPath, translations = {}) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach((entry) => {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      gatherTranslations(jsonFileName, fullPath, translations);
    } else if (entry.isFile() && entry.name === `${jsonFileName}.json`) {
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const parsedData = JSON.parse(fileContents);
      const [country, lang] = path.basename(dirPath).split("-");

      if (!translations[country]) translations[country] = {};
      translations[country][lang] = parsedData;
    }
  });

  return translations;
};

function createFile(fs, filePath, jsonString) {
  fs.writeFile(filePath, jsonString, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log(
        "File has been created or updated with the new content in common.json"
      );
    }
  });
}

module.exports = {
  extractJsonContent,
  getUniqueLanguageCodes,
  createFolder,
  createOrUpdateFile,
  createPrompt,
  createChatSession,
  createRowsAndColumns,
  gatherTranslations,
  createFile,
};
