package de.gtarc.auvegos.embeddedwebagent.webserver.datasource;

public interface IDataRetriever {

	/** Implement this method to handle */
	public void requestData(IDataRequester requester);

	/** Implement this method to handle */
	public void destroy();

}
