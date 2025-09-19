import { useMemo, useState, useRef, useEffect } from 'react'
import './App.css'

const SEASONS = ["春", "夏", "秋", "冬"]
const WEEKDAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]

const heartEmpty = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><path fill='%23aa5a67' fill-opacity='0.3' d='M6 10.5s-4.5-2.5-4.5-6a2.625 2.625 0 0 1 4.5-1.83A2.625 2.625 0 0 1 10.5 4.5c0 3.5-4.5 6-4.5 6z'/></svg>"
const heartFull = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12'><path fill='%23DF0000' d='M6 10.5s-4.5-2.5-4.5-6a2.625 2.625 0 0 1 4.5-1.83A2.625 2.625 0 0 1 10.5 4.5c0 3.5-4.5 6-4.5 6z'/></svg>"

// 刮奖券样式组件
const ScratchCard = ({ isRevealed, content, placeholder = "待触发" }) => {
  if (isRevealed) {
    return <span style={{color:'#2C2522'}}>{content}</span>
  }
  return (
    <div style={{
      backgroundColor: '#F5DEB3',
      color: '#999999',
      padding: '6px 20px',
      borderRadius: '6px',
      border: '2px solid #8B4513',
      display: 'inline-block',
      fontSize: '14px',
      fontWeight: 'normal',
      textAlign: 'center',
      width: '90%',
      marginRight: '4px'
    }}>{placeholder}</div>
  )
}

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
  { id: 'StardropTea', name: '星之果茶', points: 250, category: '最爱' },
  
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
  // 从每个分类中随机选择一些礼物，总共16个，其中必包含星之果茶
  const favorite = allGifts.filter(g => g.category === '最爱' && g.id !== 'StardropTea')
  const like = allGifts.filter(g => g.category === '喜欢')
  const neutral = allGifts.filter(g => g.category === '一般')
  const dislike = allGifts.filter(g => g.category === '不喜欢')
  const hate = allGifts.filter(g => g.category === '讨厌')
  const stardropTea = allGifts.find(g => g.id === 'StardropTea')
  
  const selected = [
    stardropTea, // 必选星之果茶
    ...favorite.sort(() => 0.5 - Math.random()).slice(0, 2), // 最爱2个（除了星之果茶）
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

function getWeatherIcon(weather) {
  switch(weather) {
    case 'sunny': return '☀️'
    case 'rainy': return '🌧️'
    case 'moss': return '🌫️'
    default: return '☀️'
  }
}

function getWeatherText(weather) {
  switch(weather) {
    case 'sunny': return '晴天'
    case 'rainy': return '雨天'
    case 'moss': return '苔雨'
    default: return '晴天'
  }
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
  const [knowledgeOpen, setKnowledgeOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [contextOptions, setContextOptions] = useState(null)
  const [triggeredReplies, setTriggeredReplies] = useState(new Set())
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

  const dateString = useMemo(()=>formatDate({year,seasonIndex,dayOfSeason}),[year,seasonIndex,dayOfSeason])
  const hearts = computeHearts(friendshipPoints)
  const weekNumber = useMemo(()=> Math.floor((dayOfSeason-1)/7)+1, [dayOfSeason])
  
  // 计算了解程度进度
  const totalReplies = 16 // 总回复数量
  const triggeredCount = triggeredReplies.size
  const knowledgeProgress = Math.round((triggeredCount / totalReplies) * 100)

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

  function recordTriggeredReply(replyId){
    setTriggeredReplies(prev => new Set([...prev, replyId]))
  }

  function weekdayIndex(){
    return (dayOfSeason - 1) % 7 // 0=Mon ... 4=Fri
  }

  function isFriday(){
    return weekdayIndex() === 4
  }

  function getOptions(){
    if (contextOptions && contextOptions.length>0) return contextOptions
    // 如果今天已经产生过对话，不显示任何快捷选项
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
        // 立即设置对话状态，隐藏快捷选项
        setDialogueGainedToday(true)
        
        // 延迟显示塞巴斯的第一句回复
        setTimeout(() => {
          appendMessage('seb', '噢。你是刚搬进来的，对吧？')
          recordTriggeredReply('first-greeting-1')
          
          // 延迟显示玩家的回复
          setTimeout(() => {
            appendMessage('me', '是的，见到你很高兴')
            
            // 延迟显示塞巴斯的第二句回复
            setTimeout(() => {
              appendMessage('seb', '好啊。那么多地方你不选，偏偏选中了鹈鹕镇？')
              recordTriggeredReply('first-greeting-2')
              
              // 延迟显示玩家的最后回复
              setTimeout(() => {
                appendMessage('me', '…………')
                addFriendship(20, '对话')
              }, 1500)
            }, 1500)
          }, 1000)
        }, 1000)
        
        setGreetedOnce(true)
        return
      }
      reply='哦，嗨。今天在忙农场吗？'
      recordTriggeredReply('regular-greeting')
    }
    else if (topic==='weather'){ 
      reply='下雨天更有灵感。我喜欢雨声敲窗的感觉。'
      recordTriggeredReply('weather-talk')
    }
    else if (topic==='work'){ 
      reply='我在修个小工具。等它能跑起来再给你看。'
      recordTriggeredReply('work-talk')
    }
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
    // 星之果茶不受每日和每周限制
    if (giftId === 'StardropTea') {
      return true
    }
    // 其他礼物每天只能送一个，每周最多2个
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
    // 星之果茶不受任何限制
    if (g.id !== 'StardropTea') {
      setGiftsGivenThisWeek(x=>x+1)
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
      recordTriggeredReply('gift-void-egg')
    } else if (g.id === 'Obsidian') {
      reaction = '这是黑曜石吧？我正好想要一块……我想试试把它削成一把匕首。'
      recordTriggeredReply('gift-obsidian')
    } else if (g.id === 'PumpkinSoup') {
      reaction = '你给我带了汤？我很喜欢。这让我想起了很多往事……'
      recordTriggeredReply('gift-pumpkin-soup')
    } else if (g.id === 'Sashimi') {
      const sashimiReactions = [
        '我超喜欢这个，你怎么知道的？',
        '嗯……一旦你习惯了吃生鱼，就会很上瘾。'
      ]
      reaction = sashimiReactions[Math.floor(Math.random() * sashimiReactions.length)]
      recordTriggeredReply('gift-sashimi')
    } else if (g.id === 'FrozenTear') {
      reaction = '我真的很喜欢这东西。你怎么会知道的？'
      recordTriggeredReply('gift-frozen-tear')
    } else if (g.id === 'GreenFrogEgg') {
      reaction = '哎，这是青蛙蛋吧！我要试试能不能孵出来，谢谢你！'
      recordTriggeredReply('gift-frog-egg')
    } else if (g.id === 'StardropTea') {
      reaction = '哎，谢谢你，等天黑了我就喝。'
      recordTriggeredReply('gift-stardrop-tea')
    } else {
      // 一般回复
      if (g.category === '最爱') {
        reaction='我真的很喜欢这东西。你怎么会知道的？'
        recordTriggeredReply('gift-favorite-general')
      }
      else if (g.category === '喜欢') {
        reaction='谢谢，我喜欢这个。'
        recordTriggeredReply('gift-like')
      }
      else if (g.category === '一般') {
        reaction='……谢谢。'
        recordTriggeredReply('gift-neutral')
      }
      else if (g.category === '不喜欢') {
        reaction='……？'
        recordTriggeredReply('gift-dislike')
      }
      else if (g.category === '讨厌') {
        reaction='……我讨厌这个。'
        recordTriggeredReply('gift-hate')
      }
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

  // 移动端视口高度处理
  useEffect(() => {
    const handleResize = () => {
      // 设置CSS自定义属性来处理动态视口高度
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return (
    <div className="app">
      <header className="topHeader">
      <div className="header-section-1">
      <div>
          <img className="avatarLarge" src={sebHeaderAvatar} alt="Sebastian" onError={e => e.target.src = fallbackSeb} />
        </div>
        <div style={{flex:1}}>
          <div className="nameRow">
            <h1 className="name">塞巴斯提安</h1>
            <button className="knowledge-btn-header" onClick={()=>setKnowledgeOpen(true)}>
              <div className="circular-progress">
                <svg className="progress-ring" width="24" height="24">
                  <circle
                    className="progress-ring-circle-bg"
                    stroke="#1c2833"
                    strokeWidth="2"
                    fill="transparent"
                    r="10"
                    cx="12"
                    cy="12"
                  />
                  <circle
                    className="progress-ring-circle"
                    stroke="#4ade80"
                    strokeWidth="2"
                    fill="transparent"
                    r="10"
                    cx="12"
                    cy="12"
                    style={{
                      strokeDasharray: `${2 * Math.PI * 10}`,
                      strokeDashoffset: `${2 * Math.PI * 10 * (1 - knowledgeProgress / 100)}`
                    }}
                  />
                </svg>
                <span className="progress-text">{knowledgeProgress}%</span>
              </div>
            </button>
          </div>
          <p className="intro">夜猫子程序员，喜欢摩托、电脑、独处和下雨天。</p>
          <div className="dateInfo">
            <span className="dateDisplay dateDisplay-left">
              第{year}年·{SEASONS[seasonIndex]}季·{dayOfSeason}日·{WEEKDAYS[(dayOfSeason - 1) % 7]}·{getWeatherIcon(weather)}{getWeatherText(weather)}{festival ? `·${festival}` : ''}
            </span>
          </div>
        </div>
      </div>
      
      <div className="header-section-2">
        <div className="friendship-below-avatar">
          <div className="friendship-info">
            <span className="label">好感度：</span>
            <span className="progress-info">{friendshipPoints}/2500</span>
          </div>
          <div className="hearts">
            {Array.from({length:10}).map((_,i)=>{
              const filled = i < hearts
              return <img key={i} className={`heart${filled?' filled':''}`} src={filled?heartFull:heartEmpty} alt={filled?'♥':'♡'} />
            })}
          </div>
          <button className="btn-details-text" onClick={()=>setLogOpen(true)}>详情&gt;</button>
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
                  {m.sender==='seb' && <img className="avatar" src={sebChatAvatar} onError={(e)=>{e.currentTarget.src=fallbackSeb}} alt="Sebastian" />}
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

      <div className="progress-summary">
        <span className="progress-info">对话 {dialogueGainedToday?1:0}/1</span>
        <span className="dot">•</span>
        <span className="progress-info">送礼 {giftsGivenToday}/1 (本周{giftsGivenThisWeek}/2)</span>
      </div>
      
      <footer className="composer">
        <div className="actions">
          <button 
            className={`btn ${dialogueGainedToday ? 'disabled' : ''}`} 
            disabled={dialogueGainedToday}
            onClick={()=>{
              if (dialogueGainedToday) {
                appendMessage('system', '今天已经打过招呼了')
              } else {
                sebReply('hello')
              }
            }}
          >
            👋 打招呼
          </button>
          <button className="btn" onClick={()=>{ if (canGift()) setGiftOpen(true); else appendMessage('system','今天已送过礼物或本周送礼次数已满。') }}>🎁 送礼</button>
          <button className="btn btn-primary btn-end-day" onClick={()=>{ 
            nextDay() 
          }}>😴 结束今天</button>
        </div>
      </footer>

      <div className={`sheet ${giftOpen?'open':''} ${giftOpen?'':'hidden'}`} role="dialog" aria-modal="true">
        <div className="sheetHeader">
          <div className="sheetTitle">
            <div className="sheetMainTitle">选择礼物</div>
            <div className="sheetSubTitle">每天最多1个，每周最多2个，星之果茶无限制</div>
          </div>
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

      <div className={`sheet ${logOpen?'open':''} ${logOpen?'':'hidden'}`} role="dialog" aria-modal="true">
        <div className="sheetHeader">
          <div className="sheetTitle">
            <div className="sheetMainTitle">好感度变化</div>
          </div>
          <button className="iconBtn" onClick={()=>setLogOpen(false)}>✕</button>
        </div>
        <div className="giftGrid logGrid">
          {logEntries.filter(e=>e.value!==0).length===0 ? <p>暂无变化</p> : logEntries.filter(e=>e.value!==0).map((e,i)=>(
            <div key={i} className="log-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'6px 0', borderBottom:'1px solid rgba(28,40,51,0.3)'}}>
              <div><strong style={{color:'#DF0000'}}>{e.value>0?`+${e.value}`:e.value}</strong> <span style={{color:'#2C2522', fontWeight:'bold', fontSize:'14px'}}>{e.type}</span></div>
              <div className="meta" style={{fontSize:'14px', color:'#2C2522'}}>{e.date}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`sheet ${knowledgeOpen?'open':''} ${knowledgeOpen?'':'hidden'}`} role="dialog" aria-modal="true">
        <div className="sheetHeader">
          <div className="sheetTitle">
            <div className="sheetMainTitle">聊天进度</div>
          </div>
          <button className="iconBtn" onClick={()=>setKnowledgeOpen(false)}>✕</button>
        </div>
        <div className="giftGrid logGrid">
            <div style={{padding:'12px 0'}}>
              <div style={{display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px', padding:'16px', backgroundColor:'#F5DEB3', borderRadius:'8px'}}>
                <div className="circular-progress-large">
                  <svg className="progress-ring" width="60" height="60">
                    <circle
                      className="progress-ring-circle-bg"
                      stroke="#1c2833"
                      strokeWidth="4"
                      fill="transparent"
                      r="26"
                      cx="30"
                      cy="30"
                    />
                    <circle
                      className="progress-ring-circle"
                      stroke="#4ade80"
                      strokeWidth="4"
                      fill="transparent"
                      r="26"
                      cx="30"
                      cy="30"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 26}`,
                        strokeDashoffset: `${2 * Math.PI * 26 * (1 - knowledgeProgress / 100)}`
                      }}
                    />
                  </svg>
                  <span className="progress-text-large">{knowledgeProgress}%</span>
                </div>
                <div style={{flex: 1}}>
                  <div style={{color:'#2C2522', fontSize:'18px', fontWeight:'bold'}}>聊天进度</div>
                  <div style={{color:'#2C2522', fontSize:'14px'}}>已收集 {triggeredCount}/{totalReplies} 种回复</div>
                </div>
              </div>
              <h4 style={{color:'#2C2522', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span>对话回复</span>
                <span style={{fontSize:'14px', fontWeight:'normal', color:'#666666'}}>（{Array.from(triggeredReplies).filter(r => r.includes('first-greeting') || r.includes('regular-greeting') || r.includes('weather-talk') || r.includes('work-talk')).length}/4）</span>
              </h4>
              <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('first-greeting-1') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('first-greeting-1') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('first-greeting-1')}
                    content='初次见面第一句："噢。你是刚搬进来的，对吧？"'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('first-greeting-2') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('first-greeting-2') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('first-greeting-2')}
                    content='初次见面第二句："好啊。那么多地方你不选，偏偏选中了鹈鹕镇？"'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('regular-greeting') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('regular-greeting') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('regular-greeting')}
                    content='日常打招呼："哦，嗨。今天在忙农场吗？"'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('weather-talk') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('weather-talk') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('weather-talk')}
                    content='聊天气："下雨天更有灵感。我喜欢雨声敲窗的感觉。"'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('work-talk') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('work-talk') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('work-talk')}
                    content='聊项目："我在修个小工具。等它能跑起来再给你看。"'
                  />
                </div>
              </div>
              
              <h4 style={{color:'#2C2522', marginTop:'20px', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span>礼物回复</span>
                <span style={{fontSize:'14px', fontWeight:'normal', color:'#666666'}}>（{Array.from(triggeredReplies).filter(r => r.includes('gift-')).length}/10）</span>
              </h4>
              <div style={{display:'flex', flexDirection:'column', gap:'8px'}}>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-void-egg') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-void-egg') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-void-egg')}
                    content='虚空蛋专属回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-obsidian') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-obsidian') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-obsidian')}
                    content='黑曜石专属回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-pumpkin-soup') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-pumpkin-soup') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-pumpkin-soup')}
                    content='南瓜汤专属回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-sashimi') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-sashimi') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-sashimi')}
                    content='生鱼片专属回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-frozen-tear') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-frozen-tear') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-frozen-tear')}
                    content='泪晶专属回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-frog-egg') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-frog-egg') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-frog-egg')}
                    content='青蛙蛋专属回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-stardrop-tea') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-stardrop-tea') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-stardrop-tea')}
                    content='星之果茶专属回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-favorite-general') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-favorite-general') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-favorite-general')}
                    content='最爱礼物通用回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-like') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-like') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-like')}
                    content='喜欢礼物回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-neutral') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-neutral') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-neutral')}
                    content='一般礼物回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-dislike') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-dislike') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-dislike')}
                    content='不喜欢礼物回复'
                  />
                </div>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{color: triggeredReplies.has('gift-hate') ? '#4ade80' : '#6b7280'}}>
                    {triggeredReplies.has('gift-hate') ? '✓' : '○'}
                  </span>
                  <ScratchCard 
                    isRevealed={triggeredReplies.has('gift-hate')}
                    content='讨厌礼物回复'
                  />
                </div>
              </div>
            </div>
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
      
      <footer style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        backgroundColor: 'rgba(0,0,0,0.8)',
        color: '#FCEAC7',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '12px',
        zIndex: 1000,
        borderTop: '1px solid #8B4513'
      }}>
        非官方，制作者：小红书@Clever Lab，数据来源：官方wiki
      </footer>
    </div>
  )
}

export default App
