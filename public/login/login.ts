document.addEventListener("DOMContentLoaded", () => {
  switchForms();
  setupFormListeners();
});

function switchForms() {
  try {
    const loginForm = document.getElementById("loginForm") as HTMLElement;
    const registerForm = document.getElementById("registerForm") as HTMLElement;
    const registerBtn = document.getElementById("registerBtn") as HTMLButtonElement;
    const backToLoginBtn = document.getElementById("backToLogin") as HTMLButtonElement;

    if (!registerBtn || !backToLoginBtn || !loginForm || !registerForm) {
      throw new Error("Missing one or more elements.");
    }

    registerBtn.addEventListener("click", () => {
      loginForm.style.display = "none"; 
      registerForm.style.display = "block";
    });

    backToLoginBtn.addEventListener("click", () => {
      registerForm.style.display = "none";
      loginForm.style.display = "block";
    });
  } catch (error) {
    console.error("Error switching forms:", error);
  }
}

function setupFormListeners() {
  const loginForm = document.getElementById("loginForm") as HTMLFormElement;
  const registerForm = document.getElementById("registerForm") as HTMLFormElement;

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => loginUser(event));
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (event) => registerUser(event));
  }
}

async function loginUser(event: Event) {
  event.preventDefault();

  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  try {
    const response = await fetch('/api/users/login-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Logged in successfully:', data);

      (document.getElementById("email") as HTMLInputElement).value = '';
      (document.getElementById("password") as HTMLInputElement).value = '';

      window.location.href = '/rooms';
    } else {
      console.error('Login failed:', data.message);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
}

async function registerUser(event: Event) {
  event.preventDefault();

  const username = (document.getElementById("username") as HTMLInputElement).value;
  const email = (document.getElementById("email-register") as HTMLInputElement).value;
  const password = (document.getElementById("password-register") as HTMLInputElement).value;
  const confirmPassword = (document.getElementById("confirm-password") as HTMLInputElement).value;

  if (password !== confirmPassword) {
    console.error("Passwords do not match!");
    return;
  }

  try {
    const response = await fetch('/api/users/register-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Registered successfully:', data);
      (document.getElementById("username") as HTMLInputElement).value = '';
      (document.getElementById("email-register") as HTMLInputElement).value = '';
      (document.getElementById("password-register") as HTMLInputElement).value = '';
      (document.getElementById("confirm-password") as HTMLInputElement).value = '';

      window.location.href = '/';
    } else {
      console.error('Registration failed:', data.message);
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
}
