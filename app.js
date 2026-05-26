document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. HỆ THỐNG LOGIC TƯƠNG TÁC ALBUM SÁCH LẬT
    // ==========================================
    const albumContainer = document.getElementById('interactive-album');
    const cover = document.getElementById('cover');
    let currentPage = 0;
    const totalPages = 3;

    if(albumContainer) {
        albumContainer.addEventListener('click', () => {
            if(currentPage === 0) {
                albumContainer.classList.add('album-open-active');
                cover.style.transform = 'rotateY(-180deg)';
                
                setTimeout(() => { cover.style.zIndex = 1; }, 400);
                currentPage++;
            } else if (currentPage <= totalPages) {
                const page = document.getElementById(`page-${currentPage}`);
                if(page) {
                    page.classList.add('page-turned');
                    setTimeout(() => { page.style.zIndex = 10 + currentPage; }, 400);
                }
                currentPage++;
            } else {
                if(cover) {
                    cover.style.transform = 'rotateY(0deg)';
                    cover.style.zIndex = 40;
                }
                
                for(let i = 1; i <= totalPages; i++) {
                    const pageElement = document.getElementById(`page-${i}`);
                    if (pageElement) {
                        pageElement.classList.remove('page-turned');
                        pageElement.style.zIndex = (40 - i);
                    }
                }
                
                setTimeout(() => {
                    albumContainer.classList.remove('album-open-active');
                }, 600);
                
                currentPage = 0;
            }
        });
    }

    // ==========================================
    // 2. HIỆU ỨNG HẠT (HOA & CHIM BỒ CÂU BAY)
    // ==========================================
    const particleContainer = document.getElementById('particles-container');
    
    function createParticle() {
        if(!particleContainer) return;
        const el = document.createElement('div');
        const isDove = Math.random() > 0.8;
        el.textContent = isDove ? '🕊️' : (Math.random() > 0.5 ? '🌼' : '🌸');
        el.className = `fixed z-0 pointer-events-none text-2xl opacity-60 sticker ${isDove ? 'animate-fly' : 'animate-fall'}`;
        
        if(isDove) {
            el.style.top = Math.random() * 80 + 'vh';
            el.style.left = '-10vw';
            el.style.animationDuration = (15 + Math.random() * 10) + 's';
        } else {
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-5vh';
            el.style.animationDuration = (8 + Math.random() * 7) + 's';
            el.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
        }
        
        particleContainer.appendChild(el);
        
        setTimeout(() => {
            el.remove();
        }, 20000);
    }

    setInterval(createParticle, 3000);
    
    for(let i = 0; i < 5; i++) {
        setTimeout(createParticle, i * 800);
    }

    // ==========================================
    // 3. LOGIC TRÌNH PHÁT NHẠC (MUSIC PLAYER)
    // ==========================================

    const playlist = [
        {
            title: "Midnight Focus",
            artist: "Study Playlist",
            src: "music/Công Dương, Nguyễn Lâm Thảo Tâm, & 30 Pictures - A Little Dream Of Me (Original Soundtrack).mp3", 
            cover: "music/A Little Dream Of Me.jpg" 
        },
        {
            title: "hoá ra…",
            artist: "GREY D",
            src: "music/GREY D - hoá ra….mp3",
            cover: "music/hóa ra....png"
        },

    ];

    let songIndex = 0;
    let isPlaying = false;

    // Lấy các DOM Elements đã được định nghĩa id ở index.html
    const audio = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const backwardBtn = document.getElementById('backward-10s');
    const forwardBtn = document.getElementById('forward-10s');
    const progress = document.getElementById('spotify-progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('total-duration');
    const playerTitle = document.getElementById('player-title');
    const playerArtist = document.getElementById('player-artist');
    const playerCover = document.getElementById('player-cover');

    // Hàm cập nhật giao diện bài hát
    function loadSong(song) {
        if (!audio || !playerTitle || !playerArtist || !playerCover) return;
        playerTitle.textContent = song.title;
        playerArtist.textContent = song.artist;
        audio.src = song.src;
        playerCover.src = song.cover;
    }

    // Định dạng thời gian từ giây sang định dạng mm:ss
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Hàm thực hiện Phát
    function playSong() {
        isPlaying = true;
        playIcon.textContent = 'pause'; 
        audio.play().catch(err => console.log("Trình duyệt chặn tự động phát, cần click thủ công: ", err));
    }

    // Hàm thực hiện Tạm dừng
    function pauseSong() {
        isPlaying = false;
        playIcon.textContent = 'play_arrow';
        audio.pause();
    }

    // Hàm chuyển sang bài kế tiếp
    function nextSong() {
        songIndex = (songIndex + 1) % playlist.length;
        loadSong(playlist[songIndex]);
        if (isPlaying) playSong();
    }

    // Hàm quay lại bài trước
    function prevSong() {
        songIndex = (songIndex - 1 + playlist.length) % playlist.length;
        loadSong(playlist[songIndex]);
        if (isPlaying) playSong();
    }

    // Cập nhật thanh trượt thời gian và dải màu chạy theo bài hát
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (!duration || isNaN(duration)) return;
        
        const progressPercent = (currentTime / duration) * 100;
        progress.value = progressPercent;

        // Tạo dải màu: Đoạn nhạc ĐÃ QUA sẽ có màu hồng/đỏ (#ff6a6a), đoạn CHƯA QUA sẽ có màu xám (#e5e7eb)
        progress.style.background = `linear-gradient(to right, #ff6a6a ${progressPercent}%, #e5e7eb ${progressPercent}%)`;

        currentTimeEl.textContent = formatTime(currentTime);
    }

    // Hàm xử lý khi người dùng click chọn hoặc kéo thanh thời gian
    function setProgress(e) {
        const duration = audio.duration;
        if (!duration || isNaN(duration)) return;
        
        const progressPercent = e.target.value;
        const newTime = (progressPercent / 100) * duration;
        audio.currentTime = newTime;

        // Cập nhật dải màu ngay lập tức khi kéo chuột để tạo cảm giác mượt mà
        progress.style.background = `linear-gradient(to right, #ff6a6a ${progressPercent}%, #e5e7eb ${progressPercent}%)`;
    }

    // Đăng ký các sự kiện lắng nghe tương tác
    if (audio && playBtn) {
        // Tải cấu hình bài hát đầu tiên khi web mở ra
        loadSong(playlist[songIndex]);

        // Sự kiện click nút Play/Pause
        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });

        // Click chuyển bài tiếp theo / bài trước đó
        nextBtn.addEventListener('click', nextSong);
        prevBtn.addEventListener('click', prevSong);

        // Nút tua tiến 10 giây
        forwardBtn.addEventListener('click', () => {
            audio.currentTime = Math.min(audio.currentTime + 10, audio.duration || 0);
        });

        // Nút tua lùi 10 giây
        backwardBtn.addEventListener('click', () => {
            audio.currentTime = Math.max(audio.currentTime - 10, 0);
        });

        // Đồng bộ thời gian thực của bài hát lên thanh progress
        audio.addEventListener('timeupdate', updateProgress);
        
        // Khi bài hát tải xong metadata thì hiển thị tổng thời gian bài hát
        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
        });

        // Tự động chuyển bài khi hát xong
        audio.addEventListener('ended', nextSong);

        // Lắng nghe hành vi kéo thả trên thanh trượt thời gian
        progress.addEventListener('input', setProgress);
    }
});