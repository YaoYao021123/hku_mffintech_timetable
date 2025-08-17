# HKU FinTech Master's Program Interactive Course Schedule

香港大学金融科技硕士课程交互式课程表

## 🌐 在线使用

**直接访问链接：** https://yaoyao021123.github.io/hku_mffintech_timetable/

## 📋 功能特性

### 🎯 核心功能
- **交互式日历视图**：使用FullCalendar.js创建直观的课程时间表
- **课程选择系统**：通过复选框选择课程，自动添加到日历
- **时间冲突检测**：自动检测并高亮显示时间冲突的课程
- **豁免课程处理**：支持核心课程豁免，自动调整选修课数量

### 🎨 界面特性
- **双语支持**：中英文界面切换
- **双视图模式**：
  - **排课模式**：每门课程只能选择一个时间段，避免冲突
  - **查看所有课程模式**：显示所有课程时间段，使用相同颜色
- **颜色编码**：24种不同颜色区分不同课程
- **响应式设计**：支持各种设备屏幕

### ⚙️ 豁免系统
- **基础核心课程**：
  - MFIN7002 Investment Analysis and Portfolio Management
  - MFIN7005 Corporate Finance and Asset Valuation
- **高级核心课程**：
  - MFIN6003 Derivative Securities
  - MFIN7003 Mathematical Techniques in Finance
  - MFIN7033 Advanced Financial Programming and Databases

**豁免逻辑**：
- 无豁免：9门核心 + 1门顶点 + 2门选修
- 豁免1门：8门核心 + 1门顶点 + 3门选修
- 豁免2门：7门核心 + 1门顶点 + 4门选修
- 以此类推...

## 🚀 快速开始

### 本地运行
1. 克隆仓库：
   ```bash
   git clone https://github.com/YaoYao021123/hku_mffintech_timetable.git
   cd hku_mffintech_timetable
   ```

2. 打开 `index.html` 文件即可使用

### 在线使用
直接访问：https://yaoyao021123.github.io/hku_mffintech_timetable/

## 📁 文件结构

```
hku_mffintech_timetable/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js              # 主应用逻辑
├── course-data.js      # 课程数据和配置
├── teaching_plan.md    # 原始教学计划
├── README.md           # 项目说明
└── .github/workflows/  # GitHub Actions配置
```

## 🛠️ 技术栈

- **前端框架**：原生HTML/CSS/JavaScript
- **日历组件**：FullCalendar.js
- **UI框架**：Bootstrap 5
- **部署平台**：GitHub Pages

## 📅 课程数据来源

基于香港大学金融科技硕士课程2025-2026学年教学计划，包含：
- 核心课程（Core Courses）
- 顶点课程（Capstone Course）
- 选修课程（Elective Courses）

## 🔧 自定义配置

### 修改课程数据
编辑 `course-data.js` 文件中的 `COURSE_DATA` 对象

### 调整颜色方案
修改 `COURSE_COLORS` 数组中的颜色值

### 更新豁免设置
在 `EXEMPTION_COURSES` 对象中配置豁免课程

## 📝 更新日志

### v1.0.0 (2025-01-27)
- ✅ 初始版本发布
- ✅ 交互式日历功能
- ✅ 时间冲突检测
- ✅ 双语支持
- ✅ 豁免系统
- ✅ 双视图模式
- ✅ 时间显示修复

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License

---

**项目地址：** https://github.com/YaoYao021123/hku_mffintech_timetable
