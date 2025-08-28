// 全局变量
let calendar;
let selectedCourses = [];
let allCourses = [];
let currentViewMode = 'select'; // 'select' 或 'viewAll'
let isViewAllMode = false;
let currentLanguage = 'zh'; // 'zh' 或 'en'
let exemptedCourses = new Set(); // 豁免的课程代码
let availableElectives = 2; // 基础选修课程数量（无豁免时）
let currentView = 'calendar'; // 'calendar' 或 'agenda'
let selectedReminderTime = 15; // 默认15分钟提醒
let exportNameFormat = 'code-en'; // 导出课程名显示格式: 'code-en' | 'code-zh'

// 课程分类定义
const ENGINEERING_COURSES = ['FITE7410', 'DASC7606'];
const LAW_COURSES = ['LLAW6256', 'LLAW6046'];
let engineeringElectiveCount = 0; // 已选工程学院选修课数量
let lawElectiveCount = 0; // 已选法学院选修课数量

// 应用初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 获取所有课程数据
    allCourses = getAllCourses();
    
    // 初始化豁免课程设置
    initializeExemptionSettings();
    
    // 初始化课程选择界面
    initializeCourseSelection();
    
    // 初始化日历
    initializeCalendar();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 初始化语言显示
    updateLanguageDisplay();
    
    // 不自动加载本地存储的课表，保持空状态
    console.log('应用启动，保持空课表状态');
    // 默认不选择任何课程 - 用户自主选择
    // selectRecommendedCourses();
    
    console.log('应用初始化完成');
}

function initializeCourseSelection() {
    const coreContainer = document.getElementById('core-courses');
    const capstoneContainer = document.getElementById('capstone-courses');
    const engineeringContainer = document.getElementById('engineering-courses');
    const lawContainer = document.getElementById('law-courses');
    const hkubsContainer = document.getElementById('hkubs-courses');
    
    // 获取所有课程并按类型分类
    const categorizedCourses = categorizeCourses();
    
    // 渲染各类课程
    renderCourseGroup(categorizedCourses.core, coreContainer);
    renderCourseGroup(categorizedCourses.capstone, capstoneContainer);
    renderCourseGroup(categorizedCourses.engineering, engineeringContainer);
    renderCourseGroup(categorizedCourses.law, lawContainer);
    renderCourseGroup(categorizedCourses.hkubs, hkubsContainer);
}

function categorizeCourses() {
    const allCourses = [...COURSE_DATA.semester1, ...COURSE_DATA.semester2, ...COURSE_DATA.summer];
    
    const categorized = {
        core: [],
        capstone: [],
        engineering: [],
        law: [],
        hkubs: []
    };
    
    allCourses.forEach(course => {
        if (course.type === 'core') {
            categorized.core.push(course);
        } else if (course.type === 'project') {
            categorized.capstone.push(course);
        } else if (course.type === 'elective') {
            if (ENGINEERING_COURSES.includes(course.code)) {
                categorized.engineering.push(course);
            } else if (LAW_COURSES.includes(course.code)) {
                categorized.law.push(course);
            } else {
                categorized.hkubs.push(course);
            }
        }
    });
    
    return categorized;
}

function renderCourseGroup(courses, container) {
    container.innerHTML = '';
    
    courses.forEach(course => {
        const courseId = `${course.code}-${course.section}`;
        const courseItem = createCourseElement(course, courseId);
        container.appendChild(courseItem);
    });
}

function createCourseElement(course, courseId) {
    const courseItem = document.createElement('div');
    courseItem.className = 'course-item';
    courseItem.dataset.courseId = courseId;
    courseItem.style.borderLeft = `4px solid ${course.color}`;
    
    const courseName = getCourseName(course);
    const courseType = getCourseTypeName(course.type);
    const isExempted = isExemptedCourse(course.code);
    const displayType = (isExempted && course.type === 'core') ? 'elective' : course.type;
    
    courseItem.innerHTML = `
        <div class="d-flex align-items-start">
            <input type="checkbox" class="course-checkbox" id="cb-${courseId}" 
                   data-course-id="${courseId}" 
                   ${selectedCourses.some(c => `${c.code}-${c.section}` === courseId) ? 'checked' : ''}
                   ${shouldDisableCourseSelection(course) ? 'disabled' : ''}>
            <div class="flex-grow-1">
                <div class="course-name">${courseName}</div>
                <div class="course-code">${course.code} ${course.section}</div>
                <div class="course-type ${displayType}">${getCourseTypeName(displayType)}</div>
                ${isExempted ? '<small class="badge bg-info">Exempted</small>' : ''}
                <small class="text-muted d-block mt-1">
                    ${course.instructor}<br>
                    ${course.schedule}<br>
                    ${CAMPUS_INFO[course.campus] || course.campus} - ${course.room}
                </small>
            </div>
        </div>
    `;
    
    // 添加点击事件
    courseItem.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
            const checkbox = courseItem.querySelector('.course-checkbox');
            if (!checkbox.disabled) {
                checkbox.checked = !checkbox.checked;
                handleCourseSelection(checkbox);
            }
        }
    });
    
    // 添加复选框变化事件
    const checkbox = courseItem.querySelector('.course-checkbox');
    checkbox.addEventListener('change', function() {
        handleCourseSelection(this);
    });
    
    return courseItem;
}

function shouldDisableCourseSelection(course) {
    if (isViewAllMode) return false;
    
    // 在选课模式下，如果同一课程已经选择了其他班级，则禁用其他班级
    const sameCourseSelected = selectedCourses.some(selected => 
        selected.code === course.code && 
        `${selected.code}-${selected.section}` !== `${course.code}-${course.section}`
    );
    
    return sameCourseSelected;
}

function handleCourseSelection(checkbox) {
    const courseId = checkbox.dataset.courseId;
    const course = getCourseById(courseId);
    
    if (!course) return;
    
    if (checkbox.checked) {
        // 检查工程学院和法学院选修课限制
        if (course.type === 'elective' && !isViewAllMode) {
            if (ENGINEERING_COURSES.includes(course.code)) {
                const currentEngCount = selectedCourses.filter(c => 
                    c.type === 'elective' && ENGINEERING_COURSES.includes(c.code)
                ).length;
                if (currentEngCount >= 1) {
                    alert(currentLanguage === 'zh' ? 
                          '工程学院选修课最多只能选择1门' : 
                          'You can only select 1 Engineering elective course');
                    checkbox.checked = false;
                    return;
                }
            } else if (LAW_COURSES.includes(course.code)) {
                const currentLawCount = selectedCourses.filter(c => 
                    c.type === 'elective' && LAW_COURSES.includes(c.code)
                ).length;
                if (currentLawCount >= 1) {
                    alert(currentLanguage === 'zh' ? 
                          '法学院选修课最多只能选择1门' : 
                          'You can only select 1 Law elective course');
                    checkbox.checked = false;
                    return;
                }
            }
        }
        
        // 在选课模式下，先移除同一课程的其他班级
        if (!isViewAllMode) {
            selectedCourses = selectedCourses.filter(c => c.code !== course.code);
            // 更新其他班级的复选框状态
            document.querySelectorAll('.course-checkbox').forEach(cb => {
                const otherCourse = getCourseById(cb.dataset.courseId);
                if (otherCourse && otherCourse.code === course.code && cb !== checkbox) {
                    cb.checked = false;
                    updateCourseItemStyle(cb.dataset.courseId, false);
                }
            });
        }
        
        // 添加课程
        if (!selectedCourses.find(c => `${c.code}-${c.section}` === courseId)) {
            selectedCourses.push(course);
        }
    } else {
        // 移除课程
        selectedCourses = selectedCourses.filter(c => 
            `${c.code}-${c.section}` !== courseId
        );
    }
    
    // 更新课程项样式
    updateCourseItemStyle(courseId, checkbox.checked);
    
    // 更新课程可用性
    updateCourseDisability();
    
    // 更新学院选修课计数
    updateFacultyElectiveCounts();
    
    // 更新日历和agenda视图
    updateCalendar();
    updateAgendaView();
    
    // 更新统计信息
    updateStatistics();
    
    // 检查时间冲突
    checkAndDisplayConflicts();
    
    // 自动保存到本地存储
    saveScheduleToLocal();
}

function updateFacultyElectiveCounts() {
    engineeringElectiveCount = selectedCourses.filter(c => 
        c.type === 'elective' && ENGINEERING_COURSES.includes(c.code)
    ).length;
    
    lawElectiveCount = selectedCourses.filter(c => 
        c.type === 'elective' && LAW_COURSES.includes(c.code)
    ).length;
    
    // 更新UI中的限制提示
    updateFacultyLimitDisplay();
}

function updateFacultyLimitDisplay() {
    const engineeringLimit = document.getElementById('engineeringLimit');
    const lawLimit = document.getElementById('lawLimit');
    
    if (engineeringLimit) {
        engineeringLimit.textContent = currentLanguage === 'zh' ? 
            `限选1门 (${engineeringElectiveCount}/1)` : 
            `Max 1 (${engineeringElectiveCount}/1)`;
    }
    
    if (lawLimit) {
        lawLimit.textContent = currentLanguage === 'zh' ? 
            `限选1门 (${lawElectiveCount}/1)` : 
            `Max 1 (${lawElectiveCount}/1)`;
    }
}

function updateCourseItemStyle(courseId, isSelected) {
    const courseItem = document.querySelector(`[data-course-id="${courseId}"]`);
    if (courseItem) {
        courseItem.classList.toggle('selected', isSelected);
    }
}

function updateCourseDisability() {
    if (isViewAllMode) return;
    
    document.querySelectorAll('.course-checkbox').forEach(checkbox => {
        const course = getCourseById(checkbox.dataset.courseId);
        if (course) {
            checkbox.disabled = shouldDisableCourseSelection(course);
            const courseItem = checkbox.closest('.course-item');
            courseItem.classList.toggle('disabled-course', checkbox.disabled);
        }
    });
}

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'zh-cn',
        timeZone: 'local',
        displayEventTime: true,
        displayEventEnd: true,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        slotMinTime: '08:00:00',
        slotMaxTime: '23:00:00',
        allDaySlot: false,
        height: 'auto',
        expandRows: true,
        slotDuration: '00:30:00',
        slotLabelInterval: '01:00:00',
        eventDisplay: 'block',
        eventTextColor: 'white',
        eventBackgroundColor: '#667eea',
        eventBorderColor: '#667eea',
        nowIndicator: true,
        weekends: true,
        businessHours: {
            daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
            startTime: '09:00',
            endTime: '22:00'
        },
        events: [],
        eventClick: function(info) {
            showCourseModal(info.event);
        },
        eventMouseEnter: function(info) {
            info.el.style.transform = 'scale(1.02)';
            info.el.style.zIndex = '1000';
            info.el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        },
        eventMouseLeave: function(info) {
            info.el.style.transform = 'scale(1)';
            info.el.style.zIndex = 'auto';
            info.el.style.boxShadow = 'none';
        },
        eventDidMount: function(info) {
            // 为冲突课程添加特殊标记
            if (info.event.extendedProps.isConflicted) {
                info.el.style.animation = 'pulse 2s infinite';
                info.el.title = '⚠️ 时间冲突 - ' + info.event.title;
            }
        }
    });
    
    calendar.render();
}

function updateCalendar() {
    if (!calendar) return;
    
    // 生成日历事件
    const events = generateCalendarEvents(selectedCourses, isViewAllMode);
    
    // 更新日历事件
    calendar.removeAllEvents();
    calendar.addEventSource(events);
    
    console.log(`更新日历: ${events.length} 个事件`);
}

function initializeExemptionSettings() {
    const fundamentalContainer = document.getElementById('fundamentalCourses');
    const advancedContainer = document.getElementById('advancedCourses');
    
    // 渲染基础核心课程豁免选项
    EXEMPTION_COURSES.fundamental.forEach(course => {
        const exemptionItem = createExemptionElement(course);
        fundamentalContainer.appendChild(exemptionItem);
    });
    
    // 渲染高级核心课程豁免选项
    EXEMPTION_COURSES.advanced.forEach(course => {
        const exemptionItem = createExemptionElement(course);
        advancedContainer.appendChild(exemptionItem);
    });
}

function createExemptionElement(course) {
    const exemptionItem = document.createElement('div');
    exemptionItem.className = 'exemption-item mb-1';
    
    exemptionItem.innerHTML = `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="exempt-${course.code}" 
                   data-course-code="${course.code}">
            <label class="form-check-label" for="exempt-${course.code}" style="font-size: 0.8rem;">
                <span class="course-name-display">${currentLanguage === 'zh' ? course.name : course.nameEn}</span>
                <small class="d-block text-muted">${course.code}</small>
            </label>
        </div>
    `;
    
    // 添加豁免状态变化事件
    const checkbox = exemptionItem.querySelector('.form-check-input');
    checkbox.addEventListener('change', function() {
        handleExemptionChange(this);
    });
    
    return exemptionItem;
}

function handleExemptionChange(checkbox) {
    const courseCode = checkbox.dataset.courseCode;
    
    if (checkbox.checked) {
        exemptedCourses.add(courseCode);
    } else {
        exemptedCourses.delete(courseCode);
    }
    
    updateElectiveCount();
    updateExemptionInfo();
    updateCourseAvailability();
    updateStatistics();
    
    // 自动保存到本地存储
    saveScheduleToLocal();
}

function updateExemptionInfo() {
    const exemptionInfo = document.getElementById('exemptionInfo');
    const count = exemptedCourses.size;
    const electiveCount = 2 + count;
    
    if (currentLanguage === 'zh') {
        exemptionInfo.textContent = `豁免 ${count} 门核心课程 = 可选 ${electiveCount} 门选修课`;
    } else {
        exemptionInfo.textContent = `Exempt ${count} core course(s) = Select ${electiveCount} elective(s)`;
    }
}

function updateCourseAvailability() {
    // 更新课程可用性 - 豁免的课程不显示在核心课程中，而是作为选修课程选项
    const allCourseItems = document.querySelectorAll('.course-item');
    
    allCourseItems.forEach(item => {
        const courseId = item.dataset.courseId;
        const course = getCourseById(courseId);
        if (!course) return;
        
        const isExempted = isExemptedCourse(course.code);
        const typeElement = item.querySelector('.course-type');
        
        if (isExempted && course.type === 'core') {
            // 豁免的核心课程显示为选修课程
            typeElement.textContent = getCourseTypeName('elective');
            typeElement.className = 'course-type elective';
            item.classList.add('exempted-course');
        } else {
            // 恢复原始类型
            typeElement.textContent = getCourseTypeName(course.type);
            typeElement.className = `course-type ${course.type}`;
            item.classList.remove('exempted-course');
        }
    });
}

function selectRecommendedCourses() {
    // 默认选择所有非豁免核心课程的第一个班级
    const coreCoursesFirstSection = {};
    
    allCourses.forEach(course => {
        if (course.type === 'core' && !isExemptedCourse(course.code)) {
            const courseKey = course.code;
            if (!coreCoursesFirstSection[courseKey]) {
                coreCoursesFirstSection[courseKey] = course;
            }
        }
    });
    
    // 选择这些课程
    Object.values(coreCoursesFirstSection).forEach(course => {
        const courseId = `${course.code}-${course.section}`;
        const checkbox = document.querySelector(`[data-course-id="${courseId}"]`);
        if (checkbox) {
            checkbox.checked = true;
            handleCourseSelection(checkbox);
        }
    });
}

function bindEventListeners() {
    // 语言切换按钮
    document.getElementById('languageToggle').addEventListener('click', function() {
        currentLanguage = currentLanguage === 'zh' ? 'en' : 'zh';
        updateLanguageDisplay();
    });
    
    // 视图模式切换
    document.getElementById('selectMode').addEventListener('change', function() {
        if (this.checked) {
            isViewAllMode = false;
            currentViewMode = 'select';
            updateCourseDisability();
            // 在选课模式下，确保每个课程只选一个班级
            ensureOneSectionPerCourse();
        }
    });
    
    document.getElementById('viewAllMode').addEventListener('change', function() {
        if (this.checked) {
            isViewAllMode = true;
            currentViewMode = 'viewAll';
            // 在查看全部模式下，启用所有课程
            document.querySelectorAll('.course-checkbox').forEach(cb => {
                cb.disabled = false;
                const courseItem = cb.closest('.course-item');
                courseItem.classList.remove('disabled-course');
            });
        }
    });
    
    // 全选按钮
    document.getElementById('selectAll').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.course-checkbox:not(:disabled)');
        checkboxes.forEach(cb => {
            if (!cb.checked) {
                cb.checked = true;
                handleCourseSelection(cb);
            }
        });
    });
    
    // 清空按钮
    document.getElementById('clearAll').addEventListener('click', function() {
        const checkboxes = document.querySelectorAll('.course-checkbox');
        checkboxes.forEach(cb => {
            if (cb.checked) {
                cb.checked = false;
                handleCourseSelection(cb);
            }
        });
    });
    
    // 视图切换按钮
    document.getElementById('monthView').addEventListener('click', function() {
        calendar.changeView('dayGridMonth');
        updateViewButtons(this);
    });
    
    document.getElementById('weekView').addEventListener('click', function() {
        calendar.changeView('timeGridWeek');
        updateViewButtons(this);
    });
    
    document.getElementById('dayView').addEventListener('click', function() {
        calendar.changeView('timeGridDay');
        updateViewButtons(this);
    });
    
    // 新增议程视图按钮
    document.getElementById('agendaView').addEventListener('click', function() {
        switchToAgendaView();
        updateViewButtons(this);
    });
    
    // 导出功能按钮
    document.getElementById('exportICS').addEventListener('click', function(e) {
        e.preventDefault();
        showReminderModal();
    });
    
    document.getElementById('exportExcel').addEventListener('click', function(e) {
        e.preventDefault();
        exportToExcel();
    });
    
    document.getElementById('exportAgenda').addEventListener('click', function(e) {
        e.preventDefault();
        exportAgendaToExcel();
    });
    
    // 导出课程名显示语言选项事件
    const codeEn = document.getElementById('exportNameCodeEn');
    const codeZh = document.getElementById('exportNameCodeZh');
    if (codeEn && codeZh) {
        // 默认勾选 编号+英文
        codeEn.checked = true;
        [codeEn, codeZh].forEach(r => {
            r.addEventListener('change', () => {
                if (codeEn.checked) exportNameFormat = 'code-en';
                else exportNameFormat = 'code-zh';
            });
        });
    }
    
    // 箭头动画控制
    initializeCollapseArrows();
    
    // 提醒时间选择模态框事件
    initializeReminderModalEvents();
    
    // 本地存储按钮事件
    document.getElementById('saveLocal').addEventListener('click', function(e) {
        e.preventDefault();
        saveScheduleToLocal();
        // 显示保存成功提示
        const button = this;
        const originalText = button.innerHTML;
        const successText = currentLanguage === 'zh' ? 
            '<i class="fas fa-check"></i> 已保存' : 
            '<i class="fas fa-check"></i> Saved';
        
        button.innerHTML = successText;
        button.classList.add('text-success');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('text-success');
        }, 2000);
    });
    
    document.getElementById('clearLocal').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm(currentLanguage === 'zh' ? 
                   '确定要清除本地保存的课表吗？此操作无法撤销。' : 
                   'Are you sure you want to clear the locally saved schedule? This action cannot be undone.')) {
            clearLocalSchedule();
            // 刷新页面以重置所有状态
            location.reload();
        }
    });
}

function ensureOneSectionPerCourse() {
    const courseCodeMap = new Map();
    const toRemove = [];
    
    selectedCourses.forEach(course => {
        const courseCode = course.code;
        if (courseCodeMap.has(courseCode)) {
            // 已经有这个课程了，标记为需要移除
            toRemove.push(course);
        } else {
            courseCodeMap.set(courseCode, course);
        }
    });
    
    // 移除重复的课程并更新界面
    toRemove.forEach(course => {
        const courseId = `${course.code}-${course.section}`;
        const checkbox = document.querySelector(`[data-course-id="${courseId}"]`);
        if (checkbox) {
            checkbox.checked = false;
            updateCourseItemStyle(courseId, false);
        }
        selectedCourses = selectedCourses.filter(c => 
            `${c.code}-${c.section}` !== courseId
        );
    });
    
    if (toRemove.length > 0) {
        updateCalendar();
        updateStatistics();
        checkAndDisplayConflicts();
    }
}

function updateLanguageDisplay() {
    // 更新界面文本
    const elements = {
        'appTitle': currentLanguage === 'zh' ? '课程规划日历 2025-2026' : 'Course Planning Calendar 2025-2026',
        'exemptionTitle': currentLanguage === 'zh' ? '豁免课程设置' : 'Course Exemption Settings',
        'fundamentalTitle': currentLanguage === 'zh' ? '基础核心课程:' : 'Fundamental Core Courses:',
        'advancedTitle': currentLanguage === 'zh' ? '高级核心课程:' : 'Advanced Core Courses:',
        'courseSelectionTitle': currentLanguage === 'zh' ? '选择课程' : 'Select Courses',
        'selectModeLabel': currentLanguage === 'zh' ? '选课' : 'Select',
        'viewAllModeLabel': currentLanguage === 'zh' ? '查看全部' : 'View All',
        'selectAll': currentLanguage === 'zh' ? '全选' : 'Select All',
        'clearAll': currentLanguage === 'zh' ? '清空' : 'Clear All',
        'languageToggle': currentLanguage === 'zh' ? '🌍 EN' : '🌍 中文',
        'exportLabel': currentLanguage === 'zh' ? '导出' : 'Export',
        'exportICSLabel': currentLanguage === 'zh' ? '日历文件 (.ics)' : 'Calendar File (.ics)',
        'exportExcelLabel': currentLanguage === 'zh' ? 'Excel表格 (.xlsx)' : 'Excel Spreadsheet (.xlsx)',
        'exportAgendaLabel': currentLanguage === 'zh' ? '议程表格 (.xlsx)' : 'Agenda Table (.xlsx)',
        'coreTitle': currentLanguage === 'zh' ? 'Core' : 'Core',
        'capstoneTitle': currentLanguage === 'zh' ? 'Capstone Core' : 'Capstone Core',
        'engineeringTitle': currentLanguage === 'zh' ? 'Elective offered by Faculty of Engineering' : 'Elective offered by Faculty of Engineering',
        'lawTitle': currentLanguage === 'zh' ? 'Elective offered by Faculty of Law' : 'Elective offered by Faculty of Law',
        'hkubsTitle': currentLanguage === 'zh' ? 'HKUBS Programme - Elective' : 'HKUBS Programme - Elective',
        'localStorageLabel': currentLanguage === 'zh' ? '存储' : 'Storage',
        'saveLocalLabel': currentLanguage === 'zh' ? '保存课表' : 'Save Schedule',
        'clearLocalLabel': currentLanguage === 'zh' ? '清除课表' : 'Clear Schedule',
        'localStorageNote': currentLanguage === 'zh' ? '课表会自动保存，下次打开时自动恢复' : 'Schedule is auto-saved and will be restored on next visit',
        'reminderNoneLabel': currentLanguage === 'zh' ? '无' : 'None',
        'reminderAtTimeLabel': currentLanguage === 'zh' ? '日程发生时' : 'At the time of the event',
        'reminder5minLabel': currentLanguage === 'zh' ? '5分钟前' : '5 minutes before',
        'reminder10minLabel': currentLanguage === 'zh' ? '10分钟前' : '10 minutes before',
        'reminder15minLabel': currentLanguage === 'zh' ? '15分钟前' : '15 minutes before',
        'reminder30minLabel': currentLanguage === 'zh' ? '30分钟前' : '30 minutes before',
        'reminder1hourLabel': currentLanguage === 'zh' ? '1小时前' : '1 hour before',
        'reminder2hourLabel': currentLanguage === 'zh' ? '2小时前' : '2 hours before',
        'reminder1dayLabel': currentLanguage === 'zh' ? '1天前' : '1 day before',
        'reminder2dayLabel': currentLanguage === 'zh' ? '2天前' : '2 days before',
        'reminderModalTitle': currentLanguage === 'zh' ? '选择提醒时间' : 'Select Reminder Time',
        'customReminderLabel': currentLanguage === 'zh' ? '自定义时间:' : 'Custom time:',
        'customMinutesLabel': currentLanguage === 'zh' ? '分钟' : 'minutes',
        'customHoursLabel': currentLanguage === 'zh' ? '小时' : 'hours',
        'customDaysLabel': currentLanguage === 'zh' ? '天' : 'days',
        'customReminderBtnLabel': currentLanguage === 'zh' ? '使用自定义' : 'Use Custom',
        'cancelReminderBtn': currentLanguage === 'zh' ? '取消' : 'Cancel',
        'confirmReminderBtnLabel': currentLanguage === 'zh' ? '确认导出' : 'Confirm Export'
    };
    
    Object.entries(elements).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    });
    
    // 更新课程名称显示
    document.querySelectorAll('.course-name-display').forEach(element => {
        const courseItem = element.closest('[data-course-code]');
        if (courseItem) {
            const courseCode = courseItem.dataset.courseCode;
            const courseData = [...EXEMPTION_COURSES.fundamental, ...EXEMPTION_COURSES.advanced]
                .find(c => c.code === courseCode);
            if (courseData) {
                element.textContent = currentLanguage === 'zh' ? courseData.name : courseData.nameEn;
            }
        }
    });
    
    // 更新课程列表显示
    updateCourseListDisplay();
    
    // 更新豁免信息
    updateExemptionInfo();
    
    // 更新学院选修课限制显示
    updateFacultyLimitDisplay();
    
    // 更新日历和agenda视图
    updateCalendar();
    updateAgendaView();
}

function initializeCollapseArrows() {
    // 为所有可收缩面板添加箭头动画监听
    document.querySelectorAll('[data-bs-toggle="collapse"]').forEach(trigger => {
        const targetSelector = trigger.getAttribute('data-bs-target') || trigger.getAttribute('href');
        const targetElement = document.querySelector(targetSelector);
        const arrow = trigger.querySelector('.collapse-arrow');
        
        if (targetElement && arrow) {
            targetElement.addEventListener('show.bs.collapse', function () {
                arrow.classList.add('expanded');
            });
            
            targetElement.addEventListener('hide.bs.collapse', function () {
                arrow.classList.remove('expanded');
            });
            
            // 初始状态设置 - 所有面板默认收缩
            arrow.classList.remove('expanded');
        }
    });
}

// 本地存储功能
function saveScheduleToLocal() {
    const scheduleData = {
        selectedCourses: selectedCourses.map(course => ({
            code: course.code,
            section: course.section
        })),
        exemptedCourses: Array.from(exemptedCourses),
        timestamp: new Date().toISOString()
    };
    
    try {
        localStorage.setItem('hku_fintech_schedule', JSON.stringify(scheduleData));
        console.log('课表已保存到本地存储');
    } catch (error) {
        console.error('保存课表失败:', error);
    }
}

function loadScheduleFromLocal() {
    try {
        const savedData = localStorage.getItem('hku_fintech_schedule');
        if (!savedData) return false;
        
        const scheduleData = JSON.parse(savedData);
        console.log('从本地存储加载课表:', scheduleData);
        
        // 恢复豁免课程
        if (scheduleData.exemptedCourses) {
            exemptedCourses.clear();
            scheduleData.exemptedCourses.forEach(courseCode => {
                exemptedCourses.add(courseCode);
                // 更新豁免课程复选框状态
                const exemptionCheckbox = document.querySelector(`#exempt-${courseCode}`);
                if (exemptionCheckbox) {
                    exemptionCheckbox.checked = true;
                }
            });
        }
        
        // 恢复选中的课程
        if (scheduleData.selectedCourses) {
            selectedCourses = [];
            scheduleData.selectedCourses.forEach(courseInfo => {
                const courseId = `${courseInfo.code}-${courseInfo.section}`;
                const course = getCourseById(courseId);
                if (course) {
                    selectedCourses.push(course);
                    // 更新课程复选框状态
                    const courseCheckbox = document.querySelector(`[data-course-id="${courseId}"]`);
                    if (courseCheckbox) {
                        courseCheckbox.checked = true;
                        updateCourseItemStyle(courseId, true);
                    }
                }
            });
        }
        
        // 更新相关状态
        updateFacultyElectiveCounts();
        updateElectiveCount();
        updateExemptionInfo();
        updateCourseAvailability();
        updateStatistics();
        updateCalendar();
        updateAgendaView();
        checkAndDisplayConflicts();
        
        return true;
    } catch (error) {
        console.error('加载课表失败:', error);
        return false;
    }
}

function clearLocalSchedule() {
    try {
        localStorage.removeItem('hku_fintech_schedule');
        console.log('本地课表已清除');
    } catch (error) {
        console.error('清除本地课表失败:', error);
    }
}

function updateCourseListDisplay() {
    document.querySelectorAll('.course-item').forEach(item => {
        const courseId = item.dataset.courseId;
        const course = getCourseById(courseId);
        if (!course) return;
        
        const nameElement = item.querySelector('.course-name');
        const typeElement = item.querySelector('.course-type');
        
        if (nameElement) {
            nameElement.textContent = getCourseName(course);
        }
        
        if (typeElement) {
            const isExempted = isExemptedCourse(course.code);
            const displayType = (isExempted && course.type === 'core') ? 'elective' : course.type;
            typeElement.textContent = getCourseTypeName(displayType);
        }
    });
}

function updateViewButtons(activeButton) {
    document.querySelectorAll('#monthView, #weekView, #dayView, #agendaView').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
    
    // 根据选择的视图显示相应内容
    const calendarDiv = document.getElementById('calendar');
    const agendaDiv = document.getElementById('agenda-view');
    
    if (activeButton.id === 'agendaView') {
        calendarDiv.style.display = 'none';
        agendaDiv.classList.remove('d-none');
        currentView = 'agenda';
    } else {
        calendarDiv.style.display = 'block';
        agendaDiv.classList.add('d-none');
        currentView = 'calendar';
    }
}

function switchToAgendaView() {
    updateAgendaView();
}

function updateAgendaView() {
    if (currentView !== 'agenda') return;
    
    const agendaData = generateAgendaData();
    const tbody = document.getElementById('agenda-tbody');
    
    tbody.innerHTML = '';
    
    agendaData.forEach(item => {
        const row = document.createElement('tr');
        row.className = item.isSpecial ? 'table-warning' : '';
        
        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.dayOfWeek}</td>
            <td>${item.time}</td>
            <td>
                <div class="fw-bold">${item.courseName}</div>
                <small class="text-muted">${item.courseCode}</small>
            </td>
            <td>${item.instructor}</td>
            <td>${item.location}</td>
            <td>
                <span class="badge bg-${item.typeColor}">${item.type}</span>
            </td>
            <td>${item.isSpecial ? '✓' : ''}</td>
        `;
        
        tbody.appendChild(row);
    });
}

function generateAgendaData() {
    const agendaItems = [];
    
    selectedCourses.forEach(course => {
        const courseName = getCourseName(course);
        const typeColor = course.type === 'core' ? 'primary' : 
                         course.type === 'project' ? 'success' : 'secondary';
        const typeName = getCourseTypeName(course.type);
        
        // 处理常规日期
        course.dates.forEach(dateStr => {
            const date = new Date(dateStr);
            const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const dayOfWeek = dayNames[date.getDay()];
            
            // 解析时间信息
            const timeInfo = parseScheduleForAgenda(course.schedule);
            timeInfo.forEach(time => {
                agendaItems.push({
                    date: dateStr,
                    dayOfWeek: dayOfWeek,
                    time: time,
                    courseName: courseName,
                    courseCode: course.code,
                    instructor: course.instructor,
                    location: `${course.room}, ${course.campus}`,
                    type: typeName,
                    typeColor: typeColor,
                    isSpecial: false,
                    sortKey: `${dateStr}T${time.split('-')[0]}`
                });
            });
        });
        
        // 处理特殊安排
        if (course.special_arrangements && course.special_arrangements.length > 0) {
            course.special_arrangements.forEach(arrangement => {
                const timeInfo = parseScheduleForAgenda(arrangement.time);
                timeInfo.forEach(time => {
                    agendaItems.push({
                        date: arrangement.date,
                        dayOfWeek: arrangement.day,
                        time: time,
                        courseName: courseName + ' (特殊安排)',
                        courseCode: course.code,
                        instructor: course.instructor,
                        location: `${arrangement.venue}, ${course.campus}`,
                        type: typeName,
                        typeColor: 'warning',
                        isSpecial: true,
                        sortKey: `${arrangement.date}T${time.split('-')[0]}`
                    });
                });
            });
        }
    });
    
    // 按日期和时间排序
    agendaItems.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    
    return agendaItems;
}

function parseScheduleForAgenda(scheduleText) {
    const timeRanges = [];
    
    // 匹配时间格式，如 "09:30-12:30" 或 "09:30-12:30 & 14:00-17:00"
    const timePattern = /(\d{2}:\d{2})-(\d{2}:\d{2})/g;
    let match;
    
    while ((match = timePattern.exec(scheduleText)) !== null) {
        timeRanges.push(`${match[1]}-${match[2]}`);
    }
    
    return timeRanges.length > 0 ? timeRanges : [scheduleText];
}

function updateStatistics() {
    const totalSelected = selectedCourses.length;
    const coreCount = selectedCourses.filter(c => c.type === 'core').length;
    const electiveCount = selectedCourses.filter(c => c.type === 'elective').length;
    const projectCount = selectedCourses.filter(c => c.type === 'project').length;
    
    document.getElementById('selectedCount').textContent = totalSelected;
    document.getElementById('coreCount').textContent = coreCount + projectCount; // 毕业项目计入核心课程
    document.getElementById('electiveCount').textContent = electiveCount;
    
    // 更新冲突数量
    const conflicts = detectTimeConflicts(selectedCourses);
    document.getElementById('conflictCount').textContent = conflicts.length;
}

function checkAndDisplayConflicts() {
    const conflicts = detectTimeConflicts(selectedCourses);
    const warningDiv = document.getElementById('conflictWarning');
    const detailsDiv = document.getElementById('conflictDetails');
    
    if (conflicts.length > 0) {
        warningDiv.classList.remove('d-none');
        
        let conflictHtml = '';
        conflicts.forEach((group, index) => {
            conflictHtml += `<div class="mb-2"><strong>冲突 ${index + 1}:</strong><ul class="mb-0">`;
            group.forEach(course => {
                conflictHtml += `<li>${course.name} (${course.section}) - ${course.schedule}</li>`;
            });
            conflictHtml += '</ul></div>';
        });
        
        detailsDiv.innerHTML = conflictHtml;
    } else {
        warningDiv.classList.add('d-none');
    }
}

function showCourseModal(event) {
    const course = event.extendedProps.course;
    const modal = new bootstrap.Modal(document.getElementById('courseModal'));
    
    const courseName = getCourseName(course);
    document.getElementById('courseModalTitle').textContent = 
        `${courseName} (${course.section})`;
    
    const isExempted = isExemptedCourse(course.code);
    const displayType = (isExempted && course.type === 'core') ? 'elective' : course.type;
    
    const labels = currentLanguage === 'zh' ? {
        code: '课程代码',
        type: '课程类型',
        instructor: '授课教师',
        schedule: '上课时间',
        location: '校区教室',
        dates: '上课日期',
        conflict: '⚠️ 此课程与其他已选课程存在时间冲突',
        tbd: '待定'
    } : {
        code: 'Course Code',
        type: 'Course Type',
        instructor: 'Instructor',
        schedule: 'Schedule',
        location: 'Campus & Room',
        dates: 'Class Dates',
        conflict: '⚠️ Time conflict with other selected courses',
        tbd: 'TBD'
    };
    
    const modalBody = document.getElementById('courseModalBody');
    modalBody.innerHTML = `
        <div class="course-detail-item">
            <div class="course-detail-label">${labels.code}</div>
            <div class="course-detail-value">${course.code}</div>
        </div>
        <div class="course-detail-item">
            <div class="course-detail-label">${labels.type}</div>
            <div class="course-detail-value">
                <span class="course-type ${displayType}">${getCourseTypeName(displayType)}</span>
                ${isExempted ? '<span class="badge bg-info ms-2">Exempted</span>' : ''}
            </div>
        </div>
        <div class="course-detail-item">
            <div class="course-detail-label">${labels.instructor}</div>
            <div class="course-detail-value">${course.instructor}</div>
        </div>
        <div class="course-detail-item">
            <div class="course-detail-label">${labels.schedule}</div>
            <div class="course-detail-value">${course.schedule}</div>
        </div>
        <div class="course-detail-item">
            <div class="course-detail-label">${labels.location}</div>
            <div class="course-detail-value">${CAMPUS_INFO[course.campus] || course.campus} - ${course.room}</div>
        </div>
        <div class="course-detail-item">
            <div class="course-detail-label">${labels.dates}</div>
            <div class="course-detail-value">
                ${course.dates.length > 0 ? course.dates.join(', ') : labels.tbd}
            </div>
        </div>
        ${event.extendedProps.isConflicted ? 
            `<div class="course-detail-item"><div class="alert alert-warning mb-0">${labels.conflict}</div></div>` : 
            ''
        }
    `;
    
    modal.show();
}

// 工具函数
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function exportSchedule() {
    // 导出课程表为JSON格式
    const exportData = {
        selectedCourses: selectedCourses.map(course => ({
            code: course.code,
            name: course.name,
            section: course.section,
            type: course.type,
            instructor: course.instructor,
            schedule: course.schedule,
            dates: course.dates,
            campus: course.campus,
            room: course.room
        })),
        conflicts: detectTimeConflicts(selectedCourses),
        exportTime: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'hku_fintech_schedule.json';
    link.click();
}

function printSchedule() {
    // 打印课程表
    const printWindow = window.open('', '_blank');
    const selectedCoursesHtml = selectedCourses.map(course => `
        <tr>
            <td>${course.code}</td>
            <td>${course.name} (${course.section})</td>
            <td>${COURSE_TYPES[course.type].name}</td>
            <td>${course.instructor}</td>
            <td>${course.schedule}</td>
            <td>${CAMPUS_INFO[course.campus] || course.campus}</td>
            <td>${course.room}</td>
        </tr>
    `).join('');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>HKU 金融科技硕士课程表</title>
            <style>
                body { font-family: SimSun, serif; font-size: 12px; margin: 20px; }
                h1 { text-align: center; color: #333; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; font-weight: bold; }
                tr:nth-child(even) { background-color: #f9f9f9; }
                .footer { margin-top: 30px; font-size: 10px; color: #666; text-align: center; }
            </style>
        </head>
        <body>
            <h1>HKU 金融科技金融学硕士 2025-2026学年 个人课程表</h1>
            <table>
                <thead>
                    <tr>
                        <th>课程代码</th>
                        <th>课程名称</th>
                        <th>类型</th>
                        <th>讲师</th>
                        <th>上课时间</th>
                        <th>校区</th>
                        <th>教室</th>
                    </tr>
                </thead>
                <tbody>
                    ${selectedCoursesHtml}
                </tbody>
            </table>
            <div class="footer">
                生成时间: ${new Date().toLocaleString('zh-CN')}<br>
                总计课程: ${selectedCourses.length} 门 | 
                核心课程: ${selectedCourses.filter(c => c.type === 'core').length} 门 | 
                选修课程: ${selectedCourses.filter(c => c.type === 'elective').length} 门
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.print();
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'a':
                e.preventDefault();
                document.getElementById('selectAll').click();
                break;
            case 'x':
                e.preventDefault();
                document.getElementById('clearAll').click();
                break;
            case 'p':
                e.preventDefault();
                printSchedule();
                break;
            case 's':
                e.preventDefault();
                exportSchedule();
                break;
        }
    }
});

// 窗口大小调整时重新渲染日历
window.addEventListener('resize', function() {
    if (calendar) {
        calendar.updateSize();
    }
});

// 导出功能
function exportToICS() {
    if (selectedCourses.length === 0) {
        alert(currentLanguage === 'zh' ? '请先选择课程再导出' : 'Please select courses before exporting');
        return;
    }
    
    // ICS文件必须使用CRLF行尾
    const CRLF = '\r\n';
    
    let ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//HKU//Master of Finance in FinTech//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:HKU FinTech Master Schedule',
        'X-WR-TIMEZONE:Asia/Hong_Kong',
        'X-WR-CALDESC:香港大学金融科技硕士课程表',
        'BEGIN:VTIMEZONE',
        'TZID:Asia/Hong_Kong',
        'BEGIN:STANDARD',
        'DTSTART:20251101T030000',
        'TZOFFSETFROM:+0800',
        'TZOFFSETTO:+0800',
        'TZNAME:HKT',
        'END:STANDARD',
        'END:VTIMEZONE'
    ].join(CRLF) + CRLF;

    const events = generateCalendarEvents(selectedCourses);
    
    events.forEach(event => {
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        
        // Format dates for ICS (YYYYMMDDTHHMMSS)
        const formatDate = (date) => {
            return date.getFullYear() +
                   String(date.getMonth() + 1).padStart(2, '0') +
                   String(date.getDate()).padStart(2, '0') + 'T' +
                   String(date.getHours()).padStart(2, '0') +
                   String(date.getMinutes()).padStart(2, '0') +
                   String(date.getSeconds()).padStart(2, '0');
        };
        
        const dtStart = formatDate(startDate);
        const dtEnd = formatDate(endDate);
        const dtStamp = formatDate(new Date());
        
        // Create unique UID - 移除特殊字符
        const cleanEventId = event.id.replace(/[^a-zA-Z0-9\-]/g, '');
        const uid = `${cleanEventId}-${Date.now()}@hku-fintech.edu.hk`;
        
        // 转义特殊字符
        const escapeText = (text) => {
            return text.replace(/\\/g, '\\\\')
                      .replace(/;/g, '\\;')
                      .replace(/,/g, '\\,')
                      .replace(/\n/g, '\\n')
                      .replace(/\r/g, '');
        };
        
        // Event description
        const description = escapeText(
            `课程代码: ${event.extendedProps.course.code}\\n` +
            `讲师: ${event.extendedProps.instructor}\\n` +
            `地点: ${event.extendedProps.room}\\n` +
            `校区: ${event.extendedProps.campus}`
        );
        
        const location = escapeText(`${event.extendedProps.room}, ${event.extendedProps.campus}`);
        // 根据导出课程名设置生成标题：编号 + 名称（英/中） + (Class X)
        const course = event.extendedProps.course;
        const zh = getCourseName(course, 'zh');
        const en = getCourseName(course, 'en');
        const baseName = exportNameFormat === 'code-zh' ? `${course.code} ${zh}` : `${course.code} ${en}`;
        const classLabel = currentLanguage === 'zh' ? `(${course.section})` : `(${course.section})`;
        const isSpecial = event.extendedProps.isSpecialArrangement;
        const summary = escapeText(`${baseName} ${classLabel}${isSpecial ? ' - 特殊安排' : ''}`);
        
        let eventLines = [
            'BEGIN:VEVENT',
            `UID:${uid}`,
            `DTSTAMP:${dtStamp}Z`,
            `ORGANIZER;CN=HKU Business School:MAILTO:noreply@hku.hk`,
            `DTSTART;TZID=Asia/Hong_Kong:${dtStart}`,
            `DTEND;TZID=Asia/Hong_Kong:${dtEnd}`,
            `SUMMARY:${summary}`,
            `DESCRIPTION:${description}`,
            `LOCATION:${location}`,
            'STATUS:CONFIRMED',
            'SEQUENCE:0'
        ];
        
        // 添加提醒
        if (selectedReminderTime !== null) {
            eventLines.push(
                'BEGIN:VALARM',
                `TRIGGER:-PT${selectedReminderTime}M`,
                'DESCRIPTION:课程即将开始',
                'ACTION:DISPLAY',
                'END:VALARM'
            );
        }
        
        eventLines.push('END:VEVENT');
        
        ics += eventLines.join(CRLF) + CRLF;
    });
    
    ics += 'END:VCALENDAR' + CRLF;
    
    // Download ICS file
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'HKU_FinTech_Schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    setTimeout(() => {
        let message;
        if (selectedReminderTime === null) {
            message = currentLanguage === 'zh' ? 
                '日历文件导出成功！文件不包含提醒。' : 
                'Calendar exported successfully! File includes no reminders.';
        } else if (selectedReminderTime === 0) {
            message = currentLanguage === 'zh' ? 
                '日历文件导出成功！文件包含课程开始时提醒。' : 
                'Calendar exported successfully! File includes reminders at event time.';
        } else {
            message = currentLanguage === 'zh' ? 
                `日历文件导出成功！文件包含${selectedReminderTime}分钟课前提醒。` : 
                `Calendar exported successfully! File includes ${selectedReminderTime}-minute pre-class reminders.`;
        }
        alert(message);
    }, 100);
}

function exportToExcel() {
    if (selectedCourses.length === 0) {
        alert(currentLanguage === 'zh' ? '请先选择课程再导出' : 'Please select courses before exporting');
        return;
    }
    
    // Prepare data for Excel
    const worksheetData = [];
    
    // Add headers
    const headers = currentLanguage === 'zh' ? 
        ['课程代码', '课程名称', '班级', '类型', '讲师', '上课时间', '日期', '教室', '校区', '特殊安排'] :
        ['Course Code', 'Course Name', 'Section', 'Type', 'Instructor', 'Schedule', 'Date', 'Room', 'Campus', 'Special'];
    
    worksheetData.push(headers);
    
    selectedCourses.forEach(course => {
        const courseType = currentLanguage === 'zh' ? 
            getCourseTypeName(course.type, 'zh') : 
            getCourseTypeName(course.type, 'en');
        // 课程名按导出设置：编号 + 名称（英/中）
        const zhName = getCourseName(course, 'zh');
        const enName = getCourseName(course, 'en');
        const courseName = exportNameFormat === 'code-zh' ? `${course.code} ${zhName}` : `${course.code} ${enName}`;
        
        // Regular class dates
        course.dates.forEach(date => {
            worksheetData.push([
                course.code,
                courseName,
                course.section,
                courseType,
                course.instructor,
                course.schedule,
                date,
                course.room,
                course.campus,
                ''
            ]);
        });
        
        // Special arrangements
        if (course.special_arrangements && course.special_arrangements.length > 0) {
            course.special_arrangements.forEach(arrangement => {
                worksheetData.push([
                    course.code,
                    courseName + ' (特殊安排)',
                    course.section,
                    courseType,
                    course.instructor,
                    `${arrangement.day} ${arrangement.time}`,
                    arrangement.date,
                    arrangement.venue,
                    course.campus,
                    '✓'
                ]);
            });
        }
    });
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Set column widths
    worksheet['!cols'] = [
        { wch: 12 }, // Course Code
        { wch: 35 }, // Course Name
        { wch: 8 },  // Section
        { wch: 10 }, // Type
        { wch: 25 }, // Instructor
        { wch: 25 }, // Schedule
        { wch: 12 }, // Date
        { wch: 20 }, // Room
        { wch: 8 },  // Campus
        { wch: 8 }   // Special
    ];
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, currentLanguage === 'zh' ? '课程安排' : 'Course Schedule');
    
    // Create summary worksheet
    const summaryData = [];
    summaryData.push([currentLanguage === 'zh' ? '课程统计' : 'Course Statistics']);
    summaryData.push([]);
    
    const stats = {
        total: selectedCourses.length,
        core: selectedCourses.filter(c => c.type === 'core').length,
        elective: selectedCourses.filter(c => c.type === 'elective').length,
        project: selectedCourses.filter(c => c.type === 'project').length
    };
    
    if (currentLanguage === 'zh') {
        summaryData.push(['总课程数', stats.total]);
        summaryData.push(['核心课程', stats.core]);
        summaryData.push(['选修课程', stats.elective]);
        summaryData.push(['毕业项目', stats.project]);
        summaryData.push([]);
        summaryData.push(['导出时间', new Date().toLocaleString('zh-CN')]);
    } else {
        summaryData.push(['Total Courses', stats.total]);
        summaryData.push(['Core Courses', stats.core]);
        summaryData.push(['Elective Courses', stats.elective]);
        summaryData.push(['Capstone Project', stats.project]);
        summaryData.push([]);
        summaryData.push(['Export Time', new Date().toLocaleString('en-US')]);
    }
    
    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, currentLanguage === 'zh' ? '统计信息' : 'Statistics');
    
    // Generate Excel file and download
    XLSX.writeFile(workbook, 'HKU_FinTech_Schedule.xlsx');
    
    // Show success message
    setTimeout(() => {
        alert(currentLanguage === 'zh' ? 
              'Excel文件导出成功！包含课程详情和统计信息。' : 
              'Excel file exported successfully! Includes course details and statistics.');
    }, 100);
}

function exportAgendaToExcel() {
    if (selectedCourses.length === 0) {
        alert(currentLanguage === 'zh' ? '请先选择课程再导出议程' : 'Please select courses before exporting agenda');
        return;
    }
    
    const agendaData = generateAgendaData();
    
    // 准备议程表格数据
    const worksheetData = [];
    
    // 添加标题
    const headers = currentLanguage === 'zh' ? 
        ['日期', '星期', '时间', '课程名称', '课程代码', '讲师', '地点', '类型', '特殊安排'] :
        ['Date', 'Day', 'Time', 'Course Name', 'Course Code', 'Instructor', 'Location', 'Type', 'Special'];
    
    worksheetData.push(headers);
    
    // 添加数据行
    agendaData.forEach(item => {
        // 名称按导出设置：编号 + 名称（英/中）
        const course = selectedCourses.find(c => c.code === item.courseCode);
        const zhName = course ? getCourseName(course, 'zh') : item.courseName;
        const enName = course ? getCourseName(course, 'en') : item.courseName;
        const baseName = exportNameFormat === 'code-zh' ? `${item.courseCode} ${zhName}` : `${item.courseCode} ${enName}`;
        const finalName = item.isSpecial ? `${baseName} (特殊安排)` : baseName;
        worksheetData.push([
            item.date,
            item.dayOfWeek,
            item.time,
            finalName,
            item.courseCode,
            item.instructor,
            item.location,
            item.type,
            item.isSpecial ? '✓' : ''
        ]);
    });
    
    // 创建工作簿
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // 设置列宽
    worksheet['!cols'] = [
        { wch: 12 }, // Date
        { wch: 8 },  // Day
        { wch:15 }, // Time
        { wch: 40 }, // Course Name
        { wch: 12 }, // Course Code
        { wch: 25 }, // Instructor
        { wch: 30 }, // Location
        { wch: 12 }, // Type
        { wch: 8 }   // Special
    ];
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, currentLanguage === 'zh' ? '课程议程' : 'Course Agenda');
    
    // 生成并下载Excel文件
    XLSX.writeFile(workbook, 'HKU_FinTech_Agenda.xlsx');
    
    // 显示成功消息
    setTimeout(() => {
        alert(currentLanguage === 'zh' ? 
              '议程表格导出成功！按时间顺序显示所有课程安排。' : 
              'Agenda table exported successfully! Shows all course schedules in chronological order.');
    }, 100);
}

// 显示提醒时间选择模态框
function showReminderModal() {
    if (selectedCourses.length === 0) {
        alert(currentLanguage === 'zh' ? '请先选择课程再导出' : 'Please select courses before exporting');
        return;
    }
    
    // 重置模态框状态
    resetReminderModal();
    
    // 显示模态框
    const modal = new bootstrap.Modal(document.getElementById('reminderModal'));
    modal.show();
}

// 重置提醒时间选择模态框
function resetReminderModal() {
    // 清除所有选中状态
    document.querySelectorAll('.reminder-option').forEach(option => {
        option.classList.remove('selected');
        const icon = option.querySelector('i.fas.fa-check');
        if (icon) {
            icon.remove();
        }
    });
    
    // 设置默认选中15分钟
    const defaultOption = document.querySelector('.reminder-option[data-reminder="15"]');
    if (defaultOption) {
        defaultOption.classList.add('selected');
        const span = defaultOption.querySelector('span');
        if (span) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-check text-success';
            defaultOption.insertBefore(icon, span);
        }
    }
    
    // 重置自定义输入
    document.getElementById('customReminderInput').value = '15';
    document.getElementById('customReminderUnit').value = 'minutes';
    
    selectedReminderTime = 15;
}

// 更新提醒时间选择的UI显示
function updateReminderSelection(selectedValue) {
    // 清除所有选中状态
    document.querySelectorAll('.reminder-option').forEach(option => {
        option.classList.remove('selected');
        const icon = option.querySelector('i.fas.fa-check');
        if (icon) {
            icon.remove();
        }
    });
    
    // 为选中的项目添加选中状态
    const selectedOption = document.querySelector(`.reminder-option[data-reminder="${selectedValue}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        const span = selectedOption.querySelector('span');
        if (span) {
            const icon = document.createElement('i');
            icon.className = 'fas fa-check text-success';
            selectedOption.insertBefore(icon, span);
        }
    }
}

// 初始化提醒时间选择模态框事件
function initializeReminderModalEvents() {
    // 提醒时间选项点击事件
    document.querySelectorAll('.reminder-option').forEach(option => {
        option.addEventListener('click', function() {
            const reminderValue = this.getAttribute('data-reminder');
            
            // 更新选中的提醒时间
            if (reminderValue === 'none') {
                selectedReminderTime = null;
            } else {
                selectedReminderTime = parseInt(reminderValue);
            }
            
            // 更新UI显示
            updateReminderSelection(reminderValue);
        });
    });
    
    // 自定义提醒时间按钮事件
    document.getElementById('customReminderBtn').addEventListener('click', function() {
        const input = document.getElementById('customReminderInput');
        const unit = document.getElementById('customReminderUnit').value;
        const value = parseInt(input.value);
        
        if (!value || value <= 0) {
            alert(currentLanguage === 'zh' ? '请输入有效的自定义时间' : 'Please enter a valid custom time');
            return;
        }
        
        // 转换为分钟
        let minutes;
        switch (unit) {
            case 'minutes':
                minutes = value;
                break;
            case 'hours':
                minutes = value * 60;
                break;
            case 'days':
                minutes = value * 24 * 60;
                break;
            default:
                minutes = value;
        }
        
        // 检查最大值（7天）
        if (minutes > 10080) {
            alert(currentLanguage === 'zh' ? '自定义时间不能超过7天' : 'Custom time cannot exceed 7 days');
            return;
        }
        
        selectedReminderTime = minutes;
        
        // 清除预设选项的选中状态
        document.querySelectorAll('.reminder-option').forEach(option => {
            option.classList.remove('selected');
            const icon = option.querySelector('i.fas.fa-check');
            if (icon) {
                icon.remove();
            }
        });
        
        // 显示自定义选中状态
        const customOption = document.querySelector('.custom-reminder');
        if (customOption) {
            customOption.style.backgroundColor = '#e3f2fd';
            customOption.style.border = '1px solid #2196f3';
        }
    });
    
    // 确认导出按钮事件
    document.getElementById('confirmReminderBtn').addEventListener('click', function() {
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('reminderModal'));
        modal.hide();
        
        // 执行导出
        exportToICS();
    });
    
    // 取消按钮事件
    document.getElementById('cancelReminderBtn').addEventListener('click', function() {
        // 关闭模态框
        const modal = bootstrap.Modal.getInstance(document.getElementById('reminderModal'));
        modal.hide();
    });
}

console.log('📚 HKU 金融科技硕士课程日历应用加载完成!');
