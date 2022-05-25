#### Generate Metadata for each Image   
# 
import json 

f = open('nft_data/metadata.json') 
data = json.load(f)

# Changes this IMAGES_BASE_URL to yours 
IMAGES_BASE_URL = "https://gateway.pinata.cloud/ipfs/Qmeu3xHSeQHdKy4gjoumA3uqFMzTQ2h6eC8kk6nFT1s7vR/"
PROJECT_NAME = "CHAINGE"

def getAttribute(key, value):
    return {
        "trait_type": key,
        "value": value
    }
for i, item in enumerate(data):
    token = {
        "image": IMAGES_BASE_URL,
        "token_id": i+1,
        "name": item["action"],
        "attributes": []
    }
    token["attributes"].append(getAttribute("action", item["action"]))
    token["attributes"].append(getAttribute("times_done", item["times_done"]))


    with open(str(i+1) + ".json", 'w+') as outfile:
        json.dump(token, outfile, indent=4)
f.close()