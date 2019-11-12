from __future__ import print_function

# $example on$
from pyspark.ml.clustering import KMeans
from pyspark.ml.evaluation import ClusteringEvaluator
from pyspark import SparkConf, SparkContext
# $example off$

from pyspark.sql import SparkSession

# Setup spark context
conf = SparkConf().set('spark.driver.host', '127.0.0.1')
sc = SparkContext(master='local', appName='myAppName', conf=conf)

# Define path to Hadoop file
hadoopFile = "hdfs://172.200.0.2:9000/sample_kmeans_data.txt"

# Create spark session
spark = SparkSession\
    .builder\
    .appName("myAppName")\
    .getOrCreate()

# $example on$
# Loads data.
dataset = spark.read.format("libsvm").load(hadoopFile)

# Trains a k-means model.
kmeans = KMeans().setK(2).setSeed(1)
model = kmeans.fit(dataset)

# Make predictions
predictions = model.transform(dataset)

# Evaluate clustering by computing Silhouette score
evaluator = ClusteringEvaluator()

silhouette = evaluator.evaluate(predictions)
print("Silhouette with squared euclidean distance = " + str(silhouette))

# Shows the result.
centers = model.clusterCenters()
print("Cluster Centers: ")
for center in centers:
    print(center)
# $example off$

sc.stop()