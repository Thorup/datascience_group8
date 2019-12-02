from pyspark import SparkConf, SparkContext
from pyspark.sql import Row, SparkSession, SQLContext, Column as Col
from pyspark.sql.types import StructType, StructField, IntegerType, StringType
from pyspark.sql import functions as F

conf = SparkConf().set('spark.driver.host', '127.0.0.1')
sc = SparkContext(master='local', appName='myAppName', conf=conf)
sqlContext = SQLContext(sc)

#schema = StructType([
#    StructField("x1", StringType(), True),
#    StructField("y2", StringType(), True),
#    StructField("z3", StringType(), True)
#    ])

#df = sqlContext.read.csv(path="/home/jens/code/DataScience/DataScienceCourseSDU/arcos_all_washpost.csv", header=True, schema=schema)
df = sqlContext.read.csv(path="C:/Users/Lasse/Desktop/DataScienceCourseSDU/arcos_all_washpost.csv", header=True)
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")
print("------------------------------------------------------------------------------------")

print("Output: ")
#df.show()
#Make mean deviation and standard diviation
#df.describe().show()
#df.select("*, dosage_unit * quantity * dos_str as drugfactor").show()
df1 = df.select((df['dosage_unit']) * df['quantity'] * df['dos_str'])
df2 = df.crossJoin(df1).withColumnRenamed("((dosage_unit * quantity) * dos_str)", "drugfactor")
df2.show()

# df2.coalesce(1) \
#       .write \
#       .option("header","true") \
#       .option("sep",",") \
#       .mode("overwrite") \
#       .csv("drugfactorcsv.csv")

#df2.coalesce(1).write.csv("drugfactor.csv")
df2.select("*").repartition(1).write.format("com.databricks.spark.csv").option('header', 'true').save("/drugfactor")


#print(df.groupBy().sum().collect())
#print(df.printSchema())
#print((df.groupBy("test1").mean()).collect())
#df.show()
#df.select(df['x1'], df['y2'], df['x1'] + df['y2']).show()
#df.select(df['buyer_address1'], df['buyer_city'], df['buyer_state']).show()
#df.select(df['drug_name'], df['quantity'] + df['dosage_unit'] + df['dos_str']).show()

#df.selectExpr('drug_name as Drug_name', 'quantity * dosage_unit * dos_str as Junkie_Factor').show()
#df.explain()


