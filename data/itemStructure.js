const outputFormat={
    menue_name: 'Pere Picolit',
    menue_type: 'Dessert',
    menue_serving_type: 'Dessert/coffee tea',
    menue_description: 'Pere marinate e decorate con altri frutti freschi',
    menue_ingredients: 'Pere, kiwi, more, lamponi, panna',
    menue_preparation: 'Pere marinate',
    //menue_short_name: 'Picot'
}

const inputFormat={"DishName": "Ginger Ale", "language": "English"}

const inputFormatStyle={
  "DishName": "Pizza della casa",
  "RestaurantStyle": "Michelin starred",
  "language": "English"
}

const categoryList=(`Antipasto
Pasta
Verdure
Side
Appetizers
Soups
Sandwiches
Seafood
Vegetarian
Desserts
Coffee and Tea
Wine and Alcohol
Meat
Salads
Extras
Carne
Chef's pick
Daily Special
Pesce
Soft Drinks
Dessert/Coffee`).split(`
`)

const styleList = `Black tie, exclusive, special ceremony, classy, sophisticated, gourmet, Michelin starred, casual, mid-class, family style, café, diner, large chain`.split(", ")

const fs = require('fs');
// async function readJsonFile(filename='test.json') {
//   try {
//     const data = await fs.promises.readFile(filename);
//     const content = JSON.parse(data);
//     return content //return content.data[1];
//   } catch (err) { console.error(err);throw err; }}
function readJsonFile(filename = 'test.json', json=true) {
  try {
    const data = fs.readFileSync(filename, 'utf8');
    if(!json) return data
    const content = JSON.parse(data);
    return content;  } catch (err) { console.error(err); throw err; }}

function formatPrompt(obj, prompt) {
  return Object.keys(obj).reduce((formatted, key) => {
    let value = obj[key];
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    } else if (Array.isArray(value)) {
      value = value.join(', ');
    }
    return formatted.replace(`{${key}}`, value);
  }, prompt);
}


const loadPrompt=(obj, filename = './prompts/prompt1.md')=>{
  return formatPrompt(obj, readJsonFile(filename, json=false)) }


console.log(categoryList)
console.log(styleList)

module.exports = {
  inputFormat,
  inputFormatStyle,
  outputFormat,
  categoryList,
  styleList,
  readJsonFile,
  formatPrompt,
  loadPrompt
};
