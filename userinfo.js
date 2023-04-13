  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in, get their name and email
      const name = user.displayName;
      const email = user.email;
  
      // Update the HTML elements with the user's data
      document.getElementById('user-name').textContent = name;
      document.getElementById('user-email').textContent = email;
    } else {
      // User is not signed in, redirect to login page
      window.location.href = 'login.html';
    }
  }); 

  document.getElementById('update-button').addEventListener('click', () => {
    window.location.href = 'updateac.html';
  });