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
                console.log('收到 Token:', token); // 打印 token 查看格式
                localStorage.setItem('token', token);
                window.location.href = '../index/index.html';
            }
        });

});
