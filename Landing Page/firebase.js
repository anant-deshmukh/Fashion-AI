// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyARv1Q7mkliTzcvCdJfaAnnCbfLKq6AXP8",
    authDomain: "fashion-ai-e2bdc.firebaseapp.com",
    databaseURL: "https://fashion-ai-e2bdc-default-rtdb.firebaseio.com",
    projectId: "fashion-ai-e2bdc",
    storageBucket: "fashion-ai-e2bdc.appspot.com",
    messagingSenderId: "107038306477",
    appId: "1:107038306477:web:0e412936a42a62c1c79624",
    measurementId: "G-ZPBB5WGV5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
