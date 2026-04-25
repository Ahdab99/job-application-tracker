const API_BASE_URL = "https://job-application-tracker-ehz6.onrender.com/api/auth";

// Register form
const registerForm = document.getElementById("registerForm");

// Inputs
const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

// Error message elements
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");
const confirmPasswordError = document.getElementById("confirm-password-error");

// Toggle password
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirmPassword");

nameInput.addEventListener("blur", validateName);

nameInput.addEventListener("input", function () {
    nameError.textContent = "";
    nameInput.classList.remove("input-error");
});

function validateName() {
    const nameValue = nameInput.value.trim();

    if (nameValue === "") {
        nameError.textContent = "Please enter your name.";
        nameInput.classList.add("input-error");
        return false;
    } else {
        nameError.textContent = "";
        nameInput.classList.remove("input-error");
        return true;
    }
}

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function isValidPassword(password) {
    return password.length > 8;
}

function validateEmail() {
    const emailValue = emailInput.value.trim();

    if (!isValidEmail(emailValue)) {
        emailError.textContent = "Invalid email format (example: name@example.com).";
        emailInput.classList.add("input-error");
        return false;
    } else {
        emailError.textContent = "";
        emailInput.classList.remove("input-error");
        return true;
    }
}

function validatePassword() {
    const passwordValue = passwordInput.value;

    if (!isValidPassword(passwordValue)) {
        passwordError.textContent = "Password must be longer than 8 characters.";
        passwordInput.classList.add("input-error");
        return false;
    } else {
        passwordError.textContent = "";
        passwordInput.classList.remove("input-error");
        return true;
    }
}

function validateConfirmPassword() {
    const passwordValue = passwordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    if (confirmPasswordValue === "") {
        confirmPasswordError.textContent = "Please confirm your password.";
        confirmPasswordInput.classList.add("input-error");
        return false;
    } else if (confirmPasswordValue !== passwordValue) {
        confirmPasswordError.textContent = "Passwords do not match.";
        confirmPasswordInput.classList.add("input-error");
        return false;
    } else {
        confirmPasswordError.textContent = "";
        confirmPasswordInput.classList.remove("input-error");
        return true;
    }
}

emailInput.addEventListener("blur", validateEmail);
emailInput.addEventListener("input", function () {
    emailError.textContent = "";
    emailInput.classList.remove("input-error");
});

passwordInput.addEventListener("blur", validatePassword);
passwordInput.addEventListener("input", function () {
    passwordError.textContent = "";
    passwordInput.classList.remove("input-error");
});

confirmPasswordInput.addEventListener("blur", validateConfirmPassword);
confirmPasswordInput.addEventListener("input", function () {
    confirmPasswordError.textContent = "";
    confirmPasswordInput.classList.remove("input-error");
});

// Form submit
registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearMessage();

    const nameIsValid = validateName();
    const emailIsValid = validateEmail();
    const passwordIsValid = validatePassword();
    const confirmPasswordIsValid = validateConfirmPassword();

    if (!(nameIsValid && emailIsValid && passwordIsValid && confirmPasswordIsValid)) {
        return;
    }

    const registerData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Register failed", "error");
            return;
        }

        showMessage(data.message || "User registered successfully", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 800);

    } catch (error) {
        console.error("Register error:", error);
        showMessage("Could not connect to the server.", "error");
    }
});

// Toggle password
togglePassword.addEventListener("click", function () {
    if (passwordField.type === "password") {
        passwordField.type = "text";
        togglePassword.classList.remove("fa-eye-slash");
        togglePassword.classList.add("fa-eye");
    } else {
        passwordField.type = "password";
        togglePassword.classList.remove("fa-eye");
        togglePassword.classList.add("fa-eye-slash");
    }
});

toggleConfirmPassword.addEventListener("click", function () {
    if (confirmPasswordField.type === "password") {
        confirmPasswordField.type = "text";
        toggleConfirmPassword.classList.remove("fa-eye-slash");
        toggleConfirmPassword.classList.add("fa-eye");
    } else {
        confirmPasswordField.type = "password";
        toggleConfirmPassword.classList.remove("fa-eye");
        toggleConfirmPassword.classList.add("fa-eye-slash");
    }
});