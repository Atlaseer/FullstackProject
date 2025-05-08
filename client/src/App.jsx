import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Footer from './Components/Footer'
import FourOFourPage from './Pages/FourOFour'
import HomePage from './Pages/HomePage'
import CreatePostPage from './Pages/CreatePagePost'
import ViewPostPage from './Pages/ViewPostPage'


function App() {

  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/create" element={<CreatePostPage/>} />
        <Route path="/post/:id" element={<ViewPostPage/>} />
        <Route path="*" element={<FourOFourPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
