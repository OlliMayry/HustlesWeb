firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // User is signed in, get their name and email
    const name = user.displayName;
    const email = user.email;

    // Update the HTML elements with the user's data
    document.getElementById('user-name').textContent = name;
    document.getElementById('user-email').textContent = email;

    // Call a function to display the user's products
    displayProducts(user);
  } else {
    // User is not signed in, redirect to login page
    window.location.href = 'login.html';
  }
});

function displayProducts(user) {
  // Get references to the HTML elements
  const productList = document.getElementById('product-list');

  user.getIdToken()
    .then((idToken) => {
      // Query the products collection to get the user's products
      const db = firebase.firestore();
      db.collection("products").where("sellerId", "==", user.uid)
        .get()
        .then((querySnapshot) => {
          // Create a table to display the products
          const productTable = document.createElement('table');
          productTable.classList.add('table', 'table-dark', 'table-striped');
          productTable.innerHTML = `
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Description</th>
                <th scope="col">Country</th>
                <th scope="col">Price</th>
                <th scope="col">Image</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody></tbody>
          `;
          productList.appendChild(productTable);

          // Loop through each product and add a row to the table
          const productTableBody = productTable.querySelector('tbody');
          querySnapshot.forEach((doc) => {
            const product = doc.data();
            const productRow = document.createElement('tr');
            productRow.id = `product-row-${doc.id}`; // Step 1
            productRow.classList.add('product-row'); // Step 2
            productRow.innerHTML = `
              <td>${product.name}</td>
              <td>${product.description}</td>
              <td>${product.country}</td>
              <td>${product.price}€</td>              
              <td><img src="${product.image}" alt="${product.name}" class="product-image" style="max-width: 100px;"></td>
              <td>
                <button type="button" class="btn btn-success edit-product" data-product-id="${doc.id}">Edit</button>
                <button type="button" class="btn btn-success details-product" data-product-id="${doc.id}">Details</button>
                <button type="button" class="btn btn-danger remove-product" data-product-id="${doc.id}">Remove</button>
              </td>
            `;
            productTableBody.appendChild(productRow);
          });

      // Select all edit and remove buttons
const editButtons = document.querySelectorAll(".edit-product");
const detailsButtons = document.querySelectorAll(".details-product");
const removeButtons = document.querySelectorAll(".remove-product");

// Attach click event listener to each edit button
editButtons.forEach((button) => {
  const productId = button.getAttribute("data-product-id");
  button.addEventListener("click", function() {
    // Redirect to the edit page with the product ID in the query string
    window.location.href = `edit.html?productId=${productId}`;
  });
});

// Attach click event listener to each remove button
removeButtons.forEach((button) => {
  const productId = button.getAttribute("data-product-id");
  button.addEventListener("click", function() {
    // Remove the product from Firebase
    db.collection("products").doc(productId).delete()
      .then(() => {
        // Remove the product row from the table
        const productRow = document.getElementById(`product-row-${productId}`);
        productRow.parentNode.removeChild(productRow);
      })
      .catch((error) => {
        console.error(error);
        alert("Error removing product.");
      });
  });
});

// Attach click event listener to each details button
detailsButtons.forEach((button) => {
  const productId = button.getAttribute("data-product-id");
  button.addEventListener("click", function() {
    // Redirect to the inbox page with the product ID in the query string
    window.location.href = `inbox.html?productId=${productId}`;
  });
});


        })
        .catch((error) => {
          console.error(error);
          alert("Error getting products.");
        });
    })
    .catch((error) => {
      console.error(error);
      alert("Error getting user ID token.");
    });
}

