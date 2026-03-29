let state = {
    allQuizzes: [],      
    filteredQuizzes: [], 
    currentQuiz: null,
    qIndex: 0,
    score: 0,
    currentCategory: 'todos'
};

const app = document.getElementById("app");

const categories = {
    'todos': 'quizzes_main.json',
    'personalidad': 'personalidad.json',
    'cine': 'cine.json',
    'supervivencia': 'supervivencia.json',
    'gaming': 'gaming.json',
    'Brawl Stars': 'brawl_stars.json'
};

// Carga inicial
async function init() {
    await loadCategory('todos');
    checkUrlParams();
}

// Función auxiliar para refrescar anuncios (AdSense)
function refreshAds() {
    try {
        (adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
        /* AdSense no cargado aún */
    }
}

async function loadCategory(catKey) {
    try {
        const res = await fetch(`data/${categories[catKey]}`);
        const data = await res.json();
        state.allQuizzes = data;
        state.filteredQuizzes = data;
        state.currentCategory = catKey;
        renderHome();
    } catch (err) {
        console.error("Error cargando categoría:", err);
    }
}

function renderHome() {
    state.currentQuiz = null;
    window.history.pushState({}, "", "/");
    const activeUsers = Math.floor(Math.random() * (1500 - 800) + 800);

    app.innerHTML = `
        <div class="animate-in fade-in duration-700 max-w-6xl mx-auto px-4">
            <header class="text-center mb-10">
                <div class="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold mb-4 animate-pulse">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span> ${activeUsers} PERSONAS JUGANDO AHORA
                </div>
                <h1 class="text-5xl font-extrabold text-gray-900 mb-2 italic tracking-tighter text-shadow-sm">
                    VEXO<span class="text-purple-600">QUIZ</span> 🔥
                </h1>
                <p class="text-gray-400 text-xs font-bold uppercase tracking-widest leading-loose">Descubre tu verdadero yo con los tests más virales</p>
            </header>

            <div class="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-2 justify-start md:justify-center">
                ${Object.keys(categories).map(cat => `
                    <button onclick="loadCategory('${cat}')" 
                        class="px-5 py-2 rounded-full font-bold text-xs transition-all border shadow-sm whitespace-nowrap ${state.currentCategory === cat ? 'bg-purple-600 text-white border-purple-600 shadow-purple-100 scale-105' : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'}">
                        ${cat.toUpperCase()}
                    </button>
                `).join('')}
            </div>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                ${state.filteredQuizzes.map(q => `
                    <div onclick="startQuiz(${q.id})" 
                        class="bg-white p-6 rounded-[2.5rem] border-2 border-gray-50 shadow-sm hover:shadow-2xl hover:border-purple-200 hover:-translate-y-1 transition-all cursor-pointer group flex flex-col min-h-[280px] h-full justify-between overflow-hidden">
                        <div>
                            <div class="w-14 h-14 bg-purple-50 rounded-2xl mb-5 flex items-center justify-center text-3xl group-hover:rotate-12 transition-all shrink-0">
                                ${state.currentCategory.toLowerCase().includes('brawl') ? '🌵' : '🧩'}
                            </div>
                            <h3 class="font-black text-[1.3rem] text-gray-800 leading-[1.2] mb-3 group-hover:text-purple-600 transition-colors">
                                ${q.title}
                            </h3>
                            <p class="text-gray-400 text-xs leading-snug font-medium mb-4 italic">
                                ${q.description}
                            </p>
                        </div>
                        <div class="flex items-center justify-between mt-2 pt-4 border-t border-gray-50">
                            <span class="text-purple-600 font-black text-[11px] uppercase tracking-tighter flex items-center">
                                JUGAR AHORA <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                            </span>
                            <span class="text-gray-300 text-[10px] font-bold">VIRAL 🔥</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    refreshAds();
}

function startQuiz(id) {
    state.currentQuiz = state.allQuizzes.find(q => q.id === id);
    if(!state.currentQuiz) return;
    state.qIndex = 0;
    state.score = 0;
    updateUrl();
    renderQuestion();
}

function renderQuestion() {
    const quiz = state.currentQuiz;
    const q = quiz.questions[state.qIndex];
    const progress = ((state.qIndex + 1) / quiz.questions.length) * 100;

    app.innerHTML = `
        <div class="max-w-xl mx-auto animate-in zoom-in-95 duration-300 px-4 pb-10">
            <button onclick="renderHome()" class="mb-6 text-white/80 hover:text-white flex items-center text-[10px] font-black tracking-widest uppercase">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                CANCELAR TEST
            </button>
            <div class="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
                <div class="bg-gray-50/50 p-6 border-b flex justify-between items-center">
                    <span class="text-[10px] font-black text-purple-600 uppercase tracking-widest">Pregunta ${state.qIndex + 1} de ${quiz.questions.length}</span>
                    <div class="w-24 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div class="bg-purple-600 h-full transition-all duration-700" style="width:${progress}%"></div>
                    </div>
                </div>
                
                <div class="p-8 md:p-12 text-center">
                    <h2 class="text-2xl md:text-3xl font-black text-gray-800 mb-10 leading-tight tracking-tight">${q.text}</h2>
                    <div class="grid gap-3">
                        ${q.options.map((opt, i) => `
                            <button onclick="handleAnswer(${opt.score})" 
                                class="group relative flex items-center w-full p-5 rounded-2xl border-2 border-gray-100 hover:border-purple-500 hover:bg-purple-50 transition-all text-left active:scale-95">
                                <span class="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center font-black mr-4 transition shrink-0">${String.fromCharCode(65 + i)}</span>
                                <span class="font-bold text-gray-700 text-sm md:text-base">${opt.text}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshAds();
}

function handleAnswer(score) {
    state.score += score;
    state.qIndex++;
    if (state.qIndex < state.currentQuiz.questions.length) {
        updateUrl();
        renderQuestion();
    } else {
        renderLoadingToResult();
    }
}

function renderLoadingToResult() {
    app.innerHTML = `
        <div class="max-w-xl mx-auto text-center py-12 px-4">
            <div class="mb-10 relative inline-block">
                <div class="w-20 h-20 border-8 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
            <h2 class="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">Analizando tus datos...</h2>
            
            <div class="bg-white p-8 rounded-[2.5rem] shadow-2xl mb-8 border-2 border-purple-600">
                <p class="text-purple-600 font-black mb-4 text-xs tracking-widest uppercase">¡Acceso Prioritario!</p>
                <p class="text-gray-500 text-sm mb-6 font-bold leading-snug px-4">Comparte el test con un grupo para ver tu resultado ahora mismo sin esperar.</p>
                <button onclick="shareWhatsApp()" class="w-full bg-[#25D366] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition shadow-xl shadow-green-400/20">
                    DESBLOQUEAR YA 🚀
                </button>
            </div>
            
            <button id="skipBtn" onclick="renderResult()" class="text-white/50 text-[10px] font-black underline uppercase tracking-widest opacity-50 cursor-not-allowed" disabled>
                Cargando resultado (8s)
            </button>
        </div>
    `;

    let timeLeft = 6;
    const interval = setInterval(() => {
        timeLeft--;
        const skipBtn = document.getElementById('skipBtn');
        if (skipBtn) {
            skipBtn.innerText = `Cargando resultado (${timeLeft}s)`;
            if (timeLeft <= 0) {
                clearInterval(interval);
                skipBtn.innerText = "VER MI RESULTADO ↓";
                skipBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                skipBtn.disabled = false;
            }
        }
    }, 1000);
}

function renderResult() {
    const quiz = state.currentQuiz;
    const res = quiz.results.find(r => state.score >= r.minScore && state.score <= r.maxScore) || quiz.results[0];
    
    // 1. Rareza y Porcentaje Dinámico (Para que no siempre sea el 2%)
    const rarities = ["Legendario", "Mítico", "Épico", "Raro", "Especial"];
    const rarity = rarities[Math.floor(Math.random() * rarities.length)];
    const randomPercent = Math.floor(Math.random() * (15 - 1) + 1); // Genera entre 1% y 15%

    // 2. Frases de refuerzo aleatorias (Si el JSON no trae descripción propia)
    const backupDescriptions = [
        `¡Increíble! Tus respuestas encajan perfectamente con este perfil. Eres parte del ${randomPercent}% que logra esta distinción.`,
        `¡No hay duda! Has demostrado una personalidad única. Solo el ${randomPercent}% de los jugadores llega hasta aquí.`,
        `¡Resultado verificado! Tu forma de elegir te sitúa en el nivel ${rarity}. ¡Compártelo con tus amigos!`,
        `Análisis completado: Eres un perfil tipo ${rarity}. Muy pocos usuarios (apenas un ${randomPercent}%) consiguen este resultado.`
    ];
    
    // Usamos la descripción del JSON si existe, si no, una de las nuestras
    const finalDescription = res.description || backupDescriptions[Math.floor(Math.random() * backupDescriptions.length)];

    const relatedQuizzes = state.allQuizzes
        .filter(q => q.id !== quiz.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2);

    app.innerHTML = `
        <div class="max-w-xl mx-auto animate-in slide-in-from-bottom-10 duration-700 px-4 pb-20">
            <div class="text-center bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl border-b-[12px] border-purple-600 relative overflow-hidden">
                
                <div class="bg-purple-600 text-white text-[9px] font-black px-4 py-1 absolute top-6 right-6 rounded-full tracking-widest uppercase animate-pulse">
                    NIVEL: ${rarity}
                </div>
                
                <div class="text-7xl mb-6">🏆</div>
                <h3 class="text-gray-400 uppercase tracking-[0.2em] font-black text-[9px] mb-2">Tu Perfil Oficial:</h3>
                <h1 class="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-none tracking-tighter italic border-b-4 border-purple-50 pb-6 inline-block">
                    ${res.text}
                </h1>
                
                <div class="p-6 bg-gradient-to-br from-purple-50 to-white rounded-3xl mb-8 text-left border border-purple-100">
                    <p class="text-gray-700 leading-relaxed font-bold italic text-base">
                        "${finalDescription}"
                    </p>
                </div>

                <div class="grid gap-3 sm:grid-cols-2 mb-8">
                    <button onclick="shareWhatsApp()" class="bg-[#25D366] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                        COMPARTIR WHATSAPP
                    </button>
                    <button onclick="share()" class="bg-[#1DA1F2] text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-blue-100 text-center">
                        Twitter / X
                    </button>
                </div>

                <div class="border-t border-gray-100 pt-8 mt-4 text-left">
                    <p class="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-widest">Siguiente Test Recomendado:</p>
                    <div class="grid gap-4">
                        ${relatedQuizzes.map(rq => `
                            <div onclick="startQuiz(${rq.id})" class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl cursor-pointer hover:bg-purple-50 transition-colors border border-gray-100 group">
                                <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">🧩</div>
                                <h4 class="font-black text-sm text-gray-800 line-clamp-1 leading-tight">${rq.title}</h4>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button onclick="renderHome()" class="mt-8 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:text-purple-600 transition-colors">
                    ← Volver a la galería
                </button>
            </div>
        </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    refreshAds();
}

function shareWhatsApp() {
    const text = encodeURIComponent(`🔥 ¡Mira lo que me salió en este test! Hazlo tú también aquí: `);
    window.open(`https://api.whatsapp.com/send?text=${text}${window.location.href}`, "_blank");
    renderResult();
}

function share() {
    const text = encodeURIComponent(`¡Mi resultado es increíble! Haz el test aquí: `);
    window.open(`https://twitter.com/intent/tweet?text=${text}${window.location.href}`, "_blank");
}

function updateUrl() {
    const newUrl = `?quiz=${state.currentQuiz.id}&q=${state.qIndex}`;
    window.history.pushState({path: newUrl}, "", newUrl);
}

function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('quiz')) {
        const id = parseInt(params.get('quiz'));
        const found = state.allQuizzes.find(q => q.id === id);
        if(found) startQuiz(id);
    } else {
        renderHome();
    }
}

init();