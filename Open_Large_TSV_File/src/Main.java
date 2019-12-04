public class Main {
    public static void main(String[] args) {
        ReadTSVFile fileReader = new ReadTSVFile();
        JsonWriter jsonWriter = new JsonWriter();
        CSVWriter csvWriter = new CSVWriter();
        SQLWriter sqlWriter = new SQLWriter();

        //jsonWriter.startJSon();
        //fileReader.readFileAndWriteToJson(jsonWriter);
        //jsonWriter.closeJSon();
        //jsonWriter.closeFileWriter();

        //fileReader.readFileAndWriteToSQL(sqlWriter);
        //sqlWriter.closeFileWriter();

        fileReader.readFileAndWriteToCSV(csvWriter);
        csvWriter.closeFileWriter();
    }
}
