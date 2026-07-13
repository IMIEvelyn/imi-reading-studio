// 取得各個畫面區塊
const step1 = document.getElementById('step1-import');
const step2 = document.getElementById('step2-edit');
const step3 = document.getElementById('step3-params');

// 取得按鈕與輸入元素
const btnToEdit = document.getElementById('btn-to-edit');
const btnSaveEdit = document.getElementById('btn-save-edit');
const textInput = document.getElementById('text-input');
const textDisplay = document.getElementById('text-display');

// 從步驟一跳轉至步驟二
btnToEdit.addEventListener('click', () => {
    const rawText = textInput.value.trim();
    if (!rawText) {
        alert('請輸入課文文本');
        return;
    }

    // 處理文本並呈現於編輯區
    parseAndDisplayText(rawText);

    // 切換畫面
    step1.classList.remove('active');
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    step2.classList.add('active');
});

// 解析文本：判斷是短文還是對話
function parseAndDisplayText(text) {
    textDisplay.innerHTML = ''; // 清空顯示區
    
    // 以換行符號切割文本
    const lines = text.split('\n');
    
    lines.forEach(line => {
        if (line.trim() === '') return;

        const p = document.createElement('p');
        
        // 判斷是否為 A/B 對話模式
        if (line.startsWith('A:') || line.startsWith('A：')) {
            p.className = 'dialogue-a';
            p.textContent = line;
        } else if (line.startsWith('B:') || line.startsWith('B：')) {
            p.className = 'dialogue-b';
            p.textContent = line;
        } else {
            // 一般短文段落
            p.className = 'paragraph';
            p.textContent = line;
        }
        
        textDisplay.appendChild(p);
    });
}

// 從步驟二跳轉至步驟三 (AI 參數設定)
btnSaveEdit.addEventListener('click', () => {
    step2.classList.remove('active');
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    step3.classList.add('active');
});
