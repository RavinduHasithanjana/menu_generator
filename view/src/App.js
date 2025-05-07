import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import CSS for styling
import { ClipLoader } from 'react-spinners';
import { stringify } from 'flatted';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import ModelSelector from './components/ModelSelector';

const storeInLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

const retrieveFromLocalStorage = (key) => {
  return localStorage.getItem(key);
};


function getApiUrl(url, port1, port2, endpoint='gen') {
  const baseUrl = url.split(`:${port1}`)[0];
  return `${baseUrl}:${port2}/${endpoint}`;
}
  // const currentUrl = window.location.href.split(':3006')[0];
  // const port = 3005; // or any other port
  // const apiUrl = `${currentUrl}:${port}/gen`;

const apiUrl = getApiUrl(window.location.href, 3006, 3005,
  'gen')
const apiSearchImagesUrl = getApiUrl(window.location.href, 3006, 3007,
  'search/images?keywords=')

const languages = ['English', 'Italian', 'French']

function App() {
  const generateButtonRef = useRef(null);

  const [dishName, setDishName] = useState(//retrieveFromLocalStorage('dishName') || 
      'Undefined Delight');
  const [output, setOutput] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [isLoading2, setLoading2] = useState(false);
  const [images, setImages] = useState([]);
  const [style, updateStyle] = useState(null);
  const [globalLanguage, updateLanguage] = useState('English');
  const [globalModel, updateModel] = useState('cerebras');
  const [userPrompt, setUserPrompt] = useState('');
  const [tempPrompt, setTempPrompt] = useState(retrieveFromLocalStorage('tempPrompt') || '');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [tempSystemPrompt, setTempSystemPrompt] = useState('')

useEffect(() => {
  console.log('systemPrompt changed:', style);
  // Perform actions on style change
  generateDish(dishName, style, globalLanguage, globalModel, userPrompt, systemPrompt)
}, [userPrompt]);

  useEffect(() => {
    console.log('userPrompt changed:', style);
    // Perform actions on style change
    generateDish(dishName, style, globalLanguage, globalModel, userPrompt)
  }, [userPrompt]);


  useEffect(() => {
    console.log('Style changed:', style);
    // Perform actions on style change
    generateDish(dishName, style, globalLanguage)
  }, [style]);

  useEffect(() => {
    console.log('Model changed:', style);
    // Perform actions on style change
    generateDish(dishName, style, globalLanguage, globalModel)
  }, [globalModel]);

  // useEffect(() => {
  //   console.log('Language changed:', globalLanguage);
  //   // Perform actions on style change
  //   generateDish()
  // }, [globalLanguage]);
  
  const handleLanguageChange = (event) => {
    console.log('language changed:', style);
    updateLanguage(event.target.value);
    generateDish(dishName, style, event.target.value)
  };

 

  // Fetch data from the API
  let last_time=0
  const generateDish = async (forceName=false, styleName=null, language="English", modelName=null, _userPrompt='', _systemPrompt='') => {
    const flag=(new Date().getTime() - last_time) > 1000
    console.log('generateDish', flag ,forceName, styleName, language, modelName, new Date().getTime());
    if(!flag)return false
    console.log('generateDish run')
    setUserPrompt(tempPrompt)
    storeInLocalStorage('dishName', (forceName || dishName));
    storeInLocalStorage('tempPrompt', (_userPrompt || tempPrompt));
    last_time = new Date().getTime()
    try {
      setLoading(true)
      console.log(apiUrl)
      if (typeof(forceName)=='object') forceName=null
      const obj={ dishName: (forceName || dishName), 
        styleName: style || styleName , 
        language: language || globalLanguage,
        model: modelName || globalModel || null,
        userPrompt: _userPrompt || tempPrompt,
        systemPrompt: _systemPrompt || tempSystemPrompt
      }
      //console.log(obj)
      console.log(JSON.stringify(obj, null, 2))
      const cache=[]
      const response = await fetch(apiUrl, { // || 'http://localhost:3001/gen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(obj)//,
                                
                                // (key, value) => {
                                //   // Custom replacer function to handle circular references
                                //   if (typeof value === 'object' && value !== null) {
                                //     if (cache.includes(value)) {
                                //       // Circular reference found, return undefined
                                //       return undefined;
                                //     }
                                //     // Store value in cache
                                //     cache.push(value);
                                //   }
                                //   return value;
                                // }),
      });
      setLoading(false)
      console.log(response)
      const data = await response.json();
      console.log(data)
      setOutput(data);
      const alternative_names=response.alternative_names
      await searchImages(forceName || dishName) //+", "+alternative_names)
    } catch (error) {
      setLoading(false)
      setOutput({});
      console.error('Error fetching data:', error);
    }
  };

  const searchImages = async (keywords) => {
    try {
      setLoading2(true)
      console.log(apiSearchImagesUrl+encodeURIComponent(keywords))
      const response = await fetch(
        apiSearchImagesUrl+ encodeURIComponent(keywords),
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setLoading2(false)
      const data = await response.json();
      console.log(JSON.stringify(data, null, 2))
      let first10Results = data['results']
      try{
        first10Results = data['results'].slice(0, 20);
      }catch{}
      console.log(first10Results)
      setImages(first10Results);
      // Simulate adding alternative_names since it's not in the curl response
    } catch (error) {
      setLoading2(false)
      console.error('Error fetching images:', error);
      setImages([]);
    }
  };

  // Flatten JSON object into an array of key-value pairs
  const flattenObject = (obj, parent = '', res = []) => {
    for (let key in obj) {
      const propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenObject(obj[key], propName, res); // Recursively flatten nested objects
      } else {
        res.push({ key: propName, value: obj[key] });
      }
    }
    return res;
  };

  // Get the list of key-value pairs
  const outputList = flattenObject(output);
  const isSmallField = (value) => !value || value.length < 50;

  return (
    <div className="app-container">
      {/* Input field for dish name */}
      {(
    <div>
      <ImageUploader setDishName={setDishName} generateDish={generateDish} />
    </div>
  )},
      <div><ModelSelector updateModel={updateModel} /></div>
      <div><StyleSelector updateStyle={updateStyle} /></div>
      <div>
      {(
        <select value={globalLanguage || languages[0]} onChange={handleLanguageChange}>
          <option value="">Select Language</option>
          {languages.map((language, index) => (
            <option key={index} value={language}>
              {language}
            </option>
          ))}
        </select>
      )}
      <p>Selected Language: {globalLanguage}</p>
    </div>
      <input
        type="text"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            generateButtonRef.current.click();
          }
        }}
        placeholder="Enter dish name"
        className="dish-input"
      />
      {/* <input
        type="text"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        placeholder="Enter pr prompt"
        className="user-prompt-input"
    /> */}
    {(false ? (<p>Rewrite full system prompt:</p>):'')}
    {(false ? (<textarea
    value={tempSystemPrompt}
    className="output-textarea"
    //onChange={(e) => setUserPrompt(e.target.value)}
    onChange={(e) => setTempSystemPrompt(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        setSystemPrompt(tempSystemPrompt);
        // setTempPrompt(''); // clear textarea
        // Optional: clear textarea after updating
        // e.target.value = '';
      }
    }}
    placeholder="Enter corretions prompt, for example 'make prepeatation field more detail'"
    rows="3"
    style={{ minHeight: '60px', maxWidth: '400px' }}
    disabled={false} 
    />):'')}
    <p>User correction prompt:</p>
    <textarea
    value={tempPrompt}
    className="output-textarea"
    //onChange={(e) => setUserPrompt(e.target.value)}
    onChange={(e) => setTempPrompt(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        setUserPrompt(tempPrompt);
        // setTempPrompt(''); // clear textarea
        // Optional: clear textarea after updating
        // e.target.value = '';
      }
    }}
    placeholder="Enter corretions prompt, for example 'make prepeatation field more detail'"
    rows="3"
    style={{ minHeight: '60px', maxWidth: '400px' }}
    disabled={false} 
    />
      <button onClick={generateDish} className="generate-button" ref={generateButtonRef}>
        Generate
      </button>

      {/* Display output as text fields */}
      {isLoading ? (
    <div className="loader-container">
      <ClipLoader color="#007bff" size={50} />
    </div>
  ) : (
    // Normal output
      outputList.length > 0 ? (

        <div className="output-container">
        {outputList.map((item, index) => (
          <div key={index} className="output-field">
            <label>{item.key}</label>
            {isSmallField(item.value) ? (
              <input
                type="text"
                value={item.value}
                readOnly
                className="output-input"
              />
            ) : (
              <textarea
                value={item.value}
                readOnly
                className="output-textarea"
                rows="3"
              />
            )}
          </div>
        ))}
      </div>

      ) : (
        <p>No data available</p>
      )
    )},
    {
      isLoading2 ? (
        <div className="loader-container">
          <ClipLoader color="#007bff" size={50} />
        </div>
      ) : (
  images.length > 0 ? (
    <div className="image-container">
      {images.map((result, index) => (
        <div key={index} className="image-card">
          <img src={result.thumbnail} alt={result.title} />
          <h3>{result.title}</h3>
          <p>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              View Source
            </a>
          </p>
        </div>
      ))}
    </div>
  ) : (
    <p>No images found.</p>
  ))
  }
    </div>
  );
}

export default App;