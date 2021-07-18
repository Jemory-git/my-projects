//handlebars js代码区

			//handlebars helper 注册
			Handlebars.registerHelper('isTopThree', function(value, options){//前三名背景色为橙色
				if (value <=3) {
					return options.fn(this);
				}
			});
			Handlebars.registerHelper('upAndDown', function(value,options){//判断changeNumber和address
				if (!value) {
					return options.fn(this);;
				}else if (value > 0) {
					return '<span class="icon-arrow-up"></span>';
				}else if(value == 0){
					return '<span class="icon-minus" style="color:#7fab5d"></span>';
				}else if(value < 0){
					return '<span class="icon-arrow-down" style="color:lightgray"></span>';
				}
			});
			
			//处理模板区域
			function dataToDom(idObj,data){//定义处理模板，填入数据，输出DOM的方法
				$(idObj.container).html(
						Handlebars.compile(
							$(idObj.template).html()
						)(data)
					)
			};
			dataToDom({template:"#card-template",container:"#catalog_area"},performanceData);
			dataToDom({template:"#card-template-cnxh",container:"#cnxh"},toggleThreeData);
			dataToDom({template:"#card-template-jrtj",container:"#jrtj"},toggleThreeData);
			dataToDom({template:"#card-template-yushou",container:"#yushou"},toggleThreeData);
			dataToDom({template:"#card-template-smallTheater",container:"#smallTheater"},rankingData);
			dataToDom({template:"#card-template-bigTheater",container:"#bigTheater"},rankingData);
			dataToDom({template:"#card-template-theaterF1",container:"#floor1_container"},floorData);
			dataToDom({template:"#card-template-theaterF2",container:"#floor2_container"},floorData);
			dataToDom({template:"#card-template-theaterF3",container:"#floor3_container"},floorData);
			dataToDom({template:"#card-template-theaterF4",container:"#floor4_container"},floorData);
			dataToDom({template:"#card-template-theaterF5",container:"#floor5_container"},floorData);
			dataToDom({template:"#card-template-competition",container:"#competition"},competitionsData);
			dataToDom({template:"#card-template-dance",container:"#dance"},danceData);
			dataToDom({template:"#card-template-children",container:"#children"},childrenData);
			dataToDom({template:"#card-template-rockMusic",container:"#rockMusic"},rockMusicData);
			
//			var source_catalog = $("#card-template").html(),//取到模板
//				template_catalog = Handlebars.compile(source_catalog),//预处理
//				h_catalog = template_catalog(performanceData);//传入数据
//			$("#catalog_area").html(h_catalog);//放入DOM文档
		
