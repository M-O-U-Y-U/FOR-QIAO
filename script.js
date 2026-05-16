document.addEventListener("DOMContentLoaded", () => {
    
    // ================= 1. 音频控制 =================
    const typingSound = document.getElementById('typing-sound');
    const bgmSound = document.getElementById('bgm-sound');
    
    // ================= 2. 实时时间同步 =================
    function updateRealTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayNames = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        const day = dayNames[now.getDay()];

        // 更新所有类名为 live-time 的元素 (锁屏、状态栏、小部件)
        document.querySelectorAll('.live-time').forEach(el => {
            el.innerText = `${hours}:${minutes}`;
        });
        
        // 更新日期
        document.querySelectorAll('.live-date').forEach(el => {
            el.innerText = `${month}月${date}日 ${day}`;
        });
    }
    
    // 立即执行一次并设置定时器
    updateRealTime();
    setInterval(updateRealTime, 1000);


    // ================= 3. 黑屏打字机特效 =================
    const text1 = "你在互联网的角落里，捡到了一部手机……";
    const text2 = "它跨越了 1800 公里，从河南焦作，流落到了广西北海。";
    const line1El = document.getElementById("line1");
    const line2El = document.getElementById("line2");
    const breathLight = document.getElementById("breath-light");
    
    let isTyping = false;

    async function typeWriter(text, element) {
        isTyping = true;
        // 尝试播放打字音效 (浏览器可能需要用户交互才允许，我们尽量尝试)
        try { typingSound.play(); } catch(e) {}
        
        element.classList.add("cursor");
        for (let i = 0; i < text.length; i++) {
            element.innerHTML += text.charAt(i);
            await new Promise(r => setTimeout(r, 100)); // 打字速度
        }
        element.classList.remove("cursor");
        isTyping = false;
        typingSound.pause();
    }

    async function startStory() {
        await typeWriter(text1, line1El);
        await new Promise(r => setTimeout(r, 800)); // 停顿
        await typeWriter(text2, line2El);
        
        // 文字播放完毕，显示呼吸灯
        setTimeout(() => {
            breathLight.classList.remove("hidden");
        }, 500);
    }

    // 页面加载 1 秒后开始打字
    setTimeout(startStory, 1000);


    // ================= 4. 唤醒手机 & 解锁逻辑 =================
    breathLight.addEventListener("click", () => {
        document.getElementById("boot-screen").classList.remove("active");
        document.getElementById("boot-screen").classList.add("hidden");
        
        const lockScreen = document.getElementById("lock-screen");
        lockScreen.classList.remove("hidden");
        
        // 点击后彻底激活音频上下文，准备播放 BGM
        bgmSound.volume = 0.5;
        bgmSound.play().catch(e => console.log("BGM 播放需进一步交互"));
    });

    // 锁屏上滑/点击解锁
    const lockScreen = document.getElementById("lock-screen");
    let startY = 0;

    lockScreen.addEventListener("touchstart", (e) => { startY = e.touches[0].clientY; });
    lockScreen.addEventListener("touchend", (e) => {
        let endY = e.changedTouches[0].clientY;
        if (startY - endY > 50) unlockPhone(); // 向上滑动超过 50px 解锁
    });
    // 兼容电脑端点击解锁
    lockScreen.addEventListener("click", unlockPhone);

    function unlockPhone() {
        lockScreen.classList.add("slide-up");
        setTimeout(() => {
            lockScreen.classList.add("hidden");
            document.getElementById("home-screen").classList.remove("hidden");
            
            // 确保 BGM 播放
            bgmSound.play();

            // 进入桌面 1.5 秒后，弹出网易云通知横幅
            setTimeout(() => {
                document.getElementById("banner-notification").classList.add("show");
                // 4 秒后自动收起横幅
                setTimeout(() => {
                    document.getElementById("banner-notification").classList.remove("show");
                }, 4000);
            }, 1500);
        }, 400); // 等待上滑动画完成
    }


    // ================= 5. 下拉控制中心逻辑 =================
    const statusBarTrigger = document.getElementById("status-bar-trigger");
    const controlCenter = document.getElementById("control-center");
    let ccStartY = 0;

    // 监听顶部下拉
    statusBarTrigger.addEventListener("touchstart", (e) => { ccStartY = e.touches[0].clientY; });
    statusBarTrigger.addEventListener("touchmove", (e) => {
        let moveY = e.touches[0].clientY;
        if (moveY - ccStartY > 30) {
            controlCenter.style.transform = "translateY(0)"; // 下拉展开
        }
    });

    // 监听控制中心上滑收起
    controlCenter.addEventListener("touchstart", (e) => { ccStartY = e.touches[0].clientY; });
    controlCenter.addEventListener("touchmove", (e) => {
        let moveY = e.touches[0].clientY;
        if (ccStartY - moveY > 30) {
            controlCenter.style.transform = "translateY(-100%)"; // 上滑收缩
        }
    });


    // ================= 6. 桌面红点点击消消乐 =================
    const apps = document.querySelectorAll(".app-icon:not(.blur-app)");
    apps.forEach(app => {
        app.addEventListener("click", function() {
            const appId = this.getAttribute("data-app");
            const badge = document.getElementById(`badge-${appId}`);
            
            // 点击消除红点
            if (badge && !badge.classList.contains("removed")) {
                badge.classList.add("removed");
            }

            // 这里预留后续接入“进入APP查看礼物”的逻辑
            console.log(`打开了 ${appId}，可以在这里触发下一阶段的解密！`);
        });
    });

});
