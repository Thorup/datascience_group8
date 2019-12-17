from __future__ import print_function

# $example on$
from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator
from pyspark import SparkConf, SparkContext
from pyspark.sql.functions import monotonically_increasing_id
from pyspark.ml.feature import VectorAssembler
# $example off$

from matplotlib import pyplot as plt
from pyspark.sql import SparkSession

# Setup spark context
conf = SparkConf().set('spark.driver.host', '127.0.0.1')
sc = SparkContext(master='local', appName='myAppName', conf=conf)

# Define path to Hadoop file
hadoopFile = "hdfs://172.200.0.2:9000/test.csv"

# Create spark session
spark = SparkSession\
    .builder\
    .appName("myAppName")\
    .getOrCreate()

# $example on$
# Loads data.
#dataset = spark.read.json.load(hadoopFile)
dataset = spark.read.csv(hadoopFile, inferSchema = True, header = True)

#dataset.select('Opioid_Factor', 'Crime_Percent', 'Homeless_Percent', 'Average_Income', 'Unemployment_Percent', 'Population').show()

def prepareData():
    df1 = dataset.select(dataset['Opioid_Factor'] / dataset['Population']).withColumnRenamed("(Opioid_factor / Population)", "new_opioid_factor")
    df11 = df1.withColumn("columnindex", monotonically_increasing_id())
    df22 = dataset.withColumn("columnindex", monotonically_increasing_id())
    new_df = df22.join(df11, df22.columnindex == df11.columnindex, 'inner').drop(df11.columnindex).drop(df22.columnindex)
    return new_df


def makeKMeanshappen(df, k, seed):   
    kMeans = KMeans().setK(k).setSeed(seed)
    model = kMeans.fit(df.select("features"))

    predictions = model.transform(df)
    predictions.show()
    evaluator = ClusteringEvaluator()


    silhouette = evaluator.evaluate(predictions)

    print("Silhouette with squared euclidean distance = " + str(silhouette))

    # Shows the result.
    centers = model.clusterCenters()
    print("Cluster Centers: ")
    for center in centers:
        print(center)
    # $example off$

df = prepareData()
df.show()
df= df.na.fill(1)

vecAssemblerHomeless = VectorAssembler(inputCols=['Homeless_Percent', 'new_opioid_factor'], outputCol="features", handleInvalid="keep")
vecAssemblerAvgInc = VectorAssembler(inputCols=['Average_Income','new_opioid_factor'], outputCol="features", handleInvalid="keep")
vecAssemblerUnemployed = VectorAssembler(inputCols=['Unemployment_Percent','new_opioid_factor'], outputCol="features", handleInvalid="keep")
vecAssemblerCrime = VectorAssembler(inputCols=['Crime_Percent','new_opioid_factor'], outputCol="features", handleInvalid="keep")

dfHomeless = vecAssemblerHomeless.transform(df)
dfAvgInc = vecAssemblerAvgInc.transform(df)
dfUnemployed = vecAssemblerUnemployed.transform(df)
dfCrime = vecAssemblerCrime.transform(df)


makeKMeanshappen(dfHomeless, 5, 1)
makeKMeanshappen(dfAvgInc, 3, 1)
makeKMeanshappen(dfUnemployed, 5, 1)
makeKMeanshappen(dfCrime, 5, 1)






sc.stop()