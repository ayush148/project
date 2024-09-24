document.getElementById('reviewForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const movieName = document.getElementById('movie_name').value;
    const releaseDate = document.getElementById('movie_release_date').value;
    const review = document.getElementById('review').value;

    try {
        const response = await fetch('/movie/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movie_name: movieName,
                movie_release_date: releaseDate,
                review: review
            })
        });

        if (response.ok) {
            alert('Review added successfully');
        } else {
            alert('Error adding review');
        }
    } catch (error) {
        alert('Network error');
    }
});

// async function fetchReviews() {
//     try {
//         const response = await fetch('http://localhost:3000/movie/reviews');
//         const reviews = await response.json();
//         const reviewList = document.getElementById('reviewList');

//         reviewList.innerHTML = '';
//         reviews.forEach(review => {
//             const listItem = document.createElement('li');
//             listItem.textContent = `${review.movie_name} ${review.movie_release_date} ${review.review}`;
//             reviewList.appendChild(listItem);
//         });
//     } catch (error) {
//         alert('Error fetching reviews');
//     }
// }

async function fetchReviews() {
    try {
        const response = await fetch('/movie/reviews');
        const reviews = await response.json();
        const reviewList = document.getElementById('reviews');

        reviewList.innerHTML = '';
        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.innerHTML = `
                <h3>${review.movie_name}</h3>
                <p>Release Date: ${review.movie_release_date}</p>
                <p class="review">${review.review}</p>
            `;
            reviewList.appendChild(reviewDiv);
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Error fetching reviews');
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchReviews);