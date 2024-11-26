let baseUrl = `http://localhost:5000`;

document.addEventListener('DOMContentLoaded', function() {
    let dtToday = new Date();
    let month = dtToday.getMonth() + 1;
    let day = dtToday.getDate();
    let year = dtToday.getFullYear();

    if (month < 10) month = '0' + month.toString();
    if (day < 10) day = '0' + day.toString();

    // Ensure the date is one day ahead
    let minDate = year + '-' + month + '-' + (day + 1);
    document.getElementById('mentorDateInput').setAttribute('min', minDate);
});

// Handle the logout functionality on button click


let btnBook = document.getElementById("bookAppointment");
btnBook.addEventListener("click", () => {
    let date = document.getElementById("mentorDateInput").value;
    let slot = document.getElementById("mentorSlotSelect").value;
    let token = sessionStorage.getItem("token");
    let mentorId = sessionStorage.getItem("mentorId");

    if (!token) {
        alert("Please Login First to Book an Appointment!!");
        window.location.href = "./Login.html";
    } else if (date == "" || slot == "") {
        alert("Please fill all the fields");
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
                Authorization: `${token}` // Send the token for authentication
            },
            body: JSON.stringify(obj)
        });
        let out = await res.json();
        if (out.msg == "This Slot is Not Available.") {
            alert("This Slot is Not Available.");
        } else if (out.msg == "New booking created successfully. Confirmation sent to email.") {
            alert(`Hi, Your booking is confirmed on ${obj.bookingDate} and an email has been sent to your registered email.`);
        } else {
            alert(out.msg);
        }
    } catch (error) {
        console.log("Error:", error.message);
        alert("Something went wrong while booking the appointment!");
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