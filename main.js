'use strict';

const score = document.querySelector('.score'),
    start = document.querySelector('.start'),
    gameArea = document.querySelector('.gameArea'),
    audio = new Audio('audio.mp3'),
    gameOver = document.querySelector('.over'),
    car = document.createElement('div');
    car.classList.add('car');
    audio.loop = true;
    

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

start.addEventListener('click', startGame);


const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

function getQuantityElements(heightElement){
    return document.documentElement.clientHeight / heightElement;
}

function startGame(){
    start.classList.add('hide');
    gameOver.classList.add('hide');
    gameArea.innerHTML = '';
    car.style.left = '125px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    let rand = 1 + Math.random() * (4 + 1 - 1);
    rand = Math.floor(rand);

    for (let i = 0; i < getQuantityElements(50); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.bottom = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    };

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        rand++;
        if (rand === 5){
            rand = 1;
        }
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url(image/enemy' + rand + '.png) center / contain no-repeat';
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    audio.currentTime = 0;
    audio.play();
    requestAnimationFrame(playGame);
};

function playGame(){
    if (setting.start){
        moveRoad();
        moveEnemy();
        setting.score += setting.speed / 4;
        if (localStorage.score === undefined){
            localStorage.score = 0;
        }
        score.innerHTML = 'Score: ' + Math.floor(setting.score) + '<br>Record: ' + localStorage.score;
        if (keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth-1)){
            setting.x += setting.speed;
        }
        if (keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }
        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight-1)){
            setting.y += setting.speed;
        }
        

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';
        requestAnimationFrame(playGame);
    }
    
}

function startRun(e){
    e.preventDefault();
    keys[e.key] = true;
};

function stopRun(e){
    e.preventDefault();
    keys[e.key] = false;
};

function moveRoad(){
    let lines = document.querySelectorAll('.line');
    lines.forEach((item) => {
        item.y += setting.speed * 2;
        item.style.top = item.y + 'px';

        if (item.y > document.documentElement.clientHeight){
            item.y = item.y - 1000;
        }
    });
};

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach((item) => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top){
            setting.start = false;
            audio.pause();
            start.classList.remove('hide');
            gameOver.classList.remove('hide');
            gameOver.innerHTML = 'Вы проиграли! <br> Ваш счет: ' + Math.floor(setting.score);
            if (localStorage.score === undefined){
                localStorage.score = 0;
            }
            if (Math.floor(setting.score) > localStorage.score){
                localStorage.score = Math.floor(setting.score);
                gameOver.innerHTML = 'Вы проиграли! <br> Ваш счет: ' + Math.floor(setting.score) + '<br>Поздравляем вы побили свой предыдущий рекорд!';
            }
            
        }

        item.y += setting.speed;
        item.style.top = item.y + 'px';

        if (item.y > document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
};

    const settings = document.querySelector('.settings');
    const settingsWrap = document.querySelector('.settingsWrap');
    const settingSound = document.querySelector('.settingSound');
    settings.addEventListener('click', () => {
        settingsWrap.classList.toggle('hide');
    });
    settingSound.addEventListener('click', () => {
        if (settingSound.style.background == 'url(\"image/SoundF.png\")'){
            settingSound.style.background = 'url(\"image/SoundT.png\")';
            audio.muted = false;
        }else{
            settingSound.style.background = 'url(\"image/SoundF.png\")';
            audio.muted = true;
        }
    });


/* ----------------DIFFICULTY SETTINGS--------------- */

const settingMenu = document.querySelector('.settingMenu');

settingMenu.addEventListener('click', (e) => {
    console.log(e);
    if (e.target.classList.contains('easy')){
        setting.speed = 2;
    }
    if (e.target.classList.contains('average')){
        setting.speed = 3;
    }
    if (e.target.classList.contains('hard')){
        setting.speed = 5;
    }
});