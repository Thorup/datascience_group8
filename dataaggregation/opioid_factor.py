
from pyspark import SparkConf, SparkContext
from pyspark.sql import Row, SparkSession, SQLContext, Column as Col
from pyspark.sql.types import StructType, StructField, IntegerType, StringType
from pyspark.sql import functions as F
from pyspark.sql.functions import monotonically_increasing_id
from pyspark.sql.functions import lit
from pyspark.sql.functions import split

#Set up spark and SQLContext
conf = SparkConf().set('spark.driver.host', '127.0.0.1')
sc = SparkContext(master='local', appName='myAppName', conf=conf)
sqlContext = SQLContext(sc)

#Path to local dataset containing the latitudes and longitudes of counties in the U.S
county_csv_path = "data/county_lat_long.csv"
#Path to reduced original dataset containing opioid information
opioid_csv_path = "data/reduced_100_with_tabs.csv"



#Read the csv file from the filepath, save and return as a DataFrame
def get_dataframe_from_csv(filepath):
    df = sqlContext.read.csv(path=filepath, header=True)
    return df

"""
    Get the product of quantity, dosage unit and dosage strength
    as opioid_factor column, for transaction that are either S(Sales)
    or T(Theft). These two values constitutes the opioid amount that 
    is consumed in the U.S. (Y and Z codes is Destruction and Government 
    Seizures)
    Filter out all NoneTypes and join with the rest of the dataset
"""
def calc_opioid_factor(df):
    df_filter_transaction_code =  df.select("*").where("transaction_code='S' OR transaction_code = 'T'")
    df1 = df_filter_transaction_code.select(df_filter_transaction_code['dosage_unit'] * df_filter_transaction_code['quantity'] * df_filter_transaction_code['dos_str']).withColumnRenamed("((dosage_unit * quantity) * dos_str)", "opioid_factor")
    df1 = sqlContext.createDataFrame(df1.rdd.filter(lambda row: row[0] is not None))
    df11 = df1.withColumn("columnindex", monotonically_increasing_id())
    df22 = df.withColumn("columnindex", monotonically_increasing_id())
    new_df = df22.join(df11, df22.columnindex == df11.columnindex, 'inner').drop(
        df11.columnindex).drop(df22.columnindex)
    return new_df

"""
    Save a dataframe as a csv file in filepath.
    Notice that the file will be saved in local 
    root folder
"""
def save_df_as_csv(df, filepath):
    df.select("*").repartition(1).write.format(
        "com.databricks.spark.csv").option('header', 'true').save(filepath)


"""
    Map State abbreviation and county name to a FIPS.
    FIPS(Federal Information Processing Standards) is a number
    used to uniquily identify counties.
"""
def get_fips_map_element(row):
    fips = row.fips
    state_abr = row.state_abr
    county = row.county
    key = state_abr + county
    key = key.lower().replace(" ", "")
    result = (key, fips)
    return result;

"""
    Create a dictionary from the county dataset containing
    state abbreviations + county names mapping to a FIPS.
    FIPS(Federal Information Processing Standards) is a number
    used to uniquily identify counties.
"""
def get_state_county_fips_dict():
    county_df = get_dataframe_from_csv(county_csv_path)
    county_fips_list = county_df.rdd.map(get_fips_map_element).collect()
    county_fips_dict = dict(county_fips_list)
    return county_fips_dict

"""
    Only return a row matching specified year. 
"""
def filter_year_from_row(row, year):
    if year in row.transaction_date[len(row.transaction_date) - 4:]:
        return row
    return

"""
    Create a dataframe for each year from 2007-2012. 
    Filter out all NoneTypes and create new DataFrame with
    FIPS mapping to the accumulated opioid factor and a year
"""
def get_fips_yearly_opioid_use_dataframes(opioid_df):
    list_of_dfs = []
    list_of_years = ["2007", "2008", "2009", "2010", "2011", "2012"]

    for year in list_of_years:
        rdd = opioid_df.rdd.map(lambda row: filter_year_from_row(
            row, year)).filter(lambda x: x)
        county_drug_map = rdd.map(get_yearly_row).filter(lambda row: row[1] is not None)
        reduced_map = county_drug_map.reduceByKey(lambda s, t: s + t).collect()
        df_reduced = sqlContext.createDataFrame(reduced_map).withColumnRenamed(
            "_1", "fips").withColumnRenamed("_2", "opioid_factor").withColumn("year", lit(year))
        list_of_dfs.append(df_reduced)
    return list_of_dfs

"""
    Remove spaces and lower case on state name and county name
    to streamline key values
    Map a state abbreviation + county to an opioid factor
"""
def get_yearly_row(row):
    stateabr = row.buyer_state.lower().replace(" ", "")
    county =  row.buyer_county.lower().replace(" ", "")
    stateabr_county = stateabr + county
    opioid_factor = row.opioid_factor
    return (stateabr_county, opioid_factor)


"""
    Takes a list of dataframes which has state abbreviation + county name
    as a key, and swaps that key with a mathcing FIPS for later indexing
"""
def swap_stateabr_with_fips(list_of_dfs):
    fips_dict = get_state_county_fips_dict()
    swapped_dfs = []
    for df in list_of_dfs:
        rdd = df.rdd.map(lambda row: (fips_dict.get(row.fips), row.opioid_factor, row.year)).filter(lambda x: x[0] != None).collect()
        swapped_df = sqlContext.createDataFrame(rdd).withColumnRenamed("_1", "fips").withColumnRenamed("_2", "opioid_factor").withColumnRenamed("_3", "year")
        swapped_dfs.append(swapped_df)
    return swapped_dfs


"""
    Takes a list of dataframes which has state abbreviation + county name
    as a key, and swaps that key with a mathcing FIPS for later indexing
    This method handles a little differently than swap_stateabr_with_fips
    since it handles months and not years
    #TODO: Remove duplication from this method and swap_stateabr_with_fips
"""
def swap_state_county_monthly_with_fips(df):
    fips_dict = get_state_county_fips_dict()
    rdd = df.rdd.map(lambda row: (fips_dict.get(row.fips), row.month, row.year, row.opioid_factor)).filter(lambda x: x[0] != None).collect()
    swapped_df = sqlContext.createDataFrame(rdd).withColumnRenamed("_1", "fips").withColumnRenamed("_2", "month").withColumnRenamed("_3", "year").withColumnRenamed("_4", "opioid_factor")
    return swapped_df

"""
    Creates a new dataframe from a yearly county dataframe
    and sums up all opioid factors for each state
"""
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
    for i in range(1, len(list_of_dfs)):
        df_unioned = df_unioned.union(list_of_dfs[i])
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


def save_csv(df, filename):
    df.select("*").repartition(1).write.format("com.databricks.spark.csv").option('header', 'true').save("/"+filename)


opioid_data=get_dataframe_from_csv(opioid_csv_path)
opioid_data=calc_opioid_factor(opioid_data)


df_fips_yearly = create_fips_yearly_dataset(opioid_data)
#df_state_yearly = create_state_yearly_dataset(opioid_data)
#df_fips_monthly = create_fips_monthly_dataset(opioid_data)

#save_csv(df_state_yearly, "state_yearly")
#save_csv(df_fips_yearly, "fips_yearly")
#save_csv(df_fips_monthly, "fips_monthly")


df_fips_yearly.show()
#df_state_yearly.show()
#df_fips_monthly.show()
