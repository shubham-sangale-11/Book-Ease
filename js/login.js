document.getElementById("loginForm").addEventListener("submit", login);

function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const API_KEY = 'AIzaSyA5p23N3mNungeP8Y0z7v3kRvGgU9jS_CE';

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password,
            returnSecureToken: true
        })
    };

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, requestOptions)
        .then(resp => resp.json())
        .then(res => {
            if (res.idToken) {
                // Successful login, redirect user to books.html
                window.location.href = 'dashboard.html';
            } else {
                // Handle login error
                alert(res.error.message || "Login failed");
            }
        })
        .catch(err => console.error("Error:", err));
}