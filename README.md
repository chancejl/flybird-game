# flybird-game
flaybird game 

利用原生javascript编写的小游戏，飞翔的小鸟

问题点：

在管道的动态生成中，使用了window.requestAnimationFrame，不建议使用定时器，因为在网页没有关闭，进入其他网页时，定时器会一直运行，导致管道累计，影响游
戏；

![image](https://github.com/chancejl/flybird-game/blob/master/fly2.PNG)
![image](https://github.com/chancejl/flybird-game/blob/master/fly.PNG)

