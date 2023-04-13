// Get the cart items from localStorage
var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Define the table HTML code
var tableHTML = `
  <table class="table table-dark">
    <thead>
      <tr>
        <th scope="col">Product Name</th>
        <th scope="col">Hustler</th>
        <th scope="col">Price</th>
        <th scope="col">Image</th>
        <th scope="col"></th>
      </tr>
    </thead>
    <tbody>
`;

// Loop through the cart items and add each item to the table
cartItems.forEach((item) => {
  tableHTML += `
    <tr>
      <td>${item.name}</td>
      <td>${item.hustler}</td>
      <td>${item.price}</td>
      <td><img src="${item.image}" alt="${item.name}" style="max-width: 100px;"></td>
      <td>
        <button class="btn btn-danger remove-button" data-id="${item.id}">Remove</button>
      </td>
    </tr>
  `;
});

// Close the table HTML code
tableHTML += `
    </tbody>
  </table>
`;

// Set the innerHTML of the cart container element to the table HTML code
document.getElementById("cart-container").innerHTML = tableHTML;

// Add click event listener to each remove button
var removeButtons = document.querySelectorAll(".remove-button");
removeButtons.forEach((button) => {
  button.addEventListener("click", function() {
    // Get the id of the product to remove
    var idToRemove = button.getAttribute("data-id");

    // Filter out the product with the idToRemove from the cart items array
    var updatedCartItems = cartItems.filter((item) => {
      return item.id !== idToRemove;
    });

    // Save the updated cart items to localStorage
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    // Reload the page to display the updated cart
    location.reload();
  });
});