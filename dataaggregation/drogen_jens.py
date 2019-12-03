from pyspark import SparkConf, SparkContext
from pyspark.sql import Row, SparkSession, SQLContext, Column as Col
from pyspark.sql.types import StructType, StructField, IntegerType, StringType
from pyspark.sql import functions as F
from pyspark.sql.functions import monotonically_increasing_id 


conf = SparkConf().set('spark.driver.host', '127.0.0.1')
sc = SparkContext(master='local', appName='myAppName', conf=conf)
sqlContext = SQLContext(sc)



def start_spark_context():
    return sc

def get_dataframe_from_csv(filepath):
    df = sqlContext.read.csv(path=filepath, header=True)
    return df

def calc_opioid_factor(df):
    df1 = df.select(df['dosage_unit'] * df['quantity'] * df['dos_str']).withColumnRenamed("((dosage_unit * quantity) * dos_str)", "opioid_factor")
    df11 = df1.withColumn("columnindex", monotonically_increasing_id())
    df22 = df.withColumn("columnindex", monotonically_increasing_id())
    new_df = df22.join(df11, df22.columnindex == df11.columnindex, 'inner').drop(df11.columnindex).drop(df22.columnindex)
    return new_df

def save_df_as_csv(df, filepath):
    df.select("*").repartition(1).write.format("com.databricks.spark.csv").option('header', 'true').save(filepath)

def get_fips_map_element(row):
    fips = row.fips
    state_abr = row.state_abr
    county = row.county
    key = state_abr + county
    key = key.lower()
    result = (key, fips)
    return result;


def get_state_county_fips_dict():
    county_file_path = "/home/mads/Desktop/datascience_group8/dataaggregation/CountyTRUE.csv"   
    county_df = get_dataframe_from_csv(county_file_path)
    county_fips_list = county_df.rdd.map(get_fips_map_element).collect()
    county_fips_dict = dict(county_fips_list)
    return county_fips_dict

def print_fips_dict():
   for k,v in get_state_county_fips_dict().items():
       print(k, v)

def append_fips_to_opioid_data():
    return -1

def join_location_opioid_data():
    return -1;

def filter_year_from_row(row, year):
    if year in row.transaction_date[len(row.transaction_date) - 4:]:
        return row
    return

def get_stateabr_yearly_opioid_use_dict(opioid_df):
    list_of_dfs = []
    list_of_years = ["2007", "2008", "2009", "2010", "2011", "2012"]

    for year in list_of_years:
        rdd = opioid_df.rdd.map(lambda row: filter_year_from_row(row, year)).filter(lambda x: x)
        county_drug_map = rdd.map(lambda row: (row.buyer_state + row.buyer_county, row.opioid_factor))
        reduced_map = county_drug_map.reduceByKey(lambda s, t: s + t).collect()
        df_reduced = sqlContext.createDataFrame(reduced_map).withColumnRenamed("_1", "fips").withColumnRenamed("_2", "opioid_factor")
        list_of_dfs.append(df_reduced)
    return list_of_dfs

def swap_stateabr_with_fips(list_of_dfs, opioid_data):
    fips_dict = get_stateabr_yearly_opioid_use_dict(opioid_data)
    for df in list_of_dfs:
        rdd = df.rdd.map(replace_state_fips)
        print("DF")
    return -1;

def replace_state_fips(row):
    print("REPLAC")
    print(row)
"""
def replace_state_fips(row, fips_dict):
    fips = fips_dict.get(row.fips.lower())
    swapped_tuple = (fips, row.opioid_factor)
    print("REPLAC")
    print(swapped_tuple)
    return (fips, row.opioid_factor)
"""
def append_additional_data(list_of_dfs):
    return -1;


def create_yearly_dataset():
    opioid_data = get_dataframe_from_csv("/home/mads/Desktop/datascience_group8/dataaggregation/arcos_all_washpost.csv")
    opioid_data = calc_opioid_factor(opioid_data)
    opioid_data_yearly = get_stateabr_yearly_opioid_use_dict(opioid_data)
    opioid_data_yearly = swap_stateabr_with_fips(opioid_data_yearly, opioid_data)
    opioid_data_yearly = append_additional_data(opioid_data_yearly)
    return opioid_data_yearly

def create_monthly_dataset():
    return -1;

#print_fips_dict()
"""
print_fips_dict()
opioid_data = calc_opioid_factor(get_dataframe_from_csv("/home/mads/Desktop/datascience_group8/dataaggregation/arcos_all_washpost.csv"))
[x.show() for x in get_stateabr_yearly_opioid_use_dict(opioid_data)]
"""
create_yearly_dataset()
#create_yearly_dataset()



