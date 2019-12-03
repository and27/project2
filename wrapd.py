from flask import  redirect, render_template, request, session 
from functools import wraps 

def loginRequired(f):
	@wraps(f)
	def decoratedFunction(*args, **kwargs):
                if session.get("username") is None:
                       return redirect("signin")
                return f(*args, **kwargs)
	return decoratedFunction
