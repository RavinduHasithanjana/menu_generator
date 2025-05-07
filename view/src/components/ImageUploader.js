import React, { useState } from 'react';

function getApiUrl(url, port1, port2, endpoint='gen') {
  const baseUrl = url.split(`:${port1}`)[0];
  return `${baseUrl}:${port2}/${endpoint}`;
}

// {
//   "dishNameAlternatives": ["Fruity Jelly Salad", "Fruit Cocktail Dessert", "Mixed Fruit Pudding", "Refreshment Dessert"],
//   "ingredients": ["Tapioca pearls", "Fruit pieces (like mango, melon)", "Jelly cubes", "Cherries"],
//   "menu_category": "Dessert",
//   "shortNameAlternatives": ["Fruit Jelly", "Jelly Salad", "Fruit Mix", "Chilled Dessert"]
// }


const apiImageUpload = getApiUrl(window.location.href, 3006, 3005,
  'api/upload-image')
const apiImagePreview = getApiUrl(window.location.href, 3006, 3005,
  'image/')
const apiImageRecognition = getApiUrl(window.location.href, 3006, 3005,
    'image_recognition/')
  

  

function ImageUploader({ setDishName, generateDish }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState({});

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setImage(file);
    handleUpload(file);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    handleUpload(event.target.files[0]);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch(apiImageUpload, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.json();
      console.log(data);
      setPreview(apiImagePreview+''+data.id);
      try{
        const response2 = await fetch(apiImageRecognition+''+data.id, { // || 'http://localhost:3001/gen', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          //body: JSON.stringify({ dishName }),
        });
        console.log(response2)
        const data2 = await response2.json();
        
        setResult(data2);
      }catch(e){
        setResult({});
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        padding: '20px',
        borderRadius: '5px',
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >

      <label htmlFor="image-input">
        <input
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
          id="image-input"
        />
        <span>Drag & Drop or Click to Upload Dish Image</span>
      </label>
      {uploading && <p>Uploading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {preview && (
        <img src={preview} alt="Uploaded Image" style={{ width: '20%', margin: '20px 40%' }} />
      )}
      {/* ImageUploader content */}
           {result && result.modelAnswer && typeof(result.modelAnswer) !="string" && result.modelAnswer.dishNameAlternatives && (
        <div>
          <h2>Dish Name Alternatives:</h2>
          {result.modelAnswer.dishNameAlternatives.map((alternative, index) => (
            <button key={index} 
                    data-alternative={alternative}
                    onClick={
                      (event) => {
                        const alternative = event.target.dataset.alternative;
                        setDishName(alternative) //alternative)
                        generateDish(alternative)
                      }
                    } 
                    className="generate-button">{alternative}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;