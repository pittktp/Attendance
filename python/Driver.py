import RPi.GPIO as GPIO
import SimpleMFRC522
import requests
import time
import json
import sys

END_POINT = "http://ec2-18-233-40-25.compute-1.amazonaws.com:3000/api/rfid"

HEADERS = {'content-type': 'application/json'}

#HTTP Codes:
SUCCESS = 200

#GPIO Pins
red     = 36
yellow  = 35
green   = 40
on = GPIO.HIGH
off = GPIO.LOW

def main():

    reader = SimpleMFRC522.SimpleMFRC522()


    try:
        while True:

            resetLights()       #Turn on yellow light, turn off others.

            print "Ready to read ID:"

            id = reader.read_id()     #Wait utnil RDIF ID number is read

            print("ID read: " + str(id))

            payload = json.dumps({'RFID' : id})  #Creat JSON object

            print "Attempting to post now...."

            r = requests.post(END_POINT, data = payload, headers = HEADERS)  #Use https post with the data as the req body

            print("Server returned code: " + str(r.status_code) + " " + r.reason)
            # print(r.reason)

            handleResponse(r.status_code)   #update LEDs based on responce

            time.sleep(2)


    except KeyboardInterrupt:
        print (" Ctr-C detected. Exiting gracefully...")
        pass
    finally:
        GPIO.cleanup()
        sys.exit(0)

def handleResponse(res):

    if res == SUCCESS:              #Turn on green light
        GPIO.output(green, on)
        GPIO.output(yellow, off)
        GPIO.output(red, off)
        pass

    else:                           #Turn on the red light
        GPIO.output(red, on)
        GPIO.output(yellow, off)
        GPIO.output(green, off)
        pass

def resetLights():
    GPIO.output(yellow, on)
    GPIO.output(red, off)
    GPIO.output(green, off)

def init():
    GPIO.setmode(GPIO.BOARD)
    GPIO.setwarnings(False)
    GPIO.setup(red, GPIO.OUT)
    GPIO.setup(yellow, GPIO.OUT)
    GPIO.setup(green, GPIO.OUT)

if __name__ == '__main__':
    init()
    main()
