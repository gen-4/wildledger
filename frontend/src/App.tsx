import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import type { RootState } from '@/store';

import { Login, Register } from '@/components/auth';
import { Home } from '@/components/home';

function App() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
