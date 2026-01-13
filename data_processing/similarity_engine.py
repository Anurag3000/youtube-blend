import math
import sys
import json

# ML Concept 1: Feature space

def build_feature_space(user1_channels, user2_channels):
    features=set()
    for ch in user1_channels:
        features.add(ch["name"])
    
    for ch in user2_channels:
        features.add(ch["name"])
    
    return sorted(features)

# ML Concept 2: Vectorization

def user_to_vector(user_channels, feature_space):
    channel_map={ch["name"]: ch["count"] for ch in user_channels}

    vector=[]
    for feature in feature_space:
        vector.append(channel_map.get(feature, 0.0))
    
    return vector

# ML Concept 3: Cosine similarity

def cosine_similarity(vec1, vec2):
    dot_product=sum(a*b for a,b in zip(vec1, vec2))
    magnitude1= math.sqrt(sum(a*a for a in vec1))
    magnitude2= math.sqrt(sum(b*b for b in vec2))

    if magnitude1==0 or magnitude2==0:
        return 0.0
    
    return dot_product/(magnitude1*magnitude2)

# ML Concept 4: Common channels

def find_common_channels(user1_channels, user2_channels):
    set1 = {ch["name"] for ch in user1_channels}
    set2 = {ch["name"] for ch in user2_channels}

    return list(set1.intersection(set2))

def compute_user_similarity(user1_channels, user2_channels):
    feature_space=build_feature_space(user1_channels, user2_channels)

    vec1= user_to_vector(user1_channels, feature_space)
    vec2= user_to_vector(user2_channels, feature_space)

    similarity_score= cosine_similarity(vec1, vec2)
    common_channels= find_common_channels(user1_channels, user2_channels)

    return{
        "similarity": round(similarity_score*100,2),
        "common_channels": common_channels
    }

user1 = [
        {"name": "veritasium", "count": 2.8},
        {"name": "3blue1brown", "count": 1.6}
    ]

user2 = [
    {"name": "veritasium", "count": 0.4},
    {"name": "kurzgesagt", "count": 2.1}
]

input_data=json.loads(sys.stdin.read())

user1_channels=input_data["user1_channels"]
user2_channels=input_data["user2_channels"]

result=compute_user_similarity(user1_channels,user2_channels)

print(json.dumps(result))
