document.addEventListener("DOMContentLoaded", () => {
    
    // --- Hệ thống Logic Tương tác Album Sách Lật 2 Bên ---
    const albumContainer = document.getElementById('interactive-album');
    const cover = document.getElementById('cover');
    let currentPage = 0;
    const totalPages = 3;

    if(albumContainer) {
        albumContainer.addEventListener('click', () => {
            if(currentPage === 0) {
                // Mở bìa album
                albumContainer.classList.add('album-open-active');
                cover.style.transform = 'rotateY(-180deg)';
                
                setTimeout(() => { cover.style.zIndex = 1; }, 400);
                currentPage++;
            } else if (currentPage <= totalPages) {
                // Lật các trang tiếp theo từ phải sang trái
                const page = document.getElementById(`page-${currentPage}`);
                if(page) {
                    page.classList.add('page-turned');
                    setTimeout(() => { page.style.zIndex = 10 + currentPage; }, 400);
                }
                currentPage++;
            } else {
                // Đóng album về trạng thái ban đầu
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

    // --- Particle Generation (Flowers & Flying Doves) ---
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
});