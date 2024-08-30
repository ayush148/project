const BACKEND_URL = 'http://localhost:3000';

async function checkSession() {
    try {
        const response = await fetch('/auth/check', {
            credentials: 'include' // Include credentials in the request
        });
        const result = await response.json();
        console.log('Session check result:', result);
        return result.loggedIn;
    } catch (error) {
        console.error('Error checking session:', error);
        return false;
    }
}

// Handle registration
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target['confirm-password'].value;

    if (password !== confirmPassword) {
        return alert('Passwords do not match');
    }

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, confirmPassword })
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration.');
    }
});

// Handle login
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include cookies in the request
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        alert(result.message);

       
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login.');
    }
});

// Handle logout
document.getElementById('logout-btn')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            credentials: 'include' // Include cookies in the request
        });

        const result = await response.json();
        alert(result.message);

        // if (response.ok) {
        //     window.location.href = 'login.html'; // Redirect to login page on successful logout
        // }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during logout.');
    }
});

// Handle adding review
document.getElementById('review-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const isLoggedIn = await checkSession();
    console.log('Is logged in:', isLoggedIn);
    if (!isLoggedIn) {
        alert('You are not logged in. Please log in to add a review.');
        window.location.href = 'login.html';
        return;
    }

    const title = e.target.title.value;
    const format = e.target.format.value;
    const releaseYear = e.target.releaseYear.value;
    const releaseMonth = e.target.releaseMonth.value;
    const releaseDate = e.target.releaseDate.value;
    const review = e.target.review.value;

    try {
        const response = await fetch('/review/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // Include credentials in the request
            
            body: JSON.stringify({title, format, releaseYear, releaseMonth, releaseDate, review })
        });

        console.log('Review submission response:', response);
        const result = await response.json();
        console.log('Review submission result:', result);
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while adding the review.');
        
        if (response.ok) {
            window.location.href = 'login.html'; // Redirect to login page on successful logout
        }
    }
});

// show  review

document.addEventListener('DOMContentLoaded', async () => {
    // Function to load external CSS
    const loadCSS = (href) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    };

    // Load the external CSS file
    loadCSS('css\reviews.css');

    const reviewsContainer = document.getElementById('reviews');
    if (reviewsContainer) {
        try {
            const response = await fetch('/review/all', {
                credentials: 'include' // Include cookies in the request
            });
            const reviews = await response.json();
            reviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.innerHTML = `
                    <h3>${review.title}</h3>
                    <p>Type: ${review.format}</p>
                    <p>Release Date: ${review.releaseYear}-${review.releaseMonth}-${review.releaseDate}</p>
                    <p>Review: ${review.review}</p>
                    <p>Reviewed by: ${review.username}</p>
                `;
                reviewsContainer.appendChild(reviewDiv);
            });
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching reviews.');
        }
    }
});


