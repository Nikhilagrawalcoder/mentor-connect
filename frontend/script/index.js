document.addEventListener('DOMContentLoaded', function () {
   const logoutBtn = document.querySelector(".logoutButton");

    // Base URL for API calls
    let baseUrl = `http://localhost:5000`;

    // Check if the user is logged in by checking the token in sessionStorage
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
});
