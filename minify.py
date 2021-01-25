import requests
import bottle

from css_html_js_minify import js_minify, css_minify
from bottle import route, run, request, response, static_file

@route('/minify/js', method=['POST', 'OPTIONS'])
def minify_js():
    content = ''
    urls = request.forms.get('urls').split(',')

    for url in urls:
        r = requests.get(url)
        content += r.text

    return js_minify(content)

@route('/minify/css', method=['POST', 'OPTIONS'])
def minify_css():
    content = ''
    urls = request.forms.get('urls').split(',')

    for url in urls:
        r = requests.get(url)
        content += r.text

    return css_minify(content)

run(host='0.0.0.0', port=8080)