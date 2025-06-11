document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取输入值
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // 用户名验证（3-15位字母数字）
    const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
    if (!usernameRegex.test(username)) {
        alert('用户名格式错误：需3-15位字母或数字');
        return;
    }

    // 邮箱验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('请输入有效的电子邮箱地址');
        return;
    }

    // 密码强度验证（6-15位）
    if (password.length < 6 || password.length > 15) {
        alert('密码长度需在6-15位之间');
        return;
    }

    // 密码一致性验证
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }

    // 验证通过提示
    alert('注册信息验证通过！');
    // 此处可添加AJAX提交逻辑
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
        // 替换为实际的登录页面 URL
        window.location.href = '../logpage/login.html';
    });
}