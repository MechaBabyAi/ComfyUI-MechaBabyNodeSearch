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

// 模块级函数，供 getSlotMenuItems 和 setup 共享
var portTeleportFunctions = {
    getConnectedNodes: null,
    jumpToNode: null,
    highlightNode: null,
    getSlotAtPosition: null
};

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
    
    beforeRegisterNodeDef: function(nodeType, nodeData, app) {
        // 在 beforeRegisterNodeDef 中重写 getSlotMenuOptions，确保对所有节点类型都生效
        // 参考 ComfyUI_tinyterraNodes 的实现方式
        var originalGetSlotMenuOptions = nodeType.prototype.getSlotMenuOptions;
        nodeType.prototype.getSlotMenuOptions = function(slot) {
            // 保存节点实例的引用（this 应该是节点实例）
            // 但是因为其他扩展（如 ttNinterface.js）使用了箭头函数，this 可能是扩展对象
            var nodeInstance = this;
            
            // 检查 this 是否是节点实例
            // 节点实例应该有 inputs 和 outputs 属性，并且是 LGraphNode 的实例
            var isNodeInstance = nodeInstance && 
                                 typeof nodeInstance === 'object' && 
                                 nodeInstance.constructor && 
                                 (nodeInstance.inputs !== undefined || nodeInstance.outputs !== undefined) &&
                                 (typeof nodeInstance.inputs === 'object' || typeof nodeInstance.outputs === 'object');
            
            if (!isNodeInstance) {
                // 如果 this 不是节点实例，说明可能是其他扩展的代码有问题
                // 尝试从当前选中的节点或鼠标位置获取节点实例
                if (app && app.canvas && app.canvas.selected_nodes) {
                    var selectedNodes = app.canvas.selected_nodes;
                    var selectedNodeIds = Object.keys(selectedNodes);
                    if (selectedNodeIds.length > 0) {
                        nodeInstance = selectedNodes[selectedNodeIds[0]];
                    }
                }
                
                // 如果仍然不是节点实例，尝试从鼠标位置获取节点
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
                            
                            if (mouseX >= nodeX && mouseX <= nodeX + nodeWidth &&
                                mouseY >= nodeY && mouseY <= nodeY + nodeHeight) {
                                var centerX = nodeX + nodeWidth / 2;
                                var centerY = nodeY + nodeHeight / 2;
                                var distance = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
                                
                                if (distance < closestDistance) {
                                    closestDistance = distance;
                                    closestNode = n;
                                }
                            }
                        }
                        
                        if (closestNode) {
                            nodeInstance = closestNode;
                        }
                    }
                }
                
                // 如果仍然不是节点实例，返回空数组
                if (!nodeInstance || !nodeInstance.inputs || !nodeInstance.outputs) {
                    return [];
                }
            }
            
            // 先调用原始方法（如果有），使用节点实例作为 this
            // 注意：如果原始方法使用了箭头函数，this 可能不对，但我们仍然使用节点实例
            var originalOptions = null;
            if (originalGetSlotMenuOptions) {
                try {
                    originalOptions = originalGetSlotMenuOptions.call(nodeInstance, slot);
                } catch (e) {
                    console.warn("[MechaBaby PortTeleport] 调用原始 getSlotMenuOptions 失败:", e);
                }
            }
            var menuOptions = originalOptions || [];
            
            // 如果 slot 是 undefined，尝试从鼠标位置获取端口信息
            if (!slot) {
                if (app && app.canvas && app.canvas.graph_mouse && portTeleportFunctions.getSlotAtPosition) {
                    var mouseX = app.canvas.graph_mouse[0];
                    var mouseY = app.canvas.graph_mouse[1];
                    var slotInfo = portTeleportFunctions.getSlotAtPosition(nodeInstance, mouseX, mouseY);
                    
                    if (slotInfo && slotInfo.index >= 0 && portTeleportFunctions.getConnectedNodes) {
                        var connectedNodes = portTeleportFunctions.getConnectedNodes(nodeInstance, slotInfo.index, slotInfo.isInput);
                        
                        if (connectedNodes.length > 0) {
                            if (menuOptions.length > 0) {
                                menuOptions.push(null);
                            }
                            
                            if (connectedNodes.length === 1) {
                                var targetNode = connectedNodes[0].node;
                                var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : (targetNode.title || targetNode.type);
                                menuOptions.push({
                                    content: '🎯 ' + portTeleportT('jumpToRelated') + ': ' + targetNodeTitle + ' (ID: ' + targetNode.id + ')',
                                    callback: function() {
                                        if (portTeleportFunctions.jumpToNode) {
                                            portTeleportFunctions.jumpToNode(targetNode);
                                        }
                                    }
                                });
                            } else {
                                menuOptions.push({
                                    content: '🎯 ' + portTeleportT('jumpToRelated'),
                                    has_submenu: true,
                                    submenu: {
                                        options: connectedNodes.map(function(conn) {
                                            var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                            return {
                                                content: targetNodeTitle + ' (ID: ' + conn.node.id + ')',
                                                callback: function() {
                                                    if (portTeleportFunctions.jumpToNode) {
                                                        portTeleportFunctions.jumpToNode(conn.node);
                                                    }
                                                }
                                            };
                                        })
                                    }
                                });
                            }
                        }
                    }
                }
                
                return menuOptions;
            }
            
            // 检查 slot 对象的结构（参考 ttNinterface.js）
            var _slot = slot.input || slot.output || slot;
            
            // 获取端口索引
            var slotIndex = -1;
            var isInput = false;
            
            // 尝试从 slot 对象获取索引
            if (_slot.slot_index !== undefined) {
                slotIndex = _slot.slot_index;
                // 判断是 input 还是 output
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
                // 通过遍历找到索引
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
                    if (menuOptions.length > 0) {
                        menuOptions.push(null);
                    }
                    
                    if (connectedNodes.length === 1) {
                        var targetNode = connectedNodes[0].node;
                        var targetNodeTitle = targetNode.getTitle ? targetNode.getTitle() : (targetNode.title || targetNode.type);
                        menuOptions.push({
                            content: '🎯 ' + portTeleportT('jumpToRelated') + ': ' + targetNodeTitle + ' (ID: ' + targetNode.id + ')',
                            callback: function() {
                                if (portTeleportFunctions.jumpToNode) {
                                    portTeleportFunctions.jumpToNode(targetNode);
                                }
                            }
                        });
                    } else {
                        menuOptions.push({
                            content: '🎯 ' + portTeleportT('jumpToRelated'),
                            has_submenu: true,
                            submenu: {
                                options: connectedNodes.map(function(conn) {
                                    var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                    return {
                                        content: targetNodeTitle + ' (ID: ' + conn.node.id + ')',
                                        callback: function() {
                                            if (portTeleportFunctions.jumpToNode) {
                                                portTeleportFunctions.jumpToNode(conn.node);
                                            }
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
    
    setup: function() {
        /**
         * 获取端口连接的节点
         */
        portTeleportFunctions.getConnectedNodes = function(node, slotIndex, isInput) {
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
        portTeleportFunctions.jumpToNode = function(node) {
            if (!node) return;
            
            // 跳转到节点
            app.canvas.centerOnNode(node);
            
            // 选中节点
            app.canvas.selectNode(node);
            
            // 添加金黄色闪烁高亮效果
            if (portTeleportFunctions.highlightNode) {
                portTeleportFunctions.highlightNode(node);
            }
        };
        
        /**
         * 高亮闪烁节点（金黄色效果）
         */
        portTeleportFunctions.highlightNode = function(node) {
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

        // 注意：getSlotMenuOptions 的重写现在在 beforeRegisterNodeDef hook 中完成
        // 这样可以确保对所有节点类型都生效
        
        /**
         * 获取节点在画布上的端口位置
         * 使用 getSlotPos 方法（如果存在）来获取准确的端口位置
         */
        portTeleportFunctions.getSlotAtPosition = function(node, x, y) {
            if (!node) return null;

            try {
                // 计算相对位置
                var relativeX = x - node.pos[0];
                var relativeY = y - node.pos[1];
                
                // 使用 getSlotPos 方法（如果存在）来获取端口位置
                var hasGetSlotPos = typeof node.getSlotPos === 'function';
                
                // 检查输入端口
                if (node.inputs && Array.isArray(node.inputs)) {
                    for (var i = 0; i < node.inputs.length; i++) {
                        var slotPos = null;
                        
                        if (hasGetSlotPos) {
                            // 使用 getSlotPos 方法获取端口位置
                            var posArray = new Float32Array(2);
                            if (node.getSlotPos(true, i, posArray)) {
                                slotPos = [posArray[0], posArray[1]];
                            }
                        } else {
                            // 备用方案：使用 pos 属性
                            var input = node.inputs[i];
                            if (input && input.pos) {
                                slotPos = [input.pos[0], input.pos[1]];
                            }
                        }
                        
                        if (slotPos) {
                            var distance = Math.sqrt(
                                Math.pow(relativeX - slotPos[0], 2) + 
                                Math.pow(relativeY - slotPos[1], 2)
                            );
                            // 如果距离小于30像素，认为是这个端口（增大检测范围）
                            if (distance < 30) {
                                return { index: i, isInput: true, slot: node.inputs[i] };
                            }
                        }
                    }
                }

                // 检查输出端口
                if (node.outputs && Array.isArray(node.outputs)) {
                    for (var j = 0; j < node.outputs.length; j++) {
                        var slotPos2 = null;
                        
                        if (hasGetSlotPos) {
                            // 使用 getSlotPos 方法获取端口位置
                            var posArray2 = new Float32Array(2);
                            if (node.getSlotPos(false, j, posArray2)) {
                                slotPos2 = [posArray2[0], posArray2[1]];
                            }
                        } else {
                            // 备用方案：使用 pos 属性
                            var output = node.outputs[j];
                            if (output && output.pos) {
                                slotPos2 = [output.pos[0], output.pos[1]];
                            }
                        }
                        
                        if (slotPos2) {
                            var distance2 = Math.sqrt(
                                Math.pow(relativeX - slotPos2[0], 2) + 
                                Math.pow(relativeY - slotPos2[1], 2)
                            );
                            // 如果距离小于30像素，认为是这个端口（增大检测范围）
                            if (distance2 < 30) {
                                return { index: j, isInput: false, slot: node.outputs[j] };
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
                                            portTeleportFunctions.jumpToNode(related.node);
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
                                        var connectedNodes = portTeleportFunctions.getConnectedNodes(node, index, true);
                                        connectedNodes.forEach(function(conn) {
                                            var portName = input.name || portTeleportT('input') + ' ' + index;
                                            var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                            teleportOptions.push({
                                                content: '← ' + portName + ' → ' + targetNodeTitle,
                                                callback: function() {
                                                    portTeleportFunctions.jumpToNode(conn.node);
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
                                        var connectedNodes = portTeleportFunctions.getConnectedNodes(node, index, false);
                                        connectedNodes.forEach(function(conn) {
                                            var portName = output.name || portTeleportT('output') + ' ' + index;
                                            var targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                            teleportOptions.push({
                                                content: portName + ' → ' + targetNodeTitle,
                                                callback: function() {
                                                    portTeleportFunctions.jumpToNode(conn.node);
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

        // 注意：contextmenu 事件监听已移除，因为 getSlotMenuOptions 已经可以处理端口右键菜单
        // 如果需要直接跳转功能（不显示菜单），可以在这里添加

        var currentLang = getPortTeleportLanguage();
        console.log("[MechaBaby PortTeleport] 扩展已加载 - 在节点端口上右键可传送到连接节点");
        console.log("[MechaBaby PortTeleport] 当前语言: " + currentLang);
    }
});

