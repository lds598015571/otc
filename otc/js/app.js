var HOST = "http://localhost:8081/api/v1"
// var HOST = "http://www.huhusky.com/otcapis/api/v1"
// var HOST = "http://huhusky.vipgz1.idcfengye.com/8081/api/v1"
// window.addEventListener('touchmove', function defaultf(){}, { passive: false })
/**
 *
 * @Author wuhuhu
 * @Date 2017/3/28 15:57
 * @param
 * @return
 */
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

var jsAjax = new function() {
    var me = this;
    var default_time_format = "YYYY-MM-dd hh:mm:ss";
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
        if(params.type == "POST" || params.type == "post" || params.type == "put"|| params.type == "PUT"){
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
                if(XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.message) {
                    var msg = XMLHttpRequest.responseJSON.message;
                    var codeMsg = msg.split(":");
                    if(codeMsg[0] == "4001"){
                        mui.confirm(codeMsg[1], "error", ["确定"], function(){
                            location.href = "login.html";
                        })
                        /*if(confirm(codeMsg[1])){
                            location.href = "login.html";
                        }else{
                            location.href = "login.html";
                        }*/
                        return;
                    }
                }
                if(error_callback){
                    error_callback(XMLHttpRequest, textStatus, errorThrown);
                    return;
                }
                if(XMLHttpRequest.responseJSON && XMLHttpRequest.responseJSON.message){
                    mui.alert(XMLHttpRequest.responseJSON.message)
                }else{
                    mui.alert("network is error!");
                }
            }
        });
    }
    /**
     * 查询交易订单
     * @param successCallback
     * @param errorCallback
     */
    this.getOrder = function(id, successCallback, errorCallback){
        if(id == null || id == undefined) {
            mui.alert("未找到订单")
            return;
        }
        var param = {
            url: "/trade/order/"+ id
        }
        this.ajax(param, successCallback, errorCallback);
    }

    this.getMember = function(id, successCallback, errorCallback){
        if(id == null || id == undefined) {
            mui.alert("未找到用户")
            return;
        }
        var param = {
            url: "/member/"+ id
        }
        this.ajax(param, successCallback, errorCallback);
    }

    /**
     *
     * @param id
     * @param successCallback
     * @param errorCallback
     */
    this.getPreTrade = function(id, successCallback, errorCallback){
        if(id == null || id == undefined) {
            mui.alert("未找到挂单")
            return;
        }
        var param = {
            url: "/trade/pre/"+ id
        }
        this.ajax(param, successCallback, errorCallback);
    }

    /**
     * 获取币价
     * @param successCallback
     * @param errorCallback
     */
    this.getPrices = function(successCallback, errorCallback) {
        var param = {
            url: "/coin/market/price",
        }
        this.ajax(param, successCallback, errorCallback);
    };

    /**
     * 时间戳格式化
     * @Author wuhuhu
     * @Date 2017/3/28 15:56
     * @param
     * @return
     */
    this.formatLongTime = function(millions, format){
        var datetime = new Date();
        datetime.setTime(millions);
        if(format == null || format == undefined){
            return datetime.format(default_time_format);
        }
        return datetime.format(format);
    };

    this.getQueryString = function(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null){
            return  unescape(r[2]);
        }
        return null;
    }

    this.numAdd = function(num1, num2) {
        var baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    }

    this.numMulti = function(num1, num2) {
        var baseNum = 0;
        try {
            baseNum += num1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            baseNum += num2.toString().split(".")[1].length;
        } catch (e) {
        }
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
    };

    this.numDiv = function(num1, num2) {
        var baseNum1 = 0, baseNum2 = 0;
        var baseNum3, baseNum4;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        with (Math) {
            baseNum3 = Number(num1.toString().replace(".", ""));
            baseNum4 = Number(num2.toString().replace(".", ""));
            var x = (baseNum3 / baseNum4);
            var y = pow(10, baseNum2 - baseNum1);
            return this.numMulti(x, y);
        }
    }
    this.numFormat = function (src, pos){
        return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
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
// 数字精确计算服务
/*
.service('NumberMathService', function () {

    /!**
     * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
     *
     * @param num1加数1 | num2加数2
     *!/
    function numAdd(num1, num2) {
        var baseNum, baseNum1, baseNum2;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        return (num1 * baseNum + num2 * baseNum) / baseNum;
    };

    /!**
     * 法运算，避免数据相减小数点后产生多位数和计算精度损失。
     *
     * @param num1被减数 | num2减数
     *!/
    function numSub(num1, num2) {
        var baseNum, baseNum1, baseNum2;
        var precision;// 精度
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
        precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
        return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
    };

    /!**
     * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
     *
     * @param num1被乘数 | num2乘数
     *!/
    function numMulti(num1, num2) {
        var baseNum = 0;
        try {
            baseNum += num1.toString().split(".")[1].length;
        } catch (e) {
        }
        try {
            baseNum += num2.toString().split(".")[1].length;
        } catch (e) {
        }
        return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
    };

    /!**
     * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
     *
     * @param num1被除数 | num2除数
     *!/
    function numDiv(num1, num2) {
        var baseNum1 = 0, baseNum2 = 0;
        var baseNum3, baseNum4;
        try {
            baseNum1 = num1.toString().split(".")[1].length;
        } catch (e) {
            baseNum1 = 0;
        }
        try {
            baseNum2 = num2.toString().split(".")[1].length;
        } catch (e) {
            baseNum2 = 0;
        }
        with (Math) {
            baseNum3 = Number(num1.toString().replace(".", ""));
            baseNum4 = Number(num2.toString().replace(".", ""));
            var x = (baseNum3 / baseNum4);
            var y = pow(10, baseNum2 - baseNum1);
            return numMulti(x, y);
        }
    };
    return {
        add: numAdd,
        sub: numSub,
        div: numDiv,
        multi: numMulti
    }
})*/
