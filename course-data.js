// 课程数据 - 基于time.json自动生成，包含完整的特殊时间安排
const COURSE_DATA = {
    // 第一学期课程
    semester1: [
        {
            code: "LLAW6093",
            name: "金融市场监管",
            section: "C班",
            type: "core",
            instructor: "Ms. Lea-Anne Lee",
            schedule: "周四 16:00-19:00",
            dates: ["2025-09-11", "2025-09-18", "2025-09-25", "2025-10-02", "2025-10-09", "2025-10-16", "2025-10-23", "2025-10-30", "2025-11-06", "2025-11-13", "2025-11-20"],
            campus: "MC",
            room: "CBC",
            special_arrangements: [
                {
                    date: "2025-10-30",
                    day: "Thursday",
                    time: "16:10-19:00",
                    venue: "CBC"
                },
                {
                    date: "2025-11-06",
                    day: "Thursday",
                    time: "16:10-19:00",
                    venue: "CBC"
                },
                {
                    date: "2025-11-13",
                    day: "Thursday",
                    time: "16:10-19:00",
                    venue: "CBC"
                }
            ]
        },
        {
            code: "LLAW6046",
            name: "隐私与数据保护",
            section: "A班",
            type: "elective",
            instructor: "Mr. Adam Au",
            schedule: "周三 19:00-22:00",
            dates: ["2025-09-10", "2025-09-17", "2025-09-24", "2025-10-08", "2025-10-15", "2025-10-22", "2025-11-05", "2025-11-12"],
            campus: "MC",
            room: "KK101",
            special_arrangements: []
        },
        {
            code: "FITE7409",
            name: "区块链与加密货币",
            section: "A班",
            type: "core",
            instructor: "Dr. KP Chow",
            schedule: "周一 & 周四 13:00-16:00",
            dates: ["2025-10-13", "2025-10-20", "2025-10-27", "2025-10-30", "2025-11-03", "2025-11-06", "2025-11-10", "2025-11-13", "2025-11-27"],
            campus: "MC",
            room: "Mon lectures: CPD-3.04, Thu lectures: MW-T2",
            special_arrangements: [
                {
                    date: "2025-10-30",
                    day: "Thursday",
                    time: "13:00-15:50",
                    venue: "MW-T2"
                },
                {
                    date: "2025-11-06",
                    day: "Thursday",
                    time: "13:00-15:50",
                    venue: "MW-T2"
                },
                {
                    date: "2025-11-13",
                    day: "Thursday",
                    time: "13:00-15:50",
                    venue: "MW-T2"
                }
            ]
        },
        {
            code: "DASC7606",
            name: "深度学习",
            section: "A班",
            type: "elective",
            instructor: "Prof. Francis Chin & Dr. Bethany Chan",
            schedule: "周四 13:00-16:00",
            dates: ["2025-09-04", "2025-09-11", "2025-09-18", "2025-09-25", "2025-10-02", "2025-10-09", "2025-10-23", "2025-10-30", "2025-11-06", "2025-11-13"],
            campus: "MC",
            room: "LE-1",
            special_arrangements: []
        },
        {
            code: "FITE7410",
            name: "金融欺诈分析",
            section: "A班",
            type: "elective",
            instructor: "Dr. Vivien Chan & Ms. Annie Chan",
            schedule: "周三 19:00-22:00",
            dates: ["2025-09-03", "2025-09-10", "2025-09-17", "2025-09-24", "2025-10-08", "2025-10-22", "2025-11-05", "2025-11-12", "2025-11-19", "2025-11-26"],
            campus: "MC",
            room: "LE-5",
            special_arrangements: []
        },
        {
            code: "MFIN6003",
            name: "衍生证券",
            section: "E班",
            type: "core",
            instructor: "Prof. Hongye Guo",
            schedule: "周二 & 周五 14:00-17:00",
            dates: ["2025-09-02", "2025-09-09", "2025-09-12", "2025-09-16", "2025-09-19", "2025-09-26", "2025-09-30", "2025-10-03"],
            campus: "CP",
            room: "Room ABC, LTB (Sep 27)",
            special_arrangements: [
                {
                    date: "2025-09-13",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                },
                {
                    date: "2025-09-27",
                    day: "Saturday",
                    time: "14:00-17:00",
                    venue: "LTB"
                }
            ]
        },
        {
            code: "MFIN6003",
            name: "衍生证券",
            section: "F班",
            type: "core",
            instructor: "Prof. Hongye Guo",
            schedule: "周二 & 周五 18:30-21:30",
            dates: ["2025-09-02", "2025-09-09", "2025-09-12", "2025-09-16", "2025-09-19", "2025-09-26", "2025-09-30", "2025-10-03"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: [
                {
                    date: "2025-09-17",
                    day: "Wednesday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                },
                {
                    date: "2025-09-27",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "LTB"
                }
            ]
        },
        {
            code: "MFIN7002",
            name: "投资分析与投资组合管理",
            section: "E班",
            type: "core",
            instructor: "Prof. Rujing Meng",
            schedule: "周一 & 周四 14:00-17:00",
            dates: ["2025-09-01", "2025-09-04", "2025-09-08", "2025-09-11", "2025-09-15", "2025-09-18", "2025-09-22", "2025-09-25", "2025-09-29", "2025-10-02"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7002",
            name: "投资分析与投资组合管理",
            section: "F班",
            type: "core",
            instructor: "Prof. Rujing Meng",
            schedule: "周一 & 周四 18:30-21:30",
            dates: ["2025-09-01", "2025-09-04", "2025-09-08", "2025-09-11", "2025-09-15", "2025-09-18", "2025-09-22", "2025-09-25", "2025-09-29", "2025-10-02"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7031",
            name: "金融科技及其对未来银行和金融的影响简介",
            section: "A班",
            type: "elective",
            instructor: "Prof. Fangzhou Lu",
            schedule: "周日 09:30-12:30 & 14:00-17:00",
            dates: ["2025-08-31", "2025-09-07", "2025-09-14", "2025-09-21", "2025-09-28"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7003",
            name: "金融数学技术",
            section: "E班",
            type: "core",
            instructor: "Dr. Jinghan Meng",
            schedule: "周二 & 周五 09:30-12:30",
            dates: ["2025-10-14", "2025-10-21", "2025-10-24", "2025-10-28", "2025-10-31", "2025-11-04", "2025-11-07", "2025-11-11"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: [
                {
                    date: "2025-10-13",
                    day: "Monday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                },
                {
                    date: "2025-11-10",
                    day: "Monday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                }
            ]
        },
        {
            code: "MFIN7003",
            name: "金融数学技术",
            section: "F班",
            type: "core",
            instructor: "Dr. Jinghan Meng",
            schedule: "周二 & 周五 14:00-17:00",
            dates: ["2025-10-14", "2025-10-21", "2025-10-24", "2025-10-28", "2025-10-31", "2025-11-04", "2025-11-07", "2025-11-11"],
            campus: "CP",
            room: "Room ABC, Room H (Oct 17), LTA (Nov 14)",
            special_arrangements: [
                {
                    date: "2025-10-17",
                    day: "Friday",
                    time: "18:30-21:30",
                    venue: "Room H"
                },
                {
                    date: "2025-11-14",
                    day: "Friday",
                    time: "18:30-21:30",
                    venue: "LTA"
                }
            ]
        },
        {
            code: "MFIN7033",
            name: "高级金融编程与数据库",
            section: "A班",
            type: "core",
            instructor: "Prof. Jiantao Huang",
            schedule: "周三 & 周六 14:00-17:00",
            dates: ["2025-10-15", "2025-10-22", "2025-11-05", "2025-11-12", "2025-11-19"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: [
                {
                    date: "2025-10-20",
                    day: "Monday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                },
                {
                    date: "2025-10-27",
                    day: "Monday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                },
                {
                    date: "2025-11-03",
                    day: "Monday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                },
                {
                    date: "2025-11-17",
                    day: "Monday",
                    time: "14:00-17:00 & 18:30-21:30",
                    venue: "Room ABC"
                }
            ]
        },
        {
            code: "MFIN7033",
            name: "高级金融编程与数据库",
            section: "B班",
            type: "core",
            instructor: "Prof. Jiantao Huang",
            schedule: "周三 & 周六 18:30-21:30",
            dates: ["2025-10-15", "2025-10-18", "2025-10-22", "2025-10-25", "2025-11-01", "2025-11-05", "2025-11-08", "2025-11-12", "2025-11-15", "2025-11-19"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        }
    ],

    // 第二学期课程
    semester2: [
        {
            code: "LLAW6093",
            name: "金融市场监管",
            section: "D班",
            type: "core",
            instructor: "Ms Lea-Anne Lee",
            schedule: "周五 14:00-17:00",
            dates: ["2026-01-30", "2026-02-06", "2026-02-13", "2026-02-20", "2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-10"],
            campus: "MC",
            room: "CPD-3.04",
            special_arrangements: []
        },
        {
            code: "LLAW6256",
            name: "反洗钱、反恐怖融资法及合规问题",
            section: "A班",
            type: "elective",
            instructor: "Dr John Lee",
            schedule: "周五 19:00-22:00",
            dates: ["2026-01-30", "2026-02-06", "2026-02-13", "2026-02-20", "2026-02-27", "2026-03-06", "2026-03-13", "2026-03-20", "2026-03-27", "2026-04-10"],
            campus: "MC",
            room: "CPD-2.16",
            special_arrangements: []
        },
        {
            code: "MFIN7036",
            name: "金融与金融科技中的文本分析与自然语言处理",
            section: "A班",
            type: "elective",
            instructor: "Prof. Matthias Buehlmaier",
            schedule: "周三 & 周六 09:30-12:30",
            dates: ["2025-12-10", "2025-12-20", "2026-01-03", "2026-01-07"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: [
                {
                    date: "2025-12-17",
                    day: "Wednesday",
                    time: "09:30-12:30 & 14:00-17:00",
                    venue: "Room ABC"
                },
                {
                    date: "2026-01-10",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                },
                {
                    date: "2026-01-14",
                    day: "Wednesday",
                    time: "09:30-12:30 & 14:00-17:00",
                    venue: "Room ABC & LTA"
                },
                {
                    date: "2026-01-17",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                }
            ]
        },
        {
            code: "MFIN7005",
            name: "公司金融与资产估值",
            section: "E班",
            type: "core",
            instructor: "Prof. Jack Xiaoyong Fu",
            schedule: "周二 & 周五 14:00-17:00",
            dates: ["2025-12-09", "2025-12-16", "2025-12-19", "2026-01-09", "2026-01-13", "2026-01-20"],
            campus: "CP",
            room: "Room ABC, Room J (Dec 20)",
            special_arrangements: [
                {
                    date: "2025-12-20",
                    day: "Saturday",
                    time: "14:00-17:00",
                    venue: "Room J"
                }
            ]
        },
        {
            code: "MFIN7005",
            name: "公司金融与资产估值",
            section: "F班",
            type: "core",
            instructor: "Prof. Jack Xiaoyong Fu",
            schedule: "周二 & 周五 18:30-21:30",
            dates: ["2025-12-09", "2025-12-12", "2025-12-16", "2025-12-19", "2026-01-09", "2026-01-13", "2026-01-16", "2026-01-20"],
            campus: "CP",
            room: "Room ABC, Room H (Dec 13 & 20)",
            special_arrangements: [
                {
                    date: "2025-12-13",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "Room H"
                },
                {
                    date: "2025-12-20",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "Room H"
                }
            ]
        },
        {
            code: "MFIN7002",
            name: "投资分析与投资组合管理",
            section: "G班",
            type: "core",
            instructor: "Prof. Rujing Meng",
            schedule: "周一 & 周四 18:30-21:30",
            dates: ["2025-12-08", "2025-12-11", "2025-12-15", "2025-12-18", "2026-01-05", "2026-01-08", "2026-01-12", "2026-01-15", "2026-01-19", "2026-01-22"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7054",
            name: "加密货币与数字资产导论",
            section: "A班",
            type: "elective",
            instructor: "Prof. Henri Arslanian",
            schedule: "周六 & 周日 Block Mode",
            dates: [],
            campus: "CP",
            room: "TBC",
            special_arrangements: []
        },
        {
            code: "MFIN7004",
            name: "金融服务法规",
            section: "A班",
            type: "elective",
            instructor: "Prof. Berry Hsu",
            schedule: "周二 & 周五 09:30-12:30",
            dates: ["2025-12-09", "2025-12-12", "2025-12-16", "2025-12-19", "2026-01-02", "2026-01-06", "2026-01-09", "2026-01-13", "2026-01-16", "2026-01-20"],
            campus: "CP & MC",
            room: "CP - Room H, MC - KK101 (Jan 16)",
            special_arrangements: [
                {
                    date: "2026-01-16",
                    day: "Friday",
                    time: "09:30-12:30",
                    venue: "MC - KK101"
                }
            ]
        },
        {
            code: "MFIN7004",
            name: "金融服务法规",
            section: "B班",
            type: "elective",
            instructor: "Prof. Berry Hsu",
            schedule: "周二 & 周五 14:00-17:00",
            dates: ["2025-12-09", "2025-12-12", "2025-12-16", "2025-12-19", "2026-01-02", "2026-01-06", "2026-01-09", "2026-01-13", "2026-01-16", "2026-01-20"],
            campus: "CP & MC",
            room: "CP - Room H, MC - KK101 (Jan 16)",
            special_arrangements: [
                {
                    date: "2026-01-16",
                    day: "Friday",
                    time: "14:00-17:00",
                    venue: "MC - KK101"
                }
            ]
        },
        {
            code: "MFIN7037",
            name: "量化交易",
            section: "A班",
            type: "core",
            instructor: "Prof. Alan Kwan, Prof. Yang You",
            schedule: "周一 & 周四 14:00-17:00",
            dates: ["2026-01-29", "2026-02-02", "2026-02-05", "2026-02-09", "2026-02-12", "2026-02-23", "2026-02-26", "2026-03-02", "2026-03-05", "2026-03-09"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7037",
            name: "量化交易",
            section: "B班",
            type: "core",
            instructor: "Prof. Alan Kwan, Prof. Yang You",
            schedule: "周一 & 周四 18:30-21:30",
            dates: ["2026-01-29", "2026-02-02", "2026-02-05", "2026-02-09", "2026-02-12", "2026-02-23", "2026-02-26", "2026-03-02", "2026-03-05", "2026-03-09"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7034",
            name: "金融中的机器学习与人工智能",
            section: "A班",
            type: "core",
            instructor: "Prof. Ye Luo",
            schedule: "周二 & 周五 14:00-17:00",
            dates: ["2026-01-30", "2026-02-03", "2026-02-06", "2026-02-10", "2026-02-13", "2026-02-24", "2026-02-27", "2026-03-03", "2026-03-06", "2026-03-10"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7034",
            name: "金融中的机器学习与人工智能",
            section: "B班",
            type: "core",
            instructor: "Prof. Ye Luo",
            schedule: "周二 & 周五 18:30-21:30",
            dates: ["2026-01-30", "2026-02-03", "2026-02-06", "2026-02-10", "2026-02-13", "2026-02-24", "2026-02-27", "2026-03-03", "2026-03-06", "2026-03-10"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7060",
            name: "金融科技网络安全与风险管理",
            section: "A班",
            type: "elective",
            instructor: "Prof. Alan Chow",
            schedule: "周三 & 周六 14:00-17:00",
            dates: ["2026-03-21", "2026-04-01", "2026-04-08", "2026-04-15", "2026-04-22"],
            campus: "CP",
            room: "LTA",
            special_arrangements: [
                {
                    date: "2026-03-25",
                    day: "Wednesday",
                    time: "14:00-17:00",
                    venue: "Room EFG"
                },
                {
                    date: "2026-03-28",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "LTA"
                },
                {
                    date: "2026-04-11",
                    day: "Saturday",
                    time: "14:00-17:00",
                    venue: "Room EFG"
                },
                {
                    date: "2026-04-18",
                    day: "Saturday",
                    time: "18:30-21:30",
                    venue: "LTA"
                },
                {
                    date: "2026-04-25",
                    day: "Saturday",
                    time: "14:00-17:00",
                    venue: "Room 205-1&2"
                }
            ]
        },
        {
            code: "MFIN7035",
            name: "金融大数据",
            section: "A班",
            type: "project",
            instructor: "Prof. Alan Kwan",
            schedule: "周一 & 周四 14:00-17:00",
            dates: ["2026-03-19", "2026-03-23", "2026-03-26", "2026-03-30", "2026-04-02", "2026-04-09", "2026-04-13", "2026-04-20", "2026-04-23"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: [
                {
                    date: "2026-04-15",
                    day: "Wednesday",
                    time: "18:30-21:30",
                    venue: "Room ABC"
                }
            ]
        },
        {
            code: "MFIN7035",
            name: "金融大数据",
            section: "B班",
            type: "project",
            instructor: "Prof. Alan Kwan",
            schedule: "周一 & 周四 18:30-21:30",
            dates: ["2026-03-19", "2026-03-23", "2026-03-26", "2026-03-30", "2026-04-02", "2026-04-09", "2026-04-13", "2026-04-16", "2026-04-20", "2026-04-23"],
            campus: "CP",
            room: "Room ABC",
            special_arrangements: []
        },
        {
            code: "MFIN7016",
            name: "实物期权与动态公司金融",
            section: "A班",
            type: "elective",
            instructor: "Prof. Keith K. P. Wong",
            schedule: "周二 & 周五 18:30-21:30",
            dates: ["2026-03-20", "2026-03-24", "2026-03-27", "2026-03-31", "2026-04-07", "2026-04-10", "2026-04-14", "2026-04-17", "2026-04-21", "2026-04-24"],
            campus: "CP",
            room: "Room D",
            special_arrangements: []
        },
        {
            code: "MFIN7049",
            name: "货币、金融机构与市场",
            section: "A班",
            type: "elective",
            instructor: "Prof. Xuewen Liu",
            schedule: "周一 & 周四 18:30-21:30",
            dates: ["2026-03-19", "2026-03-23", "2026-03-26", "2026-03-30", "2026-04-02", "2026-04-09", "2026-04-13", "2026-04-16", "2026-04-20", "2026-04-23"],
            campus: "CP",
            room: "Room H",
            special_arrangements: []
        },
        {
            code: "MFIN7052",
            name: "绿色金融与ESG",
            section: "A班",
            type: "elective",
            instructor: "Prof. Dragon Yongjun Tang",
            schedule: "周二 & 周五 09:30-12:30",
            dates: ["2026-03-20", "2026-03-24", "2026-03-27", "2026-03-31", "2026-04-07", "2026-04-10", "2026-04-14", "2026-04-17", "2026-04-21", "2026-04-24"],
            campus: "CP",
            room: "Room H",
            special_arrangements: []
        }
    ],

    // 夏季学期课程
    summer: [
        {
            code: "MFIN7013",
            name: "商业银行与房地产金融研讨会",
            section: "A班",
            type: "elective",
            instructor: "Prof. Berry Hsu & Dr. Maurice K.S. Tse",
            schedule: "周二 & 周五 09:30-12:30",
            dates: ["2026-05-05", "2026-05-08", "2026-05-12", "2026-05-15", "2026-05-19", "2026-05-22", "2026-05-26", "2026-05-29", "2026-06-02", "2026-06-05"],
            campus: "CP",
            room: "Room H",
            special_arrangements: []
        },
        {
            code: "MFIN7014",
            name: "基金管理与另类投资",
            section: "A班",
            type: "elective",
            instructor: "Prof. Fangzhou Lu",
            schedule: "周一 & 周四 18:30-21:30",
            dates: ["2026-05-04", "2026-05-07", "2026-05-11", "2026-05-14", "2026-05-18", "2026-05-21", "2026-05-28", "2026-06-01", "2026-06-04", "2026-06-08"],
            campus: "CP",
            room: "Room H",
            special_arrangements: []
        },
        {
            code: "MFIN7014",
            name: "基金管理与另类投资",
            section: "B班",
            type: "elective",
            instructor: "Prof. Fangzhou Lu",
            schedule: "周二 & 周五 18:30-21:30",
            dates: ["2026-05-05", "2026-05-08", "2026-05-12", "2026-05-15", "2026-05-19", "2026-05-22", "2026-05-26", "2026-05-29", "2026-06-02", "2026-06-05"],
            campus: "CP",
            room: "Room H",
            special_arrangements: []
        }
    ]

};



// 豁免课程配置
const EXEMPTION_COURSES = {
    fundamental: [
        { code: "MFIN7002", name: "投资分析与投资组合管理", nameEn: "Investment Analysis and Portfolio Management" },
        { code: "MFIN7005", name: "公司金融与资产估值", nameEn: "Corporate Finance and Asset Valuation" }
    ],
    advanced: [
        { code: "MFIN6003", name: "衍生证券", nameEn: "Derivative Securities" },
        { code: "MFIN7003", name: "金融数学技术", nameEn: "Mathematical Techniques in Finance" },
        { code: "MFIN7033", name: "高级金融编程与数据库", nameEn: "Advanced Financial Programming and Databases" }
    ]
};

// 课程英文翻译
const COURSE_TRANSLATIONS = {
    "LLAW6093": { name: "金融市场监管", nameEn: "Financial Market Regulation" },
    "LLAW6046": { name: "隐私与数据保护", nameEn: "Privacy and Data Protection" },
    "FITE7409": { name: "区块链与加密货币", nameEn: "Blockchain and Cryptocurrency" },
    "DASC7606": { name: "深度学习", nameEn: "Deep Learning" },
    "FITE7410": { name: "金融欺诈分析", nameEn: "Financial Fraud Analytics" },
    "MFIN6003": { name: "衍生证券", nameEn: "Derivative Securities" },
    "MFIN7002": { name: "投资分析与投资组合管理", nameEn: "Investment Analysis and Portfolio Management" },
    "MFIN7031": { name: "金融科技及其对未来银行和金融的影响简介", nameEn: "Introduction to FinTech and Its Impact on the Future of Banking and Finance" },
    "MFIN7003": { name: "金融数学技术", nameEn: "Mathematical Techniques in Finance" },
    "MFIN7033": { name: "高级金融编程与数据库", nameEn: "Advanced Financial Programming and Databases" },
    "LLAW6256": { name: "反洗钱、反恐怖融资法及合规问题", nameEn: "Anti-Money Laundering, Counter-Terrorist Financing Law and Compliance Issues" },
    "MFIN7036": { name: "金融与金融科技中的文本分析与自然语言处理", nameEn: "Text Analytics and Natural Language Processing in Finance and FinTech" },
    "MFIN7005": { name: "公司金融与资产估值", nameEn: "Corporate Finance and Asset Valuation" },
    "MFIN7054": { name: "加密货币与数字资产导论", nameEn: "Introduction to Cryptocurrencies and Digital Assets" },
    "MFIN7004": { name: "金融服务法规", nameEn: "Financial Services Regulation" },
    "MFIN7037": { name: "量化交易", nameEn: "Quantitative Trading" },
    "MFIN7034": { name: "金融中的机器学习与人工智能", nameEn: "Machine Learning and Artificial Intelligence in Finance" },
    "MFIN7060": { name: "金融科技网络安全与风险管理", nameEn: "FinTech Cybersecurity and Risk Management" },
    "MFIN7035": { name: "金融大数据", nameEn: "Financial Big Data" },
    "MFIN7016": { name: "实物期权与动态公司金融", nameEn: "Real Options and Dynamic Corporate Finance" },
    "MFIN7049": { name: "货币、金融机构与市场", nameEn: "Money, Financial Institutions and Markets" },
    "MFIN7052": { name: "绿色金融与ESG", nameEn: "Green Finance and ESG" },
    "MFIN7013": { name: "商业银行与房地产金融研讨会", nameEn: "Commercial Banking and Real Estate Finance Seminar" },
    "MFIN7014": { name: "基金管理与另类投资", nameEn: "Fund Management and Alternative Investments" }
};

// 课程颜色配置 - 为每个课程分配独特颜色，便于区分
const COURSE_COLORS = {
    // 核心课程 - 红色系渐变
    "LLAW6093": "#dc3545", // 金融市场监管 - 深红
    "FITE7409": "#e74c3c", // 区块链与加密货币 - 鲜红  
    "MFIN6003": "#c0392b", // 衍生证券 - 暗红
    "MFIN7002": "#d63384", // 投资分析与投资组合管理 - 玫红
    "MFIN7031": "#e83e8c", // 金融科技简介 - 粉红
    "MFIN7033": "#fd7e14", // 高级金融编程 - 橙红
    "MFIN7005": "#ff6b6b", // 公司金融与资产估值 - 浅红
    "MFIN7037": "#d32f2f", // 量化交易 - 材料红
    "MFIN7034": "#f44336", // 机器学习与AI - Android红
    
    // 选修课程 - 多彩系列，便于区分
    "LLAW6046": "#28a745", // 隐私与数据保护 - 绿色
    "DASC7606": "#17a2b8", // 深度学习 - 青色
    "FITE7410": "#6610f2", // 金融欺诈分析 - 紫色
    "MFIN7003": "#6c757d", // 金融数学技术 - 灰色
    "LLAW6256": "#007bff", // 反洗钱法 - 蓝色
    "MFIN7036": "#20c997", // 文本分析与NLP - 湖蓝
    "MFIN7054": "#ffc107", // 加密货币导论 - 黄色
    "MFIN7004": "#795548", // 金融服务法规 - 棕色
    "MFIN7060": "#9c27b0", // 网络安全 - 品红
    "MFIN7016": "#607d8b", // 实物期权 - 蓝灰
    "MFIN7049": "#4caf50", // 货币与金融机构 - 材料绿
    "MFIN7052": "#009688", // 绿色金融 - 鸭绿
    "MFIN7013": "#3f51b5", // 商业银行 - 靛蓝
    "MFIN7014": "#ff9800", // 基金管理 - 橙色
    
    // 毕业项目 - 橙色系
    "MFIN7035": "#ff5722"  // 金融大数据 - 深橙
};

// 课程类型配置
const COURSE_TYPES = {
    core: {
        name: "核心课程",
        nameEn: "Core Course",
        color: "#dc3545",
        priority: 1
    },
    elective: {
        name: "选修课程", 
        nameEn: "Elective Course",
        color: "#28a745",
        priority: 2
    },
    project: {
        name: "毕业项目",
        nameEn: "Capstone Project",
        color: "#fd7e14", 
        priority: 1
    }
};

// 应用状态变量将在app.js中声明

// 校区信息
const CAMPUS_INFO = {
    CP: "数码港 (Cyberport)",
    MC: "主校区 (Main Campus)",
    CPD: "百周年校园赛马会教学楼",
    KK: "梁銶琚楼",
    CBC: "周亦卿楼",
    LE: "图书馆新翼",
    MW: "孟华综合大楼"
};

// 工具函数
function getAllCourses() {
    const allCourses = [
        ...COURSE_DATA.semester1,
        ...COURSE_DATA.semester2,
        ...COURSE_DATA.summer
    ];
    
    // 为每个课程分配独特颜色
    allCourses.forEach(course => {
        course.color = COURSE_COLORS[course.code] || COURSE_TYPES[course.type].color;
    });
    
    return allCourses;
}

function getCourseById(courseId) {
    const allCourses = getAllCourses();
    return allCourses.find(course => 
        `${course.code}-${course.section}` === courseId
    );
}

function getCourseName(course, language = currentLanguage) {
    if (language === 'en' && COURSE_TRANSLATIONS[course.code]) {
        return COURSE_TRANSLATIONS[course.code].nameEn;
    }
    return course.name;
}

function getCourseTypeName(type, language = currentLanguage) {
    if (language === 'en') {
        return COURSE_TYPES[type].nameEn;
    }
    return COURSE_TYPES[type].name;
}

function isExemptedCourse(courseCode) {
    return exemptedCourses.has(courseCode);
}

function updateElectiveCount() {
    availableElectives = 2 + exemptedCourses.size;
}

function parseScheduleTime(schedule) {
    // 解析上课时间，例如 "周一 & 周四 14:00-17:00" 或 "周四 16:00-19:00"
    const timePattern = /(\d{2}:\d{2})-(\d{2}:\d{2})/;
    const timeMatch = schedule.match(timePattern);
    
    if (!timeMatch) return null;
    
    const startTime = timeMatch[1];
    const endTime = timeMatch[2];
    
    // 解析星期几
    const days = [];
    if (schedule.includes('周一')) days.push(1);
    if (schedule.includes('周二')) days.push(2);
    if (schedule.includes('周三')) days.push(3);
    if (schedule.includes('周四')) days.push(4);
    if (schedule.includes('周五')) days.push(5);
    if (schedule.includes('周六')) days.push(6);
    if (schedule.includes('周日')) days.push(0);
    
    return {
        days,
        startTime,
        endTime
    };
}

function parseAllTimeRanges(schedule) {
    // 解析包含多个时间段的课程表，例如 "周日 09:30-12:30 & 14:00-17:00"
    const timeRanges = [];
    const timePattern = /(\d{2}:\d{2})-(\d{2}:\d{2})/g;
    let match;
    
    while ((match = timePattern.exec(schedule)) !== null) {
        timeRanges.push({
            startTime: match[1],
            endTime: match[2]
        });
    }
    
    // 如果没有找到时间范围，返回空数组
    return timeRanges.length > 0 ? timeRanges : [];
}

function generateCalendarEvents(selectedCourses, showAllMode = false) {
    const events = [];
    const conflictGroups = detectTimeConflicts(selectedCourses);
    
    selectedCourses.forEach(course => {
        const scheduleInfo = parseScheduleTime(course.schedule);
        if (!scheduleInfo) return;
        
        const courseId = `${course.code}-${course.section}`;
        const isConflicted = conflictGroups.some(group => 
            group.some(conflictCourse => 
                `${conflictCourse.code}-${conflictCourse.section}` === courseId
            )
        );
        
        const courseName = getCourseName(course, currentLanguage);
        
        // 处理常规日期和时间 - 修改以支持多个时间段
        course.dates.forEach(dateStr => {
            const date = new Date(dateStr);
            const dayOfWeek = date.getDay();
            
            scheduleInfo.days.forEach(expectedDay => {
                if (dayOfWeek === expectedDay) {
                    // 检查是否包含多个时间段（例如 "09:30-12:30 & 14:00-17:00"）
                    const timeRanges = parseAllTimeRanges(course.schedule);
                    
                    timeRanges.forEach((timeRange, index) => {
                        const startDateTime = dateStr + 'T' + timeRange.startTime + ':00';
                        const endDateTime = dateStr + 'T' + timeRange.endTime + ':00';
                        
                        events.push({
                            id: `${courseId}-${dateStr}-${expectedDay}${timeRanges.length > 1 ? `-${index}` : ''}`,
                            title: `${courseName} (${course.section})${timeRanges.length > 1 ? ` - 第${index + 1}节` : ''}`,
                            start: startDateTime,
                            end: endDateTime,
                            backgroundColor: isConflicted ? '#6f42c1' : course.color,
                            borderColor: isConflicted ? '#6f42c1' : course.color,
                            textColor: 'white',
                            extendedProps: {
                                course: course,
                                courseId: courseId,
                                instructor: course.instructor,
                                room: course.room,
                                campus: course.campus,
                                type: course.type,
                                isConflicted: isConflicted,
                                courseName: courseName,
                                courseNameEn: getCourseName(course, 'en'),
                                courseNameZh: getCourseName(course, 'zh'),
                                isSpecialArrangement: false
                            },
                            classNames: [
                                `${course.type}-course`,
                                isConflicted ? 'conflict-course' : ''
                            ].filter(Boolean)
                        });
                    });
                }
            });
        });

        // 处理特殊时间安排
        if (course.special_arrangements && course.special_arrangements.length > 0) {
            course.special_arrangements.forEach(arrangement => {
                const timePattern = /(\d{2}:\d{2})-(\d{2}:\d{2})/;
                const timeMatch = arrangement.time.match(timePattern);
                
                if (timeMatch) {
                    const startTime = timeMatch[1];
                    const endTime = timeMatch[2];
                    const startDateTime = arrangement.date + 'T' + startTime + ':00';
                    const endDateTime = arrangement.date + 'T' + endTime + ':00';
                    
                    events.push({
                        id: `${courseId}-${arrangement.date}-special`,
                        title: `${courseName} (${course.section}) - 特殊安排`,
                        start: startDateTime,
                        end: endDateTime,
                        backgroundColor: '#ff9800', // 橙色表示特殊安排
                        borderColor: '#ff9800',
                        textColor: 'white',
                        extendedProps: {
                            course: course,
                            courseId: courseId,
                            instructor: course.instructor,
                            room: arrangement.venue,
                            campus: course.campus,
                            type: course.type,
                            isConflicted: false, // 特殊安排一般不检查冲突
                            courseName: courseName,
                            courseNameEn: getCourseName(course, 'en'),
                            courseNameZh: getCourseName(course, 'zh'),
                            isSpecialArrangement: true,
                            specialArrangementDetails: arrangement
                        },
                        classNames: [
                            `${course.type}-course`,
                            'special-arrangement'
                        ]
                    });
                } else if (arrangement.time.includes('&')) {
                    // 处理包含多个时间段的特殊安排，如 "09:30-12:30 & 14:00-17:00"
                    const timeParts = arrangement.time.split(' & ');
                    timeParts.forEach((timePart, index) => {
                        const timeMatch = timePart.trim().match(timePattern);
                        if (timeMatch) {
                            const startTime = timeMatch[1];
                            const endTime = timeMatch[2];
                            const startDateTime = arrangement.date + 'T' + startTime + ':00';
                            const endDateTime = arrangement.date + 'T' + endTime + ':00';
                            
                            events.push({
                                id: `${courseId}-${arrangement.date}-special-${index}`,
                                title: `${courseName} (${course.section}) - 特殊安排${index + 1}`,
                                start: startDateTime,
                                end: endDateTime,
                                backgroundColor: '#ff9800',
                                borderColor: '#ff9800',
                                textColor: 'white',
                                extendedProps: {
                                    course: course,
                                    courseId: courseId,
                                    instructor: course.instructor,
                                    room: arrangement.venue,
                                    campus: course.campus,
                                    type: course.type,
                                    isConflicted: false,
                                    courseName: courseName,
                                    courseNameEn: getCourseName(course, 'en'),
                                    courseNameZh: getCourseName(course, 'zh'),
                                    isSpecialArrangement: true,
                                    specialArrangementDetails: arrangement
                                },
                                classNames: [
                                    `${course.type}-course`,
                                    'special-arrangement'
                                ]
                            });
                        }
                    });
                }
            });
        }
    });
    
    return events;
}

function detectTimeConflicts(courses) {
    const conflicts = [];
    
    for (let i = 0; i < courses.length; i++) {
        for (let j = i + 1; j < courses.length; j++) {
            const course1 = courses[i];
            const course2 = courses[j];
            
            if (hasTimeConflict(course1, course2)) {
                // 查找是否已存在包含这两个课程的冲突组
                let conflictGroup = conflicts.find(group => 
                    group.includes(course1) || group.includes(course2)
                );
                
                if (conflictGroup) {
                    // 添加到现有组
                    if (!conflictGroup.includes(course1)) conflictGroup.push(course1);
                    if (!conflictGroup.includes(course2)) conflictGroup.push(course2);
                } else {
                    // 创建新的冲突组
                    conflicts.push([course1, course2]);
                }
            }
        }
    }
    
    return conflicts;
}

function hasTimeConflict(course1, course2) {
    const schedule1 = parseScheduleTime(course1.schedule);
    const schedule2 = parseScheduleTime(course2.schedule);
    
    if (!schedule1 || !schedule2) return false;
    
    // 检查是否有相同的上课日期
    const commonDates = course1.dates.filter(date => course2.dates.includes(date));
    if (commonDates.length === 0) return false;
    
    // 检查是否有相同的星期几
    const commonDays = schedule1.days.filter(day => schedule2.days.includes(day));
    if (commonDays.length === 0) return false;
    
    // 检查时间是否重叠
    const start1 = parseTime(schedule1.startTime);
    const end1 = parseTime(schedule1.endTime);
    const start2 = parseTime(schedule2.startTime);
    const end2 = parseTime(schedule2.endTime);
    
    return !(end1 <= start2 || end2 <= start1);
}

function parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// 导出数据和函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COURSE_DATA,
        COURSE_TYPES,
        CAMPUS_INFO,
        EXEMPTION_COURSES,
        COURSE_TRANSLATIONS,
        COURSE_COLORS,
        getAllCourses,
        getCourseById,
        getCourseName,
        getCourseTypeName,
        isExemptedCourse,
        updateElectiveCount,
        parseScheduleTime,
        parseAllTimeRanges,
        generateCalendarEvents,
        detectTimeConflicts,
        hasTimeConflict
    };
}
