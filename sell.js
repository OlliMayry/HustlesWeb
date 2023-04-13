 firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in, get their name and email
    const name = user.displayName;
    const email = user.email;

    // Update the hidden input fields with the user's data
    document.getElementById('user-name').value = name;
    document.getElementById('user-email').value = email;

    document.getElementById('selling-form').style.display = 'flex';
  } else {
    // User is not signed in, redirect to login page
    window.location.href = 'login.html';
  }
});

// Get the selling form
const sellingForm = document.getElementById("selling-form");

const countryInput = document.getElementById("product-country");

// Add submit event listener to the selling form
sellingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  
  // Get the user's ID token
  const user = firebase.auth().currentUser;
  
  if (!user) {
    alert("You must be logged in to sell a product.");
    return;
  }
  
  user.getIdToken()
    .then((idToken) => {
      // Get the form data
      const formData = new FormData(sellingForm);
      
      // Upload the image to Firebase Storage
      const imageFile = formData.get("product-image");
      const storageRef = firebase.storage().ref(`product-images/${imageFile.name}`);
      const uploadTask = storageRef.put(imageFile);
      
      // Get the download URL of the image from Firebase Storage
      uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        .then((downloadURL) => {

          // Create a new product in Firebase Firestore
          const db = firebase.firestore();
          db.collection("products").add({
            name: formData.get("product-name"),
            description: formData.get("product-description"),
            country: formData.get("product-country"),
            price: parseInt(formData.get("product-price")),
            image: downloadURL,
            sellerId: user.uid,
            sellerName: user.displayName,
            sellerEmail: user.email
          })
          .then(() => {
            // Success message
            alert("Product successfully added!");
            sellingForm.reset();
            console.log("Product successfully added!");
            window.location.replace("products.html");
          })
          .catch((error) => {
            console.error(error);
            alert("Error adding product.");
          });
        })
        .catch((error) => {
          console.error(error);
          alert("Error getting download URL.");
        });
    })
    .catch((error) => {
      console.error(error);
      alert("Error getting user ID token.");
    });
}); 

