// Start of Login portion
document.addEventListener("DOMContentLoaded", function() {
    const users = {
        user1: "password1",
        user2: "password2"
    };

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (users[username] && users[username] === password) {
                alert("Login successful!");
                window.location.href = 'planner.html';
            } else {
                alert("Invalid username or password. Please try again.");
            }
        });
    }
});
//End of login portion
