package de.gtarc.auvegos.embeddedwebagent.webserver.utils;

import de.dailab.acs.model.layer.Network;
import de.dailab.acs.security.api.util.StatProvider;
import de.dailab.auvegos.agents.facts.NetworkInfo;

public class NetworkInfoDataAdapter {

	private StatProvider statProvider;
	private NetworkDataHolder networkData;
	
	
	
	public NetworkInfoDataAdapter(NetworkInfo netInfo) {
		this.networkData = new NetworkDataHolder(netInfo);
	}

	public String getJSONString() {
		return networkData.getJSONString();
	}
	
	public String toString(Network netInfo) {
		return "";
	}

}

