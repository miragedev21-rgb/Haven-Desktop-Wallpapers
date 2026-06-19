const { signUpUser, loginUser, sendPasswordReset, updateUserPassword, deleteUserAccount } = require('./authService');

window.initAuthController = function() {
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const togglePasswordBtn = document.getElementById('btn-toggle-password');
  const loginBtn = document.getElementById('btn-login');
  const signupBtn = document.getElementById('btn-signup');
  const logoutBtn = document.getElementById('btn-logout');
  const errorStatus = document.getElementById('auth-error-status');
  
  const forgotPasswordLink = document.getElementById('link-forgot-password');
  const newPasswordInput = document.getElementById('settings-new-password');
  const changePasswordBtn = document.getElementById('btn-change-password');
  const deleteAccountBtn = document.getElementById('btn-delete-account');
  const submitWallpaperBtn = document.getElementById('btn-submit-wallpaper');
  const filePicker = document.getElementById('wallpaper-file-picker');

  // Eye Icon Password Toggle
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePasswordBtn.innerText = '🙈';
      } else {
        passwordInput.type = 'password';
        togglePasswordBtn.innerText = '👁️';
      }
    });
  }

  // System File Picker Core Router
  if (submitWallpaperBtn && filePicker) {
    submitWallpaperBtn.addEventListener('click', () => {
      filePicker.click();
    });

    filePicker.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        alert(`File Picker Stream Active!\nSelected File: ${file.name}\nSize: ${file.size} bytes`);
      }
    });
  }

  // Forgot Password Recovery Email Routine
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
      e.preventDefault();
      errorStatus.innerText = '';
      const email = emailInput.value.trim();

      if (!email) {
        errorStatus.style.color = '#ff4a4a';
        errorStatus.innerText = 'Please input your email address above to receive a reset link.';
        return;
      }

      try {
        await sendPasswordReset(email);
        errorStatus.style.color = '#4aff4a';
        errorStatus.innerText = 'Password recovery link successfully sent to your email!';
      } catch (err) {
        errorStatus.style.color = '#ff4a4a';
        errorStatus.innerText = `Reset Error: ${err.message}`;
      }
    });
  }

  // Change Password Account Settings Event
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener('click', async () => {
      errorStatus.innerText = '';
      const newPassword = newPasswordInput.value.trim();

      if (!newPassword || newPassword.length < 6) {
        errorStatus.style.color = '#ff4a4a';
        errorStatus.innerText = 'Password must be at least 6 characters long.';
        return;
      }

      try {
        await updateUserPassword(newPassword);
        errorStatus.style.color = '#4aff4a';
        errorStatus.innerText = 'Password successfully updated!';
        newPasswordInput.value = '';
      } catch (err) {
        errorStatus.style.color = '#ff4a4a';
        errorStatus.innerText = `Update Error: ${err.message}`;
      }
    });
  }

  // Account Self Deletion Hook Routine
  if (deleteAccountBtn) {
    deleteAccountBtn.addEventListener('click', async () => {
      const confirmDelete = confirm("Are you completely sure you want to permanently delete your account? This action cannot be undone.");
      if (!confirmDelete) return;

      try {
        await deleteUserAccount();
        alert('Your account has been deleted.');
        window.currentUser = null;
        if (typeof showDashboard === 'function') showDashboard();
      } catch (err) {
        errorStatus.style.color = '#ff4a4a';
        errorStatus.innerText = `Deletion Error: ${err.message}`;
      }
    });
  }

  // Sign Up Request Handling Flow
  if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
      errorStatus.innerText = '';
      errorStatus.style.color = '#ff4a4a';
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        errorStatus.innerText = 'Please enter both an email and password.';
        return;
      }

      try {
        await signUpUser(email, password);
        errorStatus.style.color = '#4aff4a';
        errorStatus.innerText = 'Account created successfully! An account confirmation email has been sent. You must click on the link in that email to confirm your account before you are able to log in.';
        passwordInput.value = '';
      } catch (err) {
        errorStatus.innerText = `Sign Up Error: ${err.message}`;
      }
    });
  }

  // Login Request Handling Flow
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      errorStatus.innerText = '';
      errorStatus.style.color = '#ff4a4a';
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        errorStatus.innerText = 'Please enter both an email and password.';
        return;
      }

      try {
        const result = await loginUser(email, password);
        window.currentUser = result.user;
        if (typeof showDashboard === 'function') showDashboard();
      } catch (err) {
        errorStatus.innerText = `Login Error: ${err.message}`;
      }
    });
  }

  // Log Out Handlers
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.currentUser = null;
      if (typeof showDashboard === 'function') showDashboard();
      alert('Logged out safely.');
    });
  }
};

// Initial binding pass execution
window.initAuthController();
