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
 * If input file path is not provided, defaultly sets to ./input.json
 *
 * @var outputPath - If OutputPath is not provided defaultly creates locales folder and all mapping folder are created.
 * Else all the files are created in given output path
 *
 * @var outputJsonFileName - Used for creating or updating output json file name
 */
const paths = {
  inputPath: "./input.json",
  outputPath: "",
  outputJsonFileName: "common",
};

module.exports = { generationConfig, countryLanguageMapping, paths };
