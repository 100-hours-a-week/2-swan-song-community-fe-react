import React, { createContext, useContext, useState } from 'react';
import userDefaultProfile from '../assets/user_default_profile.svg';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState(userDefaultProfile);

  const updateAuthState = (status, image = userDefaultProfile) => {
    setIsLoggedIn(status);
    setProfileImage(image);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, profileImage, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
