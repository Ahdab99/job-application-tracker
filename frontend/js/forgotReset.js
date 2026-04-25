const forgotResetForm = document.getElementById("forgotResetForm");
const newPasswordInput = document.getElementById("newPasswordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const newPasswordError = document.getElementById("newPasswordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");

const toggleNewPassword = document.getElementById("toggleNewPassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

function getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
}

function isStrongPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
}

function validateNewPassword() {
    const value = newPasswordInput.value.trim();

    if (!isStrongPassword(value)) {
        newPasswordError.textContent =
            "Password must contain at least 8 characters, one capital letter and one special character.";
        newPasswordInput.classList.add("input-error");
        return false;
    }

    newPasswordError.textContent = "";
    newPasswordInput.classList.remove("input-error");
    return true;
}

function validateConfirmPassword() {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (confirmPassword === "") {
        confirmPasswordError.textContent = "Please confirm your new password.";
        confirmPasswordInput.classList.add("input-error");
        return false;
    }

    if (newPassword !== confirmPassword) {
        confirmPasswordError.textContent = "Passwords do not match.";
        confirmPasswordInput.classList.add("input-error");
        return false;
    }

    confirmPasswordError.textContent = "";
    confirmPasswordInput.classList.remove("input-error");
    return true;
}

toggleNewPassword.addEventListener("click", function () {
    if (newPasswordInput.type === "password") {
        newPasswordInput.type = "text";
        toggleNewPassword.classList.remove("fa-eye-slash");
        toggleNewPassword.classList.add("fa-eye");
    } else {
        newPasswordInput.type = "password";
        toggleNewPassword.classList.remove("fa-eye");
        toggleNewPassword.classList.add("fa-eye-slash");
    }
});

toggleConfirmPassword.addEventListener("click", function () {
    if (confirmPasswordInput.type === "password") {
        confirmPasswordInput.type = "text";
        toggleConfirmPassword.classList.remove("fa-eye-slash");
        toggleConfirmPassword.classList.add("fa-eye");
    } else {
        confirmPasswordInput.type = "password";
        toggleConfirmPassword.classList.remove("fa-eye");
        toggleConfirmPassword.classList.add("fa-eye-slash");
    }
});

newPasswordInput.addEventListener("blur", validateNewPassword);
confirmPasswordInput.addEventListener("blur", validateConfirmPassword);

newPasswordInput.addEventListener("input", function () {
    newPasswordError.textContent = "";
    newPasswordInput.classList.remove("input-error");
});

confirmPasswordInput.addEventListener("input", function () {
    confirmPasswordError.textContent = "";
    confirmPasswordInput.classList.remove("input-error");
});

async function resetForgottenPassword(data) {
    const response = await fetch(`${window.API_BASE_URL}/forgot-password/reset`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Password reset failed.");
    }

    return result;
}

forgotResetForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    clearMessage();

    const token = getTokenFromUrl();

    if (!token) {
        showMessage("Reset token is missing from the URL.", "error", 4000);
        return;
    }

    const passwordValid = validateNewPassword();
    const confirmValid = validateConfirmPassword();

    if (!(passwordValid && confirmValid)) {
        return;
    }

    try {
        await resetForgottenPassword({
            token,
            newPassword: newPasswordInput.value
        });

        showMessage("Password has been reset successfully.", "success", 3000);

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        console.error("Forgot reset error:", error);
        showMessage(error.message, "error", 4000);
    }
});