window.onload=function(){
    (function (){
        var length=5*5*5,
            oUl=document.getElementById('list').children[0],//获取子节点
            aLi=oUl.children;//获取子节点li
        for(var i=0;i<length;i++){
            var oLi=document.createElement('li');//创建元素li
            oLi.x=i%5;//每个i取到的值(0,1,2,3,4)  x,y值按照x轴,y轴的坐标取值(每一面有25个li)
            oLi.y=Math.floor(i%25/5);//先%25时,取25个值;在除以5,排成5行.每个y取到的值(0,0,0,0,0)(1,1,1,1,1)...(4,4,4,4,4,),并向下取整
            oLi.z=Math.floor(i/25);
            oLi.innerHTML=`克隆${i}号`;
            //改变li在ul里的位置
            var tx=Math.random()*6000-2000;
            var ty=Math.random()*6000-2000;
            var tz=Math.random()*6000-2000;
            oLi.style.transform=`translate3D(${tx}px,${ty}px,${tz}px)`
            oUl.appendChild(oLi);//把创建的li放进ul里
          };
          setTimeout(Grid,500)
        //拖拽事件以及缩放;
        ;(function (){
            var trz=-1800;//初始值
            var rox=0;
            var roy=0;
            document.ondrag=function(){
                return false;
            }
            document.onselectstart=function(){
                return false;
            }
            document.onmousedown=function(e){//按下事件
                var sx=e.clientX;//定义点击时x，y的坐标值
                var sy=e.clientY;
                var rx=rox;//最终值=初始值+移动的值(也是标记上一次的距离)防止连续点击
                var ry=roy;
               
                // console.log(sx,sy)
                document.onmousemove=function(e){//移动事件
                    var chax=e.clientX-sx;//定义拖拽停止后x，y移动的坐标值
                    var chay=e.clientY-sy;
                    rx=rox-chay*0.2;//rotateX是绕Y轴旋转,移动像素为0.2,0.4,0.6...不敏感
                    ry=roy+chax*0.2;//rotateY是绕X轴旋转
                    // console.log(chax,chay)
                    oUl.style.transform=`translateZ(${trz}px) rotateX(${rx}deg) rotateY(${ry}deg)`
                }
                document.onmouseup=function(e){//抬起事件
                    rox=rx;//抬起时最终位置的值赋值给初始值,防止第二次点击回归起点
                    roy=ry;
                    document.onmousemove=null;
                    // console.log("鼠标抬起")

                }
            };
            //滚轮事件
            (function(fn){
                document.onmousewheel=function(e){
                    var d=e.wheelDelta/120;//滚动一次值为1
                    fn.call(this , d)
                    //this指向window,d为参数传入值
                }
            })(function(d){
                trz+=d*100;//每次滚动改动的值
                oUl.style.transform=`translateZ(${trz}px) rotateX(${rox}deg) rotateY(${roy}deg)`
            })
        })();
        //点击事件处理各个按钮事件
        (function(){
            var aBtn=document.getElementById('btn').getElementsByTagName('li');
             console.log(aBtn)
            var arr=[Table,Sphere,Helix,Grid];
                for(var i=0;i<aBtn.length;i++){
                //    aBtn[i].i=i;
                //    aBtn[i].onclick=arr[i];
                   (function(i){//闭包写法,相当于绑定自定义写法
                       aBtn[i].onclick=arr[i];
                   })(i)
                }
        })()

        // Grid()//方阵,避免重叠影响拖拽事件不能执行
        function Grid(){
            var disx=300,//定义一个变量disx,每个i间隔200
                disy=300,
                disz=800;
                for(var i=0;i<length;i++){
                    var oLi=aLi[i];//定义一个变量oLi保存每一个aLi[i],遍历每一个子元素0~124
                    var x=(oLi.x-2)*disx,//(0,1,2,3,4)*200各自对应的距离
                        y=(oLi.y-2)*disy,//每一个oLi减两倍的距离 (-2,-1,0,1,2)*200,以0为中心点
                        z=(oLi.z-2)*disz;
                        oLi.style.transform=`translate3D(${x}px,${y}px,${z}px)`;

                }
        }
        //Helix 螺旋状
        /*
          总个数：125；
          行数：4；
          每行分度有多少个：125/4
          每行里每个的间隔度数：360/(125/4)
        */ 
        function Helix(){
            var h=4,//行数
                num=length/h,//每一行有多少个li
                deg=360/num;//每行的平局度数
            var tY=7,
                mid=length/2;//螺旋状的中间值
            for(var i=0;i<length;i++){
                aLi[i].style.transform=`rotateY(${i*deg}deg) translateY(${(i-mid)*tY}px) translateZ(${800}px)`;
            }
        }
        //Sphere 球体
          /*
              20   i = 20
                 1 + 3 + 7 + 9 = 20 + 11 = 31   arrSum = 31
              55      
                 1 + 3 + 7 + 9 + 11 + 14 + 21  = 66    45 + 21 = 66
              第6排  第10个      初始位置：0 0 
                   45 46 47 48 49 50 51 52 53 54 55
                arr[6]  = 21
                arrSum = 66
                i = 55
              21 - (  66 - 55 ) = 21 - 11 = 10
         */
        function Sphere(){
            var arr = [1,3,7,9,11,14,21,16,12,10,9,7,4,1];  //所有数加起来等于125
            //numC处于哪一层   numG处于哪一个位置
            for( var i = 0;i<length;i++ ){   // for循环第一层取的就是0 - 124个li元素 
                var numC = 0,numG = 0,arrSum = 0;
                for( var j = 0;j<arr.length;j++ ){  //第二层for循环遍历的是数组的长度14 下标 0-13 
                    arrSum += arr[j]  // arr[0] + arr[1] + arr[6] ... + arr[13]
                    
                    if( arrSum > i ){  //arrSum = 66   i = 55
                        numC = j;   // 6
                        numG = arr[j] - ( arrSum - i );
                        break;
                    }
                }
                var ydeg = 360 / arr[numC];   //算出每一层旋转的度数；
                var xdeg = 180/(arr.length - 1);
                // aLi[i].innerHTML = numC + "层，" + numG + "个" ;
                aLi[i].style.transform = `rotateY(${(numG-
                    1.3)*ydeg}deg) rotateX(${90-numC*xdeg}deg) translateZ(800px)`
            }

        }
        //Table 元素周期表
        function Table(){
           var arr=[
              {x:0,y:0},
              {x:17,y:0},
              {x:0,y:1},
              {x:1,y:1},
              {x:12,y:1},
              {x:13,y:1},
              {x:14,y:1},
              {x:15,y:1},
              {x:16,y:1},
              {x:17,y:1},
              {x:0,y:2},
              {x:1,y:2},
              {x:12,y:2},
              {x:13,y:2},
              {x:14,y:2},
              {x:15,y:2},
              {x:16,y:2},
              {x:17,y:2},
           ];
          var disX=180;
          var disY=210;
          var midX=18/2;//一行有18个,中间值为9
          var n=Math.ceil(length/18);//总共行数,向上取整
          var midY=n/2;//行数除2,取中间值
          for(var i=0;i<length;i++){
            var x,y;//定义x,y
            if(i<18){
                x=arr[i].x;//前18个的x坐标值
                y=arr[i].y;//前18个的y坐标值
            }else{
                x=i%18;//0~17
                y=Math.floor(i/18)+2;//加2让整体向下移2个单位
            }
            aLi[i].style.transform=`translate3D(${(x-midX)*disX}px,${(y-midY)*disY}px,0px)`
          }
        }
       
    })()
}

