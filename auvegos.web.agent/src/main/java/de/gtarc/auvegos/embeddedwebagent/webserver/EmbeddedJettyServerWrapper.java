package de.gtarc.auvegos.embeddedwebagent.webserver;

import java.net.URL;

import org.eclipse.core.runtime.Platform;
import org.eclipse.jetty.server.HttpConnectionFactory;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.server.ServerConnector;
import org.eclipse.jetty.util.thread.QueuedThreadPool;
import org.eclipse.jetty.webapp.WebAppContext;
import org.eclipse.jetty.websocket.server.WebSocketUpgradeFilter;
import org.eclipse.jetty.websocket.server.pathmap.ServletPathSpec;
import org.osgi.framework.Bundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.gtarc.auvegos.embeddedwebagent.beans.EmbeddedWebBean;
import de.gtarc.auvegos.embeddedwebagent.webapp.servlet.SecurityManagerServlet;
import de.gtarc.auvegos.embeddedwebagent.webserver.datasource.MonitorAgentDataRetriever;
import de.gtarc.auvegos.embeddedwebagent.webserver.websocket.echo.EchoCreator;
import de.gtarc.auvegos.embeddedwebagent.webserver.websocket.webgui.WebguiWsCreator;

/**
 * Wrapper for embedded webserver, which holds reference to agent bean and webserver configurations.
 * @author dang
 *
 */
public class EmbeddedJettyServerWrapper {

	private static final Logger LOGGER = LoggerFactory.getLogger(EmbeddedJettyServerWrapper.class);
	
	public final int DEFAULT_PORT = 8080;
	
	private EmbeddedWebBean bean;
	
	private Server server;
	//private WebSocketHandler wsHandler;

	public EmbeddedJettyServerWrapper(EmbeddedWebBean bean) {
		this.bean = bean;

		/** Setup jetty server. 
		 * see: http://git.eclipse.org/c/jetty/org.eclipse.jetty.project.git/tree/examples/embedded/src/main/java/org/eclipse/jetty/embedded/LikeJettyXml.java
		 */
		// Setup Threadpool
		QueuedThreadPool threadPool = new QueuedThreadPool();
		threadPool.setMaxThreads(500);

		// Server
		this.server = new Server(threadPool);
		ServerConnector connector = new ServerConnector(server, new HttpConnectionFactory());

		if (bean.getPort() !=  0) {
			connector.setPort(bean.getPort());
		} else {
			connector.setPort(DEFAULT_PORT);
		}

		server.addConnector(connector);
	}

	/** Embedded Jetty */
	@SuppressWarnings("deprecation")
	public void start(String[] args) throws Exception {

		LOGGER.info("*** Initializing Embedded Jetty 9.x server...");

		/*
		// https://www.eclipse.org/jetty/documentation/current/embedding-jetty.html#d0e19713
		final ServletContextHandler context =
			new ServletContextHandler(ServletContextHandler.SESSIONS);
		context.setResourceBase(getRootFolder().getAbsolutePath() + "/src/main/webapp/");
		context.setContextPath("/");
		 */
		Bundle webAgentBundle = Platform.getBundle("auvegos.web.agent");
		URL webAppURL = Platform.resolve(webAgentBundle.getEntry("/src/main/webapp"));
		WebAppContext context =
				new WebAppContext(
						webAppURL.getPath(),"/");
		
		context.setClassLoader(
				Thread.currentThread().getContextClassLoader()
				);
		
		// No more handler after ServletContextHandler is added.
		// http://stackoverflow.com/questions/34007087/jetty-9-add-websockets-handler-to-handler-list

		/** Add other servlets using context */
		/** Add the websocket filter */
		WebSocketUpgradeFilter wsfilter = WebSocketUpgradeFilter.configureContext(context);
		// Configure websocket behavior
		//wsfilter.getFactory().getPolicy().setIdleTimeout(5000);
		// Add websocket mapping
		wsfilter.addMapping(new ServletPathSpec("/echo/"), new EchoCreator());

		// Webgui Websocket
		wsfilter.addMapping(new ServletPathSpec("/webgui/"), new WebguiWsCreator(
				new MonitorAgentDataRetriever(bean)));

		server.setHandler(context);
		// Add echo (normal, non-websocket) Servlet
		// context.addServlet(MyEchoServlet.class, "/echo/");

		/** Add default servlet, serving static content or 404. */
//		ServletHolder holderDefault = new ServletHolder("default",DefaultServlet.class);
//		holderDefault.setInitParameter("dirAllowed","true");
//		context.addServlet(holderDefault,"/");
//
//		// HelloServlet with Bean reference.
//		context.addServlet(new ServletHolder(new HelloServlet(bean)), "/hello");
//
//		// Servlet that serves requiest with external data source
//		context.addServlet(new ServletHolder(
//					new NetworkInfoServlet(
//						new MonitorAgentDataRetriever(bean))), "/network");

		/** these does not work with ServletContextHandler */
		/** Not used with ServletContextHandler 
		 wsHandler = new EchoSocketHandler(); 
		 server.setHandler(wsHandler); 
		 * */
		/** Resource handler for static content */
		/*
			 ResourceHandler resource_handler = new ResourceHandler();
			 resource_handler.setDirectoriesListed(true);
			 resource_handler.setWelcomeFiles(new String[]{ "index.html" });
			 resource_handler.setResourceBase("./src/main/webapp/");

			 HandlerList handlers = new HandlerList();
			 handlers.setHandlers(new Handler[] { resource_handler, new DefaultHandler() });
			 */
		/** Servlets */
		/*
		//context.setResourceBase("webapp");
		DefaultServlet defaultServlet = new DefaultServlet();
		ServletHolder holderPwd = new ServletHolder("default", defaultServlet);
		holderPwd.setInitParameter("resourceBase", "./src/main/webapp/");
		context.addServlet(holderPwd, "/*");
		context.addServlet(new ServletHolder(new HelloServlet(bean)),"/hello");
		//context.addServlet(InfoServiceSocketServlet.class, "/info");
		//context.addServlet(JSONServlet.class, "/json");
		*/
		/** simple servlet
			ServletContextHandler context = new ServletContextHandler(ServletContextHandler.SESSIONS);
			context.setContextPath("/");
			server.setHandler(context);

			context.addServlet(new ServletHolder(new HelloServlet(bean)),"/*");
			*/

		server.start();
		/** Tobe started after server started */
	}

//	private static File getRootFolder() {
//		try {
//			File root;
//			//String runningJarPath = Main.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath().replaceAll("\\\\", "/");
//			String runningJarPath = EmbeddedWebBean.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath().replaceAll("\\\\", "/");
//
//			/* This is used when jar is in target folder
//				 int lastIndexOf = runningJarPath.lastIndexOf("/target/");
//				 if (lastIndexOf < 0) {
//				 root = new File("");
//				 } else {
//			//root = new File(runningJarPath.substring(0, lastIndexOf));
//			root = new File(runningJarPath);
//				 }
//				 */
//			root = new File(runningJarPath);
//			System.out.println("***** Application resolved root folder: " + root.getAbsolutePath());
//			return root;
//		} catch (URISyntaxException ex) {
//			throw new RuntimeException(ex);
//		}
//	}

	public void join() {
		try {
			//server.dumpStdErr();
			server.join();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}


	/* Websocket Client endpoint
		 public void openWebSocket() throws DeploymentException, IOException, URISyntaxException {
		 Session wsSession;
		 URI uri = new URI("ws://localhost:" + getPort() +
		 EchoWebsocketServer.Config.PATH_ASYNC);
		 Class<Async> endpoint = EchoWebsocketServer.Async.class;
		 wsSession = wsContainer.connectToServer(endpoint, uri);
		 }
		 */

	public int getPort() {
		int jettyPort = ((ServerConnector) server.getConnectors()[0]).getLocalPort();
		return jettyPort;
	}


	public void stop() throws Exception {
		// TODO Auto-generated method stub
		if (this.server != null)
			this.server.stop();
	}
}
