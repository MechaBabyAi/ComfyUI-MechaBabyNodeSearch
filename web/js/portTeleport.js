import { app } from "../../../scripts/app.js";

var portTeleportFunctions = {
    getConnectedNodes: null,
    jumpToNode: null,
    highlightNode: null,
    getSlotAtPosition: null,
    addMenuItemsToDOM: null,
    findMenuElement: null,
    showManualMenu: null,
    hasOurMenuItem: null
};

portTeleportFunctions.getConnectedNodes = function(node, slotIndex, isInput) {
    var connectedNodes = [];
    if (!node || slotIndex === undefined) return connectedNodes;
    try {
        if (isInput) {
            var input = node.inputs && node.inputs[slotIndex];
            if (input && input.link !== null && input.link !== undefined) {
                var linkId = Array.isArray(input.link) ? input.link[0] : input.link;
                var link = app.graph.links && app.graph.links[linkId];
                if (link) {
                    var sourceNode = app.graph.getNodeById(link.origin_id);
                    if (sourceNode) {
                        connectedNodes.push({ node: sourceNode, portIndex: link.origin_slot, direction: "from" });
                    }
                }
            }
        } else {
            var output = node.outputs && node.outputs[slotIndex];
            if (output && output.links && Array.isArray(output.links)) {
                output.links.forEach(function (linkId) {
                    var link = app.graph.links && app.graph.links[linkId];
                    if (link) {
                        var targetNode = app.graph.getNodeById(link.target_id);
                        if (targetNode) {
                            connectedNodes.push({ node: targetNode, portIndex: link.target_slot, direction: "to" });
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.warn("[MechaBaby PortTeleport] 获取连接节点失败:", error);
    }
    return connectedNodes;
};

var jumpHistory = { history: [], currentIndex: -1, maxSize: 50 };
var keySettingDialogOpen = false;

var portTeleportI18n = {
    "zh-CN": {
        teleportToConnected: "传送到连接节点",
        input: "输入",
        output: "输出",
        noConnection: "无连接",
        jumpToRelated: "跳转到关联节点",
        settings: "设置",
        portTeleportSettings: "端口传送设置",
        autoJump: "单个连接时直接跳转",
        autoJumpDesc: "开启后，如果端口只有一个连接，右键时直接跳转而不显示菜单",
        blockMenu: "完全阻止菜单显示",
        blockMenuDesc: "开启后，自动跳转时会完全阻止菜单显示（包括其他扩展的菜单）",
        historyNav: "鼠标侧键历史导航",
        historyNavDesc: "开启后，鼠标侧键可以返回/前进到历史跳转的节点（后退=侧键1，前进=侧键2）",
        keyboardNav: "键盘历史导航",
        keyboardNavDesc: "开启后，可以使用键盘按键进行历史导航（可自定义按键）",
        backKey: "后退按键",
        forwardKey: "前进按键",
        mouseBackButton: "鼠标后退按键",
        mouseForwardButton: "鼠标前进按键",
        setBackKey: "设置后退按键",
        setForwardKey: "设置前进按键",
        setMouseBackButton: "设置鼠标后退按键",
        setMouseForwardButton: "设置鼠标前进按键",
        currentBackKey: "当前后退按键: ",
        currentForwardKey: "当前前进按键: ",
        currentMouseBackButton: "当前鼠标后退按键: ",
        currentMouseForwardButton: "当前鼠标前进按键: ",
        pressKey: "按下您想要的按键...",
        pressMouseButton: "点击您想要的鼠标按键...",
        keySaved: "按键已保存",
        mouseButtonSaved: "鼠标按键已保存",
        enabled: "已开启",
        disabled: "已关闭",
        settingSaved: "设置已保存",
        cancel: "取消",
        extensionSettings: "MechaBaby 扩展设置",
        quickJumpShortcut: "快速跳转快捷键",
        quickJumpShortcutTitle: "设置快速跳转快捷键",
        currentShortcut: "当前快捷键: ",
        pressKeyToSet: "按任意键设置新快捷键（支持 F1-F12 或组合键如 Ctrl+F1）",
        shortcutSaved: "快捷键已保存: ",
        menuScale: "菜单缩放",
        menuScaleSetTo: "菜单缩放已设置为 ",
        defaultScale: "默认",
        autoScale: "自动（根据画布缩放）",
        autoScaleSet: "菜单缩放已设置为自动（根据画布缩放）",
        quickJumpTitle: "快速跳转 (ESC关闭)"
    },
    "en-US": {
        teleportToConnected: "Teleport to Connected Nodes",
        input: "Input",
        output: "Output",
        noConnection: "No Connection",
        jumpToRelated: "Jump to Related Node",
        settings: "Settings",
        portTeleportSettings: "Port Teleport Settings",
        autoJump: "Auto Jump on Single Connection",
        autoJumpDesc: "When enabled, right-clicking a port with only one connection will jump directly without showing menu",
        blockMenu: "Block Menu Completely",
        blockMenuDesc: "When enabled, auto jump will completely block menu display (including other extensions' menus)",
        historyNav: "Mouse Side Button History Navigation",
        historyNavDesc: "When enabled, mouse side buttons can navigate jump history (Back=Side Button 1, Forward=Side Button 2)",
        keyboardNav: "Keyboard History Navigation",
        keyboardNavDesc: "When enabled, you can use keyboard keys for history navigation (customizable keys)",
        backKey: "Back Key",
        forwardKey: "Forward Key",
        mouseBackButton: "Mouse Back Button",
        mouseForwardButton: "Mouse Forward Button",
        setBackKey: "Set Back Key",
        setForwardKey: "Set Forward Key",
        setMouseBackButton: "Set Mouse Back Button",
        setMouseForwardButton: "Set Mouse Forward Button",
        currentBackKey: "Current Back Key: ",
        currentForwardKey: "Current Forward Key: ",
        currentMouseBackButton: "Current Mouse Back Button: ",
        currentMouseForwardButton: "Current Mouse Forward Button: ",
        pressKey: "Press the key you want...",
        pressMouseButton: "Click the mouse button you want...",
        keySaved: "Key saved",
        mouseButtonSaved: "Mouse button saved",
        enabled: "Enabled",
        disabled: "Disabled",
        settingSaved: "Setting saved",
        cancel: "Cancel",
        extensionSettings: "MechaBaby Extension Settings",
        quickJumpShortcut: "Quick Jump Shortcut",
        quickJumpShortcutTitle: "Set Quick Jump Shortcut",
        currentShortcut: "Current Shortcut: ",
        pressKeyToSet: "Press any key to set new shortcut (supports F1-F12 or combinations like Ctrl+F1)",
        shortcutSaved: "Shortcut saved: ",
        menuScale: "Menu Scale",
        menuScaleSetTo: "Menu scale set to ",
        defaultScale: "Default",
        autoScale: "Auto (based on canvas scale)",
        autoScaleSet: "Menu scale set to auto (based on canvas scale)",
        quickJumpTitle: "Quick Jump (ESC to close)"
    },
    "ja-JP": {
        teleportToConnected: "接続ノードにテレポート",
        input: "入力",
        output: "出力",
        noConnection: "接続なし",
        jumpToRelated: "関連ノードにジャンプ",
        settings: "設定",
        portTeleportSettings: "ポートテレポート設定",
        autoJump: "単一接続時に自動ジャンプ",
        autoJumpDesc: "有効にすると、接続が1つのポートを右クリックしたときに、メニューを表示せずに直接ジャンプします",
        blockMenu: "メニューを完全にブロック",
        blockMenuDesc: "有効にすると、自動ジャンプ時にメニュー表示を完全にブロックします（他の拡張機能のメニューを含む）",
        historyNav: "マウスサイドボタン履歴ナビゲーション",
        historyNavDesc: "有効にすると、マウスサイドボタンでジャンプ履歴をナビゲートできます（戻る=サイドボタン1、進む=サイドボタン2）",
        keyboardNav: "キーボード履歴ナビゲーション",
        keyboardNavDesc: "有効にすると、キーボードキーで履歴ナビゲーションを使用できます（カスタマイズ可能）",
        backKey: "戻るキー",
        forwardKey: "進むキー",
        setBackKey: "戻るキーを設定",
        setForwardKey: "進むキーを設定",
        currentBackKey: "現在の戻るキー: ",
        currentForwardKey: "現在の進むキー: ",
        pressKey: "使用したいキーを押してください...",
        keySaved: "キーを保存しました",
        enabled: "有効",
        disabled: "無効",
        settingSaved: "設定を保存しました",
        cancel: "キャンセル",
        quickJumpShortcut: "クイックジャンプショートカット",
        quickJumpShortcutTitle: "クイックジャンプショートカットを設定",
        currentShortcut: "現在のショートカット: ",
        pressKeyToSet: "任意のキーを押して新しいショートカットを設定（F1-F12 または Ctrl+F1 などの組み合わせをサポート）",
        shortcutSaved: "ショートカットを保存しました: ",
        menuScale: "メニュースケール",
        menuScaleSetTo: "メニュースケールを ",
        defaultScale: "デフォルト",
        autoScale: "自動（キャンバススケールに基づく）",
        autoScaleSet: "メニュースケールを自動に設定しました（キャンバススケールに基づく）",
        quickJumpTitle: "クイックジャンプ (ESCで閉じる)"
    },
    "ko-KR": {
        teleportToConnected: "연결된 노드로 텔레포트",
        input: "입력",
        output: "출력",
        noConnection: "연결 없음",
        jumpToRelated: "관련 노드로 이동",
        settings: "설정",
        portTeleportSettings: "포트 텔레포트 설정",
        autoJump: "단일 연결 시 자동 이동",
        autoJumpDesc: "활성화하면 연결이 하나인 포트를 우클릭할 때 메뉴를 표시하지 않고 직접 이동합니다",
        blockMenu: "메뉴 완전 차단",
        blockMenuDesc: "활성화하면 자동 이동 시 메뉴 표시를 완전히 차단합니다（다른 확장 기능의 메뉴 포함）",
        historyNav: "마우스 사이드 버튼 기록 탐색",
        historyNavDesc: "활성화하면 마우스 사이드 버튼으로 이동 기록을 탐색할 수 있습니다（뒤로=사이드 버튼1，앞으로=사이드 버튼2）",
        keyboardNav: "키보드 기록 탐색",
        keyboardNavDesc: "활성화하면 키보드 키로 기록 탐색을 사용할 수 있습니다（사용자 정의 가능）",
        backKey: "뒤로 키",
        forwardKey: "앞으로 키",
        setBackKey: "뒤로 키 설정",
        setForwardKey: "앞으로 키 설정",
        currentBackKey: "현재 뒤로 키: ",
        currentForwardKey: "현재 앞으로 키: ",
        pressKey: "원하는 키를 누르세요...",
        keySaved: "키가 저장되었습니다",
        enabled: "활성화됨",
        disabled: "비활성화됨",
        settingSaved: "설정이 저장되었습니다",
        cancel: "취소",
        quickJumpShortcut: "빠른 점프 단축키",
        quickJumpShortcutTitle: "빠른 점프 단축키 설정",
        currentShortcut: "현재 단축키: ",
        pressKeyToSet: "원하는 키를 눌러 새 단축키를 설정하세요（F1-F12 또는 Ctrl+F1과 같은 조합 지원）",
        shortcutSaved: "단축키가 저장되었습니다: ",
        menuScale: "메뉴 크기",
        menuScaleSetTo: "메뉴 크기가 ",
        defaultScale: "기본값",
        autoScale: "자동（캔버스 크기에 따라）",
        autoScaleSet: "메뉴 크기가 자동으로 설정되었습니다（캔버스 크기에 따라）",
        quickJumpTitle: "빠른 점프 (ESC로 닫기)"
    },
    "ru-RU": {
        teleportToConnected: "Телепорт к подключенным узлам",
        input: "Вход",
        output: "Выход",
        noConnection: "Нет подключения",
        jumpToRelated: "Перейти к связанному узлу",
        settings: "Настройки",
        portTeleportSettings: "Настройки телепорта портов",
        autoJump: "Автопереход при одном подключении",
        autoJumpDesc: "При включении, правый клик по порту с одним подключением будет сразу переходить без показа меню",
        blockMenu: "Полностью блокировать меню",
        blockMenuDesc: "При включении, автопереход будет полностью блокировать отображение меню (включая меню других расширений)",
        historyNav: "Навигация по истории боковыми кнопками мыши",
        historyNavDesc: "При включении, боковые кнопки мыши могут навигировать по истории переходов (Назад=Боковая кнопка 1, Вперед=Боковая кнопка 2)",
        keyboardNav: "Навигация по истории клавиатурой",
        keyboardNavDesc: "При включении, можно использовать клавиши клавиатуры для навигации по истории (настраиваемые клавиши)",
        backKey: "Клавиша Назад",
        forwardKey: "Клавиша Вперед",
        setBackKey: "Установить клавишу Назад",
        setForwardKey: "Установить клавишу Вперед",
        currentBackKey: "Текущая клавиша Назад: ",
        currentForwardKey: "Текущая клавиша Вперед: ",
        pressKey: "Нажмите нужную клавишу...",
        keySaved: "Клавиша сохранена",
        enabled: "Включено",
        disabled: "Выключено",
        settingSaved: "Настройка сохранена",
        cancel: "Отмена",
        quickJumpShortcut: "Быстрый переход - горячая клавиша",
        quickJumpShortcutTitle: "Установить горячую клавишу быстрого перехода",
        currentShortcut: "Текущая горячая клавиша: ",
        pressKeyToSet: "Нажмите любую клавишу для установки новой горячей клавиши (поддерживаются F1-F12 или комбинации типа Ctrl+F1)",
        shortcutSaved: "Горячая клавиша сохранена: ",
        menuScale: "Масштаб меню",
        menuScaleSetTo: "Масштаб меню установлен на ",
        defaultScale: "По умолчанию",
        autoScale: "Автоматически (на основе масштаба холста)",
        autoScaleSet: "Масштаб меню установлен автоматически (на основе масштаба холста)",
        quickJumpTitle: "Быстрый переход (ESC для закрытия)"
    }
};

var portTeleportLangMap = {
    zh: "zh-CN",
    "zh-CN": "zh-CN",
    "zh-TW": "zh-CN",
    en: "en-US",
    "en-US": "en-US",
    "en-GB": "en-US",
    ja: "ja-JP",
    "ja-JP": "ja-JP",
    ko: "ko-KR",
    "ko-KR": "ko-KR",
    ru: "ru-RU",
    "ru-RU": "ru-RU"
};

function getPortTeleportLanguage() {
    var saved = localStorage.getItem("mechababy.nodeSearch.language");
    if (saved && portTeleportI18n[saved]) return saved;
    var browserLang = navigator.language || navigator.userLanguage || "en-US";
    return portTeleportLangMap[browserLang] || portTeleportLangMap[browserLang.split("-")[0]] || "en-US";
}

function portTeleportT(key) {
    var lang = getPortTeleportLanguage();
    var texts = portTeleportI18n[lang] || portTeleportI18n["en-US"];
    return texts[key] || portTeleportI18n["en-US"][key] || key;
}

var portTeleportConfig = {
    getAutoJump: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.autoJump");
        if (saved === null) return false;
        return saved === "true";
    },
    setAutoJump: function (enabled) {
        try {
            localStorage.setItem("mechababy.portTeleport.autoJump", enabled ? "true" : "false");
            return true;
        } catch (e) {
            return false;
        }
    },
    getBlockMenu: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.blockMenu");
        if (saved === null) return false;
        return saved === "true";
    },
    setBlockMenu: function (enabled) {
        try {
            localStorage.setItem("mechababy.portTeleport.blockMenu", enabled ? "true" : "false");
            return true;
        } catch (e) {
            return false;
        }
    },
    getHistoryNav: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.historyNav");
        if (saved === null) return true;
        return saved === "true";
    },
    setHistoryNav: function (enabled) {
        try {
            localStorage.setItem("mechababy.portTeleport.historyNav", enabled ? "true" : "false");
            return true;
        } catch (e) {
            return false;
        }
    },
    getKeyboardNav: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.keyboardNav");
        if (saved === null) return true;
        return saved === "true";
    },
    setKeyboardNav: function (enabled) {
        try {
            localStorage.setItem("mechababy.portTeleport.keyboardNav", enabled ? "true" : "false");
            return true;
        } catch (e) {
            return false;
        }
    },
    getBackKey: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.backKey");
        if (saved === "Shift") {
            localStorage.setItem("mechababy.portTeleport.backKey", "F2");
            return "F2";
        }
        return saved || "F2";
    },
    setBackKey: function (key) {
        try {
            localStorage.setItem("mechababy.portTeleport.backKey", key);
            return true;
        } catch (e) {
            return false;
        }
    },
    getForwardKey: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.forwardKey");
        return saved || "F3";
    },
    getMouseBackButton: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.mouseBackButton");
        return saved ? parseInt(saved, 10) : 3;
    },
    setMouseBackButton: function (button) {
        try {
            localStorage.setItem("mechababy.portTeleport.mouseBackButton", String(button));
            return true;
        } catch (e) {
            return false;
        }
    },
    getMouseForwardButton: function () {
        var saved = localStorage.getItem("mechababy.portTeleport.mouseForwardButton");
        return saved ? parseInt(saved, 10) : 4;
    },
    setMouseForwardButton: function (button) {
        try {
            localStorage.setItem("mechababy.portTeleport.mouseForwardButton", String(button));
            return true;
        } catch (e) {
            return false;
        }
    },
    formatMouseButton: function (button) {
    var lang = getPortTeleportLanguage();
        var map = {
            "zh-CN": { 0: "左键", 1: "中键", 2: "右键", 3: "侧键1（后退）", 4: "侧键2（前进）", 5: "侧键3", 6: "侧键4" },
            "en-US": { 0: "Left Button", 1: "Middle Button", 2: "Right Button", 3: "Side Button 1 (Back)", 4: "Side Button 2 (Forward)", 5: "Side Button 3", 6: "Side Button 4" },
            "ja-JP": { 0: "左ボタン", 1: "中ボタン", 2: "右ボタン", 3: "サイドボタン1（戻る）", 4: "サイドボタン2（進む）", 5: "サイドボタン3", 6: "サイドボタン4" },
            "ko-KR": { 0: "왼쪽 버튼", 1: "가운데 버튼", 2: "오른쪽 버튼", 3: "사이드 버튼1（뒤로）", 4: "사이드 버튼2（앞으로）", 5: "사이드 버튼3", 6: "사이드 버튼4" },
            "ru-RU": { 0: "Левая кнопка", 1: "Средняя кнопка", 2: "Правая кнопка", 3: "Боковая кнопка 1 (Назад)", 4: "Боковая кнопка 2 (Вперед)", 5: "Боковая кнопка 3", 6: "Боковая кнопка 4" }
        };
        var langMap = map[lang] || map["zh-CN"];
        return langMap[button] || "Button " + button;
    },
    setForwardKey: function (key) {
        try {
            localStorage.setItem("mechababy.portTeleport.forwardKey", key);
            return true;
        } catch (e) {
            return false;
        }
    },
    formatKey: function (key) {
        var keyMap = { ArrowLeft: "←", ArrowRight: "→", ArrowUp: "↑", ArrowDown: "↓", Backspace: "Backspace", Delete: "Delete", Home: "Home", End: "End", PageUp: "PageUp", PageDown: "PageDown" };
        return keyMap[key] || key;
    }
};

app.registerExtension({
    name: "MechaBaby.PortTeleport",
    
    beforeRegisterNodeDef: function (nodeType, nodeData, app) {
        var originalGetSlotMenuOptions = nodeType.prototype.getSlotMenuOptions;
        nodeType.prototype.getSlotMenuOptions = function (slot) {
            var nodeInstance = this;
            var isNodeInstance =
                nodeInstance &&
                typeof nodeInstance === "object" &&
                                 nodeInstance.constructor && 
                                 (nodeInstance.inputs !== undefined || nodeInstance.outputs !== undefined) &&
                (typeof nodeInstance.inputs === "object" || typeof nodeInstance.outputs === "object");
            if (!isNodeInstance) {
                if (app && app.canvas && app.canvas.selected_nodes) {
                    var selectedNodes = app.canvas.selected_nodes;
                    var selectedNodeIds = Object.keys(selectedNodes);
                    if (selectedNodeIds.length > 0) nodeInstance = selectedNodes[selectedNodeIds[0]];
                    }
                if (!nodeInstance || !nodeInstance.inputs || !nodeInstance.outputs) {
                    if (app && app.canvas && app.canvas.graph_mouse && app.graph && app.graph._nodes) {
                        var mouseX = app.canvas.graph_mouse[0];
                        var mouseY = app.canvas.graph_mouse[1];
                        var closestNode = null;
                        var closestDistance = Infinity;
                        for (var i = 0; i < app.graph._nodes.length; i++) {
                            var n = app.graph._nodes[i];
                            if (!n || !n.pos) continue;
                            var nodeX = n.pos[0];
                            var nodeY = n.pos[1];
                            var nodeSize = n.computeSize ? n.computeSize() : [200, 100];
                            var nodeWidth = nodeSize[0];
                            var nodeHeight = nodeSize[1];
                            if (mouseX >= nodeX && mouseX <= nodeX + nodeWidth && mouseY >= nodeY && mouseY <= nodeY + nodeHeight) {
                                var centerX = nodeX + nodeWidth / 2;
                                var centerY = nodeY + nodeHeight / 2;
                                var distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
                                if (distance < closestDistance) {
                                    closestDistance = distance;
                                    closestNode = n;
                                }
                            }
                        }
                        if (closestNode) nodeInstance = closestNode;
                        }
                    }
                if (!nodeInstance || !nodeInstance.inputs || !nodeInstance.outputs) {
                    return [];
                }
            }
            
            var originalOptions = null;
            if (originalGetSlotMenuOptions) {
                try {
                    originalOptions = originalGetSlotMenuOptions.call(nodeInstance, slot);
                } catch (e) {
                    console.warn("[MechaBaby PortTeleport] 调用原始 getSlotMenuOptions 失败:", e);
                }
            }
            var menuOptions = originalOptions || [];
            
            
            if (!slot) {
                if (app && app.canvas && portTeleportFunctions.getSlotAtPosition) {
                    var mouseX, mouseY;
                    var useGraphMouse = false;
                    if (app.canvas.graph_mouse && app.canvas.graph_mouse.length >= 2) {
                        var gmX = app.canvas.graph_mouse[0];
                        var gmY = app.canvas.graph_mouse[1];
                        if (nodeInstance && nodeInstance.pos) {
                            var nodeX = Array.isArray(nodeInstance.pos) || ArrayBuffer.isView(nodeInstance.pos) ? nodeInstance.pos[0] : (nodeInstance.pos.x || 0);
                            var nodeY = Array.isArray(nodeInstance.pos) || ArrayBuffer.isView(nodeInstance.pos) ? nodeInstance.pos[1] : (nodeInstance.pos.y || 0);
                            var nodeSize = nodeInstance.computeSize ? nodeInstance.computeSize() : [200, 100];
                            var nodeWidth = nodeSize[0] || 200;
                            var nodeHeight = nodeSize[1] || 100;
                            var maxDistance = Math.max(nodeWidth, nodeHeight) * 5;
                            var distance = Math.sqrt(Math.pow(gmX - nodeX, 2) + Math.pow(gmY - nodeY, 2));
                            if (distance < maxDistance || (Math.abs(gmX) < 100000 && Math.abs(gmY) < 100000)) {
                                mouseX = gmX;
                                mouseY = gmY;
                                useGraphMouse = true;
                            }
                        } else {
                            if (Math.abs(gmX) < 100000 && Math.abs(gmY) < 100000) {
                                mouseX = gmX;
                                mouseY = gmY;
                                useGraphMouse = true;
                            }
                        }
                    }
                    if (!useGraphMouse) {
                        var ds = app.canvas.ds || {};
                        var offsetX = Array.isArray(ds.offset) ? ds.offset[0] : 0;
                        var offsetY = Array.isArray(ds.offset) ? ds.offset[1] : 0;
                        var scale = ds.scale || 1;
                        var rawX, rawY;
                        if (app.canvas.canvas_mouse) {
                            rawX = app.canvas.canvas_mouse[0];
                            rawY = app.canvas.canvas_mouse[1];
                        } else if (app.canvas.last_mouse) {
                            rawX = app.canvas.last_mouse[0];
                            rawY = app.canvas.last_mouse[1];
                        }
                        if (rawX !== undefined && rawY !== undefined && scale > 0) {
                            mouseX = (rawX - offsetX) / scale;
                            mouseY = (rawY - offsetY) / scale;
                        }
                    }
                    var coordinatesValid = mouseX !== undefined && mouseY !== undefined && 
                                          Math.abs(mouseX) < 100000 && Math.abs(mouseY) < 100000;
                    var slotInfo = null;
                    if (coordinatesValid) {
                        slotInfo = portTeleportFunctions.getSlotAtPosition(nodeInstance, mouseX, mouseY);
                    if (slotInfo && slotInfo.index >= 0 && portTeleportFunctions.getConnectedNodes) {
                        var connectedNodes = portTeleportFunctions.getConnectedNodes(nodeInstance, slotInfo.index, slotInfo.isInput);
                        if (connectedNodes.length > 0) {
                                var autoJump = portTeleportConfig.getAutoJump();
                                if (autoJump && connectedNodes.length === 1) {
                                    setTimeout(function () {
                                        if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(connectedNodes[0].node);
                                    }, 0);
                                    var blockMenu = portTeleportConfig.getBlockMenu();
                                    if (blockMenu) return [];
                                    return menuOptions;
                                }
                                if (menuOptions.length > 0) menuOptions.push(null);
                            if (connectedNodes.length === 1) {
                                var targetNode = connectedNodes[0].node;
                                    var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : targetNode.title || targetNode.type;
                                    var pseudoSlot = slotInfo && slotInfo.slot ? slotInfo.slot : (slotInfo.isInput ? nodeInstance.inputs[slotInfo.index] : nodeInstance.outputs[slotInfo.index]);
                                    var menuItem = {
                                        content: "🎯 " + portTeleportT("jumpToRelated") + ": " + targetNodeTitle + " (ID: " + targetNode.id + ")",
                                        slot: pseudoSlot || slotInfo || null,
                                        callback: function () {
                                            if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(targetNode);
                                        }
                                    };
                                    menuOptions.push(menuItem);
                            } else {
                                    var pseudoSlot2 = slotInfo && slotInfo.slot ? slotInfo.slot : (slotInfo.isInput ? nodeInstance.inputs[slotInfo.index] : nodeInstance.outputs[slotInfo.index]);
                                    var submenuItem = {
                                        content: "🎯 " + portTeleportT("jumpToRelated"),
                                        slot: pseudoSlot2 || slotInfo || null,
                                    has_submenu: true,
                                    submenu: {
                                            options: connectedNodes.map(function (conn) {
                                                var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : conn.node.title || conn.node.type;
                                            return {
                                                    content: targetNodeTitle + " (ID: " + conn.node.id + ")",
                                                    callback: function () {
                                                        if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(conn.node);
                                                }
                                            };
                                        })
                                    }
                                    };
                                    menuOptions.push(submenuItem);
                                }
                            }
                        }
                        var finalMenu = Array.isArray(menuOptions) ? menuOptions : [];
                        
                        if (!slot && finalMenu.length > 0 && slotInfo && slotInfo.index >= 0) {
                            var savedNodeInstance = nodeInstance;
                            var savedSlotInfo = slotInfo;
                            var savedNodeId = nodeInstance ? nodeInstance.id : null;
                            var savedSlotIndex = slotInfo ? slotInfo.index : null;
                            var savedIsInput = slotInfo ? slotInfo.isInput : null;
                            var checkCount = 0;
                            var maxChecks = 5;
                            var checkInterval = 50;
                            var menuAdded = false;
                            var checkMenu = function() {
                                try {
                                    checkCount++;
                                    
                                    if (menuAdded) {
                                        return;
                                    }
                                    
                                    var menuElement = null;
                                    try {
                                        if (portTeleportFunctions.findMenuElement) {
                                            menuElement = portTeleportFunctions.findMenuElement();
                                        } else {
                                        }
                                    } catch (e) {
                                    }
                                    
                                    if (menuElement && savedNodeInstance && savedSlotInfo) {
                                        var currentNodeId = savedNodeInstance ? savedNodeInstance.id : null;
                                        var currentSlotIndex = savedSlotInfo ? savedSlotInfo.index : null;
                                        var currentIsInput = savedSlotInfo ? savedSlotInfo.isInput : null;
                                        
                                        var isValid = currentNodeId === savedNodeId && 
                                                     currentSlotIndex === savedSlotIndex && 
                                                     currentIsInput === savedIsInput;
                                        
                                        
                                        if (!isValid) {
                                            return;
                                        }
                                        try {
                                            if (portTeleportFunctions.addMenuItemsToDOM) {
                                                portTeleportFunctions.addMenuItemsToDOM(menuElement, savedNodeInstance, savedSlotInfo);
                                                menuAdded = true;
                                            } else {
                                            }
                                        } catch (e) {
                                        }
                                    } else if (!menuElement && savedNodeInstance && savedSlotInfo) {
                                        if (checkCount >= maxChecks) {
                                            var event = { clientX: window.event ? window.event.clientX : 0, clientY: window.event ? window.event.clientY : 0 };
                                            if (portTeleportFunctions.showManualMenu) {
                                                portTeleportFunctions.showManualMenu(savedNodeInstance, savedSlotInfo, event);
                                            } else {
                                            }
                                            menuAdded = true;
                                        }
                                    } else {

                                    }
                                    
                                    if (!menuAdded && checkCount < maxChecks) {
                                        setTimeout(checkMenu, checkInterval);
                                    }
                                } catch (e) {
                                }
                            };
                            setTimeout(checkMenu, 50);
                        }
                        return finalMenu;
                    }
                }
                return menuOptions;
            }
            
            var _slot = slot.input || slot.output || slot;
            var slotIndex = -1;
            var isInput = false;
            if (_slot.slot_index !== undefined) {
                slotIndex = _slot.slot_index;
                if (nodeInstance.inputs && Array.isArray(nodeInstance.inputs)) {
                    for (var i = 0; i < nodeInstance.inputs.length; i++) {
                        if (nodeInstance.inputs[i] === _slot || (nodeInstance.inputs[i] && nodeInstance.inputs[i].slot_index === slotIndex)) {
                            isInput = true;
                            break;
                        }
                    }
                }
                if (!isInput && nodeInstance.outputs && Array.isArray(nodeInstance.outputs)) {
                    for (var j = 0; j < nodeInstance.outputs.length; j++) {
                        if (nodeInstance.outputs[j] === _slot || (nodeInstance.outputs[j] && nodeInstance.outputs[j].slot_index === slotIndex)) {
                            isInput = false;
                            break;
                        }
                    }
                }
            } else {
                if (nodeInstance.inputs && Array.isArray(nodeInstance.inputs)) {
                    for (var i = 0; i < nodeInstance.inputs.length; i++) {
                        if (nodeInstance.inputs[i] === _slot) {
                            slotIndex = i;
                            isInput = true;
                            break;
                        }
                    }
                }
                if (slotIndex < 0 && nodeInstance.outputs && Array.isArray(nodeInstance.outputs)) {
                    for (var j = 0; j < nodeInstance.outputs.length; j++) {
                        if (nodeInstance.outputs[j] === _slot) {
                            slotIndex = j;
                            isInput = false;
                            break;
                        }
                    }
                }
            }
            
            if (slotIndex >= 0 && portTeleportFunctions.getConnectedNodes) {
                var connectedNodes = portTeleportFunctions.getConnectedNodes(nodeInstance, slotIndex, isInput);
                if (connectedNodes.length > 0) {
                    var autoJump = portTeleportConfig.getAutoJump();
                    if (autoJump && connectedNodes.length === 1) {
                        setTimeout(function () {
                            if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(connectedNodes[0].node);
                        }, 0);
                        var blockMenu = portTeleportConfig.getBlockMenu();
                        if (blockMenu) return [];
                        return menuOptions;
                    }
                    if (menuOptions.length > 0) menuOptions.push(null);
                    if (connectedNodes.length === 1) {
                        var targetNode = connectedNodes[0].node;
                        var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : targetNode.title || targetNode.type;
                        menuOptions.push({
                            content: "🎯 " + portTeleportT("jumpToRelated") + ": " + targetNodeTitle + " (ID: " + targetNode.id + ")",
                            callback: function () {
                                if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(targetNode);
                            }
                        });
                    } else {
                        menuOptions.push({
                            content: "🎯 " + portTeleportT("jumpToRelated"),
                            has_submenu: true,
                            submenu: {
                                options: connectedNodes.map(function (conn) {
                                    var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : conn.node.title || conn.node.type;
                                    return {
                                        content: targetNodeTitle + " (ID: " + conn.node.id + ")",
                                        callback: function () {
                                            if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(conn.node);
                                        }
                                    };
                                })
                            }
                        });
                    }
                }
            }
            return menuOptions;
        };
    },
    
    setup: function () {
        if (typeof window !== "undefined") {
            window.getPortTeleportMenuItems = function () {
                return [
                    {
                        content: "🎯 " + portTeleportT("portTeleportSettings"),
                        has_submenu: true,
                        submenu: {
                            options: [
                                {
                                    content: portTeleportT("autoJump") + " (" + (portTeleportConfig.getAutoJump() ? portTeleportT("enabled") : portTeleportT("disabled")) + ")",
                                    callback: function () {
                                        var current = portTeleportConfig.getAutoJump();
                                        portTeleportConfig.setAutoJump(!current);
                                        alert(portTeleportT("settingSaved") + ": " + portTeleportT("autoJump") + " = " + (!current ? portTeleportT("enabled") : portTeleportT("disabled")));
                                    }
                                },
                                {
                                    content: portTeleportT("blockMenu") + " (" + (portTeleportConfig.getBlockMenu() ? portTeleportT("enabled") : portTeleportT("disabled")) + ")",
                                    callback: function () {
                                        var current = portTeleportConfig.getBlockMenu();
                                        portTeleportConfig.setBlockMenu(!current);
                                        alert(portTeleportT("settingSaved") + ": " + portTeleportT("blockMenu") + " = " + (!current ? portTeleportT("enabled") : portTeleportT("disabled")));
                                    }
                                },
                                {
                                    content: portTeleportT("keyboardNav") + " (" + (portTeleportConfig.getKeyboardNav() ? portTeleportT("enabled") : portTeleportT("disabled")) + ")",
                                    callback: function () {
                                        var current = portTeleportConfig.getKeyboardNav();
                                        portTeleportConfig.setKeyboardNav(!current);
                                        alert(portTeleportT("settingSaved") + ": " + portTeleportT("keyboardNav") + " = " + (!current ? portTeleportT("enabled") : portTeleportT("disabled")));
                                    }
                                },
                                null,
                                {
                                    content: portTeleportT("currentBackKey") + portTeleportConfig.formatKey(portTeleportConfig.getBackKey()),
                                    callback: function () {
                                        var dialog = document.createElement("div");
                                        dialog.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--comfy-menu-bg); padding: 20px; border: 2px solid var(--border-color); border-radius: 8px; z-index: 10000; min-width: 300px;";
                                        dialog.innerHTML =
                                            '<div style="margin-bottom: 15px; font-size: 16px; font-weight: bold;">' +
                                            portTeleportT("setBackKey") +
                                            "</div>" +
                                            '<div style="margin-bottom: 15px; color: #999;">' +
                                            portTeleportT("pressKey") +
                                            "</div>" +
                                            '<div style="text-align: right;">' +
                                            '<button style="margin-right: 10px; padding: 5px 15px;" onclick="this.parentElement.parentElement.remove()">' +
                                            portTeleportT("cancel") +
                                            "</button>" +
                                            "</div>";
                                        keySettingDialogOpen = true;
                                        var keyHandler = function (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            var key = e.key || e.code;
                                            if (key && key !== "Escape") {
                                                portTeleportConfig.setBackKey(key);
                                                alert(portTeleportT("keySaved") + ": " + key);
                                                document.body.removeChild(dialog);
                                                window.removeEventListener("keydown", keyHandler, true);
                                                keySettingDialogOpen = false;
                                            } else if (key === "Escape") {
                                                document.body.removeChild(dialog);
                                                window.removeEventListener("keydown", keyHandler, true);
                                                keySettingDialogOpen = false;
                                            }
                                        };
                                        window.addEventListener("keydown", keyHandler, true);
                                        document.body.appendChild(dialog);
                                    }
                                },
                                {
                                    content: portTeleportT("currentForwardKey") + portTeleportConfig.formatKey(portTeleportConfig.getForwardKey()),
                                    callback: function () {
                                        var dialog = document.createElement("div");
                                        dialog.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--comfy-menu-bg); padding: 20px; border: 2px solid var(--border-color); border-radius: 8px; z-index: 10000; min-width: 300px;";
                                        dialog.innerHTML =
                                            '<div style="margin-bottom: 15px; font-size: 16px; font-weight: bold;">' +
                                            portTeleportT("setForwardKey") +
                                            "</div>" +
                                            '<div style="margin-bottom: 15px; color: #999;">' +
                                            portTeleportT("pressKey") +
                                            "</div>" +
                                            '<div style="text-align: right;">' +
                                            '<button style="margin-right: 10px; padding: 5px 15px;" onclick="this.parentElement.parentElement.remove()">' +
                                            portTeleportT("cancel") +
                                            "</button>" +
                                            "</div>";
                                        keySettingDialogOpen = true;
                                        var keyHandler = function (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            var key = e.key || e.code;
                                            if (key && key !== "Escape") {
                                                portTeleportConfig.setForwardKey(key);
                                                alert(portTeleportT("keySaved") + ": " + key);
                                                document.body.removeChild(dialog);
                                                window.removeEventListener("keydown", keyHandler, true);
                                                keySettingDialogOpen = false;
                                            } else if (key === "Escape") {
                                                document.body.removeChild(dialog);
                                                window.removeEventListener("keydown", keyHandler, true);
                                                keySettingDialogOpen = false;
                                            }
                                        };
                                        window.addEventListener("keydown", keyHandler, true);
                                        document.body.appendChild(dialog);
                                    }
                                },
                                null,
                                {
                                    content: "⚡ " + portTeleportT("quickJumpShortcut") + ": " + getQuickJumpKey(),
                                    callback: function () {
                                        var dialog = document.createElement("div");
                                        dialog.style.cssText = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--comfy-menu-bg); padding: 20px; border: 2px solid var(--border-color); border-radius: 8px; z-index: 10000; min-width: 350px;";
                                        dialog.innerHTML =
                                            '<div style="margin-bottom: 15px; font-size: 16px; font-weight: bold;">' + portTeleportT("quickJumpShortcutTitle") + '</div>' +
                                            '<div style="margin-bottom: 10px; color: #999; font-size: 12px;">' + portTeleportT("currentShortcut") + '<span style="color: #4a9eff;">' + getQuickJumpKey() + '</span></div>' +
                                            '<div style="margin-bottom: 15px; color: #999; font-size: 12px;">' + portTeleportT("pressKeyToSet") + '</div>' +
                                            '<div style="text-align: right;">' +
                                            '<button style="margin-right: 10px; padding: 5px 15px; background: #4a4a4a; border: none; border-radius: 4px; color: #fff; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">' + portTeleportT("cancel") + '</button>' +
                                            "</div>";
                                        var keyHandler = function (e) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            var key = e.key || e.code;
                                            if (key && key !== "Escape") {
                                                var newKey = key;
                                                if (e.ctrlKey || e.metaKey) newKey = "Ctrl+" + key;
                                                if (e.altKey) newKey = "Alt+" + newKey;
                                                if (e.shiftKey) newKey = "Shift+" + newKey;
                                                setQuickJumpKey(newKey);
                                                alert(portTeleportT("shortcutSaved") + newKey);
                                                document.body.removeChild(dialog);
                                                window.removeEventListener("keydown", keyHandler, true);
                                            } else if (key === "Escape") {
                                                document.body.removeChild(dialog);
                                                window.removeEventListener("keydown", keyHandler, true);
                                            }
                                        };
                                        window.addEventListener("keydown", keyHandler, true);
                                        document.body.appendChild(dialog);
                                    }
                                },
                                {
                                    content: "📏 " + portTeleportT("menuScale") + ": " + (getQuickJumpMenuScale() * 100).toFixed(0) + "%",
                                    has_submenu: true,
                                    submenu: {
                                        options: [
                                            { content: "50%", callback: function() { setQuickJumpMenuScale(0.5); alert(portTeleportT("menuScaleSetTo") + "50%"); } },
                                            { content: "75%", callback: function() { setQuickJumpMenuScale(0.75); alert(portTeleportT("menuScaleSetTo") + "75%"); } },
                                            { content: "100% (" + portTeleportT("defaultScale") + ")", callback: function() { setQuickJumpMenuScale(1.0); alert(portTeleportT("menuScaleSetTo") + "100%"); } },
                                            { content: "125%", callback: function() { setQuickJumpMenuScale(1.25); alert(portTeleportT("menuScaleSetTo") + "125%"); } },
                                            { content: "150%", callback: function() { setQuickJumpMenuScale(1.5); alert(portTeleportT("menuScaleSetTo") + "150%"); } },
                                            null,
                                            { content: portTeleportT("autoScale"), callback: function() { localStorage.removeItem("mechababy.portTeleport.quickJumpMenuScale"); alert(portTeleportT("autoScaleSet")); } }
                                        ]
                                    }
                                },
                                null,
                                { content: portTeleportT("autoJumpDesc"), disabled: true },
                                { content: portTeleportT("blockMenuDesc"), disabled: true },
                                { content: portTeleportT("keyboardNavDesc"), disabled: true }
                            ]
                        }
                    }
                ];
            };
        }

        portTeleportFunctions.jumpToNode = function (node, skipHistory) {
            if (!node) return;
            if (!skipHistory && portTeleportConfig.getHistoryNav()) {
                var currentNode = null;
                if (app.canvas && app.canvas.selected_nodes) {
                    var selectedNodes = app.canvas.selected_nodes;
                    var selectedNodeIds = Object.keys(selectedNodes);
                    if (selectedNodeIds.length > 0) currentNode = selectedNodes[selectedNodeIds[0]];
                }
                if (jumpHistory.history.length === 0 && currentNode) {
                    jumpHistory.history.push(currentNode);
                    jumpHistory.currentIndex = 0;
                }
                if (jumpHistory.currentIndex >= 0 && jumpHistory.currentIndex < jumpHistory.history.length - 1) {
                    jumpHistory.history = jumpHistory.history.slice(0, jumpHistory.currentIndex + 1);
                }
                var lastNode = jumpHistory.history[jumpHistory.history.length - 1];
                if (!lastNode || lastNode.id !== node.id) {
                    jumpHistory.history.push(node);
                    if (jumpHistory.history.length > jumpHistory.maxSize) {
                        jumpHistory.history.shift();
                    }
                    jumpHistory.currentIndex = jumpHistory.history.length - 1;
                }
            }
            app.canvas.centerOnNode(node);
            app.canvas.selectNode(node);
            if (portTeleportFunctions.highlightNode) portTeleportFunctions.highlightNode(node);
        };

        portTeleportFunctions.highlightNode = function (node) {
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
        };
        
        function getEasyUseRelatedNodes(node) {
            var relatedNodes = [];
            if (!node || !node.graph) return relatedNodes;
            try {
                if (node.type === "easy getNode") {
                    if (typeof node.findSetter === "function") {
                        var setter = node.findSetter(node.graph);
                        if (setter) {
                            var constantValue = (node.widgets && node.widgets[0] && node.widgets[0].value) || "";
                            if (constantValue) relatedNodes.push({ node: setter, label: "→ Set_" + constantValue, direction: "to" });
                        }
                    }
                } else if (node.type === "easy setNode") {
                    if (typeof node.findGetters === "function") {
                        var getters = node.findGetters(node.graph);
                        if (getters && getters.length > 0) {
                            var constantValue = (node.widgets && node.widgets[0] && node.widgets[0].value) || "";
                            getters.forEach(function (getter) {
                                relatedNodes.push({ node: getter, label: "→ Get_" + constantValue, direction: "to" });
                                });
                            }
                        }
                    }
            } catch (error) {
                console.warn("[MechaBaby PortTeleport] 获取 easy use 关联节点失败:", error);
            }
                return relatedNodes;
            }

        var portTeleportState = {
            hitRadius: 60,
            lastLang: getPortTeleportLanguage()
        };
        
        portTeleportFunctions.getSlotAtPosition = function (node, x, y) {
            if (!node) return null;
            try {
                if (!node.pos) return null;
                var nodeX, nodeY;
                if (Array.isArray(node.pos) || ArrayBuffer.isView(node.pos)) {
                    nodeX = node.pos[0];
                    nodeY = node.pos[1];
                } else {
                    nodeX = typeof node.pos.x === "number" ? node.pos.x : 0;
                    nodeY = typeof node.pos.y === "number" ? node.pos.y : 0;
                }
                var nodeSize = node.size;
                if (!nodeSize || !Array.isArray(nodeSize)) {
                    nodeSize = node.computeSize ? node.computeSize() : [200, 100];
                }
                if (ArrayBuffer.isView(nodeSize)) {
                    nodeSize = [Number(nodeSize[0]), Number(nodeSize[1])];
                }
                var slotGap = (typeof LiteGraph !== "undefined" && LiteGraph.NODE_SLOT_HEIGHT) || 24;
                var relativeX = x - nodeX;
                var relativeY = y - nodeY;
                var hitRadius = portTeleportState.hitRadius || 60;
                var hasGetSlotPos = typeof node.getSlotPos === "function";
                var closestSlot = null;
                var closestDistance = Infinity;
                
                if (node.inputs && Array.isArray(node.inputs)) {
                    for (var i = 0; i < node.inputs.length; i++) {
                        var slotPos = null;
                        if (hasGetSlotPos) {
                            var posArray = new Float32Array(2);
                            if (node.getSlotPos(true, i, posArray)) slotPos = [posArray[0], posArray[1]];
                        } else {
                            var input = node.inputs[i];
                            if (input && input.pos) slotPos = [input.pos[0], input.pos[1]];
                        }
                        if (!slotPos) {
                            slotPos = [0, (i + 0.5) * slotGap];
                        }
                        var distance = Math.sqrt(Math.pow(relativeX - slotPos[0], 2) + Math.pow(relativeY - slotPos[1], 2));
                        if (distance < closestDistance) {
                            closestDistance = distance;
                            closestSlot = { index: i, isInput: true, slot: node.inputs[i], distance: distance };
                        }
                    }
                }
                
                if (node.outputs && Array.isArray(node.outputs)) {
                    for (var j = 0; j < node.outputs.length; j++) {
                        var slotPos2 = null;
                        if (hasGetSlotPos) {
                            var posArray2 = new Float32Array(2);
                            if (node.getSlotPos(false, j, posArray2)) slotPos2 = [posArray2[0], posArray2[1]];
                        } else {
                            var output = node.outputs[j];
                            if (output && output.pos) slotPos2 = [output.pos[0], output.pos[1]];
                        }
                        if (!slotPos2) {
                            slotPos2 = [nodeSize[0], (j + 0.5) * slotGap];
                        }
                        var distance2 = Math.sqrt(Math.pow(relativeX - slotPos2[0], 2) + Math.pow(relativeY - slotPos2[1], 2));
                        if (distance2 < closestDistance) {
                            closestDistance = distance2;
                            closestSlot = { index: j, isInput: false, slot: node.outputs[j], distance: distance2 };
                        }
                    }
                }
                
                if (closestSlot && closestDistance < hitRadius) {
                    return { index: closestSlot.index, isInput: closestSlot.isInput, slot: closestSlot.slot };
                }
            } catch (error) {
                console.warn("[MechaBaby PortTeleport] 获取端口位置失败:", error);
            }
            return null;
        };

        if (typeof LGraphCanvas === "undefined") {
            console.warn("[MechaBaby PortTeleport] LGraphCanvas 未定义，节点右键菜单功能可能无法使用");
        } else {
        var origGetNodeMenuOptions = LGraphCanvas.prototype.getNodeMenuOptions;
            LGraphCanvas.prototype.getNodeMenuOptions = function (node) {
            var options = origGetNodeMenuOptions.apply(this, arguments);
                var hasInputConnections = node.inputs && node.inputs.some(function (input) {
                return input && input.link !== null && input.link !== undefined;
            });
                var hasOutputConnections = node.outputs && node.outputs.some(function (output) {
                return output && output.links && output.links.length > 0;
            });
            var easyRelatedNodes = getEasyUseRelatedNodes(node);
            if (hasInputConnections || hasOutputConnections || easyRelatedNodes.length > 0) {
                options.push(null, {
                        content: "🔗 " + portTeleportT("teleportToConnected"),
                    has_submenu: true,
                    submenu: {
                            options: (function () {
                            var teleportOptions = [];
                            if (easyRelatedNodes.length > 0) {
                                    easyRelatedNodes.forEach(function (related) {
                                        var targetNodeTitle = related.node.getTitle ? related.node.getTitle() : related.node.title || related.node.type;
                                    teleportOptions.push({
                                            content: related.label || "→ " + targetNodeTitle,
                                            callback: function () {
                                            portTeleportFunctions.jumpToNode(related.node);
                                        }
                                    });
                                });
                                    if (hasInputConnections || hasOutputConnections) teleportOptions.push(null);
                                }
                            if (hasInputConnections && node.inputs) {
                                    node.inputs.forEach(function (input, index) {
                                    if (input && input.link !== null && input.link !== undefined) {
                                        var connectedNodes = portTeleportFunctions.getConnectedNodes(node, index, true);
                                            connectedNodes.forEach(function (conn) {
                                                var portName = input.name || portTeleportT("input") + " " + index;
                                                var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : conn.node.title || conn.node.type;
                                            teleportOptions.push({
                                                    content: "← " + portName + " → " + targetNodeTitle,
                                                    callback: function () {
                                                    portTeleportFunctions.jumpToNode(conn.node);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                            if (hasOutputConnections && node.outputs) {
                                    node.outputs.forEach(function (output, index) {
                                    if (output && output.links && output.links.length > 0) {
                                        var connectedNodes = portTeleportFunctions.getConnectedNodes(node, index, false);
                                            connectedNodes.forEach(function (conn) {
                                                var portName = output.name || portTeleportT("output") + " " + index;
                                                var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : conn.node.title || conn.node.type;
                                            teleportOptions.push({
                                                    content: portName + " → " + targetNodeTitle,
                                                    callback: function () {
                                                    portTeleportFunctions.jumpToNode(conn.node);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                                return teleportOptions.length > 0
                                    ? teleportOptions
                                    : [
                                          {
                                              content: portTeleportT("noConnection"),
                                disabled: true
                                          }
                                      ];
                        })()
                    }
                });
            }
            return options;
        };
        }

        var lastRightClickTime = 0;
        var lastRightClickNode = null;
        var lastRightClickSlotInfo = null;
        var menuDisplayTimeout = null;
        
        portTeleportFunctions.findMenuElement = function() {
            var liteGraphSelectors = [
                ".litegraph.litecontextmenu",
                ".litecontextmenu.litemenubar-panel",
                ".litecontextmenu",
                ".litemenubar-panel"
            ];
            for (var s = 0; s < liteGraphSelectors.length; s++) {
                var menuElement = document.querySelector(liteGraphSelectors[s]);
                if (menuElement && menuElement.offsetParent !== null) {
                    if (menuElement.querySelector(".litemenu-entry")) {
                        return menuElement;
                    }
                }
            }
            
            var allMenus = document.querySelectorAll("[class*='menu'], [class*='Menu']");
            for (var m = 0; m < allMenus.length; m++) {
                var menu = allMenus[m];
                if (menu.offsetParent !== null) {
                    var hasLiteMenuEntry = menu.querySelector(".litemenu-entry") !== null;
                    var isLiteGraphMenu = menu.className && (
                        menu.className.indexOf("litecontextmenu") >= 0 ||
                        menu.className.indexOf("litemenu") >= 0 ||
                        menu.className.indexOf("litegraph") >= 0
                    );
                    
                    if (hasLiteMenuEntry || isLiteGraphMenu) {
                        var style = window.getComputedStyle(menu);
                        if (style.display !== "none" && style.visibility !== "hidden") {
                            return menu;
                        }
                    }
                }
            }
            return null;
        }
        
        portTeleportFunctions.hasOurMenuItem = function(menuElement) {
            if (!menuElement) return false;
            if (menuElement.querySelector(".litemenu-entry[data-mechababy-teleport]")) {
                return true;
            }
            var entries = menuElement.querySelectorAll(".litemenu-entry");
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].textContent && entries[i].textContent.indexOf("🎯") >= 0) {
                    return true;
                }
            }
            return false;
        }
        
        portTeleportFunctions.addMenuItemsToDOM = function(menuElement, node, slotInfo) {
            if (!node || !slotInfo || !portTeleportFunctions.getConnectedNodes) {
                return;
            }
            var nodeId = node.id;
            var nodeType = node.type;
            var slotIndex = slotInfo.index;
            var isInput = slotInfo.isInput;
            var connectedNodes = portTeleportFunctions.getConnectedNodes(node, slotInfo.index, slotInfo.isInput);
            if (connectedNodes.length === 0) {
                return;
            }
            
            var existingItems = menuElement.querySelectorAll("[data-mechababy-teleport]");
            var removedCount = 0;
            var separatorsToRemove = [];
            
            for (var i = 0; i < existingItems.length; i++) {
                var item = existingItems[i];
                var itemSourceNodeId = item.getAttribute("data-source-node-id");
                var itemSlotIndex = item.getAttribute("data-slot-index");
                var itemIsInput = item.getAttribute("data-is-input");
                
                var shouldRemove = true;
                if (itemSourceNodeId && itemSlotIndex !== null && itemIsInput !== null) {
                    var itemNodeIdMatch = itemSourceNodeId === String(nodeId);
                    var itemSlotMatch = itemSlotIndex === String(slotIndex);
                    var itemInputMatch = itemIsInput === String(isInput);
                    shouldRemove = true;
                    
                }
                
                if (shouldRemove) {
                    var prevSibling = item.previousSibling;
                    while (prevSibling && prevSibling.nodeType !== 1) {
                        prevSibling = prevSibling.previousSibling;
                    }
                    if (prevSibling && prevSibling.nodeType === 1) {
                        var hasBorderTop = prevSibling.style.borderTop || 
                                          window.getComputedStyle(prevSibling).borderTopWidth !== "0px";
                        var isEmpty = !prevSibling.textContent || prevSibling.textContent.trim() === "";
                        if (hasBorderTop && isEmpty && separatorsToRemove.indexOf(prevSibling) === -1) {
                            separatorsToRemove.push(prevSibling);
                        }
                    }
                    if (item.parentNode) {
                        item.parentNode.removeChild(item);
                        removedCount++;
                    }
                }
            }
            for (var j = 0; j < separatorsToRemove.length; j++) {
                var sep = separatorsToRemove[j];
                if (sep.parentNode) {
                    sep.parentNode.removeChild(sep);
                }
            }
            
            var menuContainer = menuElement;
            var submenuContainer = menuElement.querySelector(".litemenu-entries, .litemenu-content, [class*='menu-entries']");
            if (submenuContainer) {
                menuContainer = submenuContainer;
            }

            var separator = document.createElement("div");
            separator.className = "litemenu-entry";
            separator.style.borderTop = "1px solid var(--border-color, #666)";
            separator.style.marginTop = "4px";
            separator.style.marginBottom = "4px";
            separator.style.paddingTop = "4px";
            separator.style.height = "1px";
            separator.style.minHeight = "1px";
            
            var menuItem = document.createElement("div");
            menuItem.className = "litemenu-entry";
            menuItem.setAttribute("data-mechababy-teleport", "true");
            menuItem.setAttribute("data-source-node-id", nodeId);
            menuItem.setAttribute("data-source-node-type", nodeType);
            menuItem.setAttribute("data-slot-index", slotIndex);
            menuItem.setAttribute("data-is-input", isInput);
            menuItem.style.display = "block";
            menuItem.style.visibility = "visible";
            menuItem.style.opacity = "1";
            
            if (connectedNodes.length === 1) {
                var targetNode = connectedNodes[0].node;
                var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : targetNode.title || targetNode.type;
                var targetNodeId = targetNode.id;
                menuItem.setAttribute("data-target-node-id", targetNodeId);
                menuItem.textContent = "🎯 " + portTeleportT("jumpToRelated") + ": " + targetNodeTitle + " (ID: " + targetNodeId + ")";
                menuItem.style.cursor = "pointer";
                menuItem.addEventListener("mouseenter", function() {
                    this.style.backgroundColor = "var(--comfy-menu-bg-hover, rgba(255,255,255,0.1))";
                });
                menuItem.addEventListener("mouseleave", function() {
                    this.style.backgroundColor = "";
                });
                menuItem.addEventListener("click", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (portTeleportFunctions.jumpToNode) {
                        portTeleportFunctions.jumpToNode(targetNode);
                    }
                    if (menuElement && menuElement.parentNode) {
                        menuElement.parentNode.removeChild(menuElement);
                    }
                }, true);
                        } else {
                menuItem.textContent = "🎯 " + portTeleportT("jumpToRelated") + " ▸";
                menuItem.className = "litemenu-entry has_submenu";
                menuItem.style.cursor = "pointer";
                menuItem.addEventListener("mouseenter", function() {
                    this.style.backgroundColor = "var(--comfy-menu-bg-hover, rgba(255,255,255,0.1))";
                });
                menuItem.addEventListener("mouseleave", function() {
                    this.style.backgroundColor = "";
                });
                menuItem.addEventListener("click", function(e) {
                    e.stopPropagation();
                    e.preventDefault();
                    if (connectedNodes.length > 0 && portTeleportFunctions.jumpToNode) {
                        portTeleportFunctions.jumpToNode(connectedNodes[0].node);
                    }
                    if (menuElement && menuElement.parentNode) {
                        menuElement.parentNode.removeChild(menuElement);
                    }
                }, true);
            }
            
            try {
                menuContainer.appendChild(separator);
                menuContainer.appendChild(menuItem);
                
            } catch (e) {
            }
        }
        
        portTeleportFunctions.showManualMenu = function(node, slotInfo, event) {
            if (!node || !slotInfo || !portTeleportFunctions.getConnectedNodes) return;
            var connectedNodes = portTeleportFunctions.getConnectedNodes(node, slotInfo.index, slotInfo.isInput);
            if (connectedNodes.length === 0) return;
            
            var menuItems = [];
            if (connectedNodes.length === 1) {
                var targetNode = connectedNodes[0].node;
                var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : targetNode.title || targetNode.type;
                menuItems.push({
                    content: "🎯 " + portTeleportT("jumpToRelated") + ": " + targetNodeTitle + " (ID: " + targetNode.id + ")",
                    callback: function () {
                        if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(targetNode);
                    }
                });
            } else {
                menuItems.push({
                    content: "🎯 " + portTeleportT("jumpToRelated"),
                    has_submenu: true,
                    submenu: {
                        options: connectedNodes.map(function (conn) {
                            var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : conn.node.title || conn.node.type;
                            return {
                                content: targetNodeTitle + " (ID: " + conn.node.id + ")",
                                callback: function () {
                                    if (portTeleportFunctions.jumpToNode) portTeleportFunctions.jumpToNode(conn.node);
                                }
                            };
                        })
                    }
                });
            }
            
            var menuShown = false;
            
            if (app && app.canvas && typeof app.canvas.showMenu === "function") {
                try {
                    var menuPos = event ? { x: event.clientX, y: event.clientY } : null;
                    app.canvas.showMenu(menuItems, menuPos);
                    menuShown = true;
                } catch (e) {
                }
            }
            
            if (!menuShown && typeof LiteGraph !== "undefined" && LiteGraph.ContextMenu) {
                try {
                    var menuPos2 = event ? { x: event.clientX || event.pageX, y: event.clientY || event.pageY } : 
                                     (app.canvas && app.canvas.last_mouse ? { 
                                         x: app.canvas.last_mouse[0] + (app.canvas.root ? app.canvas.root.getBoundingClientRect().left : 0), 
                                         y: app.canvas.last_mouse[1] + (app.canvas.root ? app.canvas.root.getBoundingClientRect().top : 0) 
                                     } : null);
                    if (menuPos2) {
                        LiteGraph.ContextMenu.show(menuPos2, menuItems);
                        menuShown = true;
                    }
                } catch (e) {
                }
            }
            
            if (!menuShown && app && app.canvas && typeof app.canvas.onShowMenu === "function") {
                try {
                    var menuPos3 = event ? { x: event.clientX || event.pageX, y: event.clientY || event.pageY } : null;
                    app.canvas.onShowMenu(menuItems, menuPos3);
                    menuShown = true;
                } catch (e) {
                }
            }
        }
        
        function setupManualMenuFallback() {
            if (!app || !app.canvas) return;
            var canvas = app.canvas;
            var canvasElement = canvas.canvas || (canvas.root && canvas.root.querySelector && canvas.root.querySelector("canvas"));
            if (!canvasElement) {
                return;
            }

            
            canvasElement.addEventListener("mousedown", function(e) {
                if (e.button !== 2) return;
                
                lastRightClickTime = Date.now();
                lastRightClickNode = null;
                lastRightClickSlotInfo = null;
                
                setTimeout(function() {
                    if (canvas && canvas.graph_mouse && canvas.graph && canvas.graph._nodes) {
                        var mouseX = canvas.graph_mouse[0];
                        var mouseY = canvas.graph_mouse[1];
                        
                        var targetNode = null;
                        for (var i = 0; i < canvas.graph._nodes.length; i++) {
                            var node = canvas.graph._nodes[i];
                            if (!node || !node.pos) continue;
                            var nodeX = Array.isArray(node.pos) || ArrayBuffer.isView(node.pos) ? node.pos[0] : (node.pos.x || 0);
                            var nodeY = Array.isArray(node.pos) || ArrayBuffer.isView(node.pos) ? node.pos[1] : (node.pos.y || 0);
                            var nodeSize = node.computeSize ? node.computeSize() : [200, 100];
                            var nodeWidth = nodeSize[0] || 200;
                            var nodeHeight = nodeSize[1] || 100;
                            
                            if (mouseX >= nodeX && mouseX <= nodeX + nodeWidth && 
                                mouseY >= nodeY && mouseY <= nodeY + nodeHeight) {
                                targetNode = node;
                                break;
                            }
                        }
                        
                        if (targetNode && portTeleportFunctions.getSlotAtPosition) {
                            var slotInfo = portTeleportFunctions.getSlotAtPosition(targetNode, mouseX, mouseY);
                            if (slotInfo && slotInfo.index >= 0) {
                                lastRightClickNode = targetNode;
                                lastRightClickSlotInfo = slotInfo;
                                
                                if (menuDisplayTimeout) clearTimeout(menuDisplayTimeout);
                                menuDisplayTimeout = setTimeout(function() {
                                    var menuElement = null;
                                    if (portTeleportFunctions.findMenuElement) {
                                        menuElement = portTeleportFunctions.findMenuElement();
                                    }
                                    
                                if (!menuElement && lastRightClickNode && lastRightClickSlotInfo) {
                                    if (portTeleportFunctions.showManualMenu) {
                                        portTeleportFunctions.showManualMenu(lastRightClickNode, lastRightClickSlotInfo, e);
                                    }
                                } else if (menuElement && lastRightClickNode && lastRightClickSlotInfo) {
                                    if (portTeleportFunctions.addMenuItemsToDOM) {
                                        portTeleportFunctions.addMenuItemsToDOM(menuElement, lastRightClickNode, lastRightClickSlotInfo);
                                    }
                                }
                                    lastRightClickNode = null;
                                    lastRightClickSlotInfo = null;
                                }, 100); 
                            }
                        }
                    }
                }, 50);
            }, true);
        }
        
        if (app && app.canvas) {
            setupManualMenuFallback();
                        } else {
            var waitForCanvasForMenu = function() {
                if (app && app.canvas) {
                    setupManualMenuFallback();
                } else {
                    setTimeout(waitForCanvasForMenu, 50);
                }
            };
            setTimeout(waitForCanvasForMenu, 100);
        }

        function navigateBack() {
            if (!jumpHistory.history.length) return;
            if (jumpHistory.currentIndex > 0) {
                jumpHistory.currentIndex--;
                var targetNode = jumpHistory.history[jumpHistory.currentIndex];
                if (targetNode && portTeleportFunctions.jumpToNode) {
                    portTeleportFunctions.jumpToNode(targetNode, true);
                }
            }
        }

        function navigateForward() {
            if (!jumpHistory.history.length) return;
            if (jumpHistory.currentIndex < jumpHistory.history.length - 1) {
                jumpHistory.currentIndex++;
                var targetNode = jumpHistory.history[jumpHistory.currentIndex];
                if (targetNode && portTeleportFunctions.jumpToNode) {
                    portTeleportFunctions.jumpToNode(targetNode, true);
                }
            }
        }

        window.addEventListener(
            "keydown",
            function (e) {
                if (keySettingDialogOpen) return;
                if (!portTeleportConfig.getKeyboardNav()) return;
                var target = e.target || e.srcElement;
                if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
                var backKey = portTeleportConfig.getBackKey();
                var forwardKey = portTeleportConfig.getForwardKey();
                if (e.key === backKey || e.code === backKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateBack();
                } else if (e.key === forwardKey || e.code === forwardKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    navigateForward();
                }
            },
            true
        );

        function initializeGraphMouse() {
            if (!app || !app.canvas) return;
            var canvas = app.canvas;
            var canvasElement = canvas.canvas || (canvas.root && canvas.root.querySelector && canvas.root.querySelector("canvas"));
            if (!canvasElement) return;
            
            var mouseMoveHandler = function(e) {
                if (canvas && canvas.ds) {
                }
            };
            
            canvasElement.addEventListener("mousemove", mouseMoveHandler, { passive: true, capture: true });
            
            var initGraphMouse = function() {
                if (canvas && canvas.ds && canvas.canvas_mouse) {
                    try {
                        var ds = canvas.ds;
                        var offsetX = Array.isArray(ds.offset) ? ds.offset[0] : 0;
                        var offsetY = Array.isArray(ds.offset) ? ds.offset[1] : 0;
                        var scale = ds.scale || 1;
                        if (scale > 0 && canvas.canvas_mouse.length >= 2) {
                            var rawX = canvas.canvas_mouse[0];
                            var rawY = canvas.canvas_mouse[1];
                            var graphX = (rawX - offsetX) / scale;
                            var graphY = (rawY - offsetY) / scale;
                            if (!canvas.graph_mouse || canvas.graph_mouse.length < 2 || 
                                Math.abs(canvas.graph_mouse[0]) > 100000 || Math.abs(canvas.graph_mouse[1]) > 100000) {
                                canvas.graph_mouse = [graphX, graphY];
                            }
                        }
                    } catch (e) {
                    }
                }
            };
            
            setTimeout(initGraphMouse, 200);
            var lastCanvasMouse = null;
            var canvasMouseCheckInterval = null;
            var startCanvasMouseCheck = function() {
                if (canvasMouseCheckInterval) return;
                canvasMouseCheckInterval = setInterval(function() {
                    if (canvas && canvas.canvas_mouse) {
                        var current = canvas.canvas_mouse[0] + "," + canvas.canvas_mouse[1];
                        if (current !== lastCanvasMouse) {
                            lastCanvasMouse = current;
                            initGraphMouse();
                        }
                    } else {
                        if (canvasMouseCheckInterval) {
                            clearInterval(canvasMouseCheckInterval);
                            canvasMouseCheckInterval = null;
                        }
                    }
                }, 500);
            };
            setTimeout(startCanvasMouseCheck, 300);
        }
        
        if (app && app.canvas) {
            initializeGraphMouse();
        } else {
            var waitForCanvas = function() {
                if (app && app.canvas) {
                    initializeGraphMouse();
                } else {
                    setTimeout(waitForCanvas, 50);
                }
            };
            setTimeout(waitForCanvas, 100);
        }
        var quickJumpMenu = null;
        var quickJumpKey = "F1";
        var quickJumpMenuScale = 1;
        var isDragging = false;
        var dragOffset = { x: 0, y: 0 };
        
        function getQuickJumpKey() {
            var saved = localStorage.getItem("mechababy.portTeleport.quickJumpKey");
            return saved || quickJumpKey;
        }
        
        function setQuickJumpKey(key) {
            try {
                localStorage.setItem("mechababy.portTeleport.quickJumpKey", key);
                quickJumpKey = key;
                return true;
            } catch (e) {
                return false;
            }
        }
        
        function getQuickJumpMenuScale() {
            var saved = localStorage.getItem("mechababy.portTeleport.quickJumpMenuScale");
            if (saved) {
                return parseFloat(saved) || 1.0;
            }
            if (app && app.canvas && app.canvas.ds) {
                var canvasScale = app.canvas.ds.scale || 1;
                return Math.max(0.8, Math.min(1.5, canvasScale));
            }
            return 1.0;
        }
        
        function setQuickJumpMenuScale(scale) {
            try {
                var scaleValue = Math.max(0.5, Math.min(2.0, parseFloat(scale) || 1.0));
                localStorage.setItem("mechababy.portTeleport.quickJumpMenuScale", String(scaleValue));
                quickJumpMenuScale = scaleValue;
                return true;
            } catch (e) {
                return false;
            }
        }
        
        function closeQuickJumpMenu() {
            if (quickJumpMenu && quickJumpMenu.parentNode) {
                quickJumpMenu.parentNode.removeChild(quickJumpMenu);
                quickJumpMenu = null;
            }
            if (window._quickJumpMenuClickHandler) {
                document.removeEventListener("mousedown", window._quickJumpMenuClickHandler);
                window._quickJumpMenuClickHandler = null;
            }
            if (window._quickJumpMenuDragHandler) {
                document.removeEventListener("mousemove", window._quickJumpMenuDragHandler);
                document.removeEventListener("mouseup", window._quickJumpMenuDragEndHandler);
                window._quickJumpMenuDragHandler = null;
                window._quickJumpMenuDragEndHandler = null;
            }
            isDragging = false;
        }
        
        function showQuickJumpMenu(node) {
            if (!node || !app || !app.canvas) return;
            
            closeQuickJumpMenu();
            
            var inputPorts = [];
            var outputPorts = [];
            
            if (node.inputs && Array.isArray(node.inputs)) {
                for (var i = 0; i < node.inputs.length; i++) {
                    var input = node.inputs[i];
                    var connectedNodes = portTeleportFunctions.getConnectedNodes(node, i, true);
                    if (connectedNodes.length > 0) {
                        var portName = input.name || (portTeleportT("input") + " " + i);
                        var portType = input.type || "";
                        inputPorts.push({
                            index: i,
                            name: portName,
                            type: portType,
                            slot: input,
                            connectedNodes: connectedNodes
                        });
                    }
                }
            }
            
                if (node.outputs && Array.isArray(node.outputs)) {
                    for (var j = 0; j < node.outputs.length; j++) {
                    var output = node.outputs[j];
                    var connectedNodes2 = portTeleportFunctions.getConnectedNodes(node, j, false);
                    if (connectedNodes2.length > 0) {
                        var portName2 = output.name || (portTeleportT("output") + " " + j);
                        var portType2 = output.type || "";
                        outputPorts.push({
                            index: j,
                            name: portName2,
                            type: portType2,
                            slot: output,
                            connectedNodes: connectedNodes2
                        });
                    }
                }
            }
            
            if (inputPorts.length === 0 && outputPorts.length === 0) {
                return;
            }
            
            quickJumpMenuScale = getQuickJumpMenuScale();
            
            var menuX = 0, menuY = 0;
            
            try {
                var nodeElement = null;
                if (app.canvas) {
                    var allNodes = document.querySelectorAll('[data-node-id="' + node.id + '"]');
                    if (allNodes.length > 0) {
                        nodeElement = allNodes[0];
                    }
                    
                    if (!nodeElement) {
                        var liteNodes = document.querySelectorAll('.litenode, [class*="litenode"]');
                        for (var k = 0; k < liteNodes.length; k++) {
                            var ln = liteNodes[k];
                            if (ln.getAttribute && ln.getAttribute('data-node-id') == node.id) {
                                nodeElement = ln;
                                break;
                            }
                            if (node.title && ln.textContent && ln.textContent.indexOf(node.title) >= 0) {
                                var lnRect = ln.getBoundingClientRect();
                                var nodeX = node.pos ? (Array.isArray(node.pos) || ArrayBuffer.isView(node.pos) ? node.pos[0] : node.pos.x) : 0;
                                var nodeY = node.pos ? (Array.isArray(node.pos) || ArrayBuffer.isView(node.pos) ? node.pos[1] : node.pos.y) : 0;
                                var ds = app.canvas.ds || {};
                                var scale = ds.scale || 1;
                                var offsetX = Array.isArray(ds.offset) ? ds.offset[0] : (ds.offset ? ds.offset.x : 0);
                                var offsetY = Array.isArray(ds.offset) ? ds.offset[1] : (ds.offset ? ds.offset.y : 0);
                                var canvasRect = app.canvas.canvas ? app.canvas.canvas.getBoundingClientRect() : (app.canvas.root ? app.canvas.root.getBoundingClientRect() : null);
                                if (canvasRect) {
                                    var expectedX = (nodeX - offsetX) * scale + canvasRect.left;
                                    var expectedY = (nodeY - offsetY) * scale + canvasRect.top;
                                    if (Math.abs(lnRect.left - expectedX) < 50 && Math.abs(lnRect.top - expectedY) < 50) {
                                        nodeElement = ln;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    
                    if (!nodeElement && app.canvas.root) {
                        var rootNodes = app.canvas.root.querySelectorAll('[data-node-id="' + node.id + '"]');
                        if (rootNodes.length > 0) {
                            nodeElement = rootNodes[0];
                        }
                    }
                    
                    if (!nodeElement && node.title) {
                        var titleElements = document.querySelectorAll('.litenode-title, .node-title, [class*="node-title"], [class*="title"]');
                        for (var i = 0; i < titleElements.length; i++) {
                            if (titleElements[i].textContent && titleElements[i].textContent.indexOf(node.title) >= 0) {
                                var parent = titleElements[i].closest('[data-node-id], .litenode, [class*="litenode"]');
                                if (parent) {
                                    var parentId = parent.getAttribute ? parent.getAttribute('data-node-id') : null;
                                    if (parentId == node.id || (!parentId && node.title && parent.textContent && parent.textContent.indexOf(node.title) >= 0)) {
                                        nodeElement = parent;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
                
                if (nodeElement) {
                    var rect = nodeElement.getBoundingClientRect();
                    menuX = rect.left + rect.width / 2;
                    menuY = rect.top + rect.height / 2;
                } else {
                    var nodeX = 0, nodeY = 0;
                    if (node.pos) {
                        if (Array.isArray(node.pos) || ArrayBuffer.isView(node.pos)) {
                            nodeX = node.pos[0];
                            nodeY = node.pos[1];
                        } else {
                            nodeX = node.pos.x || 0;
                            nodeY = node.pos.y || 0;
                        }
                    }
                    var nodeSize = node.size || (node.computeSize ? node.computeSize() : [200, 100]);
                    if (ArrayBuffer.isView(nodeSize)) {
                        nodeSize = [Number(nodeSize[0]), Number(nodeSize[1])];
                    }
                    var nodeWidth = nodeSize[0] || 200;
                    var nodeHeight = nodeSize[1] || 100;
                    
                    var nodeCenterX = nodeX + nodeWidth / 2;
                    var nodeCenterY = nodeY + nodeHeight / 2;
                    
                    var ds = app.canvas.ds || {};
                    var offsetX = Array.isArray(ds.offset) ? ds.offset[0] : (ds.offset ? ds.offset.x : 0);
                    var offsetY = Array.isArray(ds.offset) ? ds.offset[1] : (ds.offset ? ds.offset.y : 0);
                    var scale = ds.scale || 1;
                    
                    var canvasRect = null;
                    var canvasElement = null;
                    if (app.canvas.canvas) {
                        canvasElement = app.canvas.canvas;
                        canvasRect = canvasElement.getBoundingClientRect();
                    } else if (app.canvas.root) {
                        canvasElement = app.canvas.root;
                        canvasRect = canvasElement.getBoundingClientRect();
                    }
                    
                    var useBuiltInMethod = false;
                    if (app.canvas && typeof app.canvas.convertOffsetToScreen === 'function') {
                        try {
                            var screenPos = app.canvas.convertOffsetToScreen([nodeCenterX, nodeCenterY]);
                            if (screenPos && screenPos.length >= 2) {
                                menuX = screenPos[0];
                                menuY = screenPos[1];
                                useBuiltInMethod = true;
                            }
                        } catch (e) {
                        }
                    }
                    
                    if (!useBuiltInMethod) {
                        var nodeElement = null;
                        if (app.canvas) {
                            var nodeIdStr = String(node.id);
                            
                            nodeElement = document.querySelector('[data-node-id="' + nodeIdStr + '"]');
                            
                            if (!nodeElement) {
                                nodeElement = document.querySelector('.litenode[data-id="' + nodeIdStr + '"]');
                            }
                            
                            if (!nodeElement && app.canvas.node_widgets && app.canvas.node_widgets[node.id]) {
                                var widgets = app.canvas.node_widgets[node.id];
                                if (widgets && widgets.length > 0) {
                                    for (var w = 0; w < widgets.length; w++) {
                                        if (widgets[w] && widgets[w].parent) {
                                            nodeElement = widgets[w].parent.closest('.litenode');
                                            if (nodeElement) break;
                                        }
                                    }
                                }
                            }
                            
                            if (!nodeElement) {
                                var allLiteNodes = document.querySelectorAll('.litenode, [class*="litenode"]');
                                for (var i = 0; i < allLiteNodes.length; i++) {
                                    var ln = allLiteNodes[i];
                                    if (ln._node && ln._node.id === node.id) {
                                        nodeElement = ln;
                                        break;
                                    }
                                    if (ln.getAttribute && (ln.getAttribute('data-id') === nodeIdStr || ln.getAttribute('data-node-id') === nodeIdStr)) {
                                        nodeElement = ln;
                                        break;
                                    }
                                }
                            }
                            
                            if (!nodeElement && node.dom) {
                                nodeElement = node.dom;
                            }
                        }
                        
                        if (nodeElement) {
                            var rect = nodeElement.getBoundingClientRect();
                            menuX = rect.left + rect.width / 2;
                            menuY = rect.top + rect.height / 2;
                        } else if (canvasRect) {
                            var testX1 = (nodeCenterX - offsetX) * scale + canvasRect.left;
                            var testY1 = (nodeCenterY - offsetY) * scale + canvasRect.top;
                            var testX2 = nodeCenterX * scale + offsetX + canvasRect.left;
                            var testY2 = nodeCenterY * scale + offsetY + canvasRect.top;
                            
                            var viewportWidth = window.innerWidth;
                            var viewportHeight = window.innerHeight;
                            var canvasRight = canvasRect.left + canvasRect.width;
                            var canvasBottom = canvasRect.top + canvasRect.height;
                            
                            var formula1Valid = testX1 >= canvasRect.left && testX1 <= canvasRight &&
                                               testY1 >= canvasRect.top && testY1 <= canvasBottom &&
                                               testX1 >= 0 && testX1 <= viewportWidth &&
                                               testY1 >= 0 && testY1 <= viewportHeight;
                            
                            var formula2Valid = testX2 >= canvasRect.left && testX2 <= canvasRight &&
                                               testY2 >= canvasRect.top && testY2 <= canvasBottom &&
                                               testX2 >= 0 && testX2 <= viewportWidth &&
                                               testY2 >= 0 && testY2 <= viewportHeight;
                            
                            if (formula1Valid && formula2Valid) {
                                var dist1 = Math.abs(testX1 - (canvasRect.left + canvasRect.width/2)) + 
                                           Math.abs(testY1 - (canvasRect.top + canvasRect.height/2));
                                var dist2 = Math.abs(testX2 - (canvasRect.left + canvasRect.width/2)) + 
                                           Math.abs(testY2 - (canvasRect.top + canvasRect.height/2));
                                if (dist1 < dist2) {
                                    menuX = testX1;
                                    menuY = testY1;
                                } else {
                                    menuX = testX2;
                                    menuY = testY2;
                                }
                            } else if (formula2Valid) {
                                menuX = testX2;
                                menuY = testY2;
                            } else if (formula1Valid) {
                                menuX = testX1;
                                menuY = testY1;
                            } else {
                                var dist1 = Math.abs(testX1 - viewportWidth/2) + Math.abs(testY1 - viewportHeight/2);
                                var dist2 = Math.abs(testX2 - viewportWidth/2) + Math.abs(testY2 - viewportHeight/2);
                                if (dist1 < dist2) {
                                    menuX = testX1;
                                    menuY = testY1;
                                } else {
                                    menuX = testX2;
                                    menuY = testY2;
                                }
                            }
                        } else {
                            menuX = (nodeCenterX - offsetX) * scale;
                            menuY = (nodeCenterY - offsetY) * scale;
                        }
                    }
                    
                }
            } catch (e) {
                menuX = window.innerWidth / 2;
                menuY = window.innerHeight / 2;
            }
            
            quickJumpMenu = document.createElement("div");
            quickJumpMenu.className = "mechababy-quick-jump-menu";
            quickJumpMenu.style.cssText = 
                "position: fixed;" +
                "left: " + menuX + "px;" +
                "top: " + menuY + "px;" +
                "transform: translate(-50%, -50%) scale(" + quickJumpMenuScale + ");" +
                "transform-origin: center center;" +
                "background: var(--comfy-menu-bg, #2a2a2a);" +
                "border: 1px solid var(--border-color, #666);" +
                "border-radius: 4px;" +
                "box-shadow: 0 4px 12px rgba(0,0,0,0.5);" +
                "z-index: 10000;" +
                "display: flex;" +
                "flex-direction: column;" +
                "min-width: 400px;" +
                "max-height: 600px;" +
                "overflow: hidden;" +
                "user-select: none;";
            
            var menuHeader = document.createElement("div");
            menuHeader.className = "mechababy-quick-jump-header";
            menuHeader.style.cssText = 
                "height: 24px;" +
                "background: var(--comfy-menu-bg-hover, rgba(255,255,255,0.05));" +
                "border-bottom: 1px solid var(--border-color, #666);" +
                "cursor: move;" +
                "display: flex;" +
                "align-items: center;" +
                "justify-content: space-between;" +
                "padding: 0 8px;" +
                "flex-shrink: 0;";
            
            var headerTitle = document.createElement("span");
            headerTitle.textContent = portTeleportT("quickJumpTitle");
            headerTitle.style.cssText = "font-size: 11px; color: #888;";
            menuHeader.appendChild(headerTitle);
            
            var closeBtn = document.createElement("span");
            closeBtn.textContent = "×";
            closeBtn.style.cssText = 
                "cursor: pointer;" +
                "font-size: 18px;" +
                "color: #888;" +
                "width: 20px;" +
                "height: 20px;" +
                "display: flex;" +
                "align-items: center;" +
                "justify-content: center;" +
                "border-radius: 2px;";
            closeBtn.addEventListener("mouseenter", function() {
                this.style.background = "var(--comfy-menu-bg-hover, rgba(255,255,255,0.1))";
                this.style.color = "#fff";
            });
            closeBtn.addEventListener("mouseleave", function() {
                this.style.background = "transparent";
                this.style.color = "#888";
            });
            closeBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                closeQuickJumpMenu();
            });
            menuHeader.appendChild(closeBtn);
            
            menuHeader.addEventListener("mousedown", function(e) {
                if (e.target === closeBtn) return;
                e.preventDefault();
                isDragging = true;
                var rect = quickJumpMenu.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left - rect.width / 2;
                dragOffset.y = e.clientY - rect.top - rect.height / 2;
                quickJumpMenu.style.cursor = "move";
            });
            
            var contentContainer = document.createElement("div");
            contentContainer.style.cssText = 
                "display: flex;" +
                "flex: 1;" +
                "overflow: hidden;";
            
            var leftPanel = document.createElement("div");
            leftPanel.className = "mechababy-quick-jump-left";
            leftPanel.style.cssText = 
                "flex: 1;" +
                "min-width: 200px;" +
                "border-right: 1px solid var(--border-color, #666);" +
                "overflow-y: auto;" +
                "max-height: 576px;";
            
            var rightPanel = document.createElement("div");
            rightPanel.className = "mechababy-quick-jump-right";
            rightPanel.style.cssText = 
                "flex: 1;" +
                "min-width: 200px;" +
                "overflow-y: auto;" +
                "max-height: 576px;";
            
            if (inputPorts.length > 0) {
                var inputTitle = document.createElement("div");
                inputTitle.textContent = "📥 " + portTeleportT("input");
                inputTitle.style.cssText = 
                    "padding: 8px 12px;" +
                    "background: var(--comfy-menu-bg-hover, rgba(255,255,255,0.05));" +
                    "font-weight: bold;" +
                    "border-bottom: 1px solid var(--border-color, #666);" +
                    "font-size: 12px;";
                leftPanel.appendChild(inputTitle);
                
                inputPorts.forEach(function(port, portIdx) {
                    
                    port.connectedNodes.forEach(function(conn, connIdx) {
                        var targetNode = conn.node;
                        var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : (targetNode.title || targetNode.type);
                        var menuItem = document.createElement("div");
                        menuItem.className = "mechababy-quick-jump-item";
                        var isLastItem = (portIdx === inputPorts.length - 1 && connIdx === port.connectedNodes.length - 1);
                        menuItem.style.cssText = 
                            "padding: 8px 12px;" +
                            "cursor: pointer;" +
                            (isLastItem ? "" : "border-bottom: 1px solid var(--border-color, #333);") +
                            "font-size: 12px;" +
                            "transition: background 0.2s;";
                        
                        var portLabel = document.createElement("div");
                        portLabel.style.cssText = "color: #888; font-size: 11px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;";
                        
                        var portColor = null;
                        if (port.slot && port.slot.type) {
                            if (LGraphCanvas && LGraphCanvas.link_type_colors && LGraphCanvas.link_type_colors[port.slot.type]) {
                                portColor = LGraphCanvas.link_type_colors[port.slot.type];
                            }
                        }
                        if (!portColor && port.type) {
                            if (LGraphCanvas && LGraphCanvas.link_type_colors && LGraphCanvas.link_type_colors[port.type]) {
                                portColor = LGraphCanvas.link_type_colors[port.type];
                            } else {
                                var typeColors = {
                                    "MODEL": "#9d5fb0",
                                    "CLIP": "#ffaa00",
                                    "VAE": "#6eafcf",
                                    "LATENT": "#c4a5f7",
                                    "IMAGE": "#c4a5f7",
                                    "CONDITIONING": "#ffaa00"
                                };
                                portColor = typeColors[port.type] || null;
                            }
                        }
                        
                        if (portColor) {
                            var colorDot = document.createElement("span");
                            colorDot.style.cssText = 
                                "display: inline-block;" +
                                "width: 8px;" +
                                "height: 8px;" +
                                "border-radius: 50%;" +
                                "background: " + portColor + ";" +
                                "flex-shrink: 0;";
                            portLabel.appendChild(colorDot);
                        }
                        
                        var portNameSpan = document.createElement("span");
                        var portNameText = port.name;
                        if (port.connectedNodes.length > 1) {
                            portNameText += " [" + (connIdx + 1) + "/" + port.connectedNodes.length + "]";
                        }
                        portNameSpan.textContent = "← " + portNameText;
                        portLabel.appendChild(portNameSpan);
                        menuItem.appendChild(portLabel);
                        
                        var targetLabel = document.createElement("div");
                        targetLabel.textContent = targetNodeTitle + " (ID: " + targetNode.id + ")";
                        targetLabel.style.cssText = "color: #fff; font-weight: 500;";
                        menuItem.appendChild(targetLabel);
                        
                        menuItem.addEventListener("mouseenter", function() {
                            this.style.background = "var(--comfy-menu-bg-hover, rgba(255,255,255,0.1))";
                        });
                        menuItem.addEventListener("mouseleave", function() {
                            this.style.background = "transparent";
                        });
                        
                        menuItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            if (portTeleportFunctions.jumpToNode) {
                                portTeleportFunctions.jumpToNode(targetNode);
                            }
                            closeQuickJumpMenu();
                        });
                        
                        leftPanel.appendChild(menuItem);
                    });
                });
            } else {
                var emptyInput = document.createElement("div");
                emptyInput.textContent = portTeleportT("noConnection");
                emptyInput.style.cssText = 
                    "padding: 20px;" +
                    "text-align: center;" +
                    "color: #888;" +
                    "font-size: 12px;";
                leftPanel.appendChild(emptyInput);
            }
            
            if (outputPorts.length > 0) {
                var outputTitle = document.createElement("div");
                outputTitle.textContent = "📤 " + portTeleportT("output");
                outputTitle.style.cssText = 
                    "padding: 8px 12px;" +
                    "background: var(--comfy-menu-bg-hover, rgba(255,255,255,0.05));" +
                    "font-weight: bold;" +
                    "border-bottom: 1px solid var(--border-color, #666);" +
                    "font-size: 12px;";
                rightPanel.appendChild(outputTitle);
                
                outputPorts.forEach(function(port, portIdx) {
                    
                    port.connectedNodes.forEach(function(conn, connIdx) {
                        var targetNode = conn.node;
                        var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : (targetNode.title || targetNode.type);
                        var menuItem = document.createElement("div");
                        menuItem.className = "mechababy-quick-jump-item";
                        var isLastItem = (portIdx === outputPorts.length - 1 && connIdx === port.connectedNodes.length - 1);
                        menuItem.style.cssText = 
                            "padding: 8px 12px;" +
                            "cursor: pointer;" +
                            (isLastItem ? "" : "border-bottom: 1px solid var(--border-color, #333);") +
                            "font-size: 12px;" +
                            "transition: background 0.2s;";
                        
                        var portLabel = document.createElement("div");
                        portLabel.style.cssText = "color: #888; font-size: 11px; margin-bottom: 2px; display: flex; align-items: center; gap: 4px;";
                        
                        var portColor = null;
                        if (port.slot && port.slot.type) {
                            if (LGraphCanvas && LGraphCanvas.link_type_colors && LGraphCanvas.link_type_colors[port.slot.type]) {
                                portColor = LGraphCanvas.link_type_colors[port.slot.type];
                            }
                        }
                        if (!portColor && port.type) {
                            if (LGraphCanvas && LGraphCanvas.link_type_colors && LGraphCanvas.link_type_colors[port.type]) {
                                portColor = LGraphCanvas.link_type_colors[port.type];
                            } else {
                                var typeColors = {
                                    "MODEL": "#9d5fb0",
                                    "CLIP": "#ffaa00",
                                    "VAE": "#6eafcf",
                                    "LATENT": "#c4a5f7",
                                    "IMAGE": "#c4a5f7",
                                    "CONDITIONING": "#ffaa00"
                                };
                                portColor = typeColors[port.type] || null;
                            }
                        }
                        
                        if (portColor) {
                            var colorDot = document.createElement("span");
                            colorDot.style.cssText = 
                                "display: inline-block;" +
                                "width: 8px;" +
                                "height: 8px;" +
                                "border-radius: 50%;" +
                                "background: " + portColor + ";" +
                                "flex-shrink: 0;";
                            portLabel.appendChild(colorDot);
                        }
                        
                        var portNameSpan = document.createElement("span");
                        var portNameText = port.name;
                        if (port.connectedNodes.length > 1) {
                            portNameText += " [" + (connIdx + 1) + "/" + port.connectedNodes.length + "]";
                        }
                        portNameSpan.textContent = portNameText + " →";
                        portLabel.appendChild(portNameSpan);
                        menuItem.appendChild(portLabel);
                        
                        var targetLabel = document.createElement("div");
                        targetLabel.textContent = targetNodeTitle + " (ID: " + targetNode.id + ")";
                        targetLabel.style.cssText = "color: #fff; font-weight: 500;";
                        menuItem.appendChild(targetLabel);
                        
                        menuItem.addEventListener("mouseenter", function() {
                            this.style.background = "var(--comfy-menu-bg-hover, rgba(255,255,255,0.1))";
                        });
                        menuItem.addEventListener("mouseleave", function() {
                            this.style.background = "transparent";
                        });
                        
                        menuItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            if (portTeleportFunctions.jumpToNode) {
                                portTeleportFunctions.jumpToNode(targetNode);
                            }
                            closeQuickJumpMenu();
                        });
                        
                        rightPanel.appendChild(menuItem);
                    });
                });
            } else {
                var emptyOutput = document.createElement("div");
                emptyOutput.textContent = portTeleportT("noConnection");
                emptyOutput.style.cssText = 
                    "padding: 20px;" +
                    "text-align: center;" +
                    "color: #888;" +
                    "font-size: 12px;";
                rightPanel.appendChild(emptyOutput);
            }
            
            contentContainer.appendChild(leftPanel);
            contentContainer.appendChild(rightPanel);
            quickJumpMenu.appendChild(menuHeader);
            quickJumpMenu.appendChild(contentContainer);
            document.body.appendChild(quickJumpMenu);
            
            requestAnimationFrame(function() {
                if (!quickJumpMenu || !quickJumpMenu.parentNode) return;
                
                var nodeElement = null;
                if (app.canvas) {
                    var nodeIdStr = String(node.id);
                    
                    nodeElement = document.querySelector('[data-node-id="' + nodeIdStr + '"]');
                    
                    if (!nodeElement) {
                        nodeElement = document.querySelector('.litenode[data-id="' + nodeIdStr + '"]');
                    }
                    
                    if (!nodeElement && app.canvas.node_widgets && app.canvas.node_widgets[node.id]) {
                        var widgets = app.canvas.node_widgets[node.id];
                        if (widgets && widgets.length > 0) {
                            for (var w = 0; w < widgets.length; w++) {
                                if (widgets[w] && widgets[w].parent) {
                                    nodeElement = widgets[w].parent.closest('.litenode');
                                    if (nodeElement) break;
                                }
                            }
                        }
                    }
                    
                    if (!nodeElement) {
                        var allLiteNodes = document.querySelectorAll('.litenode, [class*="litenode"]');
                        for (var k = 0; k < allLiteNodes.length; k++) {
                            var ln = allLiteNodes[k];
                            if (ln._node && ln._node.id === node.id) {
                                nodeElement = ln;
                                break;
                            }
                            if (ln.getAttribute && (ln.getAttribute('data-id') === nodeIdStr || ln.getAttribute('data-node-id') === nodeIdStr)) {
                                nodeElement = ln;
                                break;
                            }
                        }
                    }
                    
                    if (!nodeElement && node.dom) {
                        nodeElement = node.dom;
                    }
                }
                
                if (nodeElement) {
                    var rect = nodeElement.getBoundingClientRect();
                    var newMenuX = rect.left + rect.width / 2;
                    var newMenuY = rect.top + rect.height / 2;
                    
                    quickJumpMenu.style.left = newMenuX + "px";
                    quickJumpMenu.style.top = newMenuY + "px";

                } else {
                    var nodeX = 0, nodeY = 0;
                    if (node.pos) {
                        if (Array.isArray(node.pos) || ArrayBuffer.isView(node.pos)) {
                            nodeX = node.pos[0];
                            nodeY = node.pos[1];
                        } else {
                            nodeX = node.pos.x || 0;
                            nodeY = node.pos.y || 0;
                        }
                    }
                    var nodeSize = node.size || (node.computeSize ? node.computeSize() : [200, 100]);
                    if (ArrayBuffer.isView(nodeSize)) {
                        nodeSize = [Number(nodeSize[0]), Number(nodeSize[1])];
                    }
                    var nodeWidth = nodeSize[0] || 200;
                    var nodeHeight = nodeSize[1] || 100;
                    var nodeCenterX = nodeX + nodeWidth / 2;
                    var nodeCenterY = nodeY + nodeHeight / 2;
                    
                    var ds = app.canvas.ds || {};
                    var offsetX = Array.isArray(ds.offset) ? ds.offset[0] : (ds.offset ? ds.offset.x : 0);
                    var offsetY = Array.isArray(ds.offset) ? ds.offset[1] : (ds.offset ? ds.offset.y : 0);
                    var scale = ds.scale || 1;
                    
                    var canvasRect = null;
                    if (app.canvas.canvas) {
                        canvasRect = app.canvas.canvas.getBoundingClientRect();
                    } else if (app.canvas.root) {
                        canvasRect = app.canvas.root.getBoundingClientRect();
                    }
                    
                    if (canvasRect) {
                        var testX1 = (nodeCenterX - offsetX) * scale + canvasRect.left;
                        var testY1 = (nodeCenterY - offsetY) * scale + canvasRect.top;
                        var testX2 = nodeCenterX * scale + offsetX + canvasRect.left;
                        var testY2 = nodeCenterY * scale + offsetY + canvasRect.top;
                        
                        var viewportWidth = window.innerWidth;
                        var viewportHeight = window.innerHeight;
                        var canvasRight = canvasRect.left + canvasRect.width;
                        var canvasBottom = canvasRect.top + canvasRect.height;
                        
                        var formula1Valid = testX1 >= canvasRect.left && testX1 <= canvasRight &&
                                           testY1 >= canvasRect.top && testY1 <= canvasBottom &&
                                           testX1 >= 0 && testX1 <= viewportWidth &&
                                           testY1 >= 0 && testY1 <= viewportHeight;
                        
                        var formula2Valid = testX2 >= canvasRect.left && testX2 <= canvasRight &&
                                           testY2 >= canvasRect.top && testY2 <= canvasBottom &&
                                           testX2 >= 0 && testX2 <= viewportWidth &&
                                           testY2 >= 0 && testY2 <= viewportHeight;
                        
                        var newMenuX, newMenuY;
                        var usedFormula;
                        
                        if (formula1Valid && formula2Valid) {
                            var dist1 = Math.abs(testX1 - (canvasRect.left + canvasRect.width/2)) + 
                                       Math.abs(testY1 - (canvasRect.top + canvasRect.height/2));
                            var dist2 = Math.abs(testX2 - (canvasRect.left + canvasRect.width/2)) + 
                                       Math.abs(testY2 - (canvasRect.top + canvasRect.height/2));
                            if (dist1 < dist2) {
                                newMenuX = testX1;
                                newMenuY = testY1;
                                usedFormula = "(graphX - offsetX) * scale + canvasRect.left (两个都有效，选择更接近中心)";
                            } else {
                                newMenuX = testX2;
                                newMenuY = testY2;
                                usedFormula = "graphX * scale + offsetX + canvasRect.left (两个都有效，选择更接近中心)";
                            }
                        } else if (formula2Valid) {
                            newMenuX = testX2;
                            newMenuY = testY2;
                            usedFormula = "graphX * scale + offsetX + canvasRect.left (公式1无效)";
                        } else if (formula1Valid) {
                            newMenuX = testX1;
                            newMenuY = testY1;
                            usedFormula = "(graphX - offsetX) * scale + canvasRect.left (公式2无效)";
                        } else {
                            var dist1 = Math.abs(testX1 - viewportWidth/2) + Math.abs(testY1 - viewportHeight/2);
                            var dist2 = Math.abs(testX2 - viewportWidth/2) + Math.abs(testY2 - viewportHeight/2);
                            if (dist1 < dist2) {
                                newMenuX = testX1;
                                newMenuY = testY1;
                                usedFormula = "(graphX - offsetX) * scale + canvasRect.left (两个都无效，选择更接近视口)";
                            } else {
                                newMenuX = testX2;
                                newMenuY = testY2;
                                usedFormula = "graphX * scale + offsetX + canvasRect.left (两个都无效，选择更接近视口)";
                            }
                        }
                        
                        quickJumpMenu.style.left = newMenuX + "px";
                        quickJumpMenu.style.top = newMenuY + "px";                        

                    }
                }
            });
            
            window._quickJumpMenuDragHandler = function(e) {
                if (!isDragging || !quickJumpMenu) return;
                e.preventDefault();
                var newX = e.clientX - dragOffset.x;
                var newY = e.clientY - dragOffset.y;
                quickJumpMenu.style.left = newX + "px";
                quickJumpMenu.style.top = newY + "px";
                quickJumpMenu.style.transform = "translate(-50%, -50%) scale(" + quickJumpMenuScale + ")";
            };
            
            window._quickJumpMenuDragEndHandler = function(e) {
                if (isDragging) {
                    isDragging = false;
                    quickJumpMenu.style.cursor = "";
                }
            };
            
            document.addEventListener("mousemove", window._quickJumpMenuDragHandler);
            document.addEventListener("mouseup", window._quickJumpMenuDragEndHandler);
            
            window._quickJumpMenuClickHandler = function(e) {
                if (isDragging) return;
                if (quickJumpMenu && quickJumpMenu.contains(e.target)) return;
                closeQuickJumpMenu();
            };
            setTimeout(function() {
                document.addEventListener("mousedown", window._quickJumpMenuClickHandler);
            }, 100);
            
            var escHandler = function(e) {
                if (e.key === "Escape" && quickJumpMenu) {
                    closeQuickJumpMenu();
                    document.removeEventListener("keydown", escHandler);
                }
            };
            document.addEventListener("keydown", escHandler);
            
        }
        
        function setupQuickJumpShortcut() {
            var currentKey = getQuickJumpKey();
            
            document.addEventListener("keydown", function(e) {
                var keyMatch = false;
                if (currentKey === "F1" && e.key === "F1") {
                    keyMatch = true;
                } else if (currentKey && currentKey !== "F1") {
                    var parts = currentKey.split("+");
                    var ctrlMatch = parts.indexOf("Ctrl") >= 0 ? (e.ctrlKey || e.metaKey) : true;
                    var altMatch = parts.indexOf("Alt") >= 0 ? e.altKey : true;
                    var shiftMatch = parts.indexOf("Shift") >= 0 ? e.shiftKey : true;
                    var keyPart = parts[parts.length - 1];
                    if (ctrlMatch && altMatch && shiftMatch && e.key === keyPart) {
                        keyMatch = true;
                    }
                }
                
                if (keyMatch) {
                    var activeElement = document.activeElement;
                    if (activeElement && (
                        activeElement.tagName === "INPUT" ||
                        activeElement.tagName === "TEXTAREA" ||
                        activeElement.isContentEditable
                    )) {
                        return;
                    }
                    
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (app && app.canvas && app.canvas.selected_nodes) {
                        var selectedNodes = app.canvas.selected_nodes;
                        var selectedNodeIds = Object.keys(selectedNodes);
                        if (selectedNodeIds.length > 0) {
                            var selectedNode = selectedNodes[selectedNodeIds[0]];
                            if (selectedNode) {
                                showQuickJumpMenu(selectedNode);
                            }
                        }
                    }
                }
            });
            
        }
        
        setupQuickJumpShortcut();
        var currentLang = getPortTeleportLanguage();
        console.log("[MechaBaby PortTeleport] 扩展已加载 - 在节点端口上右键可传送到连接节点");
        console.log("[MechaBaby PortTeleport] 当前语言: " + currentLang);
        console.log("[MechaBaby PortTeleport] 快速跳转功能已启用 - 选中节点后按 " + getQuickJumpKey() + " 显示快速跳转菜单");
    },

    getCanvasMenuItems: function () {
        return [];
    }
});


