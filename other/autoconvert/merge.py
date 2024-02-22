import json

def merge_json(existing_json_path, new_json_path, output_json_path):
    # Load the existing JSON data
    with open(existing_json_path, 'r') as file:
        existing_data = json.load(file)

    # Load the new JSON data
    with open(new_json_path, 'r') as file:
        new_data = json.load(file)

    # Merge the new data into the existing data
    for new_attribute in new_data['attributes']:
        # Find or create the attribute category in the existing data
        for existing_attribute in existing_data['attributes']:
            if existing_attribute['name'] == new_attribute['name']:
                break
        else:
            # If the attribute category does not exist, add it
            existing_data['attributes'].append(new_attribute)
            continue

        # Merge the traits
        existing_traits = {trait['name'] for trait in existing_attribute['traits']}
        for new_trait in new_attribute['traits']:
            if new_trait['name'] not in existing_traits:
                existing_attribute['traits'].append(new_trait)

    # Write the merged data back to the large configuration file
    with open(output_json_path, 'w') as file:
        json.dump(existing_data, file, indent=4)

# Example usage
merge_json(
    'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/json/outputTraits.json',
    'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/backend/src/configs/new-hunnys-closet-shop-traits.json',
    'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/json/merged.json'
)
