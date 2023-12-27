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
        traits = [
            {
                "name": row['Item Name'], 
                "colors": row['Colors'],
                "rarity": row['Rarity'],
                "tags": [],
                "token_id": row['token_id']
                # Add other fields as necessary
            }
            for _, row in group.iterrows()
        ]
        # Custom formatting for each trait
        traits_str = ',\n        '.join(json.dumps(trait, separators=(',', ': ')) for trait in traits)
        attribute_data = f'    {{"name": "{attribute_name}", "traits": [\n        {traits_str}\n    ]}}'
        json_data['attributes'].append(attribute_data)

    # Custom formatting for the entire JSON data
    attributes_str = ',\n\n'.join(json_data['attributes'])
    formatted_json = f'{{\n  "attributes": [\n{attributes_str}\n  ]\n}}'

    # Save the formatted JSON to a file
    with open(json_file_path, 'w') as file:
        file.write(formatted_json)

# Example usage
csv_to_json('C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/csv/convertTraits.csv', 'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/json/outputTraits.json')
