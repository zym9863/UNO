[README.md (中文)](./README.md) | [README-EN (English)](./README-EN.md)

# UNO - Online Card Game

一个基于浏览器的单人对战 UNO 纸牌游戏，支持玩家与 1-3 个 AI 对手进行对决。

## 项目预览

![UNO Game](https://img.shields.io/badge/Svelte-5.45.2-FF3E00?style=flat&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-brightgreen?style=flat&logo=vite)

## 技术栈

- **Svelte 5** + TypeScript
- **Vite** 开发服务器与构建
- **纯 CSS** 实现纸牌视觉效果与动画
- 纯客户端运行，无需后端

## 游戏特性

### 完整 UNO 规则
- 标准 108 张卡牌套牌
- 数字卡、功能卡（跳过、反转、+2）
- 万能卡与万能+4卡
- 完整的 +4 卡质疑机制

### 游戏机制
- 🃏 UNO 呼叫系统（含 AI 检测）
- 🎯 智能出牌优先级
- ⚔️ AI 挑战与虚张声势
- ⏱️ AI 出牌思考延迟

### 用户界面
- 🎨 精美卡牌视觉效果
- ✨ 流畅的出牌与抽牌动画
- 📱 响应式布局
- 🎲 多种 AI 对手数量可选（1-3人）

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 运行测试

```bash
pnpm test
```

## 项目结构

```
uno/
├── src/
│   ├── lib/
│   │   ├── types.ts        # 卡牌、玩家、游戏状态类型定义
│   │   ├── deck.ts         # 牌堆创建、洗牌、发牌
│   │   ├── rules.ts        # 出牌验证、特殊卡牌效果
│   │   ├── ai.ts           # AI 决策逻辑
│   │   ├── store.svelte.ts # Svelte Store，核心游戏状态
│   │   └── __tests__/      # 单元测试
│   ├── components/
│   │   ├── Card.svelte           # 卡牌组件
│   │   ├── PlayerHand.svelte     # 玩家手牌
│   │   ├── AIHand.svelte         # AI 手牌
│   │   ├── DiscardPvelte.svelte  # 弃牌堆
│   │   ├── DrawPile.svelte       # 抽牌堆
│   │   ├── ColorPicker.svelte    # 颜色选择器
│   │   ├── GameBoard.svelte      # 游戏主界面
│   │   ├── GameInfo.svelte       # 游戏信息
│   │   └── UnoButton.svelte      # UNO 呼叫按钮
│   └── pages/
│       ├── Menu.svelte     # 开始菜单
│       └── Result.svelte   # 游戏结果
├── docs/plans/             # 设计文档
└── public/
```

## 游戏规则

### 出牌条件
满足以下任一条件即可出牌：
- 颜色与当前活跃颜色相同
- 数字/类型与弃牌堆顶牌相同
- 万能卡或万能+4卡

### 特殊卡牌效果

| 卡牌 | 效果 |
|------|------|
| 跳过 (Skip) | 下家跳过回合 |
| 反转 (Reverse) | 改变出牌方向（2人模式等同跳过） |
| +2 (Draw 2) | 下家抽2张并跳过回合 |
| 万能 (Wild) | 玩家选择新颜色 |
| 万能+4 (Wild Draw 4) | 玩家选择颜色，下家抽4张并跳过回合 |

### +4 卡质疑机制
- 只有当玩家没有与当前颜色匹配的卡牌时才能出 +4
- 被质疑时：若玩家有匹配卡牌则改为抽4张；若没有则质疑者抽6张

## AI 逻辑

### 出牌优先级（高到低）
1. 匹配颜色的功能卡（跳过、反转、+2）
2. 匹配颜色的数字卡（优先出高点数）
3. 类型/点数匹配卡（切换到持有最多的颜色）
4. 万能卡（选择持有最多的颜色）
5. 万能+4（最后手段）
6. 无可出卡牌 → 抽牌

### 颜色选择
统计手牌中各颜色卡牌数量，选择持有最多的颜色。

### 质疑决策
- 若观察到玩家近期出过当前颜色：约 60% 质疑率
- 否则：约 25% 质疑率

## 许可证

MIT License
