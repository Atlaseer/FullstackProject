
document.addEventListener("DOMContentLoaded", function () {
    const signupButton = document.querySelector(".signup-button");
    const guestSigninButton = document.getElementById("guestSigninButton");

    guestSigninButton.addEventListener("click", function (event) {
        event.preventDefault();
        document.body.classList.remove("not-signed-in"); // Hide signup and guest button
        signupButton.style.display = "none";
        guestSigninButton.style.display = "none";
    });
});


//document.addEventListener("DOMContentLoaded", function () {
    //displayPosts();
//});

// <---- Left Sidebar Toggle ----> //
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu-toggle");  // ☰ Button
    const leftSidebar = document.getElementById("leftSidebar"); // Sidebar
    const closeLeftSidebar = document.querySelector(".close-sidebar"); // X Button

    function toggleSidebar() {
        leftSidebar.classList.toggle("active"); // Toggle visibility
    }

    // ✅ Ensure event listeners exist
    if (menuButton) menuButton.addEventListener("click", toggleSidebar);
    if (closeLeftSidebar) closeLeftSidebar.addEventListener("click", toggleSidebar);
});

// ✅ Handle Reactions (Likes) and Add XP
document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("reaction-btn")) {
        event.preventDefault(); // Stops page refresh

        await updateReactions(postId, reactionType);
        addXP(10); // ✅ Reward XP for liking (+10 XP)
        alert("You earned 10 XP for liking a post!");
    }
});


        // Create Post Element
        const postElement = document.createElement("div");
        postElement.classList.add("post");
        postElement.innerHTML = `
            <div class="post-container">
                <!-- User Profile Box (Left Side, 20%) -->
                <div class="user-profile">
                    <div class="avatar"></div> <!-- Placeholder for future avatar -->
                    <h3>${user.username}</h3>
                    <button class="view-profile-btn" data-username="${user.username}" data-userid="${post.userId || ""}">View Profile</button>


                    <!-- Level Badge (styled separately) -->
                    <div class="level-badge">
                        Rank N/A <span class="level-number"></span>
                    </div>
                </div>

                <!-- Main Post Content (Right Side, 80%) -->
                <div class="post-content">
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <p><strong>Tags:</strong> ${post.tags ? post.tags.join(", ") : "No tags"}</p>

                    <!-- Reaction buttons -->
                    <div class="reactions" data-postid="${post.id}">
                        <button class="reaction-btn" data-type="thumbsUp">👍 ${post.reactions.thumbsUp || 0}</button>
                        <button class="reaction-btn" data-type="happy">😊 ${post.reactions.happy || 0}</button>
                        <button class="reaction-btn" data-type="heart">❤️ ${post.reactions.heart || 0}</button>
                        <button class="reaction-btn" data-type="fire">🔥 ${post.reactions.fire || 0}</button>
                        <button class="reaction-btn" data-type="surprised">😲 ${post.reactions.surprised || 0}</button>
                    </div>

                    <!-- View Comments Button with Dynamic Count -->
                    <button class="view-comments-btn" data-postid="${post.id}">💬 View Comments (<span id="comment-count-${post.id}">${commentCount}</span>)</button>

                    <!-- Comment Section (Hidden by Default) -->
                    <div class="comments-section" id="comments-${post.id}" style="display: none;">
                        <strong>Comments:</strong>
                        <div class="comments-list">
                            ${post.comments.length ? post.comments.map(c => `<p>💬 ${c}</p>`).join("") : "<p>No comments available.</p>"}
                        </div>
                        <input type="text" class="comment-input" placeholder="Write a comment..." data-postid="${post.id}">
                        <button class="add-comment-btn" data-postid="${post.id}">➕ Add Comment</button>
                    </div>
                </div>
            </div>
        `;

        postsContainer.appendChild(postElement);

    // Attach event listeners for "View Profile" button
    document.querySelectorAll(".view-profile-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            const userId = event.target.getAttribute("data-userid");
            const username = event.target.getAttribute("data-username");

            await openUserProfile(username, userId);
        });
    });

    // ✅ Attach event listeners for "Add Comment" button
    document.querySelectorAll(".add-comment-btn").forEach(button => {
        button.addEventListener("click", async (event) => {
            const postId = event.target.getAttribute("data-postid");
            const commentInput = document.querySelector(`.comment-input[data-postid='${postId}']`);
    
            if (commentInput && commentInput.value.trim() !== "") {
                await addComment(postId, commentInput.value.trim());
                commentInput.value = ""; // Clear input after submitting
    
                // ✅ Prevent double XP gain
                if (!sessionStorage.getItem("commentXPAdded")) {
                    sessionStorage.setItem("commentXPAdded", "true"); // ✅ Set flag to prevent duplicate XP
                    addXP(20); // ✅ Reward XP for commenting (+20 XP)
                    alert("You earned 20 XP for commenting!");
                }
            }
        });
    });




// ✅ Function to display the profile modal (View-Profile Window)
// ✅ Function to display the correct user profile in the modal
async function displayProfileModal(userPost) {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get logged-in user
    let displayedUsername = userPost.username;
    let displayedLevel = "N/A";

    try {
        // 🔹 Fetch users.json to get the correct level for the profile being viewed
        const response = await fetch("users.json");
        const users = await response.json();

        // 🔹 Find the profile being viewed
        const viewedUser = users.find(user => user.username === userPost.username);

        if (viewedUser) {
            displayedLevel = viewedUser.level; // ✅ Use actual level from users.json
        }

        // 🔹 If viewing own profile, always use logged-in user's level
        if (currentUser && currentUser.username === userPost.username) {
            displayedUsername = currentUser.username;
            displayedLevel = currentUser.level;
        }
    } catch (error) {
        console.error("❌ Error fetching user data:", error);
    }

    // ✅ Create & display the profile modal
    const profileModal = document.createElement("div");
    profileModal.classList.add("profile-modal");
    profileModal.innerHTML = `
        <div class="profile-modal-content">
            <span class="close-profile">&times;</span>
            <div class="avatar-large"></div>
            <h3>${displayedUsername}</h3>
            <p><strong>Level:</strong> ${displayedLevel}</p>
            <p><strong>Email:</strong> ${userPost.email || "N/A"}</p>
            <p><strong>Address:</strong> ${userPost.address || "N/A"}</p>
            <p><strong>Posts Made:</strong> ${
                document.querySelectorAll(`.view-profile-btn[data-username='${userPost.username}']`).length
            }</p>

            <!-- Buttons -->
            <div class="profile-buttons">
                <button class="follow-btn">Follow</button>
                <button class="message-btn">Message</button>
            </div>
        </div>
    `;

    document.body.appendChild(profileModal);
    
    document.querySelector(".close-profile").addEventListener("click", () => {
        profileModal.remove();
    });

    profileModal.addEventListener("click", (event) => {
        if (event.target === profileModal) {
            profileModal.remove();
        }
    });
}


/* 🔥 Function to Update Comment Count Dynamically */
function updateCommentCount(postId) {
    const commentCountElement = document.getElementById(`comment-count-${postId}`);
    if (commentCountElement) {
        let currentCount = parseInt(commentCountElement.textContent);
        commentCountElement.textContent = currentCount + 1; // Increment count dynamically
    }
}

async function updateCommentCount(postId) {
    const comments = await fetchComments(postId); // Fetch latest comments
    const commentCount = comments.length;
    document.getElementById(`comment-count-${postId}`).textContent = commentCount;
}

// <---- Join Now button, Login button + Signed in logic ----> //
//_____________________________________________________________//
document.addEventListener("DOMContentLoaded", () => {
    // Join Now Button (Redirect to Register Page)
    const joinNowButton = document.querySelector(".signup-button");
    if (joinNowButton) {
        joinNowButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default link behavior
            window.location.href = "register.html"; // Redirect to register page
        });
    }

    // Sign In Button (Redirect to Register Page in Login Mode)
    const loginButton = document.querySelector(".login-button");
    if (loginButton) {
        loginButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent default link behavior
            window.location.href = "register.html?mode=login"; // Redirect with login mode
        });
    }
});

// <---- Signed in logic ----> //
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userDisplay = document.querySelector(".user-display");
    const loginButton = document.querySelector(".login-button");
    const logoutButton = document.querySelector(".logout-button");
    const signupButton = document.querySelector(".signup-button");
    const guestSigninButton = document.querySelector(".guest-signin-button");

    if (currentUser) {
        // ✅ Show user display
        userDisplay.innerHTML = `LOGGED IN AS: <span>${currentUser.username.toUpperCase()}</span>`;
        userDisplay.style.display = "inline-block";

        // ✅ Hide login & signup buttons
        loginButton.style.display = "none";
        logoutButton.style.display = "inline-block";

        // ✅ Hide "Join Now" & "Sign in as Guest"
        if (signupButton) signupButton.style.display = "none";
        if (guestSigninButton) guestSigninButton.style.display = "none";

    } else {
        // ✅ Hide user display
        userDisplay.style.display = "none";
        loginButton.style.display = "inline-block";
        logoutButton.style.display = "none";

        // ✅ Show "Join Now" & "Sign in as Guest" (for non-logged-in users)
        if (signupButton) signupButton.style.display = "inline-block";
        if (guestSigninButton) guestSigninButton.style.display = "inline-block";
    }

    // Logout function
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.reload();
    });
});


// ✅ Function to update the user display (Shows XP, Level, XP Bar)
function updateUserDisplay() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const userDisplay = document.querySelector(".user-display");

    if (currentUser) {
        userDisplay.innerHTML = `
            LOGGED IN AS: <span>${currentUser.username.toUpperCase()}</span>
            <br>LEVEL: <span>${currentUser.level}</span>
            <br>XP: <span>${currentUser.xp}/100</span>
            <div class="xp-bar">
                <div class="xp-progress" style="width: ${currentUser.xp}%;"></div>
            </div>
        `;
        userDisplay.style.display = "inline-block";
    } else {
        userDisplay.style.display = "none";
    }
}

// <--------- Logged in + Guest form posts ------------> //
// ✅ Call this function on page load to display current user info
document.addEventListener("DOMContentLoaded", () => {
    updateUserDisplay();
});
