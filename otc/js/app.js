// var HOST = "http://localhost:8081/api/v1"
var HOST = "http://huhusky.vipgz1.idcfengye.com/8081/api/v1"
// window.addEventListener('touchmove', function defaultf(){}, { passive: false })
var jsAjax = new function() {
	var me = this;
	this.ajax = function(params, success_callback, error_callback) { //网络请求
		if(!params) {
			mui.toast("jsAjax params is null");
			return;
		}
		if(!params.url) {
			mui.toast("jsAjax params.url is null");
			return;
		}
		params.data = params.data || {}; //默认data为{} 
		params.dataType = params.dataType || "json"; //默认json格式
		params.timeout = params.timeout || "10000"; //默认请求超时10秒
		params.type = params.type || "GET"; //默认GET请求
		params.async = params.async || "true"; //默认true，异步请求
        params.contentType = params.contentType || "application/json",
		params.xhrFields = params.xhrFields || {
			withCredentials: true
		}; //请求头sessionid
		params.crossDomain = params.crossDomain || "true"; //默认true，异步请求
		//params.data.timestamp =Date.parse(new Date()).toString().slice(0,10);
		if(params.type == "POST" || params.type == "post"){
            params.data = JSON.stringify(params.data);
		}

		$.ajax({
			type: params.type,
			url: HOST + params.url,
			dataType: params.dataType,
			data: params.data,
			xhrFields: params.xhrFields,
			contentType: params.contentType,
			crossDomain: params.crossDomain,
			success: function(data) { //成功返回结果
				if(data) {
					var ret = data;
					if(ret && (200 == parseInt(ret.code))) {
						var obj = data.data;
						if(obj) {
							if(success_callback) success_callback(obj);
						} else {
							console.log("data.data is null");
						}
					} else if(ret && (401 == parseInt(ret)) && data.msg == "relogin") {
						if(error_callback) error_callback("relogin");
					} else {
						//mui.toast(data.msg);
						console.log("---" + params.url + "---" + JSON.stringify(params.data) + "--->" + JSON.stringify(data));
					}
				} else {
					console.log("---与服务器通讯错误---");
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				//异常处理
				if(error_callback) error_callback(XMLHttpRequest, textStatus, errorThrown);

			}
		});

	}
}

function ajax() {
	var ajaxData = {
		type: params.type || "GET",
		url: params.url || "",
		async: params.async || "true",
		data: params.data || null,
		dataType: params.dataType || "text",
		contentType: params.contentType || "application/x-www-form-urlencoded",
		beforeSend: params.beforeSend || function() {},
		success: params.success || function() {},
		error: params.error || function() {}
	}
	ajaxData.beforeSend()
	var xhr = createxmlHttpRequest();
	xhr.responseType = ajaxData.dataType;
	xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
	xhr.setRequestHeader("Content-Type", ajaxData.contentType);
	xhr.send(convertData(ajaxData.data));
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				ajaxData.success(xhr.response)
			} else {
				ajaxData.error()
			}
		}
	}
}

function createxmlHttpRequest() {
	if(window.ActiveXObject) {
		return new ActiveXObject("Microsoft.XMLHTTP");
	} else if(window.XMLHttpRequest) {
		return new XMLHttpRequest();
	}
}

function convertData(data) {
	if(typeof data === 'object') {
		var convertResult = "";
		for(var c in data) {
			convertResult += c + "=" + data[c] + "&";
		}
		convertResult = convertResult.substring(0, convertResult.length - 1)
		return convertResult;
	} else {
		return data;
	}
}