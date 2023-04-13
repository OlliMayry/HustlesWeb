/* firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in, get their user ID and the product ID from the query string
    const userId = user.uid;
    const queryParams = new URLSearchParams(window.location.search);
    const productId = queryParams.get('productId');

    // Get references to the form and input fields
    const editForm = document.getElementById('edit-form');
    const nameInput = document.getElementById('name-input');
    const descriptionInput = document.getElementById('description-input');
    const countryInput = document.getElementById('country-input');
    const priceInput = document.getElementById('price-input');
    const imageInput = document.getElementById('image-input');

    // Use the product ID to fetch the current product data from Firebase
    const db = firebase.firestore();
    db.collection('products').doc(productId)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().sellerId === userId) {
          // If the product exists and belongs to the user, populate the form with the data
          const data = doc.data();
          nameInput.value = data.name;
          descriptionInput.value = data.description;
          countryInput.value = data.country;
          priceInput.value = data.price;
          imageInput.src = data.image;

          // Attach a change event listener to the image input field
          if (imageInput) {
            imageInput.addEventListener('change', (event) => {
              const file = event.target.files[0];
              const storageRef = firebase.storage().ref(`products/${productId}/${file.name}`);
              const task = storageRef.put(file);

              // Update the product data in Firebase after the image has been uploaded
              task.then((snapshot) => {
                snapshot.ref.getDownloadURL().then((downloadURL) => {
                  db.collection('products').doc(productId)
                    .update({ image: downloadURL })
                    .then(() => {
                      productImage.src = downloadURL;
                      alert('Product image updated successfully.');
                    })
                    .catch((error) => {
                      console.error(error);
                      alert('Error updating product image.');
                    });
                });
              });
            });
          }

          // Attach a submit event listener to the form
          editForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Update the product data in Firebase
            db.collection('products').doc(productId)
              .update({
                name: nameInput.value,
                description: descriptionInput.value,
                country: countryInput.value,
                price: priceInput.value,
              })
              .then(() => {
                alert('Product updated successfully.');
                window.location.href = 'products.html';
              })
              .catch((error) => {
                console.error(error);
                alert('Error updating product.');
              });
          });
        } else {
          // If the product doesn't exist or doesn't belong to the user, redirect to the products page
          window.location.href = 'products.html';
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Error getting product data.');
      });
  } else {
    // User is not signed in, redirect to login page
    window.location.href = 'login.html';
  }
}); */

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in, get their user ID and the product ID from the query string
    const userId = user.uid;
    const queryParams = new URLSearchParams(window.location.search);
    const productId = queryParams.get('productId');

    // Get references to the form and input fields
    const editForm = document.getElementById('edit-form');
    const nameInput = document.getElementById('name-input');
    const descriptionInput = document.getElementById('description-input');
    const countryInput = document.getElementById('country-input');
    const priceInput = document.getElementById('price-input');
    const imageInput = document.getElementById('image-input');
    const productImage = document.getElementById('product-image');

    // Use the product ID to fetch the current product data from Firebase
    const db = firebase.firestore();
    db.collection('products').doc(productId)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().sellerId === userId) {
          // If the product exists and belongs to the user, populate the form with the data
          const data = doc.data();
          nameInput.value = data.name;
          descriptionInput.value = data.description;
          countryInput.value = data.country;
          priceInput.value = data.price;
          productImage.src = data.image;

          // Attach a change event listener to the image input field
          if (imageInput) {
            imageInput.addEventListener('change', (event) => {
              const file = event.target.files[0];
              const storageRef = firebase.storage().ref(`product-images/${file.name}`);
              const uploadTask = storageRef.put(file);
              
              // Get the download URL of the image from Firebase Storage
              uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
                .then((downloadURL) => {
                  // Update the product data in Firebase after the image has been uploaded
                  db.collection('products').doc(productId)
                    .update({
                      image: downloadURL
                    })
                    .then(() => {
                      productImage.src = downloadURL;
                      alert('Product image updated successfully.');
                    })
                    .catch((error) => {
                      console.error(error);
                      alert('Error updating product image.');
                    });
                })
                .catch((error) => {
                  console.error(error);
                  alert('Error getting download URL.');
                });
            });
          }

          // Attach a submit event listener to the form
          editForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Update the product data in Firebase
            db.collection('products').doc(productId)
              .update({
                name: nameInput.value,
                description: descriptionInput.value,
                country: countryInput.value,
                price: priceInput.value,
              })
              .then(() => {
                alert('Product updated successfully.');
                window.location.href = 'products.html';
              })
              .catch((error) => {
                console.error(error);
                alert('Error updating product.');
              });
          });
        } else {
          alert('Product not found or does not belong to this user.');
          window.location.href = 'products.html';
        }
      })
      .catch((error) => {
        console.error(error);
        alert('Error getting product data.');
        window.location.href = 'products.html';
      });
  } else {
    // User is not signed in, redirect to login page
    window.location.href = 'login.html';
  }
});
