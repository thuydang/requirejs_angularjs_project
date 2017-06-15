package de.gtarc.auvegos.embeddedwebagent.control;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import de.dailab.jiactng.agentcore.SimpleAgentNode;

/**
 * Class to run web agent.
 *
 */
public final class RunApplication {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(RunApplication.class);
	
	private RunApplication() {}

	/**
	 * Starts the web agent.
	 * 
	 * @param args no arguments needed
	 */
	public static void main(String[] args) {
		SimpleAgentNode.main(new String[] { "AgentPjsNode.xml" });
		
		// Check class loader:
		LOGGER.info("***** Agent node class loader: " + SimpleAgentNode.class.getClassLoader());
	}

}
