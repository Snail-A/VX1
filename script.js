document.addEventListener('DOMContentLoaded', () => {
    const envelopeScene = document.getElementById('envelopeScene');
    const letterScene = document.getElementById('letterScene');
    const openBtn = document.getElementById('openBtn');
    const bgMusic = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');

    let isOpened = false;

    // Detect WeChat browser
    const isWeChat = /MicroMessenger/i.test(navigator.userAgent);

    bgMusic.load();

    bgMusic.addEventListener('playing', () => {
        musicControl.classList.add('playing');
    });

    bgMusic.addEventListener('pause', () => {
        musicControl.classList.remove('playing');
    });

    if (isWeChat) {
        if (typeof WeixinJSBridge !== 'undefined') {
            WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                bgMusic.load();
            });
        } else {
            document.addEventListener('WeixinJSBridgeReady', function () {
                bgMusic.load();
            }, false);
        }
    }

    const interactHandler = (e) => {
        e.preventDefault();

        if (isOpened) return;
        isOpened = true;

        // CRITICAL: Always try to play IMMEDIATELY on interaction
        // Do not wait for load, do not check readyState
        // Browser needs synchronous call to allow playback
        bgMusic.muted = false;
        bgMusic.volume = 1.0;

        // Force play immediately. Browser will handle buffering if not loaded.
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Auto-play prevented: " + error);
                // Fallback: Add one-time click listener to body just in case
                document.body.addEventListener('click', () => {
                    bgMusic.play();
                }, { once: true });
            });
        }

        openLetter();
    };

    openBtn.addEventListener('click', interactHandler);
    openBtn.addEventListener('touchend', interactHandler);

    musicControl.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        toggleMusic();
    });

    function playMusicNow() {
        bgMusic.muted = false;
        bgMusic.volume = 1.0;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => { });
        }
    }

    function openLetter() {
        document.body.classList.add('envelope-open');
        setTimeout(() => {
            letterScene.classList.remove('hidden');
            void letterScene.offsetWidth;
            document.body.classList.add('show-letter');
            setTimeout(() => {
                envelopeScene.classList.add('hidden');
            }, 1000);
        }, 1200);
    }

    function toggleMusic() {
        if (bgMusic.paused) {
            playMusicNow();
        } else {
            bgMusic.pause();
        }
    }
});
