from bs4 import BeautifulSoup
import requests
import csv


def parse_guelph():
    html_text = requests.get('https://cso.uoguelph.ca/campus-safety/emergency-automated-external-defibrillator-aed-locations', 'lxml').text
    soup = BeautifulSoup(html_text, 'lxml')
    aeds = soup.find_all('tr')
    
    with open(f'guelph.txt', 'w') as f:
        for spot in aeds:
            rows = spot.find_all('td')
            for row in rows:
                print(row.text)
                f.write(f"{row.text}")

            # print(location)
            # building_num = spot.find('p')
            # print(building_num)
            # print('\n')


def parse_waterloo():
    html_text = requests.get('https://uwaterloo.ca/safety-office/emergency-procedures/first-aid/automated-external-defibrillators-aeds/automated-external-defibrillators-aeds-locations', 'lxml').text
    soup = BeautifulSoup(html_text, 'lxml')
    buildings = soup.find_all('div', class_='expandable expanded')

    for building in buildings:
        print(building.div)
        print('hello')



def parse_mcmaster():
    html_text = requests.get('https://libguides.mcmaster.ca/MacAED/CampusLocations').text
    soup = BeautifulSoup(html_text, 'lxml')
    table = soup.find_all('tr')

    location_data = ['']
    row_csv = ['']
    table_row = soup.find_all('td')
    
    #only need building and location
    #building column some have child element with text field, some have text field within td 
    with open('mcmaster.csv', 'w', newline='') as file:
        writer = csv.writer(file)

        for row in table_row:
            location_data.append(row.text)

        i = 0
        writer.writerow("Location")
        for location in location_data:
            if (location == ""):
                continue
            else:
                if (i == 4):
                    writer.writerow([row_csv[0], row_csv[1], row_csv[2], row_csv[3]])
                    row_csv.clear()
                    i = 0
                    continue
                row_csv.append(location)
                print(location)
            
            i += 1
parse_mcmaster()