// ==========================================
// 目标时间节点设定
// ==========================================
const TARGET_520 = new Date("2026-05-20T00:00:00").getTime();
const TARGET_BDAY = new Date("2026-05-18T00:00:00").getTime();

// ==========================================
// 引导页进度条逻辑
// ==========================================
let progress = 0;
const progressBar = document.getElementById("progress-bar");
const loadingText = document.getElementById("loading-text");
const enterBtn = document.getElementById("enter-btn");

const loadingInterval = setInterval(() => {
    progress += Math.floor(Math.random() * 5) + 1; // 随机增加进度
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        loadingText.innerText = "INITIALIZATION COMPLETE.";
        enterBtn.classList.remove("hidden");
    }
    progressBar.style.width = progress + "%";
    if (progress < 100) {
        loadingText.innerText = `INITIALIZING... ${progress}%`;
    }
}, 100);

// 点击进入控制台
enterBtn.addEventListener("click", () => {
    document.getElementById("boot-screen").classList.add("hidden");
    document.getElementById("dashboard").classList.remove("hidden");
});

// ==========================================
// 核心时间与倒计时逻辑
// ==========================================
function formatTimeZero(num) {
    return num < 10 ? "0" + num : num;
}

function updateSystemClock() {
    const now = new Date();
    const nowTime = now.getTime();
    
    // 更新控制台当前时间显示
    document.getElementById("current-time").innerText = now.toLocaleString('zh-CN');

    // 1. 更新 5.20 主倒计时
    const distanceTo520 = TARGET_520 - nowTime;
    if (distanceTo520 > 0) {
        const days = Math.floor(distanceTo520 / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distanceTo520 % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distanceTo520 % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distanceTo520 % (1000 * 60)) / 1000);
        
        document.getElementById("main-countdown").innerText = 
            `${formatTimeZero(days)}D : ${formatTimeZero(hours)}H : ${formatTimeZero(minutes)}M : ${formatTimeZero(seconds)}S`;
    } else {
        document.getElementById("main-countdown").innerText = "SYSTEM FULLY UNLOCKED";
    }

    // 2. 检查模块 01 (5.18 生日) 权限
    if (nowTime >= TARGET_BDAY) {
        document.getElementById("bday-locked").classList.add("hidden");
        document.getElementById("bday-unlocked").classList.remove("hidden");
        const bdayStatus = document.getElementById("bday-status");
        if(bdayStatus.innerText.includes("ENCRYPTED")) {
            bdayStatus.innerText = "> STATUS: DECRYPTED (Access Granted)";
            bdayStatus.className = "status-unlocked";
        }
    }

    // 3. 检查模块 02 (5.20 告白) 权限
    if (nowTime >= TARGET_520) {
        document.getElementById("vday-locked").classList.add("hidden");
        document.getElementById("vday-unlocked").classList.remove("hidden");
        const vdayStatus = document.getElementById("vday-status");
        if(vdayStatus.innerText.includes("ENCRYPTED")) {
            vdayStatus.innerText = "> STATUS: DECRYPTED (Root Access Granted)";
            vdayStatus.className = "status-unlocked";
        }
    }
}

// 立即运行一次，随后每秒刷新
updateSystemClock();
setInterval(updateSystemClock, 1000);
