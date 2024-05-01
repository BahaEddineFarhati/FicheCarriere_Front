import React , {useState} from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./HomePage";
import Login from "./Login/Login";
import Profil from "./Profil/Profil";
import Historique from "./admin/historique"
import Comptes from "./admin/comptes"
import Info from "./admin/informations"
import Dashboard from "./admin/dashboard"
import { ProfileContext } from './userContext';

function App() {

  const [userData, setUserData] = useState(null);

  const handleSetUserData = (newData) => {
    setUserData(newData);
  };


  return (
    <ProfileContext.Provider value={{ userData, setUserData: handleSetUserData }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage onSetUserData={handleSetUserData} />} />
          <Route path="/profile/:id" element={<Profil />} />
          <Route path="/admin/historique" element={<Historique />} />
          <Route path="/admin/comptes" element={<Comptes />} />
          <Route path="/admin/informations" element={<Info />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ProfileContext.Provider>
  );
}

export default App
