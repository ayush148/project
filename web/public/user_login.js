document.addEventListener('DOMContentLoaded', () => {
 
    // Handle Login
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('login_username').value;
        const password = document.getElementById('login_password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            if (response.ok) {
                alert('Login successful');
            } else {
                const errorMessage = await response.text();
                alert(`Login failed: ${errorMessage}`);
            }
        } catch (error) {
            alert('Network error: ' + error.message);
        }
    });
});
