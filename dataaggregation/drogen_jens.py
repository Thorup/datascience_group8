
from pyspark import SparkConf, SparkContext
from pyspark.sql import Row, SparkSession, SQLContext, Column as Col
from pyspark.sql.types import StructType, StructField, IntegerType, StringType
from pyspark.sql import functions as F
from pyspark.sql.functions import monotonically_increasing_id
from pyspark.sql.functions import lit
from pyspark.sql.functions import split

conf = SparkConf().set('spark.driver.host', '127.0.0.1')
sc = SparkContext(master='local', appName='myAppName', conf=conf)
sqlContext = SQLContext(sc)
county_csv_path = "/home/mads/Desktop/datascience_group8/dataaggregation/CountyTRUE.csv"
opioid_csv_path = "/home/mads/Desktop/datascience_group8/dataaggregation/arcos_all_washpost.csv"


def start_spark_context():
    return sc


def get_dataframe_from_csv(filepath):
    df = sqlContext.read.csv(path=filepath, header=True)
    return df


def calc_opioid_factor(df):
    df1 = df.select(df['dosage_unit'] * df['quantity'] * df['dos_str']
                    ).withColumnRenamed("((dosage_unit * quantity) * dos_str)", "opioid_factor")
    df11 = df1.withColumn("columnindex", monotonically_increasing_id())
    df22 = df.withColumn("columnindex", monotonically_increasing_id())
    new_df = df22.join(df11, df22.columnindex == df11.columnindex, 'inner').drop(
        df11.columnindex).drop(df22.columnindex)
    return new_df


def save_df_as_csv(df, filepath):
    df.select("*").repartition(1).write.format(
        "com.databricks.spark.csv").option('header', 'true').save(filepath)


def get_fips_map_element(row):
    fips = row.fips
    state_abr = row.state_abr
    county = row.county
    key = state_abr + county
    key = key.lower().replace(" ", "")
    result = (key, fips)
    return result;


def get_state_county_fips_dict():
    county_df = get_dataframe_from_csv(county_csv_path)
    county_fips_list = county_df.rdd.map(get_fips_map_element).collect()
    county_fips_dict = dict(county_fips_list)
    return county_fips_dict

def filter_year_from_row(row, year):
    if year in row.transaction_date[len(row.transaction_date) - 4:]:
        return row
    return


def get_fips_yearly_opioid_use_dataframes(opioid_df):
    list_of_dfs = []
    list_of_years = ["2007", "2008", "2009", "2010", "2011", "2012"]

    for year in list_of_years:
        rdd = opioid_df.rdd.map(lambda row: filter_year_from_row(
            row, year)).filter(lambda x: x)
        county_drug_map = rdd.map(get_yearly_row)
        reduced_map = county_drug_map.reduceByKey(lambda s, t: s + t).collect()
        df_reduced = sqlContext.createDataFrame(reduced_map).withColumnRenamed(
            "_1", "fips").withColumnRenamed("_2", "opioid_factor").withColumn("year", lit(year))
        list_of_dfs.append(df_reduced)
    return list_of_dfs



def get_yearly_row(row):
    stateabr = row.buyer_state.lower().replace(" ", "")
    county =  row.buyer_county.lower().replace(" ", "")
    stateabr_county = stateabr + county
    opioid_factor = row.opioid_factor
    return (stateabr_county, opioid_factor)




def swap_stateabr_with_fips(list_of_dfs):
    fips_dict = get_state_county_fips_dict()
    swapped_dfs = []
    for df in list_of_dfs:
        rdd = df.rdd.map(lambda row: (fips_dict.get(row.fips), row.opioid_factor, row.year)).filter(lambda x: x[0] != None).collect()
        swapped_df = sqlContext.createDataFrame(rdd).withColumnRenamed("_1", "fips").withColumnRenamed("_2", "opioid_factor").withColumnRenamed("_3", "year")
        swapped_dfs.append(swapped_df)
    return swapped_dfs

def swap_state_county_monthly_with_fips(df):
    fips_dict = get_state_county_fips_dict()
    rdd = df.rdd.map(lambda row: (fips_dict.get(row.fips), row.month, row.year, row.opioid_factor)).filter(lambda x: x[0] != None).collect()
    swapped_df = sqlContext.createDataFrame(rdd).withColumnRenamed("_1", "fips").withColumnRenamed("_2", "month").withColumnRenamed("_3", "year").withColumnRenamed("_4", "opioid_factor")
    return swapped_df


def extract_state_and_sum_opioid_factor(opioid_data_yearly):
    state_summed_opioid_factor = []
    for df in opioid_data_yearly:
        year = df.select("year").collect()[0]["year"]
        rdd = df.rdd.map(extract_state_abr)
        rdd = rdd.reduceByKey(lambda x,y: x+y)
        new_df = sqlContext.createDataFrame(rdd)
        new_df = new_df.withColumnRenamed("_1", "state_abr").withColumnRenamed("_2", "opioid_factor").withColumn("year", lit(year))
        state_summed_opioid_factor.append(new_df)
    return state_summed_opioid_factor

def extract_state_abr(row):
    return (row.fips[:2], row.opioid_factor)

def filter_month_from_row(row, month):
    if month in row.transaction_date[:2]:
        return row
    return

def get_fips_monthly_opioid_use_dataframes(opioid_df):
    list_of_dfs = []
    list_of_years = ["2007", "2008", "2009", "2010", "2011", "2012"]
    list_of_months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]
    for year in list_of_years:
        yearly_rdd = opioid_df.rdd.map(lambda row: filter_year_from_row(
            row, year)).filter(lambda x: x)
        yearly_rdd = yearly_rdd.map(lambda row: (
            (row.transaction_date[:2] + "-" + year + "-" + (row.buyer_state + row.buyer_county).lower().replace(" ", "")), row.opioid_factor))
        yearly_rdd = yearly_rdd.reduceByKey(lambda x, y: x+y)
        df = sqlContext.createDataFrame(yearly_rdd).withColumnRenamed("_1", "key").withColumnRenamed("_2", "opioid_factor")
        split_col = split(df["key"], '-')
        df = df.withColumn("month", split_col.getItem(0)).withColumn("year", split_col.getItem(1)).withColumn("fips", split_col.getItem(2)).drop(df.key)
        df = swap_state_county_monthly_with_fips(df)
        list_of_dfs.append(df)
    return list_of_dfs
        
def union_all_dataframes(list_of_dfs):
    df_unioned =  list_of_dfs[0];
    for i in range(0, len(list_of_dfs)):
        if (i < len(list_of_dfs) -1):
            df_unioned = df_unioned.union(list_of_dfs[i+1])
    return df_unioned


def create_fips_yearly_dataset(opioid_data):
    opioid_data_yearly=get_fips_yearly_opioid_use_dataframes(opioid_data)
    opioid_data_yearly=swap_stateabr_with_fips(opioid_data_yearly)
    return union_all_dataframes(opioid_data_yearly)

def create_state_yearly_dataset(opioid_data):
    opioid_data_yearly=get_fips_yearly_opioid_use_dataframes(opioid_data)
    state_summed_dataframes = extract_state_and_sum_opioid_factor(opioid_data_yearly)
    return union_all_dataframes(state_summed_dataframes)

def create_fips_monthly_dataset(opioid_data):
    opioid_data_monthy = get_fips_monthly_opioid_use_dataframes(opioid_data)
    return union_all_dataframes(opioid_data_monthy)


opioid_data=get_dataframe_from_csv(opioid_csv_path)
opioid_data=calc_opioid_factor(opioid_data)


df_fips_yearly = create_fips_yearly_dataset(opioid_data)
df_state_yearly = create_state_yearly_dataset(opioid_data)
df_fips_monthly = create_fips_monthly_dataset(opioid_data)

df_fips_yearly.show()
df_state_yearly.show()
df_fips_monthly.show()
