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
 *
 * @var isExcelSheetNeeded - 'true' if you need excel sheet or default set to false
 *
 * @var outputExcelPath - Creates excel file of all translations, if  not provided creates excel file in the same folder.
 */
const paths = {
  inputPath: "./input.json",
  outputPath: "",
  outputJsonFileName: "common",
  isExcelSheetNeeded: false,
  outputExcelPath: "",
};

module.exports = { generationConfig, countryLanguageMapping, paths };
