// Utility function to show success message
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #4CAF50;
      color: white;
      padding: 15px 25px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      z-index: 1000;
      animation: slideIn 0.5s, fadeOut 0.5s 2.5s forwards;
  `;
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
      successDiv.remove();
  }, 3000);
}

// Toggle password visibility
document.addEventListener('DOMContentLoaded', function() {
  const togglePasswordButton = document.querySelector('.toggle-password');
  if (togglePasswordButton) {
      togglePasswordButton.addEventListener('click', function() {
          const passwordInput = document.getElementById('password');
          const icon = this.querySelector('i');
          
          if (passwordInput.type === 'password') {
              passwordInput.type = 'text';
              icon.classList.replace('fa-eye', 'fa-eye-slash');
          } else {
              passwordInput.type = 'password';
              icon.classList.replace('fa-eye-slash', 'fa-eye');
          }
      });
  }
});

// Login Form Validation
function validateLoginForm(event) {
  event.preventDefault();
  
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  
  const errorEmail = document.getElementById('error-email');
  const errorPassword = document.getElementById('error-password');
  
  // Clear previous error messages
  [errorEmail, errorPassword].forEach(el => el.textContent = '');
  [email, password].forEach(input => input.classList.remove('is-invalid', 'is-valid'));

  let isValid = true;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  // Email validation
  if (!email.value.trim()) {
      errorEmail.textContent = "Email address is required";
      email.classList.add('is-invalid');
      // alert("Email address is required");
      isValid = false;
  } else if (!emailRegex.test(email.value)) {
      errorEmail.textContent = "Please enter a valid email address";
      email.classList.add('is-invalid');
      // alert("Please enter a valid email address");
      isValid = false;
  } else {
      email.classList.add('is-valid');
  }

  // Password validation (same as register)
  if (!password.value.trim()) {
      errorPassword.textContent = "Password is required";
      password.classList.add('is-invalid');
      // alert("Password is required");
      isValid = false;
  } else if (!strongPasswordRegex.test(password.value)) {
      errorPassword.textContent = "Password must be 8+ characters, with uppercase, lowercase, number, and special character";
      password.classList.add('is-invalid');
      // alert("Password must be strong: 8+ characters, 1 uppercase, 1 lowercase, 1 number, 1 special character");
      isValid = false;
  } else {
      password.classList.add('is-valid');
  }

  if (isValid) {
      showSuccessMessage('Login successful! Redirecting...');
      
      setTimeout(() => {
          event.target.submit();
      }, 1000);
  }

  return false;
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
  }
  @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
  }
  .is-invalid {
      border-color: #dc3545 !important;
  }
  .is-valid {
      border-color: #198754 !important;
  }
  .success-message {
      font-size: 1rem;
      font-weight: 500;
  }
`;
document.head.appendChild(style);
