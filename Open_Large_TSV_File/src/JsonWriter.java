import java.io.*;

public class JsonWriter {
    private String outputFilename = "C:\\Users\\2rup\\Downloads\\pain-pills-in-the-usa\\arcos_all_washpost.json";
    private FileWriter fileWriter;

    public JsonWriter() {
        try {
            fileWriter = new FileWriter(outputFilename);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void startJSon() {
        try {
            fileWriter.write("{\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void closeJSon() {
        try {
            fileWriter.write("\n}");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void writeLineToJsonFile(TSVInstance dataInstance) {
        try {
            String jsonObject;
            jsonObject = "\"" + "data_" + dataInstance.getId() + "\"" + ":" + "{";
            String[] dataKeyArray = new String[dataInstance.getDataMap().size()];
            dataInstance.getDataMap().keySet().toArray(dataKeyArray);
            for (int i = 0; i < dataKeyArray.length; i++) {
                String dataKey = dataKeyArray[i];
                String dataValue = dataInstance.getDataMap().get(dataKey);
                if (i == dataKeyArray.length - 1) {
                    jsonObject = jsonObject + "\"" + dataKey + "\"" + ":" + "\"" + dataValue + "\"";
                } else {
                    jsonObject = jsonObject + "\"" + dataKey + "\"" + ":" + "\"" + dataValue + "\"" + ",";
                }
            }
            jsonObject = jsonObject + "}";
            fileWriter.write(jsonObject);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    public void prepareWriteNewLineToJsonFile() {
        try {
            fileWriter.write(",\n");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void closeFileWriter() {
        try {
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
