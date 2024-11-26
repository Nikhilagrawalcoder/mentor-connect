let baseUrl = `http://localhost:5000`; // Base URL of your API

let token = sessionStorage.getItem("token");

// Selecting elements for login, register, and logout buttons

const logoutBtn = document.querySelector(".logoutButton");
const container = document.getElementById("appointmentList");



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
if (token) {
    // If token exists, show user-specific data
    fetchAllAppointments();

    async function fetchAllAppointments() {
        let role = sessionStorage.getItem("role");
        let name = sessionStorage.getItem("name");

        try {
            let res = await fetch(`${baseUrl}/booking/paticularUser`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `${token}`
                },
            });
            let data = await res.json();
            renderAppointments(data.Data, name, role);
        } catch (error) {
            console.log("Error fetching all appointments");
        }
    }

    function renderAppointments(arr, name, role) {
        container.innerHTML = `
        <h1 style="text-align: center; margin-bottom:20px">All Appointments for ${role} ${name}</h1>
        <table>
            <thead>
                <tr>
                    <th>SI NO.</th>
                    <th>Mentee Email</th>
                    <th>Mentor Email</th>
                    <th>Date</th>
                    <th>Time Slot</th>
                    <th>Cancel Appointment</th>
                    <th>Video Call</th>
                </tr>
            </thead>
            <tbody>
            ${arr.map((elem, index) => {
                return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${elem.userEmail}</td>
                    <td>${elem.mentorEmail}</td>
                    <td>${elem.bookingDate}</td>
                    <td>${elem.bookingSlot == "8-9" ? "8 AM to 9 AM" : elem.bookingSlot == "9-10" ? "9 AM to 10 AM" : elem.bookingSlot == "10-11" ? "10 AM to 11 AM":elem.bookingSlot == "11-12" ? "11 AM to 12 PM":elem.bookingSlot == "12-13" ? "12 PM to 1 PM":
                    elem.bookingSlot=="13-14"?"1 PM to 2 PM":elem.bookingSlot == "14-15" ? "2 PM to 3 PM":elem.bookingSlot == "15-16" ? "3 PM to 4 PM":elem.bookingSlot == "16-17" ? "4 PM to 5 PM" :elem.bookingSlot == "17-18" ? "5 PM to 6 PM":elem.bookingSlot == "18-19" ? "6 PM to 7 PM": "7 PM to 8 PM"}</td>
                    <td><button class="cancelBtn" data-id=${elem._id}>Cancel Appointment</button></td>
                    <td><button class="videoBtn" data-id=${elem._id}>Video Call</button></td>
                </tr>
                `;
            }).join("")}
            </tbody>
        </table>
        `;

        let cancelBtns = document.querySelectorAll(".cancelBtn");
        for (let cancelBtn of cancelBtns) {
            cancelBtn.addEventListener("click", (e) => {
                let id = e.target.dataset.id;
                cancelAppointment(id, token);
            });
        }

        let videoBtns = document.querySelectorAll(".videoBtn");
        for (let videoCallBtn of videoBtns) {
            videoCallBtn.addEventListener("click", async (e) => {
                let id = e.target.dataset.id;
                try {
                    const response = await fetch(`${baseUrl}/booking/check-bookings/${id}`, {
                        method: "GET",
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        alert(`Error: ${data.message || "Unable to check booking"}`);
                        return;
                    }
                    // if(data.message==="Meeting is currently valid"){
                    console.log(data.booking.meetlink);
                     if (data.booking.meetlink) {
                
                window.open(data.booking.meetlink, "_blank");
            } else {
                alert("No valid meeting link found for this booking.");
            }
                    // }
                // else{
                //     alert(data.message);
                // }
                } catch (error) {
                    alert("An unexpected error occurred. Please try again later.");
                }
            });
        }
    }

   async function cancelAppointment(id, token) {
    try {
        let res = await fetch(`${baseUrl}/booking/remove/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                Authorization: `${token}`
            },
        });
        let data = await res.json();
        
        if (data.msg === `Booking ID of ${id} is deleted successfully.`) {
            fetchAllAppointments();
            alert(`Your appointment has been successfully cancelled.`);

            // Check email status and alert accordingly
            if (data.emailStatus === "Email sent successfully") {
                alert("Cancellation email was sent successfully.");
            } else {
                alert("Failed to send cancellation email.");
            }
        } else {
            alert(data.msg);
        }
    } catch (error) {
        alert("Something went wrong!");
    }
}

} else {
    alert("Please login first to access this page.");
    window.location.href = "./login.html"; // Redirect to login page
}
