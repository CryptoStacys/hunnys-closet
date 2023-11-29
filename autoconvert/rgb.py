from PIL import Image
import os
import json

def get_average_rgb(image_path):
    with Image.open(image_path) as img:
        # Assuming the image is solid color, get the RGB of the first pixel
        return img.getpixel((0, 0))

def generate_rgb_json(folder_path, output_json_path):
    rgb_values = {}

    for filename in os.listdir(folder_path):
        if filename.endswith('.png'):
            image_path = os.path.join(folder_path, filename)
            r, g, b = get_average_rgb(image_path)
            rgb_values[filename.split('.')[0]] = {"r": r, "g": g, "b": b}

    # Write the data to a JSON file
    with open(output_json_path, 'w') as file:
        json.dump(rgb_values, file, indent=2)

# Example usage
generate_rgb_json('C:/Users/chris/Hunnys-Development/1115/staging-closet/autoconvert/colors', 'C:/Users/chris/Hunnys-Development/1115/staging-closet/autoconvert/colors.json')
