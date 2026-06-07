const state = {
  gender: '男性',
  age: '所有年齡層',
  occasion: '日常休閒',
  accessories: [],
  functions: []
};

const GPT_ASSISTANT_URL = 'https://chatgpt.com/g/g-6a1d87b0c6b48191aaa400c9c937a813-ai-wear-r-u-zhi-hui-chuan-da-gu-wen-ping-tai';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function buildPrompt(){
  state.age = $('#age').value;

  const customOccasion = $('#customOccasion').value.trim();
  const finalOccasion = customOccasion || state.occasion;
  const accessories = state.accessories.length ? state.accessories.join('、') : '無特別指定';
  const functions = state.functions.length
  ? state.functions.join('、')
  : '完整專業分析';


 return `我是 ${state.gender}，年齡層是「${state.age}」，我要去「${finalOccasion}」，希望搭配的配件有「${accessories}」。

   我希望達成的形象目標與分析功能有：「${functions}」。

   請用 AI WEAR R U 專業個人形象顧問角度協助我。
   
   如果使用者選擇：

     💼 面試形象
         請分析專業度、可信度、面試印象與服裝建議。

     👨‍🏫 講師形象
         請分析權威感、親和力與舞台形象。

     🏢 職場形象
         請分析職場專業度與升遷形象。

      ⭐ 個人品牌打造
         請分析個人辨識度、風格定位與品牌特色。

      👵 熟齡形象設計
         請分析年齡優勢、氣質呈現與高級感穿搭。

        我接下來會上傳照片，可能是全身照、半身照或自拍照。

          請先依照照片類型自動判斷：

         1. 全身照：完整穿搭 Before / After 改造
         2. 半身照：上半身穿搭＋髮型設計
         3. 自拍照：臉型、髮型、配件與上身造型分析

        如果使用者選擇 AI虛擬改造功能，
            請優先產生改造圖卡。

        如果使用者選擇穿搭分析功能，
            請優先提供穿搭分析圖卡。

        不要一開始就輸出長篇文字。

        圖卡完成後，請詢問我是否需要進一步說明，並用編號列出選項。`;
    }

function updatePrompt(){
  const prompt = buildPrompt();
  $('#promptPreview').value = prompt;
  $('#gptLink').href = GPT_ASSISTANT_URL;
}

function showToast(message){
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

$$('.choice-row .choice').forEach(button => {
  button.addEventListener('click', () => {
    $$('.choice-row .choice').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    state.gender = button.dataset.value;
    updatePrompt();
  });
});

$$('.pill-grid .pill').forEach(button => {
  button.addEventListener('click', () => {
    $$('.pill-grid .pill').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    state.occasion = button.dataset.value;
    $('#customOccasion').value = '';
    updatePrompt();
  });
});

$$('#accessories button').forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    button.classList.toggle('is-active');

    if (state.accessories.includes(value)) {
      state.accessories = state.accessories.filter(item => item !== value);
    } else {
      state.accessories.push(value);
    }

    updatePrompt();
  });
});

$('#age').addEventListener('change', updatePrompt);
$('#customOccasion').addEventListener('input', updatePrompt);

$('#generatePrompt').addEventListener('click', async () => {
  updatePrompt();

  const prompt = $('#promptPreview').value;
  await navigator.clipboard.writeText(prompt);

  addAnalysisCount();

  location.hash = '#assistant';
  showToast('已產生並複製 AI 穿搭分析指令！');
});

$('#copyPromptBtn').addEventListener('click', async () => {
  const prompt = $('#promptPreview').value;
  await navigator.clipboard.writeText(prompt);
  showToast('已複製 AI 穿搭分析指令！');
});

$('#clearPromptBtn').addEventListener('click', () => {
  $('#promptPreview').value = '';

  state.accessories = [];
  state.functions = [];

  $$('#accessories button').forEach(button => {
    button.classList.remove('is-active');
  });

  $$('.func-group input').forEach(item => {
    item.checked = false;
  });

  showToast('已清除指令');
});

updatePrompt();

const virtualFunctions = [
  'AI Before After',
  'AI換髮型',
  'AI換鞋款',
  'AI全套改造'
];

document.querySelectorAll('.func-group input').forEach(item => {
  item.addEventListener('change', () => {
    state.functions = state.functions.filter(f => f !== '完整專業分析');

    const value = item.value;

    if (item.checked) {

      if (virtualFunctions.includes(value)) {
        document.querySelectorAll('.func-group input').forEach(cb => {
          if (virtualFunctions.includes(cb.value) && cb !== item) {
            cb.checked = false;
            state.functions = state.functions.filter(f => f !== cb.value);
          }
        });
      }

      if (!state.functions.includes(value)) {
        state.functions.push(value);
      }

    } else {
      state.functions = state.functions.filter(f => f !== value);
    }

    updatePrompt();
  });
});

$('#fullAnalysisBtn').addEventListener('click', () => {
  state.functions = ['完整專業分析'];

  $$('.func-group input').forEach(item => {
    item.checked = false;
  });

  updatePrompt();
  showToast('已選擇完整專業分析！');
});



const STATS_API = "https://script.google.com/macros/s/AKfycbwYBbZ_VWWz0Z5bbiSy35PYEeugPfJ5V_8SSI0DB-Ze4saMEQVYmDuR8hl6ZJ5IgZ3F/exec";

function jsonp(url, callbackName) {
  const script = document.createElement("script");
  script.src = url + (url.includes("?") ? "&" : "?") + "callback=" + callbackName;
  document.body.appendChild(script);

  script.onload = () => {
    script.remove();
  };
}

function getCurrentOccasion() {
  const customOccasion = $('#customOccasion').value.trim();
  return customOccasion || state.occasion || '日常休閒';
}

function getCurrentFunctions() {
  return state.functions.length
    ? state.functions.join('、')
    : '完整專業分析';
}

function getCurrentAccessories() {
  return state.accessories.length
    ? state.accessories.join('、')
    : '無特別指定';
}

function loadStats() {
  window.handleStats = function(data) {
    document.getElementById("analysisCount").textContent =
      data.totalAnalysis + "+";

    document.getElementById("visitorCount").textContent =
      data.totalVisitors + "+";
  };

  jsonp(STATS_API, "handleStats");
}

function addAnalysisCount() {
  window.handleAddAnalysis = function(data) {
    document.getElementById("analysisCount").textContent =
      data.totalAnalysis + "+";
  };

  const params = new URLSearchParams({
    action: "addAnalysis",
    gender: state.gender,
    age: $('#age').value,
    occasion: getCurrentOccasion(),
    functions: getCurrentFunctions(),
    accessories: getCurrentAccessories()
  });

  jsonp(STATS_API + "?" + params.toString(), "handleAddAnalysis");
}

loadStats();