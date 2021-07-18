
(function(){
	$(document).ready(function(){
		//声明变量区域
		var banner_number = 6,
		b_n_left1 = (banner_number-1)<0?8:(banner_number-1),
		b_n_left2 = (b_n_left1-1)<0?8:(b_n_left1-1),
		b_n_right1 = (banner_number+1)>8?0:(banner_number+1),
		b_n_right2 = (b_n_right1+1)>8?0:(b_n_right1+1),
		banner_tittle = $(".banner_tittle"),
		banner_toggle,
		banner_item = $(".banner_item"),
		catalog_items = $(".catalog_item"),
		catalog_contents = $(".catalog_content"),
		catalog_item_area = $("#catalog_item_area"),
		move_arr = [],
		toogleThree = $(".toogleThree"),
		toogleThree_content = $(".toogleThree_content"),
		subscribe = $(".subscribe"),
		rankingTittle = $(".ranking_tittle");
		
		
		
		//定义方法区域
		function change_number(){//定义 改变banner样式数字
			b_n_left1 = (banner_number-1)<0?8:(banner_number-1);
			b_n_left2 = (b_n_left1-1)<0?8:(b_n_left1-1);
			b_n_right1 = (banner_number+1)>8?0:(banner_number+1);
			b_n_right2 = (b_n_right1+1)>8?0:(b_n_right1+1);
		};
		function remove_banner_tittle_class(){//定义 移除banner标题的样式
			var i;
			for(i=0;i<banner_tittle.length;i++){
				$(banner_tittle[i]).removeClass("banner_tittle_center banner_tittle_left1 banner_tittle_left2 banner_tittle_right1 banner_tittle_right2");
			}
		};
		function add_banner_tittle_class(){//定义 添加banner标题的样式
			$(banner_tittle[banner_number]).addClass("banner_tittle_center");
			$(banner_tittle[b_n_left1]).addClass("banner_tittle_left1");
			$(banner_tittle[b_n_left2]).addClass("banner_tittle_left2");
			$(banner_tittle[b_n_right1]).addClass("banner_tittle_right1");
			$(banner_tittle[b_n_right2]).addClass("banner_tittle_right2");
		};
		function banner_auto_toggle(){//定义 自动切换banner标题和banner图
			remove_banner_tittle_class();
			hide_banner_img();
			banner_number= banner_number>7?0:banner_number+1;//改变banner_number的值
			change_number();
			add_banner_tittle_class();
			show_banner_img();
		};
		function hide_banner_img(){//隐藏banner图
			$(banner_item[banner_number]).animate({opacity:'1'},50);
			$(banner_item[banner_number]).animate({opacity:'.8'},100);
			$(banner_item[banner_number]).animate({opacity:'.6'},150);
			$(banner_item[banner_number]).animate({opacity:'.4'},200);
			$(banner_item[banner_number]).animate({opacity:'.2'},250);
			$(banner_item[banner_number]).animate({opacity:'0'},300);
			$(banner_item[banner_number]).css("z-index",20);
		};
		function show_banner_img(){//显示banner图
			
			$(banner_item[banner_number]).animate({opacity:'0'},50);
			$(banner_item[banner_number]).animate({opacity:'.2'},100);
			$(banner_item[banner_number]).animate({opacity:'.4'},150);
			$(banner_item[banner_number]).animate({opacity:'.6'},200);
			$(banner_item[banner_number]).animate({opacity:'.8'},250);
			$(banner_item[banner_number]).animate({opacity:'1'},300);
			$(banner_item[banner_number]).css("z-index",30);
		};
		
		function turn_banner_right(){//定义向右切换banner
			hide_banner_img();
			banner_number = banner_number>7?0:(banner_number+1);//改变banner_number的值
			show_banner_img();
		};
		function turn_banner_left(){//定义向左切换banner
			hide_banner_img();
			banner_number = banner_number<1?8:(banner_number-1);//改变banner_number的值
			show_banner_img();
		};
		
		
		//方法应用区域
			// 分类目录 区域 开始
					//设置z-index值，优化鼠标移动方向，增强容错性 开始
		var cc_len = catalog_contents.length;
		catalog_item_area.on("mousemove",function(e){
			e = e || window.event;
			move_arr.push(e.clientY);
			var len = move_arr.length;
			if (move_arr[len-1] > move_arr[len-2]) {//如果鼠标向下移动，则设置上面的z-index大于下面
				var i;
				for(i=0;i<cc_len;i++){
					catalog_contents[i].style.zIndex = 100-i;
				}
			}
			if (move_arr[len-1] < move_arr[len-2]) {//如果鼠标向上移动，则设置 下面的z-index大于上面
				var i;
				for(i=0;i<cc_len;i++){
					catalog_contents[i].style.zIndex = 100+i;
				}
			}
		});
					//设置z-index值，优化鼠标移动方向，增强容错性 结束
					
		catalog_items.each(function(index,currentitem){//进入分类item 分类内容 显示
			$(currentitem).on("mouseenter",function(){
				$(catalog_contents[index]).css("display","block");//显示内容div
				$(catalog_contents[index]).css("opacity","1");//显示内容div
				
			});
		});
		catalog_items.each(function(index,currentitem){//离开分类item 分类内容 隐藏
			$(currentitem).on("mouseleave",function(){
				var $cc = $(catalog_contents[index]);
				
				$cc.css("opacity","0");//隐藏内容div
				
				setTimeout(function(){//延迟隐藏，优化鼠标移动方向
					if ($cc.css("opacity") == 0) {
						$cc.css("display","none");
					}
				},350);
			});
		});
		catalog_contents.each(function(){//进入 分类内容区 显示
			var $this = $(this);
			$(this).on("mouseenter",function(){
				$(this).css("opacity","1");
			});
		});
		
		catalog_contents.each(function(){//离开 分类内容区 隐藏
			var $this = $(this);
			$this.on("mouseleave",function(){
				$this.css("display","none");
				$this.css("opacity","0");
			});
		});
			// 分类目录 区域 结束
		
			//banner图 切换
		$("#turn_page_left").on("click",function (){
			remove_banner_tittle_class();
			turn_banner_left();
			change_number();
			add_banner_tittle_class();
		});
		$("#turn_page_right").on("click",function (){
			remove_banner_tittle_class();
			turn_banner_right();
			change_number();
			add_banner_tittle_class();
		});
			//banner 图和标题 联动切换
		banner_toggle = setInterval(banner_auto_toggle,3000);//开始 自动切换banner标题
		$("#banner_area").on("mouseenter",function(){//取消banner标题计时器
			clearInterval(banner_toggle);
		});
		$("#banner_area").on("mouseleave",function(){//重建banner标题计时器
			banner_toggle = setInterval(banner_auto_toggle,3000);
		});
		banner_tittle.each(function(index){//点击banner标题时，切换banner
			$(this).on("click",function(){
				remove_banner_tittle_class();
				hide_banner_img();
				banner_number = index;//改变banner_number的值
				change_number();
				add_banner_tittle_class();
				show_banner_img();
			})
		});
		add_banner_tittle_class();//给banner标题添加样式
		show_banner_img();//显示banner图
		
			//toogleThree 切换
		toogleThree.each(function(index){
			$(this).on("mouseenter",function(){
				var i;
				for(i=0;i<3;i++){
					$(toogleThree_content[i]).css("display","none");
					$(toogleThree[i]).removeClass("active");
				};
				$(toogleThree[index]).addClass("active");
				$(toogleThree_content[index]).css("display","block");
			});
		});
		 
		 	//订阅艺人 和订阅场馆 切换
		subscribe.each(function(index){
			$(this).on("mouseover",function(){
				var i;
				for(i=0;i<2;i++){
					$(subscribe[i]).removeClass("spanHover");
				};
				$(subscribe[index]).addClass("spanHover");
				$($(".subscribe_artistANDVenues")[0]).css("display","none");
				$($(".subscribe_artistANDVenues")[1]).css("display","none");
				$($(".subscribe_artistANDVenues")[index]).css("display","block");
			});
		});
			//大小剧场排行切换
		rankingTittle.each(function(index){
			$(this).on("mouseenter",function(){
				var i;
				for(i=0;i<2;i++){
					$(rankingTittle[i]).removeClass("toggleRanking");
				};
				$(rankingTittle[index]).addClass("toggleRanking");
				$($(".ranking")[0]).css("display","none");
				$($(".ranking")[1]).css("display","none");
				$($(".ranking")[index]).css("display","block");
			})
		});
		 	//toogleThree 的宽度
			$("#cnxh").width(193*toggleThreeData.cnxh.length)
			$("#jrtj").width(193*toggleThreeData.jrtj.length)
			$("#yushou").width(193*toggleThreeData.yushou.length)
			
	
		$(window).scroll(function(){//fixed 条的隐藏和显示
			var st = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
			console.log(st)
			if(st == 0){
				$("#fixDiv").hide();
			}else{
				$("#fixDiv").show();
			}
		});
		$("#fix-fhdb").click(function(){//回到顶部
			var st = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop,hddbTimer;
			if(st>0) {
				hddbTimer = setInterval(function(){
					st -= 150;
//					document.body.scrollTop = st;
					window.scrollTo(0,st);
					if (st<0) {
						st = 0;
						clearInterval(hddbTimer);
					}
				},10);
			};
		});
	});//document.ready 结束
})();
