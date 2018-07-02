from BaseHTTPServer import BaseHTTPRequestHandler,HTTPServer
import os
import requests
import socket
import netifaces as ni
import urlparse
import time 
import RPi.GPIO as GPIO
import picamera

PORT_NUMBER = 4040

panPWN = 11
tiltPWN = 13
camera = picamera.PiCamera()

GPIO.setmode(GPIO.BOARD)

GPIO.setup(panPWN,GPIO.OUT)
pwm = GPIO.PWM(panPWN , 50)

GPIO.setup(tiltPWN,GPIO.OUT)
tilt = GPIO.PWM(tiltPWN , 50)

pwm.start(5)
tilt.start(5)

data = ni.ifaddresses('wlan0')[ni.AF_INET][0]['addr']
def send_my_ip():
    PARAMS = {'ip':data}
    print data
    requests.request(method='post', url='http://10.0.0.9:3000/ip', data="find my that", params=PARAMS)

class webServerHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            if self.path.endswith("/image"): # a sign to resolve the camera # #resolve the camera
                print "entered to the rout"
                self.send_response(200)
                self.wfile.write("POST request for {}".format(self.path).encode('utf-8'))
                
                count=0
                found=False
                url = 'http://10.0.0.9:3000/detect'
                while(not found and count<3):
                    if count == 0:
                        pwm.ChangeDutyCycle(7.5)
                    elif count == 1:
                        pwm.ChangeDutyCycle(2.5)
                    elif count == 2:
                        pwm.ChangeDutyCycle(12.5)
                    
                    time.sleep(5)
                    camera.capture("example.jpg")
                        
                    #capture image in camera
                    files = {'media': open('./example.jpg', 'rb')}
                    print "CHECKING"
                    response = requests.request("POST", url, files=files)
                    print "worked"
                    print(response.text)
                    if(response.text=="true"):
                        found=True
                    elif(not response.text=="False"):
                        print "mistake"
                    count = count + 1;

                print "sended"    
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
        pwm.stop()
        GPIO.cleanup()
        server.socket.close()
