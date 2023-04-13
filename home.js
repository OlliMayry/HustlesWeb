// Get the Firestore database object
var db = firebase.firestore();

// Get a reference to the Firebase Firestore collection
const productsCollection = firebase.firestore().collection("products");

// Get a reference to the HTML element where the Bootstrap cards will be displayed
const productCardsContainer = document.getElementById("product-cards");

// Initialize a counter to keep track of the number of products in the current row
var productCount = 0;

// Loop through the products retrieved from Firestore and create a Bootstrap card for each product
productsCollection.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    const product = doc.data();
    const productId = doc.id;
    
    // If this is the first product in a row, start a new row
    if (productCount === 0) {
      productCardsContainer.innerHTML += '<div class="row">';
    }

    const card = `
      <div class="col-sm-4">
        <div class="card product-card bg-dark" data-product-id="${productId}">
        <div class="circle-image">
          <img src="${product.image}" alt="${product.name}" style="border-radius:50%;
          width:100px;
          height:100px;">
          </div>
          <div class="card-body">
            <h5 class="card-title text-white">${product.name}</h5>
            <p class="card-text text-white style="max-width: auto;">${product.description}</p>
            <p class="card-text text-white">${product.price}€</p>
          </div>
        </div>
      </div>
    `;
    productCardsContainer.innerHTML += card;

    // Increment the product count for the current row
    productCount++;

    // If this is the third product in a row, close the row
    if (productCount === 3) {
      productCardsContainer.innerHTML += '</div>';
      productCount = 0;
    }
  });

  // Apply different styles for mobile screens
  const mediaQuery = window.matchMedia("(max-width: 576px)");
  if (mediaQuery.matches) {
    productCardsContainer.style.display = "block";
    productCardsContainer.style.textAlign = "center";
  }

  // Add click event listener to each product card
  var productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    var productId = card.getAttribute("data-product-id");
    card.addEventListener("click", function() {
      window.location.href = "details.html?productId=" + productId;
    });
  });

}).catch((error) => {
  console.error("Error getting products: ", error);
});


