	
	//这个版本有很多问题，过些天在学两遍黄老师的方法，重新写一遍
	
	$("document").ready(function(){
	////定义方法区域
				var start = 0,
					gameover = 0,
					li = $("li"),
					len = li.length;
				
				//定义随机生成2或4的方法
				function random_2_4(){
					var arr = [2,4],
						q = Math.floor(Math.random()*2);
					return arr[q];
				};
				//随机获取两个数字
				function get_li(total_emptyGrid){
					x = Math.floor(Math.random()*total_emptyGrid);
					y = Math.floor(Math.random()*total_emptyGrid);
					while(y === x){
						y = Math.floor(Math.random()*total_emptyGrid);
					}
					return {
						li_x:x,
						li_y:y
					}
				};
				
				//定义数字颜色变化,并计算总得分
				function change_color(){
					var li = $("li"),score = 0,reg = /\d+/g;
					for (i=0;i<len;i++) {//遍历li元素
						var grid = li[i].textContent,
							number_ = grid == ""?0:parseInt(grid),
							arr = number_.toString().match(reg),
							red = number_*2+50,
							green = 80-number_*2,
							blue = number_*2+30;
						if (parseInt(arr[0])>100) {//此处有bug还没有解决，即数值小于100时字体也会变小
							$(li[i]).css({"font-size" : "40px"});
						}
						score = score+number_;
						$(li[i]).css({"color" : "rgb("+red+","+green+","+blue+")"});
					}
					$("#score").text(score);
				};
				
				//定义统计空格子的方法
				function find_emptyGrid(){
					var li = $("li"),
						arr_emptyGrid = [];
					for (i=0;i<len;i++) {//遍历li元素，找出不含数字的格子
						if (li[i].innerHTML == "") {
							arr_emptyGrid.push(li[i]);
						}
					}
					if (arr_emptyGrid.length == 0) {//当没有空格子的时候
						return {
							emptyGrid:arr_emptyGrid,
							boo:false
						}
					}
					return {
						emptyGrid:arr_emptyGrid,
						boo:true
					}
				};
				
				function creat_number() {//找到空格子，随机生成数字
							var result = find_emptyGrid(),
								arr_empty = result.emptyGrid,
								len = arr_empty.length;
							if (len >= 2) {//当含有空格子的时候，随机找2个添加数字
								var li_num = get_li(len);
								arr_empty[li_num.li_x].innerHTML = random_2_4();
								//arr_empty[li_num.li_y].innerHTML = random_2_4();
							}
							if (len == 1) {//当仅含有一个空格子的时候，添加数字
								arr_empty[0].innerHTML = random_2_4();
							}
						};
				
				//定义重新开始的方法
				function restart(){
					$("li").each(function(){
						this.textContent = "";
					})
					$("#score").text("0");
					start = 0;
					gameover = 0 ;
				};
				
				
				//定义添加数字以及判断是否Game over
				function judge_gameover (){
					var result = find_emptyGrid();
					if (result.boo) {//添加随机数字
						creat_number();
						change_color();
					} else{
						//判断是否还有可相加的数字
						var li_full = $("li"),judge_number = 0,
							this_text,prev_text,next_text,up_text,down_text,this_number;
						
						li_full.each(function(){
							this_number = parseInt($(this).attr("class").replace("li_",""));//取格子的位置
							this_text = $(this).text();//取当前判断的数字
							if (this_number>0) {//取左边的数字
								prev_text = parseInt($(this).prev().text());
							}else{
								prev_text="abc";
							}
							if (this_number<15) {//取右边的数字
								next_text = parseInt($(this).next().text());	
							}else{
								next_text="abc";
							}
							
							if (this_number>3) {//取上边的数字
								up_text = parseInt(li_full[this_number-4].textContent);
							}else{
								up_text="abc";
							}
							if(this_number<12){//取下面的数字
								down_text = parseInt(li_full[this_number+4].textContent);
							}else{
								down_text="abc";
							}
							if (this_number==0 || this_number==4 || this_number==8 || this_number==12){//判断this四周数字是否相等
								if (this_text != next_text && this_text != up_text && this_text != down_text) {
									judge_number = judge_number+1;
								}
							}else if (this_number==3 || this_number==7 || this_number==11 || this_number==15) {//判断this四周数字是否相等
								if (this_text != prev_text && this_text != up_text && this_text != down_text) {
									judge_number = judge_number+1;
								}
							} else{//判断this四周数字是否相等
								if (this_text != prev_text && this_text != next_text && this_text != up_text && this_text != down_text) {
									judge_number = judge_number+1;
								}
							}
						})//each结束
						if (judge_number == 16) {
							gameover = 1;
							var feedback = confirm("Game over!点击确定重新开始");
							if(feedback){
								restart();
								creat_number();
								creat_number();
								change_color();
								start = 1;
							}
						}
					}
				};//judge_gameover方法结束
				
				//点击开始，开始游戏
				$("#begin").on("click",function(){
					var arr_empty = find_emptyGrid();
					if(arr_empty.emptyGrid.length == 16){
						creat_number();
						creat_number();
						change_color();
						start = 1;
					}else if (gameover == 1) {
//						var feedback = confirm("Game over!点击确定重新开始");
//						if(feedback){
							restart();
							creat_number();
							creat_number();
							change_color();
							start = 1;
//						}
					}else{
						alert("休闲时光已经开始，请按方向键进行操作");
					}
				})
			
				
	//按方向键进行游戏操作
			document.addEventListener("keydown",function(e){
				if (start == 1) {//判断是否已经开始
					var li = $("li"),
						li_containNumber = [];
					for (i=0;i<len;i++) {//遍历li元素，找出含有数字的
						if (!li[i].innerHTML == "") {
							li_containNumber.push(li[i]);
						} 
					};
					if (e.keyCode == 37 || e.which == 37) {//左方向键被按
						var len_cn = li_containNumber.length;
						for (i=0;i<len_cn;i++) {
							var li_which = parseInt(li_containNumber[i].className.replace("li_",""));//找出哪个li中含有数字
							
							//定义移动方法
							function move_continue (x){
								var li_left = $("li").eq(li_which-x),
									li_right = $("li").eq(li_which-(x-1));
								li_left.text(li_right.text());//将数字移入前一个li中
								li_right.text("");//清除自己的数字
							}
							//定义相加方法
							function add_continue (x){
									var li_left = $("li").eq(li_which-x),
										li_right = $("li").eq(li_which-(x-1));
									li_left.text(parseInt(li_left.text())+parseInt(li_right.text()));//进行相加
									li_right.text("");//清除自己的数字
							}
							
							if (li_which == 0 || li_which == 4 || li_which == 8 || li_which == 12 ) {
								console.log("a");
							}else if ($("li").eq([li_which-1]).text() == ""){
								$("li").eq(li_which-1).text(li_containNumber[i].textContent);//移动
								li_containNumber[i].textContent = "";//清除自己的数字
								
								if (li_which-1 == 0 || li_which-1 == 4 || li_which-1 == 8 || li_which-1 == 12 ){
									console.log("a");
								}else if($("li").eq([li_which-2]).text() == ""){//继续移动
									 move_continue (2);
									 
									 if (li_which-2 == 0 || li_which-2 == 4 || li_which-2 == 8 || li_which-2 == 12 ){
										console.log("a");
									}else if($("li").eq([li_which-3]).text() == ""){//继续移动
										 move_continue (3);
										 
									}else if ($("li").eq([li_which-3]).text() == $("li").eq([li_which-2]).text()) {//如果数字相等
										add_continue (3);
									}
								}else if ($("li").eq([li_which-2]).text() == $("li").eq([li_which-1]).text()) {//如果数字相等
										add_continue (2);
								}
							}else if($("li").eq([li_which-1]).text() == li_containNumber[i].textContent){//如果数字相等
								$("li").eq(li_which-1).text(parseInt(li_containNumber[i].textContent)+parseInt($("li").eq(li_which-1).text()));//进行相加
								li_containNumber[i].textContent = "";//清除自己的数字
							}
						}
						
						judge_gameover ();
							
					}//if37结束
								
					if (e.keyCode == 38 || e.which == 38) {//上方向键被按
						var len_cn = li_containNumber.length;
						for (i=0;i<len_cn;i++) {
							var li_which = parseInt(li_containNumber[i].className.replace("li_",""));//找出哪个li中含有数字
							
							//定义移动方法
							function move_continue (x){
								var li_up = $("li").eq(li_which-x),
									li_down = $("li").eq(li_which-(x-4));
								li_up.text(li_down.text());//将数字移入前一个li中
								li_down.text("");//清除自己的数字
							}
							//定义相加方法
							function add_continue (x){
									var li_up = $("li").eq(li_which-x),
										li_down = $("li").eq(li_which-(x-4));
									li_up.text(parseInt(li_up.text())+parseInt(li_down.text()));//进行相加
									li_down.text("");//清除自己的数字
							}
							
							if (li_which == 0 || li_which == 1 || li_which == 2 || li_which == 3 ) {
								console.log("a");
							}else if ($("li").eq([li_which-4]).text() == ""){
								$("li").eq(li_which-4).text(li_containNumber[i].textContent);//移动
								li_containNumber[i].textContent = "";//清除自己的数字
								
								if (li_which-4 == 0 || li_which-4 == 1 || li_which-4 == 2 || li_which-4 == 3 ){
									console.log("a");
								}else if($("li").eq([li_which-8]).text() == ""){//继续移动
									 move_continue (8);
									 
									 if (li_which-8 == 0 || li_which-8 == 1 || li_which-8 == 2 || li_which-8 == 3 ){
										console.log("a");
									}else if($("li").eq([li_which-12]).text() == ""){//继续移动
										 move_continue (12);
										 
									}else if ($("li").eq([li_which-12]).text() == $("li").eq([li_which-8]).text()) {//如果数字相等
										add_continue (12);
									}
								}else if ($("li").eq([li_which-8]).text() == $("li").eq([li_which-4]).text()) {//如果数字相等
										add_continue (8);
								}
							}else if($("li").eq([li_which-4]).text() == li_containNumber[i].textContent){//如果数字相等
								$("li").eq(li_which-4).text(parseInt(li_containNumber[i].textContent)+parseInt($("li").eq(li_which-4).text()));//进行相加
								li_containNumber[i].textContent = "";//清除自己的数字
							}
						}
						judge_gameover ();
						
					}//if38结束
				
					if (e.keyCode == 39|| e.which == 39) {//右方向键被按
						var len_cn = li_containNumber.length;
						for (i=len_cn-1;i>=0;i--) {
							var li_which = parseInt(li_containNumber[i].className.replace("li_",""));//找出哪个li中含有数字
							
							//定义移动方法
							function move_continue (x){
								var li_right = $("li").eq(li_which+x),
									li_left = $("li").eq(li_which+(x-1));
								li_right.text(li_left.text());//将数字移入前一个li中
								li_left.text("");//清除自己的数字
							}
							//定义相加方法
							function add_continue (x){
									var li_right = $("li").eq(li_which+x),
										li_left = $("li").eq(li_which+(x-1));
									li_right.text(parseInt(li_left.text())+parseInt(li_right.text()));//进行相加
									li_left.text("");//清除自己的数字
							}
							
							if (li_which == 3 || li_which == 7 || li_which == 11 || li_which == 15 ) {
								console.log("a");
							}else if ($("li").eq([li_which+1]).text() == ""){
								$("li").eq(li_which+1).text(li_containNumber[i].textContent);//移动
								li_containNumber[i].textContent = "";//清除自己的数字
								
								if (li_which+1 == 3 || li_which+1 == 7 || li_which+1 == 11 || li_which+1 == 15 ){
									console.log("a");
								}else if($("li").eq([li_which+2]).text() == ""){//继续移动
									 move_continue (2);
									 
									 if (li_which+2 == 3 || li_which+2 == 7 || li_which+2 == 11 || li_which+2 == 15 ){
										console.log("a");
									}else if($("li").eq([li_which+3]).text() == ""){//继续移动
										 move_continue (3);
										 
									}else if ($("li").eq([li_which+3]).text() == $("li").eq([li_which+2]).text()) {//如果数字相等
										add_continue (3);
									}
								}else if ($("li").eq([li_which+2]).text() == $("li").eq([li_which+1]).text()) {//如果数字相等
										add_continue (2);
								}
							}else if($("li").eq([li_which+1]).text() == li_containNumber[i].textContent){//如果数字相等
								$("li").eq(li_which+1).text(parseInt(li_containNumber[i].textContent)+parseInt($("li").eq(li_which+1).text()));//进行相加
								li_containNumber[i].textContent = "";//清除自己的数字
							}
						}
						judge_gameover ();
						
					}//if39结束
				
					if (e.keyCode == 40|| e.which == 40) {//下方向键被按
						var len_cn = li_containNumber.length;
						for (i=len_cn-1;i>=0;i--) {
							var li_which = parseInt(li_containNumber[i].className.replace("li_",""));//找出哪个li中含有数字
							
							//定义移动方法
							function move_continue (x){
								var li_down = $("li").eq(li_which+x),
									li_up = $("li").eq(li_which+(x-4));
								li_down.text(li_up.text());//将数字移入前一个li中
								li_up.text("");//清除自己的数字
							}
							//定义相加方法
							function add_continue (x){
									var li_down = $("li").eq(li_which+x),
										li_up = $("li").eq(li_which+(x-4));
									li_down.text(parseInt(li_down.text())+parseInt(li_up.text()));//进行相加
									li_up.text("");//清除自己的数字
							}
							
							if (li_which == 12 || li_which == 13 || li_which == 14 || li_which == 15 ) {
								console.log("a");
							}else if ($("li").eq([li_which+4]).text() == ""){
								$("li").eq(li_which+4).text(li_containNumber[i].textContent);//移动
								li_containNumber[i].textContent = "";//清除自己的数字
								
								if (li_which+4 == 12 || li_which+4 == 13 || li_which+4 == 14 || li_which+4 == 15 ){
									console.log("a");
								}else if($("li").eq([li_which+8]).text() == ""){//继续移动
									 move_continue (8);
									 
									 if (li_which+8 == 12 || li_which+8 == 13 || li_which+8 == 14 || li_which+8 == 15 ){
										console.log("a");
									}else if($("li").eq([li_which+12]).text() == ""){//继续移动
										 move_continue (12);
										 //
									}else if ($("li").eq([li_which+12]).text() == $("li").eq([li_which+8]).text()) {//如果数字相等
										add_continue (12);
									}
								}else if ($("li").eq([li_which+8]).text() == $("li").eq([li_which+4]).text()) {//如果数字相等
										add_continue (8);
								}
							}else if($("li").eq([li_which+4]).text() == li_containNumber[i].textContent){//如果数字相等
								$("li").eq(li_which+4).text(parseInt(li_containNumber[i].textContent)+parseInt($("li").eq(li_which+4).text()));//进行相加
								li_containNumber[i].textContent = "";//清除自己的数字
							}
						}
						judge_gameover ();
						
					}//if40结束
				}//判断“是否已经开始”结束
			})//keydown结束
	});//document.ready结束
			
