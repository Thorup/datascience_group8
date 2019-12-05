import java.io.FileWriter;
import java.io.IOException;

public class CSVWriter {
    private String outputFilename = "C:\\Users\\Lasse\\Downloads\\arcos_all_washpost.csv";
    private FileWriter fileWriter;

    public CSVWriter() {
        try {
            fileWriter = new FileWriter(outputFilename);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void writeFirstLine(String[] dataTypes) {
        try {
            String csvLine;
            for (int i = 0; i < dataTypes.length; i++) {
                String dataKey = dataTypes[i];
                if (isIncluded(dataKey)) {
                    if (i == dataTypes.length - 1) {
                        csvLine = dataKey + "\n";
                    } else {
                        csvLine = dataKey + ",";
                    }
                    fileWriter.write(csvLine);
                }
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void writeLineToCSVFile(TSVInstance dataInstance) {
        try {
            String csvLine = "";
            String[] dataKeyArray = new String[dataInstance.getDataMap().size()];
            dataInstance.getDataMap().keySet().toArray(dataKeyArray);
            for (int i = 0; i < dataKeyArray.length; i++) {
                String dataKey = dataKeyArray[i];
                if (isIncluded(dataKey)) {
                    String dataValue = dataInstance.getDataMap().get(dataKey);
                    if (dataValue.contains(",")) {
                        dataValue = dataValue.replace(",",";");
                    }
                    if (dataValue.startsWith("  ")) {
                        dataValue = dataValue.substring(2);
                    } else if (dataValue.startsWith(" ")) {
                        dataValue = dataValue.substring(1);
                    }

                    if (i == dataKeyArray.length - 1) {
                        csvLine = csvLine + dataValue + "\n";
                    } else {
                        csvLine = csvLine + dataValue + ",";
                    }
                }
            }
            if (isWithinYear(dataInstance.getDataMap().get("TRANSACTION_DATE".toLowerCase()))) {
                //System.out.println(csvLine);
                fileWriter.write(csvLine);
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void closeFileWriter() {
        try {
            fileWriter.flush();
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private boolean isIncluded(String dataKey) {
        if ("BUYER_DEA_NO".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("BUYER_BUS_ACT".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("BUYER_NAME".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("BUYER_ADDRESS1".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("BUYER_CITY".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("BUYER_STATE".toLowerCase().equals(dataKey)) {
            return true;
        } else if ("BUYER_ZIP".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("BUYER_COUNTY".toLowerCase().equals(dataKey)) {
            return true;
        } else if ("DRUG_NAME".toLowerCase().equals(dataKey)) {
            return true;
        } else if ("QUANTITY".toLowerCase().equals(dataKey)) {
            return true;
        } else if ("TRANSACTION_DATE".toLowerCase().equals(dataKey)) {
            return true;
        } else if ("DOSAGE_UNIT".toLowerCase().equals(dataKey)) {
            return true;
        } else if ("Product_Name".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("Measure".toLowerCase().equals(dataKey)) {
            return false;
        } else if ("dos_str".toLowerCase().equals(dataKey)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean isWithinYear(String date) {
        String year = date.substring(date.length()-4);
        if (year.equals("2007")) {
            return true;
        } else if (year.equals("2008")) {
            return true;
        } else if (year.equals("2009")) {
            return true;
        } else if (year.equals("2010")) {
            return true;
        } else if (year.equals("2011")) {
            return true;
        } else if (year.equals("2012")) {
            return true;
        } else {
            return false;
        }
    }
}
