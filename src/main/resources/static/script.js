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



    const editor = document.querySelector('.editor-area');
    const h1Btn = document.getElementById('h1Btn');
    const h2Btn = document.getElementById('h2Btn');
    const h3Btn = document.getElementById('h3Btn');
    const boldBtn = document.getElementById('boldBtn');
    const italicBtn = document.getElementById('italicBtn');
    const underlineBtn = document.getElementById('underlineBtn');
    const clearFormatBtn = document.getElementById('clearFormatBtn');
    const codeBlockBtn = document.getElementById('codeBlockBtn');
    const inlineCodeBtn = document.getElementById('inlineCodeBtn');


    const markdownEditor = document.querySelector('.editor-area[contenteditable][data-markdown]');
    const tocContainer = document.getElementById('toc-container');

    // 初始化
    updateTOC();

    // 监听所有编辑操作（包括回车键）
    markdownEditor.addEventListener('input', updateTOC);
    markdownEditor.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') setTimeout(updateTOC, 10);
    });

    function updateTOC() {
        // 关键修复：按行处理内容
        const content = markdownEditor.innerText || markdownEditor.textContent;
        const headings = [];

        // 精确分割每一行（包括空行）
        const lines = content.split(/\r?\n/);

        lines.forEach(line => {
            const match = line.match(/^(#+)\s+(.+)/);
            if (match) {
                headings.push({
                    level: match[1].length,
                    text: match[2].trim()
                });
            }
        });

        renderTOC(headings);
    }

    function renderTOC(headings) {
        if (headings.length === 0) {
            tocContainer.innerHTML = '<div class="toc-empty">暂无标题</div>';
            return;
        }

        let html = `
            <div class="toc-title">文档大纲</div>
            <div class="toc-items">
        `;

        // 精确还原图片中的圆点样式
        headings.forEach(h => {
            html += `
                <div class="toc-item toc-level-${h.level}">
                    ${'● '.repeat(h.level)}${h.text}
                </div>
            `;
        });

        html += '</div>';
        tocContainer.innerHTML = html;
    }

    // 行内代码按钮点击事件
    inlineCodeBtn.addEventListener('click', function() {
        toggleInlineCode();
    });

    /**
     * 切换行内代码格式（`code`）
     */
    function toggleInlineCode() {
        const selection = window.getSelection();

        // 如果没有选中内容，插入 ``
        if (selection.rangeCount === 0 || selection.toString().trim() === '') {
            const cursorPos = getCursorPosition();
            editor.innerHTML = editor.innerHTML.slice(0, cursorPos) + '``' + editor.innerHTML.slice(cursorPos);

            // 将光标定位到反引号之间
            setCursorBetweenBackticks();
            return;
        }

        // 如果有选中内容，切换行内代码格式
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        // 检查是否已经是行内代码
        const isAlreadyCode = selectedText.startsWith('`') && selectedText.endsWith('`');

        // 如果是行内代码，移除反引号；否则添加反引号
        const newText = isAlreadyCode
            ? selectedText.slice(1, -1)
            : '`' + selectedText + '`';

        range.deleteContents();
        range.insertNode(document.createTextNode(newText));

        // 恢复光标位置
        const newRange = document.createRange();
        newRange.setStart(range.startContainer, range.startOffset);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        editor.focus();
    }

    // 代码块按钮点击事件
    codeBlockBtn.addEventListener('click', function() {
        insertCodeBlock();
    });

    /**
     * 插入 Markdown 代码块
     */
    function insertCodeBlock() {
        const selection = window.getSelection();

        // 如果没有选中内容，插入一个空代码块
        if (selection.rangeCount === 0 || selection.toString().trim() === '') {
            const cursorPos = getCursorPosition();
            const codeBlock = "```\n\n```";
            editor.innerHTML = editor.innerHTML.slice(0, cursorPos) + codeBlock + editor.innerHTML.slice(cursorPos);

            // 将光标定位到代码块内部
            setCursorAfterCodeBlock();
            return;
        }

        // 如果有选中内容，将其包裹为代码块
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        const codeBlock = "```\n" + selectedText + "\n```";

        range.deleteContents();
        range.insertNode(document.createTextNode(codeBlock));

        // 恢复光标位置
        const newRange = document.createRange();
        newRange.setStartAfter(range.startContainer);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        editor.focus();
    }

    /**
     * 获取当前光标位置
     */
    function getCursorPosition() {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return 0;

        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editor);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        return preCaretRange.toString().length;
    }

    /**
     * 将光标定位到代码块内部
     */
    function setCursorAfterCodeBlock() {
        const selection = window.getSelection();
        const range = document.createRange();

        // 找到代码块的起始位置（```后）
        const editorText = editor.innerText;
        const codeBlockStart = editorText.lastIndexOf("```") + 3;

        // 设置光标位置
        range.setStart(editor.firstChild, codeBlockStart);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);
        editor.focus();
    }


    // 加粗按钮
    boldBtn.addEventListener('click', function() {
        toggleFormatting('**', '**'); // Markdown 加粗语法
        // 或者使用 HTML 方式：document.execCommand('bold', false, null);
    });

    // 斜体按钮
    italicBtn.addEventListener('click', function() {
        toggleFormatting('*', '*'); // Markdown 斜体语法
        // 或者使用 HTML 方式：document.execCommand('italic', false, null);
    });

    // 下划线按钮
    underlineBtn.addEventListener('click', function() {
        toggleFormatting('<u>', '</u>'); // HTML 下划线
        // 或者使用 Markdown 兼容方式：toggleFormatting('_', '_');
    });

    /**
     * 切换选中文本的格式（加粗、斜体、下划线等）
     * @param {string} prefix - 格式前缀（如 **、*、<u>）
     * @param {string} suffix - 格式后缀（如 **、*、</u>）
     */
    function toggleFormatting(prefix, suffix) {
        const selection = window.getSelection();

        // 如果没有选中内容，直接返回
        if (selection.rangeCount === 0 || selection.toString().trim() === '') {
            return;
        }

        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();

        // 检查选中文本是否已经有相同的格式（避免重复包裹）
        const alreadyFormatted =
            selectedText.startsWith(prefix) &&
            selectedText.endsWith(suffix);

        let newText;
        if (alreadyFormatted) {
            // 如果已经有格式，就移除格式
            newText = selectedText.slice(prefix.length, -suffix.length);
        } else {
            // 如果没有格式，就添加格式
            newText = prefix + selectedText + suffix;
        }

        // 替换选中内容
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));

        // 恢复光标位置
        const newRange = document.createRange();
        newRange.setStart(range.startContainer, range.startOffset);
        newRange.setEnd(range.startContainer, range.startOffset + newText.length);
        selection.removeAllRanges();
        selection.addRange(newRange);

        // 保持编辑器焦点
        editor.focus();
    }

    clearFormatBtn.addEventListener('click', function() {
        clearAllMarkdownFormat();
    });

    // 清除所有 Markdown 格式的函数
    function clearAllMarkdownFormat() {
        const selection = window.getSelection();

        // 如果没有选中内容，清除整个编辑器的格式
        if (selection.rangeCount === 0 || selection.toString().trim() === '') {
            let editorContent = editor.innerHTML;

            // 替换所有 Markdown 格式为纯文本
            editorContent = removeMarkdownFormatting(editorContent);
            editor.innerHTML = editorContent;
            return;
        }

        // 如果有选中内容，只清除选中部分的格式
        if (editor.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            const selectedText = selection.toString();

            // 移除选中文本中的 Markdown 格式
            const plainText = removeMarkdownFormatting(selectedText);

            // 替换选中内容
            const newTextNode = document.createTextNode(plainText);
            range.deleteContents();
            range.insertNode(newTextNode);

            // 恢复光标位置
            const newRange = document.createRange();
            newRange.setStartAfter(newTextNode);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }

        editor.focus();
    }

    // 移除所有 Markdown 格式的辅助函数
    function removeMarkdownFormatting(text) {
        // 移除标题（#、##、###）
        text = text.replace(/^#{1,3}\s/gm, '');

        // 移除粗体（**text** 或 __text__）
        text = text.replace(/\*\*(.*?)\*\*|__(.*?)__/g, '$1$2');

        // 移除斜体（*text* 或 _text_）
        text = text.replace(/\*(.*?)\*|_(.*?)_/g, '$1$2');

        // 移除删除线（~~text~~）
        text = text.replace(/~~(.*?)~~/g, '$1');

        // 移除内联代码（`code`）
        text = text.replace(/`(.*?)`/g, '$1');

        // 移除链接（[text](url)）
        text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');

        // 移除图片（![alt](url)）
        text = text.replace(/!\[(.*?)\]\(.*?\)/g, '$1');

        // 移除 HTML 颜色（如 <span style="color:red">text</span>）
        text = text.replace(/<span[^>]*>(.*?)<\/span>/g, '$1');

        return text;
    }

    h1Btn.addEventListener('click', function() {
        formatSelection('# ');
    });

    h2Btn.addEventListener('click', function() {
        formatSelection('## ');
    });

    h3Btn.addEventListener('click', function() {
        formatSelection('### ');
    });

    function formatSelection(markdownPrefix) {
        const selection = window.getSelection();

        // 检查是否有选中内容且选中范围在编辑器内
        if (selection.rangeCount === 0 ||
            selection.toString().trim() === '' ||
            !editor.contains(selection.anchorNode)) {
            return;
        }

        const range = selection.getRangeAt(0);
        let selectedText = selection.toString();

        // 移除可能存在的旧 Markdown 标题前缀（#、##、###）
        selectedText = selectedText.replace(/^#{1,3}\s/, '');

        // 创建新的文本节点
        const formattedText = document.createTextNode(markdownPrefix + selectedText);

        // 删除并替换选中内容
        range.deleteContents();
        range.insertNode(formattedText);

        // 将光标放在新插入的文本之后
        const newRange = document.createRange();
        newRange.setStartAfter(formattedText);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);

        // 确保编辑器保持焦点
        editor.focus();
    }


// 获取DOM元素
    const previewButton = document.getElementById('previewMd');
    const editorArea = document.querySelector('.editor-area[data-markdown]');

// 添加点击事件监听器
    previewButton.addEventListener('click', function() {
        const isPreview = editorArea.classList.contains('preview-mode');

        if (isPreview) {
            // 如果是预览状态，切换回原始Markdown
            editorArea.innerHTML = editorArea.getAttribute('data-original-content');
            editorArea.classList.remove('preview-mode');
            editorArea.setAttribute('contenteditable', 'true');
            previewButton.textContent = '预览md';
        } else {
            // 如果是原始状态，渲染为HTML
            editorArea.setAttribute('data-original-content', editorArea.innerHTML);

            // 获取HTML内容，并替换 <div> 和 <br> 为 \n
            let htmlContent = editorArea.innerHTML;

            // 替换 <div><br></div> 或 <div></div> 为 \n
            htmlContent = htmlContent.replace(/<div><br><\/div>/gi, '\n');
            htmlContent = htmlContent.replace(/<div>/gi, '\n');
            htmlContent = htmlContent.replace(/<\/div>/gi, '');

            // 替换 <br> 为 \n
            htmlContent = htmlContent.replace(/<br>/gi, '\n');
            htmlContent = htmlContent.replace(/<br\s*\/?>/gi, '\n');

            // 使用marked.js渲染
            const renderedHTML = marked.parse(htmlContent);
            editorArea.innerHTML = renderedHTML;
            editorArea.classList.add('preview-mode');
            editorArea.setAttribute('contenteditable', 'false');
            previewButton.textContent = '编辑md';
        }
    });


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






// 获取所有工具按钮


const textColorBtn = document.getElementById('textColorBtn');
const boldBtn = document.getElementById('boldBtn');
const italicBtn = document.getElementById('italicBtn');
const underlineBtn = document.getElementById('underlineBtn');

// 获取预览区域元素
const previewArea = document.getElementById('previewArea');

// 设置编辑器区域为可编辑
editorArea.contentEditable = true;

/* ========== 事件监听器 ========== */

// 清除所有格式
clearFormatBtn.addEventListener('click', () => {
    removeAllFormatting(editorArea);
    updateButtonStates();
});



// 文本样式按钮
boldBtn.addEventListener('click', () => toggleTextStyle('fontWeight', 'bold'));
italicBtn.addEventListener('click', () => toggleTextStyle('fontStyle', 'italic'));
underlineBtn.addEventListener('click', () => toggleTextStyle('textDecoration', 'underline'));



/* ========== 核心功能函数 ========== */

// 应用文本颜色
function applyTextColor(color) {
    const selection = window.getSelection();
    if (!isValidSelection(selection)) return;

    saveSelection();
    document.execCommand('foreColor', false, color);
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

/* ========== 状态管理函数 ========== */

// 更新按钮状态
function updateButtonStates() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0 || !editorArea.contains(selection.anchorNode)) return;

    // 更新样式按钮状态
    boldBtn.classList.toggle('active', document.queryCommandState('bold'));
    italicBtn.classList.toggle('active', document.queryCommandState('italic'));
    underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
}
