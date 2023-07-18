import React, { useState } from 'react';

import './index.css'
import axios from 'axios';

const Translator = () => {
  const [selectedImage, setSelectedImage] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [imageData, setImageData] = useState();
  // const [imagePath, setImagePath] = useState();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file, 'file');
    setSelectedImage(file);
  };

  const handleImageUrlChange = (event) => {
    const url = event.target.value;
    setImageUrl(url);
  };

  const handleLanguageChange = (event) => {
    const language = event.target.value;
    setSelectedLanguage(language);
  };

  const translateImage = async() => {
    let formdata = {lang:selectedLanguage, file:selectedImage};
    await axios.post("http://127.0.0.1:5000/final-image", formdata,{
    headers: {"Content-Type" : "multipart/form-data"} 
  })
    .then(function(res) {
      if(res.status === 200) {
      // let blob = new Blob([res.data], {type:"image/jpeg"})
      // let url = URL.createObjectURL(blob);
      // console.log(blob)
      // console.log(url)
      // console.log(res)
      setImageData(res.data)
      } else {
        alert("Not Done")
      }
    })
  };

  console.log(typeof imageData, 'sdfdf');
  return (
    <div>
      <h1>Translator App</h1>

      <div className="option-container">
        <div>
          <h2>Choose Image</h2>
          <input type="file" name='file' onChange={(event)=>handleImageChange(event)} accept='img/*' />
        </div>

        <div>
          <h2>Enter Image URL</h2>
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={handleImageUrlChange}
          />
        </div>

     <div>
          <h2>Select Language</h2>
          <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="">Select</option>
          <option value="Arabic">Arabic</option>
          <option value="Bengali">Bengali</option>
          <option value="Dutch">Dutch</option>
          <option value="en">English</option>
          <option value="gu">Gujarati</option>
          <option value ="hi">Hindi</option>
          <option value="Hebrew">Hebrew</option>
          <option value="Japanese">Japanese</option>
          <option value="Kannada">Kannada</option>
          <option value="Korean">Korean</option>
          <option value="Malay">Malay</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Marathi">Marathi</option>
          <option value="Nepali">Nepali</option>
          <option value="Persian">Persian</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Russian">Russian</option>
          <option value="Spanish">Spanish</option>
          <option value="Swedish">Swedish</option>
          <option value="Thai">Thai</option>
          <option value="Turkish">Turkish</option>
          <option value="Urdu">Urdu</option>
          <option value="Vietnamese">Vietnamese</option>
          </select>
        </div>
      </div>

      <button onClick={()=> translateImage()}>Translate</button>

      <div className="image-container">
        <div>
          <h2>Original Image</h2>
          {selectedImage && (
            <img src={URL.createObjectURL(selectedImage)} />
          )}
          {imageUrl && <img src={imageUrl} alt="Original" />}
        </div>

        <div>
          
          <h2>Translated Image</h2>
         
          {/* Display translated image here */}
          {/* You can replace the placeholder image with the actual translated image */}
          <div className="translated-image">
            {imageData?<>
              <img
              src={imageData}
              alt="Translated"
            />
            </>:<></>}
            
            <button  type="button">  <a href='edi'> Edit</a></button>
            
           
            <button type="button"> Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
