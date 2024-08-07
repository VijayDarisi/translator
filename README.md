
## Features Overview

This project includes three main features:

1. **Translator**: Translates content into multiple languages using the Google Generative AI API and stores translations in JSON files organized by country and language.

2. **Convert Excel to JSON**: Converts an Excel sheet into JSON files organized by country and language.

3. **Convert JSON to Excel**: Converts JSON files into an Excel sheet.

You can choose and configure the feature you want to use based on your requirements.

---

# 1. Translator

This project uses Google Generative AI API to translate content into multiple languages. The translations are processed and stored as JSON files, organized by country and language. The accuracy of translation using Google Generative AI (Gemini) is above 90%. Adjustments may be necessary for specific use cases or languages.

### Prerequisites

1. **Node.js**: Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
2. **Google Generative AI API Key**: You need an API key to access the Google Generative AI API. You can get it from [here](https://ai.google.dev/gemini-api/docs/api-key).

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/VijayDarisi/translator.git
    cd translator
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Google Generative AI API key (for translation feature):

    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

### Configuration

#### Config File

The configuration settings are stored in `config.js`. This file contains the gemini generation configuration, country-language mapping, and file paths.

```javascript
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const countryLanguageMapping = {
  ca: ["fr", "bg"],
  ie: ["fr", "es", "te"],
  cz: ["cs"],
};

/**
 * @var inputPath - Input file path should be containing input JSON file for translation.
 * If input file path is not provided, defaults to ./input.json
 *
 * @var outputPath - If OutputPath is not provided, defaults to creating a locales folder.
 * Else all the files are created in the given output path.
 *
 * @var outputJsonFileName - Used for creating or updating the output JSON file name
 *
 * @var isExcelSheetNeeded - 'true' if you need an Excel sheet, default is false
 *
 * @var outputExcelPath - Creates an Excel file of all translations, if not provided creates Excel file in the same folder.
 */
const paths = {
  inputPath: "./input.json",
  outputPath: "",
  outputJsonFileName: "common",
  isExcelSheetNeeded: false,
  outputExcelPath: "",
};

module.exports = { generationConfig, countryLanguageMapping, paths };
```

#### Utils File

Utility functions are stored in `utils.js`. This file includes functions for extracting JSON content, getting unique language codes, creating folders, creating or updating files, creating prompts, and creating chat sessions.

## Running the Project

1. Prepare your input JSON file and place it at the path specified in `inputPath` in `config.js`. The default path is `./input.json`.

2. Run the script:

    ```bash
    node src/index.js
    ```

## Example

Given the following `config.js` settings:

```javascript
const countryLanguageMapping = {
  ca: ["fr", "bg"],
  ie: ["fr", "es", "te"],
  cz: ["cs"],
};
```

and a sample `input.json` file:

```json
{
  "greeting": "Hello",
  "farewell": "Goodbye"
}
```

The project will create the following file structure:

```
/locales
  /ca-fr
    common.json
  /ca-bg
    common.json
  /ie-fr
    common.json
  /ie-es
    common.json
  /ie-te
    common.json
  /cz-cs
    common.json
```

Each `common.json` file will contain the translated content for the respective language.


## 2. Convert to JSON

This feature converts an Excel sheet into JSON files organized by country and language.

1. There is no need of creating Gemini API key for this feature

2. Install the dependencies:

    ```bash
    npm install
    ```

#### Configuration

To enable converting an Excel sheet to JSON files, configure the `convertToJsonPaths` in `config.js`:

```javascript
const convertToJsonPaths = {
  excelFilePath: "", // Path of the Excel sheet that needs to be converted to JSON files
  outputDirPath: "", // Path of the folder where JSON files will be created. Default: creates a 'locales' folder in it
  outputJsonFileName: "", // Name of the JSON file that needs to be created. Default: 'common'
};
```

**Keys Explanation:**

- `excelFilePath`: Path of the Excel sheet that needs to be converted to JSON files. This is compulsory.
- `outputDirPath`: Path of the folder where JSON files will be created. Default is to create a 'locales' folder in it.
- `outputJsonFileName`: Name of the JSON file that needs to be created. Default is 'common'.

#### Running the Feature

To run the conversion script:

```bash
node src/convert_to_json.js
```

## 3. Convert to Excel

This feature converts JSON files in the specified directories to an Excel sheet.

1. There is no need of creating Gemini API key for this feature

2. Install the dependencies:

    ```bash
    npm install
    ```

#### Configuration

To enable converting JSON files to an Excel sheet, configure the `convertToExcelPaths` in `config.js`:

```javascript
const convertToExcelPaths = {
  baseDirPath: "", // Directory of translation folders path (e.g., './locales')
  jsonFileName: "", // JSON file name that needs to be converted (e.g., 'common')
  outputExcelPath: "", // Path where the Excel sheet will be created. Default: at the same folder
  excelFileName: "", // Name of the Excel sheet that will be created. Default: 'translations'
};
```

**Keys Explanation:**

- `baseDirPath`: Directory of translation folders path (e.g., './locales'). This is compulsory.
- `jsonFileName`: JSON file name that needs to be converted (e.g., 'common'). This is compulsory.
- `outputExcelPath`: Path where the Excel sheet will be created. Default is to create the Excel file in the same folder.
- `excelFileName`: Name of the Excel sheet that will be created. Default is 'translations'.

#### Running the Feature

To run the conversion script:

```bash
node src/convert_to_excel.js
```

## Notes

- For converting JSON to Excel and Excel to JSON, no API key is needed. You can directly run `npm install` and configure the `config.js` file according to your needs.
- Ensure your API key for translation is kept secure and not exposed in public repositories.
