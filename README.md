Here's a `README.md` file content for your project:

---

# Translator

This project uses Google Generative AI API to translate content into multiple languages. The translations are processed and stored as JSON files, organized by country and language. The accuracy of translation using Google Generative AI (Gemini) is above `90%`. Adjustments may be necessary for specific use cases or languages.

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed. You can download it [here](https://nodejs.org/).
2. **Google Generative AI API Key**: You need an API key to access the Google Generative AI API. You can get it from [here](https://ai.google.dev/gemini-api/docs/api-key)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/VijayDarisi/translator.git
    cd translator
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Google Generative AI API key:

    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

## Configuration

### Config File

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
 */
const paths = {
  inputPath: "./input.json",
  outputPath: "",
  outputJsonFileName: "common",
};

module.exports = { generationConfig, countryLanguageMapping, paths };
```

### Utils File

Utility functions are stored in `utils.js`. This file includes functions for extracting JSON content, getting unique language codes, creating folders, creating or updating files, creating prompts, and creating chat sessions.

## Running the Project

1. Prepare your input JSON file and place it at the path specified in `inputPath` in `config.js`. The default path is `./input.json`.

2. Run the script:

    ```bash
    node src/index.js
    ```

## File Structure

- **Input File**: The input JSON file containing the content to be translated. The default path is `./input.json`.
- **Output Files**: Translated JSON files are saved in a folder structure based on country and language codes. By default, these files are saved in the `./locales` folder.
- **outputJsonFileName**:  Name of the output JSON files. Defaults to say `common`. You can change this value to customize the name of the output files.

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

## Notes

- Ensure your API key is kept secure and not exposed in public repositories.
- Adjust the `generationConfig` settings in `config.js` as needed to fine-tune the translation output.
