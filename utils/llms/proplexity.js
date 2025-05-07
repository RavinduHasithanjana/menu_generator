const systemPrompt="Be precise and concise."
const userPrompt=""
const body = {
    model: "sonar",
    messages: [
      { role: "system", content: userPrompt },
      //{ role: "user", content: "How many stars are there in our galaxy?" }
    ],
    max_tokens: 123,
    temperature: 0.2,
    top_p: 0.9,
    //search_domain_filter: ["<any>"],
    return_images: false, // This feature cost more
    return_related_questions: false,
    //search_recency_filter: "<string>",
    top_k: 0,
    stream: false,
    presence_penalty: 0,
    frequency_penalty: 1,
    //response_format: {},
    web_search_options: {
      search_context_size: "high"
    }
};
const options = {
    method: 'POST',
    headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
    body: body,//'{"model":"sonar","messages":[{"role":"system","content":"Be precise and concise."},{"role":"user","content":"How many stars are there in our galaxy?"}],"max_tokens":123,"temperature":0.2,"top_p":0.9,"search_domain_filter":["<any>"],"return_images":false,"return_related_questions":false,"search_recency_filter":"<string>","top_k":0,"stream":false,"presence_penalty":0,"frequency_penalty":1,"response_format":{},"web_search_options":{"search_context_size":"high"}}'
};
const defaultOptions = {
  method: 'POST',
  headers: {Authorization: 'Bearer <token>', 'Content-Type': 'application/json'},
  body: '{"model":"sonar","messages":[{"role":"system","content":"Be precise and concise."},{"role":"user","content":"How many stars are there in our galaxy?"}],"max_tokens":123,"temperature":0.2,"top_p":0.9,"search_domain_filter":["<any>"],"return_images":false,"return_related_questions":false,"search_recency_filter":"<string>","top_k":0,"stream":false,"presence_penalty":0,"frequency_penalty":1,"response_format":{},"web_search_options":{"search_context_size":"high"}}'
};


const newBody=(messages, model='sonar', max_tokens=1000, temperature=0.2)=>{
  return `{"model":"${model}","messages":${messages},"max_tokens":${max_tokens},"temperature":0.2,"top_p":0.9,"search_domain_filter":["<any>"],"return_images":false,"return_related_questions":false,"search_recency_filter":"<string>","top_k":0,"stream":false,"presence_penalty":0,"frequency_penalty":1,"response_format":{},"web_search_options":{"search_context_size":"high"}}`
}

const setProplexityToken=(token)=>{options.headers={Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}}
const initMessages=(systemPrompt)=>[{ role: "system", content: systemPrompt },]
const newMessage  = (prompt, role='user')=>{return { role: role, content: prompt }}

const proplexityRequest = async (
          prompt, systemPrompt, 
          model='sonar', max_tokens=500, temperature=0.2, return_images=false) => {
    ;(options.body.messages=initMessages(systemPrompt))
        .push(newMessage(prompt));
    try {
      const payload= Object.assign({}, options)
      payload.body.model=model
      payload.body.max_tokens=max_tokens
      payload.body.temperature=temperature
      payload.body.return_images=return_images
      payload.body=JSON.stringify(payload.body, null, 2);
      //payload.body=newBody(JSON.stringify(options.body.messages, null, 2)) //JSON.stringify(payload.body, null, 2);
      defaultOptions.headers=options.headers
      //const payload = options
      //console.log(defaultOptions)

      
      const response = await fetch('https://api.perplexity.ai/chat/completions', payload);
      //console.log(response)
      const data = await response.json(); //console.log(data);
    return data; } catch (err) { console.error(err); throw err; } }
const getProplexityAnswerText=(res)=> res.choices[0].message.content


const parseJson=(res)=>{
  if (res.indexOf('```json')>-1) res=res
      .split('```json')[1] //.join('')
      .split('```')[0];
  console.log(res)
  return JSON.parse(res)
}



const getProplexityAnswerJson=(res)=> {
  console.log(res)
  return parseJson(getProplexityAnswerText(res)) 
}//.join('');

const exp = { 
    setProplexityToken, 
    proplexityRequest,
    getProplexityAnswerText,
    getProplexityAnswerJson,
}; module.exports = exp