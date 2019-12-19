package dk.klevang;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import org.apache.commons.math3.stat.regression.SimpleRegression;

import java.io.*;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class DatasetProcessor
{
    private Scanner scanner;
    private File tsvFile;
    private FileWriter writer;

    public DatasetProcessor() throws FileNotFoundException
    {
    }

    public void concatStateAndCountyValues() throws IOException
    {
        tsvFile = new File("CountyTSV.tsv");
        writer = new FileWriter(tsvFile);
        scanner.nextLine();

        int firstAcc = 0;
        int secondAcc = 0;
        int thirdAcc = 0;
        int fourthAcc = 0;

        String countyId = "1";
        String stateId = "1";
        String stateName = "";
        String cityName = "";


        while (scanner.hasNext())
        {
            String[] row = scanner.nextLine().split(";");

            if (row[4].contentEquals("0"))
            {
                if (countyId.contentEquals(row[1]))
                {
                    System.out.println(Arrays.toString(row));
                    firstAcc += (row[6].contentEquals("") ? 0 : Integer.parseInt(row[6]));
                    secondAcc += (row[7].contentEquals("") ? 0 : Integer.parseInt(row[7]));
                    thirdAcc += (row[8].contentEquals("") ? 0 : Integer.parseInt(row[8]));
                    fourthAcc += (row[9].contentEquals("") ? 0 : Integer.parseInt(row[9]));

                    stateId = row[0];
                    countyId = row[1];
                    stateName = row[2];
                    cityName = row[3];
                }
                else
                {
                    String output = stateId + "\t" + countyId + "\t" + stateName + "\t" + cityName + "\t" + firstAcc + "\t" + secondAcc + "\t" + thirdAcc + "\t" + fourthAcc + "\n";
                    writer.write(output);
                    writer.flush();

                    firstAcc = Integer.parseInt(row[6]);
                    secondAcc = Integer.parseInt(row[7]);
                    thirdAcc = Integer.parseInt(row[8]);
                    fourthAcc = Integer.parseInt(row[9]);

                    stateId = row[0];
                    countyId = row[1];
                    stateName = row[2];
                    cityName = row[3];
                }
            }
        }
        writer.close();
    }

    public void shrinkLocationFile() throws IOException
    {
        tsvFile = new File("CountyLocationsTSV.tsv");
        writer = new FileWriter(tsvFile);

        while (scanner.hasNext())
        {
            String[] row = scanner.nextLine().split(";");
            int fips = Integer.parseInt(row[1].substring(row[1].length() - 3));
            row[1] = fips + "";

            String output = row[0] + "\t" + row[1] + "\t" + row[2] + "\t" + row[3] + "\t" + row[4] + "\t" + row[5] + "\n";
            writer.write(output);
        }
        writer.flush();
        writer.close();
    }

    public void removeCommasFromCoordinate() throws IOException
    {
        tsvFile = new File("CountyLocationsTSV.tsv");
        writer = new FileWriter(tsvFile);

        while (scanner.hasNext())
        {
            String[] row = scanner.nextLine().split("\t");
            // lat og long i row[3] og row[4]
            // fips er row[5]

            if (containsTwoCommas(row[3]))
            {
                row[3] = removeComma(row[3]);

            }
            if (containsTwoCommas(row[4]))
            {
                row[4] = removeComma(row[4]);
            }

            String outout = row[0] + "\t" + row[5] + "\t" + row[1] + "\t" + row[2] + "\t" + row[3] + "\t" + row[4] + "\n";
            writer.write(outout);
        }
        writer.flush();
        writer.close();

    }

    private String removeComma(String row)
    {
        int commasFound = 0;
        for (int i = 0; i < row.length(); i++)
        {
            if (row.charAt(i) == '.')
            {
                commasFound++;
                if (commasFound == 2)
                {
                    String firstPart = row.substring(0, i);
                    String secondPart = row.substring(i + 1);
                    return firstPart + secondPart;
                }
            }
        }
        return null;
    }

    private boolean containsTwoCommas(String s)
    {
        int counter = 0;
        for (char c : s.toCharArray())
        {
            if (c == '.')
            {
                counter++;
            }
        }
        return counter > 1;
    }

    public void addPopulationToTSVFile() throws IOException
    {
        tsvFile = new File("output.tsv");
        writer = new FileWriter(tsvFile);

        HashMap<Integer, String> fipsMap = mapFipsToPop();
        scanner = new Scanner(new File("CountyLocationsTSV.tsv"));

        while (scanner.hasNext())
        {
            String[] row = scanner.nextLine().split("\t");
            int fips = 0;
            try
            {
                fips = Integer.parseInt(row[1]);
            } catch (Exception e)
            {
                System.out.println(Arrays.toString(row));
            }

            String pop = fipsMap.getOrDefault(fips, "-100");

            String output = row[0] + "\t" + row[1] + "\t" + row[2] + "\t" + row[3] + "\t" + row[4] + "\t" + row[5] + "\t" + pop;
            writer.write(output);
        }
        writer.flush();
        writer.close();
    }

    private HashMap<Integer, String> mapFipsToPop() throws FileNotFoundException
    {
        File fileToMapFrom = new File("CountyTSV.tsv");
        HashMap<Integer, String> map = new HashMap<>();
        scanner = new Scanner(fileToMapFrom);

        while (scanner.hasNext())
        {
            String[] row = scanner.nextLine().split("\t");
            int fips = Integer.parseInt(row[0] + row[1]);
            String popStats = row[4] + "\t" + row[5] + "\t" + row[6] + "\t" + row[7] + "\n";
            map.put(fips, popStats);
        }

        return map;
    }

    public void combinePopulationDataWithStatistics() throws IOException
    {
        File file = new File("state_yearly.tsv");
        File file2 = new File("state_population.tsv");
        File out = new File("state_yearly_full.tsv");

        Scanner stateYearly = new Scanner(file);
        //Scanner statePop = new Scanner(file2);

        FileWriter bigFileWriter = new FileWriter(out);
        //statePop.nextLine();
        stateYearly.nextLine();
        bigFileWriter.write("State\tState_Abr\tOpioid_Factor\tCrime_Percent\tHomeless_Percent\tAverage_Income\tUnemployment_Percent\tPopulation\tYear\n");

        while (stateYearly.hasNext())
        {
            String[] row = stateYearly.nextLine().split("\t");
            System.out.println(Arrays.toString(row));
            String stateAbr = row[0];
            String opFactor = row[1];
            String year = row[2];

            Scanner statePop = new Scanner(file2);
            statePop.nextLine();

            while (statePop.hasNext())
            {
                String[] rowPop = statePop.nextLine().split("\t");
                //System.out.println(rowPop[1] + " - " + stateAbr);
                if (rowPop[1].toLowerCase().equals(stateAbr.toLowerCase()) && year.equals(rowPop[2]))
                {
                    System.out.println("Match");
                    String outout = rowPop[0] + "\t" + row[0].toUpperCase() + "\t" + opFactor + "\t" + rowPop[9] + "\t" + rowPop[8] + "\t" + rowPop[6] + "\t" + rowPop[7] + "\t" + rowPop[3] + "\t" + year + "\n";
                    bigFileWriter.write(outout);
                    break;
                }
            }
        }
        bigFileWriter.flush();
        bigFileWriter.close();
    }


    public void addMonthlyOpioidFactorData() throws IOException
    {
        HashMap<String, String> monthMap = new HashMap<>();
        monthMap.put("1", "Jan");
        monthMap.put("2", "Feb");
        monthMap.put("3", "Mar");
        monthMap.put("4", "Apr");
        monthMap.put("5", "May");
        monthMap.put("6", "Jun");
        monthMap.put("7", "Jul");
        monthMap.put("8", "Aug");
        monthMap.put("9", "Sep");
        monthMap.put("10", "Okt");
        monthMap.put("11", "Nov");
        monthMap.put("12", "Dec");

        Gson gson = new GsonBuilder().setPrettyPrinting().create();
        JsonReader reader = new JsonReader(new FileReader("fips_monthly.json"));
        Entry[] data = gson.fromJson(reader, Entry[].class);

        File fipsFile = new File("getfipsmaphere.tsv");
        Scanner fipsScanner = new Scanner(fipsFile);

        Map<String, Integer> fipsMapper = new HashMap<>();

        while (fipsScanner.hasNext())
        {
            String[] row = fipsScanner.nextLine().split("\t");
            String fipsOne = row[7];
            String fipsTwo = row[8];
            int newFancyFipsThing = createNewFips(fipsOne, fipsTwo);
            fipsMapper.put(fipsOne + fipsTwo, newFancyFipsThing);
        }

        for (int i = 0; i < data.length; i++)
        {
            int newFips = fipsMapper.getOrDefault(data[i].getFips() + "", -100);
            data[i].setFips(newFips);
        }

        File countyFile = new File("new_county_pop.tsv");
        for (int i = 0; i < data.length; i++)
        {
            Scanner myScanner = new Scanner(countyFile);
            myScanner.nextLine();
            while (myScanner.hasNext())
            {
                String[] row = myScanner.nextLine().split("\t");
                String fipsOne = row[0];
                String fipsTwo = row[1];
                if (data[i].getFips() == createNewFips(fipsOne, fipsTwo))
                {
                    HashMap<Integer, Integer> fipsPopMap = new HashMap<>();
                    fipsPopMap.put(2007, Integer.parseInt(row[4]));
                    fipsPopMap.put(2008, Integer.parseInt(row[5]));
                    fipsPopMap.put(2009, Integer.parseInt(row[6]));
                    fipsPopMap.put(2010, Integer.parseInt(row[7]));
                    fipsPopMap.put(2011, Integer.parseInt(row[8]));
                    fipsPopMap.put(2012, Integer.parseInt(row[9]));


                    double newDrugFactor = new Float(data[i].getOpioid_factor()) / fipsPopMap.getOrDefault(data[i].getYear(), 0);
                    data[i].setOpioid_factor(newDrugFactor + "");

                    data[i].setMonth(monthMap.get(data[i].getMonth()));
                    break;
                }
            }
        }
        FileWriter writer = new FileWriter("output.json");
        gson.toJson(data, writer);
        writer.flush();
        writer.close();
    }


    private int createNewFips(String one, String two)
    {
        StringBuilder builder = new StringBuilder();
        builder.append(one);

        for (int i = 0; i < 3 - two.length(); i++)
        {
            builder.append("0");
        }
        builder.append(two);
        return Integer.parseInt(builder.toString());
    }


    public void createNewCountyPopValues() throws IOException
    {
        File file = new File("real_pop_county.tsv");
        Scanner cScanner = new Scanner(file);
        FileWriter writer = new FileWriter("new_county_pop.tsv");
        cScanner.nextLine();
        writer.write("state_id\tFIPS\tstate\tcounty\tpop_2007\tpop_2008\tpop_2009\tpop_2010\tpop_2011\tpop_2012\n");

        while (cScanner.hasNext())
        {
            String[] row = cScanner.nextLine().split("\t");

            SimpleRegression reg = new SimpleRegression();
            reg.addData(0, new Double(row[4]));
            reg.addData(1, new Double(row[5]));
            reg.addData(2, new Double(row[6]));
            reg.addData(3, new Double(row[7]));
            double slope = reg.getSlope();
            double intercept = reg.getIntercept();

            int year2011 = (int) (slope * 4 + intercept);
            int year2012 = (int) (slope * 5 + intercept);
            writer.write(row[0] + "\t" + row[1] + "\t" + row[2] + "\t" + row[3] + "\t" + row[4] + "\t" + row[5] + "\t" + row[6] + "\t" + row[7] + "\t" + year2011 + "\t" + year2012 + "\n");

        }
        writer.flush();
        writer.close();
    }


    public void removeAccumulatedStatePopulationValue() throws IOException
    {
        File file = new File("correct_pop.tsv");
        Scanner cScanner = new Scanner(file);
        FileWriter writer = new FileWriter("real_pop_county.tsv");
        writer.write(cScanner.nextLine() + "\n");

        while (cScanner.hasNext())
        {
            String[] row = cScanner.nextLine().split("\t");
            if (!row[1].equals("0"))
            {
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < row.length - 1; i++)
                {
                    builder.append(row[i]).append("\t");
                }
                builder.append(row[row.length - 1]).append("\n");
                writer.write(builder.toString());
            }
        }
        writer.flush();
        writer.close();
    }

}

