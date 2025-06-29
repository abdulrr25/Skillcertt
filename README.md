# **App Name**: SkillCert

## Core Features:

- Certificate Upload: Users can upload PDF or image certificate documents through a clean, simple upload form. Each upload includes metadata input: title, issuer, date of completion.
- Wallet Authentication: Users log in using Phantom Wallet or embedded Solana wallets. Wallet address is tied to user identity on Supabase.
- zk-Compressed Certificate Minting: Each certificate’s IPFS hash is minted into a zk-compressed Solana account. Enables high scalability at low cost.
- Real-Time Minting Price Calculation: Integrate Chainlink Price Feeds to fetch live SOL/USD exchange rate. Minting cost is fixed in USD (e.g., $3), auto-converted to SOL based on live price.
- Certificate Authenticity Verification: Implement Chainlink Functions tool to: Fetch the uploaded IPFS hash. Cross-check it with backend metadata. Ensure tamper-proof certificate validation.
- Unique Certificate Sharing: Automatically generate a publicly shareable link for each certificate. Include a downloadable or embeddable QR code to link directly to the certificate page.
- Public Certificate Viewer: On visiting `/verify/:id`, show: Certificate preview (image or PDF viewer), Issuer name, user name (from wallet), IPFS hash, Blockchain transaction link, Verified badge via Chainlink confirmation"# Skillcertt" 
