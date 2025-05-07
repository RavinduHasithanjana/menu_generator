const { Configuration, OpenAI } = require("openai");

const configuration = {
  apiKey: process.env.OPENAI_API_KEY, // replace with your OpenAI API key
 
}

let openai

const setOpenaiToken = (apiKey=null) => {
  if(apiKey) configuration.apiKey = apiKey;
  openai = new OpenAI(configuration);
  
};

const initMessages = (systemPrompt) => [
  { role: "system", content: systemPrompt },
];

const newMessage = (prompt, role = "user") => {
  return { role: role, content: prompt };
};

const openaiRequest = async (
  prompt,
  systemPrompt="You are helpful assistant.",
  model = "gpt-4o-mini", // "o3-mini",
  max_tokens = 500,
  temperature = 0.2,
  returnImages = false
) => {
  const messages = initMessages(systemPrompt);
  messages.push(newMessage(prompt));

  try {
    const response = await openai.chat.completions.create({
      messages,
      model,
      max_tokens,
      temperature,
      stream: false, // Set to true for streaming response
      store: false,
    });
    console.log(response)
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


const parseJson=(res)=>{
  if (res.indexOf('```json')>-1) res=res
      .split('```json')[1] //.join('')
      .split('```')[0];
  console.log(res)
  return JSON.parse(res)
}



const getOpenaiAnswerText = (res) => res.choices[0].message.content;

const getOpenaiAnswerJson = (res) => {
  console.log(res);
  const ans = getOpenaiAnswerText(res);
  return parseJson(ans)
};

const exp = {
  setOpenaiToken,
  openaiRequest,
  getOpenaiAnswerText,
  getOpenaiAnswerJson,
};




test_func=async (prompt)=>{
    setOpenaiApiKey()
    console.log(getOpenaiAnswerJson(await openaiRequest(prompt)))
}

if (!module.parent) test_func("What is Openai?")



module.exports = exp;