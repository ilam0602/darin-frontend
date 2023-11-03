"use client";
import { WagmiConfig, createConfig,configureChains,sepolia } from "wagmi";
import { avalanche, bsc, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
	getDefaultConfig({
		// Required API Keys
		alchemyId: process.env.ALCHEMY_API_KEY, // or infuraId
		walletConnectProjectId: "fea796ce2e9d91ba95adedc3dc5959f6",

		// Required
		appName: "darin-frontend",

		// Optional
		chains:[mainnet,sepolia],
	})
);


export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<WagmiConfig config={config}>
				<ConnectKitProvider mode="dark">
					<body>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								minHeight: "105vh",
							}}
						>
							{/* <Navbar /> */}
							<div style={{ flexGrow: 1 }}>{children}</div>
							{/* <Footer /> */}
						</div>
					</body>
				</ConnectKitProvider>
			</WagmiConfig>
		</html>
	);
}
