document.body.style.opacity = "0";
document.addEventListener("DOMContentLoaded", () => {
  onSwitchToLogin();
  setupFormListeners();
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 300)
});

function onSwitchToLogin()
{
  const loginForm = document.getElementById("loginForm") as HTMLElement;
  const registerForm = document.getElementById("registerForm") as HTMLElement;
  const backToLoginForm = document.getElementById("backToLoginForm") as HTMLElement;
  const backToRegisterForm = document.getElementById("backToRegisterForm") as HTMLElement;
  const container = document.getElementById("form-container") as HTMLElement;

  container.style.opacity = "0";
  setTimeout(() => {
    loginForm.style.display = "block";
    backToRegisterForm.style.display = "block";
    backToLoginForm.style.display = "none";
    registerForm.style.display = "none";

    container.style.opacity = "1";
  }, 300)
}

function onSwitchToRegister()
{
  const loginForm = document.getElementById("loginForm") as HTMLElement;
  const registerForm = document.getElementById("registerForm") as HTMLElement;
  const backToLoginForm = document.getElementById("backToLoginForm") as HTMLElement;
  const backToRegisterForm = document.getElementById("backToRegisterForm") as HTMLElement;
  const container = document.getElementById("form-container") as HTMLElement;

  container.style.opacity = "0";
  setTimeout(() => {
    loginForm.style.display = "none";
    backToRegisterForm.style.display = "none";
    backToLoginForm.style.display = "block";
    registerForm.style.display = "block";
    container.style.opacity = "1";
  }, 300)
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

      const container = document.getElementById("form-container") as HTMLElement;

      container.style.opacity = "0";
      setTimeout(() => {
        window.location.href = '/rooms';
        container.style.opacity = "1";
      }, 300)
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