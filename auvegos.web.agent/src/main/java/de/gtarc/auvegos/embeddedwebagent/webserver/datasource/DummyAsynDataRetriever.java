package de.gtarc.auvegos.embeddedwebagent.webserver.datasource;

import de.dailab.acs.model.layer.Network;

public class DummyAsynDataRetriever implements IDataRetriever {
	// External data source
	//private EmbeddedWebBean bean;

	private IDataRequester requester;

	public DummyAsynDataRetriever() {
		// Register for notification of external data source
		// !nope
	}

	/** 
	 * Listener method, called back when requested data is available 
	 */
	public void getData(Object data) {
		// no need to cast here
		//Network netInfo = (Network) data;
		requester.processData(data);
	}

	/** Request data from bean */
	public void requestData(IDataRequester requester) {
		this.requester = requester;
		// ... get data from external source
		getData("THIS IS DATA");
	}

	@Override
	public void destroy() {
		// TODO Auto-generated method stub
		
	}


}

