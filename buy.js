// Get the Firestore database object
var db = firebase.firestore();

// Reference to the products collection
var productsRef = db.collection("products");

// Query the products collection and get all products
productsRef.get().then((querySnapshot) => {
  // Define the table HTML code
  var tableHTML = `
    <table class="table table-dark table-striped">
      <thead>
        <tr>
          <th scope="col">Product Name</th>
          <th scope="col">Description</th>
          <th scope="col">Country</th>
          <th scope="col">Price</th>
          <th scope="col">Image</th>
        </tr>
      </thead>
      <tbody>
  `;

  // Loop through the products and add each product to the table
  querySnapshot.forEach((doc) => {
    var product = doc.data();
    var productId = doc.id;
    tableHTML += `
      <tr class="product-row" data-product-id="${productId}">
        <td>${product.name}</td>
        <td>${product.description}</td>
        <td>${product.country}</td>
        <td>${product.price}€</td>
        <td><img src="${product.image}" alt="${product.name}" style="max-width: 100px;"></td>
      </tr>
    `;
  });

  // Close the table HTML code
  tableHTML += `
      </tbody>
    </table>
  `;

  // Set the innerHTML of the container element to the table HTML code
  document.getElementById("products-container").innerHTML = tableHTML;

  // Add click event listener to each product row
  var productRows = document.querySelectorAll(".product-row");
  productRows.forEach((row) => {
    var productId = row.getAttribute("data-product-id");
    row.addEventListener("click", function() {
      window.location.href = "details.html?productId=" + productId;
    });
  });
}).catch((error) => {
  console.error("Error getting products: ", error);
});