package de.gtarc.auvegos.embeddedwebagent.webserver.utils;

import org.json.JSONException;
import org.json.JSONObject;


public abstract class JSONParser {

	protected JSONObject jObj = null;
	protected String json = "";
	
	public JSONParser() {
		// TODO Auto-generated constructor stub
	}

	public JSONParser(String data) {
		getJSON(data);
	}

	/**
	 * 
	 * @param data JSON string to be saved in instance {@link json} and used to 
	 * 				initiate {@link jObj}. 
	 * @return the jObj.
	 */
	public JSONObject getJSON(String data) {
		json = data;
		
		// try parse the string to a JSON object
        try {
            jObj = new JSONObject(json);
        } catch (JSONException e) {
            System.err.println("JSON Parser" + "Error parsing data " + e.toString());
        }
 
        // return JSON String
        return jObj;
	}
	
	public JSONObject getJSONObject() {
		return jObj;
	}
	
	/**
	 * Subclasses implements parse() to convert jObj to an appropriate Object. 
	 * @return A useful Object.
	 * @throws JSONException
	 */
	public abstract Object parse() throws JSONException;
}