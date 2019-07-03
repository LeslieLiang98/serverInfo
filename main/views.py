from django.shortcuts import render, HttpResponse, redirect
from django.template.response import TemplateResponse
from django.views import View
from django.http import JsonResponse
from django.conf import settings
from snmp_cmds import snmpwalk
from time import time, strftime, localtime
import re

HOST = settings.HOST
COMMUNITY = settings.COMMUNITY
PORT = settings.PORT

class GetSystemInfo(View):
	# 获取系统信息
	def post(self, request):
		jsonData = {}
		status = False
		try:
			sysUpTime = snmpwalk(ipaddress = HOST, community = COMMUNITY, port = PORT, oid = settings.SYS_UP_TIME)
			ssCpuUser = snmpwalk(ipaddress = HOST, community = COMMUNITY, port = PORT, oid = settings.SS_CPU_USER)
			ssCpuSystem = snmpwalk(ipaddress = HOST, community = COMMUNITY, port = PORT, oid = settings.SS_CPU_SYSTEM)
			ssCputIdle = snmpwalk(ipaddress = HOST, community = COMMUNITY, port = PORT, oid = settings.SS_CPU_IDLE)
			memTotalReal = snmpwalk(ipaddress = HOST, community = COMMUNITY, port = PORT, oid = settings.MEM_TOTAL_REAL)
			memAvailReal = snmpwalk(ipaddress = HOST, community = COMMUNITY, port = PORT, oid = settings.MEM_AVAIL_REAL)

			currentTime = strftime('%H:%M:%S', localtime(time()))

			jsonData['currentTime'] = currentTime
			jsonData['sysUpTime'] = sysUpTime[0][1]
			jsonData['ssCpuUser'] = int(ssCpuUser[0][1])
			jsonData['ssCpuSystem'] = int(ssCpuSystem[0][1])
			jsonData['ssCpuIdle'] = int(ssCputIdle[0][1])
			jsonData['memTotalReal'] = round(int(re.findall('^[1-9][0-9]+', memTotalReal[0][1])[0]) / 1024)
			jsonData['memAvailReal'] = round(int(re.findall('^[1-9][0-9]+', memAvailReal[0][1])[0]) / 1024)
			jsonData['memTotalFree'] = jsonData['memTotalReal'] - jsonData['memAvailReal']
			status = True
		except Exception as error:
			pass

		jsonData['status'] = status
		return JsonResponse(jsonData)

class Index(View):
	# 首页
	def get(self, request):
		return render(request, 'index.html')