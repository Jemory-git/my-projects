/* 移动端滑动分页展示
 * 需要设置外围容器class 和 展示item class
 * 可以设置展示高度和宽度，默认window.innerHeight 和 window.innerWidth
 * 可以设置滑动的临界距离，默认为展示高度的0.3倍
 * 可以设置是否开启快速微滑动换页，默认为开启true
 * */

(function(global){
//		window.onscroll = function (e){
//			window.pageYOffset || document.body.scrollTop;
//		}

		function mSplitPageModule(){//混合的构造函数和原型方式
			this.containerElement = "containerClass";
			this.itemElement = "itemClass";
			this.height = window.innerHeight || document.documentElement.clientHeight;
			this.width = "100%";
			this.criticality = parseInt(this.height) * 0.3;
			this.inching = true;
			this.sTimeStamp = "";
			this.eTimeStamp = "";
			this.tsx = "";
			this.tsy = "";			
			this.tex = "";
			this.tey = "";
			this.swipeUp = "";
			this.swipeDown = "";
			this.swipeDerection = "";
			this.movey = "";
			this.movex = "";
			this.startScrollTop = "";
			this.endScrollTop = "";
			this.scrollChange = "";
			this.scrollTopTo = "";
			this.scrollVelocity = 50;//卷动速度
			this.acceleratedSpeed = 1;//卷动加速度
			this.scrollInterval = "";
		};
		
		mSplitPageModule.prototype.setHeight = function(h){
			this.height = h;
			$(this.containerElement).height(h);
			$(this.itemElement).height(h);
		};
		mSplitPageModule.prototype.setWidth = function(w){
			this.width = w;
			$(this.containerElement).width(w);
			$(this.itemElement).width(w);
		};
		mSplitPageModule.prototype.setSwipeExtent = function(multiple){//0-1
			this.criticality =  Math.min(Math.max(multiple,0.1),1) * parseInt(this.height);
		};
		mSplitPageModule.prototype.setInching = function(boo){//设置微动换页
			this.inching = boo;
		};
		mSplitPageModule.prototype.setScrollVelocityArguments = function(v,accs){//设置启动卷动速度和加速度
			this.scrollVelocity = v;
			this.acceleratedSpeed = accs;
		};
		mSplitPageModule.prototype.innitArguments = function(){//初始化参数
			this.scrollVelocity = 40;
			this.acceleratedSpeed = 1;
		};
		
		
		mSplitPageModule.prototype.running = function(instance){
			var	mContainerElement = $(instance.containerElement),
				mItemElement = $(instance.itemElement),
//				portraitHeight = instance.height,//记录竖屏高度
//				portraitWidth = instance.width,//记录竖屏宽度
				initScrollVelocity = instance.scrollVelocity;//保存初始卷动速度
			
			mContainerElement.height(instance.height);
			mItemElement.height(instance.height);
			mContainerElement.width(instance.width);
			mItemElement.width(instance.width);
			
//			//判断手机横竖屏状态：  
//			window.addEventListener("orientationchange", function() {
//				if (window.orientation === 180 || window.orientation === 0) {//竖屏状态
//					instance.setHeight(portraitHeight);
//				}   
//				if (window.orientation === 90 || window.orientation === -90 ){//横屏状态
//					instance.setHeight(portraitWidth);
//				}
//			}, false);   
			//绑定事件
			mItemElement.on("touchstart",function(e){//touchstart事件
				clearInterval(instance.scrollInterval);//清除计时器
				instance.sTimeStamp = e.timeStamp;
				instance.tsy = e.touches[0].clientY;//记录clientY
				instance.tsx = e.touches[0].clientX;//记录clientX
				instance.startScrollTop = mContainerElement.scrollTop();//记录滚动高度
			});
		
			mItemElement.on("touchend",function(e){//touchend事件
				instance.eTimeStamp = e.timeStamp;
				instance.tey = e.changedTouches[0].clientY;//记录clientY
				instance.tex = e.changedTouches[0].clientX;//记录clientX
				instance.movey = instance.tey - instance.tsy;
				instance.movex = instance.tex - instance.tsx;
				instance.endScrollTop = mContainerElement.scrollTop();//记录滚动高度
				
				console.log(Math.abs(instance.movex) + "\n" + "movex")
				if (instance.inching === true && (instance.eTimeStamp - instance.sTimeStamp) < 300 
					&& Math.abs(instance.movex) < 10){
					//确定scrollTopTo的值
					if (instance.movey > 0) {//手指向下滑动时上翻页
						instance.swipeDerection = "down";
						instance.scrollTopTo = instance.startScrollTop - instance.height;
					} else if (instance.movey < 0) {//手指向上滑动下翻页
						instance.swipeDerection = "up";
						instance.scrollTopTo = instance.startScrollTop + instance.height;
					}
				} else {
					//确定scrollTopTo的值
					if (instance.movey > 0) {//手指向下滑动
						instance.swipeDerection = "down";
						if (instance.movey >= instance.criticality) {//滑动距离超过临界值
							instance.scrollTopTo = instance.startScrollTop - instance.height;
						} else if (instance.movey < instance.criticality){//滑动距离未超过临界值
							instance.scrollTopTo = instance.startScrollTop;
						}
					} else if (instance.movey < 0) {//手指向上滑动
						instance.swipeDerection = "up";
						if ((-instance.movey) >= instance.criticality) {//滑动距离超过临界值
							instance.scrollTopTo = instance.startScrollTop + instance.height;
						} else if ((-instance.movey) < instance.criticality) {//滑动距离未超过临界值
							instance.scrollTopTo = instance.startScrollTop;
						}
					}
				};
				
				//滚动条变速滚动效果
				if (instance.endScrollTop > instance.scrollTopTo) {//滚动条向上移动
					instance.scrollVelocity = initScrollVelocity;//初始化速度
					instance.scrollChange = instance.endScrollTop;
					instance.scrollInterval = setInterval(function(){//设置计时器
						instance.scrollChange = instance.scrollChange - instance.scrollVelocity;
						instance.scrollChange = Math.max(instance.scrollChange,instance.scrollTopTo);//限定scrollChange
						instance.scrollVelocity = Math.max((instance.scrollVelocity - instance.acceleratedSpeed),0);//限定滚动速度
						if (instance.scrollChange === instance.scrollTopTo) {
							clearInterval(instance.scrollInterval);//清除计时器
						}
						mContainerElement.scrollTop(instance.scrollChange);
					},20);
				} else if (instance.endScrollTop < instance.scrollTopTo){//滚动条向下移动
					instance.scrollVelocity = initScrollVelocity;//初始化速度
					instance.scrollChange = instance.endScrollTop;
					instance.scrollInterval = setInterval(function(){//设置计时器
						instance.scrollChange = instance.scrollChange + instance.scrollVelocity;
						instance.scrollChange = Math.min(instance.scrollChange,instance.scrollTopTo);//防止scrollChange超范围
						instance.scrollVelocity = Math.max((instance.scrollVelocity - instance.acceleratedSpeed),0);//防止滚动速度超范围
						if (instance.scrollChange === instance.scrollTopTo) {
							clearInterval(instance.scrollInterval);//清除计时器
						}
						mContainerElement.scrollTop(instance.scrollChange);
					},20);
				}
			});//touchend事件结束
		};//running方法结束
		
		var SPM = new mSplitPageModule();
		
		global.SPM = SPM;
})(this);