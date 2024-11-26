let baseUrl = `http://localhost:5000`; // Base URL of your API

let mentorContainer = document.querySelector("#mentorContainer");
let searchBtn = document.getElementById("searchBtn");
let mentorLocation = document.getElementById("mentorLocation");
let expertise = document.getElementById("expertise");
let token = sessionStorage.getItem("token");

// Selecting elements for login, register, and logout buttons

const logoutBtn = document.querySelector(".logoutButton");

// Function to get all mentors
async function getAllMentors() {
    try {
        let res = await fetch(`${baseUrl}/user/mentors`);
        let out = await res.json();
        displayMentorData(out.data);
    } catch (error) {
        console.log(error);
    }
}

// Initial call to fetch and display all mentors
getAllMentors();

// Function to display mentors in the container
function displayMentorData(data) {
    mentorContainer.innerHTML = ""; // Clear previous data
    mentorContainer.innerHTML = `
        ${data.map((elem) => {
            return `
            <div class="box">
                <h3>Name: ${elem.name}</h3>
                <h3>Email: ${elem.email}</h3>
                <h3>Location: ${elem.location}</h3>
                <h3>Expertise: ${elem.expertise}</h3>
                <a href="./bookAppointment.html" class="btn" data-id=${elem._id}>Book Appointment</a>
            </div>
            `;
        }).join("")}
    `;
    addAppointmentEventListeners();
}

// Event listener for search button (filter by location)
searchBtn.addEventListener("click", () => {
    let searchValue = mentorLocation.value;
    fetchMentorsBasedOnLocation(searchValue);
});

// Event listener for expertise dropdown (filter by expertise)
expertise.addEventListener("change", () => {
    let searchValue = expertise.value;
    if (searchValue === "") {
        getAllMentors(); // If no expertise selected, get all mentors
    } else {
        fetchMentorsBasedOnExpertise(searchValue);
    }
});

// Fetch mentors based on location
async function fetchMentorsBasedOnLocation(location) {
    try {
        let res = await fetch(`${baseUrl}/user/mentors/location/${location}`);
        let out = await res.json();
        displayMentorData(out.data);
    } catch (error) {
        console.log(error);
    }
}

// Fetch mentors based on expertise
async function fetchMentorsBasedOnExpertise(expertise) {
    try {
        let res = await fetch(`${baseUrl}/user/mentors/expertise/${expertise}`);
        let out = await res.json();
        displayMentorData(out.data);
    } catch (error) {
        console.log(error);
    }
}

// Add event listeners to the "Book Appointment" buttons
function addAppointmentEventListeners() {
    let appointmentBtns = document.querySelectorAll(".btn");
    
    for (let appointmentBtn of appointmentBtns) {
        appointmentBtn.addEventListener("click", (e) => {
            let id = e.target.dataset.id;
            sessionStorage.setItem("mentorId", id); // Store mentor ID in sessionStorage for later use
        });
    }
} 
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