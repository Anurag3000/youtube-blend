import os
import json
import plotly.express as px

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def generate_plots(analytics, output_dir):
    ensure_dir(output_dir)

    # 1️⃣ Top Channels
    fig1 = px.bar(
        analytics["top_channels"],
        x="name",
        y="score",
        title="Top YouTube Channels"
    )
    fig1.write_html(f"{output_dir}/top_channels.html")

    # 2️⃣ Top Categories
    fig2 = px.pie(
        analytics["top_categories"],
        names="name",
        values="score",
        title="Content Category Distribution"
    )
    fig2.write_html(f"{output_dir}/top_categories.html")

    # 3️⃣ Daily Trend (ONLY if data exists)
    daily = analytics.get("daily_watch_stats", [])

    if daily:
        fig3 = px.line(
            daily,
            x="date",
            y="watch_score",
            title="Daily Watch Activity"
        )
        fig3.write_html(f"{output_dir}/daily_trend.html")
