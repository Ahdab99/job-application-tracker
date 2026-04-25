// Login elements
const loginForm = document.getElementById("loginForm");
const loginEmailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const passwordError = document.getElementById("passwordError");
const emailError = document.getElementById("emailError");

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    } else {
        passwordInput.type = "password";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    }
});

// Login validation
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function validateLoginEmail() {
    const emailValue = loginEmailInput.value.trim();

    if (!isValidEmail(emailValue)) {
        emailError.textContent = "Invalid email format.";
        loginEmailInput.classList.add("input-error");
        return false;
    } else {
        emailError.textContent = "";
        loginEmailInput.classList.remove("input-error");
        return true;
    }
}

function validateLoginPassword() {
    const passwordValue = passwordInput.value.trim();

    if (passwordValue === "") {
        passwordError.textContent = "Please enter your password.";
        passwordInput.classList.add("input-error");
        return false;
    } else {
        passwordError.textContent = "";
        passwordInput.classList.remove("input-error");
        return true;
    }
}

loginEmailInput.addEventListener("blur", validateLoginEmail);
loginEmailInput.addEventListener("input", function () {
    emailError.textContent = "";
    loginEmailInput.classList.remove("input-error");
});

passwordInput.addEventListener("blur", validateLoginPassword);
passwordInput.addEventListener("input", function () {
    passwordError.textContent = "";
    passwordInput.classList.remove("input-error");
});

// Login submit
loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearMessage();

    const emailIsValid = validateLoginEmail();
    const passwordIsValid = validateLoginPassword();

    if (!(emailIsValid && passwordIsValid)) {
        return;
    }

    const loginData = {
        email: loginEmailInput.value.trim(),
        password: passwordInput.value
    };

    try {
        const response = await fetch(`${window.API_BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const text = await response.text();
        const data = text ? JSON.parse(text) : {};

        if (!response.ok) {
            showMessage(data.message || "Login failed", "error");
            return;
        }

        saveAuthData(data.token, loginEmailInput.value.trim());
        showMessage(data.message || "Login successful", "success");

        setTimeout(() => {
            window.location.href = "main.html";
        }, 800);

    } catch (error) {
        console.error("Login error:", error);
        showMessage("Could not connect to the server.", "error");
    }
});

// Forgot password modal
const forgotLink = document.querySelector(".forgot-link");
const modal = document.getElementById("resetModal");
const closeModal = document.getElementById("closeModal");

// Modal email
const emailInput = document.getElementById("emailModal");
const modalEmailError = document.getElementById("email-error");
const resetPasswordButton = document.getElementById("resetPasswordButton");

// Open modal
forgotLink.addEventListener("click", function (e) {
    e.preventDefault();
    modal.classList.add("active");
});

// Close when clicking X
closeModal.addEventListener("click", function () {
    modal.classList.remove("active");
    resetModalForm();
});

// Close when clicking outside
modal.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.classList.remove("active");
        resetModalForm();
    }
});

// Forgot password validation
emailInput.addEventListener("blur", function () {
    const emailValue = emailInput.value.trim();

    if (!isValidEmail(emailValue)) {
        modalEmailError.textContent = "Invalid email format (example: name@example.com)";
        emailInput.classList.add("input-error");
    } else {
        modalEmailError.textContent = "";
        emailInput.classList.remove("input-error");
    }
});

emailInput.addEventListener("input", function () {
    modalEmailError.textContent = "";
    emailInput.classList.remove("input-error");
});

resetPasswordButton.addEventListener("click", async function () {
    clearMessage();

    const emailValue = emailInput.value.trim();

    if (!isValidEmail(emailValue)) {
        modalEmailError.textContent = "Invalid email format (example: name@example.com)";
        emailInput.classList.add("input-error");
        return;
    }

    try {
        const response = await fetch(`${window.API_BASE_URL}/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: emailValue })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Request failed", "error");
            return;
        }

        showMessage(data.message || "Password reset request accepted", "success");
        modal.classList.remove("active");
        resetModalForm();

    } catch (error) {
        console.error("Forgot password error:", error);
        showMessage("Could not connect to the server.", "error");
    }
});

const authMessage = consumeAuthMessage();
if (authMessage) {
    showMessage(authMessage, "info", 4000);
}

// Reset modal form
function resetModalForm() {
    emailInput.value = "";
    modalEmailError.textContent = "";
    emailInput.classList.remove("input-error");
}