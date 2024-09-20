const sendToRegiseration = () => window.location.pathname = `/signup`

const sendData = async () => {
  const email = document.getElementById(`emailInput`).value;
  const password = document.getElementById(`passwordInput`).value;
  
  try {
      let res = await fetch(`/home`, {
          headers: {
              "Content-Type": "application/json",
          },
          method: `post`,
          body: JSON.stringify({
              email,
              password,
          }),
      });
      
      let data = await res.json();
      
      if (data.error) {
          alert(data.error);
      } else {
          window.location.pathname = `/products`;
          localStorage.setItem(`loggedUser`, JSON.stringify(data));
      }
  } catch (error) {
      console.error("An error occurred:", error);
      alert("An error occurred. Please try again later.");
  }
}
