/**
 * ComfyUI MechaBaby Port Teleport Extension
 * 
 * 功能说明：
 * 1. 节点右键菜单传送 - 在节点上右键，选择"传送到连接节点"
 * 2. 端口右键传送 - 直接在端口上右键（如果已连接），自动跳转
 * 3. 多连接处理 - 如果一个端口连接多个节点，显示选择菜单
 * 4. Easy Use 节点支持 - 支持 easy getNode 和 easy setNode 之间的跳转
 *    - getNode 可以跳转到对应的 setNode（通过 Constant 值匹配）
 *    - setNode 可以跳转到所有匹配的 getNode（可能有多个）
 * 
 * 技术实现：
 * - 重写 LGraphCanvas.prototype.getNodeMenuOptions 添加右键菜单
 * - 重写 LGraphCanvas.prototype.onMouseDown 监听端口右键
 * - 通过 app.graph.links 获取连接信息（普通节点）
 * - 通过 node.findSetter() 和 node.findGetters() 获取关联节点（easy use 节点）
 * - 使用 app.canvas.centerOnNode() 实现跳转
 * 
 * 连接数据结构：
 * - 普通节点连接：
 *   - 输入端口：node.inputs[index].link -> link_id -> app.graph.links[link_id]
 *   - 输出端口：node.outputs[index].links -> [link_id, ...] -> app.graph.links[link_id]
 *   - link.origin_id: 源节点ID, link.target_id: 目标节点ID
 * - Easy Use 节点连接：
 *   - getNode: 通过 node.findSetter(graph) 查找匹配的 setNode
 *   - setNode: 通过 node.findGetters(graph) 查找所有匹配的 getNode
 *   - 匹配依据：widgets[0].value (Constant 值)
 * 
 * @file portTeleport.js
 * @author MechaBaby
 * @version 1.3.2
 */

import { app } from "../../../scripts/app.js";

// 多语言资源（与 nodeSearch.js 共享语言设置）
var portTeleportI18n = {
    'zh-CN': {
        teleportToConnected: '传送到连接节点',
        input: '输入',
        output: '输出',
        noConnection: '无连接',
        jumpToRelated: '跳转到关联节点'
    },
    'en-US': {
        teleportToConnected: 'Teleport to Connected Nodes',
        input: 'Input',
        output: 'Output',
        noConnection: 'No Connection',
        jumpToRelated: 'Jump to Related Node'
    },
    'ja-JP': {
        teleportToConnected: '接続ノードにテレポート',
        input: '入力',
        output: '出力',
        noConnection: '接続なし',
        jumpToRelated: '関連ノードにジャンプ'
    },
    'ko-KR': {
        teleportToConnected: '연결된 노드로 텔레포트',
        input: '입력',
        output: '출력',
        noConnection: '연결 없음',
        jumpToRelated: '관련 노드로 이동'
    },
    'ru-RU': {
        teleportToConnected: 'Телепорт к подключенным узлам',
        input: 'Вход',
        output: 'Выход',
        noConnection: 'Нет подключения',
        jumpToRelated: 'Перейти к связанному узлу'
    }
};

// 语言代码映射
var portTeleportLangMap = {
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

// 获取当前语言（与 nodeSearch.js 使用相同的配置）
function getPortTeleportLanguage() {
    var saved = localStorage.getItem('mechababy.nodeSearch.language');
    if (saved && portTeleportI18n[saved]) {
        return saved;
    }
    // 自动检测浏览器语言
    var browserLang = navigator.language || navigator.userLanguage || 'en-US';
    return portTeleportLangMap[browserLang] || portTeleportLangMap[browserLang.split('-')[0]] || 'en-US';
}

// 获取当前语言的文本
function portTeleportT(key) {
    var lang = getPortTeleportLanguage();
    var texts = portTeleportI18n[lang] || portTeleportI18n['en-US'];
    return texts[key] || portTeleportI18n['en-US'][key] || key;
}

app.registerExtension({
    name: "MechaBaby.PortTeleport",
    setup: function() {
        /**
         * 获取端口连接的节点
         */
        function getConnectedNodes(node, slotIndex, isInput) {
            var connectedNodes = [];
            
            if (!node || slotIndex === undefined) {
                return connectedNodes;
            }

            try {
                if (isInput) {
                    // 输入端口：查找连接到这个端口的节点
                    var input = node.inputs && node.inputs[slotIndex];
                    if (input && input.link !== null && input.link !== undefined) {
                        var linkId = Array.isArray(input.link) ? input.link[0] : input.link;
                        var link = app.graph.links && app.graph.links[linkId];
                        if (link) {
                            var sourceNode = app.graph.getNodeById(link.origin_id);
                            if (sourceNode) {
                                connectedNodes.push({
                                    node: sourceNode,
                                    portIndex: link.origin_slot,
                                    direction: 'from'
                                });
                            }
                        }
                    }
                } else {
                    // 输出端口：查找这个端口连接到的所有节点
                    var output = node.outputs && node.outputs[slotIndex];
                    if (output && output.links && Array.isArray(output.links)) {
                        output.links.forEach(function(linkId) {
                            var link = app.graph.links && app.graph.links[linkId];
                            if (link) {
                                var targetNode = app.graph.getNodeById(link.target_id);
                                if (targetNode) {
                                    connectedNodes.push({
                                        node: targetNode,
                                        portIndex: link.target_slot,
                                        direction: 'to'
                                    });
                                }
                            }
                        });
                    }
                }
            } catch (error) {
                console.warn("[MechaBaby PortTeleport] 获取连接节点失败:", error);
            }

            return connectedNodes;
        }

        /**
         * 跳转到节点并高亮闪烁
         */
        function jumpToNode(node) {
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
         * 获取 easy getNode/setNode 的关联节点
         * @param {Object} node - 节点对象
         * @returns {Array} 关联节点数组
         */
        function getEasyUseRelatedNodes(node) {
            var relatedNodes = [];
            
            if (!node || !node.graph) {
                return relatedNodes;
            }

            try {
                // 检查是否是 easy getNode
                if (node.type === 'easy getNode') {
                    // getNode 可以找到对应的 setNode
                    if (typeof node.findSetter === 'function') {
                        var setter = node.findSetter(node.graph);
                        if (setter) {
                            var constantValue = (node.widgets && node.widgets[0] && node.widgets[0].value) || '';
                            if (constantValue) {
                                relatedNodes.push({
                                    node: setter,
                                    label: '→ Set_' + constantValue,
                                    direction: 'to'
                                });
                            }
                        }
                    }
                }
                // 检查是否是 easy setNode
                else if (node.type === 'easy setNode') {
                    // setNode 可以找到所有匹配的 getNode
                    if (typeof node.findGetters === 'function') {
                        var getters = node.findGetters(node.graph);
                        if (getters && getters.length > 0) {
                            var constantValue = (node.widgets && node.widgets[0] && node.widgets[0].value) || '';
                            getters.forEach(function(getter) {
                                relatedNodes.push({
                                    node: getter,
                                    label: '→ Get_' + constantValue,
                                    direction: 'to'
                                });
                            });
                        }
                    }
                }
            } catch (error) {
                console.warn("[MechaBaby PortTeleport] 获取 easy use 关联节点失败:", error);
            }

            return relatedNodes;
        }

        /**
         * 获取节点在画布上的端口位置
         */
        function getSlotAtPosition(node, x, y) {
            if (!node) return null;

            try {
                // 尝试从节点获取端口信息
                var nodeRect = node.computeSize ? node.computeSize() : null;
                if (!nodeRect) return null;

                // 计算相对位置
                var relativeX = x - node.pos[0];
                var relativeY = y - node.pos[1];

                // 检查输入端口
                if (node.inputs && Array.isArray(node.inputs)) {
                    for (var i = 0; i < node.inputs.length; i++) {
                        var input = node.inputs[i];
                        if (input && input.pos) {
                            var slotX = input.pos[0];
                            var slotY = input.pos[1];
                            var distance = Math.sqrt(
                                Math.pow(relativeX - slotX, 2) + 
                                Math.pow(relativeY - slotY, 2)
                            );
                            // 如果距离小于20像素，认为是这个端口
                            if (distance < 20) {
                                return { index: i, isInput: true, slot: input };
                            }
                        }
                    }
                }

                // 检查输出端口
                if (node.outputs && Array.isArray(node.outputs)) {
                    for (var j = 0; j < node.outputs.length; j++) {
                        var output = node.outputs[j];
                        if (output && output.pos) {
                            var slotX2 = output.pos[0];
                            var slotY2 = output.pos[1];
                            var distance2 = Math.sqrt(
                                Math.pow(relativeX - slotX, 2) + 
                                Math.pow(relativeY - slotY2, 2)
                            );
                            // 如果距离小于20像素，认为是这个端口
                            if (distance2 < 20) {
                                return { index: j, isInput: false, slot: output };
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn("[MechaBaby PortTeleport] 获取端口位置失败:", error);
            }

            return null;
        }

        /**
         * 修改节点右键菜单，添加端口传送选项
         */
        var origGetNodeMenuOptions = LGraphCanvas.prototype.getNodeMenuOptions;
        LGraphCanvas.prototype.getNodeMenuOptions = function(node) {
            var options = origGetNodeMenuOptions.apply(this, arguments);
            
            // 检查是否有连接的端口
            var hasInputConnections = node.inputs && node.inputs.some(function(input) { 
                return input && input.link !== null && input.link !== undefined;
            });
            var hasOutputConnections = node.outputs && node.outputs.some(function(output) { 
                return output && output.links && output.links.length > 0;
            });

            // 检查是否是 easy getNode/setNode
            var isEasyGetNode = node.type === 'easy getNode';
            var isEasySetNode = node.type === 'easy setNode';
            var easyRelatedNodes = getEasyUseRelatedNodes(node);

            // 如果有端口连接或 easy use 关联节点，添加菜单
            if (hasInputConnections || hasOutputConnections || easyRelatedNodes.length > 0) {
                options.push(null, {
                    content: "🔗 " + portTeleportT('teleportToConnected'),
                    has_submenu: true,
                    submenu: {
                        options: (function() {
                            var teleportOptions = [];
                            
                            // Easy Use 关联节点（优先显示）
                            if (easyRelatedNodes.length > 0) {
                                easyRelatedNodes.forEach(function(related) {
                                    var targetNodeTitle = related.node.getTitle ? related.node.getTitle() : (related.node.title || related.node.type);
                                    teleportOptions.push({
                                        content: related.label || '→ ' + targetNodeTitle,
                                        callback: function() {
                                            jumpToNode(related.node);
                                        }
                                    });
                                });
                                
                                // 如果有其他连接，添加分隔符
                                if (hasInputConnections || hasOutputConnections) {
                                    teleportOptions.push(null);
                                }
                            }
                            
                            // 输入端口连接
                            if (hasInputConnections && node.inputs) {
                                node.inputs.forEach(function(input, index) {
                                    if (input && input.link !== null && input.link !== undefined) {
                                        var connectedNodes = getConnectedNodes(node, index, true);
                                        connectedNodes.forEach(function(conn) {
                                            var portName = input.name || portTeleportT('input') + ' ' + index;
                                            var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                            teleportOptions.push({
                                                content: '← ' + portName + ' → ' + targetNodeTitle,
                                                callback: function() {
                                                    jumpToNode(conn.node);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                            
                            // 输出端口连接
                            if (hasOutputConnections && node.outputs) {
                                node.outputs.forEach(function(output, index) {
                                    if (output && output.links && output.links.length > 0) {
                                        var connectedNodes = getConnectedNodes(node, index, false);
                                        connectedNodes.forEach(function(conn) {
                                            var portName = output.name || portTeleportT('output') + ' ' + index;
                                            var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                            teleportOptions.push({
                                                content: portName + ' → ' + targetNodeTitle,
                                                callback: function() {
                                                    jumpToNode(conn.node);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                            
                            return teleportOptions.length > 0 ? teleportOptions : [{
                                content: portTeleportT('noConnection'),
                                disabled: true
                            }];
                        })()
                    }
                });
            }

            return options;
        };

        // 尝试在端口上直接右键（需要监听鼠标事件）
        var origOnMouseDown = LGraphCanvas.prototype.onMouseDown;
        LGraphCanvas.prototype.onMouseDown = function(e) {
            var result = origOnMouseDown.apply(this, arguments);
            
            // 检查是否是右键点击
            if (e.button === 2 && this.node_capturing) {
                var node = this.node_capturing;
                var canvasX = typeof e.canvasX === 'number' ? e.canvasX : e.clientX;
                var canvasY = typeof e.canvasY === 'number' ? e.canvasY : e.clientY;
                
                // 尝试获取点击的端口
                var slotInfo = getSlotAtPosition(node, canvasX, canvasY);
                
                if (slotInfo) {
                    var connectedNodes = getConnectedNodes(node, slotInfo.index, slotInfo.isInput);
                    
                    if (connectedNodes.length > 0) {
                        // 阻止默认右键菜单
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 如果只有一个连接，直接跳转
                        if (connectedNodes.length === 1) {
                            jumpToNode(connectedNodes[0].node);
                        } else {
                            // 多个连接，显示菜单选择
                            var menuOptions = connectedNodes.map(function(conn) {
                                return {
                                    content: conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type),
                                    callback: function() {
                                        jumpToNode(conn.node);
                                    }
                                };
                            });
                            
                            // 显示上下文菜单
                            const menu = new LiteGraph.ContextMenu(menuOptions);
                            menu.show(e);
                        }
                    }
                }
                // 如果没有点击到端口，检查是否是 easy getNode/setNode
                else if (node.type === 'easy getNode' || node.type === 'easy setNode') {
                    var easyRelatedNodes = getEasyUseRelatedNodes(node);
                    
                    if (easyRelatedNodes.length > 0) {
                        // 如果只有一个关联节点，直接跳转
                        if (easyRelatedNodes.length === 1) {
                            e.preventDefault();
                            e.stopPropagation();
                            jumpToNode(easyRelatedNodes[0].node);
                        }
                        // 多个关联节点时，通过右键菜单处理（已经在 getNodeMenuOptions 中添加）
                    }
                }
            }
            
            return result;
        };

        var currentLang = getPortTeleportLanguage();
        console.log("[MechaBaby PortTeleport] 扩展已加载 - 在节点端口上右键可传送到连接节点");
        console.log("[MechaBaby PortTeleport] 支持 easy getNode/setNode 节点跳转");
        console.log("[MechaBaby PortTeleport] 当前语言: " + currentLang);
    }
});

