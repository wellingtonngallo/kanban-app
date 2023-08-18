import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAkXqkSjwI57UMRUSSKadxobbI2fSvEaVE",
  authDomain: "kanban-app-5a82a.firebaseapp.com",
  databaseURL: "https://kanban-app-5a82a-default-rtdb.firebaseio.com",
  projectId: "kanban-app-5a82a",
  storageBucket: "kanban-app-5a82a.appspot.com",
  messagingSenderId: "547067480345",
  appId: "1:547067480345:web:484abf107baaaa52675d88",
  measurementId: "G-2WZXH3CZVN",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
