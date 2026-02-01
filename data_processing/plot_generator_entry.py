import sys
import json
import os
from plot_generator import generate_plots

input_data = json.loads(sys.stdin.read())

analytics = input_data["analytics"]
user_id = input_data["user_id"]

output_dir = f"public/plots/user_{user_id}"

generate_plots(analytics, output_dir)
