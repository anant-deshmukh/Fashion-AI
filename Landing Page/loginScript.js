// loginScript.js

import { database } from "../Database/firebase.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";


document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent default form submission

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessageElement = document.getElementById('loginMessage');

    // Fetch user data from the database
    const userRef = ref(database, 'users/' + username);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.password === password) {
            loginMessageElement.textContent = "Login successful!";
            loginMessageElement.style.color = "green";
            // Redirect to another page or do something after successful login
            window.location.href = "dashboard.html";
        } else {
            loginMessageElement.textContent = "Incorrect password.";
            loginMessageElement.style.color = "red";
        }
    } else {
        loginMessageElement.textContent = "User not found.";
        loginMessageElement.style.color = "red";
    }
});
