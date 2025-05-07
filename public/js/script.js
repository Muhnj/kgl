document.addEventListener("DOMContentLoaded", function () {
  // Password toggle functionality
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const inputGroup = this.closest(".input-group");
      const passwordInput = inputGroup.querySelector("input");
      const icon = this.querySelector("i");
      
      if (!passwordInput || !icon) return;

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        passwordInput.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });

  // Dynamically show/hide branch based on role
  const role = document.getElementById("role");
  const branchContainer = document.getElementById("branch-container");
  const branch = document.getElementById("branch");
  const errorBranch = document.getElementById("error-branch");

  if (role) {
    role.addEventListener("change", function () {
      if (role.value === "Director") {
        branchContainer.style.display = "none";
        branch.classList.remove("is-invalid", "is-valid");
        errorBranch.textContent = "";
      } else {
        branchContainer.style.display = "";
      }
    });

    // Trigger it on load in case of pre-filled role
    if (role.value === "Director") {
      branchContainer.style.display = "none";
    }
  }

  // Password Strength Meter Elements
  const strengthBar = document.getElementById("password-strength-bar");
  const strengthText = document.getElementById("password-strength-text");
  const passwordInput = document.getElementById("password");

  if (passwordInput && strengthBar && strengthText) {
    // Real-time Password Strength Check
    passwordInput.addEventListener("input", function (e) {
      const password = e.target.value;
      let strength = 0;
      const requirements = {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
      };

      let strengthDetails = [];

      // Check requirements
      if (password.length >= 8) {
        strength++;
        requirements.length = true;
      } else {
        strengthDetails.push("at least 8 characters");
      }

      if (/[a-z]/.test(password)) {
        strength++;
        requirements.lowercase = true;
      } else {
        strengthDetails.push("one lowercase letter");
      }

      if (/[A-Z]/.test(password)) {
        strength++;
        requirements.uppercase = true;
      } else {
        strengthDetails.push("one uppercase letter");
      }

      if (/\d/.test(password)) {
        strength++;
        requirements.number = true;
      } else {
        strengthDetails.push("one number");
      }

      if (/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        strength++;
        requirements.special = true;
      } else {
        strengthDetails.push("one special character");
      }

      // Create strength message
      let strengthMessage = "";
      let strengthColor = "";
      let barWidth = "0%";

      switch (strength) {
        case 0:
        case 1:
          barWidth = "20%";
          strengthColor = "#dc3545";
          strengthMessage = `Very Weak: Needs ${formatRequirements(strengthDetails)}`;
          break;
        case 2:
          barWidth = "40%";
          strengthColor = "#ff6b6b";
          strengthMessage = `Weak: Missing ${formatRequirements(strengthDetails)}`;
          break;
        case 3:
          barWidth = "60%";
          strengthColor = "#ffc107";
          strengthMessage = `Medium: Needs ${formatRequirements(strengthDetails)}`;
          break;
        case 4:
          barWidth = "80%";
          strengthColor = "#4dabf7";
          strengthMessage = `Strong: Almost there!`;
          break;
        case 5:
          barWidth = "100%";
          strengthColor = "#40c057";
          strengthMessage = `Very Strong! Perfect security! 🔒`;
          break;
      }

      // Update UI
      strengthBar.style.width = barWidth;
      strengthBar.style.backgroundColor = strengthColor;
      strengthText.style.color = strengthColor;
      strengthText.innerHTML = `${strengthMessage} ${getStrengthIcon(strength)}`;

      // Clear error when valid
      if (strength === 5) {
        e.target.classList.remove("is-invalid");
        e.target.classList.add("is-valid");
        document.getElementById("error-password").textContent = "";
      }
    });
  }

  // Helper functions
  function formatRequirements(requirements) {
    if (requirements.length === 0) return "";
    const lastReq = requirements.pop();
    return requirements.length > 0
      ? `${requirements.join(", ")} and ${lastReq}`
      : lastReq;
  }

  function getStrengthIcon(strength) {
    const icons = {
      0: "😱",
      1: "😨",
      2: "😕",
      3: "🙂",
      4: "😎",
      5: "🎉",
    };
    return icons[strength] || "";
  }
});

function validateForm(event) {
  event.preventDefault();

  const role = document.getElementById("role");
  const branch = document.getElementById("branch");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");

  const errorRole = document.getElementById("error-role");
  const errorBranch = document.getElementById("error-branch");
  const errorUsername = document.getElementById("error-username");
  const errorEmail = document.getElementById("error-email");
  const errorPassword = document.getElementById("error-password");
  const errorConfirmPassword = document.getElementById("error-confirmPassword");

  [
    errorRole,
    errorBranch,
    errorUsername,
    errorEmail,
    errorPassword,
    errorConfirmPassword,
  ].forEach((el) => (el.textContent = ""));
  [role, branch, username, email, password, confirmPassword].forEach((el) => {
    el.classList.remove("is-invalid", "is-valid");
  });

  let isValid = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%^&\*()\-_=+[\]{};':"\\|,.<>/?]).{8,}$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

  // Role validation
  if (!role.value) {
    errorRole.textContent = "Please select your role";
    role.classList.add("is-invalid");
    isValid = false;
  } else {
    role.classList.add("is-valid");
  }

  // Branch validation
  if (role.value !== "Director" && !branch.value) {
    errorBranch.textContent = "Please select your branch";
    branch.classList.add("is-invalid");
    isValid = false;
  } else {
    branch.classList.add("is-valid");
  }

  // Username validation
  if (!username.value.trim()) {
    errorUsername.textContent = "Username is required";
    username.classList.add("is-invalid");
    isValid = false;
  } else if (!usernameRegex.test(username.value)) {
    errorUsername.textContent =
      "Username must be 3-20 characters (letters, numbers, underscores)";
    username.classList.add("is-invalid");
    isValid = false;
  } else {
    username.classList.add("is-valid");
  }

  // Email validation
  if (!email.value.trim()) {
    errorEmail.textContent = "Email address is required";
    email.classList.add("is-invalid");
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    errorEmail.textContent = "Please enter a valid email address";
    email.classList.add("is-invalid");
    isValid = false;
  } else {
    email.classList.add("is-valid");
  }

  // Password validation
  if (!password.value.trim()) {
    errorPassword.textContent = "Password is required";
    password.classList.add("is-invalid");
    isValid = false;
  } else if (!strongPasswordRegex.test(password.value)) {
    errorPassword.textContent =
      "Must contain: 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character";
    password.classList.add("is-invalid");
    isValid = false;
  } else {
    password.classList.add("is-valid");
  }

  // Confirm Password validation
  if (!confirmPassword.value.trim()) {
    errorConfirmPassword.textContent = "Please confirm your password";
    confirmPassword.classList.add("is-invalid");
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    errorConfirmPassword.textContent = "Passwords do not match";
    confirmPassword.classList.add("is-invalid");
    isValid = false;
  } else {
    confirmPassword.classList.add("is-valid");
  }

  if (isValid) {
    event.target.submit();
  }

  return false;
}