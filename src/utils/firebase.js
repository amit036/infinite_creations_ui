import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAQDRcEIHqKjM2czC8EwqcMc6zCSb59WxQ",
    authDomain: "infinite-creations-76601.firebaseapp.com",
    projectId: "infinite-creations-76601",
    storageBucket: "infinite-creations-76601.firebasestorage.app",
    messagingSenderId: "52598230730",
    appId: "1:52598230730:web:786c4501b50c77b34c6e33",
    measurementId: "G-2TG7T4ELB9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
