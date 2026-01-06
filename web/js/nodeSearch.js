/**
 * ComfyUI MechaBaby Node Search Extension
 * 
 * 功能说明：
 * 1. 节点名称搜索定位 - 支持节点标题和类型的搜索
 * 2. 节点属性搜索 - 搜索控件名称、控件值、属性名称、属性值
 * 3. 快捷键支持 - Ctrl+F 快速打开搜索对话框
 * 4. 键盘导航 - 支持上下箭头键选择，Enter 跳转，Esc 关闭
 * 
 * 技术实现：
 * - 使用 ComfyUI Extension API (app.registerExtension)
 * - 访问 app.graph._nodes 获取所有节点
 * - 使用 app.canvas.centerOnNode() 实现节点定位
 * - 创建自定义对话框 UI 显示搜索结果
 * 
 * 依赖：
 * - ComfyUI 核心 API (app, app.graph, app.canvas)
 * - LiteGraph API (LGraphCanvas)
 * 
 * @file nodeSearch.js
 * @author MechaBaby
 * @version 1.2.0
 */

import { app } from "../../../scripts/app.js";

// 模块级变量，用于在不同 hook 之间共享
var nodeSearchState = {
    searchDialog: null,
    searchResults: [],
    currentResultIndex: -1,
    keyboardHandlerBound: false,
    openSearchDialog: null  // 将在 setup 中设置
};

app.registerExtension({
    name: "MechaBaby.NodeSearch",
    
    // 新的 Context Menu API hook
    getCanvasMenuItems: function() {
        return [
            null, // separator
            {
                content: "🔍 搜索节点 (Ctrl+F)",
                callback: function() {
                    if (nodeSearchState.openSearchDialog) {
                        nodeSearchState.openSearchDialog();
                    }
                }
            }
        ];
    },
    
    setup: function() {
        var searchDialog = nodeSearchState.searchDialog;
        var searchResults = nodeSearchState.searchResults;
        var currentResultIndex = nodeSearchState.currentResultIndex;
        var keyboardHandlerBound = nodeSearchState.keyboardHandlerBound;

        /**
         * 搜索节点（包括名称、属性名称、属性值）
         * @param {string} keyword - 搜索关键词
         */
        function searchNodes(keyword) {
            if (!keyword || keyword.trim() === "") {
                return [];
            }

            var keywordLower = keyword.toLowerCase().trim();
            var results = [];

            // 搜索工作流中的节点
            if (app.graph && app.graph._nodes) {
                app.graph._nodes.forEach(function(node) {
                    // 使用 try-catch 保护，避免红色报错节点导致搜索中断
                    try {
                        // 检查节点是否有效（红色报错节点可能缺少某些属性）
                        if (!node) return;
                        
                        const matches = [];
                        let nodeTitle = "";
                        
                        // 安全地获取节点标题
                        try {
                            nodeTitle = node.getTitle ? node.getTitle() : (node.title || node.type || "");
                        } catch (e) {
                            nodeTitle = node.type || node.title || "未知节点";
                        }
                        
                        // 1. 搜索节点标题
                        if (nodeTitle && nodeTitle.toLowerCase().includes(keywordLower)) {
                            matches.push({
                                type: 'node_title',
                                name: '节点标题',
                                value: nodeTitle,
                                display: '节点: ' + nodeTitle
                            });
                        }

                        // 2. 搜索节点类型
                        if (node.type && node.type.toLowerCase().includes(keywordLower)) {
                            matches.push({
                                type: 'node_type',
                                name: '节点类型',
                                value: node.type,
                                display: '类型: ' + node.type
                            });
                        }

                        // 3. 搜索控件名称和值（安全访问）
                        try {
                            if (node.widgets && Array.isArray(node.widgets)) {
                                node.widgets.forEach(function(widget, index) {
                                    try {
                                        if (!widget) return;
                                        
                                        const widgetName = widget.name || '';
                                        const widgetValue = (node.widgets_values && node.widgets_values[index] !== undefined) 
                                            ? node.widgets_values[index] 
                                            : (widget.value !== undefined ? widget.value : '');
                                        
                                        // 搜索控件名称
                                        if (widgetName && widgetName.toLowerCase().includes(keywordLower)) {
                                            matches.push({
                                                type: 'widget_name',
                                                name: widgetName,
                                                value: widgetValue,
                                                display: '控件: ' + widgetName + ' = ' + String(widgetValue).substring(0, 50)
                                            });
                                        }
                                        
                                        // 搜索控件值（转换为字符串）
                                        const valueStr = String(widgetValue);
                                        if (valueStr && valueStr.toLowerCase().includes(keywordLower) && widgetName) {
                                            matches.push({
                                                type: 'widget_value',
                                                name: widgetName,
                                                value: widgetValue,
                                                display: '值: ' + widgetName + ' = ' + valueStr.substring(0, 50)
                                            });
                                        }
                                    } catch (widgetError) {
                                        // 单个控件出错不影响其他控件
                                        console.debug("[MechaBaby NodeSearch] 搜索控件时出错:", widgetError);
                                    }
                                });
                            }
                        } catch (widgetsError) {
                            // 控件访问出错，继续搜索其他属性
                            console.debug("[MechaBaby NodeSearch] 访问节点控件时出错:", widgetsError);
                        }

                        // 4. 搜索节点属性（安全访问）
                        try {
                            if (node.properties && typeof node.properties === 'object') {
                                Object.keys(node.properties).forEach(function(propName) {
                                    try {
                                        var propValue = node.properties[propName];
                                        var propValueStr = String(propValue);
                                        
                                        // 搜索属性名称
                                        if (propName && propName.toLowerCase().includes(keywordLower)) {
                                            matches.push({
                                                type: 'property_name',
                                                name: propName,
                                                value: propValue,
                                                display: '属性: ' + propName + ' = ' + propValueStr.substring(0, 50)
                                            });
                                        }
                                        
                                        // 搜索属性值
                                        if (propValueStr && propValueStr.toLowerCase().includes(keywordLower)) {
                                            matches.push({
                                                type: 'property_value',
                                                name: propName,
                                                value: propValue,
                                                display: '属性值: ' + propName + ' = ' + propValueStr.substring(0, 50)
                                            });
                                        }
                                    } catch (propError) {
                                        // 单个属性出错不影响其他属性
                                        console.debug("[MechaBaby NodeSearch] 搜索属性时出错:", propError);
                                    }
                                });
                            }
                        } catch (propertiesError) {
                            // 属性访问出错，继续处理
                            console.debug("[MechaBaby NodeSearch] 访问节点属性时出错:", propertiesError);
                        }

                        // 如果有匹配，添加到结果
                        if (matches.length > 0) {
                            results.push({
                                node: node,
                                nodeTitle: nodeTitle,
                                nodeType: node.type || "未知类型",
                                nodeId: node.id,
                                matches: matches,
                                matchCount: matches.length,
                                isAvailableNode: false // 工作流中的节点
                            });
                        }
                    } catch (nodeError) {
                        // 节点处理出错，记录但继续搜索其他节点
                        const nodeTypeStr = (node && node.type) ? node.type : "未知";
                        console.debug("[MechaBaby NodeSearch] 搜索节点时出错（可能是未安装的节点）:", nodeError, nodeTypeStr);
                        // 即使节点出错，也尝试搜索节点类型（如果可用）
                        if (node && node.type) {
                            try {
                                const nodeType = node.type;
                                if (nodeType.toLowerCase().includes(keywordLower)) {
                                    results.push({
                                        node: node,
                                        nodeTitle: nodeType + " (错误节点)",
                                        nodeType: nodeType,
                                        nodeId: node.id,
                                        matches: [{
                                            type: 'node_type',
                                            name: '节点类型',
                                            value: nodeType,
                                            display: '类型: ' + nodeType + ' (节点可能未正确加载)'
                                        }],
                                        matchCount: 1,
                                        isAvailableNode: false,
                                        hasError: true // 标记为有错误的节点
                                    });
                                }
                            } catch (e) {
                                // 完全无法处理，跳过
                            }
                        }
                    }
                });
            }

            return results;
        }

        /**
         * 跳转到节点并高亮
         */
        function jumpToNode(node, matchIndex) {
            if (matchIndex === undefined) {
                matchIndex = 0;
            }
            if (!node) return;
            
            // 跳转到节点
            app.canvas.centerOnNode(node);
            
            // 选中节点
            app.canvas.selectNode(node);
            
            // 添加金黄色闪烁高亮效果
            highlightNode(node);
        }
        
        /**
         * 高亮闪烁节点（金黄色效果）
         */
        function highlightNode(node) {
            if (!node) return;
            
            // 保存原始颜色
            var originalColor = node.color;
            var originalBgColor = node.bgcolor;
            
            // 金黄色高亮颜色
            var highlightColor = "#FFD700";
            var highlightBgColor = "#4a3d00";
            
            var flashCount = 0;
            var maxFlashes = 6; // 闪烁3次（6次切换）
            var flashInterval = 150; // 每次闪烁间隔150ms
            
            function flash() {
                if (flashCount >= maxFlashes) {
                    // 恢复原始颜色
                    node.color = originalColor;
                    node.bgcolor = originalBgColor;
                    app.canvas.setDirty(true, true);
                    return;
                }
                
                if (flashCount % 2 === 0) {
                    // 高亮
                    node.color = highlightColor;
                    node.bgcolor = highlightBgColor;
                } else {
                    // 恢复
                    node.color = originalColor;
                    node.bgcolor = originalBgColor;
                }
                
                app.canvas.setDirty(true, true);
                flashCount++;
                setTimeout(flash, flashInterval);
            }
            
            // 开始闪烁
            flash();
        }

        /**
         * 创建搜索对话框
         */
        function createSearchDialog() {
            if (searchDialog) {
                return searchDialog;
            }

            const dialog = document.createElement('div');
            dialog.id = 'mechababy-node-search-dialog';
            dialog.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #2a2a2a;
                border: 2px solid #4a4a4a;
                border-radius: 8px;
                padding: 20px;
                z-index: 10000;
                min-width: 500px;
                max-width: 700px;
                max-height: 600px;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                font-family: 'Microsoft YaHei', 'SimHei', Arial, sans-serif;
            `;

            // 标题
            const title = document.createElement('div');
            title.textContent = '🔍 节点搜索';
            title.style.cssText = `
                font-size: 18px;
                font-weight: bold;
                color: #e0e0e0;
                margin-bottom: 15px;
                border-bottom: 1px solid #4a4a4a;
                padding-bottom: 10px;
            `;
            dialog.appendChild(title);
            
            // 搜索输入框
            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = 'margin-bottom: 15px;';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '输入关键词搜索节点名称、属性名称或值...';
            input.style.cssText = `
                width: 100%;
                padding: 10px;
                background: #1a1a1a;
                border: 1px solid #4a4a4a;
                border-radius: 4px;
                color: #e0e0e0;
                font-size: 14px;
                box-sizing: border-box;
            `;
            
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchResults.length > 0 && currentResultIndex >= 0) {
                        var result = searchResults[currentResultIndex];
                        jumpToNode(result.node);
                        closeDialog();
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

            // 结果列表容器
            const resultsContainer = document.createElement('div');
            resultsContainer.id = 'search-results-container';
            resultsContainer.style.cssText = `
                flex: 1;
                overflow-y: auto;
                max-height: 400px;
                border: 1px solid #4a4a4a;
                border-radius: 4px;
                background: #1a1a1a;
            `;
            dialog.appendChild(resultsContainer);

            // 提示信息
            const info = document.createElement('div');
            info.id = 'search-info';
            info.style.cssText = `
                margin-top: 10px;
                font-size: 12px;
                color: #888;
                text-align: center;
            `;
            dialog.appendChild(info);

            // 关闭按钮
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '关闭 (Esc)';
            closeBtn.style.cssText = `
                margin-top: 10px;
                padding: 8px 16px;
                background: #4a4a4a;
                border: none;
                border-radius: 4px;
                color: #e0e0e0;
                cursor: pointer;
                font-size: 14px;
            `;
            closeBtn.addEventListener('click', closeDialog);
            closeBtn.addEventListener('mouseenter', function() {
                closeBtn.style.background = '#5a5a5a';
            });
            closeBtn.addEventListener('mouseleave', function() {
                closeBtn.style.background = '#4a4a4a';
            });
            dialog.appendChild(closeBtn);

            // 更新结果列表
            function updateResultsList() {
                const container = resultsContainer;
                container.innerHTML = '';

                if (searchResults.length === 0) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.textContent = '未找到匹配的节点';
                    emptyMsg.style.cssText = `
                        padding: 20px;
                        text-align: center;
                        color: #888;
                    `;
                    container.appendChild(emptyMsg);
                    info.textContent = '';
                    return;
                }

                var totalMatches = 0;
                for (var i = 0; i < searchResults.length; i++) {
                    totalMatches += searchResults[i].matchCount;
                }
                info.textContent = '找到 ' + searchResults.length + ' 个节点，' + totalMatches + ' 个匹配项';

                for (var idx = 0; idx < searchResults.length; idx++) {
                    (function(index) {
                        var result = searchResults[index];
                        var item = document.createElement('div');
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
                            if (result.hasError) {
                                // 错误节点，尝试跳转
                                if (result.node) {
                                    try {
                                        jumpToNode(result.node);
                                    } catch (e) {
                                        alert('节点 "' + result.nodeTitle + '" 可能未正确加载。请检查扩展是否已安装。');
                                    }
                                }
                            } else {
                                // 跳转到节点
                                jumpToNode(result.node);
                                closeDialog();
                            }
                        });

                        // 节点标题
                        var title = document.createElement('div');
                        var statusBadge = result.hasError ? ' [错误节点]' : '';
                        title.textContent = result.nodeTitle + statusBadge + ' (' + result.matchCount + ' 个匹配)';
                        title.style.cssText = 'font-weight: bold; color: ' + (result.hasError ? '#ff4a4a' : '#4a9eff') + '; margin-bottom: 5px; font-size: 14px;';
                        item.appendChild(title);

                        // 节点类型
                        var type = document.createElement('div');
                        var typeText = '类型: ' + result.nodeType;
                        if (result.hasError) {
                            typeText += ' | ⚠️ 节点可能未正确加载';
                        }
                        type.textContent = typeText;
                        type.style.cssText = 'color: ' + (result.hasError ? '#ff8888' : '#888') + '; font-size: 12px; margin-bottom: 8px;';
                        item.appendChild(type);

                        // 匹配项列表（最多显示3个）
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
                            more.textContent = '  ... 还有 ' + (result.matches.length - 3) + ' 个匹配项';
                            more.style.cssText = 'color: #666; font-size: 11px; margin-left: 10px; font-style: italic;';
                            matchesList.appendChild(more);
                        }
                        item.appendChild(matchesList);

                        container.appendChild(item);
                    })(idx);
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

            // 点击外部关闭
            dialog.addEventListener('click', function(e) {
                if (e.target === dialog) {
                    closeDialog();
                }
            });

            // 初始化
            updateResultsList();

            return dialog;
        }

        /**
         * 打开搜索对话框
         */
        function openSearchDialog() {
            if (!searchDialog) {
                searchDialog = createSearchDialog();
                document.body.appendChild(searchDialog);
            }
            
            // 每次打开都聚焦输入框
            setTimeout(function() {
                var input = searchDialog.querySelector('input');
                if (input) {
                    input.focus();
                    input.select();
                }
            }, 50);
        }
        
        // 保存函数引用到模块级变量，供 getCanvasMenuItems hook 使用
        nodeSearchState.openSearchDialog = openSearchDialog;

        /**
         * 绑定快捷键监听器
         */
        function bindKeyboardShortcut() {
            if (keyboardHandlerBound) return;
            
            var handler = function(e) {
                // 检查是否是 Ctrl+F 或 Cmd+F
                if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) {
                    // 如果输入框有焦点，不拦截（让用户可以在搜索框中输入）
                    var activeElement = document.activeElement;
                    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                        // 如果焦点在搜索对话框的输入框中，不拦截
                        if (searchDialog && searchDialog.contains(activeElement)) {
                            return;
                        }
                    }
                    
                    // 阻止默认行为（浏览器搜索）
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    openSearchDialog();
                    return false;
                }
            };
            
            // 在多个地方绑定，确保能捕获到
            // 1. document 级别（捕获阶段，优先级最高）
            document.addEventListener('keydown', handler, true);
            
            // 2. window 级别
            window.addEventListener('keydown', handler, true);
            
            // 3. 画布级别（如果可用）
            if (app.canvas) {
                if (app.canvas.canvas) {
                    app.canvas.canvas.addEventListener('keydown', handler, true);
                }
                // 等待画布完全加载
                setTimeout(function() {
                    if (app.canvas && app.canvas.canvas) {
                        app.canvas.canvas.addEventListener('keydown', handler, true);
                    }
                }, 500);
            }
            
            keyboardHandlerBound = true;
        }
        
        // 立即绑定
        bindKeyboardShortcut();
        
        // 延迟再次绑定，确保在所有扩展加载后
        setTimeout(function() {
            bindKeyboardShortcut();
        }, 1000);

        // 右键菜单通过 getCanvasMenuItems hook 添加（新的 Context Menu API）

        console.log("[MechaBaby NodeSearch] 扩展已加载 - 按 Ctrl+F 打开搜索");
    }
});

