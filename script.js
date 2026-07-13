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
    if (stepItems.length > 0) { 
        stepItems[0].classList.remove('active'); stepItems[1].classList.add('active'); 
    }
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
            renderVocabUI(); 
        });
        span.appendChild(delBtn);
        vocabDisplay.appendChild(span);
    });
}
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

function updateVocabState(isImportant, isGrammar) {
    if (!selectedVocabTag) return;
    selectedVocabTag.important = isImportant;
    selectedVocabTag.grammar = isGrammar;
    renderVocabUI();
    syncTextDisplay(selectedVocabTag);
}

document.getElementById('vocab-mark-general')?.addEventListener('click', () => {
    if(!selectedVocabTag) alert('請先點選標籤'); else updateVocabState(false, false);
});
document.getElementById('vocab-mark-important')?.addEventListener('click', () => {
    if(!selectedVocabTag) alert('請先點選標籤'); else updateVocabState(true, selectedVocabTag.grammar);
});
document.getElementById('vocab-mark-grammar')?.addEventListener('click', () => {
    if(!selectedVocabTag) alert('請先點選標籤'); else updateVocabState(selectedVocabTag.important, true);
});
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
function applyTextSelectionMark(type) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
        let existingVocab = vocabList.find(v => v.word === selectedText);
        if (!existingVocab) {
            existingVocab = { word: selectedText, important: false, grammar: false };
            vocabList.push(existingVocab);
        }
        if (type === 'general') { existingVocab.important = false; existingVocab.grammar = false; }
        else if (type === 'important') { existingVocab.important = true; }
        else if (type === 'grammar') { existingVocab.grammar = true; }
        
        selectedVocabTag = existingVocab;
        renderVocabUI();
        syncTextDisplay(existingVocab);
        selection.removeAllRanges();
    } else if (selectedVocabTag) {
        if (type === 'general') updateVocabState(false, false);
        else if (type === 'important') updateVocabState(true, selectedVocabTag.grammar);
        else if (type === 'grammar') updateVocabState(selectedVocabTag.important, true);
    } else {
        alert('請先點選一個生詞標籤，或在左側反白課文文字！');
    }
}
document.getElementById('mark-general')?.addEventListener('click', () => applyTextSelectionMark('general'));
document.getElementById('mark-important')?.addEventListener('click', () => applyTextSelectionMark('important'));
document.getElementById('mark-grammar')?.addEventListener('click', () => applyTextSelectionMark('grammar'));

btnSaveEdit.addEventListener('click', () => {
    step2.classList.remove('active'); step2.classList.add('hidden');
    step3.classList.remove('hidden'); step3.classList.add('active');
    if (stepItems.length > 0) { 
        stepItems[1].classList.remove('active'); 
        stepItems[2].classList.add('active'); 
    }
});
// ==== 優雅喝茶模組控制與防呆變數 ====
const teaModal = document.getElementById('tea-modal');
const teaMessage = document.getElementById('tea-message');
const btnCloseTea = document.getElementById('btn-close-tea');
const teaDecisionActions = document.getElementById('tea-decision-actions');
const btnKeepMark = document.getElementById('btn-keep-mark');
const btnOverwriteMark = document.getElementById('btn-overwrite-mark');

let pendingVocab = null; // 暫存發生衝突的詞彙
let pendingType = null;  // 暫存老師想要覆蓋的新標記

btnCloseTea.addEventListener('click', () => teaModal.classList.add('hidden'));
btnKeepMark.addEventListener('click', () => {
    teaModal.classList.add('hidden');
    pendingVocab = null;
    pendingType = null;
});
btnOverwriteMark.addEventListener('click', () => {
    teaModal.classList.add('hidden');
    if (pendingVocab && pendingType) {
        if (pendingType === 'general') { pendingVocab.important = false; pendingVocab.grammar = false; }
        else if (pendingType === 'important') { pendingVocab.important = true; }
        else if (pendingType === 'grammar') { pendingVocab.grammar = true; }
        renderVocabUI();
        syncTextDisplay(pendingVocab);
    }
});

function showTeaTime(msg, isConflict = false) {
    teaMessage.textContent = msg;
    if (isConflict) {
        btnCloseTea.classList.add('hidden');
        teaDecisionActions.classList.remove('hidden');
    } else {
        btnCloseTea.classList.remove('hidden');
        teaDecisionActions.classList.add('hidden');
    }
    teaModal.classList.remove('hidden');
}
// ==== 統一處理標記邏輯 (支援防呆與反悔) ====
function processMarkLogic(vocabObj, type) {
    if (type === 'grammar') {
        vocabObj.grammar = !vocabObj.grammar; // 反悔切換 (Toggle)
        renderVocabUI(); syncTextDisplay(vocabObj);
    } 
    else if (type === 'important') {
        if (vocabObj.important) {
            vocabObj.important = false; // 反悔切換 (Toggle off)
            renderVocabUI(); syncTextDisplay(vocabObj);
        } else {
            vocabObj.important = true;
            renderVocabUI(); syncTextDisplay(vocabObj);
        }
    } 
    else if (type === 'general') {
        if (vocabObj.important || vocabObj.grammar) {
            // 防呆攔截：試圖將已有標記的詞彙改為一般
            pendingVocab = vocabObj;
            pendingType = 'general';
            showTeaTime(`老師，【${vocabObj.word}】目前已有特定標記，您確定要將它改回「一般詞彙」嗎？`, true);
        } else {
            vocabObj.important = false; vocabObj.grammar = false;
            renderVocabUI(); syncTextDisplay(vocabObj);
        }
    }
}

function handleMarkAction(type) {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
        let existingVocab = vocabList.find(v => v.word === selectedText);
        if (!existingVocab) {
            existingVocab = { word: selectedText, important: false, grammar: false };
            vocabList.push(existingVocab);
        }
        selectedVocabTag = existingVocab;
        processMarkLogic(existingVocab, type);
        selection.removeAllRanges(); 
    } 
    else if (selectedVocabTag) {
        processMarkLogic(selectedVocabTag, type);
    } 
    else {
        showTeaTime('請先點選一個生詞標籤，或在左側反白課文文字喔。', false);
    }
}

// 綁定所有按鈕 (攔截焦點轉移)
const allMarkButtons = [
    { id: 'vocab-mark-general', type: 'general' }, { id: 'vocab-mark-important', type: 'important' }, { id: 'vocab-mark-grammar', type: 'grammar' },
    { id: 'mark-general', type: 'general' }, { id: 'mark-important', type: 'important' }, { id: 'mark-grammar', type: 'grammar' }
];

allMarkButtons.forEach(btnInfo => {
    const btn = document.getElementById(btnInfo.id);
    if (btn) {
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault(); 
            handleMarkAction(btnInfo.type);
        });
    }
});
