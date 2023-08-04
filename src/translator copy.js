import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

const CanvasWithText = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 200
    });

    // Add text to the canvas
    const text1 = new fabric.Text('Hello, Fabric.js!', {
      left: 100,
      top: 100,
      fontSize: 30,
      fill: 'red',
    });

    canvas.add(text1);
    
  }, []);

  return <canvas ref={canvasRef} />;
};

export default CanvasWithText;
