from django.shortcuts import render, HttpResponse, redirect
from django.template.response import TemplateResponse
from django.views import View
from django.http import JsonResponse
from django.conf import settings
from snmp_cmds import snmpwalk

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
			jsonData['sysUpTime'] = sysUpTime[0][1]
			status = True
		except Exception as error:
			pass

		jsonData['status'] = status
		return JsonResponse(jsonData)

class Index(View):
	# 首页
	def get(self, request):
		return render(request, 'index.html')