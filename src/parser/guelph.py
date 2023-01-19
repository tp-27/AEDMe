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
    table_row = soup.find_all('td')
    
    #only need building and location
    #building column some have child element with text field, some have text field within td 
    with open('mcmaster.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        i = 0
        for row in table_row:
            if (i > 0) and (i <= 2):
                location_data.append(row.text)
                # print(location_data[i])
                if i == 2:
                    writer.writerow([location_data[0], location_data[1]])
                    i = 0
                    location_data.clear()
                    continue
 
            i += 1




parse_mcmaster()