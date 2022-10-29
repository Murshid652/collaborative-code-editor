import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <div className="App">
      <div>
        <Toaster position="top-right" 
        toastOptions={{ success: { theme: { primary: "red", }, }, }}
        >
        </Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/editor/:RoomId" element={<EditorPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
