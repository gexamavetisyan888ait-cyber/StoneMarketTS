import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Սա անհրաժեշտ է Storage-ի համար

// Քո Firebase կոնֆիգուրացիան
const firebaseConfig = {
  apiKey: "AIzaSyDGCOksd0BiEQgOhXUXTdgrxz55NJxm0mI",
  authDomain: "stonemarket-7f764.firebaseapp.com",
  databaseURL: "https://stonemarket-7f764-default-rtdb.firebaseio.com",
  projectId: "stonemarket-7f764",
  storageBucket: "stonemarket-7f764.firebasestorage.app",
  messagingSenderId: "544977633052",
  appId: "1:544977633052:web:ccc76b682eed8563b8c4d9",
  measurementId: "G-BGKF4XMEXC"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export-ներ, որոնք օգտագործվում են Components-ների մեջ
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
export const storage = getStorage(app); // Այս տողն էր պակասում քո Build-ի համար

export default app;