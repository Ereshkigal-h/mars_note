document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取输入值
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // 创建要发送的数据对象
    const userData = {
        userName: username,
        passwordHash: password
    };

    // 使用fetch API发送POST请求到/creates
    fetch('http://localhost:8080/creates', {

        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        return response.json();
    })
    .then(data => {
        // 处理成功的响应
        alert('请求发送成功！');
        console.log('成功:', data);
        // 可以在这里添加重定向逻辑，例如：
        // window.location.href = '/success.html';
    })
    .catch((error) => {
        // 处理错误
        console.error('错误:', error);
        alert('注册失败: ' + error.message);
    });
});

// 密码可见性切换
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🔒';
});

// 获取返回登录按钮元素
const loginButton = document.getElementById('backLoginButton');

// 为返回登录按钮添加点击事件监听器
if (loginButton) {
    loginButton.addEventListener('click', function() {
        window.location.href = '../logpage/login.html';
    });
}