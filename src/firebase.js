import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAkNrcAPf1OGBJdy4HY6onfZv407H-h5j8",
  authDomain: "expense-tracker-8c32e.firebaseapp.com",
  projectId: "expense-tracker-8c32e",
  storageBucket: "expense-tracker-8c32e.firebasestorage.app",
  messagingSenderId: "580572583929",
  appId: "1:580572583929:web:c45c902da3977cfcf8cf28"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
