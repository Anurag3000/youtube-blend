from generate_analytics import generate_user_analytics
from plot_generator import generate_plots

# Fake but realistic input
processed_data = {
    "channels": {
        "veritasium": 42.7,
        "fireship": 21.9,
        "3blue1brown": 31.2
    },
    "categories": {
        "science": 61.4,
        "technology": 29.8,
        "education": 18.3
    }
}

raw_events = [
    {"watched_at": "2026-01-01T10:00:00Z", "weight": 1.2},
    {"watched_at": "2026-01-01T18:00:00Z", "weight": 2.0},
    {"watched_at": "2026-01-02T14:00:00Z", "weight": 3.1}
]

analytics = generate_user_analytics(processed_data, raw_events)

generate_plots(analytics, "public/plots/test_user")
