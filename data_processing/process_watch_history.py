import pandas as pd
from datetime import datetime, timedelta
from datetime import timezone

import math
import json
import sys

def load_watch_history(csv_path):
    return pd.read_csv(csv_path)

def validate_columns(df):
    required = {
        "videoTitle",
        "channelName",
        "videoUrl",
        "watchedAt"
    }
    missing = required - set(df.columns)
    if missing:
        raise ValueError(f"Missing required columns: {missing}")

def clean_string_columns(df):
    df["channel"]=(df["channel"].astype(str).str.strip().str.lower())
    df["category"]=(df["category"].astype(str).str.strip().str.lower())
    
    df=df[(df["channel"]!="") & (df["category"])!=""]
    # removes empty entries in the columns, these rows are useless for similarity
    
    return df

def filter_recent_history(df, months=3):
    df["watched_at"]=pd.to_datetime(df["watched_at"], errors="coerce")
    # Converts values into pandas datetime objects
    
    # cutoff_date=datetime.now()- timedelta(days=30*months)
    # df=df[df["watched_at"]>=cutoff_date]
    return df

def compute_frequencies(df):
    channel_freq={}
    category_freq={}

    for _, row in df.iterrows():
        channel = row["channel"]
        category=row["category"]
        watched_at=row["watched_at"]

        if pd.isna(watched_at):
            continue
        decay_weight = compute_decay_weight(watched_at)

        #If the channel was seen before → add to its existing score
        #If the channel is new → start from 0 and add
        channel_freq[channel]=channel_freq.get(channel, 0)+decay_weight

        category_freq[category] = category_freq.get(category, 0) + decay_weight
    
    return channel_freq, category_freq

def process_watch_history(csv_path):
    df=load_watch_history(csv_path)
    validate_columns(df)

    df = df.rename(columns={
        "channelName": "channel",
        "watchedAt": "watched_at"
    })
    df["category"] = "unknown"
    
    df=clean_string_columns(df)
    df=filter_recent_history(df, months=3)
    channel_freq, category_freq=compute_frequencies(df)
    
    return {
        "channels": channel_freq,
        "categories": category_freq
        }

def compute_decay_weight(watched_at, lambda_=0.05):
    now = datetime.now(timezone.utc)
    days_ago = (now - watched_at).days
    return math.exp(-lambda_*days_ago)

# When Node calls Python, Python must use sys.argv, not hardcoded filenames
csv_path = sys.argv[1]
result=process_watch_history(csv_path)
print(json.dumps(result))
