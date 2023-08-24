import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import './index.css'
import axios from 'axios';
    
const Translator = () => {

  const canvasRef = useRef(null);

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

    let formdata = { output_lang: selectedLanguage, image: selectedImage };
    try {
          const response = await axios.post("http://localhost:4343/image_inpainting", formdata, {
            headers: { "Content-Type": "multipart/form-data" }
          });

          if (response.status === 200) {
              setblankImageUrl(response.data.result.file_path);
              var divElement = document.getElementById("loader_text");
              divElement.innerHTML = "Image translation & text layout in-process....";
            
              const convertedUrl = response.data.result.file_path.replace('/blank/', '/');
             
              let trans_formdata = { output_lang: selectedLanguage, input_image: 'https://pbs.twimg.com/media/FxWZkWcX0AMfPdv.jpg:large' };

              try {
                    const trans_response = await axios.post("http://localhost:4343/image_transformation", trans_formdata, {
                      headers: { "Content-Type": "multipart/form-data" }
                    });

                    if (trans_response.status === 200) {

                        divElement.innerHTML = "Image Inpainting in-process....";
                        
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
                    
                          const canvas = new fabric.Canvas(canvasRef.current, {
                            width: width,
                            height: height,
                          });
                      
                          // Add background image
                          fabric.Image.fromURL(imageUrl, (img) => {
                            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                              scaleX: canvas.width / img.width,
                              scaleY: canvas.height / img.height,
                            });
                          });
                    
                          // Create the polygon
                          trans_response.data.result.translated_text.forEach((item) => {
                           
                            const polygon = [
                                item.polygon[0],
                                item.polygon[1],
                                item.polygon[2],
                                item.polygon[3],
                                item.polygon[4],
                                item.polygon[5],
                                item.polygon[6],
                                item.polygon[7]
                            ];
                    
                            const text = item.content;
                            const font = (parseInt(item.polygon[7]) - parseInt(item.polygon[1]))-5;
                            const color = item?.color ? item?.color : 'black';
                            const fontWeight = item?.fontWeight ? item?.fontWeight : 'normal';
                            const fontFamily = item?.similarFontFamily ? item?.similarFontFamily : 'Arial, Helvetica, sans-serif';
                            const textBackgroundColor = item?.backgroundColor ? item?.backgroundColor : '';
                           
                            // Calculate the center of the polygon
                            const centerX = (polygon[0] + polygon[4]) / 2;
                            const centerY = (polygon[1] + polygon[5]) / 2;
                        
                            // Set the font size and color
                            const textObj = new fabric.Text(text, {
                                left: centerX,
                                top: centerY,
                                fontSize: font,
                                fontWeight: fontWeight,
                                fontFamily: fontFamily,
                                // textBackgroundColor: textBackgroundColor1,
                                fill: color,
                                originX: 'center',
                                originY: 'center',
                            });
                        
                            // Calculate the rotation angle based on the slope of the polygon sides
                            const angleRadians = Math.atan2(polygon[5] - polygon[1], polygon[4] - polygon[0]);
                          
                            if(angleRadians < 1)
                            {
                                textObj.set('angle', 0 * (180 / Math.PI));
                            }
                            else
                            {
                                textObj.set('angle', angleRadians * (180 / Math.PI));
                            }
                        
                            canvas.add(textObj);
                    
                          });

                          // canvas.on('mouse:down', (event) => {
                          //   if (event.target) {
                          //     canvas.setActiveObject(event.target);
                          //   } else {
                          //     canvas.discardActiveObject().renderAll();
                          //   }
                          // });

                          // const colorInput = document.getElementById('color');

                          // colorInput.addEventListener('input', () => {
                          //   const activeObject = canvas.getActiveObject();
                          //   if (activeObject) {
                          //     activeObject.set('fill', colorInput.value);
                          //     canvas.renderAll();
                          //   }
                          // });
                                          
                        };
                        img.src = imageUrl;
                    
                    } else {
                      alert("Not Done");
                    }
              } catch (error) {
                  // Handle errors if any
                  console.log(error);
              } finally {
                setLoading(false); // Hide the loader on success or error
              }

          } else {
            alert("Not Done");
          }
    } catch (error) {
        // Handle errors if any
        console.error(error);
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
          <option value="as">Assamese</option>
          <option value="bn">Bengali</option>
          <option value="gu">Gujarati</option> 
          <option value ="hi">Hindi</option>
          <option value ="kn">Kannada</option>
          <option value ="ml">Malayalam</option>
          <option value ="mr">Marathi</option>
          <option value ="or">Odia</option>
          <option value ="pa">Punjabi</option>
          <option value ="ta">Tamil</option>
          <option value ="te">Telugu</option>
          <option value ="ur">Urdu</option>
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
        {/* <label htmlFor="color">Text Color:</label>
      <input type="color" id="color" defaultValue="#000000" /> */}

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
        <>
        <div className='mainLoader'>
          <div className='maxheight'>
        <div className='loader'></div>
        <div id="loader_text"
          style={{
            fontSize:'45px',           
            color: '#fff',
            padding: '10px',
            borderRadius: '5px',
            zIndex: '9999',
            display: 'block', // Show the loader when 'loading' is true
          }}
          className="overlay"
        >
          Image Inpainting in-process....
        </div>
        </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Translator;
