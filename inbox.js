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

      // Add the delete button to the row
      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.classList.add('btn', 'btn-danger');
      deleteButton.addEventListener('click', () => {
        // Remove the comment from the Firestore database
        commentsRef.doc(doc.id).delete()
          .then(() => {
            // Refresh the comment list to remove the deleted comment
            refreshComments();
          })
          .catch((error) => {
            console.error('Error deleting comment:', error);
          });
      });
      deleteCell.appendChild(deleteButton);
      commentRow.appendChild(deleteCell);

      // Add the row to the comment list
      document.getElementById('comment-list').appendChild(commentRow);
    });
  }).catch((error) => {
    console.error('Error getting comments:', error);
  });
}
// Call the refreshComments function to display the initial comments on page load
refreshComments(); 