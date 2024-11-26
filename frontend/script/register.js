let baseUrl = `http://localhost:5000`;

// Selecting role buttons
let mentorBtn = document.getElementById("mentor");
let menteeBtn = document.getElementById("mentee");

// Event listener for Mentor button
mentorBtn.addEventListener("click", () => {
    let mentorForm = document.querySelector(".mentorDetail form");
    let menteeForm = document.querySelector(".menteeDetail form");
    mentorForm.style.display = "flex";
    menteeForm.style.display = "none";
});

// Event listener for Mentee button
menteeBtn.addEventListener("click", () => {
    let mentorForm = document.querySelector(".mentorDetail form");
    let menteeForm = document.querySelector(".menteeDetail form");
    mentorForm.style.display = "none";
    menteeForm.style.display = "flex";
});

// Mentee registration form submission
let menteeRegisterForm = document.querySelector(".menteeDetail form");

menteeRegisterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let name = document.getElementById("nameMentee").value;
    let email = document.getElementById("emailMentee").value;
    let currentLocation = document.getElementById("locationMentee").value;
    let password = document.getElementById("passwordMentee").value;
    let obj = {
        name,
        email,
        password,
        role: "mentee",
        location: currentLocation
    };
    registerNewUser(obj);
});

// Mentor registration form submission
let mentorRegisterForm = document.querySelector(".mentorDetail form");

mentorRegisterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let name = document.getElementById("nameMentor").value;
    let email = document.getElementById("emailMentor").value;
    let currentLocation = document.getElementById("locationMentor").value;
    let password = document.getElementById("passwordMentor").value;
    let expertise = document.getElementById("expertise").value;
    let meetLink = document.getElementById("meetLink").value; // Capturing the meet link
    
    // Creating the object with the Google Meet link included
    let obj = {
        name,
        email,
        password,
        role: "mentor",
        location: currentLocation,
        expertise,
        meetLink // Adding the meetLink to the object
    };
    
    registerNewUser(obj);
});


// Function to register a new user
async function registerNewUser(obj) {
    try {
        let res = await fetch(`${baseUrl}/user/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        });
        let out = await res.json();
        alert(out.msg);
        if (out.msg === "Successfully registered") {
            // Redirect to login page after successful registration
            window.location.href = "./login.html";
        }
    } catch (error) {
        console.log("Error while registering from frontend");
        alert("Error while registering");
    }
}

// Handling visibility of Login, Register, and Logout buttons
let token = sessionStorage.getItem("token");
const logoutBtn = document.querySelector(".logoutButton");
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

