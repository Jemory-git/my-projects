(function(){
	//封装获取元素的方法
	var g = function (x,searchArea){
				searchArea = searchArea === undefined?document:searchArea;
				if (x.charAt(0) == "#") {
					return searchArea.getElementById(x.replace(/#/,""));
				} else if(x.charAt(0) == "." ){
					var result = searchArea.getElementsByClassName(x.replace(/\./,""));
					var carr = [],i;
					for (i=0;i<result.length;i++) {//将返回结果转成真数组
						carr[i]=result[i];
					}
					return carr;
				}else{
					var result = searchArea.getElementsByTagName(x);
					var tarr = [],m;
					for (m=0;m<result.length;m++) {//将返回结果转成真数组
						tarr[m]=result[m]
					}
					return tarr;
				}
			};
	//元素绑定事件的兼容写法
	var bindEvent = function (type,element,fun) {
						if (element.addEventListener){
							element.addEventListener(type,fun,false);
						}else if(element.attachEvent){
							element.attachEvent("on"+type,fun);
						}else{
							element["on"+type] = fun;
						}
					};
	var preventDef = function (e){//定义阻止默认事件的方法
						if(e.preventDefault){
							e.preventDefault();
						}else{
							e.returnValue = false;
						}
					};
	
	window.onload = function (){
		//首页搜索框聚焦时元素的显示和隐藏
		var search_input = g("#search_input"),
			lis = g("li",g("#search_history")),//点击历史搜索框的选项时，拿到内容，填入搜索框
			banner_number = 0,
			banner_interval,
			catalog_num = 0,
			move_arr = [],
			circle_point_lis = g("li",g("#circle-point")),
			catalog_area = g("#catalog_area"),
			item_content = g(".item_content",catalog_area),
			h_option = g(".h_option"),
			content_option = g(".content_option"),
			timing;
			
			
			
		function change_zindex(el,znum){
			console.log("88")
			el.style.zIndex = znum;
		}
		
		function set_display(ele,value){
			ele.style.display = value;
			
		}
		function show_height(el){
			g(el).style.height = "200px";
		}
		function hide_height(eleme){
			g(eleme).style.height = "0px";
		}
		function show_opacity (banel){
			banel.style.opacity = 1;
		}
		function hide_opacity (banel){
			banel.style.opacity = 0;
		}
		function recover_bgc (){//恢复圆圈的背景色
			circle_point_lis.forEach(function(currentValue){
				currentValue.style.backgroundColor = "#4B96DC";
			})
		}
		function turnPage(){//定义翻页
			show_opacity(g(".banner")[banner_number]);
			recover_bgc();
			circle_point_lis[banner_number].style.backgroundColor = "#FFF";
		}
		function timing_turnPage() {//设置banner图定时翻页
			hide_opacity(g(".banner")[banner_number]);
			banner_number = banner_number>4?0:(banner_number+1);
			turnPage();
		}
		function setClass(el,clasNam){//定义增加class名称的方法
			var clasNams = el.className;
			if (clasNams.indexOf(clasNam) < 0) {
				el.className = clasNams + " " + clasNam;
			}else{return}
		}
		function wipeoutClass(el,clasNam){//定义去除指定class名称的方法
			var clasNams = el.className;
			if (clasNams.indexOf(clasNam) > 0) {
				el.className = clasNams.replace(clasNam,"");
			}else{return}
		}
		
		function clearStyleForThisPage(){//定义清楚样式的方法，仅用于本页面
			var i,x;
			for (i=0;i<3;i++) {//清除全部元素的border_bottom_red
				wipeoutClass(h_option[i],"border_bottom_red");
			}
			for (x=0;x<3;x++) {//设置全部元素的display = none
				set_display(content_option[x],"");
			}
		}
		function drawCaptcha(CaptchaUrl){
			var context = g("#draw_Captcha").getContext("2d"),img;
			img = new Image();
			img.src = CaptchaUrl;
			context.drawImage(img,0,0);
			
			context.beginPath();
			context.font="30px Georgia";
			context.strokeText("不要扫哦!",100,300);
		}
	//注册 登录框 功能块 开始	
	
	h_option.forEach(function (currentValue,index) {//点击登录框中的选项时，切换显示状态
		bindEvent("click",currentValue,function(){
			clearStyleForThisPage();
			
			setClass(currentValue,"border_bottom_red");//设置点击的元素的边框
			set_display(content_option[index],"block");//设置对应点击元素的内容
		})
	});
	bindEvent("click",g("#shutdown_login"),function(){//点击×时，隐藏登录框，停止绘制二维码
		set_display(g("#layer"),"none");
		set_display(g("#login_center"),"none");
		clearInterval(timing);
	});
	bindEvent("click",g("#login_btn"),function(){//点击登录按钮时 弹出登录框
		set_display(g("#layer"),"block");
		set_display(g("#login_center"),"block");
		
		clearStyleForThisPage();
		
		setClass(g("#login_option"),"border_bottom_red");//设置点击的元素的边框
		set_display(content_option[0],"block");//设置对应点击元素的内容
	});
	bindEvent("click",g("#register_btn"),function(){//点击注册按钮时 弹出注册框
		set_display(g("#layer"),"block");
		set_display(g("#login_center"),"block");
		
		clearStyleForThisPage();
		
		setClass(g("#register_option"),"border_bottom_red");//设置点击的元素的边框
		set_display(content_option[1],"block");//设置对应点击元素的内容
	});
	bindEvent("click",g("#qrcode_option"),function(){//点击二维码登录时，开始动态绘制二维码
		drawCaptcha("img/qrcode.jpg");
		timing = setInterval(function(){
			drawCaptcha("img/qrcode.jpg");
		},60000);
	});
	bindEvent("click",g("#submit"),function(e){//登录后显示个人中心和消息
		preventDef(e);//当服务器信息返回来时，执行下面的代码
		
		set_display(g("#layer"),"none");//关闭遮罩层和登录框
		set_display(g("#login_center"),"none");
		clearInterval(timing);
		
		set_display(g("#register"),"none");
		set_display(g("#login"),"none");
		
		set_display(g("#xiaoxi"),"block");
		set_display(g("#after_login"),"block");
	});
	bindEvent("click",g("#exitAccount"),function(){//退出账户后显示登录和注册按钮
		set_display(g("#register"),"block");
		set_display(g("#login"),"block");
		
		set_display(g("#xiaoxi"),"none");
		set_display(g("#after_login"),"none");
	});
	//注册 登录框 功能块 结束	
		
	//banner 分类列表区域 开始
		//优化鼠标移动方向，增强容错性 开始
//	var i,
	var ic_len = item_content.length;
	bindEvent("mousemove",catalog_area,function(e){
		e = e || window.event;
		move_arr.push(e.clientY);
		var len = move_arr.length;
		if (move_arr[len-1] > move_arr[len-2]) {//如果鼠标向下移动，则设置上面的z-index大于下面
			var i;
			for(i=0;i<ic_len;i++){
				item_content[i].style.zIndex = 100-i;
			}
		}
		if (move_arr[len-1] < move_arr[len-2]) {//如果鼠标向上移动，则设置 下面的z-index大于上面
			var i;
			for(i=0;i<ic_len;i++){
				item_content[i].style.zIndex = 100+i;
			}
		}
	});
		//优化鼠标移动方向，增强容错性 结束
	g(".catalog_item",catalog_area).forEach(function(currentValue,index){//鼠标进入目录项时显示目录内容
		bindEvent("mouseover",currentValue,function(){
			set_display(item_content[index],"block");
			show_opacity(item_content[index]);
		})
	});
	g(".catalog_item",catalog_area).forEach(function(currentValue,index){//鼠标离开目录项时隐藏目录内容
		bindEvent("mouseleave",currentValue,function(){
			hide_opacity(item_content[index]);
			setTimeout(function(){
				if (g(".item_content")[index].getAttribute("style").indexOf("opacity: 0") > 0) {
					set_display(item_content[index],"none");
				}
			},300)
		})
	});
	item_content.forEach(function(currentValue,index){//鼠标进入 目录项内容    时显示目录内容
		bindEvent("mouseover",currentValue,function(){
			show_opacity (item_content[index]);
		})
	});
	item_content.forEach(function(currentValue,index){//鼠标离开 目录项内容    时隐藏目录内容
		bindEvent("mouseleave",currentValue,function(){
			hide_opacity (item_content[index]);
			set_display(item_content[index],"none")
		})
	});
	//banner 分类列表区域 结束
	//banner翻页 开始	
		bindEvent("click",turn_page_left,function(){//点击banner左箭头翻页
			hide_opacity(g(".banner")[banner_number]);
			banner_number = banner_number<1?5:(banner_number-1);
			turnPage();
		});
		bindEvent("click",turn_page_right,function(){//点击banner右箭头翻页
			hide_opacity(g(".banner")[banner_number]);
			banner_number = banner_number>4?0:(banner_number+1);
			turnPage();
		});
		circle_point_lis.forEach(function(currentValue,index){//点击banner圆点翻页
			bindEvent("click",currentValue,function(){
				hide_opacity(g(".banner")[banner_number]);
				banner_number = index;
				turnPage();
			})
		});
		banner_interval = setInterval(timing_turnPage,3000);//开启定时翻页
		bindEvent("mouseenter",banner_img,function(){//鼠标进入banner时取消定时器
			clearInterval(banner_interval);
		});
		bindEvent("mouseleave",banner_img,function(){//鼠标离开banner时设置定时器
			banner_interval = setInterval(timing_turnPage,3000);
		});
	//banner翻页 结束		
	//搜索框 开始	
		bindEvent("focus",search_input,function(){//搜索历史框显示，推荐隐藏
			show_height("#search_history");
			set_display(g("#quick_search"),"none");
		});
		bindEvent("blur",search_input,function(){//搜索历史框隐藏
			hide_height("#search_history");
			if(g("#search_input").value == ""){
				set_display(g("#quick_search"),"block");				
			}
		});
		lis.forEach(function(currentValue){//选择搜索历史进行搜索
			bindEvent("mousedown",currentValue,function(){
				search_input.value = currentValue.innerHTML;
			})
		});
	//搜索框 结束
	//购物车和个人中心 开始
		bindEvent("mouseover",shopping_cart,function(){//购物车显示
			set_display(g("#myCart"),"block");
		});
		bindEvent("mouseleave",myCart,function(){//购物车隐藏
			set_display(g("#myCart"),"none");
		});
		bindEvent("mouseover",myCenter,function(){//个人中心显示
			set_display(g("#myCenter_box"),"block");
		});
		bindEvent("mouseleave",myCenter_box,function(){//个人中心隐藏
			set_display(g("#myCenter_box"),"none");
		});
	//购物车和个人中心 结束
	};//window.onload 结束
})();
