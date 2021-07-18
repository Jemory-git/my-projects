
(function(){
	$(document).ready(function(){
		var bannerImg = $(".banner-img"),//获取所有的banner图
			bannerSelecter = $(".banner-selecter"),//获取所有的banner图选择按钮
			bannerNumber = 0,//当前显示的banner图下标
			bannerAmount = bannerImg.length,//banner图的数量
			bannerNext = ((bannerNumber+1) >= bannerAmount) ? 0 : (bannerNumber+1),
			bannerPre = ((bannerNumber-1) < 0) ? 2 : (bannerNumber-1),
			bannerZindex = 100,
			turnThree = 1,
			bannerTimeOut,
			etimeStampContainer = [1503537894017],//事件时间戳容器
			funTimeStampContainer = [1503537894017];//函数时间戳容器
			
		function changeBannerNumberLeft(){//左翻页时改变数字
			bannerPre = bannerNumber;
			bannerNumber = bannerNumber >= (bannerAmount-1) ? 0 : ++bannerNumber;
			bannerNext = ((bannerNumber+1) >= bannerAmount) ? 0 : (bannerNumber+1);
			
		};
		function changeBannerNumberRight(){//右翻页时改变数字
			bannerNext = bannerNumber;
			bannerNumber = bannerPre;
			bannerPre = ((bannerNumber-1) < 0) ? 2 : (bannerNumber-1);
			
		};
		function initialPosition(){//恢复动画初始位置
			bannerImg.each(function(index,currentItem){
				if (index != bannerNumber) {
					$(currentItem).css({
						left:"100%"
					})
				}
			})
		};
		function changeZindexLeft(){//左翻页时改变zIndex
			bannerImg.each(function(index,currentItem){
				if (index != bannerNext) {
					$(currentItem).css({
						zIndex:"10"
					})
				}else{
					$(currentItem).css({
						zIndex:bannerZindex
					})
				}
			})
		};
		function changeZindexRight(){//右翻页时改变zIndex
			bannerImg.each(function(index,currentItem){
				if (index != bannerPre) {
					$(currentItem).css({
						zIndex:bannerZindex
					})
				}else{
					$(currentItem).css({
						zIndex:"10"
					})
				}
			})
		};
		function turnLeftOnce(){//向左翻页一次
			changeZindexLeft();
			$(bannerImg[bannerNumber]).animate({
				left:"-20%"
			},"slow")
			$(bannerImg[bannerNext]).animate({
				left:"0"
			},"slow",function(){
				initialPosition();
			})
			changeBannerNumberLeft();
			changeBannerSelecterBc();
		};
		function turnRightOnce(){//向右翻页一次
			changeZindexRight();
			$(bannerImg[bannerPre]).css({
				left:"-20%"
			})
			$(bannerImg[bannerNumber]).animate({
				left:"100%"
			},"slow")
			$(bannerImg[bannerPre]).animate({
				left:"0"
			},"slow")
			changeBannerNumberRight();
			changeBannerSelecterBc();
		};
		
		function changeBannerSelecterBc(){
			var i;
			for (i=0;i<3;i++) {
				$(bannerSelecter[i]).find("span").css("backgroundColor","#aaa");
			}
			$(bannerSelecter[bannerNumber]).find("span").css("backgroundColor","#666");
		};
		
		function filterEventInterval(interval,fun){//过滤掉某段时间间隔(毫秒)以内的事件
			etimeStampContainer.unshift(new Date().getTime());//事件触发时设置时间戳
			if ((etimeStampContainer[0] - etimeStampContainer[1]) > interval) {//如果事件触发的间隔，大于设定的过滤间隔
				fun();
				funTimeStampContainer.unshift(new Date().getTime());//方法执行时设置时间戳
			}else if((etimeStampContainer[0] - funTimeStampContainer[0]) > interval){
				fun();
				funTimeStampContainer.unshift(new Date().getTime());//方法执行时设置时间戳
			}else{return;}
		};
		
		
		$("#turn_page_left").on("click",function(){//点击banner左翻页时
			filterEventInterval(700,turnLeftOnce);
		});
		$("#turn_page_right").on("click",function(){//点击banner右翻页时
			filterEventInterval(700,turnRightOnce);
		});
		
		
		bannerSelecter.each(function(index,currentItem){//点击banner选择条的时候切换banner
			$(currentItem).on("click",function(){
				filterEventInterval(700,function(){
					switch (index){
						case bannerNumber:
							break;
						case bannerNumber+1:
							turnLeftOnce();
							break;
						case bannerNumber+2:
							turnLeftOnce();
							setTimeout(function(){
								turnLeftOnce();
							},620);
							break;
						case bannerNumber-1:
							turnRightOnce();
							break;
						case bannerNumber-2:
							turnRightOnce();
							setTimeout(function(){
								turnRightOnce();
							},500);
							break;
						default:
							break;
					};
					
				});
			});
		});
		bannerTimeOut = setInterval(function(){//页面刷新后自动翻页三次
			turnLeftOnce();
			if (++turnThree > 3) {
				clearInterval(bannerTimeOut);
			}else{return;};
		},4000);
		$("#banner_area").on("click",function(){//点击banner区域后取消计时器
			clearInterval(bannerTimeOut);
		});
	});//document.ready结束
})();