package de.gtarc.auvegos.embeddedwebagent.webserver.websocket.webgui;


import org.eclipse.jetty.websocket.servlet.ServletUpgradeRequest;
import org.eclipse.jetty.websocket.servlet.ServletUpgradeResponse;
import org.eclipse.jetty.websocket.servlet.WebSocketCreator;

import de.gtarc.auvegos.embeddedwebagent.webserver.datasource.IDataRetriever;

/**
 * Example of setting up a creator to create appropriately via the proposed and negotiated protocols.
 */
public class WebguiWsCreator implements WebSocketCreator
{
    //private BigEchoSocket bigEchoSocket = new BigEchoSocket();
    //private EchoFragmentSocket echoFragmentSocket = new EchoFragmentSocket();
    //private LogSocket logSocket = new LogSocket();
	IDataRetriever dataRetriever; 
	
	public WebguiWsCreator(IDataRetriever dataRetriever) {
		this.dataRetriever = dataRetriever;
	}
	
    @Override
    public Object createWebSocket(ServletUpgradeRequest req, ServletUpgradeResponse resp)
    {
    	/*
        for (String protocol : req.getSubProtocols())
        {
            switch (protocol)
            {
                case "org.ietf.websocket.test-echo":
                case "echo":
                    resp.setAcceptedSubProtocol(protocol);
                    // TODO: how is this different than "echo-assemble"?
                    return bigEchoSocket;
                case "org.ietf.websocket.test-echo-broadcast":
                case "echo-broadcast":
                    resp.setAcceptedSubProtocol(protocol);
                    return new EchoBroadcastSocket();
                case "echo-broadcast-ping":
                    resp.setAcceptedSubProtocol(protocol);
                    return new EchoBroadcastPingSocket();
                case "org.ietf.websocket.test-echo-assemble":
                case "echo-assemble":
                    resp.setAcceptedSubProtocol(protocol);
                    // TODO: how is this different than "test-echo"?
                    return bigEchoSocket;
                case "org.ietf.websocket.test-echo-fragment":
                case "echo-fragment":
                    resp.setAcceptedSubProtocol(protocol);
                    return echoFragmentSocket;
                default:
                    return logSocket;
            }
        }
        return null;
        */
    	return createWebguiWebsocket(dataRetriever);
    }

	/** Pass {@link MonitorAgentDataRetriever} to websocket */
	public Object createWebguiWebsocket(IDataRetriever dataSource) {
    	WebguiWebSocket webguiSocket = new WebguiWebSocket(dataSource);
		return webguiSocket;
	}
}