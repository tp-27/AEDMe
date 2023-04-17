from bs4 import BeautifulSoup
import requests
import csv
import re
import json

#Notes
# double check link isn't broken as well
class ParseMcmaster:
    allInfo = []
    getInfo = []

    def parse(self):
        html_text = requests.get('https://libguides.mcmaster.ca/MacAED/CampusLocations', 'lxml').text
        soup = BeautifulSoup(html_text, 'lxml')
        aeds = soup.find_all('tr')

        header_row = 1
        location = ""
        building = ""
   
        for spot in aeds:
            row = spot.find_all('td')
     
            if header_row: #discard header row
                    header_row = 0
                    pass

            else:
                i = 0
                for column in row:
                    if (i == 1 or i == 2):
                        if (i == 1):
                            building = column.text.strip()
                        
                        elif (i == 2):
                            location = column.text.strip()

                    i += 1

                self.getInfo.append(location)
                self.getInfo.append(building)
                self.allInfo.append(self.getInfo) 
                self.getInfo = []

        # print(self.allInfo)       

    def saveToJSON(self):
        locations_json = []

        #create json
        for info in self.allInfo:
            if not info: #skip empty array
                pass
            
            else:
                location = info[0]
                building = info[1] + ", Hamilton ON"
                locations_json.append({
                    'location' : location,
                    'building' : building,
                })

        #store results
        with open('mcmaster_info.json', 'w') as f:
            f.write(json.dumps(locations_json, indent = 2))


locations = ParseMcmaster()
locations.parse()
locations.saveToJSON()