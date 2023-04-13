// Get a reference to the form and add a submit event listener
const registerForm = document.getElementById('register');
registerForm.addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the user input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Verify that the password and confirm password match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Create the user in Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Update the user's display name
            const user = userCredential.user;
            user.updateProfile({
                displayName: name
            }).then(() => {
                // User display name updated successfully
                console.log('User created successfully:', user);
                 // Redirect the user to the index.html page
            window.location.href = "index.html";
            }).catch((error) => {
                console.error('Error updating user display name:', error);
            });
        })
        .catch((error) => {
            // Handle errors during user creation
            console.error('Error creating user:', error);
            alert('Error creating user. Please try again later.');
        });
});