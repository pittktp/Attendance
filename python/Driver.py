import RPI.GPIO as GPIO
import SimpleMFRC522
import requests
import sys

reader = SimpleMFRC522.SimpleMFRC522()

END_POINT = "https://localhost:3000/api/rfid"

#HTTP Codes:
SUCCESS = 200
FAIL = 404

#GPIO Pins
red     = 16
yellow  = 20
green   = 21
on = GPIO.HIGH
off = GPIO.LOW

def main():

    try:
        while True:

            resetLights()

            id = reader.read_id()     #Wait utnil RDIF ID number is read

            data = {'RFID' : id}  #Creat JSON object

            r = requests.post(END_POINT, data)  #Use https post with the data as the req body

            handleResponce(r.status_code)
    except KeyboardInterrupt:
        pass
    finally:
        GPIO.cleanup()

def handleResponce(res):
    if res == SUCCESS:
        GPIO.output(green, on)
        GPIO.output(yellow, off)
        GPIO.output(red, off)

    elif res == FAIL:
        GPIO.output(red, on)
        GPIO.output(yellow, off)
        GPIO.output(green, off)

def init():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(red, GPIO.OUT)
    GPIO.setup(yellow, GPIO.OUT)
    GPIO.setup(green, GPIO.OUT)

def resetLights():
	GPIO.output(yellow, on)
    GPIO.output(red, off)
    GPIO.output(green, off)

if __name__ == '__main__':
    init()
    main()
