const API_URL = "http://localhost:8081/api/applications";

protectPage();

// Back button & Cancel
function goBack() {
    window.location.href = "../html/main.html";
}

document.querySelector(".back-btn").addEventListener("click", goBack);
document.querySelector(".button-secondary").addEventListener("click", goBack);

// Create application in backend
async function createApplication(data) {
    const response = await authorizedFetch(`${API_URL}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    const text = await response.text();
    const responseData = text ? JSON.parse(text) : {};

    if (!response.ok) {
        throw new Error(responseData.message || "Create failed.");
    }

    return responseData;
}

// Save application
document.getElementById("createForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    clearMessage();

    const companyName = document.getElementById("companyInput").value.trim();
    const position = document.getElementById("positionInput").value.trim();
    const status = document.getElementById("statusInput").value;
    const appliedDate = document.getElementById("dateInput").value;

    if (!companyName || !position || !appliedDate) {
        showMessage("Please fill all required fields.", "error");
        return;
    }

    const newApp = {
        companyName,
        position,
        status,
        notes: "",
        appliedDate
    };

    try {
        await createApplication(newApp);
        showMessage("Application created successfully.", "success");

        setTimeout(() => {
            window.location.href = "../html/main.html";
        }, 800);
    } catch (error) {
        console.error(error.message);
        showMessage(error.message, "error");
    }
});