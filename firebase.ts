import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

console.log("KEY", process.env["FIREBASE_API_KEY"]);

const cfg = {
  apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"],
  authDomain: process.env["NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"],
  projectId: process.env["NEXT_PUBLIC_FIREBASE_PROJECT_ID"],
  storageBucket: process.env["NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: process.env["NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"],
  appId: process.env["NEXT_PUBLIC_FIREBASE_APP_ID"],
};

const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
export const auth = app.auth();
export const db = app.firestore();
export default app;
