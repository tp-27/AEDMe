from bs4 import BeautifulSoup
import requests
import csv
import re
import json

#Notes
    # double check link isn't broken or updated website
    # this scrapes location on/off waterloo campus
def parse_waterloo():
    html_text = requests.get('https://uwaterloo.ca/safety-office/emergency-procedures/first-aid/automated-external-defibrillators-aeds/automated-external-defibrillators-aeds-locations#On', 'lxml').text
    soup = BeautifulSoup(html_text, 'lxml')
    aeds = soup.find_all("div", class_="expandable")
    allInfo = []
    getInfo = []

    numAED = len(aeds)
    for spot in aeds:
        if spot.h2:
            building = spot.h2.text.strip()
            # print(spot.h2.text.strip())

        if spot.div:
            location = spot.div.text.strip()
            # print(spot.div.text.strip())

            if len(location.splitlines()) > 1: #more than one AED at one location found
                theLocations = location.splitlines()
                for i in range(len(theLocations)):
                    getInfo.append(building)
                    getInfo.append(theLocations[i])
                    print(getInfo)
                    allInfo.append(getInfo)
                    getInfo = []
            
            else:
                getInfo.append(building)
                getInfo.append(location)
                print(getInfo)
                allInfo.append(getInfo)
                getInfo = []

    print('''Number of AEDS: %d''' %(len(aeds)))
    saveToJSON(allInfo, numAED)

def saveToJSON(allInfo, numAED):
    locations_json = []

    # print(allInfo)
    locations_json.append({
        'total' : numAED,
    })
    #create json
    for info in allInfo:
        if not info: #skip empty array
            pass
        
        else:
            location = info[1]
            building = info[0] + ", Waterloo ON"
            locations_json.append({
                'location' : location,
                'building' : building,
            })

    #store results
    with open('waterloo_info.json', 'w') as f:
        f.write(json.dumps(locations_json, indent = 2))


parse_waterloo()


