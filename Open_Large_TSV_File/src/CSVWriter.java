import java.io.FileWriter;
import java.io.IOException;
import java.util.HashMap;

public class CSVWriter
{
    private String outputFilename = "C:\\Users\\Lasse\\Downloads\\arcos_all_washpost_TRUE.csv";
    private FileWriter fileWriter;
    private HashMap<String, Boolean> valuesToInclude;
    private HashMap<String, Boolean> yearsToInclude;

    public CSVWriter()
    {
        try
        {
            fileWriter = new FileWriter(outputFilename);
        } catch (IOException e)
        {
            e.printStackTrace();
        }
        initHashMaps();
    }

    private void initHashMaps()
    {
        this.valuesToInclude = new HashMap<>();
        valuesToInclude.put("buyer_state", true);
        valuesToInclude.put("buyer_county", true);
        valuesToInclude.put("drug_name", true);
        valuesToInclude.put("quantity", true);
        valuesToInclude.put("transaction_date", true);
        valuesToInclude.put("dosage_unit", true);
        valuesToInclude.put("dos_str", true);
        valuesToInclude.put("transaction_code", true);
        valuesToInclude.put("measure", true);

        this.yearsToInclude = new HashMap<>();
        yearsToInclude.put("2007", true);
        yearsToInclude.put("2008", true);
        yearsToInclude.put("2009", true);
        yearsToInclude.put("2010", true);
        yearsToInclude.put("2011", true);
        yearsToInclude.put("2012", true);

    }

    public void writeFirstLine(String[] dataTypes)
    {
        try
        {
            String csvLine;
            for (int i = 0; i < dataTypes.length; i++)
            {
                if (isIncluded(dataTypes[i]))
                {
                    if (i == dataTypes.length - 1)
                    {
                        csvLine = dataTypes[i] + "\n";
                    }
                    else
                    {
                        csvLine = dataTypes[i] + ",";
                    }
                    fileWriter.write(csvLine);
                }
            }
        } catch (IOException ex)
        {
            ex.printStackTrace();
        }
    }

    public void writeLineToCSVFile(TSVInstance dataInstance)
    {
        try
        {
            String csvLine = "";
            String[] dataKeyArray = new String[dataInstance.getDataMap().size()];
            dataInstance.getDataMap().keySet().toArray(dataKeyArray);
            for (int i = 0; i < dataKeyArray.length; i++)
            {
                String dataKey = dataKeyArray[i];
                if (isIncluded(dataKey))
                {
                    String dataValue = dataInstance.getDataMap().get(dataKey);
                    if (dataValue.contains(","))
                    {
                        dataValue = dataValue.replace(",", ";");
                    }
                    if (dataValue.startsWith("  "))
                    {
                        dataValue = dataValue.substring(2);
                    }
                    else if (dataValue.startsWith(" "))
                    {
                        dataValue = dataValue.substring(1);
                    }

                    if (i == dataKeyArray.length - 1)
                    {
                        csvLine = csvLine + dataValue + "\n";
                    }
                    else
                    {
                        csvLine = csvLine + dataValue + ",";
                    }
                }
            }
            if (isWithinYear(dataInstance.getDataMap().get("transaction_date")))
            {
                fileWriter.write(csvLine);
            }
        } catch (IOException ex)
        {
            ex.printStackTrace();
        }
    }

    public void closeFileWriter()
    {
        try
        {
            fileWriter.flush();
            fileWriter.close();
        } catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    private boolean isIncluded(String dataKey)
    {
        return valuesToInclude.getOrDefault(dataKey, false);
    }

    private boolean isWithinYear(String date)
    {
        return yearsToInclude.getOrDefault(date.substring(date.length() - 4), false);
    }
}
