import { useMemo, useState, useRef, useEffect } from 'react'
import './App.css'

const SEASONS = ["春", "夏", "秋", "冬"]
const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

const heartEmpty = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path fill='%23aa5a67' fill-opacity='0.3' d='M8 14s-6-3.33-6-8a3.5 3.5 0 0 1 6-2.44A3.5 3.5 0 0 1 14 6c0 4.67-6 8-6 8z'/></svg>"
const heartFull = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><path fill='%23626285' d='M8 14s-6-3.33-6-8a3.5 3.5 0 0 1 6-2.44A3.5 3.5 0 0 1 14 6c0 4.67-6 8-6 8z'/></svg>".replace('#626285','#FF6285').replace('%23FF6285','%23FF6285')

// Sebastian images - different for header and chat
const sebHeaderAvatar = '/Sebastian-header.png'  // 顶部大头像
const sebChatAvatar = '/Sebastian-chat.png'      // 对话框小头像
const fallbackSeb = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' rx='12' ry='12' fill='%23141b24'/><text x='50%' y='54%' font-size='28' text-anchor='middle' fill='%23a0c7ff' font-family='Arial, sans-serif'>S</text></svg>"
const fallbackMe = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' rx='12' ry='12' fill='%231d2a39'/><text x='50%' y='54%' font-size='28' text-anchor='middle' fill='%23ffd29d' font-family='Arial, sans-serif'>我</text></svg>"

const allGifts = [
  // 最爱 (80分)
  { id: 'FrozenTear', name: '泪晶', points: 80, category: '最爱' },
  { id: 'Obsidian', name: '黑曜石', points: 80, category: '最爱' },
  { id: 'PumpkinSoup', name: '南瓜汤', points: 80, category: '最爱' },
  { id: 'Sashimi', name: '生鱼片', points: 80, category: '最爱' },
  { id: 'VoidEgg', name: '虚空蛋', points: 80, category: '最爱' },
  { id: 'GreenFrogEgg', name: '青蛙蛋', points: 80, category: '最爱' },
  { id: 'StardropTea', name: '星之果茶', points: 80, category: '最爱' },
  
  // 喜欢 (45分)
  { id: 'CombatQuarterly', name: '战斗季刊', points: 45, category: '喜欢' },
  { id: 'Flounder', name: '比目鱼', points: 45, category: '喜欢' },
  { id: 'MonsterCompendium', name: '怪物图鉴', points: 45, category: '喜欢' },
  { id: 'Quartz', name: '石英', points: 45, category: '喜欢' },
  
  // 一般 (20分)
  { id: 'Bread', name: '面包', points: 20, category: '一般' },
  { id: 'MysticSyrup', name: '神秘糖浆', points: 20, category: '一般' },
  { id: 'TeaLeaves', name: '茶叶', points: 20, category: '一般' },
  { id: 'Coral', name: '珊瑚', points: 20, category: '一般' },
  { id: 'NautilusShell', name: '鹦鹉螺', points: 20, category: '一般' },
  { id: 'Truffle', name: '松露', points: 20, category: '一般' },
  { id: 'DuckFeather', name: '鸭毛', points: 20, category: '一般' },
  { id: 'Roe', name: '鱼籽', points: 20, category: '一般' },
  { id: 'Wheat', name: '小麦', points: 20, category: '一般' },
  { id: 'FriedEgg', name: '煎鸡蛋', points: 20, category: '一般' },
  { id: 'SquidInk', name: '鱿鱼墨汁', points: 20, category: '一般' },
  { id: 'Wool', name: '动物毛', points: 20, category: '一般' },
  { id: 'Hops', name: '啤酒花', points: 20, category: '一般' },
  { id: 'SweetGemBerry', name: '宝石甜莓', points: 20, category: '一般' },
  
  // 不喜欢 (-20分)
  { id: 'Chanterelle', name: '鸡油菌', points: -20, category: '不喜欢' },
  { id: 'CommonMushroom', name: '普通蘑菇', points: -20, category: '不喜欢' },
  { id: 'Daffodil', name: '黄水仙', points: -20, category: '不喜欢' },
  { id: 'Dandelion', name: '蒲公英', points: -20, category: '不喜欢' },
  { id: 'Ginger', name: '姜', points: -20, category: '不喜欢' },
  { id: 'Hazelnut', name: '榛子', points: -20, category: '不喜欢' },
  { id: 'Holly', name: '冬青树', points: -20, category: '不喜欢' },
  { id: 'Leek', name: '韭葱', points: -20, category: '不喜欢' },
  { id: 'MagmaCap', name: '熔岩菇', points: -20, category: '不喜欢' },
  { id: 'Morel', name: '羊肚菌', points: -20, category: '不喜欢' },
  { id: 'PurpleMushroom', name: '紫蘑菇', points: -20, category: '不喜欢' },
  { id: 'Salmonberry', name: '美洲大树莓', points: -20, category: '不喜欢' },
  { id: 'SnowYam', name: '雪山药', points: -20, category: '不喜欢' },
  { id: 'WildHorseradish', name: '野山葵', points: -20, category: '不喜欢' },
  { id: 'WinterRoot', name: '冬根', points: -20, category: '不喜欢' },
  
  // 讨厌 (-40分)
  { id: 'Clay', name: '粘土', points: -40, category: '讨厌' },
  { id: 'CompleteBreakfast', name: '完美早餐', points: -40, category: '讨厌' },
  { id: 'FarmersLunch', name: '农夫午餐', points: -40, category: '讨厌' },
  { id: 'Omelet', name: '煎蛋卷', points: -40, category: '讨厌' },
  { id: 'PinaColada', name: '椰林飘香', points: -40, category: '讨厌' }
]

function getRandomGifts() {
  // 从每个分类中随机选择一些礼物，总共16个
  const favorite = allGifts.filter(g => g.category === '最爱')
  const like = allGifts.filter(g => g.category === '喜欢')
  const neutral = allGifts.filter(g => g.category === '一般')
  const dislike = allGifts.filter(g => g.category === '不喜欢')
  const hate = allGifts.filter(g => g.category === '讨厌')
  
  const selected = [
    ...favorite.sort(() => 0.5 - Math.random()).slice(0, 3), // 最爱3个
    ...like.sort(() => 0.5 - Math.random()).slice(0, 3),     // 喜欢3个
    ...neutral.sort(() => 0.5 - Math.random()).slice(0, 5),  // 一般5个
    ...dislike.sort(() => 0.5 - Math.random()).slice(0, 3),  // 不喜欢3个
    ...hate.sort(() => 0.5 - Math.random()).slice(0, 2)      // 讨厌2个
  ]
  
  return selected.sort(() => 0.5 - Math.random())
}

function formatDate(state){
  const dayIndexZeroBased = (state.dayOfSeason - 1) % 7
  return `Y${state.year} · ${SEASONS[state.seasonIndex]} · 第${state.dayOfSeason}天 · ${WEEKDAYS[dayIndexZeroBased]}`
}

function computeHearts(points){
  return Math.floor(points / 250)
}

function App() {
  const [year, setYear] = useState(1)
  const [seasonIndex, setSeasonIndex] = useState(0)
  const [dayOfSeason, setDayOfSeason] = useState(1)
  const [friendshipPoints, setFriendshipPoints] = useState(0)
  const [dialogueGainedToday, setDialogueGainedToday] = useState(false)
  const [greetedOnce, setGreetedOnce] = useState(false)
  const [giftsGivenToday, setGiftsGivenToday] = useState(0)
  const [giftsGivenThisWeek, setGiftsGivenThisWeek] = useState(0)
  const [weekIndex, setWeekIndex] = useState(0)
  const [logEntries, setLogEntries] = useState([])
  const [weather, setWeather] = useState('sunny')
  const [festival, setFestival] = useState(null)
  const [currentGifts, setCurrentGifts] = useState(getRandomGifts())
  const contentRef = useRef(null)
  const [messages, setMessages] = useState([
    { sender:'stamp', text: formatDate({year:1,seasonIndex:0,dayOfSeason:1}) }
  ])
  const [giftOpen, setGiftOpen] = useState(false)
  const [logOpen, setLogOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [contextOptions, setContextOptions] = useState(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [dialogues, setDialogues] = useState([
    { 
      firstMeet:'否', 
      season:'spring', 
      weekday:'fri', 
      day:'any', 
      heartsAtLeast:0, 
      location:'any', 
      weather:'any', 
      marriage:'any', 
      yearParity:'any', 
      festival:'none', 
      trigger:'hello', 
      npcLine:'唉……要是燃油没那么贵，我今天就会骑着摩托车去城里了。那么你是如何打发空闲时间的？', 
      options:[
        { label:'继续耕种（不加分）', playerText:'继续耕种', delta:0, sebResponse:'是吗？嗯……不是我的心头好，但是各花入各眼吧。' },
        { label:'漫画书（+30）', playerText:'漫画书', delta:30, sebResponse:'是吗？那你看过最新的《山洞冒险故事X》吗？我不会剧透，但是那剧情可真是……' },
        { label:'采购（-30）', playerText:'采购', delta:-30, sebResponse:'是吗？嗯……不是我的心头好，但是各花入各眼吧。' },
        { label:'运动（-30）', playerText:'运动', delta:-30, sebResponse:'是吗？嗯……不是我的心头好，但是各花入各眼吧。' },
      ]
    }
  ])

  // Editor temp form state
  const [draft, setDraft] = useState({ firstMeet:'否', season:'any', weekday:'any', day:'any', heartsAtLeast:0, location:'any', weather:'sunny', marriage:'any', yearParity:'any', festival:'none', trigger:'hello', npcLine:'', options:[] })
  const [draftOpt, setDraftOpt] = useState({ label:'', playerText:'', delta:0, sebResponse:'' })

  const dateString = useMemo(()=>formatDate({year,seasonIndex,dayOfSeason}),[year,seasonIndex,dayOfSeason])
  const hearts = computeHearts(friendshipPoints)
  const weekNumber = useMemo(()=> Math.floor((dayOfSeason-1)/7)+1, [dayOfSeason])

  function addLog(title, reason, value){
    setLogEntries(prev=>[{date:dateString, type:reason, value, text:title}, ...prev])
  }

  function addFriendship(amount, reason){
    setFriendshipPoints(prev=>{
      const next = Math.max(0, Math.min(prev + amount, 2500))
      const delta = next - prev
      addLog(delta!==0?`好感变动 +${delta}`:'好感未变', reason, delta)
      return next
    })
  }

  function appendMessage(sender, text){
    setMessages(prev=>[...prev, {sender, text, date:dateString}])
  }

  function weekdayIndex(){
    return (dayOfSeason - 1) % 7 // 0=Mon ... 4=Fri
  }

  function isFriday(){
    return weekdayIndex() === 4
  }

  function getOptions(){
    if (contextOptions && contextOptions.length>0) return contextOptions
    // 如果今天已经打过招呼，不显示打招呼选项
    if (dialogueGainedToday) return []
    return [
      { id:'hello', label:'👋 打招呼', effect:()=>sebReply('hello') }
    ]
  }

  function optionText(id){
    const map = {hello:'👋 打招呼', weather:'天气怎么样？', work:'你的项目怎么样了'}
    return map[id] || '……'
  }

  function matchesDialogue(d){
    // first meet condition
    if (d.firstMeet === '是' && greetedOnce) return false
    // season
    const seasonMap = ['spring','summer','fall','winter']
    if (d.season && d.season !== 'any') {
      if (seasonMap[seasonIndex] !== d.season) return false
    }
    // weekday
    const weekdayMap = ['mon','tue','wed','thu','fri','sat','sun']
    if (d.weekday && d.weekday !== 'any') {
      if (weekdayMap[weekdayIndex()] !== d.weekday) return false
    }
    // day of season
    if (d.day && d.day !== 'any') {
      if (Number(d.day) !== dayOfSeason) return false
    }
    // hearts at least
    if (typeof d.heartsAtLeast === 'number' && d.heartsAtLeast > 0) {
      if (hearts < d.heartsAtLeast) return false
    }
    // location (not tracked yet) → only check when specific
    // weather
    if (d.weather && d.weather !== 'any') {
      if (weather !== d.weather) return false
    }
    // marriage (not tracked) → only pass when 'any'
    if (d.marriage && d.marriage !== 'any') {
      // unknown state, treat as not matched
      return false
    }
    // year parity
    if (d.yearParity && d.yearParity !== 'any') {
      const parity = year % 2 === 0 ? 'even' : 'odd'
      if (parity !== d.yearParity) return false
    }
    // festival
    if (d.festival) {
      if (d.festival === 'none') { if (festival !== null) return false } else { if (festival === null) return false }
    }
    return true
  }

  function sebReply(topic){
    let reply = ''
    if (topic==='hello'){
      // find dynamic match from editor
      const match = dialogues.find(d => d.trigger==='hello' && matchesDialogue(d))
      if (match){
        appendMessage('me', optionText(topic))
        appendMessage('seb', match.npcLine)
        setContextOptions(match.options.map((opt, idx)=>({ id:`opt-${idx}`, label:opt.label, effect:()=>{
          appendMessage('me', opt.playerText || opt.label)
          appendMessage('seb', opt.sebResponse)
          if (!dialogueGainedToday){ addFriendship(20, '对话'); setDialogueGainedToday(true) } else { addLog('好感未变','对话',0) }
          setContextOptions(null)
        }})))
        return
      }
      // default hello
      if (!greetedOnce){
        appendMessage('me', optionText(topic))
        appendMessage('seb', '噢。你是刚搬进来的，对吧？')
        setGreetedOnce(true)
        // 提供回复选项
        setContextOptions([
          { 
            id: 'yes-nice', 
            label: '是的，见到你很高兴', 
            effect: () => {
              appendMessage('me', '是的，见到你很高兴')
              appendMessage('seb', '好啊。那么多地方你不选，偏偏选中了鹈鹕镇？')
              appendMessage('me', '…………')
              if (!dialogueGainedToday){ addFriendship(20, '对话'); setDialogueGainedToday(true) } else { addLog('好感未变','对话',0) }
              setContextOptions(null)
            }
          }
        ])
        return
      }
      reply='哦，嗨。今天在忙农场吗？'
    }
    else if (topic==='weather'){ reply='下雨天更有灵感。我喜欢雨声敲窗的感觉。' }
    else if (topic==='work'){ reply='我在修个小工具。等它能跑起来再给你看。' }
    appendMessage('me', optionText(topic))
    appendMessage('seb', reply)
    if (!dialogueGainedToday){
      addFriendship(20, '对话')
      setDialogueGainedToday(true)
    } else {
      // no additional friendship gain beyond first conversation today
      addLog('好感未变', '对话', 0)
    }
  }

  function canGift(giftId){
    // 星之果茶不受每日限制
    if (giftId === 'StardropTea') {
      return giftsGivenThisWeek < 2
    }
    // 其他礼物每天只能送一个
    return giftsGivenToday < 1 && giftsGivenThisWeek < 2
  }

  function isSebastianBirthday(){
    // 塞巴斯提安生日：冬季10日
    return seasonIndex === 3 && dayOfSeason === 10
  }

  function giveGift(g){
    if (!canGift(g.id)) { 
      if (giftsGivenToday >= 1 && g.id !== 'StardropTea') {
        appendMessage('system','今天已送过礼物。')
      } else {
        appendMessage('system','本周已送过两次礼物。')
      }
      return 
    }
    setGiftsGivenThisWeek(x=>x+1)
    // 星之果茶不受每日限制
    if (g.id !== 'StardropTea') {
      setGiftsGivenToday(x=>x+1)
    }
    appendMessage('me', `送出礼物：${g.name}`)
    
    let reaction = ''
    
    // 特殊礼物的专属回复
    if (g.id === 'VoidEgg') {
      const voidEggReactions = [
        '哇……这个蛋好像能跟我说话……我就放在桌子上吧，谢谢你！',
        '唔……如果我把它放在枕头下面，能不能孵出小鸡？嘿嘿……试试就知道了。'
      ]
      reaction = voidEggReactions[Math.floor(Math.random() * voidEggReactions.length)]
    } else if (g.id === 'Obsidian') {
      reaction = '这是黑曜石吧？我正好想要一块……我想试试把它削成一把匕首。'
    } else if (g.id === 'PumpkinSoup') {
      reaction = '你给我带了汤？我很喜欢。这让我想起了很多往事……'
    } else if (g.id === 'Sashimi') {
      const sashimiReactions = [
        '我超喜欢这个，你怎么知道的？',
        '嗯……一旦你习惯了吃生鱼，就会很上瘾。'
      ]
      reaction = sashimiReactions[Math.floor(Math.random() * sashimiReactions.length)]
    } else if (g.id === 'FrozenTear') {
      reaction = '我真的很喜欢这东西。你怎么会知道的？'
    } else if (g.id === 'GreenFrogEgg') {
      reaction = '哎，这是青蛙蛋吧！我要试试能不能孵出来，谢谢你！'
    } else if (g.id === 'StardropTea') {
      reaction = '哎，谢谢你，等天黑了我就喝。'
    } else {
      // 一般回复
      if (g.category === '最爱') reaction='我真的很喜欢这东西。你怎么会知道的？'
      else if (g.category === '喜欢') reaction='谢谢，我喜欢这个。'
      else if (g.category === '一般') reaction='……谢谢。'
      else if (g.category === '不喜欢') reaction='……？'
      else if (g.category === '讨厌') reaction='……我讨厌这个。'
    }
    
    appendMessage('seb', reaction)
    
    // 计算好感度变化（生日8倍加成）
    let points = g.points
    if (isSebastianBirthday()) {
      points = g.points * 8
      appendMessage('system', `今天是塞巴斯提安的生日！好感度变化 ×8`)
    }
    
    addFriendship(points,'送礼')
    setGiftOpen(false)
  }

  function showToast(text){
    setToast(text)
    setTimeout(()=> setToast(null), 900)
  }

  function getWeatherForDay(season, day, yearNum){
    // 冬季不下雨
    if (season === 3) return 'sunny'
    
    // 夏季13、26日必定是雷雨
    if (season === 1 && (day === 13 || day === 26)) return 'rainy'
    
    // 第一年特殊天气
    if (yearNum === 1) {
      if (day === 1 || day === 2 || day === 4) return 'sunny'
      if (day === 3) return 'rainy'
    }
    
    // 夏季苔雨随机发生一次
    if (season === 1) {
      const mossDays = [5, 6, 7, 14, 15, 16, 18, 23]
      if (mossDays.includes(day)) {
        // 每年夏季随机选择一天作为苔雨日
        const seed = yearNum * 100 + season * 10 + day
        if (seed % 8 === 0) return 'moss'
      }
    }
    
    // 其他情况随机
    const weathers = ['sunny', 'rainy']
    return weathers[Math.floor(Math.random() * weathers.length)]
  }

  function nextDay(){
    setDialogueGainedToday(false)
    setGiftsGivenToday(0)
    let nd = dayOfSeason + 1
    let ns = seasonIndex
    let ny = year
    if (nd > 28) { 
      nd = 1
      ns = (seasonIndex + 1) % 4
      if (ns === 0) ny = year + 1
    }
    setDayOfSeason(nd)
    setSeasonIndex(ns)
    setYear(ny)
    const newWeek = Math.floor((nd - 1)/7)
    if (newWeek !== weekIndex) setGiftsGivenThisWeek(0)
    setWeekIndex(newWeek)
    setWeather(getWeatherForDay(ns, nd, ny))
    setFestival(pickFestival(ns, nd))
    // 每天刷新礼物选择
    setCurrentGifts(getRandomGifts())
    // prepend day timestamp for the new day start
    const stamp = formatDate({year: ny, seasonIndex: ns, dayOfSeason: nd})
    setMessages(prev=>[...prev, { sender:'stamp', text: stamp }])
  }

  function pickFestival(season, day){
    // simple sample festivals per season/day, can expand later
    const map = {
      0: { 13: '彩蛋节', 24: '花舞节' },
      1: { 11: '卢奥盛宴', 28: '跃鲤夜市' },
      2: { 16: '星露谷展会', 27: '万灵节' },
      3: { 8: '冰钓节', 25: '盛冬星夜' }
    }
    return map[season]?.[day] || null
  }

  const gifts = currentGifts

  function scrollToBottom(){
    const el = contentRef.current
    if (!el) return
    // ensure DOM updated before scrolling
    requestAnimationFrame(()=>{
      el.scrollTop = el.scrollHeight
    })
  }

  useEffect(()=>{
    scrollToBottom()
  }, [messages.length])

  return (
    <div className="app">
      <header className="topHeader">
      <div>
          <img className="avatarLarge" src={sebHeaderAvatar} alt="Sebastian" onError={e => e.target.src = fallbackSeb} />
        </div>
        <div style={{flex:1}}>
          <div className="nameRow">
            <h1 className="name">塞巴斯提安</h1>
            <span className="dateDisplay" onClick={nextDay}>{dateString} · 第{weekNumber}周</span>
          </div>
          <p className="intro">夜猫子程序员，喜欢摩托、电脑、独处和下雨天。</p>
          <div className="dayMeta">
            <span className="badge"><span className="emoji">{weather==='sunny'?'☀️':weather==='rainy'?'🌧️':'🌿'}</span>{weather==='sunny'?'晴天':weather==='rainy'?'雨天':'苔雨'}</span>
            {festival && <span className="badge"><span className="emoji">🎉</span>{festival}</span>}
          </div>
          <div className="friendship">
            <span className="label">好感：</span>
            <span className="points">{friendshipPoints}/2500</span>
            <div className="hearts">
              {Array.from({length:10}).map((_,i)=>{
                const filled = i < hearts
                return <img key={i} className={`heart${filled?' filled':''}`} src={filled?heartFull:heartEmpty} alt={filled?'♥':'♡'} />
              })}
            </div>
          </div>
          <div className="progress">
            <span>对话 {dialogueGainedToday?1:0}/1</span>
            <span className="dot">•</span>
            <span>送礼 {giftsGivenToday}/1 (本周{giftsGivenThisWeek}/2)</span>
          </div>
        </div>
      </header>

      <main className="content" ref={contentRef}>
        <section className="chat">
          {messages.map((m,idx)=>{
            if (m.sender==='stamp') return <div key={idx} className="dayStamp"><span>{m.text}</span></div>
            return (
              <div key={idx}>
                <div className={`msg ${m.sender}`}>
                  <img className="avatar" src={m.sender==='seb'?sebChatAvatar:fallbackMe} onError={(e)=>{e.currentTarget.src=fallbackSeb}} alt={m.sender==='seb'?'Sebastian':'我'} />
                  <div className="bubble">{m.text}</div>
                </div>
              </div>
            )
          })}
          <div className="quickOptions">
            {getOptions().map(o=> (
              <button key={o.id} className="optionBtn" onClick={o.effect}>{o.label}</button>
            ))}
          </div>
        </section>
      </main>

      <footer className="composer">
        <div className="actions">
          <button className="btn icon-btn" onClick={()=>setEditorOpen(true)} title="对话编辑器">⚙️</button>
          <button className="btn" onClick={()=>{ if (canGift()) setGiftOpen(true); else appendMessage('system','今天已送过礼物或本周送礼次数已满。') }}>送礼</button>
          <button className="btn" onClick={()=>setLogOpen(true)}>好感度变化</button>
          <button className="btn" onClick={()=>{ 
            nextDay() 
          }}>结束今天去睡觉</button>
        </div>
      </footer>

      <div className={`sheet ${giftOpen?'open':''} ${giftOpen?'':'hidden'}`} role="dialog" aria-modal="true">
        <div className="sheetHeader">
          <span>选择礼物（每天最多1个，星之果茶除外）</span>
          <button className="iconBtn" onClick={()=>setGiftOpen(false)}>✕</button>
        </div>
        <div className="giftGrid">
          {gifts.map(g=> (
            <button key={g.id} className="gift" onClick={()=>giveGift(g)}>
              <img src={`/gifts/${g.id}.png`} alt={g.name} onError={(e)=>{e.target.style.display='none'}} />
              <span>{g.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`modal ${logOpen?'':'hidden'}`} role="dialog" aria-modal="true">
        <div className="modalCard">
          <div className="modalHeader">
            <h3>好感度变化</h3>
            <button className="iconBtn" onClick={()=>setLogOpen(false)}>✕</button>
          </div>
          <div className="modalContent">
            {logEntries.filter(e=>e.value!==0).length===0 ? <p>暂无变化</p> : logEntries.filter(e=>e.value!==0).map((e,i)=>(
              <div key={i} className="log-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid #1c2833'}}>
                <div><strong>{e.value>0?`+${e.value}`:e.value}</strong> <span style={{color:'#c7d2de'}}>{e.type}</span></div>
                <div className="meta" style={{fontSize:'11px', color:'#9fb3c8'}}>{e.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Dialogue Editor */}
      <div className={`modal ${editorOpen?'':'hidden'}`} role="dialog" aria-modal="true">
        <div className="modalCard">
          <div className="modalHeader">
            <h3>对话编辑器</h3>
            <button className="iconBtn" onClick={()=>setEditorOpen(false)}>✕</button>
          </div>
          <div className="modalContent">
            <div className="row" style={{gridTemplateColumns:'120px 120px 120px 1fr'}}>
              <select value={draft.firstMeet} onChange={e=>setDraft({...draft, firstMeet:e.target.value})}>
                <option value={'否'}>初次见面/否</option>
                <option value={'是'}>初次见面/是</option>
              </select>
              <select value={draft.season} onChange={e=>setDraft({...draft, season:e.target.value})}>
                <option value={'any'}>季节/不限</option>
                <option value={'spring'}>季节/春</option>
                <option value={'summer'}>季节/夏</option>
                <option value={'fall'}>季节/秋</option>
                <option value={'winter'}>季节/冬</option>
              </select>
              <select value={draft.weekday} onChange={e=>setDraft({...draft, weekday:e.target.value})}>
                <option value={'any'}>星期/不限</option>
                <option value={'mon'}>星期/星期一</option>
                <option value={'tue'}>星期/星期二</option>
                <option value={'wed'}>星期/星期三</option>
                <option value={'thu'}>星期/星期四</option>
                <option value={'fri'}>星期/星期五</option>
                <option value={'sat'}>星期/星期六</option>
                <option value={'sun'}>星期/星期日</option>
              </select>
              <select value={draft.trigger} onChange={e=>setDraft({...draft, trigger:e.target.value})}>
                <option value={'hello'}>打招呼</option>
                <option value={'weather'}>聊天气</option>
                <option value={'work'}>问项目</option>
              </select>
              <input placeholder="塞巴斯台词（触发后）" value={draft.npcLine} onChange={e=>setDraft({...draft, npcLine:e.target.value})} />
            </div>
            <div className="row" style={{gridTemplateColumns:'repeat(5, 1fr)'}}>
              <select value={draft.day} onChange={e=>setDraft({...draft, day:e.target.value})}>
                <option value={'any'}>日期/不限</option>
                {Array.from({length:28}).map((_,i)=> <option key={i+1} value={String(i+1)}>日期/{i+1}</option>)}
              </select>
              <select value={draft.heartsAtLeast} onChange={e=>setDraft({...draft, heartsAtLeast:Number(e.target.value)})}>
                <option value={0}>好感/不限</option>
                <option value={2}>好感/2心及以上</option>
                <option value={4}>好感/4心及以上</option>
                <option value={6}>好感/6心及以上</option>
                <option value={8}>好感/8心及以上</option>
                <option value={10}>好感/10心及以上</option>
              </select>
              <select value={draft.location} onChange={e=>setDraft({...draft, location:e.target.value})}>
                <option value={'any'}>地点/不限</option>
                <option value={'mountain'}>地点/山区</option>
                <option value={'mountain-lake'}>地点/在山区的湖边</option>
              </select>
              <select value={draft.weather} onChange={e=>setDraft({...draft, weather:e.target.value})}>
                <option value={'sunny'}>天气/晴天</option>
                <option value={'rainy'}>天气/雨天</option>
                <option value={'moss'}>天气/苔雨</option>
              </select>
              <select value={draft.marriage} onChange={e=>setDraft({...draft, marriage:e.target.value})}>
                <option value={'any'}>婚姻/不限</option>
                <option value={'engaged'}>婚姻/订婚后</option>
                <option value={'divorced'}>婚姻/离婚后</option>
                <option value={'married'}>婚姻/结婚后</option>
              </select>
            </div>
            <div className="row" style={{gridTemplateColumns:'repeat(2, 1fr)'}}>
              <select value={draft.yearParity} onChange={e=>setDraft({...draft, yearParity:e.target.value})}>
                <option value={'any'}>年份/不限</option>
                <option value={'odd'}>年份/奇数</option>
                <option value={'even'}>年份/偶数</option>
              </select>
              <select value={draft.festival} onChange={e=>setDraft({...draft, festival:e.target.value})}>
                <option value={'none'}>节日/非节日</option>
                <option value={'egg'}>节日/复活节</option>
                <option value={'desert'}>节日/沙漠节</option>
                <option value={'flower'}>节日/花舞节</option>
                <option value={'luau'}>节日/夏威夷宴会</option>
                <option value={'jelly'}>节日/月光水母起舞</option>
                <option value={'fair'}>节日/星露谷展览会</option>
                <option value={'spirit'}>节日/万灵节</option>
                <option value={'ice'}>节日/冰雪节</option>
                <option value={'nightmarket'}>节日/夜市</option>
                <option value={'feast'}>节日/冬日盛宴</option>
              </select>
            </div>
            <div className="row" style={{gridTemplateColumns:'1fr'}}>
              <div className="opts">
                {draft.options?.map((o,idx)=> (
                  <span key={idx} className="pill">
                    {o.label}
                    <span style={{color:o.delta>=0?'#7dd3a7':'#f59aa9'}}>{o.delta>0?`+${o.delta}`:o.delta}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="row" style={{gridTemplateColumns:'140px 1fr 80px 1fr'}}>
              <input placeholder="按钮文案" value={draftOpt.label} onChange={e=>setDraftOpt({...draftOpt, label:e.target.value})} />
              <input placeholder="玩家台词" value={draftOpt.playerText} onChange={e=>setDraftOpt({...draftOpt, playerText:e.target.value})} />
              <input placeholder="好感变化" type="number" value={draftOpt.delta} onChange={e=>setDraftOpt({...draftOpt, delta:Number(e.target.value)})} />
              <input placeholder="塞巴斯回应" value={draftOpt.sebResponse} onChange={e=>setDraftOpt({...draftOpt, sebResponse:e.target.value})} />
            </div>
            <div className="row" style={{gridTemplateColumns:'1fr 1fr'}}>
              <button className="btn" onClick={()=>{
                setDraft({...draft, options:[...(draft.options||[]), {...draftOpt}]})
                setDraftOpt({ label:'', playerText:'', delta:0, sebResponse:'' })
              }}>添加选项</button>
              <button className="btn primary" onClick={()=>{
                setDialogues(prev=>[...prev, {...draft}])
                setDraft({ firstMeet:'否', season:'any', weekday:'any', day:'any', heartsAtLeast:0, location:'any', weather:'sunny', marriage:'any', yearParity:'any', festival:'none', trigger:'hello', npcLine:'', options:[] })
                showToast('已添加对话')
              }}>保存对话</button>
            </div>
            <div style={{marginTop:8}}>
              {dialogues.map((d,i)=> (
                <div key={i} className="row" style={{gridTemplateColumns:'1fr'}}>
                  <div style={{fontSize:12,color:'#9fb3c8'}}>
                    条件：{d.firstMeet==='是'?'初见/是':'初见/否'} / {d.season==='any'?'季节/不限':d.season} / {d.weekday==='any'?'星期/不限':d.weekday} / {d.day==='any'?'日期/不限':`日期/${d.day}`} / 好感≥{d.heartsAtLeast||0}心 / {d.location==='any'?'地点/不限':d.location} / {d.weather==='moss'?'苔雨':d.weather==='rainy'?'雨天':'晴天'} / {d.marriage==='any'?'婚姻/不限':d.marriage} / {d.yearParity==='any'?'年份/不限':d.yearParity} / {d.festival==='none'?'非节日':`节日/${d.festival}`} · 触发：{d.trigger}
                  </div>
                  <div style={{marginTop:6}}>{d.npcLine}</div>
                  <div className="opts" style={{marginTop:6}}>
                    {d.options.map((o,idx)=> (
                      <span key={idx} className="pill">{o.label}<span style={{color:o.delta>=0?'#7dd3a7':'#f59aa9'}}>{o.delta>0?`+${o.delta}`:o.delta}</span></span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
