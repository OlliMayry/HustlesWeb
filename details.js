const db = firebase.firestore();

// Get the product ID from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');

// Reference to the product document with the given ID
const productRef = db.collection('products').doc(productId);

// Get the product data and display it in a Bootstrap table
productRef.get().then(doc => {
  if (doc.exists) {
    // Get the product data
    const productData = doc.data();

    // Define the table HTML code
    const tableHTML = `
      <table class="table table-dark table-striped">
        <tbody>
          <tr>
            <th scope="row">Product Name</th>
            <td>${productData.name}</td>
          </tr>
          <tr>
            <th scope="row">Details</th>
            <td>${productData.description}</td>
          </tr>
          <tr>
            <th scope="row">Hustler</th>
            <td>${productData.sellerName}</td>
          </tr>
          <tr>
            <th scope="row">Country</th>
            <td>${productData.country}</td>
          </tr>
          <tr>
            <th scope="row">Price</th>
            <td>${productData.price}€</td>
          </tr>
          <tr>
            <th scope="row">Image</th>
            <td><img src="${productData.image}" alt="${productData.name}" style="max-width: 100px;"></td>
          </tr>
        </tbody>
      </table>
    `;

    // Set the innerHTML of the container element to the table HTML code
    document.getElementById("details-container").innerHTML = tableHTML;
    // Get the "Add to Cart" button element
    var addToCartButton = document.getElementById("add-to-cart-btn");

    // Add click event listener to the "Add to Cart" button
    addToCartButton.addEventListener("click", function() {
      // Get the current cart items from localStorage
      var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

      // Add the current product to the cart items array
      cartItems.push({id: doc.id, name: productData.name, hustler: productData.sellerName, price: productData.price, image: productData.image});

      // Save the updated cart items to localStorage
      localStorage.setItem("cartItems", JSON.stringify(cartItems));

      // Display a success message to the user
      alert(productData.name + " has been added to your cart!");

      // Redirect the user to the cart page
      window.location.href = "cart.html";
    });

  } else {
    console.log('No such document!');
  }
}).catch(error => {
  console.log('Error getting document:', error);
});

firebase.auth().onAuthStateChanged(user => {
  if (!user) {
    // User is not signed in, redirect to login page
    window.location.href = 'login.html';
  }
});

// Create a reference to the comments collection in Firebase Firestore
const commentsRef = db.collection('products').doc(productId).collection('comments');

// Add event listener to the comment form submit button
document.getElementById('comment-form').addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from submitting

  // Get the comment text from the form input
  const commentText = document.getElementById('comment-text').value;

  // Create a new document in the comments collection with the comment text, the current user's ID, and the current timestamp
  commentsRef.add({
    text: commentText,
    username: firebase.auth().currentUser.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    // Clear the form input
    document.getElementById('comment-text').value = '';

    // Refresh the comment list to show the new comment
    refreshComments();
  })
  .catch((error) => {
    console.error('Error adding comment:', error);
  });
});

function refreshComments() {
  // Clear the current comments
  document.getElementById('comment-list').innerHTML = '';

  // Get the comments for the current product from Firebase Firestore
  commentsRef.orderBy('timestamp', 'desc').get().then((querySnapshot) => {

    querySnapshot.forEach((doc) => {
      // Create a new row for the comment
      const commentRow = document.createElement('tr');
    
      // Add the username to the row
      const usernameCell = document.createElement('td');
      const usernameText = document.createTextNode(doc.data().username + ' - ');
      usernameCell.appendChild(usernameText);
      commentRow.appendChild(usernameCell);
    
      // Add the comment text to the row
      const commentCell = document.createElement('td');
      const commentText = document.createTextNode(doc.data().text);
      commentCell.appendChild(commentText);
      commentRow.appendChild(commentCell);
    
      // Add the timestamp to the row
      const timestampCell = document.createElement('td');
      const timestamp = doc.data().timestamp.toDate().toLocaleString();
      const timestampText = document.createTextNode(timestamp);
      timestampCell.appendChild(timestampText);
      commentRow.appendChild(timestampCell);
    
      // Add the delete button to the row if the current user ID matches the comment author ID
      const currentUser = firebase.auth().currentUser;
      if (currentUser && doc.data().username === currentUser.displayName) {
        const deleteButtonCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        const deleteButtonText = document.createTextNode('Delete');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.appendChild(deleteButtonText);
        deleteButtonCell.appendChild(deleteButton);
        commentRow.appendChild(deleteButtonCell);

        // Add a click event listener to the delete button
        deleteButton.addEventListener('click', () => {
          // Delete the comment document from Firebase Firestore
          commentsRef.doc(doc.id).delete()
            .then(() => {
              console.log('Comment deleted successfully');
              // Refresh the comment list to remove the deleted comment
              refreshComments();
            })
            .catch((error) => {
              console.error('Error deleting comment:', error);
            });
        });
      }
    
      // Add the comment row to the table body
      document.getElementById('comment-list').appendChild(commentRow);
    });
  });
}


// Delete a comment by its ID
function deleteComment(commentId) {
  commentsRef.doc(commentId).delete().then(() => {
    console.log('Comment successfully deleted!');
    refreshComments();
  }).catch((error) => {
    console.error('Error deleting comment:', error);
  });
}
// Call the refreshComments function to display the initial comments on page load
refreshComments();


