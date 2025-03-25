# 项目简介

此项目包含三个游戏，分别为“2048”、“Three!”和“24点”，使用 **Vite + Vue** 搭建。  
动画工具：**GSAP**  
背景动画：仿照 MDN 网站中的示例  
链接：[MDN示例 - Bouncing Balls Features](https://developer.mozilla.org/zh-CN/docs/Learn_web_development/Extensions/Advanced_JavaScript_objects/Adding_bouncing_balls_features)

---

## 游戏一：2048
**操作方式**：  
- 使用键盘操作（WSAD键或方向键）。

**玩法**：  
- 在容器被占满之前尽可能合并相同的数字卡片以获得更高分。

**特色**：  
- 提供三种游戏模式：经典模式、双倍模式和计时模式。  
- 能够响应玩家的快速操作。  
- **注意**：此游戏包含音效。

---

## 游戏二：Three!
**操作方式**：  
- 使用鼠标拖拽数字卡片进行操作。

**特色**：  
- 复刻 Sirvo LLC 开发的手游“Threes!”。  
- 玩法与2048类似，但更具有策略性，也更加精致。

---

## 游戏三：24点
**操作方式**：  
- 使用鼠标点击数字和运算符进行计算，或直接选择你认为的答案。

**游戏特色**：  
- 提供简化点击次数的选择模式。  
- 可自定义设置菜单。  
- 提供可查阅的题解。

**技术特色**：  
- 使用 Web Worker 分离运算逻辑，有效避免加载时的卡顿。

---

