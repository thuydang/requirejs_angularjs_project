package de.gtarc.auvegos.embeddedwebagent.webserver.datasource;

import java.util.concurrent.CopyOnWriteArraySet;

import org.eclipse.jetty.websocket.api.Session;

import de.gtarc.auvegos.embeddedwebagent.beans.EmbeddedWebBean;
import de.gtarc.auvegos.embeddedwebagent.beans.IBeanDataListener;

/** 
 * MonitorAgentDataRetriever register itself with EmbeddedWebBean for data when created.
 * Be ware that data still come if no IDataRequester (null) is waiting for data.
 */
public class MonitorAgentDataRetriever implements IDataRetriever, IBeanDataListener {
	private EmbeddedWebBean bean;
	private IDataRequester requester;
	private boolean subscribedForBeanData;
	private Object lastReceivedData;

	public MonitorAgentDataRetriever(EmbeddedWebBean bean) {
		this.bean = bean;

	}

	/** 
	 * Called by bean when requested data is available. 
	 * Requester must handle data = null!!!
	 * Implementing {@link IBeanDataListerner}.
	 */
	@Override
	public void getData(Object data) {
		// no need to cast here
		//Network netInfo = (Network) data;
		lastReceivedData = data;
		if (requester != null) {
			System.out.println("*** MonitorAgentDataRetriever.getData() sending data to " + requester.toString());
			requester.processData(data);
		} else {
			System.out.println("*** MonitorAgentDataRetriever.getData() WHY THIS?");
			
		}
	}

	/** Request data from bean 
	 * Implementing {@link IDataRetriever}.
	 */
	public void requestData(IDataRequester requester) {
		System.out.println("*** MonitorAgentDataRetriever.requestData() from: " + requester.toString());
		this.requester = requester;
		if (!this.subscribedForBeanData) {
			// Register for notification of bean data
			bean.register(this);
			bean.startWebNetworkSubscription();
			this.subscribedForBeanData = true;
		} else {
			System.out.println("*** MonitorAgentDataRetriever.requestData() CACHED data");
			getData(lastReceivedData);
			
		}
	}

	@Override
	public void destroy() {
		System.out.println("*** MonitorAgentDataRetriever.destroy()");
		bean.unregister(this);
		bean.stopWebNetworkSubscription();
		this.subscribedForBeanData = false;
	}


}

