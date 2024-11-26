let baseUrl = `http://localhost:5000`;

// Login Form Submission
let formLogin = document.querySelector(".loginContainer");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = document.getElementById("userEmail").value;
    let password = document.getElementById("userPassword").value;
    let obj = {
        email,
        password
    };
    loginUser(obj);
});

async function loginUser(obj) {
    try {
        let res = await fetch(`${baseUrl}/user/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });
        let out = await res.json();
        
        // Store user details in sessionStorage
        sessionStorage.setItem("token", out.token);
        sessionStorage.setItem("role", out.role);
        sessionStorage.setItem("name", out.name);

        console.log(out.role, out.name);
        alert(out.msg);

        if (out.msg === "Login Success") {
            // Redirect to Booking page on successful login
            window.location.href = "./Booking.html";
        }
    } catch (error) {
        console.log("Error while login from frontend");
        alert("Error while login");
    }
}


    const logoutBtn = document.querySelector(".logoutButton");

   
let token = sessionStorage.getItem("token");
    // Logout button click handler
    logoutBtn.addEventListener('click', async function () {
        if (!token) return;

        try {
            const response = await fetch(`${baseUrl}/user/logout`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Clear sessionStorage
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('role');
                sessionStorage.removeItem('name');

                alert(data.msg); // Alert user about successful logout

                // Redirect to the login page
                window.location.href = './login.html';
            } else {
                // If there was an error during logout
                alert(data.msg);
                window.location.href = './login.html';
            }
        } catch (error) {
            console.error('Error while logging out:', error);
            alert('Error while logging out.');
            window.location.href = './login.html';
        }
    });

