
from numpy.random import randn
from numpy.random import seed
from scipy.stats import spearmanr
from scipy.stats import pearsonr
import csv

opioid_factor_index = 2
crime_index = 3
homeless_index = 4
income_index = 5
unemp_index = 6
pop_index = 7
            
count = 0;
#TODO: Calc all correlation values and add to corr map and then save to csv
X = []
Y = []
with open('state_full.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        if count > 0:
            x = float(row[unemp_index])
            y = float(row[income_index])
            X.append(x)
            Y.append(y)
        count += 1
    spear_corr, _ = pearsonr(X, Y)
    print(spear_corr)
        

