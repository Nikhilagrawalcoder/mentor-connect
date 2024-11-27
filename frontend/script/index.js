document.addEventListener('DOMContentLoaded', function () {
  const logoutBtn = document.querySelector(".logoutButton");
  let baseUrl = `http://localhost:5000`;
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
          title: 'Success!',
          text: data.msg,
          icon: 'success',
          confirmButtonText: 'OK',
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
          confirmButtonText: 'OK',
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
        confirmButtonText: 'OK',
      }).then(() => {
        setTimeout(() => {
                window.location.href = './login.html';
            }, 1000); 
      });
    }
  });
});
