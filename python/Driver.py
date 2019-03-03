import RPi.GPIO as GPIO
import SimpleMFRC522
import requests
import time
import json
import sys

END_POINT = "http://ec2-18-233-40-25.compute-1.amazonaws.com:3000/api/students/rfid"

HEADER = {'content-type': 'application/json'}

#GPIO Pins
red     = 36
yellow  = 35
green   = 40
on = GPIO.HIGH
off = GPIO.LOW

def main():

    reader = SimpleMFRC522.SimpleMFRC522()  #Initialize the RFID reader

    try:
        while True:

            resetLights()       #Turn on yellow light, turn off others.

            print "Ready to read ID:"

            id = reader.read_id()     #Wait utnil RDIF ID number is read

            print("ID read: " + str(id))

            payload = json.dumps({'RFID' : id})  #Create JSON object

            print "Attempting to post now...."

            r = requests.post(END_POINT, data = payload, headers = HEADER)  #Use https post with the data as the req body

            print("Server returned code: " + str(r.status_code) + " " + r.reason)

            handleResponse(r)   #update LEDs based on responce

            time.sleep(2)

    except KeyboardInterrupt:
        print ("\nCtr-C detected. Exiting gracefully...")
    except:
        print("Unexpected error caught. Exiting...")
    finally:
        GPIO.cleanup()
        sys.exit(0)

def handleResponse(res):

    if res.status_code == 200:              #Turn on green light, user alredy exists in DB
        GPIO.output(green, on)
        GPIO.output(yellow, off)
        GPIO.output(red, off)
        print("Welcome, " + res.content)
        pass

    elif res.status_code == 201:            #Turn on green light, user does not exist in DB
        GPIO.output(green, on)
        GPIO.output(yellow, off)
        GPIO.output(red, off)
        pass

    else:                                   #Turn on the red light, error with post request
        GPIO.output(red, on)
        GPIO.output(yellow, off)
        GPIO.output(green, off)
        pass

def resetLights():                          #Turn on yellow light, turn off others.
    GPIO.output(yellow, on)
    GPIO.output(red, off)
    GPIO.output(green, off)

def init():                                 #Setup GPIO pins for LEDs
    GPIO.setmode(GPIO.BOARD)
    GPIO.setwarnings(False)
    GPIO.setup(red, GPIO.OUT)
    GPIO.setup(yellow, GPIO.OUT)
    GPIO.setup(green, GPIO.OUT)

if __name__ == '__main__':
    init()
    main()
