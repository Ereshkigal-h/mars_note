document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: username, passwordHash: password })
    })
        .then(response => response.json())
        .then(data => {
            if (data.code === 1) {
                const token = data.data;
                localStorage.setItem('token', token);
                window.location.href = '../index/index.html';
            }
        });
});