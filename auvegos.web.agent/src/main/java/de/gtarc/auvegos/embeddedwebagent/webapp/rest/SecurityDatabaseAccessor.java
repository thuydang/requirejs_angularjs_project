package de.gtarc.auvegos.embeddedwebagent.webapp.rest;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;

import org.eclipse.core.runtime.Platform;
import org.eclipse.emf.common.util.URI;
import org.glassfish.jersey.server.internal.routing.Router;
import org.json.JSONArray;
import org.json.JSONObject;
import org.osgi.framework.Bundle;

import de.dailab.acs.alert.log.model.DNS;
import de.dailab.acs.attack.utils.network.NetworkUtils;
import de.dailab.acs.attack.utils.network.NetworkUtils.IPLayerSoftwareInformation;
import de.dailab.acs.core.resources.ResourceManager;
import de.dailab.acs.model.alert.AttackScenario;
import de.dailab.acs.model.alert.IntrusionAlert;
import de.dailab.acs.model.alert.NormalizedLog;
import de.dailab.acs.model.attackgraph.AttackGraph;
import de.dailab.acs.model.attackgraph.AttackGraphComponent;
import de.dailab.acs.model.attackgraph.AttackGraphLink;
import de.dailab.acs.model.attackgraph.HostAttackGraph;
import de.dailab.acs.model.attackgraph.InformationSourceUsage;
import de.dailab.acs.model.attackgraph.Privilege;
import de.dailab.acs.model.attackgraph.PrivilegeConjunction;
import de.dailab.acs.model.attackgraph.SubAttackGraph;
import de.dailab.acs.model.attackgraph.VulnerabilityExploit;
import de.dailab.acs.model.attackgraph.impl.AttackGraphImpl;
import de.dailab.acs.model.layer.Network;
import de.dailab.acs.model.malware.Malware;
import de.dailab.acs.model.malware.MalwareComponent;
import de.dailab.acs.network.log.model.NetworkFlow;
import de.dailab.acs.security.network.Access;
import de.dailab.acs.security.network.Appliance;
import de.dailab.acs.security.network.Installation;
import de.dailab.acs.security.network.SecurityLayer;
import de.dailab.acs.vulnerability.prepostcondition.database.DatabaseManager;
import de.dailab.acs.vulnerability.prepostcondition.nvd.items.Vulnerability;
import de.dailab.nessi.model.Device;
import de.dailab.nessi.model.IPNetworkLayer;
import de.dailab.nessi.model.IPNode;
import de.dailab.nessi.model.Link;
import de.dailab.nessi.model.NetworkInterface;
import de.dailab.nessi.model.Subnet;
import de.dailab.nessi.model.Switch;
import de.gtarc.auvegos.embeddedwebagent.webapp.servlet.SecurityManagerServlet;

/**
 * Fetches data from CVE database and mongo db and forms the json objects from this data as required by the web visualization
 * 
 * @author kaynar, toepfer, ozduman
 *
 */
@Path("/")
public class SecurityDatabaseAccessor {

	protected @Context HttpServletRequest request;
	
	@Path("/dns/hostAddresses")
	@POST
	@Produces("application/json")
	public String queryDNSData() {
		ServletContext securityServletContext = request.getServletContext();
		if(securityServletContext!=null)
		{
			Collection<DNS> dnsData  = (Collection<DNS>) securityServletContext.getAttribute(SecurityManagerServlet.DNS_DATA_ATTR);
			JSONArray dnsDataJson =new JSONArray();
			for (DNS dns : dnsData) {
				JSONObject dnsJSON = new JSONObject();
				dnsJSON.put("Domain", dns.getDomain().getSLDandTLD());
				dnsJSON.put("Subdomains", dns.getDomain().getSubDomains().toString());
				dnsJSON.put("Age", dns.getDomainAge());
				dnsJSON.put("Addresses", dns.getResponseAddresses().toString());
				dnsJSON.put("ASN", dns.getASNs().toString());
				dnsJSON.put("Count", dns.getDnsQueries().size());
				dnsJSON.put("Failed", dns.getFailureCount());
				dnsJSON.put("TTL", dns.getAvgTTL());
				dnsJSON.put("Class", dns.getPrediction().toString());
				dnsDataJson.put(dnsJSON);
			}
			return dnsDataJson.toString();
		}
		return "";
	}
	
	@Path("/logs/hostAddresses")
	@POST
	@Produces("application/json")
	@Consumes("application/json")
	public String queryLogs(String hostAddresses) { 
		JSONArray resultJSONArray=new JSONArray();
		ServletContext securityServletContext = request.getServletContext();
		if(securityServletContext!=null)
		{
			JSONArray hostAddressesJSONArray = new JSONArray(hostAddresses);
			List<NormalizedLog> hostLogs = new ArrayList<NormalizedLog>();
			ConcurrentHashMap<String, List<NormalizedLog>> normalizedLogsMappedByHostIp  = (ConcurrentHashMap<String, List<NormalizedLog>>) securityServletContext.getAttribute(SecurityManagerServlet.LOGS_ATTR);
			Iterator<Object> iter = hostAddressesJSONArray.iterator();
			while(iter.hasNext())
			{
				Object iterObject = iter.next();
				JSONObject hostAddressJSON = (JSONObject) iterObject;
				String hostAddress = hostAddressJSON.getString("address");
				List<NormalizedLog> ipLogs = normalizedLogsMappedByHostIp.get(hostAddress);
				if(ipLogs!=null)
				{
					hostLogs.addAll(ipLogs);
				}
			}
			Map<String,Integer> benignLogCounts = new HashMap<String,Integer>();
			Map<String,Integer> maliciousLogCounts = new HashMap<String,Integer>();
			JSONArray logsJSONArray=new JSONArray();
			for(NormalizedLog log:hostLogs)
			{
				JSONObject logJSON = new JSONObject();
				logJSON.put("Ip", log.getSourceIP());
				logJSON.put("Application", log.getSourceApplicationPath());
				logJSON.put("Operation", log.getRequestOperationCode());
				logJSON.put("Entity", log.getRequestEntityPath());
				logJSON.put("Time", log.getLogTimestamp());
				logsJSONArray.put(logJSON);

				//Form log statistical data
				String logSourceApplication = log.getSourceApplicationPath();//new Long((long) (log.getLogTimestamp()/*/1000.0*/)).toString();
				if(!((logSourceApplication==null) ||(logSourceApplication.equals(""))))
				{
					Integer logCount = null;
					boolean benign = ((log.getMaliciousActivityName()==null) || (log.getMaliciousActivityName().equals(""))|| (log.getMaliciousActivityName().equalsIgnoreCase("benign")));
					if(benign)
					{
						logCount = benignLogCounts.get(logSourceApplication);
						if(logCount==null)
						{
							benignLogCounts.put(logSourceApplication, 1);
						}else
						{
							benignLogCounts.put(logSourceApplication, ++logCount);
						}
					}else
					{
						logCount = maliciousLogCounts.get(logSourceApplication);
						if(logCount==null)
						{
							maliciousLogCounts.put(logSourceApplication, 1);
						}else
						{
							maliciousLogCounts.put(logSourceApplication, ++logCount);
						} 
					}
				}
			}
			JSONArray logsStatisticsDataJSONArray=new JSONArray();
			JSONObject logsAppsObject = new JSONObject();
			JSONArray logsAppsValuesObject = new JSONArray();
			logsAppsObject.put("key", "Application Logs");
			logsAppsObject.put("values", logsAppsValuesObject);
			if(!benignLogCounts.isEmpty())
			{
				for(Entry<String,Integer> benignLogTime:benignLogCounts.entrySet())
				{
					JSONObject logCountsAtTime = new JSONObject();
					logCountsAtTime.put("x",benignLogTime.getKey());
					logCountsAtTime.put("y",benignLogTime.getValue());
					logCountsAtTime.put("label","Benign");
					logsAppsValuesObject.put(logCountsAtTime);
				}
			}
			if(!maliciousLogCounts.isEmpty())
			{
				for(Entry<String,Integer> maliciousLogTime:maliciousLogCounts.entrySet())
				{
					JSONObject logCountsAtTime = new JSONObject();
					logCountsAtTime.put("x",maliciousLogTime.getKey());
					logCountsAtTime.put("y",maliciousLogTime.getValue());
					logCountsAtTime.put("label","Malicious");
					logsAppsValuesObject.put(logCountsAtTime);
				}
			}
			logsStatisticsDataJSONArray.put(logsAppsObject);
			resultJSONArray.put(logsJSONArray);
			resultJSONArray.put(logsStatisticsDataJSONArray);
		}
		return resultJSONArray.toString(); 
	}

	@Path("/flows/hostAddresses")
	@POST
	@Produces("application/json")
	@Consumes("application/json")
	public String queryFlows(String hostAddresses) { 
		JSONArray resultJSONArray=new JSONArray();
		ServletContext securityServletContext = request.getServletContext();
		if(securityServletContext!=null)
		{
			List<NetworkFlow> networkFlows = (List<NetworkFlow>) 
					securityServletContext.getAttribute(SecurityManagerServlet.FLOWS_ATTR);
			JSONArray hostAddressesJSONArray = new JSONArray(hostAddresses);
			Iterator<Object> iter = hostAddressesJSONArray.iterator();
			Set<String> hostIps = new HashSet<String>();
			while(iter.hasNext())
			{
				Object iterObject = iter.next();
				JSONObject hostAddressJSON = (JSONObject) iterObject;
				String hostAddress = hostAddressJSON.getString("address");
				hostIps.add(hostAddress);
			}
			Map<String,Integer> benignFlowCounts = new HashMap<String,Integer>();
			Map<String,Integer> maliciousFlowCounts = new HashMap<String,Integer>();
			JSONArray flowsJSONArray=new JSONArray();
			for(NetworkFlow netFlow:networkFlows)
			{
				if(hostIps.contains(netFlow.getSourceIP()))
				{
					JSONObject flowJSON = new JSONObject();
					flowJSON.put("SourceIp", netFlow.getSourceIP());
					flowJSON.put("TargetIp", netFlow.getTargetIP());
					flowJSON.put("SourcePort", netFlow.getSourcePort());
					flowJSON.put("TargetPort", netFlow.getTargetPort());
					flowJSON.put("TransferredBytes", netFlow.getTotalBytesTransferred());
					flowJSON.put("Activity", netFlow.getOrigin());
					flowsJSONArray.put(flowJSON);

					//Form log statistical data
					String flowTargetIp = netFlow.getTargetIP();
					if(!((flowTargetIp==null) ||(flowTargetIp.equals(""))))
					{
						Integer flowCount = null;
						boolean benign = ((netFlow.getOrigin()==null) || (netFlow.getOrigin().equals(""))|| (netFlow.getOrigin().equalsIgnoreCase("benign")));
						if(benign)
						{
							flowCount = benignFlowCounts.get(flowTargetIp);
							if(flowCount==null)
							{
								benignFlowCounts.put(flowTargetIp, 1);
							}else
							{
								benignFlowCounts.put(flowTargetIp, ++flowCount);
							}
						}else
						{
							flowCount = maliciousFlowCounts.get(flowTargetIp);
							if(flowCount==null)
							{
								maliciousFlowCounts.put(flowTargetIp, 1);
							}else
							{
								maliciousFlowCounts.put(flowTargetIp, ++flowCount);
							} 
						}
					}
				}
			}
			JSONArray flowsStatisticsDataJSONArray=new JSONArray();
			JSONObject flowsTargetIpsObject = new JSONObject();
			JSONArray flowsTargetIpsValuesObject = new JSONArray();
			flowsTargetIpsObject.put("key", "Flows Target Ips");
			flowsTargetIpsObject.put("values", flowsTargetIpsValuesObject);
			if(!benignFlowCounts.isEmpty())
			{
				for(Entry<String,Integer> benignFlowTime:benignFlowCounts.entrySet())
				{
					JSONObject flowCountsAtTime = new JSONObject();
					flowCountsAtTime.put("x",benignFlowTime.getKey());
					flowCountsAtTime.put("y",benignFlowTime.getValue());
					flowCountsAtTime.put("label","Benign");
					flowsTargetIpsValuesObject.put(flowCountsAtTime);
				}
			}
			if(!maliciousFlowCounts.isEmpty())
			{
				for(Entry<String,Integer> maliciousFlowTime:maliciousFlowCounts.entrySet())
				{
					JSONObject logCountsAtTime = new JSONObject();
					logCountsAtTime.put("x",maliciousFlowTime.getKey());
					logCountsAtTime.put("y",maliciousFlowTime.getValue());
					logCountsAtTime.put("label","Malicious");
					flowsTargetIpsValuesObject.put(logCountsAtTime);
				}
			}
			flowsStatisticsDataJSONArray.put(flowsTargetIpsObject);
			resultJSONArray.put(flowsJSONArray);
			resultJSONArray.put(flowsStatisticsDataJSONArray);
		}
		return resultJSONArray.toString(); 
	}

	@Path("/attackgraphs/hostAddress")
	@POST
	@Produces("application/json") 
	public String queryAttackGraphStatistics(String attackGraphNamePlusHostAddress) { 
		if(attackGraphNamePlusHostAddress!=null)
		{
			String[] inputStrTokens = attackGraphNamePlusHostAddress.split(":");
			if(inputStrTokens.length>=2)
			{
				AttackGraph attackGraph = loadAttackGraph(inputStrTokens[0]);
				if(attackGraph!=null)
				{
					HostAttackGraph foundHostAttackGraph = null;
					boolean hostAttackGraphFound = false;
					for(SubAttackGraph subAttackGraph:attackGraph.getNodes())
					{
						for(HostAttackGraph hostAttackGraph:subAttackGraph.getHostAttackGraphs())
						{
							if(hostAttackGraph.getAddress().equals(inputStrTokens[1]))
							{
								foundHostAttackGraph = hostAttackGraph;
								hostAttackGraphFound = true;
								break;
							}
						}
						if(hostAttackGraphFound)
						{
							break;
						}
					}
					if(foundHostAttackGraph!=null)
					{
						Map<String,Integer> productsCVECounts = new HashMap<String,Integer>();
						for(AttackGraphComponent attackComponent:foundHostAttackGraph.getAttackComponents())
						{
							String sprodName = attackComponent.getProductName().replaceAll(":\\*", "");
							if (sprodName.length() > 10) {
								sprodName = sprodName.substring(10);
							}
							Integer cveCount = productsCVECounts.get(sprodName);
							if(cveCount==null)
							{
								productsCVECounts.put(sprodName, 1);
							}else
							{
								productsCVECounts.put(sprodName,++cveCount);
							}
						}
						//Form JSON array object for statistical data
						JSONArray attackGraphStatisticsDataJSONArray=new JSONArray();
						JSONObject hostProductsObject = new JSONObject();
						JSONArray hostProductsValuesObject = new JSONArray();
						hostProductsObject.put("key", "Flows Target Ips");
						hostProductsObject.put("values", hostProductsValuesObject);
						if(!productsCVECounts.isEmpty())
						{
							for(Entry<String,Integer> productCVECount:productsCVECounts.entrySet())
							{
								JSONObject cveCountsAtTime = new JSONObject();
								cveCountsAtTime.put("x",productCVECount.getKey());
								cveCountsAtTime.put("y",productCVECount.getValue());
								hostProductsValuesObject.put(cveCountsAtTime);
							}
						}
						attackGraphStatisticsDataJSONArray.put(hostProductsObject);
						return attackGraphStatisticsDataJSONArray.toString();
					}
				}
			}
		}
		return "";
	}

	@Path("/attackgraphs")
	@POST
	@Produces("application/json") 
	public String queryAttackGraphs() { 
		List<AttackGraph> attackGraphs = loadAllAttackGraphs();
		JSONArray allAttackGraphsJsonArray = new JSONArray();
		for(AttackGraph attackGraph:attackGraphs)
		{
			Map<AttackGraphComponent,Integer> attackGraphComponentsIds = new HashMap<AttackGraphComponent,Integer>(); 
			int jsonObjectId = 1;
			JSONObject attackGraphJSON = new JSONObject();
			attackGraphJSON.put("name", attackGraph.getName());
			JSONArray attackGraphComponentsJsonArray = new JSONArray();
			attackGraphJSON.put("data", attackGraphComponentsJsonArray);
			//List<JSONObject> linkObjects = new ArrayList<JSONObject>();
			for(SubAttackGraph subAttackGraph:attackGraph.getNodes())
			{
				for(HostAttackGraph hostAttackGraph:subAttackGraph.getHostAttackGraphs())
				{
					Map<String,Integer> productsIds=new HashMap<String,Integer>();
					JSONObject hostAttackGraphJson = new JSONObject();
					hostAttackGraphJson.put("group", "nodes");
					JSONObject hostAttackGraphDataJson = new JSONObject();
					hostAttackGraphDataJson.put("id", "n"+jsonObjectId);
					int hostAttackGraphId =  jsonObjectId;
					attackGraphComponentsIds.put(hostAttackGraph, jsonObjectId);
					jsonObjectId++;
					hostAttackGraphJson.put("data", hostAttackGraphDataJson);
					hostAttackGraphJson.put("selected", false);
					hostAttackGraphJson.put("selectable", true);
					hostAttackGraphJson.put("locked", false);
					hostAttackGraphJson.put("grabbable", true);
					hostAttackGraphDataJson.put("label", hostAttackGraph.getName());
					hostAttackGraphDataJson.put("address", hostAttackGraph.getAddress());
					hostAttackGraphDataJson.put("type", "HostAttackGraph");
					attackGraphComponentsJsonArray.put(hostAttackGraphJson);
					for(AttackGraphComponent attackComponent:hostAttackGraph.getAttackComponents())
					{
						String productName = null; 
						if(attackComponent instanceof PrivilegeConjunction)
						{
							if(attackComponent.getOutEdges().size()>0)
							{
								productName = attackComponent.getOutEdges().get(0).getTarget().getProductName();
							}
						}else
						{
							productName = attackComponent.getProductName();
						}
						if(productName!=null)
						{
							String sprodName = productName.replaceAll(":\\*", "");
							if (sprodName.length() > 10) {
								sprodName = sprodName.substring(10);
							}
							String product = hostAttackGraph.getName()+"-"+sprodName;
							Integer productId = productsIds.get(product);
							if(productId==null)
							{
								JSONObject productJson = new JSONObject();
								productJson.put("group", "nodes");
								JSONObject productDataJson = new JSONObject();
								productDataJson.put("id","n"+jsonObjectId);
								productDataJson.put("parent","n"+hostAttackGraphId);
								productDataJson.put("label", sprodName);
								productDataJson.put("type", "Product");
								productsIds.put(product, jsonObjectId);
								productId = jsonObjectId;
								jsonObjectId++;
								productJson.put("data", productDataJson);
								productJson.put("selected", false);
								productJson.put("selectable", true);
								productJson.put("locked", false);
								productJson.put("grabbable", true);
								attackGraphComponentsJsonArray.put(productJson);
								//create host attack graph to product link
								//								JSONObject attackGraphLinkJson = new JSONObject();
								//								attackGraphLinkJson.put("group", "edges");
								//								JSONObject attackGraphLinkDataJson = new JSONObject();
								//								attackGraphLinkDataJson.put("id","n"+jsonObjectId);
								//								attackGraphLinkDataJson.put("source","n"+hostAttackGraphId);
								//								attackGraphLinkDataJson.put("target","n"+productId);
								//								attackGraphLinkJson.put("data", attackGraphLinkDataJson);
								//								attackGraphLinkJson.put("selected", false);
								//								attackGraphLinkJson.put("selectable", true);
								//								attackGraphLinkJson.put("locked", false);
								//								attackGraphLinkJson.put("grabbable", true);
								//								linkObjects.add(attackGraphLinkJson);
								//								jsonObjectId++;
							}
							JSONObject attackGraphComponentJson = new JSONObject();
							attackGraphComponentJson.put("group", "nodes");
							JSONObject attackGraphComponentDataJson = new JSONObject();
							attackGraphComponentDataJson.put("id","n"+jsonObjectId);
							//int attackComponentId = jsonObjectId;
							attackGraphComponentDataJson.put("parent","n"+productId);
							attackGraphComponentsIds.put(attackComponent, jsonObjectId);
							attackGraphComponentJson.put("data", attackGraphComponentDataJson);
							attackGraphComponentJson.put("selected", false);
							attackGraphComponentJson.put("selectable", true);
							attackGraphComponentJson.put("locked", false);
							attackGraphComponentJson.put("grabbable", true);
							jsonObjectId++;
							if(attackComponent instanceof VulnerabilityExploit)
							{
								VulnerabilityExploit vexp = (VulnerabilityExploit)attackComponent;
								String vexpLabel = "";
								if(vexp.getCveNames().size()>1)
								{
									vexpLabel = vexp.getCveNames().size()+" CVEs";
								}else
								{
									vexpLabel = vexp.getCveNames().get(0);
								}
								attackGraphComponentDataJson.put("label",vexpLabel);
								JSONArray cvesJsonArray = new JSONArray();
								for(String cveName:vexp.getCveNames())
								{
									cvesJsonArray.put(cveName);
								}
								attackGraphComponentDataJson.put("cves", cvesJsonArray);
								attackGraphComponentDataJson.put("type", "VulnerabilityExploit");
							}else if(attackComponent instanceof Privilege)
							{
								Privilege priv = (Privilege) attackComponent;
								attackGraphComponentDataJson.put("label", priv.getConditionCategory().toString());
								attackGraphComponentDataJson.put("type", "Privilege");
							}else if(attackComponent instanceof PrivilegeConjunction)
							{
								attackGraphComponentDataJson.put("label", "AND");
								attackGraphComponentDataJson.put("type", "PrivilegeConjunction");
							}else if(attackComponent instanceof InformationSourceUsage)
							{
								InformationSourceUsage isu = (InformationSourceUsage) attackComponent;
								attackGraphComponentDataJson.put("label", isu.getInformationSourceName());
								attackGraphComponentDataJson.put("type", "InformationSourceUsage");
							}
							attackGraphComponentsJsonArray.put(attackGraphComponentJson);

							//create product to attack graph component link
							//							JSONObject attackGraphLinkJson = new JSONObject();
							//							attackGraphLinkJson.put("group", "edges");
							//							JSONObject attackGraphLinkDataJson = new JSONObject();
							//							attackGraphLinkDataJson.put("id","n"+jsonObjectId);
							//							attackGraphLinkDataJson.put("source","n"+productId);	
							//							attackGraphLinkDataJson.put("target","n"+attackComponentId);
							//							attackGraphLinkJson.put("data", attackGraphLinkDataJson);
							//							attackGraphLinkJson.put("selected", false);
							//							attackGraphLinkJson.put("selectable", true);
							//							attackGraphLinkJson.put("locked", false);
							//							attackGraphLinkJson.put("grabbable", true);
							//							linkObjects.add(attackGraphLinkJson);
							//							jsonObjectId++;
						}
					}
				}
			}
			//			for(JSONObject jso:linkObjects)
			//			{
			//				attackGraphComponentsJsonArray.put(jso);
			//			}
			for(AttackGraphLink agl:attackGraph.getEdges())
			{
				if(!(agl.getSource() instanceof HostAttackGraph))
				{
					Integer sourceId = attackGraphComponentsIds.get(agl.getSource());
					Integer targetId = attackGraphComponentsIds.get(agl.getTarget());
					if(sourceId!=null)
					{
						if(targetId!=null)
						{
							JSONObject attackGraphLinkJson = new JSONObject();
							attackGraphLinkJson.put("group", "edges");
							JSONObject attackGraphLinkDataJson = new JSONObject();
							attackGraphLinkDataJson.put("id","n"+jsonObjectId);
							jsonObjectId++;
							attackGraphLinkDataJson.put("source","n"+sourceId);
							attackGraphLinkDataJson.put("target","n"+targetId);
							attackGraphLinkJson.put("data", attackGraphLinkDataJson);
							attackGraphLinkJson.put("selected", false);
							attackGraphLinkJson.put("selectable", true);
							attackGraphLinkJson.put("locked", false);
							attackGraphLinkJson.put("grabbable", true);
							attackGraphComponentsJsonArray.put(attackGraphLinkJson);
						}
					}
				}
			}
			allAttackGraphsJsonArray.put(attackGraphJSON);
		}
		return allAttackGraphsJsonArray.toString(); 
	}

	/** Example of a portable way to work with files. Make deployer's life easier */
	public String getResourcePath(String fileName) {
		String pathStr = null;
		Bundle webAgentBundle = Platform.getBundle("auvegos.web.agent");
		URL webAppURL;
		try {
			webAppURL = Platform.resolve(webAgentBundle.getEntry("/src/main/resources"));
			pathStr = webAppURL.getPath() + "/" + fileName;
		} catch (IOException e) {
			// TODO Please test if this work for windows 
			//e.printStackTrace();
			pathStr = "C:\\Projects\\Adaptive-Cyber-Security-Trunk\\trunk\\misc\\demos\\AuVeGoS Demo\\Attack Graphs\\"+ fileName;
		}
		return pathStr;
	}
	
	protected List<AttackGraph> loadAllAttackGraphs()
	{
		List<AttackGraph> attackGraphs = new ArrayList<AttackGraph>();
		ResourceManager resourceManager = new ResourceManager();
		AttackGraph attackGraph = resourceManager.loadObject(URI.createFileURI(getResourcePath("example.attackgraph")), AttackGraphImpl.class,false,true);
		attackGraphs.add(attackGraph);
//		ServletContext securityServletContext = request.getServletContext();
//		if(securityServletContext!=null)
//		{
//			ConcurrentHashMap<String, AttackScenario> derivedAttackScenariosMap = (ConcurrentHashMap<String, AttackScenario>) 
//					securityServletContext.getAttribute(SecurityManagerServlet.ATTACK_GRAPHS_ATTR);
//			for(AttackScenario attackScenario:derivedAttackScenariosMap.values())
//			{
//				if(attackScenario.getAttackGraph()!=null)
//				{
//					attackGraphs.add(attackScenario.getAttackGraph());
//				}
//			}
//		}

		//ResourceManager resourceManager = new ResourceManager();
		//AttackGraph attackGraph = resourceManager.loadObject(URI.createFileURI("C:\\Projects\\Adaptive-Cyber-Security-Trunk\\trunk\\misc\\demos\\AuVeGoS Demo\\Attack Graphs\\exampleWithTargetPrivileges.attackgraph"), AttackGraphImpl.class,false,true);
		//attackGraphs.add(attackGraph);
		ServletContext securityServletContext = request.getServletContext();
		if(securityServletContext!=null)
		{
			ConcurrentHashMap<String, AttackScenario> derivedAttackScenariosMap = (ConcurrentHashMap<String, AttackScenario>) 
					securityServletContext.getAttribute(SecurityManagerServlet.ATTACK_GRAPHS_ATTR);
			for(AttackScenario attackScenario:derivedAttackScenariosMap.values())
			{
				if(attackScenario.getAttackGraph()!=null)
				{
					attackGraphs.add(attackScenario.getAttackGraph());
				}
			}
		}
		return attackGraphs;
	}

	protected AttackGraph loadAttackGraph(String attackGraphName)
	{
		ResourceManager resourceManager = new ResourceManager();
		AttackGraph attackGraph = resourceManager.loadObject(URI.createFileURI("C:\\Projects\\Adaptive-Cyber-Security-Trunk\\trunk\\misc\\demos\\AuVeGoS Demo\\Attack Graphs\\example.attackgraph"), AttackGraphImpl.class,false,true);
//		ServletContext securityServletContext = request.getServletContext();
//		if(securityServletContext!=null)
//		{
//			ConcurrentHashMap<String, AttackScenario> derivedAttackScenariosMap = (ConcurrentHashMap<String, AttackScenario>) 
//					securityServletContext.getAttribute(SecurityManagerServlet.ATTACK_GRAPHS_ATTR);
//			AttackScenario attackScenario = derivedAttackScenariosMap.get(attackGraphName);
//			if(attackScenario!=null)
//			{
//				return attackScenario.getAttackGraph();
//			}
//		}
		return attackGraph;
	}

	@Path("/network")
	@POST 
	@Produces("application/json")
	public String queryAcsNetwork()
	{
		ServletContext securityServletContext = request.getServletContext();
		if(securityServletContext!=null)
		{
			Network acsNetwork = (Network) securityServletContext.getAttribute(SecurityManagerServlet.ACS_NETWORK_ATTR);
			if(acsNetwork!=null)
			{
				Integer nodeId = 1;
				JSONArray layersJsonArray = new JSONArray();
				JSONArray ipLayerJsonArray = new JSONArray();
				Map<Object,Integer> objectsIds = new HashMap<Object,Integer>();
				nodeId = formIpNetworkLayerJSONObjects(acsNetwork, nodeId, ipLayerJsonArray, objectsIds);
				JSONArray securityLayerIpProductVulnerabilityJsonArray = new JSONArray();
				JSONArray securityLayerJsonArray = new JSONArray();
				formSecurityLayerJSONObjects(acsNetwork, nodeId, securityLayerJsonArray,securityLayerIpProductVulnerabilityJsonArray, objectsIds);
				
				System.out.println(securityLayerIpProductVulnerabilityJsonArray);
				layersJsonArray.put(ipLayerJsonArray);
				layersJsonArray.put(securityLayerIpProductVulnerabilityJsonArray);
				return layersJsonArray.toString();
			}
		}
		return "";
	}

	protected void formSecurityLayerJSONObjects(Network acsNetwork,Integer nodeId,JSONArray layersJsonArray,JSONArray securityLayerIpProductVulnerabilityJsonArray, Map<Object,Integer> objectsIds)
	{
		//Create nodes for security layer
		SecurityLayer securityLayer = acsNetwork.getLayerOfType(SecurityLayer.class);
		
		ServletContext securityServletContext = request.getServletContext();
		DatabaseManager databaseManager = null;
		if(securityServletContext!=null)
		{
			 databaseManager = (DatabaseManager) 
					securityServletContext.getAttribute(SecurityManagerServlet.DATABASE_CONNECTION_ATTR);
		}
		
		JSONObject securityLayerJson = new JSONObject();
		securityLayerJson.put("group", "nodes");
		JSONObject securityLayerDataJson = new JSONObject();
		securityLayerDataJson.put("id",nodeId);
		int securityLayerId = nodeId;
		securityLayerDataJson.put("label", securityLayer.getName());
		securityLayerDataJson.put("type", "SecurityLayer");
		objectsIds.put(securityLayer, nodeId);
		nodeId++;
		securityLayerJson.put("data", securityLayerDataJson);
		securityLayerJson.put("selected", false);
		securityLayerJson.put("selectable", true);
		securityLayerJson.put("locked", false);
		securityLayerJson.put("grabbable", true);
		layersJsonArray.put(securityLayerJson);
		for(Appliance appliance:securityLayer.getNodes())
		{
			JSONObject jsonIpObject = new JSONObject();
			JSONObject applianceJson = new JSONObject();
			applianceJson.put("group", "nodes");
			JSONObject applianceDataJson = new JSONObject();
			applianceDataJson.put("id",nodeId);
			int applianceId = nodeId;
			applianceDataJson.put("label", appliance.getName());
			applianceDataJson.put("type", "Appliance");
			applianceDataJson.put("parent",securityLayerId);
			objectsIds.put(appliance, nodeId);
			nodeId++;
			applianceJson.put("data", applianceDataJson);
			applianceJson.put("selected", false);
			applianceJson.put("selectable", true);
			applianceJson.put("locked", false);
			applianceJson.put("grabbable", true);
			layersJsonArray.put(applianceJson);

			IPNode ipNode = appliance.getBridgedNeighbor(IPNode.class);
			if(ipNode != null && ipNode instanceof Device)
			{
				Device device = (Device) ipNode;
				if (device != null) {
				device.getNetworkInterfaces().get(0).getIPv4Address().toString();
				jsonIpObject.put("IP", device.getNetworkInterfaces().get(0).getIPv4Address().toString());
				}
			}
			
			Set<String> installations = new HashSet<String>(); 
			JSONArray jsonProductArray = new JSONArray();

			for(Installation installation:appliance.getInstallations())
			{
				JSONObject installationJson = new JSONObject();
				installationJson.put("group", "nodes");
				JSONObject installationDataJson = new JSONObject();
				installationDataJson.put("id",nodeId);
				String sprodName = installation.getName().replaceAll(":\\*", "");
				if (sprodName.length() > 10) {
					sprodName = sprodName.substring(10);
				}
				installationDataJson.put("label", sprodName);
				installations.add(installation.getName());
				
				installationDataJson.put("type", "Installation");
				installationDataJson.put("parent",applianceId);
				objectsIds.put(installation, nodeId);
				nodeId++;
				installationJson.put("data", installationDataJson);
				installationJson.put("selected", false);
				installationJson.put("selectable", true);
				installationJson.put("locked", false);
				installationJson.put("grabbable", true);
				layersJsonArray.put(installationJson);
			}

			for (String installation : installations) {
			
			 Set<String> installationSet = new HashSet<String>();
			 installationSet.add(installation);
			 List<Vulnerability> vulnerabilities = databaseManager.queryVulnerabilitiesForCPEs(installationSet);
			 Set<String> cveNameSet = new HashSet<String>();
			 Set<String> cweNameSet = new HashSet<String>();
			 JSONObject jsonProductObject = new JSONObject();
			 JSONArray jsonVulnerabilityArray = new JSONArray();
			 
			 int counter = 0;
			 
			 for (Vulnerability vulnerability : vulnerabilities) {
				JSONObject jsonVulnerabilityObject = new JSONObject();
				jsonVulnerabilityObject.put("Name", vulnerability.getCveName());
				jsonVulnerabilityObject.put("Description", vulnerability.getCveDescription());
				jsonVulnerabilityObject.put("CWE", vulnerability.getCorrespondCWE());
				cveNameSet.add(vulnerability.getCveName());
				cweNameSet.add(vulnerability.getCorrespondCWE());
				jsonVulnerabilityArray.put(jsonVulnerabilityObject);
				
				if (counter > 2) {
					break;
				}
				
				counter++;
			 }
			 jsonProductObject.put("Product", installation);
			 jsonProductObject.put("Vulnerabilities", jsonVulnerabilityArray);
			 jsonProductObject.put("CVECount", cveNameSet.size());
			 jsonProductObject.put("CWECount", cweNameSet.size());
			 jsonProductArray.put(jsonProductObject);
			}
		   jsonIpObject.put("Products", jsonProductArray);
		   securityLayerIpProductVulnerabilityJsonArray.put(jsonIpObject);
		}
		
		//Create edges among appliances
		for(Access access:securityLayer.getEdges())
		{
			Integer sourceId = objectsIds.get(access.getSource());
			Integer targetId = objectsIds.get(access.getTarget());
			if(sourceId!=null)
			{
				if(targetId!=null)
				{
					JSONObject accessJson = new JSONObject();
					accessJson.put("group", "edges");
					JSONObject accessDataJson = new JSONObject();
					accessDataJson.put("id",nodeId);
					nodeId++;
					accessDataJson.put("source",sourceId);
					accessDataJson.put("target",targetId);
					accessDataJson.put("parent",securityLayerId);
					accessJson.put("data", accessDataJson);
					accessJson.put("selected", false);
					accessJson.put("selectable", true);
					accessJson.put("locked", false);
					accessJson.put("grabbable", true);
					layersJsonArray.put(accessJson);
				}
			}
		}
	}

	protected int formIpNetworkLayerJSONObjects(Network acsNetwork,Integer nodeId,JSONArray layersJsonArray,Map<Object,Integer> objectsIds)
	{
		//Create nodes for ip layer
		IPNetworkLayer ipNetworkLayer = acsNetwork.getLayerOfType(IPNetworkLayer.class);
		JSONObject ipNetworkLayerJson = new JSONObject();
		ipNetworkLayerJson.put("group", "nodes");
		JSONObject ipNetworkLayerDataJson = new JSONObject();
		ipNetworkLayerDataJson.put("id",nodeId);
		int ipNetworkLayerId = nodeId;
		ipNetworkLayerDataJson.put("label", ipNetworkLayer.getName());
		ipNetworkLayerDataJson.put("type", "IPNetworkLayer");
		objectsIds.put(ipNetworkLayer, nodeId);
		nodeId++;
		ipNetworkLayerJson.put("data", ipNetworkLayerDataJson);
		ipNetworkLayerJson.put("selected", false);
		ipNetworkLayerJson.put("selectable", true);
		ipNetworkLayerJson.put("locked", false);
		ipNetworkLayerJson.put("grabbable", true);
		layersJsonArray.put(ipNetworkLayerJson);
		for(Subnet subnet:ipNetworkLayer.getSubnets())
		{
			JSONObject subnetJson = new JSONObject();
			subnetJson.put("group", "nodes");
			JSONObject subnetDataJson = new JSONObject();
			subnetDataJson.put("id",nodeId);
			int subnetId = nodeId;
			subnetDataJson.put("label", subnet.getName());
			subnetDataJson.put("type", "Subnet");
			subnetDataJson.put("parent",ipNetworkLayerId);
			objectsIds.put(subnet, nodeId);
			nodeId++;
			subnetJson.put("data", subnetDataJson);
			subnetJson.put("selected", false);
			subnetJson.put("selectable", true);
			subnetJson.put("locked", false);
			subnetJson.put("grabbable", true);
			layersJsonArray.put(subnetJson);
			for(IPNode ipNode:subnet.getNodes())
			{
				JSONObject ipNodeJson = new JSONObject();
				ipNodeJson.put("group", "nodes");
				JSONObject ipNodeDataJson = new JSONObject();
				ipNodeDataJson.put("id",nodeId);
				ipNodeDataJson.put("parent",subnetId);
				ipNodeDataJson.put("label", ipNode.getName());
				objectsIds.put(ipNode, nodeId);
				nodeId++;
				ipNodeJson.put("data", ipNodeDataJson);
				ipNodeJson.put("selected", false);
				ipNodeJson.put("selectable", true);
				ipNodeJson.put("locked", false);
				ipNodeJson.put("grabbable", true);
				layersJsonArray.put(ipNodeJson);
				if(ipNode instanceof Device)
				{
					Device ipDevice = (Device) ipNode;
					JSONArray networkInterfaceDataJson = new JSONArray();
					ipNodeDataJson.put("networkinterfaces", networkInterfaceDataJson);
					for(NetworkInterface networkInterface:ipDevice.getNetworkInterfaces())
					{
						JSONObject networkInterfaceJson = new JSONObject();
						networkInterfaceJson.put("address", networkInterface.getIPv4Address().toString());
						networkInterfaceDataJson.put(networkInterfaceJson);
						
						//Add network interfaces as nodes to json based graph
//						JSONObject niJson = new JSONObject();
//						niJson.put("group", "nodes");
//						JSONObject niDataJson = new JSONObject();
//						niDataJson.put("id",nodeId);
//						niDataJson.put("parent",ipNodeId);
//						niDataJson.put("label", networkInterface.getIPv4Address().toString());
//						niDataJson.put("type", "NetworkInterface");
//						objectsIds.put(networkInterface, nodeId);
//						nodeId++;
//						niJson.put("data", niDataJson);
//						niJson.put("selected", false);
//						niJson.put("selectable", true);
//						niJson.put("locked", false);
//						niJson.put("grabbable", true);
//						layersJsonArray.put(niJson);
					}
				}
				if(ipNode instanceof Router)
				{
					ipNodeDataJson.put("type", "Router");
				}else if(ipNode instanceof Switch){
					ipNodeDataJson.put("type", "Switch");
//					Switch switchNode = (Switch) ipNode;
//					for(HardwarePort port:switchNode.getPorts())
//					{
//						JSONObject portJson = new JSONObject();
//						portJson.put("group", "nodes");
//						JSONObject portDataJson = new JSONObject();
//						portDataJson.put("id",nodeId);
//						portDataJson.put("parent",ipNodeId);
//						portDataJson.put("label", "");
//						portDataJson.put("type", "HardwarePort");
//						objectsIds.put(port, nodeId);
//						nodeId++;
//						portJson.put("data", portDataJson);
//						portJson.put("selected", false);
//						portJson.put("selectable", true);
//						portJson.put("locked", false);
//						portJson.put("grabbable", true);
//						layersJsonArray.put(portJson);
//					}
				}else if(ipNode instanceof Device)
				{
					ipNodeDataJson.put("type", "Device");
				}
			}
		}
		//Create edges for ip layer
		for(Link link:ipNetworkLayer.getEdges())
		{
			Integer sourceId = objectsIds.get(link.getSource());
			Integer targetId = objectsIds.get(link.getTarget());
			if(sourceId!=null)
			{
				if(targetId!=null)
				{
					JSONObject linkJson = new JSONObject();
					linkJson.put("group", "edges");
					JSONObject linkDataJson = new JSONObject();
					linkDataJson.put("id",nodeId);
					nodeId++;
					linkDataJson.put("source",sourceId);
					linkDataJson.put("sourceLabel", (link.getSourceConnector() instanceof NetworkInterface)?((NetworkInterface)link.getSourceConnector()).getIPv4Address().toString():"");
					linkDataJson.put("target",targetId);
					linkDataJson.put("targetLabel", (link.getTargetConnector() instanceof NetworkInterface)?((NetworkInterface)link.getTargetConnector()).getIPv4Address().toString():"");
					linkDataJson.put("parent",ipNetworkLayerId);
					linkJson.put("data", linkDataJson);
					linkJson.put("selected", false);
					linkJson.put("selectable", true);
					linkJson.put("locked", false);
					linkJson.put("grabbable", true);
					layersJsonArray.put(linkJson);
				}
			}
		}
		return nodeId;
	}

	@Path("/posture")
	@POST 
	@Produces("application/json")
	public String queryPosture()
	{
		ServletContext securityServletContext = request.getServletContext();
		if(securityServletContext!=null)
		{
			Network acsNetwork = (Network) securityServletContext.getAttribute(SecurityManagerServlet.ACS_NETWORK_ATTR);
			NetworkUtils.IPLayerSoftwareInformation ipLayerSoftwareInformation = (IPLayerSoftwareInformation)
					securityServletContext.getAttribute(SecurityManagerServlet.IP_LAYER_SOFTWARE_INFO_ATTR);
			ConcurrentHashMap<String, Malware> detectedMaliciousActivityMap = (ConcurrentHashMap<String, Malware>) 
					securityServletContext.getAttribute(SecurityManagerServlet.MALICIOUS_ACTIVITY_RESULTS_ATTR);
			ConcurrentHashMap<Integer, IntrusionAlert> intrusionAlertsMap = (ConcurrentHashMap<Integer, IntrusionAlert>) 
					securityServletContext.getAttribute(SecurityManagerServlet.ALERTS_ATTR);
			List<NetworkFlow> networkFlows = (List<NetworkFlow>) 
					securityServletContext.getAttribute(SecurityManagerServlet.FLOWS_ATTR);
			//Map<String,Set<String>> maliciousDomainsConnectedByHosts= new HashMap<String,Set<String>>();
			Map<String,Map<String,Set<String>>> maliciousNetworkActivitiesByHosts= new HashMap<String,Map<String,Set<String>>>();
			Map<String,Set<String>> malwareExistenceInHosts= new HashMap<String,Set<String>>();
			Map<String,Set<String>> intrusionAlertsByHosts= new HashMap<String,Set<String>>();
			//Form malicious network activities data structure
			for(NetworkFlow networkFlow:networkFlows)
			{
				if((!networkFlow.getOrigin().equalsIgnoreCase("benign"))&&(!networkFlow.getOrigin().equalsIgnoreCase("ddos")))
				{
					IPNode sourceNode = ipLayerSoftwareInformation.ipNodesByAddresses.get(networkFlow.getSourceIP());
					if(sourceNode!=null)
					{
						Map<String,Set<String>> hostActs = maliciousNetworkActivitiesByHosts.get(networkFlow.getSourceIP());
						if(hostActs==null)
						{
							hostActs = new HashMap<String, Set<String>>();
							maliciousNetworkActivitiesByHosts.put(networkFlow.getSourceIP(), hostActs);
						}
						Set<String> relatedIps = hostActs.get(networkFlow.getOrigin());
						if(relatedIps==null)
						{
							relatedIps = new HashSet<String>();
							hostActs.put(networkFlow.getOrigin(), relatedIps);
						}
						relatedIps.add(networkFlow.getTargetIP());
					}
					IPNode targetNode = ipLayerSoftwareInformation.ipNodesByAddresses.get(networkFlow.getTargetIP());
					if(targetNode!=null)
					{
						Map<String,Set<String>> hostActs = maliciousNetworkActivitiesByHosts.get(networkFlow.getTargetIP());
						if(hostActs==null)
						{
							hostActs = new HashMap<String, Set<String>>();
							maliciousNetworkActivitiesByHosts.put(networkFlow.getTargetIP(), hostActs);
						}
						Set<String> relatedIps = hostActs.get(networkFlow.getOrigin());
						if(relatedIps==null)
						{
							relatedIps = new HashSet<String>();
							hostActs.put(networkFlow.getOrigin(), relatedIps);
						}
						relatedIps.add(networkFlow.getSourceIP());
					}
				}
			}
			//Form malware existence in hosts
			for(Malware malwareInstance:detectedMaliciousActivityMap.values())
			{
				if(malwareInstance.getNodes().size()>0)
				{
					MalwareComponent malwareComponent = malwareInstance.getNodes().get(0);
					if(malwareComponent.getSourceIP()!=null)
					{
						IPNode sourceNode = ipLayerSoftwareInformation.ipNodesByAddresses.get(malwareComponent.getSourceIP());
						if(sourceNode!=null)
						{
							Set<String> hostMalware = malwareExistenceInHosts.get(malwareComponent.getSourceIP());
							if(hostMalware==null)
							{
								hostMalware = new HashSet<String>();
								malwareExistenceInHosts.put(malwareComponent.getSourceIP(), hostMalware);
							}
							String malwareName = malwareInstance.getName();
							int lastMinusIndex = malwareName.lastIndexOf("-");
							if(lastMinusIndex>0)
							{
								malwareName = malwareName.substring(0, lastMinusIndex);
							}
							hostMalware.add(malwareName);
						}
					}
				}
			}
			//Form intrusion alerts data structure
			for(IntrusionAlert alert:intrusionAlertsMap.values())
			{
				if(alert.getCveName()!=null)
					if(!alert.getCveName().equals(""))
					{
						{
							IPNode sourceNode = ipLayerSoftwareInformation.ipNodesByAddresses.get(alert.getSourceAddress());
							if(sourceNode!=null)
							{
								Set<String> hostAlerts = intrusionAlertsByHosts.get(alert.getSourceAddress());
								if(hostAlerts==null)
								{
									hostAlerts = new HashSet<String>();
									intrusionAlertsByHosts.put(alert.getSourceAddress(), hostAlerts);
								}
								hostAlerts.add(alert.getCveName());
							}
						}
					}
			}
			//Form json objects
			JSONObject networkJson = new JSONObject();
			networkJson.put("name", acsNetwork.getName());
			JSONArray networkChildrenJsonArray = new JSONArray();
			networkJson.put("children", networkChildrenJsonArray);
			Set<String> hostIps = new HashSet<String>();
			hostIps.addAll(maliciousNetworkActivitiesByHosts.keySet());
			hostIps.addAll(malwareExistenceInHosts.keySet());
			hostIps.addAll(intrusionAlertsByHosts.keySet());
			for(String hostIp:hostIps)
			{
				IPNode hostNode = ipLayerSoftwareInformation.ipNodesByAddresses.get(hostIp);
				JSONObject hostJson = new JSONObject();
				hostJson.put("name", hostNode.getName());
				networkChildrenJsonArray.put(hostJson);
				JSONArray hostChildrenJsonArray = new JSONArray();
				hostJson.put("children", hostChildrenJsonArray);
				//Form malicious network activities
				Map<String,Set<String>> hostActs = maliciousNetworkActivitiesByHosts.get(hostIp);
				if(hostActs!=null)
				{
					for(Entry<String,Set<String>> hostActsEntry:hostActs.entrySet())
					{
						JSONObject flowLabelJson = new JSONObject();
						flowLabelJson.put("name", hostActsEntry.getKey());
						hostChildrenJsonArray.put(flowLabelJson);
						JSONArray flowLabelChildrenJsonArray = new JSONArray();
						flowLabelJson.put("children", flowLabelChildrenJsonArray);
						for(String relatedIp:hostActsEntry.getValue())
						{
							JSONObject relatedIpJson = new JSONObject();
							relatedIpJson.put("name", relatedIp);
							relatedIpJson.put("size", 100);
							flowLabelChildrenJsonArray.put(relatedIpJson);
						}
					}
				}
				//Form malware existence visual part
				Set<String> hostMalware = malwareExistenceInHosts.get(hostIp);
				if(hostMalware!=null)
				{
					for(String malwareName:hostMalware)
					{
						JSONObject malwareNameJson = new JSONObject();
						malwareNameJson.put("name", malwareName);
						malwareNameJson.put("size",100);
						hostChildrenJsonArray.put(malwareNameJson);
					}
				}
				//Form intrusion alerts visual part
				Set<String> hostAlerts = intrusionAlertsByHosts.get(hostIp);
				if(hostAlerts!=null)
				{
					for(String alertName:hostAlerts)
					{
						JSONObject alertNameJson = new JSONObject();
						alertNameJson.put("name", alertName);
						alertNameJson.put("size",100);
						hostChildrenJsonArray.put(alertNameJson);
					}
				}
			}
			return networkJson.toString();
		}
		return "";
	}
}
