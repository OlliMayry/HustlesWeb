firebase.auth().onAuthStateChanged(user => {
    const loginLink = document.getElementById('login-link');
    const registerLink = document.getElementById('register-link');
    const logoutLink = document.getElementById('logout-link');
    const accountLink = document.getElementById('account-link');
    const productsLink = document.getElementById('products-link');
    const cartLink = document.getElementById('cart-link');
  
    if (user) {
      // User is logged in
      loginLink.style.display = 'none';
      registerLink.style.display = 'none';
      logoutLink.style.display = 'block';
      accountLink.style.display = 'block';
      productsLink.style.display = 'block';
      cartLink.style.display = 'block';
  
      // Add a click event listener to the logout button
      const logoutButton = document.getElementById('logout-button');
      logoutButton.addEventListener('click', () => {
        firebase.auth().signOut().then(() => {
          // User signed out successfully
          window.location.href = 'index.html';
        }).catch((error) => {
          // Handle errors
          console.log(error);
        });
      });
    } else {
      // User is not logged in
      loginLink.style.display = 'block';
      registerLink.style.display = 'block';
      logoutLink.style.display = 'none';
      accountLink.style.display = 'none';
      productsLink.style.display = 'none';
      cartLink.style.display = 'none';
    }
  });