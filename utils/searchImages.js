
//const axios = require('axios');
const duckDuckGoSearch = require("duckduckgo-search");
//const { SearchApi } = require('duckduckgo-search');

// SearchApi.logger = {};
// SearchApi.logger.warning = () => {};
// SearchApi.logger.error = () => {};

async function duckDuckGoImagesSearch(term) {
  const urls=[]
  try{
    for await (const result of duckDuckGoSearch.images(term)) {
      urls.push(result)
      console.log(result);
    }
  }catch(e){console.log(e)}
  return urls

  // console.log(`Searching for '${term}'`);
  // const ddgs = new DDGS();
  // const searchResults = await ddgs.images({ keywords: term });
  // const imageData = searchResults.results;
  // const imageUrls = imageData.slice(0, maxImages).map(item => item.image);
  // return imageUrls;
}

module.exports = {duckDuckGoImagesSearch}