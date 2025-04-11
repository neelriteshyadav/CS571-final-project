import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
drivers = pd.read_csv('/content/drivers.csv')
results = pd.read_csv('/content/results.csv')
races = pd.read_csv('/content/races.csv')
qualifying = pd.read_csv('/content/qualifying.csv')

# Load championship files
driver_standings = pd.read_csv("/content/driver_standings.csv")
races = pd.read_csv("/content/races.csv")

# Merge to get year
merged = driver_standings.merge(races[['raceId', 'year']], on='raceId', how='left')
champions = merged.sort_values(['year', 'points'], ascending=[True, False]).drop_duplicates('year')

# Count championships per driver
champion_counts = champions.merge(drivers[['driverId', 'forename', 'surname']], on='driverId', how='left')
champion_counts['Driver Name'] = champion_counts['forename'] + " " + champion_counts['surname']
championships = champion_counts['Driver Name'].value_counts().reset_index()
championships.columns = ['Driver Name', 'Championships']

# Save for radial graph
championships.to_csv("championships_radial.csv", index=False)

top10 = championships.head(10)
plt.figure(figsize=(8, 8))
plt.pie(top10['Championships'], labels=top10['Driver Name'], autopct='%1.1f%%', startangle=90)
plt.title("Top 10 Drivers by Championships")
plt.axis('equal')
plt.show()