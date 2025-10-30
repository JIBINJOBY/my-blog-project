// services/frontend/app.js

// Get references to the HTML elements we need to interact with
const postsList = document.getElementById('posts-list');
const loadPostsBtn = document.getElementById('load-posts-btn');

// --- Define the function to fetch and display posts ---
async function fetchAndDisplayPosts() {
    // Show loading message while fetching
    postsList.innerHTML = '<li class="loading">Loading posts...</li>';

    try {
        // --- Fetch real data from the backend API ---
        // The Ingress will route /api/posts to the posts-service
        const response = await fetch('/api/posts'); 

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts = await response.json(); 
        // --- End real data fetch ---

        console.log("Received posts:", posts);

        // Clear the loading message
        postsList.innerHTML = '';

        // Check if any posts were returned
        if (posts.length === 0) {
            postsList.innerHTML = '<li class="loading">No posts found.</li>';
            return;
        }

        // Loop through the posts and create HTML list items
        posts.forEach(post => {
            const listItem = document.createElement('li');

            const title = document.createElement('h3');
            title.textContent = post.title;

            const content = document.createElement('p');
            // Use empty string if content is null/undefined
            content.textContent = post.content || ''; 

            const date = document.createElement('small');
            date.textContent = `Posted on: ${new Date(post.created_at).toLocaleString()}`;
            date.style.color = '#999'; // Add some style to the date

            listItem.appendChild(title);
            listItem.appendChild(content);
            listItem.appendChild(date); // Add the date element

            postsList.appendChild(listItem);
        });

    } catch (error) {
        console.error('Error fetching posts:', error);
        // Display error message to the user
        postsList.innerHTML = '<li class="loading" style="color: red;">Failed to load posts. Check console for details.</li>';
    }
}

// --- Event Listener ---
// Add event listener to the button to reload posts when clicked
loadPostsBtn.addEventListener('click', fetchAndDisplayPosts);

// --- Initial Load ---
// Fetch and display posts when the page first loads
fetchAndDisplayPosts();