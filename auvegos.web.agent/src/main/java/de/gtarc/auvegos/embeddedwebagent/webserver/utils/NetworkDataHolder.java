package de.gtarc.auvegos.embeddedwebagent.webserver.utils;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import de.dailab.acs.model.layer.Network;
import de.dailab.acs.security.api.cpe.CPE;
import de.dailab.acs.security.api.util.StatProvider;
import de.dailab.acs.security.network.Appliance;
import de.dailab.acs.security.nvd.CVE;
import de.dailab.auvegos.agents.facts.NetworkInfo;

public class NetworkDataHolder {

	// Data instances 
	public static final int MAX_ELEM_NUM = 5;
	// JSON Node names
	public static final String TAG_TIMESTAMP= "timestamp";
	//
	public static final String TAG_STATISTICS = "statistics";
	//
	public static final String TAG_VULNERABILITIES = "vulnerabilites";
	public static final String TAG_HOSTS = "hosts";
	public static final String TAG_SOFTWARES = "softwares";
	//
	public static final String TAG_HOST_NAME = "hostName";
	public static final String TAG_HOST_DESCRIPTION = "hostDescription";
	public static final String TAG_HOST_RISK_INDEX = "hostRiskIndex";
	public static final String TAG_HOST_NUM_VULNERABILITIES = "hostNumVulns";

	private static final String TAG_STAT_OVERALL_RISK = "statisticOverallRisk";
	private static final String TAG_STAT_NUM_HOSTS = "statisticNumHosts";
	private static final String TAG_STAT_NUM_PRODUCT_INSTANCES = "statisticNumProdInstances";
	private static final String TAG_STAT_NUM_PRODUCT_UNIQUE = "statisticNumProdUnique";
	private static final String TAG_STAT_NUM_VULNERABILITIES_INSTANCES = "statisticNumVulnsInstances";
	private static final String TAG_STAT_NUM_VULNERABILITIES_UNIQUE = "statisticNumVulnsUnique";

	public static final String TAG_CVE_NAME = "cveName";
	public static final String TAG_CVE_DESCRIPTION = "cveDescription";
	public static final String TAG_CVE_RELEASE_DATE = "cveReleaseDate";
	public static final String TAG_CVE_LAST_REVISED = "cveLastRevised";
	public static final String TAG_CVE_VULN_PRODUCTS = "cveVulnProducts";
	public static final String TAG_CVE_NUM_AFFECTED_HOSTS = "cveNumAffectedHosts";

	public static final String TAG_CPE_PRODUCT = "cpeProduct";
	public static final String TAG_CPE_DESCRIPTION = "cpeDescription";
	public static final String TAG_CPE_VENDOR = "cpeVendor";
	public static final String TAG_CPE_PART = "cpePart";
	public static final String TAG_CPE_VERSIONS = "cpeVersions";
	public static final String TAG_CPE_VERSION = "version";
	public static final String TAG_CPE_UPDATE = "update";
	public static final String TAG_CPE_EDITION = "edition";
	public static final String TAG_CPE_LANGUAGE = "language";
	public static final String TAG_CPE_SW_EDITION = "swEdition";
	public static final String TAG_CPE_OTHER = "other";
	public static final String TAG_CPE_NUM_VULNERABILITIES = "cpeNumVulns";

	// Class instances
	private StatProvider statProvider;

	JSONObject root = new JSONObject(); // Json object holding data

	public Set<CveDataObject> cveDataSet = new HashSet<CveDataObject>();
	public Set<HostDataObject> hostDataSet = new HashSet<HostDataObject>();
	public Set<CpeDataObject> cpeDataSet = new HashSet<CpeDataObject>();
	private int totalHostsNum;
	private int totalProductsNum;
	private int totalVulnerabilityNum;
	private NetworkInfo networkInfo;

	
	
	public NetworkDataHolder(NetworkInfo networkInfo) {
		Network network = null;
		if (networkInfo != null) {
			/* TODO NPE if Scanning job not finished, or no network data at MonitoringAgent.
			at de.dailab.acs.security.api.util.SecurityModelUtil.getContainedVulnProvider(SecurityModelUtil.java:380)
			at de.dailab.acs.security.api.util.StatProvider.<init>(StatProvider.java:41)
			at de.gtarc.auvegos.embeddedwebagent.webserver.utils.NetworkDataHolder.<init>(NetworkDataHolder.java:65)
			*/
			this.networkInfo = networkInfo;
			if (networkInfo.getSerializedNetwork() != null) {
				network = networkInfo
						.getSerializedNetwork()
						.getContent();
			} else {
				network = null;
			}
		}

		if (network != null) {
			this.statProvider = new StatProvider(network);
			initializeJSONObj();
		} else {
			this.root = new JSONObject();
			root.accumulate("INFO", "NO DATA");
		}
	}

	public NetworkDataHolder(Network networkData) {
		if (networkData != null) {
			// dummy Network Info object to get timestamp
			this.networkInfo = new NetworkInfo();
			networkInfo.setTimestamp(new Date());

			this.statProvider = new StatProvider(networkData);
			initializeJSONObj();
		} else {
			this.root = new JSONObject();
			root.accumulate("INFO", "NO DATA");
		}
	}

	private void initializeJSONObj() {
		JSONArray jArr;	
		JSONObject jObj;	

		if (this.statProvider == null) {
			throw new NullPointerException(StatProvider.class + "not initialized");
		}
		
		this.totalHostsNum = statProvider.totalHosts();
		this.totalProductsNum = statProvider.totalProducts(true);
		this.totalVulnerabilityNum = statProvider.totalVulnerabilities(true);
		
		// init root json data
		this.root = new JSONObject();
		
		// Add statistics, summary
		jObj = new JSONObject();
		jObj.accumulate(TAG_TIMESTAMP, networkInfo.getTimestamp().toString());
		jObj.accumulate(TAG_STAT_OVERALL_RISK, statProvider.overallRisk());
		jObj.accumulate(TAG_STAT_NUM_HOSTS, statProvider.totalHosts());
		jObj.accumulate(TAG_STAT_NUM_PRODUCT_INSTANCES, statProvider.totalProducts(true));
		jObj.accumulate(TAG_STAT_NUM_PRODUCT_UNIQUE, statProvider.totalProducts(false));
		jObj.accumulate(TAG_STAT_NUM_VULNERABILITIES_INSTANCES, statProvider.totalVulnerabilities(true));
		jObj.accumulate(TAG_STAT_NUM_VULNERABILITIES_UNIQUE, statProvider.totalVulnerabilities(false));

		root.accumulate(TAG_STATISTICS, jObj);
		
		// Create Json object from vulnerabilitesList and append to data holder.
		jArr = new JSONArray();
		for ( CVE item: statProvider.mostCriticalVulns(MAX_ELEM_NUM)) {
			CveDataObject cveDO = new CveDataObject(item); 
			this.cveDataSet.add(cveDO);
			jArr.put(cveDO.toJSONObject());
		}
		root.accumulate(TAG_VULNERABILITIES, jArr);

		// Create Json object from hostList and append to data holder.
		jArr = new JSONArray();
		for ( Appliance item: statProvider.mostVulnerableHosts(MAX_ELEM_NUM)) {
			HostDataObject hostDO = new HostDataObject(item); 
			this.hostDataSet.add(hostDO);
			jArr.put(hostDO.toJSONObject());
		}
		root.accumulate(TAG_HOSTS, jArr);

		// Create Json object from vulnerabilitesList and append to root object.
		jArr = new JSONArray();
		for ( CPE item: statProvider.mostVulnerableSoftware(MAX_ELEM_NUM)) {
			CpeDataObject cpeDO = new CpeDataObject(item); 
			this.cpeDataSet.add(cpeDO);
			jArr.put(cpeDO.toJSONObject());
		}
		root.accumulate(TAG_SOFTWARES, jArr);
		
		// what else?
	}

	public String getJSONString() {
		return root.toString();
	}

	/** 
	 * Data Elements 
	 * 
	 */
	class CveDataObject {
		private JSONObject jObj;
		private CVE cve;

		public CveDataObject(CVE cve) {
			this.cve = cve;
		}

		public JSONObject toJSONObject() {
			this.jObj = new JSONObject();
			JSONArray jArr = new JSONArray();

			jObj.accumulate(TAG_CVE_NAME, cve.getName());
			jObj.accumulate(TAG_CVE_DESCRIPTION, cve.getDescription());
			jObj.accumulate(TAG_CVE_RELEASE_DATE, cve.getReleaseDate());
			jObj.accumulate(TAG_CVE_LAST_REVISED, cve.getLastRevised());

			for ( CPE item: cve.getVulnerableProducts()) {
				CpeDataObject cpeDO = new CpeDataObject(item); 
				jArr.put(cpeDO.toJSONObject());
			}
			jObj.accumulate(TAG_CVE_VULN_PRODUCTS, jArr);

			jObj.accumulate(TAG_CVE_NUM_AFFECTED_HOSTS, statProvider.noOfAffectedHosts(cve));

			return jObj;
		}
		
	}

	//
	class HostDataObject {
		private Appliance host;
		private JSONObject jObj;

		public HostDataObject(Appliance host) {
			this.host = host;
		}

		public JSONObject toJSONObject() {
			this.jObj = new JSONObject();

			jObj.accumulate(TAG_HOST_NAME, host.getName());
			jObj.accumulate(TAG_HOST_DESCRIPTION, host.getDescription());
			jObj.accumulate(TAG_HOST_RISK_INDEX, statProvider.riskIndex(host));
			jObj.accumulate(TAG_HOST_NUM_VULNERABILITIES, statProvider.noVulnerabilities(host));
			//jObj.accumulate(TAG_HOST_, host.);

			return jObj;
			
		}
		
	}

	//	
	/**
	 * Creates a CPE according to the corresponding attributes.
	 * <p>
	 * Any String value maybe {@code null}
	 * 
	 * sell {@link CPEFactory}
	 * 
	 * @param part enum-constant representing the part component
	 * @param vendor string representing the vendor component
	 * @param product string representing the product component
	 * @param version string representing the version component
	 * @param update string representing the update component
	 * @param edition string representing the edition component
	 * @param language string representing the language component
	 * @param sw_edition string representing the sw_edition component
	 * @param target_sw string representing the target_sw component
	 * @param target_hw string representing the target_hw component
	 * @param other string representing the other component
	 */ 
	class CpeDataObject {
		private CPE cpe;
		private JSONObject jObj;

		public CpeDataObject(CPE cpe) {
			this.cpe = cpe;
		}

		public JSONObject toJSONObject() {
			// TODO Auto-generated method stub
			this.jObj = new JSONObject();

			jObj.accumulate(TAG_CPE_PART, cpe.getPart());
			jObj.accumulate(TAG_CPE_VENDOR, cpe.getVendor());
			jObj.accumulate(TAG_CPE_PRODUCT, cpe.getProduct());
			jObj.accumulate(TAG_CPE_VERSION, cpe.getVersion());
			jObj.accumulate(TAG_CPE_UPDATE, cpe.getUpdate());
			jObj.accumulate(TAG_CPE_EDITION, cpe.getEdition());
			jObj.accumulate(TAG_CPE_LANGUAGE, cpe.getLanguage());
			jObj.accumulate(TAG_CPE_SW_EDITION, cpe.getSw_edition());
			jObj.accumulate(TAG_CPE_OTHER, cpe.getOther());

			jObj.accumulate(TAG_CPE_DESCRIPTION, cpe.getVendor());
			jObj.accumulate(TAG_CPE_NUM_VULNERABILITIES, statProvider.noVulnerabilities(cpe));

			return jObj;
		}
		
	}
}
