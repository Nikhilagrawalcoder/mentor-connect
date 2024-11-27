let baseUrl = `http://localhost:5000`;

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
        
       
        sessionStorage.setItem("token", out.token);
        sessionStorage.setItem("role", out.role);
        sessionStorage.setItem("name", out.name);

        console.log(out.role, out.name);
        
       
        Swal.fire({
            title: out.msg === "Login Success" ? 'Success!' : 'Error',
            text: out.msg,
            icon: out.msg === "Login Success" ? 'success' : 'error',
            confirmButtonText: 'OK'
        }).then(() => {
            if (out.msg === "Login Success") {
               setTimeout(() => {
                window.location.href = './Booking.html';
            }, 1000); 
            }
        });
    } catch (error) {
        console.log("Error while login from frontend");

        Swal.fire({
            title: 'Error',
            text: 'Error while login',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

const logoutBtn = document.querySelector(".logoutButton");

let token = sessionStorage.getItem("token");

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
