import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import { supabase } from './supabase';

const Icon = ({ name, size = 20, stroke = 1.9 }) => {
  const paths = {
    home: <><path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.8 2.1 2.1-4.9z"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 3 3 5-7"/></>,
    flask: <><path d="M9 3h6"/><path d="M10 3v5l-5 9a3 3 0 0 0 2.6 4h8.8a3 3 0 0 0 2.6-4l-5-9V3"/><path d="M7 15h10"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    play: <><path d="m8 5 11 7-11 7z"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    spark: <><path d="m12 3-1.4 5.6L5 10l5.6 1.4L12 17l1.4-5.6L19 10l-5.6-1.4z"/><path d="m19 17-.5 2-.5-2-2-.5 2-.5.5-2 .5 2 2 .5z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20.3h-3v-.1A1.7 1.7 0 0 0 10.7 18.64a1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.06 15a1.7 1.7 0 0 0-1.56-1.03H5.4v-3h.1A1.7 1.7 0 0 0 7.06 9.94 1.7 1.7 0 0 0 6.72 8.06l-.06-.06 2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.73 4.7v-.1h3v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.1v3h-.1A1.7 1.7 0 0 0 19.4 15z"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const nav = [
  ['首页', 'home'], ['职业测评', 'compass'], ['成长计划', 'chart'], ['模拟训练', 'flask'], ['我的报告', 'file']
];

const dailyEncouragements = [
  '今天多完成一个小任务，离理想实习就更近一步。',
  '不必一次做到完美，先让项目稳定地向前走。',
  '代码会留下痕迹，持续学习也会成为你的底气。',
  '把目标拆小，认真完成今天这一格就很好。',
  '每一次排错，都是在为真正的项目经验加分。',
  '先行动，再优化；你的作品会替你说话。',
  '保持节奏，慢一点没关系，别停在原地。',
];

const tasks = [
  { title: '了解 Java 后端开发岗位', meta: '30 分钟 · 建议周一完成', tone: 'blue' },
  { title: '完成 MySQL 表设计练习', meta: '45 分钟 · 建议周二完成', tone: 'green' },
  { title: '搭建 Spring Boot 项目骨架', meta: '60 分钟 · 建议周四完成', tone: 'gold' },
  { title: '职业画像复盘与调整', meta: '20 分钟 · 建议周日完成', tone: 'purple' },
];

const scenarios = [
  { title: 'AI 辅助办公', text: '处理会议纪要与任务拆分，练习把模糊需求转化为清晰行动。', prompt: '你刚结束一次需求沟通会。请把“优化学生学习计划页面、下周演示、需要产品确认字段”整理成一条可执行的任务消息：包含任务、负责人、截止时间和待确认事项。', tag: '推荐', color: 'blue', icon: 'spark' },
  { title: '远程协作', text: '模拟项目延期沟通，学习同步进度、说明风险与请求支持。', prompt: '你的登录模块因数据库连接问题预计延期 1 天，但本周仍需完成核心功能。请向远程团队同步当前进度、延期风险、调整方案，并明确希望谁提供什么支持。', tag: '进阶', color: 'green', icon: 'calendar' },
  { title: '跨岗位沟通', text: '在产品、技术与运营之间澄清需求，推动团队达成共识。', prompt: '产品同学说“学习计划页要更智能”，运营同学希望“能看到完成率”。请你提出 3 个需要澄清的问题，并给出一个可先落地的最小功能方案。', tag: '实战', color: 'purple', icon: 'chart' },
];

const assessmentQuestions = [
  ['technical', '你对 Java 面向对象、集合和异常处理的掌握程度？', ['能看懂基础示例', '能独立完成练习', '能在项目中灵活使用']],
  ['technical', '面对一个新的 Java API，你通常如何学习？', ['跟着示例照着写', '读文档后完成练习', '写最小示例并总结边界情况']],
  ['technical', '你目前的 SQL 能力更接近哪种状态？', ['会基础查询', '能写多表查询和分组统计', '能设计表结构并考虑索引']],
  ['technical', 'Spring Boot 项目经验如何？', ['还在学习基础概念', '能搭建项目并写简单接口', '能完成登录、校验和异常处理']],
  ['technical', '当系统出现性能问题时，你更愿意？', ['先保证功能能跑', '查看日志和 SQL 执行情况', '分析瓶颈并提出优化方案']],
  ['delivery', '接到一个小需求后，你通常会？', ['马上开始写代码', '先拆分页面、接口和数据表', '先确认验收标准再制定计划']],
  ['delivery', '你完成项目练习的方式更接近？', ['完成课程要求即可', '会补充自己的功能', '会准备演示、文档和复盘']],
  ['delivery', '遇到计划延迟时，你会？', ['先自己继续赶进度', '调整任务顺序', '说明风险、原因和新的完成时间']],
  ['delivery', '你如何验证一个功能已经完成？', ['页面能打开就行', '手动覆盖主要流程', '补充边界场景并记录测试结果']],
  ['delivery', '对代码版本管理的熟悉程度？', ['知道 Git 的基本概念', '会提交、拉取和解决简单冲突', '能用分支协作并写清晰提交信息']],
  ['collaboration', '团队讨论需求时，你通常？', ['先听别人安排', '会确认自己负责的部分', '会追问目标、边界和验收标准']],
  ['collaboration', '当你不同意某个方案时，你会？', ['先不表达意见', '说出自己的想法', '给出依据和可执行的替代方案']],
  ['collaboration', '你会怎样汇报学习或开发进度？', ['完成后再说', '定期说明完成情况', '同步进度、风险、下一步和所需支持']],
  ['collaboration', '跨岗位沟通时，你最重视？', ['尽快拿到结论', '把自己的技术方案讲清楚', '用对方能理解的方式对齐目标']],
  ['collaboration', '收到反馈后，你通常？', ['先解释自己的想法', '记录并选择能改的部分', '确认理解后快速迭代并回传结果']],
  ['growth', '每周你能稳定投入多少时间提升技能？', ['3 小时以内', '3–8 小时', '8 小时以上且有固定安排']],
  ['growth', '学习完一个知识点后，你会？', ['继续看下一个知识点', '做几道练习巩固', '放到项目里并写复盘笔记']],
  ['growth', '你准备实习时，最想优先完成什么？', ['继续补基础课程', '完成一个小项目', '完成可演示项目并开始投递']],
  ['growth', '当学习动力下降时，你更可能？', ['暂停一段时间', '找课程或同学带着学', '拆小目标并用成果激励自己']],
  ['growth', '你对职业方向的规划？', ['还在探索', '大致想做后端或 AI 应用', '有明确岗位、项目和投递时间表']],
  ['ai', '你使用 AI 工具辅助学习的频率？', ['偶尔问概念', '会用它解释报错和生成示例', '会验证输出并融入自己的工作流']],
  ['ai', '你如何看待 AI 生成的代码？', ['能运行就直接使用', '会阅读后再使用', '会测试、改造并确认安全性']],
  ['ai', '你最希望 AI 帮助解决什么问题？', ['解释知识点', '辅助编码和排错', '分析需求、生成方案并辅助复盘']],
  ['ai', '面对 AI 的回答不确定时，你会？', ['相信它的结论', '再问一次确认', '查文档、运行验证并保留证据']],
  ['ai', '你希望在项目中怎样使用 AI？', ['写一些简单文案', '辅助完成局部功能', '设计智能体能力并解决真实业务问题']],
].map(([dimension, question, options]) => ({ dimension, question, options }));

const careerProfiles = [
  { name: 'Java 后端开发实习生', intro: '适合以 Java、MySQL、Spring Boot 和接口开发为主线积累项目经验。', weights: { technical: .38, delivery: .26, collaboration: .12, growth: .16, ai: .08 } },
  { name: 'AI 应用开发实习生', intro: '适合将 Java / Python 基础与大模型、智能体、业务场景结合。', weights: { technical: .23, delivery: .20, collaboration: .15, growth: .17, ai: .25 } },
  { name: '数据与业务系统开发实习生', intro: '适合从数据库设计、数据处理和业务系统功能交付切入。', weights: { technical: .28, delivery: .28, collaboration: .18, growth: .16, ai: .10 } },
];

const defaultFuturePlan = [
  { id: 'p1', week: '第 1 周', title: '搭建 Spring Boot 项目骨架', goal: '完成项目分层、3 个基础接口和 Git 仓库初始化。' },
  { id: 'p2', week: '第 2 周', title: '接入 MySQL 与登录功能', goal: '完成用户表、登录注册接口和基础权限校验。' },
  { id: 'p3', week: '第 3 周', title: '完成任务管理核心流程', goal: '完成任务新增、编辑、状态流转和接口测试。' },
  { id: 'p4', week: '第 4 周', title: '整理项目演示与实习投递材料', goal: '录制演示视频，完善 README 和简历项目描述。' },
];

const defaultWeeklyCheckins = [false, false, false, false, false, false, false];

function getWeekKey() {
  const date = new Date();
  const mondayOffset = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - mondayOffset);
  return date.toISOString().slice(0, 10);
}

function readCheckinState(email) {
  try {
    const saved = JSON.parse(localStorage.getItem(`zhihang-ai-checkins-${email}`) || 'null');
    const makeupCards = Math.min(5, Math.max(0, saved?.makeupCards || 0));
    if (saved?.weekKey === getWeekKey() && Array.isArray(saved.checkins) && saved.checkins.length === 7) return { ...saved, makeupCards };
    return { weekKey: getWeekKey(), checkins: defaultWeeklyCheckins, makeupCards, rewardGranted: false };
  } catch {
    return { weekKey: getWeekKey(), checkins: defaultWeeklyCheckins, makeupCards: 0, rewardGranted: false };
  }
}

function calculateAssessment(answers) {
  const totals = { technical: 0, delivery: 0, collaboration: 0, growth: 0, ai: 0 };
  const counts = { technical: 0, delivery: 0, collaboration: 0, growth: 0, ai: 0 };
  assessmentQuestions.forEach((item, index) => { totals[item.dimension] += (answers[index] ?? 0) + 1; counts[item.dimension] += 1; });
  const dimensions = Object.fromEntries(Object.keys(totals).map((key) => [key, Math.round(40 + ((totals[key] - counts[key]) / (counts[key] * 2)) * 60)]));
  const scored = careerProfiles.map((profile) => ({ ...profile, score: Math.round(Object.entries(profile.weights).reduce((sum, [key, weight]) => sum + dimensions[key] * weight, 0)) })).sort((a, b) => b.score - a.score);
  const overall = Math.round(dimensions.technical * .30 + dimensions.delivery * .25 + dimensions.collaboration * .20 + dimensions.growth * .15 + dimensions.ai * .10);
  return { overall, dimensions, primaryCareer: scored[0], alternatives: scored.slice(1) };
}

function evaluateTrainingResponse(response) {
  const text = response.trim();
  if (!text) return { score: 0, level: '未完成', lengthScore: 0, clarityScore: 0, collaborationScore: 0, actionScore: 0, advice: '请先写出你的回复，再提交训练。建议至少说明：当前进度、下一步动作、负责人或完成时间。' };
  const keywordScore = (keywords, fullScore) => Math.min(fullScore, keywords.filter((keyword) => text.includes(keyword)).length * Math.ceil(fullScore / 3));
  const lengthScore = text.length >= 100 ? 30 : text.length >= 60 ? 24 : text.length >= 30 ? 16 : 8;
  const clarityScore = keywordScore(['任务', '时间', '今天', '明天', '本周', '截止', '计划'], 25);
  const collaborationScore = keywordScore(['同步', '沟通', '确认', '协作', '支持', '负责人'], 25);
  const actionScore = keywordScore(['风险', '优先级', '调整', '完成', '方案', '验收'], 20);
  const score = Math.min(100, lengthScore + clarityScore + collaborationScore + actionScore);
  const level = score >= 80 ? '优秀' : score >= 60 ? '良好' : score >= 40 ? '待提升' : '未达标';
  const missing = [clarityScore < 15 && '明确时间或计划', collaborationScore < 15 && '说明沟通对象、负责人或所需支持', actionScore < 12 && '补充风险、优先级或可执行方案'].filter(Boolean);
  return { score, level, lengthScore, clarityScore, collaborationScore, actionScore, advice: missing.length ? `下一次建议重点补充：${missing.join('；')}。` : '表达完整，下一次可尝试把任务拆成更具体的时间节点。' };
}

function GrowthPlanPanel({ complete, futurePlan, onPlanChange, onBackHome, checkins, makeupCards, onCheckinToggle }) {
  const [newTask, setNewTask] = useState('');
  const update = (id, key, value) => onPlanChange(futurePlan.map((item) => item.id === id ? { ...item, [key]: value } : item));
  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;
    onPlanChange([...futurePlan, { id: `custom-${Date.now()}`, week: '第 5 周', title, goal: '请补充这个训练任务的预期成果。' }]);
    setNewTask('');
  };
  const checkinCount = checkins.filter(Boolean).length;
  const todayIndex = (new Date().getDay() + 6) % 7;
  return <section className="plan-workspace panel"><div className="workspace-hero"><span>成长路线</span><h2>未来 4 周训练计划</h2><p>首页已完成 {complete}/4 项。本页可直接调整任务名称、安排周次，并新增自己的训练项目。</p><button className="primary" onClick={onBackHome}>回到本周任务 <Icon name="arrow" size={17}/></button></div><section className="checkin-panel"><div className="checkin-heading"><div><span>本周学习打卡</span><p>仅当天可打卡一次；本周累计 5 天学习，自动赠送 1 张补签卡。</p></div><div className="checkin-stats"><b>{checkinCount}/7 天</b><small>补签卡 {makeupCards}/5</small></div></div><div className="checkin-days">{['周一', '周二', '周三', '周四', '周五', '周六', '周日'].map((day, index) => <button key={day} className={`${checkins[index] ? 'checked' : ''} ${index === todayIndex ? 'today' : ''}`} disabled={checkins[index] || index !== todayIndex} onClick={() => onCheckinToggle(index)}><span>{day}</span><i>{checkins[index] ? <Icon name="check" size={17}/> : index + 1}</i><small>{checkins[index] ? '已学习' : index === todayIndex ? '今日打卡' : '未到日期'}</small></button>)}</div></section><div className="plan-editor">{futurePlan.map((item, index) => <article className="plan-editor-row" key={item.id}><div className="plan-index">{index + 1}</div><select value={item.week} onChange={(event) => update(item.id, 'week', event.target.value)} aria-label={`${item.title} 的安排周次`}>{['第 1 周', '第 2 周', '第 3 周', '第 4 周', '第 5 周', '第 6 周'].map((week) => <option key={week}>{week}</option>)}</select><div><input value={item.title} onChange={(event) => update(item.id, 'title', event.target.value)} aria-label="训练任务名称"/><textarea value={item.goal} onChange={(event) => update(item.id, 'goal', event.target.value)} aria-label="训练任务目标"/></div></article>)}</div><div className="plan-add"><input value={newTask} onChange={(event) => setNewTask(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && addTask()} placeholder="输入想加入的训练任务，例如：完成一个 AI 智能体原型"/><button className="secondary" onClick={addTask}>新增训练任务</button></div></section>;
}

function getAssistantReply(question, context) {
  const input = question.trim();
  const lower = input.toLowerCase();
  if (!input) return '可以直接问我 Java、MySQL、项目计划、A02 备赛或实习准备相关的问题。';
  if (lower.includes('a02') || input.includes('数字马力') || input.includes('比赛')) return 'A02 的核心不是把功能堆多，而是做出“测评 → 计划 → 训练 → 反馈”的闭环。你现在的项目已经有了基础原型，下一步建议补齐真实数据、AI 对话记录和用户测试材料。';
  if (lower.includes('java') || input.includes('后端') || input.includes('spring')) return 'Java 学习建议按“基础语法 → 集合/异常/IO → MySQL → JDBC/MyBatis → Spring Boot → 一个完整项目”推进。当前最值得做的是完成 Spring Boot 项目骨架，再把登录和任务管理接口跑通。';
  if (lower.includes('mysql') || input.includes('数据库') || input.includes('sql')) return 'MySQL 建议先掌握建表、主外键、增删改查、多表查询和索引。可以先为这个项目设计 user、assessment、learning_task、training_session 四张表，再用 Spring Boot 逐步接入。';
  if (input.includes('实习') || input.includes('简历') || input.includes('投递')) return '准备实习时，最有说服力的是一个能讲清楚的问题—方案—技术栈—成果。建议把这个“职航 AI”作为作品：准备 README、架构图、演示视频和你负责模块的复盘。';
  if (input.includes('计划') || input.includes('学习')) return `你当前本周已完成 ${context.complete}/4 项任务。建议先完成 Spring Boot 项目骨架，再进入 MySQL 登录与任务管理；每天保持 60–90 分钟的“学习 + 编码 + 复盘”节奏。`;
  if (input.includes('职业') || input.includes('方向') || input.includes('测评')) return context.result ? `根据当前测评，你更匹配“${context.result.primaryCareer.name}”（${context.result.primaryCareer.score} 分）。重点提升 ${Object.entries(context.result.dimensions).sort((a, b) => a[1] - b[1])[0][0] === 'ai' ? 'AI 应用能力' : '相对薄弱的能力维度'}，并用一个完整项目证明能力。` : '建议先完成 25 道职业测评。我会根据技术、交付、协作、成长和 AI 应用五个维度生成更适合你的实习方向。';
  return '我理解你想推进这个学习与实习项目。你可以继续告诉我具体目标，例如“帮我拆解本周 Java 计划”“怎样设计 MySQL 表”“A02 答辩讲什么”，我会给你可执行的下一步。';
}

function SmartAssistant({ complete, result }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([{ role: 'bot', text: '你好，我是职航 AI 助手。可以问我学习计划、项目开发、实习准备或 A02 备赛问题。' }]);
  const send = (question = draft) => {
    const text = question.trim();
    if (!text) return;
    setMessages((items) => [...items, { role: 'user', text }, { role: 'bot', text: getAssistantReply(text, { complete, result }) }]);
    setDraft('');
  };
  return <div className="smart-assistant"><button className="assistant-fab" onClick={() => setOpen((value) => !value)} aria-expanded={open}><Icon name="spark" size={22}/><span>AI 助手</span></button>{open && <section className="assistant-panel"><header><div><span className="assistant-dot"/><div><b>职航 AI 助手</b><small>学习与实习规划</small></div></div><button onClick={() => setOpen(false)}>×</button></header><div className="assistant-messages">{messages.map((message, index) => <div key={`${message.role}-${index}`} className={`assistant-message ${message.role}`}>{message.text}</div>)}</div><div className="assistant-suggestions">{['帮我安排本周学习', '我该怎样准备实习？', 'A02 项目下一步做什么？'].map((item) => <button key={item} onClick={() => send(item)}>{item}</button>)}</div><form onSubmit={(event) => { event.preventDefault(); send(); }}><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="输入你的问题…"/><button type="submit" aria-label="发送问题"><Icon name="arrow" size={18}/></button></form></section>}</div>;
}

const sectionContent = {
  '职业测评': {
    eyebrow: '职业画像', title: '找到适合你的实习起点',
    description: '通过兴趣、技能、协作偏好和 AI 应用意愿，生成可解释的岗位建议。',
    cards: [['测评状态', '当前画像已更新，建议每 4 周重新测评一次。'], ['推荐方向', 'Java 后端开发 · AI 应用实习生'], ['下一步', '完成测评后查看能力差距与学习计划。']],
  },
  '成长计划': {
    eyebrow: '本周进度', title: '把目标拆成可完成的任务',
    description: '当前计划围绕 Java Web 实习准备：Java → MySQL → Spring Boot → 项目演示。',
    cards: [['已完成任务', '完成数会与首页学习计划同步。'], ['本周重点', '搭建 Spring Boot 项目骨架，并写出 3 个接口。'], ['下周建议', '接入 MySQL，完成登录和任务管理两个核心功能。']],
  },
  '模拟训练': {
    eyebrow: '实战练习', title: '在场景中练习职场表达',
    description: '每次训练都会围绕需求理解、沟通协作和执行计划给出反馈。',
    cards: [['AI 辅助办公', '练习将会议纪要转化为清晰的任务清单。'], ['远程协作', '练习同步风险、说明进度并请求支持。'], ['跨岗位沟通', '练习向产品和运营同学澄清需求。']],
  },
  '我的报告': {
    eyebrow: '职业报告', title: '你的实习准备度：78 分',
    description: '优势是学习节奏稳定、职业兴趣明确；当前优先补齐项目实战和后端工程化能力。',
    cards: [['优势能力', 'Java 基础、持续学习、AI 工具使用意识。'], ['能力缺口', 'Spring Boot 项目经验、数据库设计、团队协作案例。'], ['3 个月目标', '完成 1 个可演示 Java Web 项目并开始投递实习。']],
  },
  '设置': {
    eyebrow: '个性化设置', title: '选择更舒适的界面模式',
    description: '深色模式适合夜间学习，浅色模式适合日间阅读。你的选择会自动保存在此浏览器中。',
    cards: [['主题外观', '在深色与浅色模式之间切换。'], ['测评数据', '清除当前测评结果后，可重新完成 25 道题并生成新的职业建议。'], ['账号与隐私', '本演示版将账号、主题和测评结果仅保存在当前浏览器。']],
  },
};

function SupabaseAuthGate({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    const email = form.email.trim().toLowerCase();
    const name = form.name.trim();
    if (!email || !form.password || (mode === 'register' && !name)) {
      setMessage('请完整填写注册信息。');
      return;
    }
    setLoading(true);
    setMessage('');
    if (mode === 'register') {
      const emailRedirectTo = window.location.hostname.endsWith('github.io') ? 'https://slyahh-gif.github.io/zhihangai/' : `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({ email, password: form.password, options: { data: { display_name: name }, emailRedirectTo } });
      if (error) setMessage(error.message);
      else if (data.session) onAuthenticated({ id: data.user.id, name, email });
      else setMessage('注册成功，请前往邮箱完成验证后再登录。');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: form.password });
      if (error) setMessage('邮箱或密码不正确，请重试。');
      else onAuthenticated({ id: data.user.id, name: data.user.user_metadata?.display_name || email.split('@')[0], email: data.user.email });
    }
    setLoading(false);
  };
  return <main className="auth-page"><section className="auth-intro"><div className="auth-brand"><div className="brand-mark"><Icon name="compass" size={25}/></div>职航 <b>AI</b></div><div className="auth-copy"><span>2026 服务外包创新应用大赛 A02</span><h1>从职业画像开始，<br/>向真实实习岗位靠近。</h1><p>注册后即可保存职业测评、成长计划，并在学习广场与其他同学交流项目进展。</p></div><div className="auth-points"><div><Icon name="lock"/> 安全账号登录</div><div><Icon name="spark"/> AI 学习教练</div><div><Icon name="chart"/> 成长记录同步</div></div></section><section className="auth-panel"><div className="auth-card"><div className="auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => { setMode('login'); setMessage(''); }}>登录</button><button className={mode === 'register' ? 'selected' : ''} onClick={() => { setMode('register'); setMessage(''); }}>注册</button></div><h2>{mode === 'login' ? '欢迎回来' : '创建你的账号'}</h2><p>{mode === 'login' ? '登录后继续查看你的学习数据与广场动态。' : '使用邮箱创建账号，开始保存你的学习成长记录。'}</p><form onSubmit={submit}>{mode === 'register' && <label>昵称<input value={form.name} onChange={update('name')} placeholder="例如：小明" autoComplete="name"/></label>}<label>邮箱<input type="email" value={form.email} onChange={update('email')} placeholder="name@example.com" autoComplete="email"/></label><label>密码<input type="password" value={form.password} onChange={update('password')} placeholder="至少 6 位" minLength="6" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/></label>{message && <div className="auth-message">{message}</div>}<button className="primary auth-submit" type="submit" disabled={loading}>{loading ? '处理中…' : mode === 'login' ? '登录职航 AI' : '注册并开始'} <Icon name="arrow" size={17}/></button></form><small>{mode === 'login' ? '还没有账号？' : '已有账号？'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(''); }}>{mode === 'login' ? '立即注册' : '去登录'}</button></small></div></section></main>;
}

function SocialFeed({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('学习记录');
  const [commentDrafts, setCommentDrafts] = useState({});
  const [status, setStatus] = useState('');
  const loadPosts = async () => {
    const { data, error } = await supabase.from('posts').select('id,content,topic,created_at,author_id,profiles(display_name),post_likes(user_id),comments(id,content,created_at,author_id,profiles(display_name))').order('created_at', { ascending: false }).limit(50);
    if (!error) setPosts(data || []);
  };
  useEffect(() => {
    loadPosts();
    const channel = supabase.channel('learning-square-live').on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, loadPosts).on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, loadPosts).on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, loadPosts).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);
  const publish = async (event) => {
    event.preventDefault();
    const text = content.trim();
    if (!text) return setStatus('先写下一句想分享的学习动态吧。');
    const { error } = await supabase.from('posts').insert({ author_id: currentUser.id, content: text, topic });
    if (error) setStatus('发布失败，请稍后重试。');
    else { setContent(''); setStatus('已发布到学习广场。'); await loadPosts(); }
  };
  const toggleLike = async (post) => {
    const liked = (post.post_likes || []).some((item) => item.user_id === currentUser.id);
    if (liked) await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', currentUser.id);
    else await supabase.from('post_likes').insert({ post_id: post.id, user_id: currentUser.id });
    await loadPosts();
  };
  const addComment = async (postId) => {
    const text = (commentDrafts[postId] || '').trim();
    if (!text) return;
    const { error } = await supabase.from('comments').insert({ post_id: postId, author_id: currentUser.id, content: text });
    if (!error) { setCommentDrafts((drafts) => ({ ...drafts, [postId]: '' })); await loadPosts(); }
  };
  return <section className="social-feed"><section className="social-composer panel"><div><span className="social-kicker">学习广场</span><h2>记录进度，也向同行提问</h2><p>注册用户发布的动态会实时出现在这里。请友善交流，不发布个人隐私信息。</p></div><form onSubmit={publish}><textarea value={content} maxLength="500" onChange={(event) => setContent(event.target.value)} placeholder="例如：今天完成了 Spring Boot 登录接口，下一步准备接入 MySQL。"/><div className="composer-actions"><select value={topic} onChange={(event) => setTopic(event.target.value)}><option>学习记录</option><option>项目进度</option><option>求助交流</option><option>经验分享</option></select><small>{content.length}/500</small><button className="primary" type="submit">发布动态 <Icon name="arrow" size={16}/></button></div>{status && <p className="social-status">{status}</p>}</form></section><section className="social-stream"><div className="social-stream-head"><h2>最新动态</h2><button onClick={loadPosts}>刷新</button></div>{posts.length === 0 ? <div className="social-empty panel"><Icon name="spark" size={30}/><b>还没有动态</b><span>成为第一个分享学习进度的人吧。</span></div> : posts.map((post) => { const liked = (post.post_likes || []).some((item) => item.user_id === currentUser.id); const comments = (post.comments || []).slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); return <article className="post-card panel" key={post.id}><header><div className="post-avatar">{(post.profiles?.display_name || '同').slice(0, 1)}</div><div><b>{post.profiles?.display_name || '学习同学'}</b><small>{new Date(post.created_at).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</small></div><span>{post.topic}</span></header><p className="post-content">{post.content}</p><div className="post-actions"><button className={liked ? 'liked' : ''} onClick={() => toggleLike(post)}>{liked ? '已点赞' : '点赞'} · {post.post_likes?.length || 0}</button><span>{comments.length} 条评论</span></div>{comments.length > 0 && <div className="comments">{comments.map((comment) => <p key={comment.id}><b>{comment.profiles?.display_name || '学习同学'}：</b>{comment.content}</p>)}</div>}<div className="comment-box"><input value={commentDrafts[post.id] || ''} maxLength="300" onChange={(event) => setCommentDrafts((drafts) => ({ ...drafts, [post.id]: event.target.value }))} onKeyDown={(event) => event.key === 'Enter' && addComment(post.id)} placeholder="写下你的想法…"/><button onClick={() => addComment(post.id)}>评论</button></div></article>; })}</section></section>;
}

function AuthGate({ onAuthenticated }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const update = (key) => (event) => setForm((value) => ({ ...value, [key]: event.target.value }));
  const submit = (event) => {
    event.preventDefault();
    const name = form.name.trim();
    const account = form.email.trim();
    const email = account.toLowerCase();
    if (!account || !form.password || (mode === 'register' && !name)) {
      setMessage('请把必填信息填写完整。');
      return;
    }
    if (mode === 'register') {
      const existing = JSON.parse(localStorage.getItem('zhihang-ai-user') || 'null');
      if (existing?.email === email) {
        setMessage('该邮箱已经注册，请切换到“登录”进入原有账号，测评结果会保留。');
        return;
      }
      const user = { name, email, password: form.password };
      localStorage.setItem('zhihang-ai-user', JSON.stringify(user));
      localStorage.removeItem(`zhihang-ai-assessment-${email}`);
      sessionStorage.setItem('zhihang-ai-session', JSON.stringify({ name, email }));
      onAuthenticated({ name, email });
      return;
    }
    const saved = JSON.parse(localStorage.getItem('zhihang-ai-user') || 'null');
    if (!saved || (saved.email !== email && saved.name !== account) || saved.password !== form.password) {
      setMessage('账号或密码不正确。请使用注册时的邮箱或昵称登录；首次使用请先注册。');
      return;
    }
    sessionStorage.setItem('zhihang-ai-session', JSON.stringify({ name: saved.name, email: saved.email }));
    onAuthenticated({ name: saved.name, email: saved.email });
  };
  const switchMode = (nextMode) => { setMode(nextMode); setMessage(''); };
  return <main className="auth-page"><section className="auth-intro"><div className="auth-brand"><div className="brand-mark"><Icon name="compass" size={25}/></div>职航 <b>AI</b></div><div className="auth-copy"><span>2026 数字马力杯 · A02</span><h1>把实习目标，<br/>变成每天可执行的计划。</h1><p>职业测评、成长计划和场景训练，帮助你从 Java 学习走向第一段实习。</p></div><div className="auth-points"><div><Icon name="lock"/> 本地保存账号信息</div><div><Icon name="spark"/> AI 职业导航体验</div><div><Icon name="chart"/> 可追踪的学习成长</div></div></section><section className="auth-panel"><div className="auth-card"><div className="auth-tabs"><button className={mode === 'login' ? 'selected' : ''} onClick={() => switchMode('login')}>登录</button><button className={mode === 'register' ? 'selected' : ''} onClick={() => switchMode('register')}>注册</button></div><h2>{mode === 'login' ? '欢迎回来' : '创建你的账号'}</h2><p>{mode === 'login' ? '使用注册时的邮箱或昵称登录。' : '注册后即可开始职业测评和训练。'}</p><form onSubmit={submit}>{mode === 'register' && <label>昵称<input value={form.name} onChange={update('name')} placeholder="请输入昵称" autoComplete="name"/></label>}<label>{mode === 'login' ? '邮箱或昵称' : '邮箱'}<input type={mode === 'login' ? 'text' : 'email'} value={form.email} onChange={update('email')} placeholder={mode === 'login' ? 'name@example.com 或 昵称' : 'name@example.com'} autoComplete={mode === 'login' ? 'username' : 'email'}/></label><label>密码<input type="password" value={form.password} onChange={update('password')} placeholder="至少输入 6 位" minLength="6" autoComplete={mode === 'login' ? 'current-password' : 'new-password'}/></label>{message && <div className="auth-message">{message}</div>}<button className="primary auth-submit" type="submit">{mode === 'login' ? '登录并进入职航 AI' : '注册并开始体验'} <Icon name="arrow" size={17}/></button></form><small>{mode === 'login' ? '首次使用？' : '已经有账号？'} <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? '去注册' : '去登录'}</button></small></div></section></main>;
}

function Radar({ dimensions }) {
  const values = [dimensions.growth, dimensions.technical, dimensions.ai, dimensions.delivery, dimensions.collaboration];
  const radius = values.map((value) => value * .4);
  const points = [`50,${50-radius[0]}`, `${50+radius[1]*.95},${50-radius[1]*.3}`, `${50+radius[2]*.58},${50+radius[2]*.82}`, `${50-radius[3]*.58},${50+radius[3]*.82}`, `${50-radius[4]*.95},${50-radius[4]*.3}`].join(' ');
  return <div className="radar-wrap">
    <svg viewBox="0 0 100 100" aria-label="职业能力雷达图">
      {[18, 34, 50, 66].map((r) => <polygon key={r} points={`${50},${50-r} ${50+r*.95},${50-r*.3} ${50+r*.58},${50+r*.82} ${50-r*.58},${50+r*.82} ${50-r*.95},${50-r*.3}`} fill="none" stroke="#dbe7f6" strokeWidth=".75" />)}
      <path d="M50 4v92M6 36l88 28M94 36 6 64" stroke="#dbe7f6" strokeWidth=".75" />
      <polygon points={points} fill="rgba(47,117,181,.18)" stroke="#2f75b5" strokeWidth="2" />
      {points.split(' ').map((point) => { const [cx, cy] = point.split(','); return <circle key={point} cx={cx} cy={cy} r="2.6" fill="#2f75b5"/>; })}
    </svg>
    <span className="radar-label top">成长驱动力<br/><b>{dimensions.growth}</b></span><span className="radar-label right">技术基础<br/><b>{dimensions.technical}</b></span><span className="radar-label br">AI 应用<br/><b>{dimensions.ai}</b></span><span className="radar-label bl">项目交付<br/><b>{dimensions.delivery}</b></span><span className="radar-label left">协作沟通<br/><b>{dimensions.collaboration}</b></span>
  </div>;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [active, setActive] = useState('首页');
  const [done, setDone] = useState([false, false, false, false]);
  const [modal, setModal] = useState(null);
  const [testStep, setTestStep] = useState(0);
  const [testAnswers, setTestAnswers] = useState([]);
  const [trainingResponse, setTrainingResponse] = useState('');
  const [userMenu, setUserMenu] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('zhihang-ai-theme') || 'light');
  const [futurePlan, setFuturePlan] = useState(defaultFuturePlan);
  const [checkinState, setCheckinState] = useState({ weekKey: getWeekKey(), checkins: defaultWeeklyCheckins, makeupCards: 0, rewardGranted: false });
  const complete = done.filter(Boolean).length;
  const yearStart = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - yearStart.getTime()) / 86400000);
  const dailyEncouragement = dailyEncouragements[dayOfYear % dailyEncouragements.length];
  const subtitle = useMemo(() => active === '首页' ? '科学规划职业路径，持续提升职场竞争力，遇见更好的自己。' : `这里是${active}模块的参考界面，后续可接入 Spring Boot 与百宝箱智能体。`, [active]);

  const hasAssessment = Boolean(assessmentResult);
  const startTest = () => { setTestStep(0); setTestAnswers([]); setModal('test'); };
  const startScenario = (scenario) => { setTrainingResponse(''); setModal(scenario); };
  const openInfo = (title, text) => setModal({ kind: 'info', title, text });
  const openSection = (label) => setActive(label);
  const finishAssessment = (answers) => { const result = calculateAssessment(answers); localStorage.setItem(`zhihang-ai-assessment-${currentUser.email}`, JSON.stringify(result)); setAssessmentResult(result); openInfo('测评完成', `综合得分 ${result.overall} 分。最适合的方向是“${result.primaryCareer.name}”：${result.primaryCareer.intro}`); };
  const login = (user) => { setCurrentUser(user); setCheckinState(readCheckinState(user.email)); try { setAssessmentResult(JSON.parse(localStorage.getItem(`zhihang-ai-assessment-${user.email}`) || 'null')); } catch { setAssessmentResult(null); } };
  useEffect(() => {
    const applySession = (session) => {
      if (!session?.user) return;
      const user = { id: session.user.id, name: session.user.user_metadata?.display_name || session.user.email.split('@')[0], email: session.user.email };
      login(user);
    };
    supabase.auth.getSession().then(({ data }) => applySession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) applySession(session);
      else { setCurrentUser(null); setAssessmentResult(null); }
    });
    return () => subscription.unsubscribe();
  }, []);
  const logout = async () => { await supabase.auth.signOut(); sessionStorage.removeItem('zhihang-ai-session'); setCurrentUser(null); setAssessmentResult(null); setCheckinState({ weekKey: getWeekKey(), checkins: defaultWeeklyCheckins, makeupCards: 0, rewardGranted: false }); setUserMenu(false); setModal(null); };
  const toggleCheckin = (index) => {
    const todayIndex = (new Date().getDay() + 6) % 7;
    if (index !== todayIndex || checkinState.checkins[index]) return;
    const checkins = checkinState.checkins.map((value, itemIndex) => itemIndex === index ? true : value);
    const reachedReward = checkins.filter(Boolean).length >= 5 && !checkinState.rewardGranted;
    const next = { ...checkinState, checkins, rewardGranted: checkinState.rewardGranted || reachedReward, makeupCards: reachedReward ? Math.min(5, checkinState.makeupCards + 1) : checkinState.makeupCards };
    setCheckinState(next);
    localStorage.setItem(`zhihang-ai-checkins-${currentUser.email}`, JSON.stringify(next));
    if (reachedReward) openInfo('获得补签卡', next.makeupCards >= 5 ? '本周打卡达标！补签卡已达到上限 5 张。' : `本周累计学习 5 天，获得 1 张补签卡。当前共有 ${next.makeupCards} 张。`);
  };
  const requestLogout = () => { setUserMenu(false); setModal({ kind: 'confirm', title: '确认退出登录？', text: '退出后需要重新输入账号和密码才能进入职航 AI。' }); };
  const toggleTheme = () => setTheme((current) => { const next = current === 'light' ? 'dark' : 'light'; localStorage.setItem('zhihang-ai-theme', next); return next; });
  const requestAssessmentReset = () => setModal({ kind: 'reset', title: '确认清除测评结果？', text: '清除后，职业分数、雷达图和岗位建议会恢复为“待测评”状态。此操作仅影响当前账号。' });
  const resetAssessment = () => { localStorage.removeItem(`zhihang-ai-assessment-${currentUser.email}`); setAssessmentResult(null); setModal(null); setActive('职业测评'); };
  const submitTraining = () => { const feedback = evaluateTrainingResponse(trainingResponse); setModal({ kind: 'feedback', ...feedback }); };
  const selectedContent = active === '我的报告' && !hasAssessment ? { eyebrow: '等待测评', title: '完成测评后生成职业报告', description: `还没有足够的数据生成岗位匹配度、能力差距和 3 个月实习计划。请先完成 ${assessmentQuestions.length} 道职业测评题。`, cards: [['当前状态', '未完成职业测评。'], ['你将获得', '岗位方向、能力雷达图和个性化学习计划。'], ['下一步', '点击下方按钮开始职业测评。']] } : active === '我的报告' ? { eyebrow: '职业报告', title: `你的实习准备度：${assessmentResult.overall} 分`, description: `最匹配方向：${assessmentResult.primaryCareer.name}。${assessmentResult.primaryCareer.intro}`, cards: [['核心优势', `技术 ${assessmentResult.dimensions.technical} 分 · 项目交付 ${assessmentResult.dimensions.delivery} 分`], ['适合方向', `${assessmentResult.primaryCareer.name}（匹配度 ${assessmentResult.primaryCareer.score} 分）`], ['提升建议', `优先补齐 ${Object.entries(assessmentResult.dimensions).sort((a, b) => a[1] - b[1])[0][0] === 'ai' ? 'AI 应用能力' : '相对薄弱的能力维度'}，完成 1 个可演示项目后开始投递。`]] } : active === '设置' ? { ...sectionContent['设置'], cards: [['主题外观', `当前为${theme === 'dark' ? '深色' : '浅色'}模式。`], ...sectionContent['设置'].cards.slice(1)] } : sectionContent[active];
  const handleWorkspaceAction = (title, text, index) => {
    if (active === '职业测评') {
      if (title === '下一步') return startTest();
      if (title === '推荐方向') return openInfo('推荐方向说明', hasAssessment ? `主推荐：${assessmentResult.primaryCareer.name}。备选方向：${assessmentResult.alternatives.map((item) => `${item.name}（${item.score}分）`).join('、')}。` : '完成 25 道测评后，系统会基于五个能力维度计算你的职业匹配方向。');
      return openInfo('测评状态', hasAssessment ? `当前测评已完成，总分 ${assessmentResult.overall} 分。建议每 4 周重新测评一次，观察能力变化。` : '当前尚未测评，完成 25 道题后会生成能力画像与职业建议。');
    }
    if (active === '成长计划') {
      if (title === '已完成任务') { setActive('首页'); return; }
      if (title === '本周重点') { setDone((items) => items.map((value, taskIndex) => taskIndex === 2 ? true : value)); return openInfo('本周重点已加入', '已将“搭建 Spring Boot 项目骨架”标记为重点任务。回到首页可查看进度。'); }
      return openInfo('下周建议', '建议按顺序完成：创建数据库表 → 编写登录接口 → 完成任务管理接口 → 录制项目演示视频。');
    }
    if (active === '模拟训练') return startScenario(scenarios[index]);
    if (active === '我的报告') {
      if (!hasAssessment) return startTest();
      if (title === '核心优势') return openInfo('五维能力画像', `技术基础 ${assessmentResult.dimensions.technical} 分、项目交付 ${assessmentResult.dimensions.delivery} 分、协作沟通 ${assessmentResult.dimensions.collaboration} 分、成长驱动力 ${assessmentResult.dimensions.growth} 分、AI 应用 ${assessmentResult.dimensions.ai} 分。`);
      if (title === '适合方向') return openInfo('职业匹配详情', `${assessmentResult.primaryCareer.name}匹配度 ${assessmentResult.primaryCareer.score} 分。${assessmentResult.primaryCareer.intro}`);
      setActive('成长计划'); return openInfo('已进入成长计划', '下一步请优先完成本周重点任务，并将项目骨架提交到 Git 仓库。');
    }
    openInfo(title, text);
  };
  const workspaceActionLabel = (title) => {
    if (active === '职业测评') return title === '下一步' ? '开始测评' : title === '推荐方向' ? '查看匹配结果' : '查看测评状态';
    if (active === '成长计划') return title === '已完成任务' ? '回到任务列表' : title === '本周重点' ? '设为本周重点' : '查看下周安排';
    if (active === '模拟训练') return '开始训练';
    if (active === '我的报告') return !hasAssessment ? '开始测评' : title === '提升建议' ? '加入成长计划' : '查看详细画像';
    return '查看详情';
  };
  if (!currentUser) return <SupabaseAuthGate onAuthenticated={login}/>;
  return <main className={`app-shell theme-${theme}`}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Icon name="compass" size={23}/></div><span>职航 <b>AI</b></span></div>
      {active === '设置' ? <><nav className="settings-nav"><span className="nav-caption">账号设置</span><button className="nav-item active"><Icon name="settings"/><span>个性化设置</span></button><button className="nav-item exit-settings" onClick={() => setActive('首页')}><Icon name="arrow"/><span>退出设置</span></button></nav><div className="sidebar-settings-note"><Icon name="lock" size={16}/><span>设置仅保存在当前浏览器。</span></div></> : <><nav><span className="nav-caption">工作台</span>{[...nav, ['学习广场', 'spark']].map(([label, icon], index) => <React.Fragment key={label}>{index === 1 && <span className="nav-caption nav-caption-gap">职业成长</span>}<button className={active === label ? 'nav-item active' : 'nav-item'} onClick={() => label === '首页' ? setActive(label) : openSection(label)}><Icon name={icon}/><span>{label}</span></button></React.Fragment>)}</nav><div className="sidebar-progress"><span>本周学习进度</span><b>{complete}/4</b><div><i style={{ width: `${complete * 25}%` }}/></div></div></>}
      <div className="user-menu-wrap"><button className="user-card" onClick={() => setUserMenu((open) => !open)} aria-expanded={userMenu} title="打开账号菜单"><div className="avatar">{currentUser.name.slice(0, 1)}</div><div><b>{currentUser.name}，你好</b><small>{currentUser.email}</small></div></button>{userMenu && <div className="user-menu"><span>账号菜单</span><button className="menu-setting" onClick={() => { setUserMenu(false); openSection('设置'); }}><span><Icon name="settings" size={15}/> 设置</span><Icon name="arrow" size={15}/></button><button onClick={requestLogout}>退出登录 <Icon name="arrow" size={15}/></button></div>}</div>
    </aside>
    <section className="content">
      <header className="topbar"><div><h1>{active === '首页' ? '同学你好，欢迎来到职航 AI' : active}</h1><p>{subtitle}</p></div>{active === '首页' && <div className="daily-encouragement"><Icon name="spark" size={17}/><div><small>每日鼓励</small><span>{dailyEncouragement}</span></div></div>}<button className="primary" onClick={startTest}><Icon name="compass"/>开始测评</button></header>
      {active === '首页' ? <><section className="overview-grid">
        <article className="career-card panel">
          <div className="panel-title"><span>你的职业匹配度总览</span><button onClick={() => openSection('我的报告')}>查看报告 <Icon name="arrow" size={16}/></button></div>
          <div className="career-main"><div className="score-side"><p>综合职业匹配度</p><div className="score">{hasAssessment ? assessmentResult.overall : '--'}<span>{hasAssessment ? '/ 100' : '待测评'}</span></div><div className="stars">{hasAssessment ? <>★★★★<i>★</i></> : <i>★★★★★</i>}</div><div className="insight"><Icon name="spark" size={17}/><span>{hasAssessment ? `最匹配方向：${assessmentResult.primaryCareer.name}。${assessmentResult.primaryCareer.intro}` : `你还没有完成职业测评。完成 ${assessmentQuestions.length} 道题后，这里会生成匹配度与学习建议。`}</span></div></div>{hasAssessment ? <Radar dimensions={assessmentResult.dimensions}/> : <div className="empty-radar"><Icon name="compass" size={38}/><b>等待职业测评</b><span>点击右上角“开始测评”</span></div>}</div>
        </article>
        <article className="plan-card panel"><div className="panel-title"><span>本周学习计划</span><small><Icon name="calendar" size={16}/> 7.20 – 7.26</small></div><div className="task-list">{tasks.map((task, i) => <button className={done[i] ? 'task done' : 'task'} key={task.title} onClick={() => setDone(d => d.map((v, n) => n === i ? !v : v))}><span className={`task-icon ${task.tone}`}><Icon name={done[i] ? 'check' : 'file'} size={17}/></span><span className="task-copy"><b>{task.title}</b><small>{task.meta}</small></span><span className="tick">{done[i] && <Icon name="check" size={14}/>}</span></button>)}</div><div className="plan-foot">已完成 <b>{complete}/4</b> 项任务 <button onClick={() => openSection('成长计划')}>查看全部计划 <Icon name="arrow" size={16}/></button></div></article>
      </section>
      <section className="training-section"><div className="section-heading"><div><h2>职场训练场</h2><p>沉浸式场景训练，让每一次练习更接近真实工作。</p></div><button onClick={() => openSection('模拟训练')}>全部训练 <Icon name="arrow" size={17}/></button></div><div className="scenario-grid">{scenarios.map((s, i) => <article className={`scenario ${s.color}`} key={s.title}><div className="scene-visual"><div className="scene-circle"><Icon name={s.icon} size={42}/></div><div className="scene-lines"><i/><i/><i/></div></div><div className="scenario-body"><div><h3>{s.title}</h3><span>{s.tag}</span></div><p>{s.text}</p><footer><small><Icon name="clock" size={15}/> 预计 {i === 1 ? 50 : 60} 分钟</small><button onClick={() => startScenario(s)}>立即训练 <Icon name="arrow" size={16}/></button></footer></div></article>)}</div>
      </section>
      <footer className="privacy"><Icon name="lock" size={15}/> 你的职业数据仅用于生成个性化建议，可在“我的报告”中随时删除。</footer></> : active === '学习广场' ? <SocialFeed currentUser={currentUser}/> : active === '成长计划' ? <GrowthPlanPanel complete={complete} futurePlan={futurePlan} onPlanChange={setFuturePlan} onBackHome={() => setActive('首页')} checkins={checkinState.checkins} makeupCards={checkinState.makeupCards} onCheckinToggle={toggleCheckin}/> : <section className="workspace panel"><div className="workspace-hero"><span>{selectedContent.eyebrow}</span><h2>{selectedContent.title}</h2><p>{selectedContent.description}</p><button className="primary" onClick={active === '设置' ? toggleTheme : active === '职业测评' || (active === '我的报告' && !hasAssessment) ? startTest : () => openInfo('已保存', '这是比赛演示版的本地交互结果；后续可以接入 Spring Boot 与 MySQL 保存真实数据。')}>{active === '设置' ? `切换为${theme === 'dark' ? '浅色' : '深色'}模式` : active === '职业测评' || (active === '我的报告' && !hasAssessment) ? '开始/重新测评' : '保存并查看反馈'} <Icon name="arrow" size={17}/></button></div><div className="workspace-grid">{selectedContent.cards.map(([title, text], index) => <article className="workspace-card" key={title}><div className="workspace-icon"><Icon name={active === '模拟训练' ? 'flask' : active === '我的报告' ? 'file' : active === '设置' ? 'settings' : 'compass'} size={22}/></div><h3>{title}</h3><p>{text}</p><button onClick={active === '设置' && title === '主题外观' ? toggleTheme : active === '设置' && title === '测评数据' ? requestAssessmentReset : () => handleWorkspaceAction(title, text, index)}>{active === '设置' && title === '主题外观' ? '切换模式' : active === '设置' && title === '测评数据' ? '清除并重新测评' : workspaceActionLabel(title)} <Icon name="arrow" size={16}/></button></article>)}</div></section>}
    </section>
    <SmartAssistant complete={complete} result={assessmentResult}/>
    {modal && <div className="modal-backdrop" onMouseDown={() => setModal(null)}><section className="modal" onMouseDown={e => e.stopPropagation()}>{modal === 'test' ? <><button className="modal-close" onClick={() => setModal(null)}>×</button><div className="modal-icon"><Icon name="compass" size={30}/></div><h2>开始职业测评</h2><p>第 {testStep + 1}/{assessmentQuestions.length} 题 · 根据你的真实情况作答，结果仅用于生成学习建议。</p><div className="question">{assessmentQuestions[testStep].question}</div><div className="options">{assessmentQuestions[testStep].options.map((option, optionIndex) => <button key={option} onClick={() => { const nextAnswers = [...testAnswers]; nextAnswers[testStep] = optionIndex; setTestAnswers(nextAnswers); testStep < assessmentQuestions.length - 1 ? setTestStep(testStep + 1) : finishAssessment(nextAnswers); }}>{option}<Icon name="arrow" size={16}/></button>)}</div></> : modal.kind === 'reset' ? <><button className="modal-close" onClick={() => setModal(null)}>×</button><div className="modal-icon"><Icon name="file" size={30}/></div><h2>{modal.title}</h2><p>{modal.text}</p><div className="confirm-actions"><button className="secondary" onClick={() => setModal(null)}>取消</button><button className="primary" onClick={resetAssessment}>确认清除</button></div></> : modal.kind === 'confirm' ? <><button className="modal-close" onClick={() => setModal(null)}>×</button><div className="modal-icon"><Icon name="lock" size={30}/></div><h2>{modal.title}</h2><p>{modal.text}</p><div className="confirm-actions"><button className="secondary" onClick={() => setModal(null)}>暂不退出</button><button className="primary" onClick={logout}>确认退出</button></div></> : modal.kind === 'feedback' ? <><button className="modal-close" onClick={() => setModal(null)}>×</button><div className="modal-icon"><Icon name="chart" size={30}/></div><h2>训练评分：{modal.score} 分 · {modal.level}</h2><p>回答完整度 {modal.lengthScore}/30 · 表达清晰度 {modal.clarityScore}/25 · 协作意识 {modal.collaborationScore}/25 · 行动方案 {modal.actionScore}/20</p><div className="dialogue"><b>改进建议</b><span>{modal.advice}</span></div><button className="primary wide" onClick={() => setModal(null)}>查看并继续训练 <Icon name="check"/></button></> : modal.kind === 'info' ? <><button className="modal-close" onClick={() => setModal(null)}>×</button><div className="modal-icon"><Icon name="spark" size={30}/></div><h2>{modal.title}</h2><p>{modal.text}</p><button className="primary wide" onClick={() => setModal(null)}>我知道了 <Icon name="check"/></button></> : <><button className="modal-close" onClick={() => setModal(null)}>×</button><div className="modal-icon"><Icon name="spark" size={30}/></div><h2>{modal.title}</h2><p>{modal.text}</p><div className="dialogue"><b>AI 教练 · 训练题目</b><span>{modal.prompt}</span></div><textarea value={trainingResponse} onChange={(event) => setTrainingResponse(event.target.value)} placeholder="输入你的回应。建议结合题目说明具体任务、时间、协作对象和可执行方案。"/><button className="primary wide" onClick={submitTraining}><Icon name="play"/>提交并获取评分</button></>}</section></div>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App/>);
