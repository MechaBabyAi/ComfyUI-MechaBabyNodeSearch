/**
 * ComfyUI MechaBaby Port Teleport Extension
 * 
 * 功能说明：
 * 1. 节点右键菜单传送 - 在节点上右键，选择"传送到连接节点"
 * 2. 端口右键传送 - 直接在端口上右键（如果已连接），自动跳转
 * 3. 多连接处理 - 如果一个端口连接多个节点，显示选择菜单
 * 
 * 技术实现：
 * - 重写 LGraphCanvas.prototype.getNodeMenuOptions 添加右键菜单
 * - 重写 LGraphCanvas.prototype.onMouseDown 监听端口右键
 * - 通过 app.graph.links 获取连接信息
 * - 使用 app.canvas.centerOnNode() 实现跳转
 * 
 * 连接数据结构：
 * - 输入端口：node.inputs[index].link -> link_id -> app.graph.links[link_id]
 * - 输出端口：node.outputs[index].links -> [link_id, ...] -> app.graph.links[link_id]
 * - link.origin_id: 源节点ID, link.target_id: 目标节点ID
 * 
 * @file portTeleport.js
 * @author MechaBaby
 * @version 1.0.0
 */

import { app } from "../../../scripts/app.js";

app.registerExtension({
    name: "MechaBaby.PortTeleport",
    setup() {
        /**
         * 获取端口连接的节点
         */
        function getConnectedNodes(node, slotIndex, isInput) {
            const connectedNodes = [];
            
            if (!node || slotIndex === undefined) {
                return connectedNodes;
            }

            try {
                if (isInput) {
                    // 输入端口：查找连接到这个端口的节点
                    const input = node.inputs?.[slotIndex];
                    if (input && input.link !== null && input.link !== undefined) {
                        const linkId = Array.isArray(input.link) ? input.link[0] : input.link;
                        const link = app.graph.links?.[linkId];
                        if (link) {
                            const sourceNode = app.graph.getNodeById(link.origin_id);
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
                    const output = node.outputs?.[slotIndex];
                    if (output && output.links && Array.isArray(output.links)) {
                        output.links.forEach(linkId => {
                            const link = app.graph.links?.[linkId];
                            if (link) {
                                const targetNode = app.graph.getNodeById(link.target_id);
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
         * 跳转到节点
         */
        function jumpToNode(node) {
            if (!node) return;
            
            // 跳转到节点
            app.canvas.centerOnNode(node);
            
            // 选中节点（高亮显示）
            app.canvas.selectNode(node);
            
            // 滚动到节点位置
            setTimeout(() => {
                const nodeElement = document.querySelector(`[data-node-id="${node.id}"]`);
                if (nodeElement) {
                    nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 100);
        }

        /**
         * 获取节点在画布上的端口位置
         */
        function getSlotAtPosition(node, x, y) {
            if (!node) return null;

            try {
                // 尝试从节点获取端口信息
                const nodeRect = node.computeSize ? node.computeSize() : null;
                if (!nodeRect) return null;

                // 计算相对位置
                const relativeX = x - node.pos[0];
                const relativeY = y - node.pos[1];

                // 检查输入端口
                if (node.inputs && Array.isArray(node.inputs)) {
                    for (let i = 0; i < node.inputs.length; i++) {
                        const input = node.inputs[i];
                        if (input && input.pos) {
                            const slotX = input.pos[0];
                            const slotY = input.pos[1];
                            const distance = Math.sqrt(
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
                    for (let i = 0; i < node.outputs.length; i++) {
                        const output = node.outputs[i];
                        if (output && output.pos) {
                            const slotX = output.pos[0];
                            const slotY = output.pos[1];
                            const distance = Math.sqrt(
                                Math.pow(relativeX - slotX, 2) + 
                                Math.pow(relativeY - slotY, 2)
                            );
                            // 如果距离小于20像素，认为是这个端口
                            if (distance < 20) {
                                return { index: i, isInput: false, slot: output };
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
        const origGetNodeMenuOptions = LGraphCanvas.prototype.getNodeMenuOptions;
        LGraphCanvas.prototype.getNodeMenuOptions = function(node) {
            const options = origGetNodeMenuOptions.apply(this, arguments);
            
            // 检查是否有连接的端口
            const hasInputConnections = node.inputs && node.inputs.some(input => 
                input && input.link !== null && input.link !== undefined
            );
            const hasOutputConnections = node.outputs && node.outputs.some(output => 
                output && output.links && output.links.length > 0
            );

            if (hasInputConnections || hasOutputConnections) {
                options.push(null, {
                    content: "🔗 传送到连接节点",
                    has_submenu: true,
                    submenu: {
                        options: (() => {
                            const teleportOptions = [];
                            
                            // 输入端口连接
                            if (hasInputConnections && node.inputs) {
                                node.inputs.forEach((input, index) => {
                                    if (input && input.link !== null && input.link !== undefined) {
                                        const connectedNodes = getConnectedNodes(node, index, true);
                                        connectedNodes.forEach(conn => {
                                            const portName = input.name || `输入 ${index}`;
                                            const targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                            teleportOptions.push({
                                                content: `← ${portName} → ${targetNodeTitle}`,
                                                callback: () => {
                                                    jumpToNode(conn.node);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                            
                            // 输出端口连接
                            if (hasOutputConnections && node.outputs) {
                                node.outputs.forEach((output, index) => {
                                    if (output && output.links && output.links.length > 0) {
                                        const connectedNodes = getConnectedNodes(node, index, false);
                                        connectedNodes.forEach(conn => {
                                            const portName = output.name || `输出 ${index}`;
                                            const targetNodeTitle = conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type);
                                            teleportOptions.push({
                                                content: `${portName} → ${targetNodeTitle}`,
                                                callback: () => {
                                                    jumpToNode(conn.node);
                                                }
                                            });
                                        });
                                    }
                                });
                            }
                            
                            return teleportOptions.length > 0 ? teleportOptions : [{
                                content: "无连接",
                                disabled: true
                            }];
                        })()
                    }
                });
            }

            return options;
        };

        // 尝试在端口上直接右键（需要监听鼠标事件）
        const origOnMouseDown = LGraphCanvas.prototype.onMouseDown;
        LGraphCanvas.prototype.onMouseDown = function(e) {
            const result = origOnMouseDown.apply(this, arguments);
            
            // 检查是否是右键点击
            if (e.button === 2 && this.node_capturing) {
                const node = this.node_capturing;
                const canvasX = e.canvasX || e.clientX;
                const canvasY = e.canvasY || e.clientY;
                
                // 尝试获取点击的端口
                const slotInfo = getSlotAtPosition(node, canvasX, canvasY);
                
                if (slotInfo) {
                    const connectedNodes = getConnectedNodes(node, slotInfo.index, slotInfo.isInput);
                    
                    if (connectedNodes.length > 0) {
                        // 阻止默认右键菜单
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // 如果只有一个连接，直接跳转
                        if (connectedNodes.length === 1) {
                            jumpToNode(connectedNodes[0].node);
                        } else {
                            // 多个连接，显示菜单选择
                            const menuOptions = connectedNodes.map(conn => ({
                                content: conn.node.getTitle ? conn.node.getTitle() : (conn.node.title || conn.node.type),
                                callback: () => {
                                    jumpToNode(conn.node);
                                }
                            }));
                            
                            // 显示上下文菜单
                            const menu = new LiteGraph.ContextMenu(menuOptions);
                            menu.show(e);
                        }
                    }
                }
            }
            
            return result;
        };

        console.log("[MechaBaby PortTeleport] 扩展已加载 - 在节点端口上右键可传送到连接节点");
    },
});

