const mainDiv = document.getElementById("products");

async function fetchProducts() {
  try {
    const response = await fetch("/add");
    const data = await response.json();
    let allProducts = data;

    allProducts.forEach((product) => {
      const productDiv = document.createElement("div");
      const productButton = document.createElement("button");
      productButton.textContent = ` ${product.name}, ${product.price}₪`;
      productButton.setAttribute("class", "product-button");
      productButton.dataset.price = product.price;
      mainDiv.append(productButton);
      productButton.addEventListener("click", handleProductClick);
      productDiv.appendChild(productButton);
      mainDiv.appendChild(productDiv);
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

fetchProducts();

let total = 0;
let productCount = 0;
let selectedProducts = [];

function handleProductClick(event) {
  const selectedPrice = parseFloat(event.target.dataset.price);
  const productName = event.target.textContent.trim().split(", ")[0];

  total += selectedPrice;
  productCount++;

  selectedProducts.push(productName);
  localStorage.setItem("total", total);
  localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  localStorage.setItem("productCount", productCount);
}

const productButtons = document.querySelectorAll(".product-button");
productButtons.forEach((button) => {
  button.addEventListener("click", handleProductClick);
});

function sortByName() {
  const buttons = Array.from(mainDiv.querySelectorAll(".product-button"));
  buttons.sort((a, b) => {
    const nameA = a.textContent.split(",")[0];
    const nameB = b.textContent.split(",")[0];
    return nameA.localeCompare(nameB);
  });
  mainDiv.innerHTML = "";
  buttons.forEach((button, index) => {
    mainDiv.appendChild(button);
  });
}

function sortByPrice() {
  const buttons = Array.from(mainDiv.querySelectorAll(".product-button"));
  buttons.sort((a, b) => {
    const priceA = parseFloat(a.textContent.split(",")[1]);
    const priceB = parseFloat(b.textContent.split(",")[1]);
    return priceA - priceB;
  });
  mainDiv.innerHTML = "";
  buttons.forEach((button, index) => {
    mainDiv.appendChild(button);
  });
}

document.getElementById("sortBtn").addEventListener("click", function () {
  const sortBy = document.getElementById("serchOptions").value;
  if (sortBy === "name") {
    sortByName();
  } else if (sortBy === "price") {
    sortByPrice();
  }
});

function filterProducts() {
  const filterValue = document
    .getElementById("filterInput")
    .value.toLowerCase();
  const buttons = Array.from(mainDiv.querySelectorAll(".product-button"));

  buttons.forEach((button) => {
    const productName = button.textContent.toLowerCase();
    if (productName.includes(filterValue)) {
      button.style.display = "inline-block";
    } else {
      button.style.display = "none";
    }
  });
}

document.getElementById("filterInput")
document.addEventListener("input", filterProducts);

const sendToPayment = () => (window.location.pathname = "/buy");








