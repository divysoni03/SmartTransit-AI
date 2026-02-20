from sklearn.cluster import KMeans

def generate_bus_stops(points, k=20):

    if len(points) < k:
        k = max(2, len(points)//2)

    model = KMeans(n_clusters=k, n_init=10)
    model.fit(points)

    stops=[]
    for i,(lat,lng) in enumerate(model.cluster_centers_):
        stops.append({
            "id":i+1,
            "lat":float(lat),
            "lng":float(lng)
        })
    return stops