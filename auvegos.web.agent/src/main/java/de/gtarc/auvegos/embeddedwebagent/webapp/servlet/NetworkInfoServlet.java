package de.gtarc.auvegos.embeddedwebagent.webapp.servlet;

import java.io.IOException;
import java.io.Writer;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import de.dailab.auvegos.agents.facts.NetworkInfo;
import de.gtarc.auvegos.embeddedwebagent.webserver.datasource.IDataRequester;
import de.gtarc.auvegos.embeddedwebagent.webserver.datasource.IDataRetriever;
import de.gtarc.auvegos.embeddedwebagent.webserver.utils.NetworkInfoDataAdapter;

public class NetworkInfoServlet extends HttpServlet implements IDataRequester {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8278288358013391854L;

	private IDataRetriever datasource;
	private HttpServletResponse webclient;

	public NetworkInfoServlet(IDataRetriever datasource) {
			this.datasource = datasource;
	}
	
	protected void service(HttpServletRequest req, HttpServletResponse resp) 
			throws ServletException, IOException {
		doNetworkInfoRequest(req);
	}

	/** There is a chance to filter request here */
	public void doNetworkInfoRequest(HttpServletRequest request) {
		datasource.requestData(this);
	}

	@Override
	public void processData(Object data) {
		NetworkInfo netInfo; 
		
		// exception?
		netInfo = (NetworkInfo) data;

		// ERROR: webclient is null. See asynchronous servlet:
		// https://wiki.eclipse.org/Jetty/Feature/Continuations#Why_Asynchronous_Servlets_.3F
		Writer w;
		try {
			w = webclient.getWriter();
			w.write(new NetworkInfoDataAdapter(netInfo).getJSONString());
			w.flush();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}
