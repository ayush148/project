// const BACKEND_URL = 'http://localhost:3000';

// Function to fetch and display all users
async function fetchUsers() {
    try {
        const response = await fetch('/admin/users', {
            credentials: 'include' // Include cookies in the request
        });
        const users = await response.json();
        const usersTableBody = document.querySelector('#users-table tbody');

        users.forEach(user => {
            const userRow = document.createElement('tr');
            userRow.innerHTML = `
                <td>${user.username}</td>
                
            `;
            usersTableBody.appendChild(userRow); 
            // <td><button onclick="deleteUser(${user.id})">Delete</button></td>
        });
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching users.');
    }
}

// Function to delete a user
async function deleteUser(userId) {
    try {
        const response = await fetch(`/admin/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include' // Include cookies in the request
        });
        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            location.reload(); // Reload the page to update the user list
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the user.');
    }
}

// Fetch users on page load
document.addEventListener('DOMContentLoaded', fetchUsers);
