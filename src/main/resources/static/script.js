document.addEventListener('DOMContentLoaded', function() {
    const aiButton = document.getElementById('ai-button');
    const aiSidebar = document.querySelector('.ai-sidebar');
    const tabs = document.querySelectorAll('.tab');
    const sidebar = document.querySelector('.sidebar');
    const menuItems = document.querySelectorAll('.menu-item');
    const editorWrapper = document.querySelector('.editor-wrapper');
    const token = localStorage.getItem('token');
    const loginButton = document.getElementById('loginButton');
    const username = localStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcomeMessage');

    if (username) {
        welcomeMessage.textContent = `欢迎，${username}`;
    }else {
        welcomeMessage.textContent = '未登录用户';
    }


    const saveButton = document.getElementById('saveButton');

    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            try {
                const editorContent = document.querySelector('.editor-area').innerText;
                const response = await fetch('http://localhost:8080/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: editorContent //编辑器内容
                    })
                });

                const result = await response.json();
                console.log('保存成功:', result);
                alert('保存成功');
            } catch (error) {
                console.error('保存失败:', error);
                alert('保存失败，请重试');
            }
        });
    }





        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ai发送按钮功能不一定能实现
    const aiSend = document.getElementById('ai-send'); // 获取AI交互按钮
    const aiInput = document.getElementById('ai-input'); // 输入框
    const aiConversation = document.querySelector('.ai-conversation'); // 聊天容器
    const editorArea = document.querySelector('.editor-area');

    if (aiSend) {
        aiSend.addEventListener('click', async function () {
            const userMessage = aiInput.value.trim(); // 使用 value 而不是 innerHTML
            if (!userMessage) return;

            // 显示用户消息
            const userMsgDiv = document.createElement('div');
            userMsgDiv.className = 'ai-message user-message';
            userMsgDiv.innerHTML = `
                <div class="avatar">👤</div>
                <div class="message-content">${userMessage}</div>
            `;
            aiConversation.appendChild(userMsgDiv);

            // 清空输入框
            aiInput.value = '';

            try {
                const response = await fetch('/Ai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        userId: '当前用户ID'
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    // 显示AI回复
                    const aiMsgDiv = document.createElement('div');
                    aiMsgDiv.className = 'ai-message ai-response';
                    aiMsgDiv.innerHTML = `
                        <div class="avatar"><i class="fas fa-robot"></i></div>
                        <div class="message-content">${result}</div>
                    `;
                    aiConversation.appendChild(aiMsgDiv);
                } else {
                    alert('与AI通信时出错，请稍后再试');
                }
            } catch (error) {
                console.error('请求失败:', error);
                alert('无法连接到服务器');
            }
        });
    }








// 为保存按钮添加点击事件监听器
if (saveButton) {
    saveButton.addEventListener('click', function() {
        const editorArea = document.querySelector('.editor-area');
        const content = editorArea.innerHTML; // 获取编辑区域的内容
        saveNote(content); // 调用保存函数
    });
}

    console.log('读取 Token:', token); // 确保没有多余字符

    if (!token) {
        window.location.href = '../logpage/login.html';
        return;
    }

    fetch('/verify/token', {
        method: 'POST',
        headers: {
            'Authorization': token
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.valid) {
                console.log('欢迎用户:', data.username);

                // 隐藏登录按钮，显示登出按钮
                if (loginButton) {
                    loginButton.style.display = 'none';
                }

                let logoutButton = document.getElementById('logoutButton');
                if (!logoutButton) {
                    logoutButton = document.createElement('button');
                    logoutButton.id = 'logoutButton';
                    logoutButton.textContent = '登出';
                    logoutButton.style.marginLeft = '10px';
                    logoutButton.addEventListener('click', function () {
                        localStorage.removeItem('token');
                        window.location.href = '../logpage/login.html';
                    });

                    // 假设将登出按钮插入到 AI 按钮旁边
                    if (aiButton) {
                        aiButton.parentNode.appendChild(logoutButton);
                    }
                }

            } else {
                localStorage.removeItem('token');
                window.location.href = '../logpage/login.html';
            }
        });


    // AI按钮点击事件
    aiButton.addEventListener('click', function() {
        // 切换AI侧边栏的显示状态
        aiSidebar.classList.toggle('active');
        editorWrapper.classList.toggle('ai-active');
        
        // 移除所有标签的active状态
        tabs.forEach(tab => tab.classList.remove('active'));
    });

    // Tab 点击功能
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 切换大纲侧边栏状态
            sidebar.classList.toggle('active');
            editorWrapper.classList.toggle('sidebar-active');

            // 切换tab的active状态
            const isActive = this.classList.contains('active');

            if (isActive) {
                this.classList.remove('active');
            } else {
                // 先移除所有tab的active状态
                tabs.forEach(t => t.classList.remove('active'));
                // 再给当前tab添加active
                this.classList.add('active');
            }
        });
    });

    // 菜单项点击功能
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

// 获取登录按钮元素
const loginButton = document.getElementById('loginButton');

// 为登录按钮添加点击事件监听器
if (loginButton) {
    loginButton.addEventListener('click', function() {
        // 替换为实际的登录页面 URL
        window.location.href = '../logpage/login.html';
    });
}

// 保存笔记函数
function saveNote() {
    const editorArea = document.querySelector('.editor-area');
    const content = editorArea.innerHTML; // 获取编辑区域的内容
    const userNameInput = document.getElementById('username'); // 假设用户名输入框的 id 是 'username'
    const userName = userNameInput ? userNameInput.value.trim() : "defaultUser"; // 获取用户名或使用默认值

    const noteData = {
        content: content,
        userName: userName
    };

    fetch('/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(noteData)
    })
        .then(response => response.json())
        .then(data => {
            console.log('笔记保存成功:', data);
        })
        .catch(error => {
            console.error('笔记保存失败:', error);
        });
}