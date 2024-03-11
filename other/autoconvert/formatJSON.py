import json

def reformat_json(input_file, output_file):
    with open(input_file, 'r') as file:
        data = json.load(file)

    with open(output_file, 'w') as file:
        file.write('{\n  "attributes": [\n')
        for i, attribute in enumerate(data['attributes']):
            file.write('    {\n')
            file.write(f'      "name": "{attribute["name"]}",\n')
            file.write('      "traits": [\n')
            for j, trait in enumerate(attribute['traits']):
                # Construct the trait string manually
                trait_str = json.dumps(trait, separators=(',', ':'))
                # Add a comma after the trait if it's not the last one
                if j < len(attribute['traits']) - 1:
                    trait_str += ','
                file.write(f'        {trait_str}\n')
            # Close the traits list
            file.write('      ]\n')
            # Close the attribute dictionary
            if i < len(data['attributes']) - 1:
                file.write('    },\n')
            else:
                file.write('    }\n')
        # Close the attributes list and the JSON object
        file.write('  ]\n}\n')

# Usage
input_file = 'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/json/merged.json'  # Replace with your input file name
output_file = 'C:/Users/chris/Hunnys-Development/staging-hunnys-closet-2/other/autoconvert/json/formattedJSON.json'  # Replace with your desired output file name

reformat_json(input_file, output_file)
