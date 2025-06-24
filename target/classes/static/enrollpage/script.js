document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取输入值
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // 验证输入
    if (!username || !password) {
        alert('用户名和密码不能为空');
        return;
    }

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
                throw new Error('HTTP错误，状态码: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            // 根据Result类的结构处理响应
            if (result.code === 1) { // 成功
                alert(result.msg || '注册成功！');
                // 跳转到登录页面
                window.location.href = '/logpage/login.html';
            } else { // 失败
                // 直接显示后端返回的错误信息
                alert('注册失败: ' + (result.msg || '未知错误'));
            }
        })
        .catch((error) => {
            // 处理网络错误或解析错误
            console.error('请求错误:', error);
            alert('注册请求失败: ' + error.message);
        });
});

// 密码可见性切换（保持不变）
document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    this.textContent = type === 'password' ? '👁️' : '🔒';
});

// 返回登录按钮处理（保持不变）
const loginButton = document.getElementById('backLoginButton');
if (loginButton) {
    loginButton.addEventListener('click', function() {
        window.location.href = '../logpage/login.html';
    });
}