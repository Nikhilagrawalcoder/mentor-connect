let baseUrl = `http://localhost:5000`;

document.addEventListener('DOMContentLoaded', function() {
    let dtToday = new Date();
    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let year = dtToday.getFullYear();

    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();

   
    let minDate = year + '-' + month + '-' + (day + 1);
    document.getElementById('mentorDateInput').setAttribute('min', minDate);
});

let btnBook = document.getElementById("bookAppointment");
btnBook.addEventListener("click", () => {
    let date = document.getElementById("mentorDateInput").value;
    let slot = document.getElementById("mentorSlotSelect").value;
    let token = sessionStorage.getItem("token");
    let mentorId = sessionStorage.getItem("mentorId");

    if (!token) {
       Swal.fire({
            title: 'warning',
            text: 'You must be login first',
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then(() => {
           
            setTimeout(() => {
                window.location.href = './login.html';
            }, 1000); 
        });
    } else if (date == "" || slot == "") {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Information',
            text: 'Please fill all the fields.',
            confirmButtonText: 'OK'
        });
    } else {
        let obj = {
            mentorId: mentorId,
            bookingDate: date,
            bookingSlot: slot
        };
        bookAnAppointment(obj, token);
    }
});

async function bookAnAppointment(obj, token) {
    try {
        let res = await fetch(`${baseUrl}/booking/create`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `${token}` 
            },
            body: JSON.stringify(obj)
        });
        let out = await res.json();
        if (out.msg == "This Slot is Not Available.") {
            Swal.fire({
                icon: 'error',
                title: 'Slot Unavailable',
                text: 'This Slot is Not Available.',
                confirmButtonText: 'OK'
            });
        } else if (out.msg == "New booking created successfully. Confirmation sent to email.") {
            Swal.fire({
                icon: 'success',
                title: 'Booking Confirmed',
                text: `Hi, Your booking is confirmed on ${obj.bookingDate} and an email has been sent to your registered email.`,
                confirmButtonText: 'OK'
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: out.msg,
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.log("Error:", error.message);
        Swal.fire({
            icon: 'error',
            title: 'Something Went Wrong',
            text: 'Something went wrong while booking the appointment!',
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
                    icon: 'success',
                    title: 'Logout Successful',
                    text: data.msg,
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = './login.html';
                });
            } else {
              
                Swal.fire({
                    icon: 'error',
                    title: 'Logout Failed',
                    text: data.msg,
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = './login.html';
                });
            }
        } catch (error) {
            console.error('Error while logging out:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error While Logging Out',
                text: 'Error while logging out.',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = './login.html';
            });
        }
    });
