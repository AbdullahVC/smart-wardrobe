// User Management
function login(username, password) {
  // Check if it's demo login
  if (password === "demo123") {
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
    return;
  }

  // Check registered users
  const users = getRegisteredUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    localStorage.setItem("username", username);
    window.location.href = "dashboard.html";
  } else {
    showLoginError(
      "Invalid username or password. Try demo credentials or sign up."
    );
  }
}

function signup(username, password, confirmPassword) {
  // Validate passwords match
  if (password !== confirmPassword) {
    showSignupError("Passwords do not match!");
    return;
  }

  // Validate password length
  if (password.length < 4) {
    showSignupError("Password must be at least 4 characters long!");
    return;
  }

  // Check if username already exists
  const users = getRegisteredUsers();
  if (users.find((u) => u.username === username)) {
    showSignupError("Username already exists! Please choose a different one.");
    return;
  }

  // Create new user
  const newUser = {
    username: username,
    password: password,
    dateCreated: new Date().toLocaleDateString("en-US"),
  };

  users.push(newUser);
  localStorage.setItem("registeredUsers", JSON.stringify(users));

  showSignupSuccess("Account created successfully! You can now log in.");

  // Clear form and switch to login
  document.getElementById("signupForm").reset();
  setTimeout(() => {
    if (
      !document.querySelector(".login-form").innerHTML.includes("loginForm")
    ) {
      toggleForm();
    }
  }, 1500);
}

function getRegisteredUsers() {
  const users = localStorage.getItem("registeredUsers");
  return users ? JSON.parse(users) : [];
}

function logout() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.removeItem("username");
    window.location.href = "index.html";
  }
}

function checkUser() {
  const username = localStorage.getItem("username");
  if (!username) {
    window.location.href = "index.html";
    return;
  }

  // Update welcome message
  const welcomeMessage = document.getElementById("welcomeMessage");
  if (welcomeMessage) {
    welcomeMessage.textContent = `Welcome, ${username}!`;
  }
}

function showLoginError(message) {
  showFormMessage(message, "error", "loginForm");
}

function showSignupError(message) {
  showFormMessage(message, "error", "signupForm");
}

function showSignupSuccess(message) {
  showFormMessage(message, "success", "signupForm");
}

function showFormMessage(message, type, formId) {
  // Remove existing messages
  const existingMessage = document.querySelector(`.${type}-message`);
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `${type}-message`;
  messageDiv.textContent = message;

  const form = document.getElementById(formId);
  form.appendChild(messageDiv);

  // Remove message after 5 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// Wardrobe Management
function getWardrobe() {
  const wardrobe = localStorage.getItem("wardrobe");
  return wardrobe ? JSON.parse(wardrobe) : [];
}

function addWardrobeItem(item) {
  const wardrobe = getWardrobe();
  wardrobe.push(item);
  localStorage.setItem("wardrobe", JSON.stringify(wardrobe));
}

// Outfit Suggestion
function suggestOutfit() {
  const wardrobe = getWardrobe();
  const outfitSuggestion = document.getElementById("outfitSuggestion");

  if (wardrobe.length === 0) {
    outfitSuggestion.innerHTML = `
            <div class="no-outfit">
                <p>❌ No items in your wardrobe yet!</p>
                <p>First add items from <a href="wardrobe.html">Wardrobe</a> page.</p>
            </div>
        `;
    return;
  }

  // Select random item
  const randomIndex = Math.floor(Math.random() * wardrobe.length);
  const selectedOutfit = wardrobe[randomIndex];

  // Display suggested outfit
  outfitSuggestion.innerHTML = `
        <div class="outfit-suggestion">
            <h4>✨ My suggestion for today:</h4>
            <div class="suggested-item">
                <h5>${selectedOutfit.name}</h5>
                <p><strong>Category:</strong> ${selectedOutfit.category}</p>
                <p><strong>Color:</strong> ${selectedOutfit.color}</p>
            </div>
            <p class="suggestion-note">This outfit suits today's weather! 👍</p>
        </div>
    `;

  // Add to history
  addToHistory(selectedOutfit);
}

// History Management
function getHistory() {
  const history = localStorage.getItem("outfitHistory");
  return history ? JSON.parse(history) : [];
}

function addToHistory(outfit) {
  const history = getHistory();
  const historyEntry = {
    id: Date.now(),
    outfit: outfit,
    date:
      new Date().toLocaleDateString("en-US") +
      " " +
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
  };

  history.push(historyEntry);
  localStorage.setItem("outfitHistory", JSON.stringify(history));
}

// Page Load Control
document.addEventListener("DOMContentLoaded", function () {
  // Check user if not on login page
  if (
    !window.location.pathname.includes("index.html") &&
    window.location.pathname !== "/"
  ) {
    checkUser();
  }
});

// General Helper Functions
function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US");
}

function showMessage(message, type = "success") {
  // Simple message display function
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem;
        background: ${type === "success" ? "#2ecc71" : "#e74c3c"};
        color: white;
        border-radius: 4px;
        z-index: 1000;
    `;

  document.body.appendChild(messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}
