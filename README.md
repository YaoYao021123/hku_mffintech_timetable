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
- **双视图模式**：
  - **日历视图**：传统日历格式显示课程
  - **议程视图**：表格格式按时间顺序显示课程

### 🎨 界面特性
- **双语支持**：中英文界面切换
- **课程分类系统**：
  - **核心课程（Core）**：所有type为core的课程
  - **顶点核心（Capstone Core）**：type为project的课程
  - **工程学院选修课**：FITE7410、DASC7606（限选1门）
  - **法学院选修课**：LLAW6256、LLAW6046（限选1门）
  - **商学院选修课**：其余elective课程
- **可收缩面板**：左侧课程分类支持展开/收缩，带箭头指示
- **颜色编码**：24种不同颜色区分不同课程
- **响应式设计**：支持各种设备屏幕

### 📤 导出功能
- **ICS日历文件**：导出为.ics格式，支持日历应用导入
- **Excel表格**：导出为.xlsx格式，包含课程详情和统计信息
- **议程表格**：导出议程视图为.xlsx格式
- **提醒时间设置**：
  - 预设选项：无、日程发生时、5分钟前、10分钟前、15分钟前、30分钟前、1小时前、2小时前、1天前、2天前
  - 自定义时间：支持分钟、小时、天为单位，最大7天
  - 模态框选择：点击日历文件后弹出提醒时间选择界面

### 💾 本地存储
- **自动保存**：选择的课程和豁免设置自动保存到本地
- **手动保存**：支持手动保存当前课表
- **清除功能**：一键清除本地保存的课表
- **默认状态**：应用启动时默认不选择任何课程

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

### 📅 课程数据特性
- **多时间段支持**：正确处理"09:30-12:30 & 14:00-17:00"格式的时间
- **特殊时间安排**：支持课程的特殊时间安排（日期、时间、地点）
- **详细课程信息**：包含课程代码、名称、讲师、时间、地点、类型等完整信息

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
├── time.json           # 原始课程时间数据
├── README.md           # 项目说明
└── .github/workflows/  # GitHub Actions配置
```

## 🛠️ 技术栈

- **前端框架**：原生HTML/CSS/JavaScript
- **日历组件**：FullCalendar.js
- **UI框架**：Bootstrap 5
- **图标库**：Font Awesome
- **Excel导出**：SheetJS (xlsx.js)
- **部署平台**：GitHub Pages

## 📅 课程数据来源

基于香港大学金融科技硕士课程2025-2026学年教学计划，包含：
- **核心课程（Core Courses）**：必修课程
- **顶点课程（Capstone Course）**：毕业项目
- **工程学院选修课**：Faculty of Engineering提供的选修课程
- **法学院选修课**：Faculty of Law提供的选修课程
- **商学院选修课**：HKU Business School提供的选修课程

## 🔧 自定义配置

### 修改课程数据
编辑 `course-data.js` 文件中的 `COURSE_DATA` 对象

### 调整颜色方案
修改 `COURSE_COLORS` 数组中的颜色值

### 更新豁免设置
在 `EXEMPTION_COURSES` 对象中配置豁免课程

### 自定义提醒时间
在 `app.js` 中修改 `selectedReminderTime` 默认值

## 📝 更新日志

### v1.3.0 (2025-01-27)
- ✅ **ICS导出优化**：模态框选择提醒时间，支持自定义时间设置
- ✅ **交互流程改进**：先选择时间，再确认导出
- ✅ **自定义时间功能**：支持分钟、小时、天为单位，最大7天
- ✅ **UI界面优化**：美观的模态框设计，选中状态视觉反馈

### v1.2.0 (2025-01-27)
- ✅ **本地存储功能**：自动保存课表，支持手动保存/清除
- ✅ **可收缩面板**：左侧课程分类支持展开/收缩，带箭头指示
- ✅ **默认状态优化**：应用启动时默认不选择任何课程

### v1.1.0 (2025-01-27)
- ✅ **课程分类系统**：按学院和类型分类课程
- ✅ **选择限制**：工程学院和法学院选修课各限选1门
- ✅ **议程视图**：表格格式按时间顺序显示课程
- ✅ **导出功能**：支持ICS、Excel、议程表格导出
- ✅ **多时间段支持**：正确处理多时间段课程显示

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
