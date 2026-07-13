<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IMI 華語文本閱讀學習 - 教師端</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- 步驟一：教材匯入區 -->
        <div id="step1-import" class="view-section active">
            <h2>步驟一：匯入教材</h2>
            <label for="text-input">課文文本：</label>
            <textarea id="text-input" placeholder="請貼上課文或對話（對話請以 A: 和 B: 開頭）"></textarea>
            
            <label for="vocab-input">生詞詞彙（請以逗號或換行分隔）：</label>
            <textarea id="vocab-input" placeholder="例如：學生, 老師, 學校"></textarea>
            
            <button id="btn-to-edit" class="primary-btn">匯入並開始編輯</button>
        </div>

        <!-- 步驟二：教材編輯區 -->
        <div id="step2-edit" class="view-section hidden">
            <h2>步驟二：教材編輯</h2>
            <div class="edit-workspace">
                <div class="text-display" id="text-display">
                    <!-- 文本將在這裡動態生成 -->
                </div>
                
                <div class="tools-panel">
                    <h3>標記工具</h3>
                    <p>請反白左側文本後，點擊下方按鈕進行標記：</p>
                    <button class="tool-btn" id="mark-important">標記重要詞彙</button>
                    <button class="tool-btn" id="mark-general">標記一般詞彙</button>
                    <button class="tool-btn" id="mark-grammar">標記語法</button>
                </div>
            </div>
            
            <button id="btn-save-edit" class="primary-btn">確認教材編輯</button>
        </div>

        <!-- 步驟三：AI 參數設定區 (預留區塊) -->
        <div id="step3-params" class="view-section hidden">
            <h2>步驟三：AI 參數設定</h2>
            <!-- 參數設定表單將在此建置 -->
            <button id="btn-generate" class="primary-btn">呼叫 AI 生成學生端教材</button>
        </div>

        <!-- 步驟四：預覽區 (預留區塊) -->
        <div id="step4-preview" class="view-section hidden">
            <h2>步驟四：學生端預覽</h2>
            <!-- HTML 預覽與連結將在此建置 -->
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
