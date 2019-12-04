import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class ReadTSVFile {
    private String inputFilename = "C:\\Users\\2rup\\Downloads\\pain-pills-in-the-usa\\arcos_all_washpost.tsv";
    private BufferedReader bufferedReader;
    private String[] dataTypes;

    public ReadTSVFile() {
        setBufferedReader();
        setDataTypes();
    }

    private void setBufferedReader() {
        try {
            bufferedReader = new BufferedReader(new FileReader(inputFilename));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    private void setDataTypes() {
        try {
            String line = bufferedReader.readLine();
            dataTypes = line.split("\\t");

            for (int i = 0; i < dataTypes.length; i++) {
                dataTypes[i] = dataTypes[i].toLowerCase();
            }

        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void readFileAndWriteToJson(JsonWriter jsonWriter) {
        String line;
        try {
            TSVInstance dataInstance = new TSVInstance();
            int lineNumber = 0;
            while ((line = bufferedReader.readLine()) != null) {
                if (lineNumber > 0) {
                    jsonWriter.prepareWriteNewLineToJsonFile();
                }
                String[] dataElements = line.split("\\t");

                dataInstance.resetTSVInstance();
                for (int i = 0; i < dataElements.length; i++) {
                    dataInstance.addElement(dataTypes[i], dataElements[i]);
                }
                dataInstance.setId(lineNumber);

                jsonWriter.writeLineToJsonFile(dataInstance);
                //System.out.println(line);
                ++lineNumber;
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void readFileAndWriteToCSV(CSVWriter csvWriter) {
        String line;
        try {
            TSVInstance dataInstance = new TSVInstance();
            int lineNumber = 0;
            csvWriter.writeFirstLine(dataTypes);
            while ((line = bufferedReader.readLine()) != null && lineNumber < 1000) {
                String[] dataElements = line.split("\\t");
                dataInstance.resetTSVInstance();
                for (int i = 0; i < dataElements.length; i++) {
                    dataInstance.addElement(dataTypes[i], dataElements[i]);
                }
                dataInstance.setId(lineNumber);
                csvWriter.writeLineToCSVFile(dataInstance);
                ++lineNumber;
            }
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
