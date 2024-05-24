document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('signupUsername').value;
        const emailAddress = document.getElementById('emailAddress').value;
        const password = document.getElementById('signupPassword').value;

        try {
            const response = await fetch('/signup',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, emailAddress, password }),
            });

            console.log('Response status:', response.status);
            if (response.ok) {
                const data = await response.json();
                console.log('Response data:', data);
                alert("Signup successful!");
                window.location.href = "/"; // Redirect after successful signup
            } else {
                const data = await response.json();
                console.log('Response data:', data);
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            alert('An error occurred. Please try again.');
        }
    });
});
