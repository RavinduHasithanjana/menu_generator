//import OpenAI from "openai";
const OpenAI = require("openai");
let openai = null

const prompt = `{
  "task": "Extract dish details from image",
  "output_format": {
    "dishNameAlternatives": ["Example Dish Name 1", "Example Dish Name 2", "Example Dish Name 3", "Example Dish Name 4"],
    "ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
    "menu_category": "Category Name",
    "shortNameAlternatives": ["Short Name 1", "Short Name 2","Short Name 3","Short Name 4"]
  }
}`

const initOpenAI = (api_key=null)=>{
    if (!api_key) openai = new OpenAI({})
    openai = new OpenAI({
        apiKey: api_key || process.env.OPENAI_API_KEY,
    });
}

const imageRecognitionOpenai = async(url)=>{

url="https://" + url.split("https://").join("");

const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{
        role: "user",
        content: [
            { type: "text", text: prompt || "What is in this image?" },
            {
                type: "image_url",
                image_url: {
                    url: url //"https://tse2.mm.bing.net/th?id=OIP.WpB2pMvzsSWeUgzn2v_-vwHaJQ&pid=Api",//"https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                },
            },
        ],
    }],
});

const message=response.choices[0].message.content
console.log(message);
return JSON.parse(message)

}

module.exports = {initOpenAI, imageRecognitionOpenai}

//initOpenAI ()
if (!module.parent)  (initOpenAI() && imageRecognitionOpenai("https://tse2.mm.bing.net/th?id=OIP.WpB2pMvzsSWeUgzn2v_-vwHaJQ&pid=Api"));