import math


def calculate_charge(start_time, end_time, rate_per_hour):
    """
    Calculate the total charge for a rental of a vehicle

    Args:
        - start_time: datetime when the rent of the vehicle began
        - end_time: datetime when the rent of the vehicle ended
        - rate_per_hour: cost in dollars per hour

    Returns:
        dict: duration_hours(int), total_charge(float)

    Rules:
        - Billing is per hour and rounded up even for short rentals less is an hour
    """
    duration_seconds = (end_time - start_time).total_seconds()
    duration_hours = max(1, math.ceil(duration_seconds / 3600))
    total_charge = duration_hours * rate_per_hour

    return {"duration_hours": duration_hours, "total_charge": total_charge}
