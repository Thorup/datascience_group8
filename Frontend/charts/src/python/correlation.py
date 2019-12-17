
from numpy.random import randn
from numpy.random import seed
from scipy.stats import spearmanr
import csv


corr = {}


print(corr)


#TODO: Calc all correlation values and add to corr map and then save to csv
with open('state_full.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for row in csv_reader:
        print(row)

