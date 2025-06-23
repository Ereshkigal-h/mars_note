document.addEventListener('DOMContentLoaded', function() {
    const aiButton = document.getElementById('ai-button');
    const aiSidebar = document.querySelector('.ai-sidebar');
    const tabs = document.querySelectorAll('.tab');
    const sidebar = document.querySelector('.sidebar');
    const menuItems = document.querySelectorAll('.menu-item');
    const editorWrapper = document.querySelector('.editor-wrapper');
    const token = localStorage.getItem('token');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const username = localStorage.getItem('username');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const saveButton = document.getElementById('saveButton');
    const aiSend = document.getElementById('ai-send');
    const aiInput = document.getElementById('ai-input');
    const aiConversation = document.querySelector('.ai-conversation');
    const help = document.getElementById('help');

    if(help){
        help.addEventListener('click', function() {
            window.location.href = 'https://github.com/Ereshkigal-h/mars_note';
        });
    }

    // 用户欢迎信息
    if (username) {
        welcomeMessage.textContent = `欢迎，${username}`;
    } else {
        welcomeMessage.textContent = '未登录用户';
    }

    // 登录状态检查
    if (!token) {
        window.location.href = '../logpage/login.html';
        return;
    }

    // 登录按钮处理
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = '../logpage/login.html';
        });
    }

    // 登出按钮处理
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.href = '../logpage/login.html';
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', async function() {
            try {
                const editorContent = document.querySelector('.editor-area').innerText;

                const response = await fetch('http://localhost:8080/notes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: editorContent, //编辑器内容
                        userName: username
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

    // AI按钮切换
    aiButton.addEventListener('click', function() {
        aiSidebar.classList.toggle('active');
        editorWrapper.classList.toggle('ai-active');
        tabs.forEach(tab => tab.classList.remove('active'));
    });

    // 标签页切换
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            editorWrapper.classList.toggle('sidebar-active');
            const isActive = this.classList.contains('active');

            tabs.forEach(t => t.classList.remove('active'));
            this.classList.toggle('active', !isActive);
        });
    });

    // 菜单项切换
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menuItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // AI对话功能
    if (aiSend) {
        aiSend.addEventListener('click', async function() {
            const userMessage = aiInput.value.trim();
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
                // 显示AI思考状态
                const thinkingMsg = document.createElement('div');
                thinkingMsg.className = 'ai-message ai-response';
                thinkingMsg.innerHTML = `
                    <div class="avatar">🤖</div>
                    <div class="message-content">思考中...</div>
                `;
                aiConversation.appendChild(thinkingMsg);

                // 发送请求
                const response = await fetch('/Ai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        message: userMessage
                    })
                });

                if (!response.ok) {
                    throw new Error(`AI请求失败: ${response.status}`);
                }

                // 移除思考消息
                aiConversation.removeChild(thinkingMsg);

                // 处理流式响应
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let aiResponse = '';

                const aiMsgDiv = document.createElement('div');
                aiMsgDiv.className = 'ai-message ai-response';
                aiMsgDiv.innerHTML = `
                    <div class="avatar">🤖</div>
                    <div class="message-content"></div>
                `;
                aiConversation.appendChild(aiMsgDiv);
                const contentDiv = aiMsgDiv.querySelector('.message-content');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value, { stream: true });
                    aiResponse += chunk;
                    contentDiv.textContent = aiResponse;
                    aiConversation.scrollTop = aiConversation.scrollHeight;
                }
            } catch (error) {
                console.error('AI交互错误:', error);

                // 显示错误消息
                const errorMsg = document.createElement('div');
                errorMsg.className = 'ai-message ai-response';
                errorMsg.innerHTML = `
                    <div class="avatar">⚠️</div>
                    <div class="message-content">请求失败: ${error.message}</div>
                `;
                aiConversation.appendChild(errorMsg);
            }
        });
    }
});