# spatial_utils.py

def estimate_area_km2(boundary):
    """
    Rough rectangular area estimation from boundary coordinates
    boundary = list of dicts [{"lat":..,"lng":..}, ...]
    """

    if len(boundary) < 3:
        return 1

    lat_diff = abs(boundary[0]["lat"] - boundary[2]["lat"])
    lng_diff = abs(boundary[0]["lng"] - boundary[2]["lng"])

    # 1 degree ≈ 111 km
    return (lat_diff * 111) * (lng_diff * 111)