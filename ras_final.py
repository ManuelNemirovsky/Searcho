from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import os
import requests
import socket
import netifaces as ni
import urlparse

PORT_NUMBER = 4040

data = ni.ifaddresses('wlan0')[ni.AF_INET][0]['addr']
def send_my_ip():
    PARAMS = {'ip':data}
    print data
    requests.request(method='post', url='http://192.168.43.39:3000/ip', data="find my that", params=PARAMS)

class webServerHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            if self.path.endswith("/image"): # a sign to resolve the camera # #resolve the camera
                print "entered to the rout"
                f = open('./example.jpg')
                size = os.stat('./example.jpg')
                self.send_response(200)
                self.send_header('Content-type' , 'image/jpg')
                self.send_header('Content-length' , size.st_size)
                self.end_headers()
                with open('./example.jpg', 'rb') as file:
                    self.wfile.write(file.read())
                print "sended"
                return
        except:
            self.send_error(404, "File was not found %s" %self.path)
    
    def do_POST(self):
        print "entered to the post"
        try:
            if self.path.endswith("/answer"): # a sign to resolve the camera # #resolve the camera
                ans = self.rfile.read(int(self.headers['Content-Leangth']))
                print ans
                self.send_response(200)
                print "sended posttttt"
                return
        except:
            self.send_error(404, "File was not found %s" %self.path)

if __name__ == '__main__':
    server = HTTPServer((str(data), PORT_NUMBER) , webServerHandler)
    print "web server running on port %s" % PORT_NUMBER
    send_my_ip()
    print "wow"
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print "^C entered, stopping web server..."
        server.socket.close()
