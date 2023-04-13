/* // Add an onAuthStateChanged event listener to Firebase Auth
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      console.log(user);
  
      // Show the logout link and hide the login and register links
      document.getElementById('logout-link').style.display = 'block';
      document.getElementById('login-link').style.display = 'none';
      document.getElementById('register-link').style.display = 'none';
    } else {
      // User is signed out
      console.log('User is signed out');
  
      // Hide the logout link and show the login and register links
      document.getElementById('logout-link').style.display = 'none';
      document.getElementById('login-link').style.display = 'block';
      document.getElementById('register-link').style.display = 'block';
    }
  });  */
// Get the form element
const loginForm = document.getElementById('login');

// Add a submit event listener to the form
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the email and password input values
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  // Sign in the user with Firebase Authentication
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // User signed in successfully
      const user = userCredential.user;
      console.log(user);

      // Redirect the user to index.html
      window.location.href = 'index.html';
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
});