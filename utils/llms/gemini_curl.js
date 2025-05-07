const https = require('https');

const setGeminiToken = (apiKey = null) => {
  if (apiKey) process.env.GOOGLE_API_KEY = apiKey;
};

const initContents = (prompt, systemPrompt=null) => {
    let system_instruction=null
    if (systemPrompt)  system_instruction= {
        "parts": [
          {
            "text": systemPrompt, //"You are a cat. Your name is Neko."
          }
        ]
      };
    const contents=[
    {
        parts: [
        {
            text: prompt,
        },
        ],
    },
    ];
    return {contents, system_instruction}
}

const geminiRequest = async (
    prompt,
    systemPrompt="You are helpful assistant.",
    model = 'gemini-2.0-flash', //'gemini-1.5-flash-001', // "gemini-2.0-pro-exp-02-05", // "gemini-2.0-pro-exp-02-05", // "gemini-2.0-flash-thinking-exp-01-21",
    maxOutputTokens = 500,
    temperature = 1.0,
    //stopSequences = ['Title'],
    topP = 0.8,
    topK = 10
) => {
  const {contents, system_instruction} = initContents(prompt, systemPrompt);

  const options = {
    method: 'POST',
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${model}:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  console.log(options)

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
   let payload={contents}
   if(system_instruction) payload.system_instruction=system_instruction
   payload.generationConfig= {
          //stopSequences,
          temperature,
          maxOutputTokens,
          //topP,
          //topK,
    }
    const body = JSON.stringify(payload);
    console.log(body)
    req.write(body);
    req.end();
  });
};

const parseJson = (res) => {
  if (res.indexOf('```json') > -1)
    res = res.split('```json')[1].split('```')[0];
  console.log(res);
  return JSON.parse(res);
};

const getGeminiAnswerText = (res) => res.candidates[0].content.parts[0].text;

const getGeminiAnswerJson = (res) => {
  console.log(res);
  const ans = getGeminiAnswerText(res);
  return parseJson(ans);
};

const exp = {
  setGeminiToken,
  geminiRequest,
  getGeminiAnswerText,
  getGeminiAnswerJson,
};

const testGeminiFunc = async (prompt) => {
  setGeminiToken();
  const res = await geminiRequest(prompt);
  console.log(res.candidates[0].content)
  console.log(getGeminiAnswerJson(res));
};

if (!module.parent) testGeminiFunc('What is Gemini?');

module.exports = exp;