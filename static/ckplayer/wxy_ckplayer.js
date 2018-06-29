//{width:800, height:550, url:'视频地址'[, img:'视频封面', containerid:'视频容器id，默认为div-ckplayer', videoid:'视频id，默认为ckplayer_1', auto:2]}

function wxy_ckplayer(obj){
	if(typeof(obj) != 'object'){
		alert('my_ckplayer参数设置错误');
		return;
	}
	if(typeof(obj.containerid) == 'undefined')obj.containerid='ckplayer-container';
	if(typeof(obj.videoid) == 'undefined')obj.videoid='ckplayer_1';
	if(typeof(obj.img) == 'undefined')obj.img='';
	if(typeof(obj.auto) == 'undefined')obj.auto=2;
	
	//如果是flash则直接播放，不加载ckplayer
	if(/\.swf(\?.+)*$/i.test(obj.url)){
	//if(obj.url.substr(-4).toLowerCase() == '.swf'){
		$('#'+obj.containerid).html('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+ obj.width +'" height="'+ obj.height +'"><param name="movie" value="'+ obj.url +'"><param name="quality" value="high"><param name="wmode" value="transparent"><param name="menu" value="false"><embed src="'+ obj.url +'" wmode="transparent" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" allowfullscreen="true" width="'+ obj.width +'" height="'+ obj.height +'"></embed></object>');
		return;
	}
	
	var flashvars={
		f:obj.url,
		my_url:encodeURIComponent(window.location.href),
		p:obj.auto, //播放设置：0默认暂停；1默认自动播放；2默认不加载视频，点击后加载播放
		c:0, //配置文件：0调用ckplayer中的ckstyle方法；1调用ckplayer.xml
		i:obj.img, //封面图片
	};
	var params={bgcolor:'#FFF',allowFullScreen:true,allowScriptAccess:'always',wmode:'transparent'};
	var video=[obj.url];
	//CKobject.embedSWF(播放器路径,容器id,播放器id/name,播放器宽,播放器高,优先HTML5视频,flashvars的值,视频路径,设置);
	CKobject.embed('/static/ckplayer/ckplayer.swf', obj.containerid, obj.videoid, obj.width, obj.height, true,flashvars,video,params);
}