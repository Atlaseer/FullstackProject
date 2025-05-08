document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("registerForm")) {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get("mode");

        if (mode === "login") {
            showLoginForm();
        } else {
            showRegisterForm();
        }
    }

    checkLoginStatus(); // ✅ Still runs on all pages
});

// ✅ Modify these functions to check if elements exist before accessing them
function showLoginForm() {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (!registerForm || !loginForm) return; // Prevent errors

    registerForm.style.display = "none";
    loginForm.style.display = "block";
    document.getElementById("formTitle").textContent = "Sign In";
    document.getElementById("toggleText").innerHTML = 
        `Don't have an account? <a href="#" id="toggleForm">Register</a>`;

    document.getElementById("toggleForm").addEventListener("click", toggleForm);
}

function showRegisterForm() {
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (!registerForm || !loginForm) return; // Prevent errors

    registerForm.style.display = "block";
    loginForm.style.display = "none";
    document.getElementById("formTitle").textContent = "Join Now";
    document.getElementById("toggleText").innerHTML = 
        `Already have an account? <a href="#" id="toggleForm">Sign in</a>`;

    document.getElementById("toggleForm").addEventListener("click", toggleForm);
}


// Toggle Between Forms
function toggleForm(event) {
    event.preventDefault();
    if (document.getElementById("registerForm").style.display === "none") {
        showRegisterForm();
    } else {
        showLoginForm();
    }
}

// Hash Function for Passwords (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


// ✅ Function to check if user is logged in and update UI
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const loginButton = document.querySelector(".login-button");
    const signupButton = document.querySelector(".signup-button");
    const logoutButton = document.querySelector(".logout-button");
    const userDisplay = document.querySelector(".user-display");

    if (currentUser) {
        if (userDisplay) {
            userDisplay.innerHTML = `LOGGED IN AS: <span>${currentUser.username.toUpperCase()}</span>`;
            userDisplay.style.display = "inline-block";
        }

        if (loginButton) loginButton.style.display = "none";
        if (signupButton) signupButton.style.display = "none";
        if (logoutButton) logoutButton.style.display = "inline-block";

        // ✅ Ensure correct post form is shown
        togglePostForm();

    } else {
        if (userDisplay) userDisplay.style.display = "none";
        if (loginButton) loginButton.style.display = "inline-block";
        if (signupButton) signupButton.style.display = "inline-block";
        if (logoutButton) logoutButton.style.display = "none";

        // ✅ Ensure correct post form is shown
        togglePostForm();
    }
}

// ✅ Function to toggle between guest & logged-in post form
function togglePostForm() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const guestForm = document.querySelector(".guest-form");
    const loggedInForm = document.querySelector(".logged-in-form");

    if (!guestForm || !loggedInForm) return; // ✅ Prevent errors if elements don't exist

    if (currentUser) {
        guestForm.style.display = "none";
        loggedInForm.style.display = "block";

        // ✅ Clear input values to avoid pre-filled data
        document.getElementById("postTitleLoggedIn").value = "";
        document.getElementById("postBodyLoggedIn").value = "";
        document.getElementById("postTagsLoggedIn").value = "";

    } else {
        guestForm.style.display = "block";
        loggedInForm.style.display = "none";
    }
}

// Logout Functionality
document.querySelector(".logout-button")?.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("You have been logged out.");
    window.location.reload();
});

// ✅ Ensure login status and post form are updated on page load
document.addEventListener("DOMContentLoaded", checkLoginStatus);
