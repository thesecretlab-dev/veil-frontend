import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout"

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="January 10, 2025">
      <LegalSection title="1. Introduction">
        <p>
          VEIL is designed with privacy as a core principle. This Privacy Policy explains how we collect, use, and
          protect your information when you use our decentralized prediction market platform.
        </p>
        <p>
          We use zero-knowledge proofs and cryptographic techniques to ensure your trading activity remains private
          while maintaining the transparency and security of the blockchain.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          <strong>Wallet Address:</strong> We collect your public wallet address when you connect to the Platform. This
          is necessary for blockchain transactions and cannot be avoided in a decentralized system.
        </p>
        <p>
          <strong>Transaction Data:</strong> Your trades and transactions are recorded on the Avalanche blockchain.
          While transaction hashes and timestamps are public, your trading positions and balances are encrypted using
          zero-knowledge technology.
        </p>
        <p>
          <strong>Usage Analytics:</strong> We collect minimal, anonymized analytics data to improve the Platform,
          including page views, feature usage, and performance metrics. No personally identifiable information is
          collected.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Your Information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Process your trades and transactions on the blockchain</li>
          <li>Provide customer support and respond to inquiries</li>
          <li>Improve Platform functionality and user experience</li>
          <li>Detect and prevent fraud, abuse, and security threats</li>
          <li>Comply with legal obligations and regulatory requirements</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Zero-Knowledge Privacy">
        <p>
          VEIL implements zero-knowledge cryptography to protect your privacy. Your trading positions, balances, and
          market activity are encrypted and cannot be viewed by VEIL, other users, or third parties.
        </p>
        <p>
          Only you can decrypt and view your private trading data using your wallet's private key. We cannot access,
          modify, or disclose your encrypted information.
        </p>
      </LegalSection>

      <LegalSection title="5. Blockchain Transparency">
        <p>
          While your trades are private, certain information is recorded on the public Avalanche blockchain for
          transparency and security. This includes:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Transaction hashes and timestamps</li>
          <li>Smart contract interactions</li>
          <li>Gas fees and transaction costs</li>
        </ul>
        <p>
          This blockchain data is permanent and cannot be deleted. However, it does not reveal your trading positions or
          balances due to zero-knowledge encryption.
        </p>
      </LegalSection>

      <LegalSection title="6. Third-Party Services">
        <p>VEIL integrates with third-party services, including:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Wallet providers (MetaMask, WalletConnect, Coinbase Wallet, etc.)</li>
          <li>Blockchain infrastructure providers (RPC nodes, indexers)</li>
          <li>Analytics services (anonymized usage data only)</li>
        </ul>
        <p>
          These services have their own privacy policies that govern how they handle your data. We encourage you to
          review their policies before using their services.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies and Tracking">
        <p>We use minimal cookies and local storage to maintain your session and preferences. These include:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Session cookies for authentication and security</li>
          <li>Preference cookies for UI settings and language</li>
          <li>Analytics cookies for anonymized usage tracking</li>
        </ul>
        <p>You can disable cookies in your browser settings, but this may affect Platform functionality.</p>
      </LegalSection>

      <LegalSection title="8. Data Security">
        <p>We implement industry-standard security measures to protect your information, including:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>End-to-end encryption for sensitive data</li>
          <li>Secure HTTPS connections</li>
          <li>Regular security audits and penetration testing</li>
          <li>Multi-signature wallet controls for platform funds</li>
        </ul>
        <p>
          However, no system is completely secure. You are responsible for maintaining the security of your wallet and
          private keys.
        </p>
      </LegalSection>

      <LegalSection title="9. Your Privacy Rights">
        <p>You have the right to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Access any personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of off-chain data (blockchain data cannot be deleted)</li>
          <li>Opt out of analytics and marketing communications</li>
          <li>Export your data in a portable format</li>
        </ul>
        <p>To exercise these rights, contact us at privacy@veil.market.</p>
      </LegalSection>

      <LegalSection title="10. International Users">
        <p>
          VEIL is a decentralized platform accessible globally. If you access the Platform from outside our primary
          jurisdiction, you acknowledge that your data may be transferred and processed in different countries.
        </p>
        <p>
          We comply with applicable data protection laws, including GDPR for European users and CCPA for California
          residents.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify you of material changes via email or
          platform notification. Continued use of the Platform after changes constitutes acceptance of the updated
          policy.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact Us">
        <p>
          If you have questions about this Privacy Policy or how we handle your data, please contact us at:
          <br />
          Email: privacy@veil.market
          <br />
          Support:{" "}
          <a href="/app/support" className="text-emerald-400 hover:text-emerald-300">
            veil.market/support
          </a>
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
