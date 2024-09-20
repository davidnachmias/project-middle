const total = localStorage.getItem("total");
const amountOfProducts = localStorage.getItem("productCount");
const selectedProductsString = localStorage.getItem("selectedProducts");
const correctString =  selectedProductsString.slice(1, selectedProductsString.length-1)
const userData = JSON.parse(localStorage.getItem(`loggedUser`))
console.log(userData)
const selectedProducts = JSON.parse(selectedProductsString);


function addingClientDetails() {
  const detailsDiv = document.getElementById("detailsToClient");
  const productsAmountDiv = document.createElement("h4");
  const totalAmountDiv = document.createElement("h4");
  productsAmountDiv.textContent = `Total products: ${amountOfProducts}`;
  totalAmountDiv.textContent = `Total price is : ${total} ₪`;
  productsAmountDiv.classList.add("product-details");
  totalAmountDiv.classList.add("product-details");
  detailsDiv.appendChild(productsAmountDiv);
  detailsDiv.appendChild(totalAmountDiv);
}

addingClientDetails();


const sendData = async () => {
  try {
      let res = await fetch(`/payment`, {
          headers: {
              "Content-Type": "application/json",
          },
          method: `post`,
          body: JSON.stringify({
              userName: userData.email,
              productname: correctString
          }),
      });

      let data = await res.json();

      if (res.ok) {
          alert(data.message);
      } else {
          throw new Error(data.error);
      }
  } catch (error) {
      alert("An error occurred: " + error.message);
  }
}
