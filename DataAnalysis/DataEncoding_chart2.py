import pandas as pd


constructors = pd.read_csv('../Data/constructors.csv')
constructor_standings = pd.read_csv('../Data/constructor_standings.csv')
constructor_results = pd.read_csv('../Data/constructor_results.csv')
qualifying = pd.read_csv('../Data/qualifying.csv')
races = pd.read_csv('../Data/races.csv')
results = pd.read_csv('../Data/results.csv')

constructor_results = constructor_results.merge(races[['raceId', 'year']], on='raceId', how='left')

total_points = (
    constructor_results
    .groupby(['constructorId', 'year'])['points']
    .sum()
    .reset_index()
    .rename(columns={'points': 'Total Points'})
)

results = results.merge(races[['raceId', 'year']], on='raceId', how='left')

races_won = (
    results[results['positionOrder'] == 1]
    .groupby(['constructorId', 'year'])
    .size()
    .reset_index(name='Races Won')
)

qualifying = qualifying.merge(races[['raceId', 'year']], on='raceId', how='left')

qualified_first = (
    qualifying[qualifying['position'] == 1]
    .groupby(['constructorId', 'year'])
    .size()
    .reset_index(name='Races Qualified First')
)

performance = total_points.merge(races_won, on=['constructorId', 'year'], how='left')
performance = performance.merge(qualified_first, on=['constructorId', 'year'], how='left')

performance = performance.merge(constructors[['constructorId', 'name']], on='constructorId', how='left')
performance = performance.rename(columns={'name': 'Constructor Name'})

# Fill missing values in race counts with 0
performance[['Races Won', 'Races Qualified First']] = (
    performance[['Races Won', 'Races Qualified First']].fillna(0).astype(int)
)

performance = performance[
    ['year', 'constructorId', 'Constructor Name', 'Total Points', 'Races Won', 'Races Qualified First']
]

performance.to_csv('chart2.csv', index=False)