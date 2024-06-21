import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import { NavBar } from "./components/NavBar";
import { Route, Routes, Navigate } from "react-router-dom";
import { GamePage } from "./components/GamePage";
import { HomePage } from "./components/HomePage";
import { LoginPage } from "./components/LoginPage";
import { useEffect, useState } from "react";
import { login, getUserInfo, logout } from "./API";
import { ProfilePage } from "./components/ProfilePage";
import { GameSummaryPage } from "./components/GameSummaryPage";

function App() {

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getUserInfo().then(user => {
      setUser(user);
      setIsLoggedIn(true);
    }).catch(() => {
      if(isLoggedIn)
        // TO DO: Handle error
      setUser(null);
      setIsLoggedIn(false);
    });
  },[])

  const handleLogin = async (credentials) => {
    const user = await login(credentials);
    setUser(user);
    setIsLoggedIn(true);
  }

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsLoggedIn(false);
  }

  return (
    <div className="app-container">
      <NavBar isLoggedIn={isLoggedIn} logout={handleLogout}/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage isLoggedIn={isLoggedIn}/>} />
        <Route path="/login" element={<LoginPage login={handleLogin}/>} />
        <Route path="/profile" element={!isLoggedIn ? <Navigate replace to="/login"/> : <ProfilePage user={user}/>}/>
        <Route path="games/:gameId" element={!isLoggedIn ? <Navigate replace to="/login"/> : <GameSummaryPage/>} />
        {/* TO DO Add 404 page not found */}
      </Routes>
    </div>
  );
}

export default App;
