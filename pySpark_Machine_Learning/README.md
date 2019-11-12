# The pySpark Machine Learning scripts

## Documentation
> pySpark API Docs [pySpark API](https://spark.apache.org/docs/latest/api/python/pyspark.ml.html#pyspark.ml.clustering.KMeans).

> Spark Clustering API Docs [Apache Spark](https://spark.apache.org/docs/latest/ml-clustering.html).

> Apache Spark github repository [Spark Github](https://github.com/apache/spark).

> Apache Spark github machine learning examples [Machine Learning Examples](https://github.com/apache/spark/tree/master/examples/src/main/python/ml).

> Apache Spark github machine learning data for examples [Machine Learning Data](https://github.com/apache/spark/tree/master/data/mllib).

## Python Script Dependencies
This should be installed on your local machine.

`pip3 install numpy`

## Local Docker Configuration
The following updates `apt` installs `wget`, pulls the sample kmeans data from the spark github and puts it into the Hadoop filesystem.
```
apt update
apt install wget
wget -O sample_kmeans_data.txt https://raw.githubusercontent.com/apache/spark/master/data/mllib/sample_kmeans_data.txt
hdfs dfs -put sample_kmeans_data.txt /
```