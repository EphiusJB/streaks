import React from 'react'
import { useState, useEffect } from 'react'
import AuthComponent from './pages/auth'
import './App.css'
import { auth } from './firebase'
import { Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoadin] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoadin(false)
    });
    return () => unsubscribe()
  }, []);

  return (
    <Routes>
      <Route path='/auth' element={<AuthComponent auth={auth}/>} />
      <Route path='/' element={
        <RequireAuth>
          <Home auth={auth} user={user} logout={() => auth.signOut()} loading={loading}/>
        </RequireAuth>
      } />
    </Routes>
  )
}

export default App
