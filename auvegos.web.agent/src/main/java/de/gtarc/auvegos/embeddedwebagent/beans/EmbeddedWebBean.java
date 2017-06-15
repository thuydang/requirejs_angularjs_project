/**
 *
 * Copyright 2014 DAI-Labor, GT-ARC gGmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
package de.gtarc.auvegos.embeddedwebagent.beans;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.jetty.server.Server;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.dailab.acs.agents.beans.AcsAgentBean;
import de.dailab.auvegos.agents.facts.NetworkInfo;
import de.dailab.jiactng.agentcore.ontology.AgentDescription;
import de.dailab.jiactng.agentcore.ontology.IAgentDescription;
import de.dailab.jiactng.protocol.ProtocolManagementBean;
import de.gtarc.auvegos.embeddedwebagent.beans.protocol.WebNetworkInitiator;
import de.gtarc.auvegos.embeddedwebagent.webserver.EmbeddedJettyServerWrapper;

/**
 * Start embedded jetty.
 *
 */
public class EmbeddedWebBean extends AcsAgentBean {

	// ================================================================================
	// CLASS VARIABLE
	// ================================================================================

	/** Logger for the Web-GUI agent */
	private static final Logger LOGGER = LoggerFactory.getLogger(EmbeddedWebBean.class);

	/**
	 * The name of the Monitoring-MASTER agent who will deliver the requested
	 * {@link NetworkInfo}
	 */
	private static final String MONITORING_MASTER_AGENT_NAME = "MonitoringMasterAgent";
	
	/** The protocol manager can create new protocol-sessions */
	private transient ProtocolManagementBean protocolmanager;
	
	/** The initiator for web-network subscription */
	private WebNetworkInitiator webNetworkInitiator;
	
	private EmbeddedJettyServerWrapper webserver;
	
	private int port;

	/** Bean data listener holder. Async data reply from other agents is delivered to the
	 * listeners
	 */
	private List<IBeanDataListener> beanDataListeners = new ArrayList<IBeanDataListener>();

	// ================================================================================
	// AGENT IMPLEMENTATION
	// ================================================================================

	@Override
	public void doStart() {

		super.doStart();
		
		setLogLevel("debug");

		// Check class loader:
		LOGGER.debug("***** EmbeddedWebBean class loader: " + this.getClass().getClassLoader());
		LOGGER.debug("***** EmbeddedWebBean class loader: " + EmbeddedWebBean.class.getClassLoader());

		webserver = new EmbeddedJettyServerWrapper(this);

		try {
			webserver.start(null);
		} catch (Exception e) {
			LOGGER.error("Embedded Jetty server failed to start!", e);
			Thread.currentThread().interrupt();
		}

		LOGGER.info("Embedded Jetty server started: http://localhost:" + webserver.getPort() + "/");
		// Init handler services
		// Don't call this: webserver.join();

		protocolmanager = thisAgent.findAgentBean(ProtocolManagementBean.class);
	}

	// ================================================================================
	// WEB NETWORK SUBSCRIPTION
	// ================================================================================

	/**
	 * Starts a subscription-'request' to the AuvegosUiAgent for a
	 * {@link NetworkInfo}, which will be delivered to the web server
	 */
	public synchronized void startWebNetworkSubscription() {

		LOGGER.debug("Starting a subscription request for Web-Network.");

		List<IAgentDescription> agentDescriptions = thisAgent
				.searchAllAgents(new AgentDescription(null, MONITORING_MASTER_AGENT_NAME, null, null, null, null));

		for (IAgentDescription agent : agentDescriptions) {

			if (agent.getName().equalsIgnoreCase(MONITORING_MASTER_AGENT_NAME)) {

				LOGGER.debug(thisAgent.getAgentName() + " found: {}", agent.getName());
				LOGGER.debug(thisAgent.getAgentName() + " will request new Web-Network to: {}", agent.getName());

				// Find the protocol handler for initiating
				// web-network-subscription
				webNetworkInitiator = (WebNetworkInitiator) protocolmanager
						.getInitiator(WebNetworkInitiator.WEB_NETWORK_SUBSCRIPTION_PROTOCOL_NAME);
				webNetworkInitiator.startProtocol(agent.getMessageBoxAddress(), new NetworkInfo());

				return;
			}
		}

		LOGGER.error(thisAgent.getAgentName() + " unable to find: " + MONITORING_MASTER_AGENT_NAME
				+ " to request new Web-network!");
	}

	/**
	 * Handles the web-network-response from AuvegosUiAgent. This delivers the
	 * {@link NetworkInfo} to the web-server
	 *
	 * @param webNetworkResponse the {@link NetworkInfo}-response from
	 *        AuvegosUiAgent
	 */
	public synchronized void handleWebNetworkResponse(NetworkInfo webNetworkResponse) {
		/** 
		 * 
		 * 
		 * Monitoring project erstellen with subnet 130.149.159.96/28 
		 *   
		 *  
		 *  */
		LOGGER.debug("Receives the requested Web-network from monitoring-master agent: " + webNetworkResponse);

		// TODO: sends the response to web-server
		//webNetworkResponse.getSerializedNetwork().getContent().getLayerOfType(SecurityLayer.class).getVulnerabilityDB().getCves();

		// Sent result to all Listener
//		Network network;
//		if (webNetworkResponse.getSerializedNetwork() != null) {
//			network = webNetworkResponse
//					.getSerializedNetwork()
//					.getContent();
//		} else {
//			network = null;
//		}

		for ( IBeanDataListener listener : beanDataListeners) {
			listener.getData(webNetworkResponse);
		}

		// Do not stop the subscription so that latest network can be received
		// stopWebNetworkSubscription();
	}

	/**
	 * Stop the web-{@link NetworkInfo} subscription
	 */
	public void stopWebNetworkSubscription() {

		LOGGER.info("Trying to cancel Web-network subscription");
		if (webNetworkInitiator != null) {

			webNetworkInitiator.cancel(null);
			webNetworkInitiator = null;
			LOGGER.info("Subscription from the Web-network publisher has been canceled.");

		} else {
			LOGGER.info(
					"Subscription from the Web-network publisher could not be canceled since there was no subscription in the first place!");
		}
	}

	// ====================================================================
	// Bean Data Listeners
	// ====================================================================
	public void register(IBeanDataListener listener) {
		this.beanDataListeners.add(listener);
	}

	public void unregister(IBeanDataListener dataListenter) {
		LOGGER.debug("Remove bean data listenter");
		this.beanDataListeners.remove(dataListenter);
	}
	// ================================================================================
	// WEB-SERVER INFORMATION
	// ================================================================================
	public String callTCPPong() {

		LOGGER.debug("**** Web Agent calls TCP Agent");
		return "I will call Pong Agent"; 
		/*
		 * Action t = new Action("ACTION_PONG"); Action action = (Action)
		 * thisAgent.searchAction(t); ActionResult actionResult =
		 * invokeAndWaitForResult(action, null , BEAN_TIMEOUT); if (actionResult
		 * != null) { if (actionResult.getResults() != null) { Boolean resultOK
		 * = (Boolean) actionResult.getResults()[0]; if (!resultOK) { log.error(
		 * "An error occurred while transmitting the vehicle data.");
		 * System.err.println(
		 * "An error occurred while transmitting the vehicle data."); } } else {
		 * log.error("Action returned no result"); System.out.println(
		 * "Action returned no result"); } }
		 */
	}

	// expose Ping function
	public boolean ping() {

		LOGGER.debug("Embedded Web: pinging...");
		return true;
	}

	/**
	 * Setter for the port. Specification is done within the spring file.
	 *
	 * @param port The port
	 */
	public void setPort(String port) {
		this.port = Integer.parseInt(port);
	}

	public int getPort() {
		return this.port;
	}

    /**
     * Stops the Jetty server.
     *
     * @throws Exception on any error while stopping a Jetty server
     * @see Server#stop()
     */
    @Override
    public void doStop() throws Exception {
        if (this.webserver != null) {
        	this.webserver.stop();
        }
    }

}
