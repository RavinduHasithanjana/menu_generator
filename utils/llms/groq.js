const { Configuration, OpenAI } = require("openai");

const configuration = {
  apiKey: process.env.GROQ_API_KEY, // replace with your OpenAI API key
  baseURL: "https://api.groq.com/openai/v1"
}

let openai

const setGroqToken = (apiKey=null) => {
  if(apiKey) configuration.apiKey = apiKey;
  openai = new OpenAI(configuration);
  
};

const initMessages = (systemPrompt) => [
  { role: "system", content: systemPrompt },
];

const newMessage = (prompt, role = "user") => {
  return { role: role, content: prompt };
};

const groqRequest = async (
  prompt,
  systemPrompt="You are helpful assistant.",
  model = "qwen-qwq-32b" ,//"qwen-2.5-32b", // llama-3.3-70b-specdec
  max_tokens = 500,
  temperature = 0.2,
  returnImages = false
) => {
  if(model=="qwen-qwq-32b") max_tokens = Math.max(5000, max_tokens) // <think> tokens for reasoning model
  const messages = initMessages(systemPrompt);
  messages.push(newMessage(prompt));

  try {
    const response = await openai.chat.completions.create({
      messages,
      model,
      max_tokens,
      temperature,
      stream: false, // Set to true for streaming response
      //store: false,
    });
    console.log(response)
    console.log(response.choices[0].message.content)
    return response;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getOpenaiAnswerText = (res) => res.choices[0].message.content;

const parseJson=(res)=>{
  if (res.indexOf('```json')>-1) res=res
      .split('```json')[1] //.join('')
      .split('```')[0];
  console.log(res)
  return JSON.parse(res)
}



const getOpenaiAnswerJson = (res) => {
  console.log(res);
  let ans= getOpenaiAnswerText(res)
  let think=''
  if(ans.indexOf('</think>')>-1){
    think=ans[0].split('<think>').join('')
    ans = ans[1]
  }
  
  return parseJson(ans)
};

const exp = {
  setGroqToken,
  groqRequest,
  getOpenaiAnswerText,
  getOpenaiAnswerJson,
};




test_func=async (prompt)=>{
    setGroqToken()
    console.log(getOpenaiAnswerJson(await groqRequest(prompt)))
}

if (!module.parent) test_func("What is Openai?")



module.exports = exp;