layui.use([], function(){
	var systemApp = new Vue({
			el: '.system-basic-info',
			data: {
				sysUpTime: '',
			},
			delimiters: ['${', '}'],
		});

	var timer = setInterval(getSystemInfo, 3000);

	var chartXData = [];
	var charSeries0Data = [];
	var charSeries1Data = [];
	var charSeries2Data = [];
	var cpuUserChart = Highcharts.chart('cpuUseInfo', {
		chart: {
			width: 700,
		},
		title: {text: 'CPU使用百分比'},
		credits: {enabled: false},
		yAxis: {title: {text: 'CPU使用百分比'}, ceiling: 100, max: 100,},
		xAxis: {
			categories: chartXData,
		},
		tooltip: {valueSuffix: '%'},
		series: [{
			name: '用户CPU使用百分比',
			data: charSeries0Data,
		},{
			name: '系统CPU使用百分比',
			data: charSeries1Data,
		},{
			name: '空闲CPU百分比',
			data: charSeries2Data,
		}]
	});
	var memoryInfoChart = Highcharts.chart('memoryInfo', {
		chart: {type: 'pie'},
		title: {text: '内存使用百分比'},
		credits: {enabled: false},
		tooltip: {valueSuffix: '%'},	
		plotOptions: {
			pie: {
				dataLabels: {
					format: '<b>{point.name}</b>: {point.percentage:.1f} %',
				},
			},
		},
		series: [{
			cursor: 'pointer',
			name: '内存占比',
			data: [{
				name: '空闲内存',
			},{
				name: '已使用内存',
			}]
		}]
	});

	getSystemInfo();
	function getSystemInfo(){
		// 获取系统基础信息
		$.ajax({
			url: '/api/system/get/system-basic-info/',
			type: 'post',
			dataType: 'json',
			data: {csrfmiddlewaretoken: token},
			success: function(result){
				var sysUpTime = result.sysUpTime.split(':');
				var sysUpTime_day = sysUpTime[0];
				var sysUpTime_hour = sysUpTime[1];
				var sysUpTime_minute = sysUpTime[2];
				var sysUpTime_second = sysUpTime[3];
				systemApp.sysUpTime = sysUpTime_day + '天' + sysUpTime_hour + '小时' + sysUpTime_minute + '分钟' + sysUpTime_second + '秒';

				chartXData.push(result.currentTime);
				charSeries0Data.push(result.ssCpuUser);
				charSeries1Data.push(result.ssCpuSystem);
				charSeries2Data.push(result.ssCpuIdle);

				shift = chartXData.length > 10;
				if(shift){
					chartXData.shift();
					charSeries0Data.shift();
					charSeries1Data.shift();
					charSeries2Data.shift();
				}
				cpuUserChart.xAxis[0].update({
					categories: chartXData,
				});
				cpuUserChart.series[0].update({
					data: charSeries0Data,
				})
				cpuUserChart.series[1].update({
					data: charSeries1Data,
				})
				cpuUserChart.series[2].update({
					data: charSeries2Data,
				})

				percPoint = result.memTotalReal / 100;
				memTotalFreePerc = parseFloat((result.memTotalFree / percPoint).toFixed(2));
				memAvailRealPerc = parseFloat((result.memAvailReal / percPoint).toFixed(2));
				memoryInfoChart.series[0].setData([memTotalFreePerc, memAvailRealPerc]);
			},
			error: function(){
				var errorMsg = '连接服务器失败';
				systemApp.sysUpTime = errorMsg;
				clearInterval(timer);
			}
		});
	}

	

})