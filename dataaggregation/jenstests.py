
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


#df.show()
#Make mean deviation and standard diviation
#df.describe().show()
#df.select("*, dosage_unit * quantity * dos_str as drugfactor").show()



# df2.coalesce(1) \
#       .write \
#       .option("header","true") \
#       .option("sep",",") \
#       .mode("overwrite") \
#       .csv("drugfactorcsv.csv")

#df2.coalesce(1).write.csv("drugfactor.csv")





#print(df.groupBy().sum().collect())
#print(df.printSchema())
#print((df.groupBy("test1").mean()).collect())
#df.show()
#df.select(df['x1'], df['y2'], df['x1'] + df['y2']).show()
#df.select(df['buyer_address1'], df['buyer_city'], df['buyer_state']).show()
#df.select(df['drug_name'], df['quantity'] + df['dosage_unit'] + df['dos_str']).show()

#df.selectExpr('drug_name as Drug_name', 'quantity * dosage_unit * dos_str as Junkie_Factor').show()
#df.explain()