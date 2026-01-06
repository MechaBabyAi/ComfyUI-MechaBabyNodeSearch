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
 * @version 1.0.0
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "MechaBaby.NodeSearch",
    setup() {
        let searchDialog = null;
        let searchResults = [];
        let currentResultIndex = -1;

        /**
         * 搜索节点（包括名称、属性名称、属性值）
         */
        function searchNodes(keyword) {
            if (!keyword || keyword.trim() === "") {
                return [];
            }

            const keywordLower = keyword.toLowerCase().trim();
            const results = [];

            app.graph._nodes.forEach(node => {
                const matches = [];
                const nodeTitle = node.getTitle ? node.getTitle() : (node.title || node.type || "");
                
                // 1. 搜索节点标题
                if (nodeTitle.toLowerCase().includes(keywordLower)) {
                    matches.push({
                        type: 'node_title',
                        name: '节点标题',
                        value: nodeTitle,
                        display: `节点: ${nodeTitle}`
                    });
                }

                // 2. 搜索节点类型
                if (node.type && node.type.toLowerCase().includes(keywordLower)) {
                    matches.push({
                        type: 'node_type',
                        name: '节点类型',
                        value: node.type,
                        display: `类型: ${node.type}`
                    });
                }

                // 3. 搜索控件名称和值
                if (node.widgets && Array.isArray(node.widgets)) {
                    node.widgets.forEach((widget, index) => {
                        const widgetName = widget.name || '';
                        const widgetValue = node.widgets_values?.[index] ?? widget.value ?? '';
                        
                        // 搜索控件名称
                        if (widgetName.toLowerCase().includes(keywordLower)) {
                            matches.push({
                                type: 'widget_name',
                                name: widgetName,
                                value: widgetValue,
                                display: `控件: ${widgetName} = ${String(widgetValue).substring(0, 50)}`
                            });
                        }
                        
                        // 搜索控件值（转换为字符串）
                        const valueStr = String(widgetValue);
                        if (valueStr.toLowerCase().includes(keywordLower) && widgetName) {
                            matches.push({
                                type: 'widget_value',
                                name: widgetName,
                                value: widgetValue,
                                display: `值: ${widgetName} = ${valueStr.substring(0, 50)}`
                            });
                        }
                    });
                }

                // 4. 搜索节点属性
                if (node.properties && typeof node.properties === 'object') {
                    Object.keys(node.properties).forEach(propName => {
                        const propValue = node.properties[propName];
                        const propValueStr = String(propValue);
                        
                        // 搜索属性名称
                        if (propName.toLowerCase().includes(keywordLower)) {
                            matches.push({
                                type: 'property_name',
                                name: propName,
                                value: propValue,
                                display: `属性: ${propName} = ${propValueStr.substring(0, 50)}`
                            });
                        }
                        
                        // 搜索属性值
                        if (propValueStr.toLowerCase().includes(keywordLower)) {
                            matches.push({
                                type: 'property_value',
                                name: propName,
                                value: propValue,
                                display: `属性值: ${propName} = ${propValueStr.substring(0, 50)}`
                            });
                        }
                    });
                }

                // 如果有匹配，添加到结果
                if (matches.length > 0) {
                    results.push({
                        node: node,
                        nodeTitle: nodeTitle,
                        nodeType: node.type,
                        nodeId: node.id,
                        matches: matches,
                        matchCount: matches.length
                    });
                }
            });

            return results;
        }

        /**
         * 跳转到节点并高亮
         */
        function jumpToNode(node, matchIndex = 0) {
            if (!node) return;
            
            // 跳转到节点
            app.canvas.centerOnNode(node);
            
            // 选中节点（高亮显示）
            app.canvas.selectNode(node);
            
            // 可选：滚动到节点位置
            setTimeout(() => {
                const nodeElement = document.querySelector(`[data-node-id="${node.id}"]`);
                if (nodeElement) {
                    nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
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
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchResults.length > 0 && currentResultIndex >= 0) {
                        const result = searchResults[currentResultIndex];
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
            input.addEventListener('input', (e) => {
                const keyword = e.target.value;
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
            closeBtn.addEventListener('mouseenter', () => {
                closeBtn.style.background = '#5a5a5a';
            });
            closeBtn.addEventListener('mouseleave', () => {
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

                info.textContent = `找到 ${searchResults.length} 个节点，${searchResults.reduce((sum, r) => sum + r.matchCount, 0)} 个匹配项`;

                searchResults.forEach((result, index) => {
                    const item = document.createElement('div');
                    item.style.cssText = `
                        padding: 12px;
                        border-bottom: 1px solid #3a3a3a;
                        cursor: pointer;
                        background: ${index === currentResultIndex ? '#3a3a3a' : 'transparent'};
                        transition: background 0.2s;
                    `;
                    item.addEventListener('mouseenter', () => {
                        if (index !== currentResultIndex) {
                            item.style.background = '#333';
                        }
                    });
                    item.addEventListener('mouseleave', () => {
                        if (index !== currentResultIndex) {
                            item.style.background = 'transparent';
                        }
                    });
                    item.addEventListener('click', () => {
                        jumpToNode(result.node);
                        closeDialog();
                    });

                    // 节点标题
                    const title = document.createElement('div');
                    title.textContent = `${result.nodeTitle} (${result.matchCount} 个匹配)`;
                    title.style.cssText = `
                        font-weight: bold;
                        color: #4a9eff;
                        margin-bottom: 5px;
                        font-size: 14px;
                    `;
                    item.appendChild(title);

                    // 节点类型
                    const type = document.createElement('div');
                    type.textContent = `类型: ${result.nodeType}`;
                    type.style.cssText = `
                        color: #888;
                        font-size: 12px;
                        margin-bottom: 8px;
                    `;
                    item.appendChild(type);

                    // 匹配项列表（最多显示3个）
                    const matchesList = document.createElement('div');
                    result.matches.slice(0, 3).forEach(match => {
                        const matchItem = document.createElement('div');
                        matchItem.textContent = `  • ${match.display}`;
                        matchItem.style.cssText = `
                            color: #aaa;
                            font-size: 12px;
                            margin-left: 10px;
                            margin-bottom: 3px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        `;
                        matchesList.appendChild(matchItem);
                    });
                    if (result.matches.length > 3) {
                        const more = document.createElement('div');
                        more.textContent = `  ... 还有 ${result.matches.length - 3} 个匹配项`;
                        more.style.cssText = `
                            color: #666;
                            font-size: 11px;
                            margin-left: 10px;
                            font-style: italic;
                        `;
                        matchesList.appendChild(more);
                    }
                    item.appendChild(matchesList);

                    container.appendChild(item);
                });
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
            dialog.addEventListener('click', (e) => {
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
                
                // 聚焦输入框
                setTimeout(() => {
                    const input = searchDialog.querySelector('input');
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }, 100);
            }
        }

        // 注册快捷键 Ctrl+F
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
                e.preventDefault();
                openSearchDialog();
            }
        });

        // 添加到画布右键菜单
        const orig = LGraphCanvas.prototype.getCanvasMenuOptions;
        LGraphCanvas.prototype.getCanvasMenuOptions = function () {
            const options = orig.apply(this, arguments);
            options.push(null, {
                content: "🔍 搜索节点 (Ctrl+F)",
                callback: () => {
                    openSearchDialog();
                },
            });
            return options;
        };

        console.log("[MechaBaby NodeSearch] 扩展已加载 - 按 Ctrl+F 打开搜索");
    },
});

