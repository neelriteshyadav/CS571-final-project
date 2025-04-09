import pandas as pd


drivers = pd.read_csv('../Data/drivers.csv')
results = pd.read_csv('../Data/results.csv')
races = pd.read_csv('../Data/races.csv')
qualifying = pd.read_csv('../Data/qualifying.csv')

results_with_year = results.merge(races[['raceId', 'year']], on='raceId', how='left')

total_points = (
    results_with_year
    .groupby(['driverId', 'year'])['points']
    .sum()
    .reset_index()
    .rename(columns={'points': 'Total Points'})
)

races_won = (
    results_with_year[results_with_year['positionOrder'] == 1]
    .groupby(['driverId', 'year'])
    .size()
    .reset_index(name='Races Won')
)

qualifying_with_year = qualifying.merge(races[['raceId', 'year']], on='raceId', how='left')
qualified_first = (
    qualifying_with_year[qualifying_with_year['position'] == 1]
    .groupby(['driverId', 'year'])
    .size()
    .reset_index(name='Races Qualified First')
)

performance = total_points.merge(races_won, on=['driverId', 'year'], how='left')
performance = performance.merge(qualified_first, on=['driverId', 'year'], how='left')

performance = performance.merge(drivers[['driverId', 'forename', 'surname']], on='driverId', how='left')
performance['Driver Name'] = performance['forename'] + ' ' + performance['surname']
performance = performance.drop(columns=['forename', 'surname'])

# Fill missing values in Races Won and Races Qualified First with 0
performance[['Races Won', 'Races Qualified First']] = (
    performance[['Races Won', 'Races Qualified First']].fillna(0).astype(int)
)

performance = performance[['year', 'driverId', 'Driver Name', 'Total Points', 'Races Won', 'Races Qualified First']]
performance.to_csv('chart1.csv', index=False)