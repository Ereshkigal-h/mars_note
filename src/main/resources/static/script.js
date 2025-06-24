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


// 获取编辑器元素和所有工具按钮
const editorArea = document.querySelector('.editor-area');
const clearFormatBtn = document.getElementById('clearFormatBtn');
const fontFamilySelect = document.getElementById('fontFamily');
const fontSizeSelect = document.getElementById('fontSize');
const textColorBtn = document.getElementById('textColorBtn');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const underlineBtn = document.getElementById('underlineBtn');
const indentBtn = document.getElementById('indentBtn');
const alignLeftBtn = document.getElementById('alignLeftBtn');
const alignCenterBtn = document.getElementById('alignCenterBtn');
const alignRightBtn = document.getElementById('alignRightBtn');

// 设置编辑器区域为可编辑
editorArea.contentEditable = true;

/* ========== 事件监听器 ========== */

// 清除所有格式
clearFormatBtn.addEventListener('click', () => {
    removeAllFormatting(editorArea);
    updateButtonStates();
});

// 字体家族
fontFamilySelect.addEventListener('change', () => {
    applyFontFamily(fontFamilySelect.value);
});

// 字体大小 - 改进实现
fontSizeSelect.addEventListener('change', () => {
    applyFontSize(fontSizeSelect.value + 'px');
});
// 文本样式按钮
boldBtn.addEventListener('click', () => toggleTextStyle('fontWeight', 'bold'));
italicBtn.addEventListener('click', () => toggleTextStyle('fontStyle', 'italic'));
underlineBtn.addEventListener('click', () => toggleTextStyle('textDecoration', 'underline'));

// 对齐按钮
alignLeftBtn.addEventListener('click', () => setTextAlignment('left'));
alignCenterBtn.addEventListener('click', () => setTextAlignment('center'));
alignRightBtn.addEventListener('click', () => setTextAlignment('right'));

// 缩进
indentBtn.addEventListener('click', () => {
    applyIndent();
});

/* ========== 核心功能函数 ========== */

// 应用字体大小
function applyFontSize(size) {
    const selection = window.getSelection();
    if (!isValidSelection(selection)) return;

    // 保存当前选区
    saveSelection();

    // 移除现有的字体大小样式
    removeFormattingByProperty('fontSize');

    // 应用新的字体大小
    if (selection.toString().trim() !== '') {
        document.execCommand('fontSize', false, '7'); // 创建font标签
        const fontElements = editorArea.getElementsByTagName('font');
        const lastFont = fontElements[fontElements.length - 1];
        if (lastFont && lastFont.size === '7') {
            lastFont.removeAttribute('size');
            lastFont.style.fontSize = size;
        }
    } else {
        // 没有选中文本时设置默认样式
        editorArea.style.fontSize = size;
    }

    // 恢复选区
    restoreSelection();
    updateButtonStates();
}
function applyFontFamily(fontFamily) {
    const selection = window.getSelection();

    // 检查选区有效性
    if (!isValidSelection(selection)) return;

    // 清理字体名称中的非法字符
    const validFontFamily = fontFamily.replace(/[^a-zA-Z0-9\s]/g, '');
    console.log(validFontFamily)
    // 保存选区
    saveSelection();
    // 应用字体命令
    if (typeof document.execCommand === 'function') {
        document.execCommand('fontName', false, validFontFamily);

    } else {
        console.warn('document.execCommand is not supported in this browser.');
    }

    // 恢复选区
    restoreSelection();

    // 更新按钮状态
    updateButtonStates();
}

// 应用文本颜色
function applyTextColor(color) {
    const selection = window.getSelection();
    if (!isValidSelection(selection)) return;

    saveSelection();
    document.execCommand('foreColor', false, color);
    restoreSelection();
    updateButtonStates();
}
    const textColorPicker = document.getElementById('textColorPicker');

    // 监听颜色选择器的变化
    if (textColorPicker) {
        textColorPicker.addEventListener('input', function() {
            const selectedColor = textColorPicker.value;
            applyTextColor(selectedColor);
        });
    }
// 切换文本样式
function toggleTextStyle(property, value) {
    const selection = window.getSelection();
    if (!isValidSelection(selection)) return;

    saveSelection();

    // 检查是否已应用该样式
    const isApplied = document.queryCommandState(property === 'fontWeight' ? 'bold' :
        property === 'fontStyle' ? 'italic' : 'underline');

    if (isApplied) {
        document.execCommand(property === 'fontWeight' ? 'bold' :
            property === 'fontStyle' ? 'italic' : 'underline', false, null);
    } else {
        const span = document.createElement('span');
        span.style[property] = value;
        surroundSelection(span);
    }

    restoreSelection();
    updateButtonStates();
}

// 设置文本对齐
function setTextAlignment(align) {
    const selection = window.getSelection();
    if (!isValidSelection(selection)) return;

    saveSelection();
    document.execCommand('justify' + align.charAt(0).toUpperCase() + align.slice(1), false, null);
    restoreSelection();
    updateAlignmentButtons(align);
}

// 应用缩进
function applyIndent() {
    const selection = window.getSelection();
    if (!isValidSelection(selection)) return;

    saveSelection();
    document.execCommand('indent', false, null);
    restoreSelection();
    updateButtonStates();
}

/* ========== 选区管理函数 ========== */

let savedRange = null;

// 保存当前选区
function saveSelection() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0);
    }
}

// 恢复选区
function restoreSelection() {
    if (savedRange) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(savedRange);
    }
}

// 检查选区是否有效
function isValidSelection(selection) {
    return selection.rangeCount > 0 &&
        !selection.isCollapsed &&
        editorArea.contains(selection.anchorNode);
}

/* ========== 格式处理函数 ========== */

// 移除所有格式
function removeAllFormatting(element) {
    document.execCommand('removeFormat', false, null);
    element.querySelectorAll('font, span, div').forEach(el => {
        if (el.hasAttribute('style') && !el.getAttribute('style').trim()) {
            el.removeAttribute('style');
        }
        if (!el.hasAttributes() && el.tagName.toLowerCase() === 'span') {
            const parent = el.parentNode;
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }
            parent.removeChild(el);
        }
    });
}

// 移除特定属性格式
function removeFormattingByProperty(property) {
    const elements = editorArea.querySelectorAll('[style*="' + property + '"]');
    elements.forEach(el => {
        el.style[property] = '';
        if (!el.getAttribute('style')) {
            el.removeAttribute('style');
        }
    });
}

// 环绕选区
function surroundSelection(element) {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;

    try {
        const range = selection.getRangeAt(0);
        range.surroundContents(element);
    } catch (e) {
        // 处理跨元素选区的情况
        const range = selection.getRangeAt(0);
        const content = range.extractContents();
        element.appendChild(content);
        range.insertNode(element);
    }
}

/* ========== 状态管理函数 ========== */

// 更新按钮状态
function updateButtonStates() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || !editorArea.contains(selection.anchorNode)) return;

    // 更新样式按钮状态
    boldBtn.classList.toggle('active', document.queryCommandState('bold'));
    italicBtn.classList.toggle('active', document.queryCommandState('italic'));
    underlineBtn.classList.toggle('active', document.queryCommandState('underline'));

    // 更新字体大小选择器
    updateFontSizeSelector();
}

// 更新字体大小选择器
function updateFontSizeSelector() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    let element = range.commonAncestorContainer;

    if (element.nodeType === Node.TEXT_NODE) {
        element = element.parentElement;
    }

    const fontSize = window.getComputedStyle(element).fontSize;
    if (fontSize) {
        const sizeValue = parseInt(fontSize);
        Array.from(fontSizeSelect.options).forEach(option => {
            if (parseInt(option.value) === sizeValue) {
                option.selected = true; // 设置为目标选项
            } else {
                option.selected = false; // 清除其他选项的 selected 状态
            }

        })
    }


}

// 更新对齐按钮状态
function updateAlignmentButtons(alignment) {
    alignLeftBtn.classList.toggle('active', alignment === 'left');
    alignCenterBtn.classList.toggle('active', alignment === 'center');
    alignRightBtn.classList.toggle('active', alignment === 'right');
}

/* ========== 事件监听 ========== */

// 监听选区变化
document.addEventListener('selectionchange', updateButtonStates);

// 编辑器点击时更新状态
editorArea.addEventListener('click', updateButtonStates);

// 初始化编辑器
editorArea.addEventListener('focus', () => {
    if (editorArea.innerHTML === '') {
        editorArea.innerHTML = '<p><br></p>'; // 确保有可编辑的内容
    }
});

// 字体家族 - 改进实现
fontFamilySelect.addEventListener('change', function() {
    const font = this.value;

    // 保存当前选区
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    // 如果选择了文本
    if (range && !range.collapsed) {

        // 应用新字体
        document.execCommand('fontName', false, font);
    } else {
        // 没有选择文本时，设置整个编辑器的默认字体
        editorArea.style.fontFamily = font;
    }

    // 更新按钮状态
    updateButtonStates();
});