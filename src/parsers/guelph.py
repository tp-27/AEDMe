from bs4 import BeautifulSoup
import requests
import csv
import re

#Notes
# double check link isn't broken as well
def parse_guelph():
    html_text = requests.get('https://cso.uoguelph.ca/campus-safety/emergency-automated-external-defibrillator-aed-locations', 'lxml').text
    soup = BeautifulSoup(html_text, 'lxml')
    aeds = soup.find_all('tr')
    

    info = [["Location", "Building #", "College", "Street Address"]]
    getInfo = []
    with open('guelph.csv', 'w', newline='') as f:
        writer = csv.writer(f)
        for spot in aeds:
            rows = spot.find_all('td')

            i = 0
            for row in rows:
                re.sub(r'\n\s*\n', r'\n\n', row.text.strip(), flags=re.M) #removes whitespace between two new lines
                getInfo.append(row.text.strip())
                i = i + 1

            print(getInfo)
            info.append(getInfo)
            getInfo.clear()
            # print(getInfo[0], getInfo[1], getInfo[2], getInfo[3])
            # writer.writerow([info[0], info[1], info[2], info[3]])               
    f.close()
    
    for rows in info:
        print(rows)

def get_Addresses():
    with open('guelph.csv', 'r') as fread:
        reader = csv.reader(fread)
        with open('guelph_add.txt', 'w') as fwrite:
            for row in reader:
                if (row[3] != 'Street Address'):
                    fwrite.write(row[3] + '\n')
            
        fwrite.close()
    fread.close()

parse_guelph()
