const https = require('https');

const setCerebrasToken = (apiKey = null) => {
  if (apiKey) process.env.CEREBRAS_API_KEY = apiKey;
};

const initMessages = (systemPrompt) => [
  { role: "system", content: systemPrompt },
];

const newMessage = (prompt, role = "user") => {
  return { role: role, content: prompt };
};


// ```
// curl --location 'https://api.cerebras.ai/v1/chat/completions' \
// --header 'Content-Type: application/json' \
// --header "Authorization: Bearer ${CEREBRAS_API_KEY}" \
// --data '{
//   "model": "llama3.1-8b",
//   "stream": false,
//   "messages": [{"content": "why is fast inference important?", "role": "user"}],
//   "temperature": 0,
//   "max_tokens": -1,
//   "seed": 0,
//   "top_p": 1
// }'
// ```

const cerebrasRequest = async (
  prompt,
  systemPrompt = "You are helpful assistant.",
  model = "llama-3.3-70b", //"deepSeek-r1-distill-llama-70B", // llama-3.3-70b
  max_tokens = 1000, // "max_tokens": -1,
  temperature = 0, // temperature": 0,
  returnImages = false // seed": 0, "top_p": 1
) => {
  const messages = initMessages(systemPrompt);
  messages.push(newMessage(prompt));

  const options = {
    method: 'POST',
    hostname: 'api.cerebras.ai',
    path: '/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
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
      //store: false,
    });

    req.write(body);
    req.end();
  });
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
  setCerebrasToken,
  cerebrasRequest,
  getOpenaiAnswerText,
  getOpenaiAnswerJson,
};

const test_func = async (prompt) => {
  setCerebrasToken();
  const res = await cerebrasRequest(prompt);
  console.log(getOpenaiAnswerJson(res));
};

if (!module.parent) test_func("What is Openai?");

module.exports = exp;