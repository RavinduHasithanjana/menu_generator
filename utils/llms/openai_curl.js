const https = require('https');

const setOpenaiApiKey = (apiKey = null) => {
  if (apiKey) process.env.OPENAI_API_KEY = apiKey;
};

const initMessages = (systemPrompt) => [
  { role: "system", content: systemPrompt },
];

const newMessage = (prompt, role = "user") => {
  return { role: role, content: prompt };
};

const chatGptRequest = async (
  prompt,
  systemPrompt = "You are helpful assistant.",
  model = "gpt-4o-mini",
  max_tokens = 500,
  temperature = 0.2,
  returnImages = false
) => {
  const messages = initMessages(systemPrompt);
  messages.push(newMessage(prompt));

  const options = {
    method: 'POST',
    hostname: 'api.openai.com',
    path: '/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        resolve(response);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    const body = JSON.stringify({
      model,
      messages,
      max_tokens,
      temperature,
      stream: false,
      store: false,
    });

    req.write(body);
    req.end();
  });
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
  const ans = getOpenaiAnswerText(res);
  return parseJson(ans)
};

const exp = {
  setOpenaiApiKey,
  chatGptRequest,
  getOpenaiAnswerText,
  getOpenaiAnswerJson,
};

const test_func = async (prompt) => {
  setOpenaiApiKey();
  const res = await chatGptRequest(prompt);
  console.log(getOpenaiAnswerJson(res));
};

if (!module.parent) test_func("What is Openai?");

module.exports = exp;