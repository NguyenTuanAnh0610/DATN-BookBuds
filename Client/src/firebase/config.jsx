import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB9GtjEuhtUfoi-gWm6GiraORCEBvnbzD4",
  authDomain: "datn-wd24.firebaseapp.com",
  databaseURL: "https://datn-wd24-default-rtdb.firebaseio.com",
  projectId: "datn-wd24",
  storageBucket: "datn-wd24.firebasestorage.app",
  messagingSenderId: "387485088473",
  appId: "1:387485088473:web:bb3a3d0476d8ee901c1cc8"
};
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app); 