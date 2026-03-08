let cropper;

const changeBtn = document.getElementById("changePhotoBtn");
const photoInput = document.getElementById("photoInput");
const profileImage = document.getElementById("profileImage");
const avatarLetters = document.getElementById("avatarLetters");
const imageToCrop = document.getElementById("imageToCrop");
const editor = document.getElementById("imageEditor");
const cropBtn = document.getElementById("cropBtn");

changeBtn.addEventListener("click", () => {
    photoInput.click();
});

photoInput.addEventListener("change", function () {

    const file = this.files[0];

    if(file){

        const reader = new FileReader();

        reader.onload = function(e){

            editor.style.display = "block";
            imageToCrop.src = e.target.result;

            if(cropper){
                cropper.destroy();
            }

            cropper = new Cropper(imageToCrop,{
                aspectRatio:1,
                viewMode:1
            });

        }

        reader.readAsDataURL(file);
    }

});

cropBtn.addEventListener("click", function(){

    const canvas = cropper.getCroppedCanvas({
        width:200,
        height:200
    });

    const croppedImage = canvas.toDataURL();

    profileImage.src = croppedImage;
    profileImage.style.display = "block";
    avatarLetters.style.display = "none";

    editor.style.display = "none";

});

const updateBtn = document.getElementById("updateProfileBtn");

updateBtn.addEventListener("click", function () {

    const toastElement = document.getElementById("successToast");

    const toast = new bootstrap.Toast(toastElement);

    toast.show();

});

const changePasswordBtn = document.getElementById("changePasswordBtn");

changePasswordBtn.addEventListener("click", function () {

    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const error = document.getElementById("passwordError");

    const regex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!regex.test(newPassword)) {

        error.innerText =
            "Password must contain at least 8 characters, one capital letter and one special character.";

        return;
    }

    if (newPassword !== confirmPassword) {

        error.innerText = "Passwords do not match.";

        return;
    }

    error.innerText = "";
    //  Close the modal
    const modalElement = document.getElementById("resetPasswordModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    //  Show toast message
    const toastElement = document.getElementById("passwordToast");
    const toast = new bootstrap.Toast(toastElement);

    toast.show();

});