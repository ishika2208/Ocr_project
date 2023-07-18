import React, { useEffect, useRef, useState } from 'react';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Draggable from 'react-draggable';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './photoeditor.css';
import sampleImage from './testimage.jpg';
import jsPDF from 'jspdf';

const PhotoEditor = () => {
  const editorRef = useRef(null);
  const [selectedFormat, setSelectedFormat] = useState('jpg');
  const [textboxes, setTextboxes] = useState([]);

  useEffect(() => {
    let imageEditor = null;

    imageEditor = new ImageEditor(editorRef.current, {
      includeUI: {
        loadImage: {
          path: sampleImage,
          name: 'SampleImage',
        },
        theme: {
          // Add your desired theme options here
        },
        menu: ['draw', 'text', 'crop', 'rotate', 'flip', 'filter'],
        initMenu: 'filter',
        uiSize: {
          width: '98%',
          height: 'calc(100vh - 98px)',
        },
        menuBarPosition: 'bottom',
      },
    });

    editorRef.current.imageEditor = imageEditor;

    return () => {
      if (imageEditor) {
        imageEditor.destroy();
      }
    };
  }, []);

  const handleSave = () => {
    const imageEditor = editorRef.current.imageEditor;
    const selectedValue = selectedFormat.toLowerCase();

    if (selectedValue === 'pdf') {
      const canvas = imageEditor?.toCanvas(); // Retrieve the edited image as canvas

      if (!canvas) {
        console.error('Canvas is not available');
        return;
      }

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width, canvas.height);
      pdf.save(`edited_image.${selectedValue}`);
    } else {
      const dataURL = imageEditor?.toDataURL({ format: selectedValue });

      if (!dataURL) {
        console.error('Data URL is not available');
        return;
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = dataURL;
      downloadLink.download = `edited_image.${selectedValue}`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handleShare = () => {
    console.log('Share button clicked');
  };

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleTextboxDrag = (index, delta) => {
    setTextboxes((prevTextboxes) => {
      const updatedTextboxes = [...prevTextboxes];
      updatedTextboxes[index].left += delta.x;
      updatedTextboxes[index].top += delta.y;
      return updatedTextboxes;
    });
  };

  const handleTextboxResize = (index, size) => {
    setTextboxes((prevTextboxes) => {
      const updatedTextboxes = [...prevTextboxes];
      updatedTextboxes[index].width = size.width;
      updatedTextboxes[index].height = size.height;
      return updatedTextboxes;
    });
  };

  const handleAddTextbox = () => {
    setTextboxes((prevTextboxes) => [
      ...prevTextboxes,
      {
        top: 100,
        left: 100,
        width: 200,
        height: 100,
      },
    ]);
  };

  return (
    <div className="photo-editor">
      <div className="canvas" ref={editorRef}></div>
      <div className="text-container">
        {textboxes.map((textbox, index) => (
          <Draggable
            key={index}
            bounds="parent"
            position={{ x: textbox.left, y: textbox.top }}
            onDrag={(e, { deltaX, deltaY }) => handleTextboxDrag(index, { x: deltaX, y: deltaY })}
          >
            <ResizableBox
              width={textbox.width}
              height={textbox.height}
              minConstraints={[50, 50]}
              onResize={(e, { size }) => handleTextboxResize(index, size)}
            >
              <div className="draggable-textbox">
                <div className="textarea-container">
                  <textarea className="textbox-input" />
                </div>
              </div>
            </ResizableBox>
          </Draggable>
        ))}
      </div>
      <div className="button-container">
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="success" onClick={handleShare}>
          Share
        </Button>
        <Form.Group>
          <Form.Label>Select Format:</Form.Label>
          <Form.Control as="select" value={selectedFormat} onChange={handleFormatChange}>
            <option value="jpg">JPG</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="pdf">PDF</option>
          </Form.Control>
        </Form.Group>
      </div>
    </div>
  );
};

export default PhotoEditor;
