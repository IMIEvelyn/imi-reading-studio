// 取得各個畫面區塊
const step1 = document.getElementById('step1-import');
const step2 = document.getElementById('step2-edit');
const step3 = document.getElementById('step3-params');

// 取得進度條元素
const stepItems = document.querySelectorAll('.step-item');

// 取得按鈕與輸入元素
const btnToEdit = document.getElementById('btn-to-edit');
const btnSaveEdit = document.getElementById('btn-save-edit');
const textInput = document.getElementById('text-input');
const vocabInput = document.getElementById('vocab-input');
const textDisplay = document.getElementById('text-display');
const vocabDisplay = document.getElementById('vocab-display');

// 從步驟一跳轉至步驟二
btnToEdit.addEventListener('click', () => {
    const rawText = textInput.value.trim();
    const rawVocab = vocabInput.value.trim();
    if (!rawText) {
        alert('請輸入課文文本');
        return;
    }
    // 處理文本與生詞
    parseAndDisplayText(rawText);
    parseAndDisplayVocab(rawVocab);

    // 切換畫面
    step1.classList.remove('active');
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
    step2.classList.add('active');
    
    // 更新進度條 (步驟一 -> 步驟二)
    stepItems[0].classList.remove('active');
    stepItems[1].classList.add('active');
});

// 解析文本：判斷是短文還是對話
function parseAndDisplayText(text) {
    textDisplay.innerHTML = ''; 
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.trim() === '') return;
        const p = document.createElement('p');
        if (line.startsWith('A:') || line.startsWith('A：')) {
            p.className = 'dialogue-a';
            p.textContent = line;
        } else if (line.startsWith('B:') || line.startsWith('B：')) {
            p.className = 'dialogue-b';
            p.textContent = line;
        } else {
            p.className = 'paragraph';
            p.textContent = line;
        }
        textDisplay.appendChild(p);
    });
}

// 解析生詞並生成標籤
function parseAndDisplayVocab(vocabText) {
    vocabDisplay.innerHTML = '';
    if (!vocabText) return;
    
    // 支援逗號或換行切割
    const vocabs = vocabText.split(/[\n,，、]+/);

vocabs.forEach(v => {
        const word = v.trim();
        if (word === '') return;
        const span = document.createElement('span');
        span.className = 'vocab-tag';
        span.textContent = word;
        vocabDisplay.appendChild(span);
    });
}

// 從步驟二跳轉至步驟三 (AI 參數設定)
btnSaveEdit.addEventListener('click', () => {
    step2.classList.remove('active');
    step2.classList.add('hidden');
    step3.classList.remove('hidden');
    step3.classList.add('active');
    
    // 更新進度條 (步驟二 -> 步驟三)
    stepItems[1].classList.remove('active');
    stepItems[2].classList.add('active');
});
