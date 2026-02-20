"""Calculate service frequencies for routes."""


def calculate_frequency(demand, capacity: int = 30):
    """Return a simple frequency estimate (trips per hour)."""
    if capacity <= 0:
        return 0
    return max(1, int(sum(demand) / capacity))
