import React, { useState, useEffect } from 'react';
import axios from 'axios';

function getApiUrl(url, port1, port2, endpoint='gen') {
  const baseUrl = url.split(`:${port1}`)[0];
  return `${baseUrl}:${port2}/${endpoint}`;
}

const apiGetInfoUrl= getApiUrl(window.location.href, 3006, 3005,
  'get_info')


function StyleSelector({ updateStyle }) {
  const [styles, setStyles] = useState([]);
  const [descriptionStyle, setDescriptionStyle] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch styles only once on mount
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const response = await axios.get(apiGetInfoUrl);
        setStyles(response.data.styleList);
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
    updateStyle(event.target.value)
  };

  return (
    <div>
      {loading ? (
        <p>Loading styles...</p>
      ) : (
        <select value={descriptionStyle} onChange={handleStyleChange}>
          <option value="">Select Style</option>
          {styles.map((style, index) => (
            <option key={index} value={style}>
              {style}
            </option>
          ))}
        </select>
      )}
      <p>Selected Style: {descriptionStyle}</p>
    </div>
  );
}

export default StyleSelector;