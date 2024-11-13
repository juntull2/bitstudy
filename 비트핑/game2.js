class TypingGame {
    constructor() {
        this.gameContainer = document.getElementById('gameContainer');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.comboDisplay = document.getElementById('comboDisplay');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.gameOverDisplay = document.getElementById('gameOver');
        this.startScreen = document.getElementById('startScreen');
        this.startButton = document.getElementById('startButton');
        this.typingInput = document.getElementById('typingInput');
        this.currentWordDisplay = document.getElementById('currentWord');
        
        this.score = 0;
        this.combo = 1;
        this.maxCombo = 1;
        this.speed = 1;
        this.level = 1;
        this.words = [];
        this.isGameOver = false;
        this.gameInterval = null;
        this.gameStartTime = null;
        this.currentTime = 0;
        
        this.koreanWords = [
            '안녕하세요', '즐거운', '행복한', '신나는', '재미있는',
            '프로그램', '컴퓨터', '키보드', '마우스', '모니터',
            '학교', '학생', '선생님', '친구', '가족',
            '사과', '바나나', '오렌지', '포도', '딸기',
            '하늘', '바다', '산', '강', '들판'
        ];
        
        // 생명력 관련 속성 추가
        this.maxLives = 3;
        this.lives = this.maxLives;
        this.livesDisplay = document.getElementById('livesDisplay');
        
        // 일시정지 상태 추가
        this.isPaused = false;
        this.pauseScreen = null;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startButton.addEventListener('click', () => this.startGame());
    }
    
    bindEvents() {
        this.typingInput.addEventListener('input', (e) => this.handleInput(e));
        this.typingInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkWord();
            }
        });
    }
    
    startGame() {
        this.startScreen.style.display = 'none';
        this.score = 0;
        this.combo = 1;
        this.maxCombo = 1;
        this.speed = 1;
        this.level = 1;
        this.isGameOver = false;
        this.gameStartTime = Date.now();
        this.currentTime = 0;
        this.lives = this.maxLives;
        this.updateLives();
        
        this.updateScore();
        this.updateCombo();
        this.updateLevel();
        this.typingInput.focus();
        
        // 주기적으로 단어 생성
        this.gameInterval = setInterval(() => this.generateWord(), 2000);
        
        // 시간 업데이트
        this.timeInterval = setInterval(() => this.updateTime(), 1000);
        
        // 난이도 증가
        this.difficultyInterval = setInterval(() => {
            if (!this.isGameOver) {
                this.speed *= 1.05;
                this.level = Math.floor(this.speed);
                this.updateLevel();
            }
        }, 10000);
        
        // 게임 시작 시 update 함수 호출
        requestAnimationFrame(() => this.update());
    }
    
    updateTime() {
        if (this.isGameOver) return;
        
        this.currentTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeDisplay.textContent = `시간: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    updateLevel() {
        document.querySelector('.level-indicator').textContent = `레벨: ${this.level}`;
    }
    
    generateWord() {
        if (this.isGameOver) return;
        
        const word = this.koreanWords[Math.floor(Math.random() * this.koreanWords.length)];
        const wordElement = document.createElement('div');
        wordElement.className = 'word';
        wordElement.textContent = word;
        wordElement.style.left = Math.random() * (this.gameContainer.clientWidth - 150) + 'px';
        wordElement.style.top = '0px';
        
        this.gameContainer.appendChild(wordElement);
        this.words.push({
            element: wordElement,
            text: word,
            position: 0,
            speed: this.speed
        });
    }
    
    handleInput(e) {
        const typed = this.typingInput.value;
        this.currentWordDisplay.textContent = typed || "단어를 입력하세요";
        
        // 현재 타이핑 중인 단어와 일치하는 떨어지는 단어 찾기
        this.words.forEach(word => {
            if (word.text.startsWith(typed)) {
                word.element.classList.add('active');
            } else {
                word.element.classList.remove('active');
            }
        });
    }
    
    checkWord() {
        const typed = this.typingInput.value.trim();
        let wordFound = false;
        
        for (let i = 0; i < this.words.length; i++) {
            const word = this.words[i];
            if (word.text === typed) {
                // 단어를 맞췄을 때
                this.score += 10 * this.combo;
                this.combo++;
                this.maxCombo = Math.max(this.maxCombo, this.combo);
                this.updateScore();
                this.updateCombo();
                
                this.gameContainer.removeChild(word.element);
                this.words.splice(i, 1);
                wordFound = true;
                break;
            }
        }
        
        if (!wordFound) {
            // 틀렸을 때
            this.combo = 1;
            this.updateCombo();
        }
        
        this.typingInput.value = '';
        this.currentWordDisplay.textContent = "단어를 입력하세요";
    }
    
    updateScore() {
        this.scoreDisplay.textContent = `점수: ${this.score}`;
    }
    
    updateCombo() {
        this.comboDisplay.textContent = `콤보: x${this.combo}`;
    }
    
    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameInterval);
        clearInterval(this.timeInterval);
        clearInterval(this.difficultyInterval);
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('maxCombo').textContent = this.maxCombo;
        document.getElementById('survivalTime').textContent = this.timeDisplay.textContent.replace('시간: ', '');
        
        this.gameOverDisplay.style.display = 'block';
        this.typingInput.disabled = true;
    }
    
    update() {
        if (this.isGameOver || this.isPaused) return;
        
        for (let i = this.words.length - 1; i >= 0; i--) {
            const word = this.words[i];
            word.position += word.speed;
            word.element.style.top = word.position + 'px';
            
            if (word.position > this.gameContainer.clientHeight) {
                this.gameContainer.removeChild(word.element);
                this.words.splice(i, 1);
                this.combo = 1;
                this.updateCombo();
                
                // 생명력 감소
                this.lives--;
                this.updateLives();
                
                // 생명력이 0이 되면 게임 오버
                if (this.lives <= 0) {
                    this.gameOver();
                    return;
                }
            }
        }
        
        requestAnimationFrame(() => this.update());
    }

    addEffect(x, y, text, isCorrect) {
        const effect = document.createElement('div');
        effect.className = 'effect';
        effect.style.position = 'absolute';
        effect.style.left = `${x}px`;
        effect.style.top = `${y}px`;
        effect.style.color = isCorrect ? '#4CAF50' : '#ff4444';
        effect.style.fontSize = '20px';
        effect.style.pointerEvents = 'none';
        effect.style.animation = 'fadeUp 0.5s ease-out forwards';
        effect.textContent = text;
        
        this.gameContainer.appendChild(effect);
        
        setTimeout(() => {
            this.gameContainer.removeChild(effect);
        }, 500);
    }

    // 게임 일시정지
    pauseGame() {
        if (!this.isGameOver) {
            clearInterval(this.gameInterval);
            clearInterval(this.timeInterval);
            clearInterval(this.difficultyInterval);
            this.isPaused = true;
            
            // 일시정지 화면 표시
            this.pauseScreen = document.createElement('div');
            this.pauseScreen.className = 'pause-screen';
            this.pauseScreen.textContent = '일시정지';
            document.body.appendChild(this.pauseScreen);
        }
    }

    // 게임 재개
    resumeGame() {
        if (!this.isGameOver && this.isPaused) {
            this.gameInterval = setInterval(() => this.generateWord(), 2000);
            this.timeInterval = setInterval(() => this.updateTime(), 1000);
            this.difficultyInterval = setInterval(() => {
                if (!this.isGameOver) {
                    this.speed *= 1.05;
                    this.level = Math.floor(this.speed);
                    this.updateLevel();
                }
            }, 10000);
            this.isPaused = false;
            
            // 일시정지 화면 제거
            if (this.pauseScreen) {
                document.body.removeChild(this.pauseScreen);
                this.pauseScreen = null;
            }
            
            // 게임 루프 재시작
            requestAnimationFrame(() => this.update());
        }
    }

    // 키보드 이벤트 처리
    handleKeyboardEvent(e) {
        // ESC 키로 일시정지
        if (e.key === 'Escape') {
            if (this.isPaused) {
                this.resumeGame();
            } else {
                this.pauseGame();
            }
        }
    }

    // 생명력 표시 업데이트
    updateLives() {
        this.livesDisplay.textContent = `생명: ${'❤️'.repeat(this.lives)}`;
    }
}

// 게임 시작 시 애니메이션을 위한 CSS 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeUp {
        0% {
            transform: translateY(0);
            opacity: 1;
        }
        100% {
            transform: translateY(-20px);
            opacity: 0;
        }
    }

    .effect {
        transition: all 0.5s ease-out;
        pointer-events: none;
    }

    .word.correct {
        animation: correct 0.3s ease-out;
        color: #4CAF50;
    }

    .word.wrong {
        animation: wrong 0.3s ease-out;
        color: #ff4444;
    }

    @keyframes correct {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }

    @keyframes wrong {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    .pause-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        color: white;
        font-size: 2em;
    }
`;
document.head.appendChild(style);

// 게임 인스턴스 생성
window.onload = () => {
    const game = new TypingGame();
    
    // ESC 키 이벤트 리스너 추가
    document.addEventListener('keydown', (e) => game.handleKeyboardEvent(e));
    
    // 게임 루프 시작
    requestAnimationFrame(() => game.update());
};
