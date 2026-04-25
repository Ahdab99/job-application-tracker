protectPage();
requireAuth();

const profileNameInput = document.getElementById("profileName");
const profileEmailInput = document.getElementById("profileEmail");

let cropper;

const changeBtn = document.getElementById("changePhotoBtn");
const photoInput = document.getElementById("photoInput");
const profileImage = document.getElementById("profileImage");
const avatarLetters = document.getElementById("avatarLetters");
const imageToCrop = document.getElementById("imageToCrop");
const editor = document.getElementById("imageEditor");
const cropBtn = document.getElementById("cropBtn");
const updateBtn = document.getElementById("updateProfileBtn");
const changePasswordBtn = document.getElementById("changePasswordBtn");

async function fetchCurrentUserProfile() {
    const response = await authorizedFetch("http://localhost:8081/api/auth/me", {
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Profile could not be loaded.");
    }

    return await response.json();
}

async function updateCurrentUserProfile(data) {
    const response = await authorizedFetch("http://localhost:8081/api/auth/me", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Profile update failed.");
    }

    return await response.json();
}

async function uploadProfilePhoto(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await authorizedFetch("http://localhost:8081/api/auth/me/photo", {
        method: "POST",
        body: formData
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Photo upload failed.");
    }

    return await response.json();
}

function updateAvatarLetters(name) {
    if (!avatarLetters) return;

    const cleanedName = (name || "").trim();

    if (!cleanedName) {
        avatarLetters.textContent = "U";
        return;
    }

    const parts = cleanedName.split(/\s+/);
    const initials = parts
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join("");

    avatarLetters.textContent = initials || "U";
}

async function loadProfile() {
    try {
        clearMessage();

        const user = await fetchCurrentUserProfile();

        profileNameInput.value = user.name || "";
        profileEmailInput.value = user.email || "";

        if (user.photoUrl) {
            profileImage.src = `http://localhost:8081${user.photoUrl}?t=${Date.now()}`;
            profileImage.style.display = "block";
            avatarLetters.style.display = "none";
        } else {
            profileImage.style.display = "none";
            avatarLetters.style.display = "inline";
            updateAvatarLetters(user.name);
        }
    } catch (error) {
        console.error("Load profile error:", error);
        showMessage(error.message, "error", 4000);
    }
}

changeBtn.addEventListener("click", () => {
    photoInput.value = "";
    photoInput.click();
});

photoInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        editor.style.display = "block";
        imageToCrop.src = e.target.result;

        if (cropper) {
            cropper.destroy();
        }

        cropper = new Cropper(imageToCrop, {
            aspectRatio: 1,
            viewMode: 1
        });
    };

    reader.readAsDataURL(file);
});

cropBtn.addEventListener("click", function () {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200
    });

    canvas.toBlob(async (blob) => {
        try {
            if (!blob) {
                showMessage("Could not process image.", "error", 3000);
                return;
            }

            const file = new File([blob], "profile-photo.png", { type: "image/png" });

            const updatedUser = await uploadProfilePhoto(file);

            if (updatedUser.photoUrl) {
                profileImage.src = `http://localhost:8081${updatedUser.photoUrl}?t=${Date.now()}`;
                profileImage.style.display = "block";
                avatarLetters.style.display = "none";
            }

            if (cropper) {
                cropper.destroy();
                cropper = null;
            }

            imageToCrop.src = "";
            photoInput.value = "";
            editor.style.display = "none";

            showMessage("Photo uploaded successfully.", "success", 2500);

        } catch (error) {
            console.error("Photo upload error:", error);
            showMessage(error.message, "error", 4000);
        }
    }, "image/png");
});

updateBtn.addEventListener("click", async function () {
    try {
        clearMessage();

        const name = profileNameInput.value.trim();

        if (!name) {
            showMessage("Please enter your name.", "error", 3000);
            return;
        }

        const updatedUser = await updateCurrentUserProfile({ name });

        showMessage("Profile updated successfully.", "success", 2500);

        if (!updatedUser.photoUrl) {
            profileImage.style.display = "none";
            avatarLetters.style.display = "inline";
            updateAvatarLetters(name);
        }
    } catch (error) {
        console.error("Update profile error:", error);
        showMessage(error.message, "error", 4000);
    }
});

async function resetPassword(data) {
    const response = await authorizedFetch("http://localhost:8081/api/auth/reset-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Password reset failed.");
    }

    return await response.json();
    }   

changePasswordBtn.addEventListener("click", async function () {
    const oldPassword = document.getElementById("oldPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const error = document.getElementById("passwordError");

    const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!oldPassword.trim()) {
        error.innerText = "Please enter your old password.";
        return;
    }

    if (!regex.test(newPassword)) {
        error.innerText =
            "Password must contain at least 8 characters, one capital letter and one special character.";
        return;
    }

    if (newPassword !== confirmPassword) {
        error.innerText = "Passwords do not match.";
        return;
    }

    try {
        error.innerText = "";

        await resetPassword({
            oldPassword,
            newPassword
        });

        document.getElementById("oldPassword").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmPassword").value = "";

        const modalElement = document.getElementById("resetPasswordModal");
        const modalInstance = bootstrap.Modal.getInstance(modalElement);

        if (modalInstance) {
            modalInstance.hide();
        }

        showMessage("Password updated successfully.", "success", 3000);

    } catch (err) {
        console.error("Reset password error:", err);
        error.innerText = err.message;
    }
});

loadProfile();