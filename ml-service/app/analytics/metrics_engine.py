def compute_metrics(routes):
    total=sum(r["distance_km"] for r in routes)

    return {
        "coverage":round(min(0.95,0.6+len(routes)*0.05),2),
        "estimated_ridership":int(total*900),
        "co2_saved_kg_day":round(total*0.4*2.6,2),
        "avg_wait_time":round(sum(r["frequency_min"] for r in routes)/len(routes)/2,1)
    }