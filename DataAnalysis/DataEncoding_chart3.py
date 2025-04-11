import pandas as pd

drivers = pd.read_csv('/content/drivers.csv')
results = pd.read_csv('/content/results.csv')
races = pd.read_csv('/content/races.csv')
qualifying = pd.read_csv('/content/qualifying.csv')


# Total Points per Driver (across all seasons)
total_points = results.groupby('driverId')['points'].sum().reset_index()
total_points.columns = ['driverId', 'Total Points']

# Races Won per Driver
races_won = results[results['positionOrder'] == 1].groupby('driverId').size().reset_index(name='Races Won')

# Pole Positions per Driver
pole_positions = qualifying[qualifying['position'] == 1].groupby('driverId').size().reset_index(name='Pole Positions')

# Average Lap Time per Driver
avg_lap_time = lap_times.groupby('driverId')['milliseconds'].mean().reset_index()
avg_lap_time.columns = ['driverId', 'Avg Lap Time']

# Merge All
metrics = total_points.merge(races_won, on='driverId', how='left') \
                      .merge(pole_positions, on='driverId', how='left') \
                      .merge(avg_lap_time, on='driverId', how='left') \
                      .merge(drivers[['driverId', 'forename', 'surname']], on='driverId', how='left')

# Clean & fill NaNs
metrics[['Races Won', 'Pole Positions']] = metrics[['Races Won', 'Pole Positions']].fillna(0).astype(int)
metrics['Driver Name'] = metrics['forename'] + " " + metrics['surname']
metrics = metrics[['Driver Name', 'Total Points', 'Races Won', 'Pole Positions', 'Avg Lap Time']]

# Save for D3.js
metrics.to_csv("heatmap_metrics.csv", index=False)

import seaborn as sns
import matplotlib.pyplot as plt

# Normalize for visual comparison (just for heatmap)
norm_metrics = metrics.copy()
norm_metrics.set_index('Driver Name', inplace=True)
norm_metrics = (norm_metrics - norm_metrics.min()) / (norm_metrics.max() - norm_metrics.min())

plt.figure(figsize=(12, 10))
sns.heatmap(norm_metrics.head(20), cmap="YlGnBu", annot=True, fmt=".2f")
plt.title("Top 20 Drivers - Comparative Performance Metrics")
plt.show()