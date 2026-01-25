import { app } from "../../../scripts/app.js";

var i18n = {
    'zh-CN': {
        searchNodes: '搜索节点',
        extensionSettings: 'MechaBaby 扩展配置',
        portTeleportSettings: '端口传送配置',
        portTeleportFollowLang: '语言跟随节点搜索设置',
        portTeleportNoExtra: '当前无其他可配置项',
        inputPlaceholder: '输入关键词搜索节点名称、ID、属性名称或值...',
        closeButton: '关闭 (Esc)',
        noResults: '未找到匹配的节点',
        foundNodes: '找到 {0} 个节点，{1} 个匹配项',
        nodeTitle: '节点标题',
        nodeType: '节点类型',
        nodeId: '节点ID',
        widget: '控件',
        value: '值',
        property: '属性',
        propertyValue: '属性值',
        unknownNode: '未知节点',
        errorNode: '错误节点',
        nodeMayNotLoaded: '节点可能未正确加载',
        matches: '{0} 个匹配',
        moreMatches: '... 还有 {0} 个匹配项',
        nodeLabel: '节点: ',
        typeLabel: '类型: ',
        nodeIdLabel: 'ID: ',
        widgetLabel: '控件: ',
        valueLabel: '值: ',
        propertyLabel: '属性: ',
        propertyValueLabel: '属性值: ',
        nodeMayNotLoadedHint: ' | ⚠️ 节点可能未正确加载',
        settings: '设置',
        nodeSearchSettings: '节点搜索设置',
        language: '语言',
        shortcut: '快捷键',
        save: '保存',
        cancel: '取消',
        selectLanguage: '选择语言',
        selectShortcut: '设置快捷键',
        currentShortcut: '当前快捷键: ',
        pressKey: '按下您想要的快捷键组合...',
        invalidShortcut: '无效的快捷键，请至少包含 Ctrl/Cmd 和一个按键',
        shortcutSaved: '快捷键已保存',
        languageSaved: '语言已保存，请刷新页面',
        autoDetect: '自动检测',
        chinese: '中文',
        english: 'English',
        japanese: '日本語',
        korean: '한국어',
        russian: 'Русский',
        pinWindow: '钉住窗口',
        unpinWindow: '取消钉住'
    },
    'en-US': {
        searchNodes: 'Search Nodes',
        extensionSettings: 'MechaBaby Extension Settings',
        portTeleportSettings: 'Port Teleport Settings',
        portTeleportFollowLang: 'Language follows NodeSearch setting',
        portTeleportNoExtra: 'No additional settings currently',
        inputPlaceholder: 'Enter keywords to search node names, IDs, properties, or values...',
        closeButton: 'Close (Esc)',
        noResults: 'No matching nodes found',
        foundNodes: 'Found {0} nodes, {1} matches',
        nodeTitle: 'Node Title',
        nodeType: 'Node Type',
        nodeId: 'Node ID',
        widget: 'Widget',
        value: 'Value',
        property: 'Property',
        propertyValue: 'Property Value',
        unknownNode: 'Unknown Node',
        errorNode: 'Error Node',
        nodeMayNotLoaded: 'Node may not be loaded correctly',
        matches: '{0} matches',
        moreMatches: '... {0} more matches',
        nodeLabel: 'Node: ',
        typeLabel: 'Type: ',
        nodeIdLabel: 'ID: ',
        widgetLabel: 'Widget: ',
        valueLabel: 'Value: ',
        propertyLabel: 'Property: ',
        propertyValueLabel: 'Property Value: ',
        nodeMayNotLoadedHint: ' | ⚠️ Node may not be loaded correctly',
        settings: 'Settings',
        nodeSearchSettings: 'NodeSearch Settings',
        language: 'Language',
        shortcut: 'Shortcut',
        save: 'Save',
        cancel: 'Cancel',
        selectLanguage: 'Select Language',
        selectShortcut: 'Set Shortcut',
        currentShortcut: 'Current Shortcut: ',
        pressKey: 'Press your desired shortcut combination...',
        invalidShortcut: 'Invalid shortcut, please include at least Ctrl/Cmd and one key',
        shortcutSaved: 'Shortcut saved',
        languageSaved: 'Language saved, please refresh the page',
        autoDetect: 'Auto Detect',
        chinese: '中文',
        english: 'English',
        japanese: '日本語',
        korean: '한국어',
        russian: 'Русский',
        pinWindow: 'Pin Window',
        unpinWindow: 'Unpin Window'
    },
    'ja-JP': {
        searchNodes: 'ノード検索',
        extensionSettings: 'MechaBaby 拡張設定',
        portTeleportSettings: 'ポートテレポート設定',
        portTeleportFollowLang: '言語は NodeSearch 設定に従います',
        portTeleportNoExtra: '現在追加の設定はありません',
        inputPlaceholder: 'キーワードを入力してノード名、ID、プロパティまたは値を検索...',
        closeButton: '閉じる (Esc)',
        noResults: '一致するノードが見つかりません',
        foundNodes: '{0} 個のノード、{1} 件の一致',
        nodeTitle: 'ノードタイトル',
        nodeType: 'ノードタイプ',
        nodeId: 'ノードID',
        widget: 'ウィジェット',
        value: '値',
        property: 'プロパティ',
        propertyValue: 'プロパティ値',
        unknownNode: '不明なノード',
        errorNode: 'エラーノード',
        nodeMayNotLoaded: 'ノードが正しく読み込まれていない可能性があります',
        matches: '{0} 件の一致',
        moreMatches: '... さらに {0} 件の一致',
        nodeLabel: 'ノード: ',
        typeLabel: 'タイプ: ',
        nodeIdLabel: 'ID: ',
        widgetLabel: 'ウィジェット: ',
        valueLabel: '値: ',
        propertyLabel: 'プロパティ: ',
        propertyValueLabel: 'プロパティ値: ',
        nodeMayNotLoadedHint: ' | ⚠️ ノードが正しく読み込まれていない可能性があります',
        shadowBlur: '1px solid rgba(255, 255, 255, 0.2)',
        settings: '設定',
        nodeSearchSettings: 'NodeSearch 設定',
        language: '言語',
        shortcut: 'ショートカット',
        save: '保存',
        cancel: 'キャンセル',
        selectLanguage: '言語を選択',
        selectShortcut: 'ショートカットを設定',
        currentShortcut: '現在のショートカット: ',
        pressKey: '希望のショートカットキーの組み合わせを押してください...',
        invalidShortcut: '無効なショートカットです。Ctrl/Cmd と少なくとも 1 つのキーを含めてください',
        shortcutSaved: 'ショートカットを保存しました',
        languageSaved: '言語を保存しました。ページを更新してください',
        autoDetect: '自動検出',
        chinese: '中文',
        english: 'English',
        japanese: '日本語',
        korean: '한국어',
        russian: 'Русский',
        pinWindow: 'ウィンドウを固定',
        unpinWindow: '固定を解除'
    },
    'ko-KR': {
        searchNodes: '노드 검색',
        extensionSettings: 'MechaBaby 확장 설정',
        portTeleportSettings: '포트 텔레포트 설정',
        portTeleportFollowLang: '언어는 NodeSearch 설정을 따릅니다',
        portTeleportNoExtra: '추가 설정 없음',
        inputPlaceholder: '키워드를 입력하여 노드 이름, ID, 속성 또는 값을 검색...',
        closeButton: '닫기 (Esc)',
        noResults: '일치하는 노드를 찾을 수 없습니다',
        foundNodes: '{0}개의 노드, {1}개의 일치 항목',
        nodeTitle: '노드 제목',
        nodeType: '노드 유형',
        nodeId: '노드 ID',
        widget: '위젯',
        value: '값',
        property: '속성',
        propertyValue: '속성 값',
        unknownNode: '알 수 없는 노드',
        errorNode: '오류 노드',
        nodeMayNotLoaded: '노드가 제대로 로드되지 않았을 수 있습니다',
        matches: '{0}개의 일치',
        moreMatches: '... {0}개의 추가 일치',
        nodeLabel: '노드: ',
        typeLabel: '유형: ',
        nodeIdLabel: 'ID: ',
        widgetLabel: '위젯: ',
        valueLabel: '값: ',
        propertyLabel: '속성: ',
        propertyValueLabel: '속성 값: ',
        nodeMayNotLoadedHint: ' | ⚠️ 노드가 제대로 로드되지 않았을 수 있습니다',
        settings: '설정',
        nodeSearchSettings: 'NodeSearch 설정',
        language: '언어',
        shortcut: '단축키',
        save: '저장',
        cancel: '취소',
        selectLanguage: '언어 선택',
        selectShortcut: '단축키 설정',
        currentShortcut: '현재 단축키: ',
        pressKey: '원하는 단축키 조합을 누르세요...',
        invalidShortcut: '잘못된 단축키입니다. Ctrl/Cmd와 최소 하나의 키를 포함하세요',
        shortcutSaved: '단축키가 저장되었습니다',
        languageSaved: '언어가 저장되었습니다. 페이지를 새로고침하세요',
        autoDetect: '자동 감지',
        chinese: '中文',
        english: 'English',
        japanese: '日本語',
        korean: '한국어',
        russian: 'Русский',
        pinWindow: '창 고정',
        unpinWindow: '고정 해제'
    },
    'ru-RU': {
        searchNodes: 'Поиск узлов',
        extensionSettings: 'Настройки MechaBaby',
        portTeleportSettings: 'Настройки Port Teleport',
        portTeleportFollowLang: 'Язык следует настройке NodeSearch',
        portTeleportNoExtra: 'Дополнительных настроек пока нет',
        inputPlaceholder: 'Введите ключевые слова для поиска имен узлов, ID, свойств или значений...',
        closeButton: 'Закрыть (Esc)',
        noResults: 'Совпадающие узлы не найдены',
        foundNodes: 'Найдено {0} узлов, {1} совпадений',
        nodeTitle: 'Заголовок узла',
        nodeType: 'Тип узла',
        nodeId: 'ID узла',
        widget: 'Виджет',
        value: 'Значение',
        property: 'Свойство',
        propertyValue: 'Значение свойства',
        unknownNode: 'Неизвестный узел',
        errorNode: 'Ошибочный узел',
        nodeMayNotLoaded: 'Узел может быть загружен неправильно',
        matches: '{0} совпадений',
        moreMatches: '... еще {0} совпадений',
        nodeLabel: 'Узел: ',
        typeLabel: 'Тип: ',
        nodeIdLabel: 'ID: ',
        widgetLabel: 'Виджет: ',
        valueLabel: 'Значение: ',
        propertyLabel: 'Свойство: ',
        propertyValueLabel: 'Значение свойства: ',
        nodeMayNotLoadedHint: ' | ⚠️ Узел может быть загружен неправильно',
        settings: 'Настройки',
        nodeSearchSettings: 'NodeSearch Настройки',
        language: 'Язык',
        shortcut: 'Горячая клавиша',
        save: 'Сохранить',
        cancel: 'Отмена',
        selectLanguage: 'Выберите язык',
        selectShortcut: 'Установить горячую клавишу',
        currentShortcut: 'Текущая горячая клавиша: ',
        pressKey: 'Нажмите желаемую комбинацию клавиш...',
        invalidShortcut: 'Неверная горячая клавиша, пожалуйста, включите как минимум Ctrl/Cmd и одну клавишу',
        shortcutSaved: 'Горячая клавиша сохранена',
        languageSaved: 'Язык сохранен, пожалуйста, обновите страницу',
        autoDetect: 'Автоопределение',
        chinese: '中文',
        english: 'English',
        japanese: '日本語',
        korean: '한국어',
        russian: 'Русский',
        pinWindow: 'Закрепить окно',
        unpinWindow: 'Открепить окно'
    }
};


var langMap = {
    'zh': 'zh-CN',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-CN',
    'en': 'en-US',
    'en-US': 'en-US',
    'en-GB': 'en-US',
    'ja': 'ja-JP',
    'ja-JP': 'ja-JP',
    'ko': 'ko-KR',
    'ko-KR': 'ko-KR',
    'ru': 'ru-RU',
    'ru-RU': 'ru-RU'
};


function showToast(message, duration) {
    duration = duration || 2000;
    var toast = document.createElement("div");
    toast.style.cssText = 
        "position: fixed;" +
        "top: 20px;" +
        "right: 20px;" +
        "background: rgba(255, 193, 7, 0.9);" +
        "backdrop-filter: blur(10px);" +
        "color: #0c0c0c;" +
        "padding: 16px 26px;" +
        "border-radius: 8px;" +
        "box-shadow: 0 6px 20px rgba(255, 193, 7, 0.5);" +
        "border: 1px solid rgba(255, 235, 59, 0.6);" +
        "z-index: 10001;" +
        "font-size: 18px;" +
        "font-weight: 600;" +
        "max-width: 400px;" +
        "word-wrap: break-word;" +
        "opacity: 0;" +
        "transform: translateY(-10px);" +
        "transition: opacity 0.3s ease, transform 0.3s ease;";
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 10);
    
    setTimeout(function() {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-10px)";
        setTimeout(function() {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

var config = {
    
    getLanguage: function() {
        var saved = localStorage.getItem('mechababy.nodeSearch.language');
        if (saved && i18n[saved]) {
            return saved;
        }
        
        var browserLang = navigator.language || navigator.userLanguage || 'en-US';
        return langMap[browserLang] || langMap[browserLang.split('-')[0]] || 'en-US';
    },
    
    setLanguage: function(lang) {
        if (i18n[lang]) {
            localStorage.setItem('mechababy.nodeSearch.language', lang);
            return true;
        }
        return false;
    },
    
    getShortcut: function() {
        var saved = localStorage.getItem('mechababy.nodeSearch.shortcut');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                return { ctrl: true, key: 'f' };
            }
        }
        return { ctrl: true, key: 'f' }; 
    },
    
    setShortcut: function(shortcut) {
        try {
            localStorage.setItem('mechababy.nodeSearch.shortcut', JSON.stringify(shortcut));
            return true;
        } catch (e) {
            return false;
        }
    },
    
    formatShortcut: function(shortcut) {
        if (!shortcut) shortcut = this.getShortcut();
        var parts = [];
        if (shortcut.ctrl) parts.push('Ctrl');
        if (shortcut.alt) parts.push('Alt');
        if (shortcut.shift) parts.push('Shift');
        if (shortcut.meta) parts.push('Cmd');
        if (shortcut.key) {
            var key = shortcut.key;
            if (key.length === 1) {
                key = key.toUpperCase();
            }
            parts.push(key);
        }
        return parts.join('+');
    },

    getIsPinned: function() {
        return localStorage.getItem('mechababy.nodeSearch.pinned') === 'true';
    },

    setIsPinned: function(pinned) {
        localStorage.setItem('mechababy.nodeSearch.pinned', pinned);
    },

    getPinnedPosition: function() {
        var saved = localStorage.getItem('mechababy.nodeSearch.pinnedPosition');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {}
        }
        return null;
    },

    setPinnedPosition: function(pos) {
        localStorage.setItem('mechababy.nodeSearch.pinnedPosition', JSON.stringify(pos));
    }
};


function t(key) {
    var lang = config.getLanguage();
    var texts = i18n[lang] || i18n['en-US'];
    var text = texts[key] || i18n['en-US'][key] || key;
    
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            text = text.replace('{' + (i - 1) + '}', arguments[i]);
        }
    }
    return text;
}


var nodeSearchState = {
    searchDialog: null,
    searchResults: [],
    currentResultIndex: -1,
    keyboardHandlerBound: false,
    openSearchDialog: null,  
    currentHandler: null,    
    settingsDialog: null,
    isPinned: false,
    pinnedPosition: null
};

app.registerExtension({
    name: "MechaBaby.NodeSearch",
    
    
    getCanvasMenuItems: function() {
        var currentShortcut = config.formatShortcut();
        var menuItems = [
            null,
            {
                content: '🔍 ' + t('searchNodes') + ' (' + currentShortcut + ')',
                callback: function() {
                    if (nodeSearchState.openSearchDialog) {
                        nodeSearchState.openSearchDialog();
                    }
                }
            },
            null,
            {
                content: '⚙️ ' + t('extensionSettings'),
                has_submenu: true,
                submenu: {
                    options: [
                        {
                            content: '🔍 ' + t('nodeSearchSettings'),
                            has_submenu: true,
                            submenu: {
                                options: [
                                    {
                                        content: t('language'),
                                        has_submenu: true,
                                        submenu: {
                                            options: [
                                                { content: t('autoDetect'), callback: function() { config.setLanguage(config.getLanguage()); } },
                                                null,
                                                { content: '🇨🇳 ' + t('chinese'), callback: function() { config.setLanguage('zh-CN'); showToast(t('languageSaved')); } },
                                                { content: '🇺🇸 ' + t('english'), callback: function() { config.setLanguage('en-US'); showToast(t('languageSaved')); } },
                                                { content: '🇯🇵 ' + t('japanese'), callback: function() { config.setLanguage('ja-JP'); showToast(t('languageSaved')); } },
                                                { content: '🇰🇷 ' + t('korean'), callback: function() { config.setLanguage('ko-KR'); showToast(t('languageSaved')); } },
                                                { content: '🇷🇺 ' + t('russian'), callback: function() { config.setLanguage('ru-RU'); showToast(t('languageSaved')); } }
                                            ]
                                        }
                                    },
                                    {
                                        content: t('shortcut'),
                                        callback: function() {
                                            if (nodeSearchState.openSettingsDialog) {
                                                nodeSearchState.openSettingsDialog();
                                            }
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ];

        // 合并端口传送的菜单项（如果存在）
        if (typeof window !== 'undefined' && window.getPortTeleportMenuItems) {
            var portTeleportItems = window.getPortTeleportMenuItems();
            if (portTeleportItems && portTeleportItems.length > 0) {
                for (var i = 0; i < menuItems.length; i++) {
                    if (menuItems[i] && menuItems[i].content && (menuItems[i].content.indexOf('MechaBaby') >= 0 || menuItems[i].content.indexOf(t('extensionSettings')) >= 0)) {
                        if (menuItems[i].submenu && menuItems[i].submenu.options) {
                            menuItems[i].submenu.options.push(null);
                            menuItems[i].submenu.options = menuItems[i].submenu.options.concat(portTeleportItems);
                        }
                        break;
                    }
                }
            }
        }

        return menuItems;
    },
    
    setup: function() {
        var searchDialog = nodeSearchState.searchDialog;
        var searchResults = nodeSearchState.searchResults;
        var currentResultIndex = nodeSearchState.currentResultIndex;
        var keyboardHandlerBound = nodeSearchState.keyboardHandlerBound;

        
        function searchNodes(keyword) {
            if (!keyword || keyword.trim() === "") {
                return [];
            }

            var keywordLower = keyword.toLowerCase().trim();
            var results = [];

            
            if (app.graph && app.graph._nodes) {
                app.graph._nodes.forEach(function(node) {
                    
                    try {
                        
                        if (!node) return;
                        
                        const matches = [];
                        let nodeTitle = "";
                        
                        
                        try {
                            nodeTitle = node.getTitle ? node.getTitle() : (node.title || node.type || "");
                        } catch (e) {
                            nodeTitle = node.type || node.title || t('unknownNode');
                        }
                        
                        
                        if (nodeTitle && nodeTitle.toLowerCase().includes(keywordLower)) {
                            matches.push({
                                type: 'node_title',
                                name: t('nodeTitle'),
                                value: nodeTitle,
                                display: t('nodeLabel') + nodeTitle
                            });
                        }

                        
                        if (node.type && node.type.toLowerCase().includes(keywordLower)) {
                            matches.push({
                                type: 'node_type',
                                name: t('nodeType'),
                                value: node.type,
                                display: t('typeLabel') + node.type
                            });
                        }

                        
                        if (node.id !== undefined && node.id !== null) {
                            var nodeIdStr = String(node.id);
                            if (nodeIdStr.toLowerCase().includes(keywordLower)) {
                                matches.push({
                                    type: 'node_id',
                                    name: t('nodeId'),
                                    value: node.id,
                                    display: t('nodeIdLabel') + nodeIdStr
                                });
                            }
                        }

                        
                        try {
                            if (node.widgets && Array.isArray(node.widgets)) {
                                node.widgets.forEach(function(widget, index) {
                                    try {
                                        if (!widget) return;
                                        
                                        const widgetName = widget.name || '';
                                        const widgetValue = (node.widgets_values && node.widgets_values[index] !== undefined) 
                                            ? node.widgets_values[index] 
                                            : (widget.value !== undefined ? widget.value : '');
                                        
                                        
                                        if (widgetName && widgetName.toLowerCase().includes(keywordLower)) {
                                            matches.push({
                                                type: 'widget_name',
                                                name: widgetName,
                                                value: widgetValue,
                                                display: t('widgetLabel') + widgetName + ' = ' + String(widgetValue).substring(0, 50)
                                            });
                                        }
                                        
                                        
                                        const valueStr = String(widgetValue);
                                        if (valueStr && valueStr.toLowerCase().includes(keywordLower) && widgetName) {
                                            matches.push({
                                                type: 'widget_value',
                                                name: widgetName,
                                                value: widgetValue,
                                                display: t('valueLabel') + widgetName + ' = ' + valueStr.substring(0, 50)
                                            });
                                        }
                                    } catch (widgetError) {
                                        
                                        console.debug("[MechaBaby NodeSearch] 搜索控件时出�?", widgetError);
                                    }
                                });
                            }
                        } catch (widgetsError) {
                            
                            console.debug("[MechaBaby NodeSearch] 访问节点控件时出�?", widgetsError);
                        }

                        
                        try {
                            if (node.properties && typeof node.properties === 'object') {
                                Object.keys(node.properties).forEach(function(propName) {
                                    try {
                                        var propValue = node.properties[propName];
                                        var propValueStr = String(propValue);
                                        
                                        
                                        if (propName && propName.toLowerCase().includes(keywordLower)) {
                                            matches.push({
                                                type: 'property_name',
                                                name: propName,
                                                value: propValue,
                                                display: t('propertyLabel') + propName + ' = ' + propValueStr.substring(0, 50)
                                            });
                                        }
                                        
                                        
                                        if (propValueStr && propValueStr.toLowerCase().includes(keywordLower)) {
                                            matches.push({
                                                type: 'property_value',
                                                name: propName,
                                                value: propValue,
                                                display: t('propertyValueLabel') + propName + ' = ' + propValueStr.substring(0, 50)
                                            });
                                        }
                                    } catch (propError) {
                                        
                                        console.debug("[MechaBaby NodeSearch] 搜索属性时出错:", propError);
                                    }
                                });
                            }
                        } catch (propertiesError) {
                            
                            console.debug("[MechaBaby NodeSearch] 访问节点属性时出错:", propertiesError);
                        }

                        
                        if (matches.length > 0) {
                            results.push({
                                node: node,
                                nodeTitle: nodeTitle,
                                nodeType: node.type || "未知类型",
                                nodeId: node.id,
                                matches: matches,
                                matchCount: matches.length,
                                isAvailableNode: false 
                            });
                        }
                    } catch (nodeError) {
                        
                        const nodeTypeStr = (node && node.type) ? node.type : "未知";
                        console.debug("[MechaBaby NodeSearch] 搜索节点时出错（可能是未安装的节点）:", nodeError, nodeTypeStr);
                        
                        if (node && node.type) {
                            try {
                                const nodeType = node.type;
                                if (nodeType.toLowerCase().includes(keywordLower)) {
                                    results.push({
                                        node: node,
                                        nodeTitle: nodeType + ' (' + t('errorNode') + ')',
                                        nodeType: nodeType,
                                        nodeId: node.id,
                                        matches: [{
                                            type: 'node_type',
                                            name: t('nodeType'),
                                            value: nodeType,
                                            display: t('typeLabel') + nodeType + ' (' + t('nodeMayNotLoaded') + ')'
                                        }],
                                        matchCount: 1,
                                        isAvailableNode: false,
                                        hasError: true 
                                    });
                                }
                            } catch (e) {
                                
                            }
                        }
                    }
                });
            }

            return results;
        }

        
        function jumpToNode(node, matchIndex) {
            if (matchIndex === undefined) {
                matchIndex = 0;
            }
            if (!node) return;
            
            
            app.canvas.centerOnNode(node);
            
            
            app.canvas.selectNode(node);
            
            
            highlightNode(node);
        }
        
        
        function highlightNode(node) {
            if (!node) return;
            
            
            var originalColor = node.color;
            var originalBgColor = node.bgcolor;
            
            
            var highlightColor = "#FFD700";
            var highlightBgColor = "#4a3d00";
            
            var flashCount = 0;
            var maxFlashes = 6; 
            var flashInterval = 150; 
            
            function flash() {
                if (flashCount >= maxFlashes) {
                    
                    node.color = originalColor;
                    node.bgcolor = originalBgColor;
                    app.canvas.setDirty(true, true);
                    return;
                }
                
                if (flashCount % 2 === 0) {
                    
                    node.color = highlightColor;
                    node.bgcolor = highlightBgColor;
                } else {
                    
                    node.color = originalColor;
                    node.bgcolor = originalBgColor;
                }
                
                app.canvas.setDirty(true, true);
                flashCount++;
                setTimeout(flash, flashInterval);
            }
            
            
            flash();
        }

        
        function createSearchDialog() {
            if (searchDialog) {
                return searchDialog;
            }

            nodeSearchState.isPinned = config.getIsPinned();
            nodeSearchState.pinnedPosition = config.getPinnedPosition();

            const dialog = document.createElement('div');
            dialog.id = 'mechababy-node-search-dialog';
            
            var initialStyle = 
                'position: fixed;' +
                'background: #2a2a2a;' +
                'border: 2px solid #4a4a4a;' +
                'border-radius: 8px;' +
                'padding: 20px;' +
                'z-index: 10000;' +
                'min-width: 500px;' +
                'max-width: 700px;' +
                'max-height: 600px;' +
                'display: flex;' +
                'flex-direction: column;' +
                'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);' +
                "font-family: 'Microsoft YaHei', 'SimHei', Arial, sans-serif;";

            if (nodeSearchState.isPinned && nodeSearchState.pinnedPosition) {
                initialStyle += 'top: ' + nodeSearchState.pinnedPosition.y + 'px; left: ' + nodeSearchState.pinnedPosition.x + 'px; transform: none;';
            } else {
                initialStyle += 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
            }
            dialog.style.cssText = initialStyle;

            
            const header = document.createElement('div');
            header.style.cssText =
                'display: flex;' +
                'justify-content: space-between;' +
                'align-items: center;' +
                'margin-bottom: 15px;' +
                'border-bottom: 1px solid #4a4a4a;' +
                'padding-bottom: 10px;' +
                'cursor: move;' +
                'user-select: none;';
            
            const title = document.createElement('div');
            title.textContent = '🔍 ' + t('searchNodes');
            title.style.cssText =
                'font-size: 18px;' +
                'font-weight: bold;' +
                'color: #e0e0e0;';
            header.appendChild(title);

            const headerButtons = document.createElement('div');
            headerButtons.style.cssText = 'display: flex; align-items: center; gap: 8px;';

            const pinBtn = document.createElement('span');
            pinBtn.textContent = nodeSearchState.isPinned ? "📌" : "📍";
            pinBtn.title = nodeSearchState.isPinned ? t('unpinWindow') : t('pinWindow');
            pinBtn.style.cssText = 
                'cursor: pointer;' +
                'font-size: 16px;' +
                'color: ' + (nodeSearchState.isPinned ? '#4a9eff' : '#888') + ';' +
                'width: 24px;' +
                'height: 24px;' +
                'display: flex;' +
                'align-items: center;' +
                'justify-content: center;' +
                'border-radius: 4px;' +
                'transition: background 0.2s;';
            
            pinBtn.addEventListener('mouseenter', function() {
                pinBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            });
            pinBtn.addEventListener('mouseleave', function() {
                pinBtn.style.background = 'transparent';
            });
            
            pinBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                nodeSearchState.isPinned = !nodeSearchState.isPinned;
                config.setIsPinned(nodeSearchState.isPinned);
                
                if (nodeSearchState.isPinned) {
                    var rect = dialog.getBoundingClientRect();
                    nodeSearchState.pinnedPosition = { x: rect.left, y: rect.top };
                    config.setPinnedPosition(nodeSearchState.pinnedPosition);
                    
                    dialog.style.transform = 'none';
                    dialog.style.top = nodeSearchState.pinnedPosition.y + 'px';
                    dialog.style.left = nodeSearchState.pinnedPosition.x + 'px';
                } else {
                    dialog.style.top = '50%';
                    dialog.style.left = '50%';
                    dialog.style.transform = 'translate(-50%, -50%)';
                }
                
                pinBtn.textContent = nodeSearchState.isPinned ? "📌" : "📍";
                pinBtn.title = nodeSearchState.isPinned ? t('unpinWindow') : t('pinWindow');
                pinBtn.style.color = nodeSearchState.isPinned ? '#4a9eff' : '#888';
            });
            
            headerButtons.appendChild(pinBtn);
            header.appendChild(headerButtons);
            dialog.appendChild(header);

            
            var isDragging = false;
            var dragStartX, dragStartY;
            var dialogStartX, dialogStartY;

            header.addEventListener('mousedown', function(e) {
                if (e.target === pinBtn) return;
                
                isDragging = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                var rect = dialog.getBoundingClientRect();
                dialogStartX = rect.left;
                dialogStartY = rect.top;
                
                
                if (dialog.style.transform && dialog.style.transform.includes('translate')) {
                    dialog.style.transform = 'none';
                    dialog.style.left = dialogStartX + 'px';
                    dialog.style.top = dialogStartY + 'px';
                }
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                
                e.preventDefault();
            });

            function onMouseMove(e) {
                if (!isDragging) return;
                
                var dx = e.clientX - dragStartX;
                var dy = e.clientY - dragStartY;
                
                var newX = dialogStartX + dx;
                var newY = dialogStartY + dy;
                
                dialog.style.left = newX + 'px';
                dialog.style.top = newY + 'px';
            }

            function onMouseUp() {
                if (isDragging) {
                    isDragging = false;
                    
                    if (nodeSearchState.isPinned) {
                        var rect = dialog.getBoundingClientRect();
                        nodeSearchState.pinnedPosition = { x: rect.left, y: rect.top };
                        config.setPinnedPosition(nodeSearchState.pinnedPosition);
                    }
                    
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                }
            }
            
            
            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = 'margin-bottom: 15px;';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = t('inputPlaceholder');
            input.style.cssText =
                'width: 100%;' +
                'padding: 10px;' +
                'background: #1a1a1a;' +
                'border: 1px solid #4a4a4a;' +
                'border-radius: 4px;' +
                'color: #e0e0e0;' +
                'font-size: 14px;' +
                'box-sizing: border-box;';
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchResults.length > 0 && currentResultIndex >= 0) {
                        var result = searchResults[currentResultIndex];
                        jumpToNode(result.node);
                        if (!nodeSearchState.isPinned) {
                            closeDialog();
                        }
                    }
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (currentResultIndex < searchResults.length - 1) {
                        currentResultIndex++;
                        updateResultsList();
                    }
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (currentResultIndex > 0) {
                        currentResultIndex--;
                        updateResultsList();
                    }
                } else if (e.key === 'Escape') {
                    closeDialog();
                }
            });
            input.addEventListener('input', function(e) {
                var keyword = e.target.value;
                searchResults = searchNodes(keyword);
                currentResultIndex = searchResults.length > 0 ? 0 : -1;
                updateResultsList();
            });
            inputContainer.appendChild(input);
            dialog.appendChild(inputContainer);

            
            const resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results-container';
            resultsContainer.style.cssText =
                'flex: 1;' +
                'overflow-y: auto;' +
                'max-height: 400px;' +
                'border: 1px solid #4a4a4a;' +
                'border-radius: 4px;' +
                'background: #1a1a1a;';
            dialog.appendChild(resultsContainer);

            
            const info = document.createElement('div');
            info.id = 'search-info';
            info.style.cssText =
                'margin-top: 10px;' +
                'font-size: 12px;' +
                'color: #888;' +
                'text-align: center;';
            dialog.appendChild(info);

            
            const footer = document.createElement('div');
            footer.style.cssText = 'display: flex; justify-content: flex-end; margin-top: 10px;';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = t('closeButton');
            closeBtn.style.cssText =
                'padding: 8px 16px;' +
                'background: #4a4a4a;' +
                'border: none;' +
                'border-radius: 4px;' +
                'color: #e0e0e0;' +
                'cursor: pointer;' +
                'font-size: 14px;';
            closeBtn.addEventListener('click', closeDialog);
            closeBtn.addEventListener('mouseenter', function() {
                closeBtn.style.background = '#5a5a5a';
            });
            closeBtn.addEventListener('mouseleave', function() {
                closeBtn.style.background = '#4a4a4a';
            });
            footer.appendChild(closeBtn);
            dialog.appendChild(footer);

            
            function updateResultsList() {
                const container = resultsContainer;
                container.innerHTML = '';

                if (searchResults.length === 0) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.textContent = t('noResults');
                    emptyMsg.style.cssText =
                        'padding: 20px;' +
                        'text-align: center;' +
                        'color: #888;';
                    container.appendChild(emptyMsg);
                    info.textContent = '';
                    return;
                }

                var totalMatches = 0;
                for (var i = 0; i < searchResults.length; i++) {
                    totalMatches += searchResults[i].matchCount;
                }
                info.textContent = t('foundNodes', searchResults.length, totalMatches);

                for (var idx = 0; idx < searchResults.length; idx++) {
                    (function(index) {
                        var result = searchResults[index];
                        var item = document.createElement('div');
                        item.setAttribute('data-result-index', index);
                        item.style.cssText = 'padding: 12px; border-bottom: 1px solid #3a3a3a; cursor: pointer; background: ' + (index === currentResultIndex ? '#3a3a3a' : 'transparent') + '; transition: background 0.2s;';
                        item.addEventListener('mouseenter', function() {
                            if (index !== currentResultIndex) {
                                item.style.background = '#333';
                            }
                        });
                        item.addEventListener('mouseleave', function() {
                            if (index !== currentResultIndex) {
                                item.style.background = 'transparent';
                            }
                        });
                        item.addEventListener('click', function() {
                            currentResultIndex = index;
                            updateResultsList();
                            if (result.hasError) {
                                
                                if (result.node) {
                                    try {
                                        jumpToNode(result.node);
                                    } catch (e) {
                                        showToast(t('nodeMayNotLoaded') + ': "' + result.nodeTitle + '"');
                                    }
                                }
                            } else {
                                
                                jumpToNode(result.node);
                                if (!nodeSearchState.isPinned) {
                                    closeDialog();
                                }
                            }
                        });

                        
                        var title = document.createElement('div');
                        var statusBadge = result.hasError ? ' [' + t('errorNode') + ']' : '';
                        title.textContent = result.nodeTitle + statusBadge + ' (' + t('matches', result.matchCount) + ')';
                        title.style.cssText = 'font-weight: bold; color: ' + (result.hasError ? '#ff4a4a' : '#4a9eff') + '; margin-bottom: 5px; font-size: 14px;';
                        item.appendChild(title);

                        
                        var type = document.createElement('div');
                        var typeText = t('typeLabel') + result.nodeType;
                        if (result.hasError) {
                            typeText += t('nodeMayNotLoadedHint');
                        }
                        type.textContent = typeText;
                        type.style.cssText = 'color: ' + (result.hasError ? '#ff8888' : '#888') + '; font-size: 12px; margin-bottom: 8px;';
                        item.appendChild(type);

                        
                        var matchesList = document.createElement('div');
                        var displayMatches = result.matches.slice(0, 3);
                        for (var j = 0; j < displayMatches.length; j++) {
                            var match = displayMatches[j];
                            var matchItem = document.createElement('div');
                            matchItem.textContent = '  • ' + match.display;
                            matchItem.style.cssText = 'color: #aaa; font-size: 12px; margin-left: 10px; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                            matchesList.appendChild(matchItem);
                        }
                        if (result.matches.length > 3) {
                            var more = document.createElement('div');
                            more.textContent = '  ' + t('moreMatches', result.matches.length - 3);
                            more.style.cssText = 'color: #666; font-size: 11px; margin-left: 10px; font-style: italic;';
                            matchesList.appendChild(more);
                        }
                        item.appendChild(matchesList);

                        container.appendChild(item);
                    })(idx);
                }
                
                
                if (currentResultIndex >= 0 && currentResultIndex < searchResults.length) {
                    setTimeout(function() {
                        var selectedItem = container.querySelector('[data-result-index="' + currentResultIndex + '"]');
                        if (selectedItem) {
                            selectedItem.scrollIntoView({
                                behavior: 'smooth',
                                block: 'nearest'
                            });
                        }
                    }, 0);
                }
            }

            function closeDialog() {
                if (dialog.parentNode) {
                    dialog.parentNode.removeChild(dialog);
                }
                searchDialog = null;
                searchResults = [];
                currentResultIndex = -1;
            }

            
            dialog.addEventListener('click', function(e) {
                if (e.target === dialog) {
                    closeDialog();
                }
            });

            
            updateResultsList();

            return dialog;
        }

        
        function openSearchDialog() {
            if (!searchDialog) {
                searchDialog = createSearchDialog();
                document.body.appendChild(searchDialog);
            } else {
                
                if (searchDialog.style.display === 'none') {
                    searchDialog.style.display = 'flex';
                }
            }
            
            
            setTimeout(function() {
                var input = searchDialog.querySelector('input');
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 50);
        }
        
        
        nodeSearchState.openSearchDialog = openSearchDialog;

        
        function checkShortcutMatch(e, shortcut) {
            if (!shortcut) return false;
            
            var ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : (!e.ctrlKey && !e.metaKey);
            var altMatch = shortcut.alt ? e.altKey : !e.altKey;
            var shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
            var metaMatch = shortcut.meta ? e.metaKey : !e.metaKey;
            var keyMatch = shortcut.key && (e.key === shortcut.key || e.key === shortcut.key.toLowerCase() || e.key === shortcut.key.toUpperCase());
            
            return ctrlMatch && altMatch && shiftMatch && metaMatch && keyMatch;
        }

        
        function bindKeyboardShortcut() {
            
            if (nodeSearchState.currentHandler) {
                document.removeEventListener('keydown', nodeSearchState.currentHandler, true);
                window.removeEventListener('keydown', nodeSearchState.currentHandler, true);
                if (app.canvas && app.canvas.canvas) {
                    app.canvas.canvas.removeEventListener('keydown', nodeSearchState.currentHandler, true);
                }
            }
            
            var shortcut = config.getShortcut();
            
            var handler = function(e) {
                
                if (checkShortcutMatch(e, shortcut)) {
                    
                    var activeElement = document.activeElement;
                    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                        
                        if (searchDialog && searchDialog.contains(activeElement)) {
                            return;
                        }
                    }
                    
                    
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    openSearchDialog();
                    return false;
                }
            };
            
            
            nodeSearchState.currentHandler = handler;
            
            
            
            document.addEventListener('keydown', handler, true);
            
            
            window.addEventListener('keydown', handler, true);
            
            
            if (app.canvas) {
                if (app.canvas.canvas) {
                    app.canvas.canvas.addEventListener('keydown', handler, true);
                }
                
                setTimeout(function() {
                    if (app.canvas && app.canvas.canvas) {
                        app.canvas.canvas.addEventListener('keydown', handler, true);
                    }
                }, 500);
            }
            
            keyboardHandlerBound = true;
        }

        
        function createSettingsDialog() {
            if (nodeSearchState.settingsDialog) {
                return nodeSearchState.settingsDialog;
            }

            var dialog = document.createElement('div');
            dialog.id = 'mechababy-node-search-settings';
            dialog.style.cssText =
                'position: fixed;' +
                'top: 50%;' +
                'left: 50%;' +
                'transform: translate(-50%, -50%);' +
                'background: #2a2a2a;' +
                'border: 2px solid #4a4a4a;' +
                'border-radius: 8px;' +
                'padding: 20px;' +
                'z-index: 10001;' +
                'min-width: 400px;' +
                'max-width: 500px;' +
                'box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);' +
                "font-family: 'Microsoft YaHei', 'SimHei', Arial, sans-serif;";

            
            var title = document.createElement('div');
            title.textContent = '⚙️ ' + t('settings');
            title.style.cssText =
                'font-size: 18px;' +
                'font-weight: bold;' +
                'color: #e0e0e0;' +
                'margin-bottom: 20px;' +
                'border-bottom: 1px solid #4a4a4a;' +
                'padding-bottom: 10px;';
            dialog.appendChild(title);

            
            var shortcutSection = document.createElement('div');
            shortcutSection.style.cssText = 'margin-bottom: 20px;';
            
            var shortcutLabel = document.createElement('div');
            shortcutLabel.textContent = t('shortcut') + ':';
            shortcutLabel.style.cssText = 'color: #e0e0e0; margin-bottom: 8px; font-size: 14px;';
            shortcutSection.appendChild(shortcutLabel);

            var shortcutDisplay = document.createElement('div');
            var currentShortcut = config.getShortcut();
            shortcutDisplay.textContent = t('currentShortcut') + config.formatShortcut(currentShortcut);
            shortcutDisplay.style.cssText = 'color: #4a9eff; margin-bottom: 10px; font-size: 13px; padding: 8px; background: #1a1a1a; border-radius: 4px;';
            shortcutSection.appendChild(shortcutDisplay);

            var shortcutInput = document.createElement('input');
            shortcutInput.type = 'text';
            shortcutInput.placeholder = t('pressKey');
            shortcutInput.readOnly = true;
            shortcutInput.style.cssText =
                'width: 100%;' +
                'padding: 10px;' +
                'background: #1a1a1a;' +
                'border: 1px solid #4a4a4a;' +
                'border-radius: 4px;' +
                'color: #e0e0e0;' +
                'font-size: 14px;' +
                'box-sizing: border-box;';

            var capturing = false;
            var capturedShortcut = null;

            shortcutInput.addEventListener('focus', function() {
                if (!capturing) {
                    capturing = true;
                    shortcutInput.placeholder = t('pressKey');
                    shortcutInput.value = '';
                    capturedShortcut = null;
                }
            });

            shortcutInput.addEventListener('keydown', function(e) {
                if (!capturing) return;

                e.preventDefault();
                e.stopPropagation();

                
                if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter') {
                    return;
                }

                
                if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                    shortcutInput.value = t('invalidShortcut');
                    return;
                }

                var shortcut = {
                    ctrl: e.ctrlKey || e.metaKey,
                    alt: e.altKey,
                    shift: e.shiftKey,
                    meta: e.metaKey,
                    key: e.key
                };

                capturedShortcut = shortcut;
                shortcutInput.value = config.formatShortcut(shortcut);
            });

            shortcutSection.appendChild(shortcutInput);
            dialog.appendChild(shortcutSection);

            
            var buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

            var saveBtn = document.createElement('button');
            saveBtn.textContent = t('save');
            saveBtn.style.cssText =
                'padding: 8px 16px;' +
                'background: #4a9eff;' +
                'border: none;' +
                'border-radius: 4px;' +
                'color: #fff;' +
                'cursor: pointer;' +
                'font-size: 14px;';
            saveBtn.addEventListener('click', function() {
                if (capturedShortcut) {
                    
                    if (!capturedShortcut.key || (!capturedShortcut.ctrl && !capturedShortcut.meta && !capturedShortcut.alt)) {
                        showToast(t('invalidShortcut'));
                        return;
                    }
                    config.setShortcut(capturedShortcut);
                    bindKeyboardShortcut(); 
                    showToast(t('shortcutSaved'));
                    closeSettingsDialog();
                } else {
                    closeSettingsDialog();
                }
            });

            var cancelBtn = document.createElement('button');
            cancelBtn.textContent = t('cancel');
            cancelBtn.style.cssText =
                'padding: 8px 16px;' +
                'background: #4a4a4a;' +
                'border: none;' +
                'border-radius: 4px;' +
                'color: #e0e0e0;' +
                'cursor: pointer;' +
                'font-size: 14px;';
            cancelBtn.addEventListener('click', closeSettingsDialog);

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(saveBtn);
            dialog.appendChild(buttonContainer);

            function closeSettingsDialog() {
                if (dialog.parentNode) {
                    dialog.parentNode.removeChild(dialog);
                }
                nodeSearchState.settingsDialog = null;
                capturing = false;
                capturedShortcut = null;
            }

            
            dialog.addEventListener('click', function(e) {
                if (e.target === dialog) {
                    closeSettingsDialog();
                }
            });

            nodeSearchState.settingsDialog = dialog;
            return dialog;
        }

        
        function openSettingsDialog() {
            if (!nodeSearchState.settingsDialog) {
                nodeSearchState.settingsDialog = createSettingsDialog();
                document.body.appendChild(nodeSearchState.settingsDialog);
            }
            
            
            setTimeout(function() {
                var input = nodeSearchState.settingsDialog.querySelector('input');
                if (input) {
                    input.focus();
                }
            }, 50);
        }

        
        nodeSearchState.openSettingsDialog = openSettingsDialog;
        
        
        bindKeyboardShortcut();
        
        
        setTimeout(function() {
            bindKeyboardShortcut();
        }, 1000);       

        var currentShortcut = config.formatShortcut();
        console.log("[MechaBaby NodeSearch] 扩展已加载 - 使用 " + currentShortcut + " 打开搜索");
        console.log("[MechaBaby NodeSearch] 当前语言: " + config.getLanguage());
    }
});

