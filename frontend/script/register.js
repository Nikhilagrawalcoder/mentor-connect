let baseUrl = `http://localhost:5000`;

let mentorBtn = document.getElementById("mentor");
let menteeBtn = document.getElementById("mentee");

mentorBtn.addEventListener("click", () => {
    let mentorForm = document.querySelector(".mentorDetail form");
    let menteeForm = document.querySelector(".menteeDetail form");
    mentorForm.style.display = "flex";
    menteeForm.style.display = "none";
});

menteeBtn.addEventListener("click", () => {
    let mentorForm = document.querySelector(".mentorDetail form");
    let menteeForm = document.querySelector(".menteeDetail form");
    mentorForm.style.display = "none";
    menteeForm.style.display = "flex";
});

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

let mentorRegisterForm = document.querySelector(".mentorDetail form");

mentorRegisterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let name = document.getElementById("nameMentor").value;
    let email = document.getElementById("emailMentor").value;
    let currentLocation = document.getElementById("locationMentor").value;
    let password = document.getElementById("passwordMentor").value;
    let expertise = document.getElementById("expertise").value;
    let meetLink = document.getElementById("meetLink").value; 
    
    let obj = {
        name,
        email,
        password,
        role: "mentor",
        location: currentLocation,
        expertise,
        meetLink 
    };
    
    registerNewUser(obj);
});

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

       
        if (out.msg === "Successfully registered") {
            Swal.fire({
                title: 'Success!',
                text: out.msg,
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
                text: out.msg,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.log("Error while registering from frontend");

       
        Swal.fire({
            title: 'Error',
            text: 'Error while registering',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

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
