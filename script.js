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

let vocabList = []; 
let selectedVocabTag = null;

btnToEdit.addEventListener('click', () => {
    const rawText = textInput.value.trim();
    if (!rawText) { alert('請輸入課文文本'); return; }
    parseAndDisplayText(rawText);
    if (vocabInput) parseAndDisplayVocab(vocabInput.value.trim());
    step1.classList.remove('active'); step1.classList.add('hidden');
    step2.classList.remove('hidden'); step2.classList.add('active');
    if (stepItems.length > 0) { stepItems[0].classList.remove('active'); stepItems[1].classList.add('active'); }
});
function parseAndDisplayText(text) {
    textDisplay.innerHTML = ''; 
    text.split('\n').forEach(line => {
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
        vocabText.split(/[\n,，、]+/).forEach(v => {
            const word = v.trim();
            if (word !== '' && !vocabList.find(item => item.word === word)) {
                vocabList.push({ word: word, important: false, grammar: false });
            }
        });
    }
    renderVocabUI();
}
function renderVocabUI() {
    vocabDisplay.innerHTML = '';
    vocabList.forEach((v, index) => {
        const span = document.createElement('span');
        span.className = 'vocab-tag';
        if (v.important) span.classList.add('is-important');
        if (v.grammar) span.classList.add('is-grammar');
        if (selectedVocabTag === v) span.classList.add('selected');
        
        span.textContent = v.word;
        span.addEventListener('click', (e) => {
            if (e.target.classList.contains('vocab-delete')) return;
            selectedVocabTag = v;
            renderVocabUI();
        });

        const delBtn = document.createElement('span');
        delBtn.className = 'vocab-delete';
        delBtn.textContent = '×';
        delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            vocabList.splice(index, 1);
            if (selectedVocabTag === v) selectedVocabTag = null;
            renderVocabUI(); // 刪除詞彙，不連動課文，保持零干擾
        });
        span.appendChild(delBtn);
        vocabDisplay.appendChild(span);
    });
}
// 修復：手動新增生詞功能
btnAddVocab.addEventListener('click', () => {
    const word = newVocabInput.value.trim();
    if (word && !vocabList.find(item => item.word === word)) {
        vocabList.push({ word: word, important: false, grammar: false });
        newVocabInput.value = '';
        renderVocabUI();
    } else if (word) {
        alert('此詞彙已存在！');
    }
});

// 詞彙狀態更新與雙向連動
function updateVocabState(isImportant, isGrammar) {
    if (!selectedVocabTag) { alert('請先點選一個生詞標籤！'); return; }
    selectedVocabTag.important = isImportant;
    selectedVocabTag.grammar = isGrammar;
    renderVocabUI();
    syncTextDisplay(selectedVocabTag);
}

document.getElementById('vocab-mark-general')?.addEventListener('click', () => updateVocabState(false, false));
document.getElementById('vocab-mark-important')?.addEventListener('click', () => updateVocabState(true, selectedVocabTag.grammar));
document.getElementById('vocab-mark-grammar')?.addEventListener('click', () => updateVocabState(selectedVocabTag.important, true));
// 雙向連動：更新課文標記
function syncTextDisplay(vocabObj) {
    const walker = document.createTreeWalker(textDisplay, NodeFilter.SHOW_TEXT, null, false);
    const nodesToReplace = [];
    while (walker.nextNode()) nodesToReplace.push(walker.currentNode);
    
    nodesToReplace.forEach(node => {
        if (node.nodeValue.includes(vocabObj.word)) {
            const parent = node.parentNode;
            if (parent.className && parent.className.includes('vocab-span')) return; 
            
            const parts = node.nodeValue.split(vocabObj.word);
            const fragment = document.createDocumentFragment();
            parts.forEach((part, i) => {
                fragment.appendChild(document.createTextNode(part));
                if (i < parts.length - 1) {
                    const span = document.createElement('span');
                    span.className = 'vocab-span';
                    if (vocabObj.important) span.classList.add('is-important');
                    if (vocabObj.grammar) span.classList.add('is-grammar');
                    span.textContent = vocabObj.word;
                    fragment.appendChild(span);
                }
            });
            parent.replaceChild(fragment, node);
        }
    });
}
// 讓右側原本的工具按鈕也能套用相同的雙向連動邏輯
document.getElementById('mark-important')?.addEventListener('click', () => updateVocabState(true, selectedVocabTag?.grammar || false));
document.getElementById('mark-general')?.addEventListener('click', () => updateVocabState(false, false));
document.getElementById('mark-grammar')?.addEventListener('click', () => updateVocabState(selectedVocabTag?.important || false, true));

btnSaveEdit.addEventListener('click', () => {
    step2.classList.remove('active'); step2.classList.add('hidden');
    step3.classList.remove('hidden'); step3.classList.add('active');
    if (stepItems.length > 0) { 
        stepItems[1].classList.remove('active'); 
        stepItems[2].classList.add('active'); 
    }
});
