(function(){
	$(document).ready(function(){
		$("#banner_area").height(document.documentElement.clientHeight - 48);
		function clickFoldBtn(){//点击折叠菜单按钮
				$("#fold_product_list").fadeIn();
				$("#fold_btn").css("display","none");
				$("#fold_btn_shutdown").css("display","block");
				$("#shopping_bag_btn").slideToggle();
				$("#shopping_bag_list").hide();//隐藏购物袋
				$(".triangle").hide();//隐藏位置三角
		};
		function clickXfold(){//点击折叠菜单的X
				$("#quickSearch").fadeOut();
				$("#fold_product_list").removeClass("translatey");
				$("#fold_product_list").css("display","none");
				$("#fold_btn_shutdown").css("display","none");
				$("#fold_btn").css("display","block");
				$("#icon_down").css("display","none");
				$("#appleHome").css("display","block");
				$("#shopping_bag_btn").slideToggle();
		};
		function clickXsearch(){//点击搜索栏的X
			$(".search-li").hide();
			$(".search-li").animate({
					left:"150%",
					opacity:"0"
			});
			$("#quickSearch").hide();
			$(".quickSearch-item").animate({
					left:"1000px",
					opacity:"0"
			});
			$(".scale0").css("transform","scale(1)");
			$("#search_shutdown").css("display","none");
			setTimeout(function(){
				$("#shopping_bag_t").css("display","block");
			},300);
		};
		
		$("#fold_btn").on("click",function(){//点击折叠按钮
			clickFoldBtn();
		});
		$("#fold_btn_shutdown").on("click",function(){//点击×
			clickXfold();
		});
		
		$("#search_li").on("click",function(){//点击折叠中的搜索框
			
			$("#appleHome").hide();
			$("#icon_down").fadeIn();
			$("#fold_product_list").addClass("translatey");
			$("#quickSearch").fadeIn();
			$(".quickSearch-item").animate({
					left:"0",
					opacity:"1"
			});
			setTimeout(function(){
				while ($(window).scrollTop() !== 0){
					$(window).scrollTop(0);
				}
			},80);
			
		});
		
		$("#icon_down").on("click",function(){//点击下三角
			$(this).css("display","none");
			$("#appleHome").fadeIn();
			$("#fold_product_list").removeClass("translatey");
			$("#quickSearch").fadeOut();
			$(".quickSearch-item").animate({
					left:"1000px",
					opacity:"0"
			});
		});
		
		$("#search_btn").on("click",function(){//点击横向导航的搜索选项
			$(".search-li").show();
			$(".search-li").animate({
					left:"50%",
					opacity:"1"
			});
			$("#quickSearch").show();
			$(".quickSearch-item").animate({
					left:"0",
					opacity:"1"
			});
			$(".triangle").hide();
			$("#shopping_bag_list").hide();
			$(".scale0").css("transform","scale(0)");
			setTimeout(function(){
				$("#shopping_bag_t").css("display","none");
				$("#search_shutdown").css("display","block");
			},300);
		});
		
		$("#search_shutdown").on("click",function(){//点击X,关闭搜索框
			clickXsearch();
		});
		
		
		
		$(".shopping-bag-btn").on("click",function(){//点击下三角
			$("#shopping_bag_list").toggle();
			$(".triangle").toggle();
			
		});
		
		$(window).on("resize",function(){
//			console.log($(window).width());
//			console.log($(window).outerWidth());
//			console.log(document.body.clientWidth);
//			console.log(document.body.offsetWidth);
//			console.log(document.body.scrollWidth);
			$("#banner_area").height(document.documentElement.clientHeight - 48);
			if ($(window).outerWidth() >= 768){
				$(".more-buy-message-header").each(function(i){//调整底部更多购买信息部分的样式
					$(this).parent().height(($(this).siblings().length + 1) * this.offsetHeight);
				});
				if ($("#fold_btn_shutdown").css("display") == "block"){
					clickXfold();
				}else{
					return;
				}
			}else if ($(window).outerWidth() < 768) {
				$(".more-buy-message-header").each(function(i){//调整底部更多购买信息部分的样式
					$(this).parent().height(this.offsetHeight);
				});
				if ($("#search_shutdown").css("display") == "block") {
					clickXsearch();
				}else{
					return;
				}
			}
			
		});
		
		//canvas 绘制彩色文字
		var ctx = document.getElementById("colorful_font").getContext("2d"),gradient;
		
		ctx.font="20px Verdana";
		// 创建渐变
		gradient=ctx.createLinearGradient(0,0,140,0);
		gradient.addColorStop("0","#CCFFFF");
		gradient.addColorStop("0.3","#CC66FF");
		gradient.addColorStop("0.5","#FF66FF");
		gradient.addColorStop("0.9","#6699FF");
		gradient.addColorStop("1.0","#6699FF");
		// 用渐变填色
		ctx.fillStyle=gradient;
		ctx.fillText("使用iPhone7",10,20);
		
		
		//更多购买信息
		$(".more-buy-message-header").on("click",function(){
			var $this = $(this),ulHeight = $this.parent().height(),thisHeight = this.offsetHeight;
			
			if($this.width() == $(".ul-container").parent().width()){
				$this.find("span.click-none").slideToggle();
				if(ulHeight > thisHeight){
					$this.parent().css("height",thisHeight);
				}else if(ulHeight <= thisHeight){
					$this.parent().css("height",thisHeight * ($this.siblings().length + 1));
				}
			}else{
				return;
			}
		});
	});//document.ready结束
})();
