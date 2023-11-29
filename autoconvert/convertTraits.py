import pandas as pd
import json

def csv_to_json(csv_file_path, json_file_path):
    # Load the CSV file
    csv_data = pd.read_csv(csv_file_path)

    # Group the CSV data by 'Attribute Name'
    grouped_data = csv_data.groupby('Attribute Name')

    # Initialize a list to hold the formatted JSON data
    json_data = {"attributes": []}

    # Iterate through each group and format data accordingly
    for attribute_name, group in grouped_data:
        attribute_data = {
            "name": attribute_name,
            "traits": [
                {
                    "name": row['Item Name'], 
                    "colors": row['Colors'],
                    "rarity": row['Rarity'],
                    "tags": []
                }
                for _, row in group.iterrows()
            ]
        }
        json_data['attributes'].append(attribute_data)

    # Save the formatted JSON to a file
    with open(json_file_path, 'w') as file:
        json.dump(json_data, file, indent=4)

# Example usage
csv_to_json('C:/Users/chris/Hunnys-Development/1115/staging-closet/autoconvert/csv/convertTraits.csv', 'C:/Users/chris/Hunnys-Development/1115/staging-closet/autoconvert/json/outputTraits.json')
