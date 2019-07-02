layui.use([], function(){
	var systemApp = new Vue({
			el: '.system-basic-info',
			data: {
				sysUpTime: '',
			},
			delimiters: ['${', '}'],
		});

	var timer = setInterval(getSystemInfo, 1000);

	function getSystemInfo(){
		// 获取系统基础信息
		$.ajax({
			url: '/api/system/get/system-basic-info/',
			type: 'post',
			dataType: 'json',
			data: {csrfmiddlewaretoken: token},
			success: function(result){
				systemApp.sysUpTime = result.sysUpTime;
			},
			error: function(){
				var errorMsg = '连接服务器失败';
				systemApp.sysUpTime = errorMsg;
				clearInterval(timer);
			}
		});
	}

	var cpuUserChart = Highcharts.chart('cpuUser', {
		chart: {
			type: 'pie',
		},
		title: {
			text: '用户CPU百分比',
		},
		tooltip: {
			valueSuffix: '%'
		},
		series: [{
			type: 'pie',
			name: 'cpu',
			data: [
				['空闲', 100],
				['已使用', 0.0],
			]
		}]
	});
})