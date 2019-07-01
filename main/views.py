from django.shortcuts import render, HttpResponse, redirect
from django.template.response import TemplateResponse
from django.views import View
from django.http import JsonResponse
from snmp_cmds import snmpwalk

class Index(View):
	# 首页
	def get(self, request):
		serverDesc = snmpwalk(ipaddress = '10.1.1.105', community = 'zwliang98', oid = '.1.3.6.1.2.1.1.1.0')
		return render(request, 'index.html', {
			'serverDesc': serverDesc[0][1],
			})