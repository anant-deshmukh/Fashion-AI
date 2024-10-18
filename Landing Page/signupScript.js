
import { database } from "./firebase.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// // Handle registration form submission
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from submitting normally

    const newPassword = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const email = document.getElementById('email').value;
    const newUsername = document.getElementById('username').value;
    const registerMessage = document.getElementById('message');

    //validate password and confirm password
    if (newPassword !== confirmPassword) {
        registerMessage.textContent = "Passwords do not match.";
    }
    else if (newPassword.length < 8) {
        registerMessage.textContent = "Password must be at least 8 characters long.";
        }
        else {
            registerMessage.textContent = "Signup successful!";
            registerMessage.style.color = "green";

            // You can add logic here to handle signup (like sending data to a server).
            try {
                await set(ref(database, 'users/' + newUsername), {
                    password: newPassword,
                    Email: email
                });
                registerMessage.textContent = 'User registered successfully!';
            } catch (error) {
                console.error(error);
                registerMessage.textContent = 'Error registering user. Please try again.';
            }
        }
});
