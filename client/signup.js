const sendData = async () => {
  const userName = document.getElementById(`userNameInput`).value;
  const email = document.getElementById(`emailInput`).value;
  const password = document.getElementById(`passwordInput`).value;
  try {
    if (userName.length < 3) return alert(`user name too short`);
    if (!email.includes(`@`)) return alert(`@ is missing`);
    if (password.length < 3 || password.length > 8) return alert(`password length need to be between 3-8`);

    let res = await fetch(`/signup`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: `post`,
      body: JSON.stringify({
        userName,
        email,
        password,
      }),
    });
    let data = await res.json();


    if (data.error) {
      alert(data.error);
    } else {
      alert(data.message);
      window.location.pathname = "/home";
    }

  } catch (error) {
    console.error(error);
  }
};
