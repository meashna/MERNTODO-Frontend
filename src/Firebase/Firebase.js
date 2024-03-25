import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
//import { getAnalytics, logEvent } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCxfU2lEhBhIKqRB6PaKHJBPiZ5P6a6AGQ",
  authDomain: "mern-todo-frontend.firebaseapp.com",
  projectId: "mern-todo-frontend",
  storageBucket: "mern-todo-frontend.appspot.com",
  messagingSenderId: "881213699753",
  appId: "1:881213699753:web:aedbb28920bc39f4e09bb8",
  measurementId: "G-FH5WKSN1EN",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
