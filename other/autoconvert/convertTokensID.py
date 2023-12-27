import pandas as pd
import json

# Load the CSV file
csv_file_path = 'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/csv/convertTokensId.csv'
df = pd.read_csv(csv_file_path)
# Extracting the tokenId from the URL
df['tokenId'] = df['tokenId'].apply(lambda x: x.split(':')[-1])

# Grouping the data by name and tokenId, and creating the JSON structure
grouped = df.groupby(['name', 'tokenId'])
json_data = []

for (name, token_id), group in grouped:
    attributes = group[['trait_type', 'value']].to_dict('records')
    json_entry = {
        "tokenId": int(token_id),
        "name": name,
        "attributes": attributes,
        "metaPath": ""  # Placeholder for metaPath
    }
    json_data.append(json_entry)

# Saving the JSON data to a file
json_output_path = 'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/json/outputTokensId.json'

with open(json_output_path, 'w') as file:
    json.dump(json_data, file, indent=4)
