// Handle registration form submission
document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('register_username').value;
    const password = document.getElementById('register_password').value;
    const confirmPassword = document.getElementById('register_confirm_password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch('/register', {
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
            alert('Registration successful');
        } else {
            alert('Error during registration');
        }
    } catch (error) {
        alert('Network error');
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
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


