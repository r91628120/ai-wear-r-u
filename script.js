const state = {
  gender: '男性',
  age: '所有年齡層',
  occasion: '日常休閒',
  accessories: []
};

const GPT_ASSISTANT_URL = 'https://chatgpt.com/g/g-6a1d87b0c6b48191aaa400c9c937a813-ai-wear-r-u-zhi-hui-chuan-da-gu-wen-ping-tai';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function updateSummary() {
  state.age = $('#age').value;
  const customOccasion = $('#customOccasion').value.trim();
  const finalOccasion = customOccasion || state.occasion;

  $('#summaryGender').textContent = state.gender;
  $('#summaryAge').textContent = state.age;
  $('#summaryOccasion').textContent = finalOccasion;
  $('#summaryAccessories').textContent = state.accessories.length ? state.accessories.join('、') : '尚未選擇';

  const prompt = `我是 ${state.gender}，年齡層是「${state.age}」，我要去「${finalOccasion}」，希望搭配的配件有「${state.accessories.length ? state.accessories.join('、') : '無特別指定'}」。請用 AI WEAR R U 專業穿搭顧問角度，幫我分析適合的穿搭、顏色、鞋子、包包與配件，並請提醒我可以上傳照片進一步分析。`;

  $('#promptPreview').value = prompt;
  $('#gptLink').href = `${GPT_ASSISTANT_URL}?q=${encodeURIComponent(prompt)}`;
}

$$('.choice-row .choice').forEach(button => {
  button.addEventListener('click', () => {
    $$('.choice-row .choice').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    state.gender = button.dataset.value;
    updateSummary();
  });
});

$$('.pill-grid .pill').forEach(button => {
  button.addEventListener('click', () => {
    $$('.pill-grid .pill').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active');
    state.occasion = button.dataset.value;
    $('#customOccasion').value = '';
    updateSummary();
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
    updateSummary();
  });
});

$('#age').addEventListener('change', updateSummary);
$('#customOccasion').addEventListener('input', updateSummary);

$('#generatePrompt').addEventListener('click', () => {
  updateSummary();
  location.hash = '#assistant';
});

$('#editPreference').addEventListener('click', () => {
  location.hash = '#top';
});

updateSummary();

document.getElementById("copyPromptBtn")
.addEventListener("click",()=>{

const prompt =
document.getElementById("promptPreview").value;

navigator.clipboard.writeText(prompt);

alert("已複製穿搭指令，可直接貼到 GPT 助理");

});

document.getElementById("clearPromptBtn")
.addEventListener("click",()=>{

document.getElementById("promptPreview").value = "";

state.accessories = [];

updateSummary();

});