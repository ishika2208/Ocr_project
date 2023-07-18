import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PhotoEditor from "./photoeditor";
import Translator from "./translator";


function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route   path="/"  element ={<Translator />}  / >
    <Route   path="edi"  element ={<PhotoEditor />}  / >
    </Routes>
    </BrowserRouter>

  );
}

export default App;
