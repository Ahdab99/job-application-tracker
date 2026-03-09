let selectedIndex = null;

// Load user from localStorage
let user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    user = {
        name: "Ahmed Darwish",
        applications: []
    };
    localStorage.setItem("user", JSON.stringify(user));
}

// Insert welcome message
document.getElementById("welcomeMessage").textContent =
    `Welcome back, ${user.name}!`;

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

// Format date for display (DD/MM/YYYY)
function formatDateForDisplay(isoDate) {    
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
}

// Render cards
function renderCards() {

    document.getElementById("applicationsCount").textContent =
        `You have ${user.applications.length} job applications`;

    grid.innerHTML = "";

    if (user.applications.length === 0) {
        // grid.innerHTML = "<p>No applications yet</p>";
        return;
    }

    user.applications.forEach((app, index) => {

        const card = document.createElement("div");
        card.classList.add("application-card");

        card.innerHTML = `
            <div class="card-logo">
                <i class="fa-regular fa-file-lines"></i>
            </div>

            <span class="status-badge status-${app.status}">
                ${app.status}
            </span>

            <div class="company-name">${app.company}</div>
            <div class="position">${app.position}</div>

            <div class="date-row">
                <i class="fa-regular fa-calendar"></i>
                ${formatDateForDisplay(app.date)}
            </div>
        `;

        card.addEventListener("click", () => openDetails(index));
        grid.appendChild(card);
    });
}

// Open modal
function openDetails(index) {

    selectedIndex = index;
    const app = user.applications[index];

    document.getElementById("detailCompany").value = app.company;
    document.getElementById("detailPosition").value = app.position;
    document.getElementById("detailStatus").value = app.status;
    document.getElementById("detailDate").value = app.date;

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
document.getElementById("updateBtn").addEventListener("click", () => {

    if (selectedIndex === null) return;

    user.applications[selectedIndex] = {
        company: document.getElementById("detailCompany").value,
        position: document.getElementById("detailPosition").value,
        status: document.getElementById("detailStatus").value,
        date: document.getElementById("detailDate").value
    };

    localStorage.setItem("user", JSON.stringify(user));

    overlay.style.display = "none";
    renderCards();
});

// Delete
document.getElementById("deleteBtn").addEventListener("click", () => {
    if (selectedIndex === null) return;

    confirmOverlay.style.display = "flex";
});

//Confirmation for delete
confirmNo.addEventListener("click", () => {
    confirmOverlay.style.display = "none";
});

confirmYes.addEventListener("click", () => {
    if (selectedIndex === null) return;

    user.applications.splice(selectedIndex, 1);
    localStorage.setItem("user", JSON.stringify(user));

    confirmOverlay.style.display = "none";
    overlay.style.display = "none";

    renderCards();
});

//Logout Button opens Modal
logoutBtn.addEventListener("click", () => {
    logoutOverlay.style.display = "flex";
});

// No->Close
logoutNo.addEventListener("click", () => {
    logoutOverlay.style.display = "none";
});

// Yes-> Logout  
logoutYes.addEventListener("click", () => {

    localStorage.removeItem("user");

    window.location.href = "login.html";
});

//Create new Application button
const newAppBtn = document.getElementById("newApplicationBtn");

if (newAppBtn) {
    newAppBtn.addEventListener("click", () => {
        window.location.href = "../pages/newApp.html";
    });
}

renderCards();