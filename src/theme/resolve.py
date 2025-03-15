import json
import re
import os

script_dir = os.path.dirname(__file__)

primitive_path = os.path.join(script_dir, "src", "colors.primitive.json")
with open(primitive_path, "r") as f:
    primitives_data = json.load(f)

token_path = os.path.join(script_dir, "src", "colors.token.json")
with open(token_path, "r") as f:
    tokens_data = json.load(f)

def get_primitive_value(path, data):
    keys = path.split(".")
    current = data
    for key in keys:
        if key in current:
            current = current[key]
        else:
            raise KeyError(f"Path '{path}' not found in primitives data")
    return current.get("value")

def resolve_tokens(data, primitives_data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, dict):
                resolve_tokens(value, primitives_data)
            elif isinstance(value, str):
                match = re.match(r"\{(.+?)\}", value)
                if match:
                    path = match.group(1).replace("Colors.", "Primitives.modes.Value.Colors.")
                    try:
                        resolved_value = get_primitive_value(path, primitives_data)
                        data[key] = resolved_value
                    except KeyError as e:
                        print(e)
    elif isinstance(data, list):
        for item in data:
            resolve_tokens(item, primitives_data)

resolve_tokens(tokens_data, primitives_data)

resolve_path = os.path.join(script_dir, "out", "palette.token.json")
with open(resolve_path, "w") as f:
    json.dump(tokens_data, f, indent=4)

print("Resolved tokens saved to './out/palette.token.json'")
