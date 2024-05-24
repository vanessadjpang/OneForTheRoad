document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('Form submitted');
    console.log('Username:', username);
    console.log('Password:', password);

    try {
    const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    });

    console.log('Response status:', response.status);

    if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        alert("Login successful!");
        window.location.href = "/planner";
    }
    else {
        const data = await response.json();
        console.log('Error data:', data);
        alert(`Error: ${data.message}`);
    }
    } 
    catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
    });
});