/*
 * 自动广告-基于jquery 20160720
 * 广告展示次序在后台控制
 * 顶部拉幕广告有多个时，依次拉幕展示
 * 顶部固定广告、对联广告有多个时从上到下同时展示
*/

var wxyAD_first_child = null, //body第一个子元素，用来在其前面依次添加顶部固定广告，且保证在拉幕广告下方
	wxyAD_lamu_status = 0; //当前是否有拉幕广告正在展示
$(function(){
	//获取广告并进行展示
	$.post('/index.php/myapi/ad', {is_index:jsGet('wxyad.js', 'is_index')}, function(json){
		//返回结果包含如下字段：title,img,imgwidth,imgheight,top,url,adtype,fontcolor,bgcolor
		//返回结果如：{obj:[{adtype:?, img:?, url:?, bgcolor:?}...]};
		if(typeof(json.obj)!=='undefined')wxyAD_show(json.obj);
	}, 'json');
});


/*
 * 模拟php $_GET获取js后的参数 <script src="http://www.abc.com/jquery.js?ver=1.11.0&wd=abc"></script>
 * jsName为js文件名称，如 jquery.js
 * para为参数名
 */
function jsGet(jsName, para){
	if(!jsName)return '';
	jsName='/'+jsName+'?';
	var script = $('script'), arr='';
	for(var i=0; i<script.size(); i++){if(script.eq(i).prop('src').indexOf(jsName)>-1){arr = script.eq(i).prop('src').split(jsName)[1]; break;}}
	if(!arr || typeof(para)=='undefined' || !para)return '';
	arr = arr.split('&');
	para += '=';
	for(i=0; i<arr.length; i++){if(arr[i].indexOf(para)===0) return decodeURIComponent(arr[i].replace(para, ''));}
	return '';
}

function wxyAD_show(wxyAD){
	if(typeof(wxyAD) === 'undefined')return;
	wxyAD_first_child = $('body').children().eq(0);
	for(var i in wxyAD){
			var ad=wxyAD[i];
			switch(parseInt(ad.adtype)){
				case 1: //顶部拉幕广告
					wxyAD_lamu(ad);
					break;
				case 2: //顶部固定广告
					wxyAD_fixed(ad)
					break;
				case 3: //对联两侧
				case 4: //对联仅左侧
				case 5: //对联仅右侧
					wxyAD_duilian(ad);
					break;
			}
	}
}

//固定广告、拉幕html代码
function wxyAD_div(ad){
	return $('<div'
			+ ' style="display:none;position:relative;width:100%;height:'+ad.imgheight+'px;background:'+ (ad.bgcolor ? ad.bgcolor : '') +' url('+ad.img+') center top no-repeat;overflow:hidden;">'
			+ (ad.url ? '<a target="_blank" href="'+ad.url+'" style="display:block;width:100%;height:'+ad.imgheight+'px;"></a>' : '')
			+ '<em style="display:block;position:absolute;top:10px;right:15px;font:14px/1 Microsoft Yahei;cursor:pointer;">[关闭]</em>'
			+ '</div>');
}

//拉幕广告
function wxyAD_lamu(ad, flag){
	if(wxyAD_lamu_status==1){
		if(typeof(flag)=='undefined')$('<img src="'+ad.img+'">');
		setTimeout(function(){wxyAD_lamu(ad, 1)}, 500);
		return;
	}
	wxyAD_lamu_status=1;
	$('<img src="'+ad.img+'">').load(function(){
		var obj=$(this).get(0);
		var div=wxyAD_div(ad);
		div.prependTo('body').slideDown(500, function(){setTimeout(function(){div.slideUp(500, function(){$(this).remove();wxyAD_lamu_status=0;})}, 1e4)});
		div.find('em').click(function(){div.slideUp(500, function(){$(this).remove();wxyAD_lamu_status=0;})});
	});
}

//顶部固定广告
function wxyAD_fixed(ad){
	var div = wxyAD_div(ad);
	div.insertBefore(wxyAD_first_child).slideDown(300);
	div.find('em').click(function(){div.slideUp(500, function(){$(this).remove();})});
}

//对联广告
function wxyAD_duilian(ad){
	if(ad.adtype==3){//两侧对联广告左右分别添加
		ad.adtype=4; wxyAD_duilian(ad);
		ad.adtype=5; wxyAD_duilian(ad);
		return;
	}
	var adtype = ad.adtype==4 ? 'left' : 'right',
		div = $('.js-wxy-ad-'+adtype),
		top = ad.top>0 ? ad.top : (div.size() ? div.last().position().top+div.last().height()+10 : 70); //第一条对联广告默认距顶部距离为70像素
	div = $('<div class="js-wxy-ad-'+adtype+'"'
		+ ' style="position:absolute;z-index:999;top:'+ top +'px;'+ adtype +':10px;width:'+ ad.imgwidth +'px;height:'+ ad.imgheight +'px;">'
		+ (ad.url ? '<a target="_blank" href="'+ ad.url +'"><img src="'+ ad.img +'"></a>' : '<img src="'+ ad.img +'">')
		+ '<em style="display:block;position:absolute;top:5px;right:3px;border:1px solid #333;width:14px;height:14px;text-align:center;font:14px/1 Verdana;color:#333;cursor:pointer;overflow:hidden;">X</em>'
		+ '</div>');
	div.appendTo($('body'));
	div.find('em').click(function(){div.remove()});
}