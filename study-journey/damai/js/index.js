(function() {
	//	if(!!window.ActiveXObject || "ActiveXObject" in window){//如果浏览器是ie
	var version = navigator.userAgent;
	if(version.indexOf("MSIE 9.0") >= 0) { //如果是浏览器是ie9
		(function() {
			$(document).ready(function() {
				//声明变量区域
				var bannerNumber = 6,
					bannerNumberLeft1 = (bannerNumber - 1) < 0 ? 8 : (bannerNumber - 1),
					bannerNumberLeft2 = (bannerNumberLeft1 - 1) < 0 ? 8 : (bannerNumberLeft1 - 1),
					bannerNumberRight1 = (bannerNumber + 1) > 8 ? 0 : (bannerNumber + 1),
					bannerNumberRight2 = (bannerNumberRight1 + 1) > 8 ? 0 : (bannerNumberRight1 + 1),
					bannerTittle = $(".banner_tittle"),
					bannerToggle,
					bannerItem = $(".banner_item"),
					catalogItems = $(".catalog_item"),
					catalogContents = $(".catalog_content"),
					catalogItemArea = $("#catalog_item_area"),
					moveArr = [],
					toogleThree = $(".toogleThree"),
					toogleThreeContent = $(".toogleThree_content"),
					subscribe = $(".subscribe"),
					rankingTittle = $(".ranking_tittle");

				//定义方法区域
				function changeNumber() { //定义 改变banner样式数字
					bannerNumberLeft1 = (bannerNumber - 1) < 0 ? 8 : (bannerNumber - 1);
					bannerNumberLeft2 = (bannerNumberLeft1 - 1) < 0 ? 8 : (bannerNumberLeft1 - 1);
					bannerNumberRight1 = (bannerNumber + 1) > 8 ? 0 : (bannerNumber + 1);
					bannerNumberRight2 = (bannerNumberRight1 + 1) > 8 ? 0 : (bannerNumberRight1 + 1);
				};

				function removeBannerTittleClass() { //定义 移除banner标题的样式
					var i;
					for(i = 0; i < bannerTittle.length; i++) {
						$(bannerTittle[i]).removeClass("banner_tittle_center banner_tittle_left1 banner_tittle_left2 banner_tittle_right1 banner_tittle_right2");
					}
				};

				function addBannerTittleClass() { //定义 添加banner标题的样式
					$(bannerTittle[bannerNumber]).addClass("banner_tittle_center");
					$(bannerTittle[bannerNumberLeft1]).addClass("banner_tittle_left1");
					$(bannerTittle[bannerNumberLeft2]).addClass("banner_tittle_left2");
					$(bannerTittle[bannerNumberRight1]).addClass("banner_tittle_right1");
					$(bannerTittle[bannerNumberRight2]).addClass("banner_tittle_right2");
				};

				function bannerAutoToggle() { //定义 自动切换banner标题和banner图
					removeBannerTittleClass();
					hideBannerImg();
					bannerNumber = bannerNumber > 7 ? 0 : bannerNumber + 1; //改变bannerNumber的值
					changeNumber();
					addBannerTittleClass();
					showBannerImg();
				};

				function hideBannerImg() { //隐藏banner图
					$(bannerItem[bannerNumber]).animate({
						opacity: '1'
					}, 50);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.8'
					}, 100);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.6'
					}, 150);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.4'
					}, 200);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.2'
					}, 250);
					$(bannerItem[bannerNumber]).animate({
						opacity: '0'
					}, 300);
					$(bannerItem[bannerNumber]).css("z-index", 20);
				};

				function showBannerImg() { //显示banner图

					$(bannerItem[bannerNumber]).animate({
						opacity: '0'
					}, 50);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.2'
					}, 100);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.4'
					}, 150);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.6'
					}, 200);
					$(bannerItem[bannerNumber]).animate({
						opacity: '.8'
					}, 250);
					$(bannerItem[bannerNumber]).animate({
						opacity: '1'
					}, 300);
					$(bannerItem[bannerNumber]).css("z-index", 30);
				};

				function turnBannerRight() { //定义向右切换banner
					hideBannerImg();
					bannerNumber = bannerNumber > 7 ? 0 : (bannerNumber + 1); //改变bannerNumber的值
					showBannerImg();
				};

				function turnBannerLeft() { //定义向左切换banner
					hideBannerImg();
					bannerNumber = bannerNumber < 1 ? 8 : (bannerNumber - 1); //改变bannerNumber的值
					showBannerImg();
				};

				//方法应用区域
				// 分类目录 区域 开始
				//设置z-index值，优化鼠标移动方向，增强容错性 开始
				var ccLen = catalogContents.length;
				catalogItemArea.on("mousemove", function(e) {
					e = e || window.event;
					moveArr.push(e.clientY);
					var len = moveArr.length;
					if(moveArr[len - 1] > moveArr[len - 2]) { //如果鼠标向下移动，则设置上面的z-index大于下面
						var i;
						for(i = 0; i < ccLen; i++) {
							catalogContents[i].style.zIndex = 100 - i;
						}
					}
					if(moveArr[len - 1] < moveArr[len - 2]) { //如果鼠标向上移动，则设置 下面的z-index大于上面
						var i;
						for(i = 0; i < ccLen; i++) {
							catalogContents[i].style.zIndex = 100 + i;
						}
					}
				});
				//设置z-index值，优化鼠标移动方向，增强容错性 结束

				catalogItems.each(function(index, currentitem) { //进入分类item 分类内容 显示
					$(currentitem).on("mouseenter", function() {
						$(catalogContents[index]).css("display", "block"); //显示内容div
						$(catalogContents[index]).css("opacity", "1"); //显示内容div

					});
				});
				catalogItems.each(function(index, currentitem) { //离开分类item 分类内容 隐藏
					$(currentitem).on("mouseleave", function() {
						var $cc = $(catalogContents[index]);

						$cc.css("opacity", "0"); //隐藏内容div

						setTimeout(function() { //延迟隐藏，优化鼠标移动方向
							if($cc.css("opacity") == 0) {
								$cc.css("display", "none");
							}
						}, 350);
					});
				});
				catalogContents.each(function() { //进入 分类内容区 显示
					var $this = $(this);
					$(this).on("mouseenter", function() {
						$(this).css("opacity", "1");
					});
				});

				catalogContents.each(function() { //离开 分类内容区 隐藏
					var $this = $(this);
					$this.on("mouseleave", function() {
						$this.css("display", "none");
						$this.css("opacity", "0");
					});
				});
				// 分类目录 区域 结束

				//banner图 切换
				$("#turn_page_left").on("click", function() {
					removeBannerTittleClass();
					turnBannerLeft();
					changeNumber();
					addBannerTittleClass();
				});
				$("#turn_page_right").on("click", function() {
					removeBannerTittleClass();
					turnBannerRight();
					changeNumber();
					addBannerTittleClass();
				});
				//banner 图和标题 联动切换
				bannerToggle = setInterval(bannerAutoToggle, 3000); //开始 自动切换banner标题
				$("#banner_area").on("click", function() { //取消banner标题计时器
					if (bannerToggle) {//如果有定时器再清除
						clearInterval(bannerToggle);
						bannerToggle = false;
					} else{
						return;
					}
				});
				$("#banner_area").on("mouseenter", function() { //取消banner标题计时器
					clearInterval(bannerToggle);
					bannerToggle = false;
				});
				$("#banner_area").on("mouseleave", function() { //重建banner标题计时器
					if (bannerToggle) {//如果没定时器才添加定时器
						return;
					} else{
						bannerToggle = setInterval(bannerAutoToggle, 3000);
					}
				});
				bannerTittle.each(function(index) { //点击banner标题时，切换banner
					$(this).on("click", function() {
						removeBannerTittleClass();
						hideBannerImg();
						bannerNumber = index; //改变bannerNumber的值
						changeNumber();
						addBannerTittleClass();
						showBannerImg();
					})
				});
				addBannerTittleClass(); //给banner标题添加样式
				showBannerImg(); //显示banner图

				//toogleThree 切换
				toogleThree.each(function(index) {
					$(this).on("mouseenter", function() {
						var i;
						for(i = 0; i < 3; i++) {
							$(toogleThreeContent[i]).css("display", "none");
							$(toogleThree[i]).removeClass("active");
						};
						$(toogleThree[index]).addClass("active");
						$(toogleThreeContent[index]).css("display", "block");
					});
				});

				//订阅艺人 和订阅场馆 切换
				subscribe.each(function(index) {
					$(this).on("mouseover", function() {
						var i;
						for(i = 0; i < 2; i++) {
							$(subscribe[i]).removeClass("spanHover");
						};
						$(subscribe[index]).addClass("spanHover");
						$($(".subscribe_artistANDVenues")[0]).css("display", "none");
						$($(".subscribe_artistANDVenues")[1]).css("display", "none");
						$($(".subscribe_artistANDVenues")[index]).css("display", "block");
					});
				});
				//大小剧场排行切换
				rankingTittle.each(function(index) {
					$(this).on("mouseenter", function() {
						var i;
						for(i = 0; i < 2; i++) {
							$(rankingTittle[i]).removeClass("toggleRanking");
						};
						$(rankingTittle[index]).addClass("toggleRanking");
						$($(".ranking")[0]).css("display", "none");
						$($(".ranking")[1]).css("display", "none");
						$($(".ranking")[index]).css("display", "block");
					})
				});
				//toogleThree 的宽度
				$("#cnxh").width(193 * toggleThreeData.cnxh.length)
				$("#jrtj").width(193 * toggleThreeData.jrtj.length)
				$("#yushou").width(193 * toggleThreeData.yushou.length)

				$(window).scroll(function() { //fixed 条的隐藏和显示
					var st = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
					if(st <= 350) {
						$("#fixDiv").hide();
					} else {
						$("#fixDiv").show();
					}
				});
				$("#fix-fhdb").click(function() { //回到顶部
					var st = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop,hddbTimer;
					if(st > 0) {
						hddbTimer = setInterval(function() {
							st -= 150;
							//					document.body.scrollTop = st;
							window.scrollTo(0, st);
							if(st < 0) {
								st = 0;
								clearInterval(hddbTimer);
							}
						}, 10);
					};
				});
			}); //document.ready 结束
		})();
	} else { //如果浏览器是非ie9
		(function() {
			$(document).ready(function() {
				//声明变量区域
				var bannerNumber = 6,
					bannerNumberLeft1 = (bannerNumber - 1) < 0 ? 8 : (bannerNumber - 1),
					bannerNumberLeft2 = (bannerNumberLeft1 - 1) < 0 ? 8 : (bannerNumberLeft1 - 1),
					bannerNumberRight1 = (bannerNumber + 1) > 8 ? 0 : (bannerNumber + 1),
					bannerNumberRight2 = (bannerNumberRight1 + 1) > 8 ? 0 : (bannerNumberRight1 + 1),
					bannerTittle = $(".banner_tittle"),
					bannerToggle,
					bannerItem = $(".banner_item"),
					catalogItems = $(".catalog_item"),
					catalogContents = $(".catalog_content"),
					catalogItemArea = $("#catalog_item_area"),
					moveArr = [],
					toogleThree = $(".toogleThree"),
					toogleThreeContent = $(".toogleThree_content"),
					subscribe = $(".subscribe"),
					rankingTittle = $(".ranking_tittle");

				//定义方法区域
				function changeNumber() { //定义 改变banner样式数字
					bannerNumberLeft1 = (bannerNumber - 1) < 0 ? 8 : (bannerNumber - 1);
					bannerNumberLeft2 = (bannerNumberLeft1 - 1) < 0 ? 8 : (bannerNumberLeft1 - 1);
					bannerNumberRight1 = (bannerNumber + 1) > 8 ? 0 : (bannerNumber + 1);
					bannerNumberRight2 = (bannerNumberRight1 + 1) > 8 ? 0 : (bannerNumberRight1 + 1);
				};

				function removeBannerTittleClass() { //定义 移除banner标题的样式
					var i;
					for(i = 0; i < bannerTittle.length; i++) {
						$(bannerTittle[i]).removeClass("banner_tittle_center banner_tittle_left1 banner_tittle_left2 banner_tittle_right1 banner_tittle_right2");
					}
				};

				function addBannerTittleClass() { //定义 添加banner标题的样式
					$(bannerTittle[bannerNumber]).addClass("banner_tittle_center");
					$(bannerTittle[bannerNumberLeft1]).addClass("banner_tittle_left1");
					$(bannerTittle[bannerNumberLeft2]).addClass("banner_tittle_left2");
					$(bannerTittle[bannerNumberRight1]).addClass("banner_tittle_right1");
					$(bannerTittle[bannerNumberRight2]).addClass("banner_tittle_right2");
				};

				function bannerAutoToggle() { //定义 自动切换banner标题和banner图
					removeBannerTittleClass();
					hideBannerImg();
					bannerNumber = bannerNumber > 7 ? 0 : bannerNumber + 1; //改变bannerNumber的值
					changeNumber();
					addBannerTittleClass();
					showBannerImg();
				};

				function hideBannerImg() { //隐藏banner图
					$(bannerItem[bannerNumber]).css("opacity", 0);
					$(bannerItem[bannerNumber]).css("z-index", 20);
				};

				function showBannerImg() { //显示banner图
					$(bannerItem[bannerNumber]).css("opacity", 1);
					$(bannerItem[bannerNumber]).css("z-index", 30);
				};

				function turnBannerRight() { //定义向右切换banner
					hideBannerImg();
					bannerNumber = bannerNumber > 7 ? 0 : (bannerNumber + 1); //改变bannerNumber的值
					showBannerImg();
				};

				function turnBannerLeft() { //定义向左切换banner
					hideBannerImg();
					bannerNumber = bannerNumber < 1 ? 8 : (bannerNumber - 1); //改变bannerNumber的值
					showBannerImg();
				};

				//方法应用区域
				// 分类目录 区域 开始
				//设置z-index值，优化鼠标移动方向，增强容错性 开始
				var ccLen = catalogContents.length;
				catalogItemArea.on("mousemove", function(e) {
					e = e || window.event;
					moveArr.push(e.clientY);
					var len = moveArr.length;
					if(moveArr[len - 1] > moveArr[len - 2]) { //如果鼠标向下移动，则设置上面的z-index大于下面
						var i;
						for(i = 0; i < ccLen; i++) {
							catalogContents[i].style.zIndex = 100 - i;
						}
					}
					if(moveArr[len - 1] < moveArr[len - 2]) { //如果鼠标向上移动，则设置 下面的z-index大于上面
						var i;
						for(i = 0; i < ccLen; i++) {
							catalogContents[i].style.zIndex = 100 + i;
						}
					}
				});
				//设置z-index值，优化鼠标移动方向，增强容错性 结束

				catalogItems.each(function(index, currentitem) { //进入分类item 分类内容 显示
					$(currentitem).on("mouseenter", function() {
						$(catalogContents[index]).css("display", "block"); //显示内容div
						$(catalogContents[index]).css("opacity", "1"); //显示内容div

					});
				});
				catalogItems.each(function(index, currentitem) { //离开分类item 分类内容 隐藏
					$(currentitem).on("mouseleave", function() {
						var $cc = $(catalogContents[index]);

						$cc.css("opacity", "0"); //隐藏内容div

						setTimeout(function() { //延迟隐藏，优化鼠标移动方向
							if($cc.css("opacity") == 0) {
								$cc.css("display", "none");
							}
						}, 350);
					});
				});
				catalogContents.each(function() { //进入 分类内容区 显示
					var $this = $(this);
					$(this).on("mouseenter", function() {
						$(this).css("opacity", "1");
					});
				});

				catalogContents.each(function() { //离开 分类内容区 隐藏
					var $this = $(this);
					$this.on("mouseleave", function() {
						$this.css("display", "none");
						$this.css("opacity", "0");
					});
				});
				// 分类目录 区域 结束

				//banner图 切换
				$("#turn_page_left").on("click", function() {
					removeBannerTittleClass();
					turnBannerLeft();
					changeNumber();
					addBannerTittleClass();
				});
				$("#turn_page_right").on("click", function() {
					removeBannerTittleClass();
					turnBannerRight();
					changeNumber();
					addBannerTittleClass();
				});
				//banner 图和标题 联动切换
				bannerToggle = setInterval(bannerAutoToggle, 3000); //开始 自动切换banner标题
				$("#banner_area").on("click", function() { //取消banner标题计时器
					if (bannerToggle) {
						clearInterval(bannerToggle);
						bannerToggle = false;
					} else{
						return;
					}
				});
				$("#banner_area").on("mouseenter", function() { //取消banner标题计时器
					clearInterval(bannerToggle);
					bannerToggle = false;
				});
				$("#banner_area").on("mouseleave", function() { //重建banner标题计时器
					if (bannerToggle) {
						return;
					} else{
						bannerToggle = setInterval(bannerAutoToggle, 3000);
					}
				});
				bannerTittle.each(function(index) { //点击banner标题时，切换banner
					$(this).on("click", function() {
						removeBannerTittleClass();
						hideBannerImg();
						bannerNumber = index; //改变bannerNumber的值
						changeNumber();
						addBannerTittleClass();
						showBannerImg();
					})
				});
				addBannerTittleClass(); //给banner标题添加样式
				showBannerImg(); //显示banner图

				//toogleThree 切换
				toogleThree.each(function(index) {
					$(this).on("mouseenter", function() {
						var i;
						for(i = 0; i < 3; i++) {
							$(toogleThreeContent[i]).css("display", "none");
							$(toogleThree[i]).removeClass("active");
						};
						$(toogleThree[index]).addClass("active");
						$(toogleThreeContent[index]).css("display", "block");
					});
				});

				//订阅艺人 和订阅场馆 切换
				subscribe.each(function(index) {
					$(this).on("mouseover", function() {
						var i;
						for(i = 0; i < 2; i++) {
							$(subscribe[i]).removeClass("spanHover");
						};
						$(subscribe[index]).addClass("spanHover");
						$($(".subscribe_artistANDVenues")[0]).css("display", "none");
						$($(".subscribe_artistANDVenues")[1]).css("display", "none");
						$($(".subscribe_artistANDVenues")[index]).css("display", "block");
					});
				});
				//大小剧场排行切换
				rankingTittle.each(function(index) {
					$(this).on("mouseenter", function() {
						var i;
						for(i = 0; i < 2; i++) {
							$(rankingTittle[i]).removeClass("toggleRanking");
						};
						$(rankingTittle[index]).addClass("toggleRanking");
						$($(".ranking")[0]).css("display", "none");
						$($(".ranking")[1]).css("display", "none");
						$($(".ranking")[index]).css("display", "block");
					})
				});
				//toogleThree 的宽度
				$("#cnxh").width(193 * toggleThreeData.cnxh.length)
				$("#jrtj").width(193 * toggleThreeData.jrtj.length)
				$("#yushou").width(193 * toggleThreeData.yushou.length)

				//fixed条
				$(window).scroll(function() { //fixed 条的隐藏和显示
					var st = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
					if(st <= 350) {
						$("#fixDiv").hide();
					} else {
						$("#fixDiv").show();
					}
				});
				$("#fix-fhdb").click(function() { //回到顶部
					var st = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop,hddbTimer;
					if(st > 0) {
						hddbTimer = setInterval(function() {
							st -= 150;
							//					document.body.scrollTop = st;
							window.scrollTo(0, st);
							if(st < 0) {
								st = 0;
								clearInterval(hddbTimer);
							}
						}, 10);
					};
				});
			}); //document.ready 结束
		})();
	} //else结束
})();
