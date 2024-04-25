"use client"
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/router';
import { ACCESS_TOKEN_KEY } from "../constants/storage-key-const";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
      setUser(jwtDecode(localStorage.getItem(ACCESS_TOKEN_KEY)));
    }
    setIsSSR(false);
  }, []);
 
  const router = useRouter();
 
  const login = async (payload) => {
    const apiResponse = await axios.post(
      "http://localhost:3000/login",
      payload
    );
    localStorage.setItem(ACCESS_TOKEN_KEY,  JSON.stringify(apiResponse.data));
    setUser(jwt_decode(apiResponse.data.access_token));
    router.push('/login');
  };
  
  return (
    <AuthContext.Provider value={{ user, login, isSSR }}>
      {children}
    </AuthContext.Provider>
  );
};
 
export default AuthContext;