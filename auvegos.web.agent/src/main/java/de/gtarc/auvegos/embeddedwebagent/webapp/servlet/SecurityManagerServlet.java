package de.gtarc.auvegos.embeddedwebagent.webapp.servlet;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;

import org.glassfish.jersey.servlet.ServletContainer;
import org.glassfish.jersey.servlet.WebConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.dailab.acs.alert.log.model.DNS;
import de.dailab.acs.attack.utils.attack.graph.AttackGraphUtils;
import de.dailab.acs.attack.utils.network.NetworkUtils;
import de.dailab.acs.log.analysis.database.mongo.MongoConstants;
import de.dailab.acs.log.analysis.database.mongo.MongoDb;
import de.dailab.acs.model.alert.AlertFactory;
import de.dailab.acs.model.alert.AttackScenario;
import de.dailab.acs.model.alert.IntrusionAlert;
import de.dailab.acs.model.alert.MaliciousActivityResult;
import de.dailab.acs.model.alert.NormalizedLog;
import de.dailab.acs.model.alert.Session;
import de.dailab.acs.model.alert.impl.IntrusionAlertImpl;
import de.dailab.acs.model.alert.impl.NormalizedLogImpl;
import de.dailab.acs.model.alert.impl.SessionImpl;
import de.dailab.acs.model.attackgraph.AttackGraph;
import de.dailab.acs.model.attackgraph.Privilege;
import de.dailab.acs.model.attackgraph.impl.AttackGraphImpl;
import de.dailab.acs.model.layer.NamedElement;
import de.dailab.acs.model.layer.Network;
import de.dailab.acs.model.layer.impl.NetworkImpl;
import de.dailab.acs.network.log.model.NetworkFlow;
import de.dailab.acs.vulnerability.prepostcondition.database.DatabaseManager;

/**
 * Servlet that manages fetching data from cve database and mongo db
 * 
 * @author kaynar
 *
 */
public class SecurityManagerServlet extends ServletContainer
{
	/**
	 * 
	 */
	private static final long serialVersionUID = 5109428907777742850L;

	private static final Logger LOGGER = LoggerFactory.getLogger(SecurityManagerServlet.class);

	private static final int logAlertLoadTimeMultiplier = 3600 * 24 * 1000;
	
	private static final String CVE_DATABASE_IP_PROPERTY = "CVE_DATABASE_IP";

	private static final String CVE_DATABASE_USERNAME_PROPERTY = "CVE_DATABASE_USERNAME";

	private static final String CVE_DATABASE_PASSWORD_PROPERTY = "CVE_DATABASE_PASSWORD";

	private static final String CVE_DATABASE_NAME_PROPERTY = "CVE_DATABASE_NAME";

	public static final String ACS_NETWORK_ATTR = "AcsNetwork";

	public static final String IP_LAYER_SOFTWARE_INFO_ATTR = "IpLayerSoftwareInfo";

	public static final String ATTACK_GRAPHS_ATTR = "AttackGraphs";

	public static final String MALICIOUS_ACTIVITY_RESULTS_ATTR = "MaliciousActivityResults";

	public static final String ALERTS_ATTR = "Alerts";

	public static final String LOGS_ATTR = "Logs";

	public static final String FLOWS_ATTR = "Flows";

	public static final String DATABASE_CONNECTION_ATTR = "DatabaseConnection";

	public static final String DNS_DATA_ATTR = "DNSData";

	private Network acsNetwork;

	private NetworkUtils.IPLayerSoftwareInformation ipLayerSoftwareInformation;

	private List<NetworkFlow> networkFlows = new ArrayList<NetworkFlow>();

	private Collection<DNS> dnsData = new HashSet<DNS>();

	private ConcurrentHashMap<String, List<NormalizedLog>> normalizedLogsMappedByHostIp = new ConcurrentHashMap<String, List<NormalizedLog>>();

	private ConcurrentHashMap<Integer, IntrusionAlert> intrusionAlertsMap = new ConcurrentHashMap<Integer, IntrusionAlert>();

	private ConcurrentHashMap<String, AttackScenario> derivedAttackScenariosMap = new ConcurrentHashMap<String, AttackScenario>();

	private ConcurrentHashMap<String, List<MaliciousActivityResult>> detectedMaliciousActivityMap = new ConcurrentHashMap<String, List<MaliciousActivityResult>>();

	private Session session;

	private static String sessionName = "session1";

	private long sessionStartTime;

	private int logAlertLoadTimeIncrement = 0;

	private MongoDb mongoDb;

	private DatabaseManager databaseManager;

	private void connectToCVEDatabase() {
		String ip = null;
		String userName = null;
		String password = null;
		String databaseName = null;
		String propertiesFilePath = getClass().getProtectionDomain().getCodeSource().getLocation().getPath().toString();
		File propertiesFile = new File(propertiesFilePath
				+ File.separator + "properties" + File.separator + "database.configuration");
		if(propertiesFile.exists())
		{
			try {
				FileReader webappPropertiesFileReader = new FileReader(propertiesFile);
				Properties webappProperties = new Properties();
				webappProperties.load(webappPropertiesFileReader);
				ip = webappProperties.getProperty(CVE_DATABASE_IP_PROPERTY);
				userName = webappProperties.getProperty(CVE_DATABASE_USERNAME_PROPERTY);
				password = webappProperties.getProperty(CVE_DATABASE_PASSWORD_PROPERTY);
				databaseName = webappProperties.getProperty(CVE_DATABASE_NAME_PROPERTY);
				databaseManager = new DatabaseManager(ip, userName, password, databaseName);
			} catch (IOException e) {
				LOGGER.error("aecurity manager servlet error "+e);
				Thread.currentThread().interrupt();
			}
		}
	}

	private void loadSession()
	{
		if (mongoDb == null) {
			AlertFactory.eINSTANCE.eClass();
			mongoDb = new MongoDb(MongoConstants.DB_DEFAULT_DATABASE, sessionName);
		}
		List<NamedElement> sessionList = mongoDb.loadContentByEClassWithFilter(SessionImpl.class, false,
				MongoConstants.NAME, sessionName);
		if (sessionList.size() > 0) {
			session = (Session) sessionList.get(0);
			sessionStartTime = Long.parseLong(session.getStartTime());
			List<NamedElement> networkList = mongoDb.loadContentByEClassWithFilter(NetworkImpl.class, false);
			if (networkList.size() > 0) {
				acsNetwork = (Network) networkList.get(0);
				ipLayerSoftwareInformation = NetworkUtils.loadNetworkLayers(acsNetwork);
				getSessionData();
				ServletContext servletContext = getServletContext();
				servletContext.setAttribute(ACS_NETWORK_ATTR,acsNetwork);
				servletContext.setAttribute(IP_LAYER_SOFTWARE_INFO_ATTR,ipLayerSoftwareInformation);
				servletContext.setAttribute(ATTACK_GRAPHS_ATTR, derivedAttackScenariosMap);
				servletContext.setAttribute(MALICIOUS_ACTIVITY_RESULTS_ATTR,detectedMaliciousActivityMap);
				servletContext.setAttribute(LOGS_ATTR, normalizedLogsMappedByHostIp);
				servletContext.setAttribute(ALERTS_ATTR,intrusionAlertsMap);
				servletContext.setAttribute(FLOWS_ATTR, networkFlows);
				servletContext.setAttribute(DATABASE_CONNECTION_ATTR, databaseManager);
				servletContext.setAttribute(DNS_DATA_ATTR, dnsData);

			}
		}
	}

	private void getSessionData() {
		if (mongoDb != null) {
			// Load attack scenarios
			derivedAttackScenariosMap.clear();
			int attackScenarioId = 0;
			List<NamedElement> attackGraphList = mongoDb.loadContentByEClassWithFilter(AttackGraphImpl.class, true);
			for (NamedElement attackGraphNamedElement : attackGraphList) {
				if (attackGraphNamedElement instanceof AttackGraph) {
					AttackGraph attackGraph = (AttackGraph) attackGraphNamedElement;
					AttackScenario attackScenario = AlertFactory.eINSTANCE.createAttackScenario();
					attackScenario.setId(attackScenarioId++);
					attackScenario.setAttackGraph(attackGraph);
					attackScenario.setName(attackGraph.getName());
					derivedAttackScenariosMap.put(attackGraph.getName(), attackScenario);
				}
			}
			// Load malicious activities
			detectedMaliciousActivityMap.clear();
			List<NamedElement> maliciousActivityResultNamedElements = mongoDb.loadContentByEClassWithFilter(MaliciousActivityResult.class, true);
			for (NamedElement maliciousActivityResultNamedElement : maliciousActivityResultNamedElements) {
				if (maliciousActivityResultNamedElement instanceof MaliciousActivityResult) {
					MaliciousActivityResult maliciousActivityResult = (MaliciousActivityResult) maliciousActivityResultNamedElement;
					Privilege privilege = maliciousActivityResult.getPrivilege();
					String privilegeIdentifier = AttackGraphUtils.getIdentifierForAttackGraphComponent(privilege);
					List<MaliciousActivityResult> marsForPrivilege = detectedMaliciousActivityMap.get(privilegeIdentifier);
					if(marsForPrivilege==null)
					{
						marsForPrivilege = new ArrayList<MaliciousActivityResult>();
						detectedMaliciousActivityMap.put(privilegeIdentifier, marsForPrivilege);
					}
					marsForPrivilege.add(maliciousActivityResult);
				}
			}
			// Load normalized logs and alerts for the session
			List<NamedElement> logsList = new ArrayList<NamedElement>();
			List<NamedElement> alertsList = new ArrayList<NamedElement>();
			long startTimestamp = sessionStartTime + (logAlertLoadTimeIncrement * logAlertLoadTimeMultiplier);
			long endTimestamp = startTimestamp + logAlertLoadTimeMultiplier;
			logsList = mongoDb.loadContentByEClassWithFilter(NormalizedLogImpl.class, true, "logTimestamp",
					String.valueOf(startTimestamp), String.valueOf(endTimestamp));
			alertsList = mongoDb.loadContentByEClassWithFilter(IntrusionAlertImpl.class, true, "timestamp",
					String.valueOf(startTimestamp), String.valueOf(endTimestamp));
			if (logsList.size() > 0) {
				normalizedLogsMappedByHostIp.clear();
				for (NamedElement logNamedElement : logsList) {
					if (logNamedElement instanceof NormalizedLog) {
						NormalizedLog normalizedLog = (NormalizedLog) logNamedElement;
						String hostIp=normalizedLog.getSourceIP();
						if(hostIp!=null)
						{
							List<NormalizedLog> hostLogs = normalizedLogsMappedByHostIp.get(hostIp);
							if(hostLogs==null)
							{
								hostLogs = new ArrayList<NormalizedLog>();
								normalizedLogsMappedByHostIp.put(hostIp, hostLogs);
							}
							hostLogs.add(normalizedLog);
						}
					}
				}
			}
			if (alertsList.size() > 0) {
				intrusionAlertsMap.clear();
				for (NamedElement alertNamedElement : alertsList) {
					if (alertNamedElement instanceof IntrusionAlert) {
						IntrusionAlert alert = (IntrusionAlert) alertNamedElement;
						intrusionAlertsMap.put(alert.getId(), alert);
					}
				}
			}
			// Load DNS Data
			dnsData.clear();
			dnsData.addAll(mongoDb.loadContentByClass(DNS.class));
			// Load network flows
			networkFlows.addAll(mongoDb.loadContentByClass(NetworkFlow.class));
		}
	}

	@Override
	protected void init(WebConfig webConfig) throws ServletException {
		super.init(webConfig);
		//connectToCVEDatabase();
		//loadSession();
	}
}
