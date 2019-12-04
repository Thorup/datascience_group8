import java.util.LinkedHashMap;
import java.util.Map;

public class TSVInstance {
    Map<String, String> data;
    int id;

    public TSVInstance() {
        data = new LinkedHashMap<>();
    }

    public void addElement(String key, String value) {
        this.data.put(key, value);
    }

    public Map<String, String> getDataMap() {
        return this.data;
    }

    public void resetTSVInstance() {
        data.clear();
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return this.id;
    }
}