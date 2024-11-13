document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.slide-track');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    let isTransitioning = false; // 전환 중 상태 체크
    const transitionDelay = 800; // 전환 딜레이 (밀리초)
    
    function goToSlide(n) {
        if (isTransitioning) return; // 전환 중이면 추가 클릭 무시
        
        isTransitioning = true;
        currentSlide = n;
        const offset = currentSlide * -33.333;
        track.style.transform = `translateX(${offset}%)`;
        updateDots();
        
        // 전환 딜레이 후 다시 클릭 가능하도록 설정
        setTimeout(() => {
            isTransitioning = false;
        }, transitionDelay);
    }

    document.querySelectorAll('.expand-btn').forEach(button => {
        let isFirstHover = true;
        
        button.addEventListener('mouseenter', () => {
            if (isFirstHover) {
                button.style.animation = 'rotate360 0.8s ease-out forwards';
                isFirstHover = false;
            } else {
                button.style.animation = 'rotate360 1.5s ease-out forwards';
            }
        });
    });
    
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function nextSlide() {
        if (isTransitioning) return; // 전환 중이면 추가 클릭 무시
        
        if (currentSlide >= slides.length - 1) {
            goToSlide(0);
        } else {
            goToSlide(currentSlide + 1);
        }
    }
    
    function prevSlide() {
        if (isTransitioning) return; // 전환 중이면 추가 클릭 무시
        
        if (currentSlide <= 0) {
            goToSlide(slides.length - 1);
        } else {
            goToSlide(currentSlide - 1);
        }
    }
    
    // 이벤트 리스너 추가
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // 자동 슬라이드 (마우스 오버시 멈춤 기능 추가)
    let autoSlideInterval = setInterval(nextSlide, 5000);
    
    const slider = document.querySelector('.slider');
    slider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
}); 