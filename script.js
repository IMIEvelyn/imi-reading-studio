const step1 = document.getElementById('step1-import');
const step2 = document.getElementById('step2-edit');
const step3 = document.getElementById('step3-params');
const stepItems = document.querySelectorAll('.step-item');

const btnToEdit = document.getElementById('btn-to-edit');
const btnSaveEdit = document.getElementById('btn-save-edit');
const textInput = document.getElementById('text-input');
const vocabInput = document.getElementById('vocab-input');
const textDisplay = document.getElementById('text-display');
const vocabDisplay = document.getElementById('vocab-display');
const newVocabInput = document.getElementById('new-vocab-input');
const btnAddVocab = document.getElementById('btn-add-vocab');

// 核心資料狀態
let vocabList = []; 
let selectedVocabTag = null;

btnToEdit.addEventListener('click', () => {
    const rawText = textInput.value.trim();
    if (!rawText) { alert('請輸入課文文本'); return; }

    parseAndDisplayText(rawText);
    parseAndDisplayVocab(vocabInput.value.trim());

    step1.classList.remove('active'); step1.classList.add('hidden');
    step2.classList.remove('hidden'); step2.classList.add('active');
    stepItems[0].classList.remove('active'); stepItems[1].classList.add('active');
});
function parseAndDisplayText(text) {
    textDisplay.innerHTML = ''; 
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.trim() === '') return;
        const p = document.createElement('p');
        if (line.startsWith('A:') || line.startsWith('A：')) p.className = 'dialogue-a';
        else if (line.startsWith('B:') || line.startsWith('B：')) p.className = 'dialogue-b';
        else p.className = 'paragraph';
        p.textContent = line;
        textDisplay.appendChild(p);
    });
}

function parseAndDisplayVocab(vocabText) {
    vocabList = [];
    if (vocabText) {
        const vocabs = vocabText.split(/[\n,，、]+/);
        vocabs.forEach(v => {
            const word = v.trim();
            if (word !== '' && !vocabList.find(item => item.word === word)) {
                vocabList.push({ word: word, type: 'none' });
            }
        });
    }
    renderVocabUI();
}

// 渲染生詞與互動綁定
function renderVocabUI() {
    vocabDisplay.innerHTML = '';
    vocabList.forEach((v, index) => {
        const span = document.createElement('span');
        span.className = 'vocab-tag';
        if (v.type !== 'none') span.classList.add('mark-' + v.type);
        if (selectedVocabTag === v) span.classList.add('selected');
        
        span.textContent = v.word + ' ';

        // 點擊標籤進行選取
        span.addEventListener('click', (e) => {
            if (e.target.classList.contains('vocab-delete')) return;
            selectedVocabTag = v;
            renderVocabUI();
        });

        // 刪除按鈕 (只刪除標籤，不影響課文)
        const delBtn = document.createElement('span');
        delBtn.className = 'vocab-delete';
        delBtn.textContent = '×';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            vocabList.splice(index, 1);
            if (selectedVocabTag === v) selectedVocabTag = null;
            renderVocabUI();
        });

        span.appendChild(delBtn);
        vocabDisplay.appendChild(span);
    });
}
// 手動新增生詞
btnAddVocab.addEventListener('click', () => {
    const word = newVocabInput.value.trim();
    if (word && !vocabList.find(item => item.word === word)) {
        vocabList.push({ word: word, type: 'none' });
        newVocabInput.value = '';
        renderVocabUI();
    }
});

// 標記邏輯處理 (雙向連動)
function applyMark(type) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
        // 1. 課文反白連動到生詞
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = 'mark-' + type;
        span.appendChild(range.extractContents());
        range.insertNode(span);
        selection.removeAllRanges();

        let existing = vocabList.find(v => v.word === selectedText);
        if (existing) existing.type = type;
        else vocabList.push({ word: selectedText, type: type });
        renderVocabUI();

    } else if (selectedVocabTag) {
        // 2. 標籤選取連動到課文
        selectedVocabTag.type = type;
        renderVocabUI();
        
        const walker = document.createTreeWalker(textDisplay, NodeFilter.SHOW_TEXT, null, false);
        const nodesToReplace = [];
        while (walker.nextNode()) nodesToReplace.push(walker.currentNode);
        
        nodesToReplace.forEach(node => {
            if (node.nodeValue.includes(selectedVocabTag.word)) {
                const parent = node.parentNode;
                if (parent.className && parent.className.startsWith('mark-')) return;
                
                const parts = node.nodeValue.split(selectedVocabTag.word);
                const fragment = document.createDocumentFragment();
                parts.forEach((part, i) => {
                    fragment.appendChild(document.createTextNode(part));
                    if (i < parts.length - 1) {
                        const span = document.createElement('span');
                        span.className = 'mark-' + type;
                        span.textContent = selectedVocabTag.word;
                        fragment.appendChild(span);
                    }
                });
                parent.replaceChild(fragment, node);
            }
        });
        selectedVocabTag = null; // 標記後取消選取
        renderVocabUI();
    } else {
        alert('請先點選一個生詞標籤，或在左側反白課文文字！');
    }
}

document.getElementById('mark-important').addEventListener('click', () => applyMark('important'));
document.getElementById('mark-general').addEventListener('click', () => applyMark('general'));
document.getElementById('mark-grammar').addEventListener('click', () => applyMark('grammar'));

btnSaveEdit.addEventListener('click', () => {
    step2.classList.remove('active'); step2.classList.add('hidden');
    step3.classList.remove('hidden'); step3.classList.add('active');
    stepItems[1].classList.remove('active'); stepItems[2].classList.add('active');
});

