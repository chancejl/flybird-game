var bird = document.querySelector('.bird');
var wrap = document.getElementById('wrap');
var pipes = document.querySelector('.pipes');
var scoreDiv = document.querySelector('.score');
var overPage= document.querySelector('.gameOver');
var nowScoreDiv = document.querySelector('.nowScore');
var startBtn = document.querySelector('.startBtns>div:nth-child(1)');//开始按钮
var gameStart = document.querySelector('.gameStart');
var okBtn = document.querySelector('.ok img');
var bestScore = document.querySelector('.bestScore');

//全局变量
var downTimer;//小鸟掉落计时器
var upTimer;//小鸟上升计时器（上升有所缓冲）
var upDis = 30;//小鸟点击一次上升的幅度
var pipeArr = [];//盛放所有的pipe
var createPipeTimer;//创建管道计时器
var pipeMoveTimer;//管道移动计时器
var score = 0;//score
var scoreArr = [];

// 小鸟掉落
function birdDown(){
	downTimer = setInterval(function(){
		//判断是否出游戏区域
		if(bird.offsetTop < 397){
			bird.style.top = bird.offsetTop + 2 + 'px';
		}else{
			clearInterval(downTimer);
		}
	},20);
}
birdDown();

//小鸟上升
function birdUp(){
	clearInterval(downTimer);
	//避免连点或者点击频率过高，upTimer叠加
	clearInterval(upTimer);
	//目标位置
	var endTop = bird.offsetTop - upDis;
	upTimer = setInterval(function(){
		bird.style.top = --bird.offsetTop + 'px';
		//到达当次点击的位置，开始掉落,或小鸟不能飞出游戏区域
		if(bird.offsetTop == endTop||bird.offsetTop <= 0){
			clearInterval(upTimer);
			birdDown();
		}	
		
	},10);
}

//随机数函数
function r(min,max){
	return Math.round(Math.random() * (max- min) + min);
}

//创建管道
function createPipe(){
	var newPipe = document.createElement('div');
	newPipe.className = 'pipe';
	//上下管道(最矮60，最高163)
	//pipe的高度和管道之间的间隔no change
	//随机高度：随机出上方管道，用pipe的高度423-上方高度 - 上下管道的间隔 = 下部管道高度
	var topHeight = r(60,240);//top pipe height
	var bottomHeight =  300 - topHeight;//bottom pipe height
	newPipe.innerHTML = '<div class="pipeUp" style="height:'+ topHeight+'px"><div class="upHead"></div></div><div class="pipeDown" style="height:'+bottomHeight+'px"><div class="downHead"></div></div>'
	pipes.appendChild(newPipe);
	pipeArr.push(newPipe);
}

//管道移动函数
function pipeMove(){
	for(var i = 0;i < pipeArr.length;i++){
		pipeArr[i].style.left = --pipeArr[i].offsetLeft + 'px'; 
		//碰撞检测(靠近小鸟之后通过小鸟之前)
		if(pipeArr[i].offsetLeft <= 80 && pipeArr[i].offsetLeft >= -20){
			// console.log(pipeArr[i].children);
			judgeHit(bird,pipeArr[i].children[0]);//上部管道
			judgeHit(bird,pipeArr[i].children[1]);
		}
		if(pipeArr[i].offsetLeft == bird.offsetLeft - pipeArr[i].offsetWidth){
			score++;
			scoreArr.push(score);
			scoreToImg();
			
		}
		if(pipeArr[i].offsetLeft <= -60){
			pipeArr[i].remove();
			pipeArr.splice(i,1);
			i--;
		}
		
	}
}

//将score转换成图片
function scoreToImg(){
	var scoreArr = score.toString().split('');
	//向scoreDiv中添加score时需要将上一次的score清除
	scoreDiv.innerHTML = '';
	//创建相对应的图片
	for(var item of scoreArr){
		var newScoreImg = new Image();
		newScoreImg.src = 'img/' + item + '.jpg'; 
		scoreDiv.appendChild(newScoreImg);
	}
	
}

//碰撞检测
function judgeHit(ele1,ele2){
	var leftCase = ele1.offsetLeft + ele1.offsetWidth >= ele2.offsetLeft;
	var topCase = ele1.offsetTop + ele1.offsetHeight >= ele2.offsetTop;
	var rightCase = ele1.offsetLeft <= ele2.offsetLeft + ele2.offsetWidth;
	var bottomCase = ele1.offsetTop <= ele2.offsetTop + ele2.offsetHeight;

	if(leftCase&&topCase&&rightCase&&bottomCase){
		gameover();
	}
}

//本地存储
function save(){
	var grade_ = localStorage.getItem('grade');
	// localStorage.clear();
    window.localStorage.setItem('grade',score);
    console.log(grade_,score);
	if(grade_ == null||grade_ < score){
		bestScore.innerText = score;
	}else if(grade_ > score){
		bestScore.innerText = grade_;
	}
}


function gameover(){
	//现实游戏结束页面
	overPage.style.display = 'block';
	//清除所有计时器
	clearAllTimer();
	//清除wrap点击事件
	wrap.onclick = null;
	//显示本局score
	nowScoreDiv.innerHTML = score;
    save();

}

function clearAllTimer(){
	var timer = setInterval(function(){});
	for(var i = 0;i <= timer;i++){
		clearInterval(i);
	}
}



//点击游戏区域，小鸟上升
wrap.onclick = birdUp;
//开始按钮点击事件
startBtn.onclick = function(){
	bird.style.display = 'block';//小鸟显示
	gameStart.style.display = 'none';
	//创建管道
    createPipeTimer = setInterval(createPipe,2500);

   //管道移动
   pipeMoveTimer = setInterval(pipeMove,10);
}

//重新开始游戏
okBtn.onclick = function(){
	//游戏结束界面隐藏
	overPage.style.display = 'none';
	//小鸟隐藏
	bird.style.display = 'none';
	//游戏开始界面显示
	gameStart.style.display = 'block';
	//管道恢复初始状态
	pipeArr = [];
	pipes.innerHTML = '';
	//score恢复初始状态
	score = 0;
	scoreDiv.innerHTML = '<img src = img/0.jpg>';
	//重新为wrap绑定点击事件
	wrap.onclick = birdUp;
}