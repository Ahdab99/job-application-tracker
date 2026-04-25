window.API_BASE_URL = "http://localhost:8081/api/auth";
const TOKEN_KEY = "token";
const EMAIL_KEY = "email";
const AUTH_MESSAGE_KEY = "auth_message";

let messageTimeoutId = null;

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getEmail() {
    return localStorage.getItem(EMAIL_KEY);
}

function saveAuthData(token, email) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EMAIL_KEY, email);
}

function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
}

function setAuthMessage(message) {
    localStorage.setItem(AUTH_MESSAGE_KEY, message);
}

function consumeAuthMessage() {
    const message = localStorage.getItem(AUTH_MESSAGE_KEY);
    if (message) {
        localStorage.removeItem(AUTH_MESSAGE_KEY);
    }
    return message;
}

function redirectToLogin(message = "") {
    if (message) {
        setAuthMessage(message);
    }
    window.location.href = "/frontend/html/login.html";
}

function requireAuth() {
    const token = getToken();

    if (!token) {
        redirectToLogin("Please sign in to continue.");
        return false;
    }

    return true;
}

async function authorizedFetch(url, options = {}) {
    const token = getToken();

    const headers = {
        ...(options.headers || {})
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401 || response.status === 403) {
        clearAuthData();
        redirectToLogin("Your session has expired. Please log in again.");
        throw new Error("Your session has expired. Please log in again.");
    }

    return response;
}

async function protectPage() {
    const token = getToken();

    if (!token) {
        redirectToLogin("Please sign in to continue.");
        return false;
    }

    try {
        const response = await fetch("http://localhost:8081/api/auth/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            clearAuthData();
            redirectToLogin("Your session has expired. Please log in again.");
            return false;
        }

        return true;
    } catch (error) {
        clearAuthData();
        redirectToLogin("Could not verify your session. Please log in again.");
        return false;
    }
}

function showMessage(message, type = "error", duration = 3000) {
    const messageBox = document.getElementById("globalMessage");

    if (!messageBox) {
        console.warn("globalMessage element not found.");
        return;
    }

    if (messageTimeoutId) {
        clearTimeout(messageTimeoutId);
    }

    messageBox.textContent = message;
    messageBox.className = `global-message ${type} show`;

    if (duration > 0) {
        messageTimeoutId = setTimeout(() => {
            clearMessage();
        }, duration);
    }
}

function clearMessage() {
    const messageBox = document.getElementById("globalMessage");

    if (!messageBox) return;

    if (messageTimeoutId) {
        clearTimeout(messageTimeoutId);
        messageTimeoutId = null;
    }

    messageBox.className = "global-message";
    messageBox.textContent = "";
}