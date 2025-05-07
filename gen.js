const { outputFormat, categoryList } = require('./data/itemStructure')
const X = require('./utils/settings')

let testDishName
try{
    const testDishName = X.readJsonFile('./test.json').data[2].menue_name
}catch{
    testDishName="Ginger Ale"
}


let globalMaxTokens=1000
let globalTemperature=0

const geminiRequest = async(model, prompt, systemPrompt)=>{ const max_tokens  = globalMaxTokens || 500 ; const temperature = globalTemperature || 0
    let res = X.geminiRequest( prompt, systemPrompt, model, max_tokens, temperature ) ;
    res = await res ;  let ans = X.getGeminiAnswerJson(res) ; console.log(ans) ; return { ans, res } }

const groqRequest = async(model, prompt, systemPrompt)=>{ const max_tokens  = globalMaxTokens || 500 ; const temperature = globalTemperature || 0
    let res = X.groqRequest( prompt, systemPrompt, model, max_tokens, temperature ) ;
    res = await res ;  let ans = X.getOpenaiAnswerJson(res) ; console.log(ans) ; return { ans, res } }

const cerebrasRequest = async(model, prompt, systemPrompt)=>{ const max_tokens = globalMaxTokens || 500 ; const temperature  = globalTemperature || 0
    let res = X.cerebrasRequest( prompt, systemPrompt, model, max_tokens, temperature ) ;
    res = await res ;  let ans = X.getOpenaiAnswerJson(res) ; console.log(ans) ; return { ans, res } }

const openaiRequest = async(model, prompt, systemPrompt)=>{ const max_tokens = globalMaxTokens || 500 ; const temperature  = globalTemperature || 0
    let res = X.openaiRequest( prompt, systemPrompt, model, max_tokens, temperature ) ;
    res = await res ;  let ans = X.getOpenaiAnswerJson(res) ; console.log(ans) ; return { ans, res } }

const proplexityRequest = async(model, prompt, systemPrompt)=>{
    const return_images=false // THis feature cost more on proplexity
    //let images = X.duckDuckGoImagesSearch(dishName)
    const max_tokens      = globalMaxTokens || 500
    const temperature     = globalTemperature || 0.2
    let res = X.proplexityRequest(
        prompt, systemPrompt, 
        model, max_tokens, temperature, return_images
    )
    //let images = await X.duckDuckGoImagesSearch(dishName) ; 
    res = await res
    
    //const imagesStr=JSON.stringify(images, null, 2)
    //console.log('imagesStr', imagesStr)
    //const ans = X.getAnswerText(res)
    let ans = X.getProplexityAnswerJson(res) ; console.log(ans) ; return { ans, res } }




const selectSystemPrompt=(style=null, _styleList, _categoryList)=>{
    const {inputFormat, inputFormatStyle, 
        outputFormat, categoryList, styleList} = X;

    if(!_styleList) _styleList=styleList
    if(!_categoryList) _categoryList=categoryList
    console.log('_styleList', _styleList)
    console.log('_categoryList', _categoryList)
    //console.log(outputFormat, categoryList, styleList)
    let systemPrompt;
    if(!style){
        systemPrompt = X.loadPrompt(
            {
                inputFormat,
                outputFormat,
                _categoryList,
            },
            './data/prompts/prompt1.md'
        )
    }else{
        systemPrompt = X.loadPrompt(
            {
                inputFormat,
                outputFormat,
                _categoryList,
                _styleList
            },
            './data/prompts/prompt2_style.md'
        )
    }
    console.log(systemPrompt)
    return systemPrompt
}


const getPrompt=(dishName, style, language)=>{
    // const obj = await X.readJsonFile('./data/test.json')
    // let name = obj.data[1].menue_name
    // console.log(name)
    let prompt = `Help me write menu for: `
    if(!style) prompt += JSON.stringify({DishName: dishName, language}) 
    if(style) prompt += JSON.stringify({DishName: dishName, RestaurantStyle: style, language })
    //let systemPrompt = "You a helpful assistan"
    return prompt
}

const selectModelById=async (modelName, prompt, systemPrompt)=>{
    let model=null ; let res={} ; let modelProvider;
    switch (modelName) {
        case 'proplexity':
            console.log('selectModelById', 'proplexity')
            model = 'sonar' ; modelProvider = 'proplexity'
            res = await proplexityRequest(model, prompt, systemPrompt);
            break;
        case 'openai':
            console.log('selectModelById', 'openai')
            model= 'gpt-4o-mini' ; modelProvider = 'openai'
            res = await openaiRequest(model, prompt, systemPrompt);
            break;
        case 'groq':
            console.log('selectModelById', 'groq')
            model= "qwen-qwq-32b" ; modelProvider = 'groq'
            res = await groqRequest(model, prompt, systemPrompt);
            break;
        case 'gemini-2.0-flash':
            console.log('selectModelById', 'google-gemini-2.0-flash')
            model= "gemini-2.0-flash" ; modelProvider = 'google'
            res = await geminiRequest(model, prompt, systemPrompt);
            break;
        case 'gemini-1.5-flash-001':
            console.log('selectModelById', 'google-gemini-1.5-flash-001')
            model= "gemini-1.5-flash-001" ; modelProvider = 'google'
            res = await geminiRequest(model, prompt, systemPrompt);
            break;
        case 'gemini-2.0-flash-thinking-exp-01-21':
            console.log('selectModelById', 'gemini-2.0-flash-thinking-exp-01-21')
            model= "gemini-2.0-flash-thinking-exp-01-21" ; modelProvider = 'google'
            res = await geminiRequest(model, prompt, systemPrompt);
            break;
        case 'gemini-2.0-pro-exp-02-05':
            console.log('selectModelById', 'gemini-2.0-pro-exp-02-05')
            model= "gemini-2.0-pro-exp-02-05" ; modelProvider = 'google'
            res = await geminiRequest(model, prompt, systemPrompt);
            break;
        case 'gemini-1.5-pro':
            console.log('selectModelById', 'gemini-1.5-pro')
            model= "gemini-1.5-pro" ; modelProvider = 'google'
            res = await geminiRequest(model, prompt, systemPrompt);
            break;
        case 'cerebras':
            console.log('selectModelById', 'cerebras')
            model= "llama-3.3-70b" ; modelProvider = 'cerebras'
            res = await cerebrasRequest(model, prompt, systemPrompt);
            break;
        default:
            console.log('selectModelById', 'default')
            //model= "qwen-qwq-32b" ; modelProvider = 'groq'
            model= "llama-3.3-70b" ; modelProvider = 'cerebras'
            res = X.modelExist(modelProvider) // find model
            console.log('Selected model',  res)
            if(!res || res==undefined){ const error='NO_API_KEYS_PROVIDED or selectModelById error (gen.js)'; res = { ans:{error}, res:{error} }}
            else if(res) res = await selectModelById(res, prompt, systemPrompt) 
            //res = await proplexityRequest(model, prompt, systemPrompt);
            break;
    }
    try{
        console.log(res)
        console.log(res.ans)
        res.ans.modelProvider = modelProvider
        res.ans.model=model ; return res 
    }catch(e){
        console.log(e)
        process.exit()
    }
}

const parseAnswer=(obj, modelName, prompt, systemPrompt)=>{
    let ans = obj.ans ; const res = obj.res ; 
    try{
        if(typeof(ans.menue_ingredients)!='string') ans.menue_ingredients = ans.menue_ingredients.join(", ");
        if(typeof(ans.alternative_names)!='string') ans.alternative_names = ans.alternative_names.join(", ");
    }catch(e){console.log(e)}
    //ans.modelProvider=modelName
    ans.systemPrompt=systemPrompt
    ans.prompt=prompt
    ans=JSON.stringify(ans, null, 2)
    const jsonStr=JSON.stringify(res, null, 2)
    const fs = require('fs');
    fs.writeFileSync('response.json', jsonStr);
    fs.writeFileSync('response_json.json', ans);
    //fs.writeFileSync('response_images.json', imagesStr);
    // console.log(res)
    // console.log(jsonStr)
    return ans
}


generateDishDescription = async(dishName=testDishName, style=null, language='English', modelName="proplexity", userPrompt='', styleList=null, categoryList=null)=>{
    let systemPrompt  = selectSystemPrompt(style, styleList, categoryList)
    let prompt        = getPrompt(dishName, style, language)

    if(userPrompt && userPrompt!=undefined && userPrompt.length > 5 ) systemPrompt+='\n\n ------------\n User recomendations/requirements for generation:\n\n'+userPrompt
    console.log(systemPrompt)
    const ans           = await selectModelById(modelName, prompt, systemPrompt)

    return parseAnswer(ans, prompt, systemPrompt)
}

if (!module.parent) generateDishDescription()

X.generateDishDescription = generateDishDescription
module.exports = X;

// import OpenAI from "openai";
// const client = new OpenAI();

// const completion = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{
//         role: "user",
//         content: "Write a one-sentence bedtime story about a unicorn.",
//     }],
// });

// console.log(completion.choices[0].message.content);
