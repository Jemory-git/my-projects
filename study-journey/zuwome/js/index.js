(function (){
	//设置滑动分页效果
	SPM.containerElement = ".sub-wrapper";
	SPM.itemElement = ".split-page-item";
//	SPM.setHeight(400);
//	SPM.setWidth(200);
//	SPM.setScrollVelocityArguments(30,1);
//	SPM.setInching(false);
	SPM.running(SPM);
	
	//swiper
	var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false
    });
    
    //onscroll 时，操作本页class
    var $thirdItem = $("#third_item"),
    	$pFlyIn = $(".p-fly-in");
    $(".sub-wrapper").on("scroll",function(){
//  	console.log($("#third_item").offset().top)
    	if ((-$thirdItem.offset().height) <= $thirdItem.offset().top && $thirdItem.offset().top <= 0) {
    		$pFlyIn.each(function(){
    			$(this).addClass("restoration");
    		});
    	}else if($thirdItem.offset().top > 0){
    		$pFlyIn.each(function(){
    			$(this).removeClass("restoration");
    		});
    	}
    });
    
    
//			function preventDefault(ev) {
//				ev.preventDefault()
//			}
//			document.getElementById("body").addEventListener('touchstart', preventDefault, false);
			
//			function isScroller(el) {
//				// 判断元素是否为 scroller
//				return el.classList.contains('scroller')
//			}
//			
//			document.body.addEventListener('touchmove', function (ev) {
//				var target = ev.target
//				
//				// 在 scroller 上滑动，阻止事件冒泡，启用浏览器默认行为。
//				if (isScroller(target)) {
//				ev.stopPropagation()
//				}
//			}, false)
})();
