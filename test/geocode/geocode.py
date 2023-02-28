#geocoding requests using nominatim

import requests
import json
import time

# geocoder class
class Geocode:
    base_url =  'https://nominatim.openstreetmap.org/search'
    valid_results = []
    invalid_results = []

    def fetch(self, address):
        headers = { #might need to change when hosting on server?
            'User-Agent' : 
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
        }

        params =  {
            'q': address,
            'format' : 'geocodejson' #geocodejson
        }

        response = requests.get(url=self.base_url, params=params, headers=headers)
        print("HTTP GET request to URL: %s | status code: %s" % (response.url, response.status_code))

        if response.status_code == 200: #response okay
            return response
        else:
            return None

    def parse(self, response, aedInfo):
        #check if response waas sucessful
        try:
            building = aedInfo['building'] 
            location = aedInfo['location']
            # label = json.dumps(response['features'][0]['properties']['geocoding']['label'], indent=2)
            coordinates = json.dumps(response['features'][0]['geometry']['coordinates'], indent=2).replace('\n', '').replace('[', '').replace(']', '').strip()

            #retrieved valid result
            self.valid_results.append({
                'building' : building,
                'location' : location,
                'coordinates' : coordinates,
            })
        except:
            invalid = json.dumps(response['geocoding']['query'], indent=2) 

            #reteived invalid result
            self.invalid_results.append({
                'building' : invalid,
            })
            pass

    def store_results(self):
        #store valid results
        with open('guelph_latlng.json', 'w') as f:
            f.write(json.dumps(self.valid_results, indent=2))

        #store invalid results
        with open('guelph_invalid.json', 'w') as f:
            f.write(json.dumps(self.invalid_results, indent=2))


    def run(self):  
        #fetch addresses from file
        with open('guelph_info.json', 'r') as f:
            data = json.load(f)
            
            for row in data:
                address = row['building']
                response = self.fetch(address).json()
                self.parse(response, row)
                time.sleep(2) #respect policy nominatim (max 1 request/second)

        f.close()
        self.store_results()

# main driver
if __name__ == '__main__':
    geocoder = Geocode()
    geocoder.run()




