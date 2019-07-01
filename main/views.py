from django.shortcuts import render, HttpResponse, redirect
from django.template.response import TemplateResponse
from django.views import View
from django.http import JsonResponse
from snmp_cmds import snmpwalk

class Index(View):
	# 首页
	def get(self, request):
		return render(request, 'index.html')