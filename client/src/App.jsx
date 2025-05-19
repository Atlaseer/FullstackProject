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
import LoadingPage from './Pages/LoadingPage'
import { useAuth } from './contexts/AuthContext'
import BannedPage from './Pages/BannedPage'

import LoginPage from './Pages/LoginPage'
import AdminPage from './Pages/AdminPage'
import Profile from './Pages/Profile'
import AnnouncementsPage from './Pages/AnnouncementsPage'
import RegisterPage from './Pages/RegisterPage'
import AboutPage from './Pages/AboutPage'

function App() {

  const { loading, isActive, user } = useAuth()

  if (loading) {
    return <LoadingPage/>
  }

  if (!isActive && user) 
  {
  return (
      <>
        <BannedPage />
      </>
    
    )
  }

  return (
    <BrowserRouter>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:username" element={<Profile/>} />
        <Route path="/newpost" element={<CreatePostPage/>} />
        <Route path="/post/:id" element={<ViewPostPage/>} />
        <Route path="/admin" element={<AdminPage/>} />
        <Route path="*" element={<FourOFourPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path='/signup' element={<RegisterPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <Footer/>
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
