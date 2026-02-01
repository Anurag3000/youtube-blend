import sys
import json
from generate_analytics import generate_user_analytics

input_data = json.loads(sys.stdin.read())

processed_data = {
    "channels": input_data["channels"],
    "categories": input_data["categories"]
}

raw_events = input_data.get("raw_events", [])

analytics = generate_user_analytics(processed_data, raw_events)

print(json.dumps(analytics))
