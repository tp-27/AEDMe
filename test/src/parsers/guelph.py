from bs4 import BeautifulSoup
import requests
import csv
import re
import json

#Notes
# double check link isn't broken as well
def parse_guelph():
    html_text = requests.get('https://cso.uoguelph.ca/campus-safety/emergency-automated-external-defibrillator-aed-locations', 'lxml').text
    soup = BeautifulSoup(html_text, 'lxml')
    aeds = soup.find_all('tr')
    allInfo = []

        
    with open('guelph.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        # getInfo = ["Location", "Building #", "College", "Street Address"]
        # allInfo.append(getInfo)
        # writer.writerow(getInfo)
        getInfo = []
        for spot in aeds:
            rows = spot.find_all('td')

            i = 0
            for row in rows:
                re.sub(r'\n\s*\n', r'\n\n', row.text.strip(), flags=re.M) #removes whitespace between two new lines
                getInfo.append(row.text.strip())
                i = i + 1
            
            allInfo.append(getInfo)
            getInfo = []

        saveToJSON(allInfo)            
    f.close()

def saveToJSON(allInfo):
    locations_json = []

    #create json
    for info in allInfo:
        if not info: #skip empty array
            pass
        
        else:
            location = info[0]
            building = info[3] + ", Guelph ON"
            locations_json.append({
                'location' : location,
                'building' : building,
            })

    #store results
    with open('guelph_info.json', 'w') as f:
        f.write(json.dumps(locations_json, indent = 2))


parse_guelph()

