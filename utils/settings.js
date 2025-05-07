const dotenv = require('dotenv'); dotenv.config();
const { 
    PROPLEXITY_API_KEY, 
    OPENAI_API_KEY,
    GROQ_API_KEY,
    CEREBRAS_API_KEY,
    GOOGLE_API_KEY,
    JS_SERVER_URL
} = process.env;
let X = { 
    PROPLEXITY_API_KEY, 
    OPENAI_API_KEY,
    GROQ_API_KEY,
    CEREBRAS_API_KEY,
    GOOGLE_API_KEY,
    JS_SERVER_URL
}

let itemStructure, proplexity, searchImages, imageRecognitionOpenai, groq, cerebras, openai, gemini

Object.assign(X, (itemStructure = require('../data/itemStructure')))
Object.assign(X, (proplexity = require('./llms/proplexity')))
Object.assign(X, (openai = require('./llms/openai')))
Object.assign(X, (groq = require('./llms/groq')))
Object.assign(X, (cerebras = require('./llms/cerebras_curl')))
Object.assign(X, (gemini = require('./llms/gemini_curl')))
Object.assign(X, (searchImages = require('./searchImages')))
Object.assign(X, (imageRecognitionOpenai = require('./imageRecognitionOpenai')))


X.setProplexityToken(PROPLEXITY_API_KEY)
X.setOpenaiToken(OPENAI_API_KEY)
X.setGroqToken(GROQ_API_KEY)
X.setCerebrasToken(CEREBRAS_API_KEY)
X.setGeminiToken(GOOGLE_API_KEY)
X.initOpenAI(OPENAI_API_KEY) // images


X.modelList=[
    'cerebras',
    'gemini-1.5-flash-001',
    'gemini-2.0-flash',
    'groq',
    "gemini-2.0-flash-thinking-exp-01-21",
    "gemini-1.5-pro",
    'openai',
    "gemini-2.0-pro-exp-02-05",
    'proplexity',
]
// if (CEREBRAS_API_KEY)   X.modelList.push('cerebras')
// if (GROQ_API_KEY)       X.modelList.push('groq')
// if (OPENAI_API_KEY)     X.modelList.push('openai')
// if (PROPLEXITY_API_KEY) X.modelList.push('proplexity')

X.modelNames=[
    // cerebras
    "llama-3.3-70b", //"deepSeek-r1-distill-llama-70B"
    'gemini-1.5-flash-001', 
    'gemini-2.0-flash', 
    "gemini-2.0-flash-thinking-exp-01-21",
    "gemini-2.0-pro-exp-02-05",
    "gemini-1.5-pro",
    // groq
    "qwen-qwq-32b", // "qwen-2.5-32b", // llama-3.3-70b-specdec
    // openai
    'gpt-4o-mini', // o3-mini
    // proplexity
    'sonar',
]
X.apiKeyCheck=[
    CEREBRAS_API_KEY,
    GOOGLE_API_KEY,
    GOOGLE_API_KEY,
    GOOGLE_API_KEY,
    GOOGLE_API_KEY,
    GOOGLE_API_KEY,
    GROQ_API_KEY,
    OPENAI_API_KEY,
    PROPLEXITY_API_KEY, 
]
console.log( X.apiKeyCheck )

X.isModelExists={} ; for (let i in X.modelList) {  X.isModelExists[X.modelList[i]] = (X.apiKeyCheck[i] && X.apiKeyCheck[i].length>3) }
console.log( X.isModelExists)

X.modelExist=(modelName=null)=>{
    console.log('modelExist', modelName)
    if (modelName && X.isModelExists[modelName]) return modelName
    for (let model of X.modelList) {
        console.log( model)
        if(X.isModelExists[model]) return model
    }
}

//console.log(X.modelExist('openai')) ; process.exit()

//console.log(exp)

module.exports = X;