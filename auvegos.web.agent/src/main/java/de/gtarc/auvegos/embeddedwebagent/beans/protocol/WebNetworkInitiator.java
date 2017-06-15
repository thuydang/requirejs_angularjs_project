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
package de.gtarc.auvegos.embeddedwebagent.beans.protocol;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.dailab.auvegos.agents.facts.NetworkInfo;
import de.dailab.jiactng.agentcore.comm.message.IJiacMessage;
import de.dailab.jiactng.protocol.handler.fipasubscribe.SubscribeProtocolInitiator;
import de.gtarc.auvegos.embeddedwebagent.beans.EmbeddedWebBean;

/**
 * The protocol initiator (at the EmbeddedWebAgent side) that initiates a
 * (subscription)-'request' for a {@link NetworkInfo}
 *
 * @author alwin
 */
public class WebNetworkInitiator
		extends SubscribeProtocolInitiator {
	
	
	/** The logger for the web-network-subscription initiator */
	private static final Logger LOGGER = LoggerFactory.getLogger(WebNetworkInitiator.class);

	/**
	 * The name of the protocol used in the Subscription Protocol between
	 * EmbeddedWebAgent and AuvegosUiAgent
	 */
	public static final String WEB_NETWORK_SUBSCRIPTION_PROTOCOL_NAME = "webNetworkSubscription";

	/**
	 * {@inheritDoc}
	 *
	 * @see de.dailab.jiactng.protocol.handler.fiparequest.RequestProtocolInitiator#
	 *      handleInform(de.dailab.jiactng.agentcore.comm.message.IJiacMessage)
	 */
	@Override
	protected IJiacMessage handleInform(IJiacMessage message) {
		
		LOGGER.debug("Subscriber (" + thisAgent.getAgentName() + ") received a new message from publisher: "
				+ message.getPayload());

		if (message.getPayload() instanceof NetworkInfo) {
			
			NetworkInfo webNetworkResponse = (NetworkInfo) message.getPayload();
			LOGGER.debug("Subscriber (" + thisAgent.getAgentName()
					+ ") has received the NetworkInfo with the timestamp: " + webNetworkResponse.getTimestamp() + ".");

			((EmbeddedWebBean) businesslogicRef).handleWebNetworkResponse(webNetworkResponse);
			return null;
		}

		return createNotUnderstood(message);
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see de.dailab.jiactng.protocol.handler.fiparequest.RequestProtocolInitiator#
	 *      handleAgree(de.dailab.jiactng.agentcore.comm.message.IJiacMessage)
	 */
	@Override
	protected IJiacMessage handleAgree(IJiacMessage message) {
		LOGGER.debug("Subscriber (" + thisAgent.getAgentName()
				+ ") has received an \"AGREED\" message, will receive new Web-network published in the future.");
		return null;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see de.dailab.jiactng.protocol.handler.fiparequest.RequestProtocolInitiator#
	 *      handleRefuse(de.dailab.jiactng.agentcore.comm.message.IJiacMessage)
	 */
	@Override
	protected IJiacMessage handleRefuse(IJiacMessage message) {
		
		LOGGER.debug("Subscriber's (" + thisAgent.getAgentName()
				+ ") subscription has been refused, will not receive new Web-network published in the future!");
		((EmbeddedWebBean) businesslogicRef).stopWebNetworkSubscription();

		return null;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @see de.dailab.jiactng.protocol.handler.AbstractProtocolInitiator#
	 *      handleCancelInform(de.dailab.jiactng.agentcore.comm.message.IJiacMessage)
	 */
	@Override
	protected void handleCancelInform(IJiacMessage message) {
		super.handleCancelInform(message);
		LOGGER.debug("Subscriber (" + thisAgent.getAgentName()
				+ ") successfully canceled Web-network subscription protocol.");
	}

}
