import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import './index.css'
import axios from 'axios';

// // Function to calculate the center point of the polygon
// function calculateCenterPoint(polygon) {
//     let centerX = 0;
//     let centerY = 0;

//     for (let i = 0; i < polygon.length; i += 2) {
//       centerX += polygon[i];
//       centerY += polygon[i + 1];
//     }

//     centerX /= polygon.length / 2;
//     centerY /= polygon.length / 2;

//     return { x: centerX, y: centerY };
// }
    
// // Updated createTextObject function with polygon coordinates
// function createTextObject(canvas, polygon, text, font, color, bend) {
//     if (bend === 0) {
//       // Normal straight text
//       const centerPoint = calculateCenterPoint(polygon);
//       const textObj = new fabric.Text(text, {
//         left: centerPoint.x,
//         top: centerPoint.y,
//         fill: color,
//         fontSize: parseInt(font, 10),
//       });
//       canvas.add(textObj);
//     } else {
//       // Curved text using path object
//       // (You need to provide the correct curve path coordinates)
//       const path = new fabric.Path('M 0 0 Q 80 100 100 0', {
//         left: 0,
//         top: 0,
//         stroke: 'transparent',
//         fill: 'transparent',
//       });

//       const textObj = new fabric.Text(text, {
//         fontFamily: 'Arial',
//         fontSize: parseInt(font, 10),
//         textAlign: 'center',
//         stroke: color,
//         strokeWidth: 1,
//         path: path,
//       });

//       canvas.add(textObj);
//       canvas.add(path);
//     }
// }

// function drawTextOnCanvas(canvas, text, polygon, fontSize, color, backgroundImageUrl) {
//   //const canvas = document.getElementById(canvasId);
//   const ctx = canvas.getContext('2d');

//   // Draw the background image
//   const backgroundImage = new Image();
//   backgroundImage.src = backgroundImageUrl;
//   backgroundImage.onload = () => {
//     ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

//     // Set the font size and color
//     ctx.font = `${fontSize}px Arial`;
//     ctx.fillStyle = color;

//     // Draw the polygon
//     ctx.beginPath();
//     ctx.moveTo(polygon[0], polygon[1]);
//     for (let i = 2; i < polygon.length; i += 2) {
//       ctx.lineTo(polygon[i], polygon[i + 1]);
//     }
//     ctx.closePath();
//     ctx.stroke();

//     // Calculate the center of the polygon
//     const centerX = polygon.reduce((sum, val, index) => (index % 2 === 0 ? sum + val : sum), 0) / (polygon.length / 2);
//     const centerY = polygon.reduce((sum, val, index) => (index % 2 === 1 ? sum + val : sum), 0) / (polygon.length / 2);

//     // Draw the text at the center of the polygon
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(text, centerX, centerY);
//   };
// }
    
const Translator = () => {

  const canvasRef = useRef(null);

  useEffect(() => {

    const imageUrl = 'https://www.htmlgoodies.com/wp-content/uploads/2021/04/rotate.png';

    const img = new Image();
    img.onload = function() {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
    
      const canvas = new fabric.Canvas(canvasRef.current, {
        width: width,
        height: height,
      });
  
      // Add background image
      fabric.Image.fromURL('https://www.htmlgoodies.com/wp-content/uploads/2021/04/rotate.png', (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
      });

      // Create the polygon

      // const polygon1 = [52,
      //   37,
      //   208,
      //   127,
      //   192,
      //   154,
      //   36,
      //   64];
      // const text1 = 'Rotated text';
      // const font1 = '70';
      // const color1 = 'red';
      // const bend1 = 0;
  
      // createTextObject(canvas, polygon1, text1, font1, color1, bend1);
    
      // Background image URL
    // const backgroundImageUrl = 'https://www.htmlgoodies.com/wp-content/uploads/2021/04/rotate.png';

    // // Draw text on canvas with the background image and provided polygon coordinates and properties
    // drawTextOnCanvas(canvas, text1, polygon1, font1, color1, backgroundImageUrl);

      // Polygon coordinates
      const polygonCoords = [52, 37, 208, 127, 192, 154, 36, 64];
      // Text properties
      const text = 'Rotated text';
      const fontSize = (64-37);
      const color = 'red';
  
      // Calculate the center of the polygon
      const centerX = (polygonCoords[0] + polygonCoords[4]) / 2;
      const centerY = (polygonCoords[1] + polygonCoords[5]) / 2;
  
      // Set the font size and color
      const textObj = new fabric.Text(text, {
        left: centerX,
        top: centerY,
        fontSize: fontSize,
        fill: color,
        originX: 'center', // Set the origin to the center of the text
        originY: 'center',
      });
  
      // Calculate the rotation angle based on the slope of the polygon sides
      const angleRadians = Math.atan2(polygonCoords[5] - polygonCoords[1], polygonCoords[4] - polygonCoords[0]);
  
      // Rotate the text
      textObj.set('angle', angleRadians * (180 / Math.PI)); // Convert radians to degrees
  
      canvas.add(textObj);

    };
    img.src = imageUrl;
   
  }, []);

  const buttonStyle = {
    width: '200px', // Set the desired width here
  };
  
  const [selectedImage, setSelectedImage] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [imageData, setImageData] = useState();
  // const [imagePath, setImagePath] = useState();
  const [blankImageUrl, setblankImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
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

  const translateImage = async () => {
    setLoading(true); // Show the loader when axios call is initiated

    let formdata = { input_lang: 'en', output_lang: selectedLanguage, image: selectedImage };
    try {
      const response = await axios.post("http://localhost:4545/upload", formdata, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.status === 200) {
        setblankImageUrl(response.data.result.file_path);

        const imageUrl = response.data.result.file_path;

        const img = new Image();
        img.onload = function() {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
        
          // JavaScript
          const myElement = document.getElementById('canvas_div');
          myElement.style.height = height+'px'; // Set height dynamically
          myElement.style.width = width+'px'; // Set width dynamically
          myElement.style.border = '1px solid #ccc';
      
          console.log('Image Width:', width);
          console.log('Image Height:', height);
    
          const canvas = new fabric.Canvas(canvasRef.current, {
            width: width,
            height: height,
          });
      
          // Add background image
          fabric.Image.fromURL(response.data.result.file_path, (img) => {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
              scaleX: canvas.width / img.width,
              scaleY: canvas.height / img.height,
            });
          });

          // Create the polygon
          response.data.result.translated_text.forEach((item, index) => {
            const polygon1 = [
              response.data.result.translated_text[index].polygon[0].x,
              response.data.result.translated_text[index].polygon[0].y,
              response.data.result.translated_text[index].polygon[1].x,
              response.data.result.translated_text[index].polygon[1].y,
              response.data.result.translated_text[index].polygon[2].x,
              response.data.result.translated_text[index].polygon[2].y,
              response.data.result.translated_text[index].polygon[3].x,
              response.data.result.translated_text[index].polygon[3].y
            ];
            const text1 = item.content;
            const font1 = '20';
            const color1 = 'red';
            const bend1 = 0;
        
            // createTextObject(canvas, polygon1, text1, font1, color1, bend1);

          });
    
        };
        img.src = imageUrl;
  

      } else {
        alert("Not Done");
      }
    } catch (error) {
      // Handle errors if any
      console.error(error);
    } finally {
      setLoading(false); // Hide the loader on success or error
    }
  };

  return (
    <div>
      <h1>Translator App</h1>

      <div className="option-container">
        <div>
          <h2>Choose Image</h2>
          <input type="file" name='file' onChange={(event)=>handleImageChange(event)} accept='img/*' />
        </div>

        {/* <div>
          <h2>Enter Image URL</h2>
          <input
            type="text"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={handleImageUrlChange}
          />
        </div> */}

     <div>
          <h2>Select Language</h2>
          <select value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="">Select</option>
          {/* <option value="Arabic">Arabic</option>
          <option value="Bengali">Bengali</option>
          <option value="Dutch">Dutch</option>
          <option value="en">English</option>
          <option value="gu">Gujarati</option> */}
          <option value ="hi">Hindi</option>
          {/* <option value="Hebrew">Hebrew</option>
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
          <option value="Vietnamese">Vietnamese</option> */}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" style={buttonStyle} onClick={()=> translateImage()}>Translate</button>

      <div className="image-container">
        <div className="minWidth">
        <h2  style={{ display: 'block'}}>Original Image</h2>
        <div style={{ border: '1px solid #ccc', height: '200px', width: '100%' }}>
          {selectedImage && (
            <img src={URL.createObjectURL(selectedImage)} />
          )}
          {imageUrl && <img src={imageUrl} alt="Original" id="OriginalImg" />}
        </div>
        </div>

        <div className='minWidth'>
        <h2>Blank Image</h2>
        <div style={{ border: '1px solid #ccc', height: '200px', width: '100%'  }}>
          {blankImageUrl && <img src={blankImageUrl} alt="Original" />}
        </div>
        </div>

        <div>
        <div style={{width:"75%"}}>
        <h2>Canvas Text</h2>
          <div id="canvas_div">
              <canvas ref={canvasRef} />
          </div>
        </div>
          
        </div>

        {/* <div>
          
          <h2>Translated Image</h2>
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
        </div> */}
      </div>
      {/* Loader */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '9999',
            display: 'block', // Show the loader when 'loading' is true
          }}
          className="overlay"
        >
          Processing....
        </div>
      )}
    </div>
  );
};

export default Translator;
