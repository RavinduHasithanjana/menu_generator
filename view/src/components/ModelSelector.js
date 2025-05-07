import React, { useState, useEffect } from 'react';
import axios from 'axios';

function getApiUrl(url, port1, port2, endpoint='gen') {
  const baseUrl = url.split(`:${port1}`)[0];
  return `${baseUrl}:${port2}/${endpoint}`;
}

const apiGetInfoUrl= getApiUrl(window.location.href, 3006, 3005,
  'get_info')


function ModelSelector({ updateModel }) {
  const [styles, setStyles] = useState([]);
  const [descriptionStyle, setDescriptionStyle] = useState('cerebras');
  const [loading, setLoading] = useState(true);

  // Fetch styles only once on mount
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await axios.get(apiGetInfoUrl);
        setStyles(response.data.modelList);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStyles();
  }, []); // Empty dependency array ensures one-time fetch

  // Style change listener
  // useEffect(() => {
  //   console.log('Style changed:', descriptionStyle);
  //   // Perform actions on style change
  // }, [descriptionStyle]);

  const handleStyleChange = (event) => {
    setDescriptionStyle(event.target.value);
    updateModel(event.target.value)
  };

  return (
    <div>
      {loading ? (
        <p>Loading styles...</p>
      ) : (
        <select value={descriptionStyle} onChange={handleStyleChange}>
          {styles.map((style, index) => (
            <option key={index} value={style} selected={index === 0}>
              {style}
            </option>
          ))}
        </select>
      )}
      <p>Selected Model: {descriptionStyle} {(descriptionStyle=='proplexity'?" (Search enabled)":"")}</p>
    </div>
  );
}

export default ModelSelector;