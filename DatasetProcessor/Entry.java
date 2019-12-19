package dk.klevang;

public class Entry
{
    private int fips;
    private String month;
    private int year;
    private String opioid_factor;

    public int getFips()
    {
        return fips;
    }

    public void setFips(int fips)
    {
        this.fips = fips;
    }

    public String getMonth()
    {
        return month;
    }

    public void setMonth(String month)
    {
        this.month = month;
    }

    public int getYear()
    {
        return year;
    }

    public void setYear(int year)
    {
        this.year = year;
    }

    public String getOpioid_factor()
    {
        return opioid_factor;
    }

    public void setOpioid_factor(String opioid_factor)
    {
        this.opioid_factor = opioid_factor;
    }
}
