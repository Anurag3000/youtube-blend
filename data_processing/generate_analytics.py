def normalize_category(category):
    if not category:
        return "unknown"
    return category.strip().lower()

# def normalize_to_dict(data):
#     if isinstance(data, dict):
#         return data
#     if isinstance(data, list):
#         return {item["name"]: item["count"] for item in data}
#     return {}

def top_n_from_dict(data, n=10):
    """
    data is a dict
    Converts {key: score} → sorted list of dicts
    """
    sorted_items=sorted(
        data.items(),
        key=lambda x: x[1],
        reverse= True
    )

    return [
        {"name": key, "score": round(value,2)}
        for key, value in sorted_items[:n]
    ]

def compute_summary(channels: dict, categories: dict):
    favorite_channel = max(channels.items(), key=lambda x: x[1])
    favorite_category = max(categories.items(), key=lambda x: x[1])

    return {
        "favorite_channel": {
            "name": favorite_channel[0],
            "score": round(favorite_channel[1], 2)
        },
        "favorite_category": favorite_category[0],
        "unique_channels": len(channels),
        "total_watch_score": round(sum(channels.values()), 2)
    }


def build_daily_timeseries(raw_events):
    """
    raw_events: list of {watched_at, decay_weight}
    """
    daily = {}

    for event in raw_events:
        date = event["watched_at"][:10]  # YYYY-MM-DD
        daily[date] = daily.get(date, 0) + event["weight"]

    return [
        {"date": date, "watch_score": round(score, 2)}
        for date, score in sorted(daily.items())
    ]

def generate_user_analytics(processed_data, raw_events):
    channels = processed_data["channels"]
    categories = {
        normalize_category(k): v
        for k, v in processed_data["categories"].items()
    }

    analytics = {
        "summary": compute_summary(channels, categories),
        "top_channels": top_n_from_dict(channels, n=10),
        "top_categories": top_n_from_dict(categories, n=6),
        "daily_watch_stats": build_daily_timeseries(raw_events)
    }

    return analytics
