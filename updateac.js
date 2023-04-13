firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = 'login.html';
    }
  });

// Add a listener to the "Update" button
document.getElementById('update-btn').addEventListener('click', (e) => {
    e.preventDefault();
  
    // Get the user's input values
    const newName = document.getElementById('name').value.trim();
    const newEmail = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
  
    // Check if the new password and confirmation password match
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    // Validate inputs
    if (newName === '' || !isValidEmail(newEmail)) {
      alert('Please enter valid input!');
      return;
    }
  
    // Get the current user
    const user = firebase.auth().currentUser;
  
    // Update the user's profile
    user.updateProfile({
      displayName: newName,
    }).then(() => {
      console.log('User profile updated successfully');
    }).catch((error) => {
      console.log(error.message);
    });
  
    // Update the user's email
    user.updateEmail(newEmail).then(() => {
      console.log('User email updated successfully');
    }).catch((error) => {
      console.log(error.message);
    });
  
    // Update the user's password
    if (newPassword !== '') {
      user.updatePassword(newPassword).then(() => {
        console.log('User password updated successfully');
      }).catch((error) => {
        console.log(error.message);
      });
    }
  });
  
  // Function to validate email input
  function isValidEmail(email) {
    // Source: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }