let baseUrl = `http://localhost:5000`; 

let mentorContainer = document.querySelector("#mentorContainer");
let searchBtn = document.getElementById("searchBtn");
let mentorLocation = document.getElementById("mentorLocation");
let expertise = document.getElementById("expertise");
let token = sessionStorage.getItem("token");


const logoutBtn = document.querySelector(".logoutButton");

async function getAllMentors() {
    try {
        let res = await fetch(`${baseUrl}/user/mentors`);
        let out = await res.json();
        displayMentorData(out.data);
    } catch (error) {
        console.log(error);
    }
}

getAllMentors();

function displayMentorData(data) {
    mentorContainer.innerHTML = ""; 
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


searchBtn.addEventListener("click", () => {
    let searchValue = mentorLocation.value;
    fetchMentorsBasedOnLocation(searchValue);
});


expertise.addEventListener("change", () => {
    let searchValue = expertise.value;
    if (searchValue === "") {
        getAllMentors(); 
    } else {
        fetchMentorsBasedOnExpertise(searchValue);
    }
});


async function fetchMentorsBasedOnLocation(location) {
    try {
        let res = await fetch(`${baseUrl}/user/mentors/${location}`);
        let out = await res.json();
        displayMentorData(out.data);
    } catch (error) {
        console.log(error);
    }
}


async function fetchMentorsBasedOnExpertise(expertise) {
    try {
        let res = await fetch(`${baseUrl}/user/mentors/expertise/${expertise}`);
        let out = await res.json();
        displayMentorData(out.data);
    } catch (error) {
        console.log(error);
    }
}


function addAppointmentEventListeners() {
    let appointmentBtns = document.querySelectorAll(".btn");
    
    for (let appointmentBtn of appointmentBtns) {
        appointmentBtn.addEventListener("click", (e) => {
            let id = e.target.dataset.id;
            sessionStorage.setItem("mentorId", id); 
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
            
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('name');

         
            Swal.fire({
                title: 'Logged out',
                text: data.msg,
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
               setTimeout(() => {
                window.location.href = './login.html';
            }, 1000); 
            });
        } else {
           
            Swal.fire({
                title: 'Error',
                text: data.msg,
                icon: 'error',
                confirmButtonText: 'OK'
            }).then(() => {
               setTimeout(() => {
                window.location.href = './login.html';
            }, 1000); 
            });
        }
    } catch (error) {
        console.error('Error while logging out:', error);

       
        Swal.fire({
            title: 'Error',
            text: 'Error while logging out.',
            icon: 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            setTimeout(() => {
                window.location.href = './login.html';
            }, 1000); 
        });
    }
});
