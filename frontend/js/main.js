let selectedIndex = null;
let applications = [];
let currentPage = 1;
const itemsPerPage = 4;

const API_URL = "http://localhost:8081/api/applications";

protectPage();

// Welcome message
const welcomeMessage = document.getElementById("welcomeMessage");
const paginationContainer = document.getElementById("paginationContainer");
const prevPageBtn = document.getElementById("prevPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");
const pageInfo = document.getElementById("pageInfo");

async function loadCurrentUser() {
    try {
        const user = await fetchCurrentUser();

        if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome back, ${user.name}!`;
        }
    } catch (error) {
        console.error(error.message);

        if (welcomeMessage) {
            welcomeMessage.textContent = "Welcome back!";
        }
    }
}

const grid = document.getElementById("applicationsGrid");
const overlay = document.getElementById("detailsOverlay");
const closeBtn = document.getElementById("closeDetails");

const confirmOverlay = document.getElementById("confirmOverlay");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");

const logoutBtn = document.getElementById("logoutBtn");
const logoutOverlay = document.getElementById("logoutOverlay");
const logoutYes = document.getElementById("logoutYes");
const logoutNo = document.getElementById("logoutNo");

// Format date for display
function formatDateForDisplay(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}

// GET applications
async function fetchApplications() {
    const response = await authorizedFetch(`${API_URL}`, {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("Applications could not be loaded.");
    }

    return await response.json();
}

async function fetchCurrentUser() {
    const response = await authorizedFetch("http://localhost:8081/api/auth/me", {
        method: "GET",
    });

    if (!response.ok) {
        throw new Error("User profile could not be loaded.");
    }

    return await response.json();
}

// UPDATE application
async function updateApplication(id, data) {
    const response = await authorizedFetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Update failed.");
    }

    return await response.json();
}

// DELETE application
async function deleteApplication(id) {
    const response = await authorizedFetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Delete failed.");
    }

    return await response.json();
}

// Load all applications
async function loadApplications() {
    try {
        applications = await fetchApplications();
        currentPage = 1;
        renderCards();
    } catch (error) {
        console.error(error.message);
        showMessage(error.message, "error");
    }
}

// Render cards
function renderCards() {
    document.getElementById("applicationsCount").textContent =
        `You have ${applications.length} job applications`;

    grid.innerHTML = "";

    if (applications.length === 0) {
        if (paginationContainer) {
            paginationContainer.style.display = "none";
        }
        return;
    }

    const totalPages = Math.ceil(applications.length / itemsPerPage);

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = applications.slice(startIndex, endIndex);

    currentItems.forEach((app, index) => {
        const realIndex = startIndex + index;

        const card = document.createElement("div");
        card.classList.add("application-card");

        card.innerHTML = `
            <div class="card-logo">
                <i class="fa-regular fa-file-lines"></i>
            </div>

            <span class="status-badge status-${app.status.toLowerCase()}">
                ${app.status}
            </span>

            <div class="company-name">${app.companyName}</div>
            <div class="position">${app.position}</div>

            <div class="date-row">
                <i class="fa-regular fa-calendar"></i>
                ${formatDateForDisplay(app.appliedDate)}
            </div>
        `;

        card.addEventListener("click", () => openDetails(realIndex));
        grid.appendChild(card);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(applications.length / itemsPerPage);

    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) {
            paginationContainer.style.display = applications.length > 0 ? "none" : "none";
        }
        return;
    }

    paginationContainer.style.display = "flex";
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
}

// Open modal
function openDetails(index) {
    selectedIndex = index;
    const app = applications[index];

    document.getElementById("detailCompany").value = app.companyName;
    document.getElementById("detailPosition").value = app.position;
    document.getElementById("detailStatus").value = app.status;
    document.getElementById("detailDate").value = app.appliedDate;

    overlay.style.display = "flex";
}

// Close modal
closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});

// Update
document.getElementById("updateBtn").addEventListener("click", async () => {
    if (selectedIndex === null) return;

    clearMessage();

    const selectedApp = applications[selectedIndex];

    const updatedData = {
        companyName: document.getElementById("detailCompany").value,
        position: document.getElementById("detailPosition").value,
        status: document.getElementById("detailStatus").value,
        notes: selectedApp.notes || "",
        appliedDate: document.getElementById("detailDate").value
    };

    try {
        await updateApplication(selectedApp.id, updatedData);
        overlay.style.display = "none";
        await loadApplications();
        showMessage("Application updated successfully.", "success");
    } catch (error) {
        console.error(error.message);
        showMessage(error.message, "error");
    }
});

// Delete
document.getElementById("deleteBtn").addEventListener("click", () => {
    if (selectedIndex === null) return;
    confirmOverlay.style.display = "flex";
});

// Confirmation for delete
confirmNo.addEventListener("click", () => {
    confirmOverlay.style.display = "none";
});

confirmYes.addEventListener("click", async () => {
    if (selectedIndex === null) return;

    clearMessage();

    const selectedApp = applications[selectedIndex];

    try {
        await deleteApplication(selectedApp.id);
        confirmOverlay.style.display = "none";
        overlay.style.display = "none";
        await loadApplications();
        showMessage("Application deleted successfully.", "success");
    } catch (error) {
        console.error(error.message);
        showMessage(error.message, "error");
    }
});

// Logout button opens modal
logoutBtn.addEventListener("click", () => {
    logoutOverlay.style.display = "flex";
});

// No -> close
logoutNo.addEventListener("click", () => {
    logoutOverlay.style.display = "none";
});

// Yes -> logout
logoutYes.addEventListener("click", () => {
    clearAuthData();
    window.location.href = "login.html";
});

prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderCards();
    }
});

nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(applications.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderCards();
    }
});

// Create new Application button
const newAppBtn = document.getElementById("newApplicationBtn");

if (newAppBtn) {
    newAppBtn.addEventListener("click", () => {
        window.location.href = "../html/newApp.html";
    });
}
loadCurrentUser();
loadApplications();