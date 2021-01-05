const { readJSON, writeJSON } = require("fs-extra");
const { join } = require("path");

const reviewsPath = join(__dirname, "../services/reviews/reviews.json");
const listingsPath = join(__dirname, "../services/listings/listings.json")


const readDB = async filePath => {
  try {
    const fileJson = await readJSON(filePath);
    return fileJson;
  } catch (error) {
    throw new Error(error);
  }
};

const writeDB = async (filePath, fileContent) => {
  try {
    await writeJSON(filePath, fileContent);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getReviews: async () => readDB(reviewsPath),
  writeReviews: async reviewsData => writeDB(reviewsPath, reviewsData),
  getListings: async () => readDB(listingsPath),
  writeListings: async listingsData => writeDB(listingsPath, listingsData),
};
