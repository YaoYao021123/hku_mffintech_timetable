// 全局变量
let calendar;
let selectedCourses = [];
let allCourses = [];
let currentViewMode = 'select'; // 'select' 或 'viewAll'
let isViewAllMode = false;
let currentLanguage = 'zh'; // 'zh' 或 'en'
let exemptedCourses = new Set(); // 豁免的课程代码
let availableElectives = 2; // 基础选修课程数量（无豁免时）

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
    
    // 默认不选择任何课程 - 用户自主选择
    // selectRecommendedCourses();
    
    console.log('应用初始化完成');
}

function initializeCourseSelection() {
    const semester1Container = document.getElementById('semester1-courses');
    const semester2Container = document.getElementById('semester2-courses');
    const summerContainer = document.getElementById('summer-courses');
    
    // 渲染第一学期课程
    renderCourseGroup(COURSE_DATA.semester1, semester1Container);
    
    // 渲染第二学期课程
    renderCourseGroup(COURSE_DATA.semester2, semester2Container);
    
    // 渲染夏季学期课程
    renderCourseGroup(COURSE_DATA.summer, summerContainer);
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
    
    // 更新日历
    updateCalendar();
    
    // 更新统计信息
    updateStatistics();
    
    // 检查时间冲突
    checkAndDisplayConflicts();
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
    
    // 导出功能按钮
    document.getElementById('exportICS').addEventListener('click', function(e) {
        e.preventDefault();
        exportToICS();
    });
    
    document.getElementById('exportExcel').addEventListener('click', function(e) {
        e.preventDefault();
        exportToExcel();
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
        'exportExcelLabel': currentLanguage === 'zh' ? 'Excel表格 (.xlsx)' : 'Excel Spreadsheet (.xlsx)'
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
    
    // 更新日历
    updateCalendar();
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
    document.querySelectorAll('#monthView, #weekView, #dayView').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}

function updateStatistics() {
    const totalSelected = selectedCourses.length;
    const coreCount = selectedCourses.filter(c => c.type === 'core').length;
    const electiveCount = selectedCourses.filter(c => c.type === 'elective').length;
    const projectCount = selectedCourses.filter(c => c.type === 'project').length;
    
    document.getElementById('selectedCount').textContent = totalSelected;
    document.getElementById('coreCount').textContent = coreCount;
    document.getElementById('electiveCount').textContent = electiveCount + projectCount;
    
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
    
    let ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//HKU//Master of Finance in FinTech//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:HKU FinTech Master Schedule
X-WR-TIMEZONE:Asia/Hong_Kong
X-WR-CALDESC:香港大学金融科技硕士课程表
BEGIN:VTIMEZONE
TZID:Asia/Hong_Kong
BEGIN:STANDARD
DTSTART:20251101T030000
TZOFFSETFROM:+0800
TZOFFSETTO:+0800
TZNAME:HKT
END:STANDARD
END:VTIMEZONE
`;

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
        
        // Create unique UID
        const uid = `${event.id}@hku-fintech.edu.hk`;
        
        // Event description
        const description = `课程代码: ${event.extendedProps.course.code}\\n` +
                          `讲师: ${event.extendedProps.instructor}\\n` +
                          `地点: ${event.extendedProps.room}\\n` +
                          `校区: ${event.extendedProps.campus}`;
        
        ics += `BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtStamp}Z
ORGANIZER;CN=HKU Business School:MAILTO:noreply@hku.hk
DTSTART;TZID=Asia/Hong_Kong:${dtStart}
DTEND;TZID=Asia/Hong_Kong:${dtEnd}
SUMMARY:${event.title}
DESCRIPTION:${description}
LOCATION:${event.extendedProps.room}, ${event.extendedProps.campus}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT15M
DESCRIPTION:课程即将开始
ACTION:DISPLAY
END:VALARM
END:VEVENT
`;
    });
    
    ics += 'END:VCALENDAR';
    
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
        alert(currentLanguage === 'zh' ? 
              '日历文件导出成功！文件包含15分钟课前提醒。' : 
              'Calendar exported successfully! File includes 15-minute pre-class reminders.');
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
            
        const courseName = currentLanguage === 'zh' ? course.name : getCourseName(course, 'en');
        
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

console.log('📚 HKU 金融科技硕士课程日历应用加载完成!');
