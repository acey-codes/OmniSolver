let selectedStructure = "Beam"; // По умолчанию

// Открыть/закрыть меню
function toggleMenu() 
{let menu = document.getElementById("dropdownMenu");
    if (menu.style.display === "block") 
        {menu.style.display = "none";} 
    else {menu.style.display = "block";}}

// Выбрать тип конструкции
function selectStructure(type) 
{selectedStructure = type;
    document.querySelector(".dropdown-btn").innerText = type;
    document.getElementById("dropdownMenu").style.display = "none";}

// Кнопка Calculate
function calculate() 
{let P = parseFloat(document.getElementById("loadP").value);
    let Q = parseFloat(document.getElementById("loadQ").value);
    let steel = parseFloat(document.getElementById("steel").value);

    if (isNaN(P) || isNaN(Q) || isNaN(steel)) 
        {alert("Введите все данные!");
        return;}

    // Окно ожидания
    document.getElementById("waitScreen").style.display = "flex";

    // Задержка (типо программа считает)
    setTimeout(function() 
    {// Считаем формулу
        let stress = P / (Q * steel);
        let allowable = 24; // Пишет допустимое напряжение 
        let mmax = P * 1.5; // Пример
        let qmax = Q * 1.2; // Пример

        // Заполнить окно результата
        document.getElementById("mmaxValue").innerText = mmax.toFixed(2);
        document.getElementById("qmaxValue").innerText = qmax.toFixed(2);
        document.getElementById("stressValue").innerText = stress.toFixed(2);
        document.getElementById("allowableValue").innerText = allowable.toFixed(2);

        if (stress <= 1) 
            {document.getElementById("verdictText").innerText = "Pass";} 
            else {document.getElementById("verdictText").innerText = "Fail";}

        // Само окно результата
        document.getElementById("waitScreen").style.display = "none";
        document.getElementById("resultScreen").style.display = "flex";}, 
        1500); 
        // 1.5 секунды ждать
        }

// Кнопка Save
function saveResult() 
{let P = document.getElementById("loadP").value;
    let Q = document.getElementById("loadQ").value;
    let steel = document.getElementById("steel").value;

    // Взять уже сохранённые расчёты из памяти или создать новый список
    let saved = JSON.parse(localStorage.getItem("savedCalculations") || "[]");

    // Добавить новый расчёт
    saved.push({ P: P, Q: Q, steel: steel });

    // Сохранить обратно в память
    localStorage.setItem("savedCalculations", JSON.stringify(saved));

    alert("Результат сохранён!");
    document.getElementById("resultScreen").style.display = "none";}

// Кнопка No
function closeResult() 
{document.getElementById("resultScreen").style.display = "none";}

// Загрузка сохранённых расчётов на странице pipeline
function loadSavedCalculations() 
{let savedList = document.getElementById("savedList");
    if (!savedList) return; // если не на странице pipeline, выйти

    let saved = JSON.parse(localStorage.getItem("savedCalculations") || "[]");

    saved.forEach(function(item, index) 
    {let div = document.createElement("div");
        div.className = "saved-item";
        div.innerText = "P=" + item.P + ", Q=" + item.Q + ", Steel=" + item.steel;

        div.onclick = function() 

        { // Сохранить выбранный расчёт в память как "выбранный"
            localStorage.setItem("selectedCalculation", JSON.stringify(item));};

        savedList.appendChild(div);});}

// Запуск конвейера расчёта тип
function runPipeline() 
{let selected = JSON.parse(localStorage.getItem("selectedCalculation") || "null");

    if (!selected) 
        {alert("Выберите расчёт из списка!");
        return;}

    document.getElementById("waitScreen").style.display = "flex";

    setTimeout(function() 
    {let stress = selected.P / (selected.Q * selected.steel);
        let allowable = 24;
        let mmax = selected.P * 1.5;
        let qmax = selected.Q * 1.2;

        document.getElementById("mmaxValue").innerText = mmax.toFixed(2);
        document.getElementById("qmaxValue").innerText = qmax.toFixed(2);
        document.getElementById("stressValue").innerText = stress.toFixed(2);
        document.getElementById("allowableValue").innerText = allowable.toFixed(2);

        if (stress <= 1) 
            {document.getElementById("verdictText").innerText = "Pass";} else 
            {document.getElementById("verdictText").innerText = "Fail";}

        document.getElementById("waitScreen").style.display = "none";
        document.getElementById("resultScreen").style.display = "flex";}, 500);}

// Загрузить расчёты при открытии страницы
window.onload = loadSavedCalculations;