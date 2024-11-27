let baseUrl = `http://localhost:5000`;

let token = sessionStorage.getItem("token");


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
       
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('name');

            Swal.fire({
                title: 'Success',
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


if (token) {
    
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
                    <th>Session Status</th>
                    <th>Cancel Appointment</th>
                    <th>Video Call</th>
                </tr>
            </thead>
            <tbody>
            ${arr.map((elem, index) => {
                const [startHour, endHour] = elem.bookingSlot.split('-').map(Number);
                const now = new Date();
                const currentDate = now.toISOString().split('T')[0];
                const currentHour = now.getHours();
                
                // Determine session status
                let sessionStatus = "";
                let timerClass = "expired"; // Default to expired

                if (elem.bookingDate === currentDate) {
                    if (currentHour >= startHour && currentHour < endHour) {
                        const minutesLeft = (endHour - currentHour) * 60 - now.getMinutes();
                        sessionStatus = `Current (${minutesLeft} mins left)`;
                        timerClass = "current";
                    } else if (currentHour < startHour) {
                        const minutesToStart = (startHour - currentHour) * 60 - now.getMinutes();
                        sessionStatus = `Upcoming (${minutesToStart} mins to start)`;
                        timerClass = "upcoming";
                    } else {
                        sessionStatus = "Expired";
                    }
                } else if (elem.bookingDate < currentDate) {
                    sessionStatus = "Expired";
                } else {
                    sessionStatus = "Upcoming";
                    timerClass = "upcoming";
                }

                return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${elem.userEmail}</td>
                    <td>${elem.mentorEmail}</td>
                    <td>${elem.bookingDate}</td>
                    <td>${elem.bookingSlot === "8-9" ? "8 AM to 9 AM" : elem.bookingSlot === "9-10" ? "9 AM to 10 AM" : elem.bookingSlot === "10-11" ? "10 AM to 11 AM" : elem.bookingSlot === "11-12" ? "11 AM to 12 PM" : elem.bookingSlot === "12-13" ? "12 PM to 1 PM" : elem.bookingSlot === "13-14" ? "1 PM to 2 PM" : elem.bookingSlot === "14-15" ? "2 PM to 3 PM" : elem.bookingSlot === "15-16" ? "3 PM to 4 PM" : elem.bookingSlot === "16-17" ? "4 PM to 5 PM" : elem.bookingSlot === "17-18" ? "5 PM to 6 PM" : elem.bookingSlot === "18-19" ? "6 PM to 7 PM" : "7 PM to 8 PM"}</td>
                    <td class="timer ${timerClass}" data-id="${elem._id}" data-start="${startHour}" data-end="${endHour}" data-date="${elem.bookingDate}">
                        ${sessionStatus}
                    </td>
                    <td><button class="cancelBtn" data-id="${elem._id}">Cancel Appointment</button></td>
                    <td><button class="videoBtn" data-id="${elem._id}">Video Call</button></td>
                </tr>
                `;
            }).join("")}
            </tbody>
        </table>
        `;

        updateTimers(); // Start the countdown timer

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
                        Swal.fire({
                            title: 'Error',
                            text: data.message || "Unable to check booking",
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        return;
                    }
                    if (data.message === "Meeting is currently valid") {
                        if (data.booking.meetlink) {
                            window.open(data.booking.meetlink, "_blank");
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: "No valid meeting link found for this booking.",
                                icon: 'error',
                                confirmButtonText: 'OK'
                            });
                        }
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: data.message,
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                        // }
                    } 
                catch (error) {
                    Swal.fire({
                        title: 'Error',
                        text: "An unexpected error occurred. Please try again later.",
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            });
        }
    }

    function updateTimers() {
        const timerElements = document.querySelectorAll(".timer");
        setInterval(() => {
            timerElements.forEach((timer) => {
                const now = new Date();
                const currentHour = now.getHours();
                const currentDate = now.toISOString().split('T')[0];
                const startHour = Number(timer.dataset.start);
                const endHour = Number(timer.dataset.end);
                const bookingDate = timer.dataset.date;

                if (bookingDate < currentDate) {
                    timer.textContent = "Expired";
                    timer.className = "timer expired";
                } else if (bookingDate === currentDate) {
                    if (currentHour >= startHour && currentHour < endHour) {
                        const minutesLeft = (endHour - currentHour) * 60 - now.getMinutes();
                        timer.textContent = `Current (${minutesLeft} mins left)`;
                        timer.className = "timer current";
                    } else if (currentHour < startHour) {
                        const minutesToStart = (startHour - currentHour) * 60 - now.getMinutes();
                        timer.textContent = `Upcoming (${minutesToStart} mins to start)`;
                        timer.className = "timer upcoming";
                    } else {
                        timer.textContent = "Expired";
                        timer.className = "timer expired";
                    }
                } else {
                    timer.textContent = "Upcoming";
                    timer.className = "timer upcoming";
                }
            });
        }, 60000);
    }

    async function cancelAppointment(id, token) {
        try {
            let res = await fetch(`${baseUrl}/booking/remove/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token,
                },
            });

            let data = await res.json();
            if (data.success) {
                Swal.fire({
                    title: 'Success',
                    text: data.msg,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => fetchAllAppointments());
            } else {
                Swal.fire({
                    title: 'Error',
                    text: data.msg,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.log("Error while canceling appointment");
            Swal.fire({
                title: 'Error',
                text: "Error while canceling the appointment.",
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
} else {
   
    Swal.fire({
            title: 'warning',
            text: 'You must login before access this page.',
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then(() => {
           
            setTimeout(() => {
                window.location.href = './login.html';
            }, 1000); 
        });
}
