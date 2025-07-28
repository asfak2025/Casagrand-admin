
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";


const SECRET_KEY=import.meta.env.VITE_ENC_SCERET_KEY


type HandleErrorFn = () => void;

// Logout Hook
export const useLogOut = (): (() => void) => {

const navigate=useNavigate();
  const logOut = () => {
    localStorage.clear();
    navigate("/login");
  };

  return logOut;
};

// Encrypt Data
export const encryptData = (data: any, handleError?: HandleErrorFn): string | null => {
  try {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
  } catch (error) {
    if (handleError) handleError();
    return null;
  }
};

// Decrypt Data
export const decryptData = (cipherText: string, handleError?: HandleErrorFn): any | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    if (handleError) handleError();
    return null;
  }
};

// Only exclude "token"
const excludeKeys = ["token"];

// Save to localStorage
export const saveToLocalStorage = (key: string, value: any, handleError?: HandleErrorFn): void => {
  if (excludeKeys.includes(key)) {
    // localStorage.setItem(key, value);
  } else {
    const encryptedData = encryptData(value, handleError);
    if (encryptedData) {
      // localStorage.setItem(key, encryptedData);
    }
  }
};

// Get from localStorage
export const getFromLocalStorage = (key: string, handleError?: HandleErrorFn): any | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(key);
    if (stored) {
      if (excludeKeys.includes(key)) {
        return stored;
      } else {
        return decryptData(stored, handleError);
      }
    }
  }
  return null;
};
