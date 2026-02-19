import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout"

export default function CompliancePage() {
  return (
    <LegalPageLayout title="Compliance" lastUpdated="January 10, 2025">
      <LegalSection title="1. Regulatory Framework">
        <p>
          VEIL operates as a decentralized protocol on the Avalanche blockchain. We are committed to operating within
          applicable legal frameworks while preserving user privacy, decentralization, and the core principles of Web3.
        </p>
        <p>
          As a decentralized platform, VEIL does not act as a financial intermediary or custodian of user funds. All
          trades are executed peer-to-peer via smart contracts, and users maintain full custody of their assets through
          their Web3 wallets.
        </p>
        <p>
          We actively monitor regulatory developments in key jurisdictions and adapt our compliance approach as needed
          to ensure continued operation while protecting user rights.
        </p>
      </LegalSection>

      <LegalSection title="2. Know Your Customer (KYC)">
        <p>
          VEIL does not currently require Know Your Customer (KYC) verification for platform access. Our zero-knowledge
          architecture is designed to protect user privacy while maintaining platform security and integrity.
        </p>
        <p>However, we reserve the right to implement KYC procedures in the future if:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Required by law or regulatory authorities in key jurisdictions</li>
          <li>Necessary to comply with anti-money laundering (AML) regulations</li>
          <li>Needed to prevent fraud, abuse, or other illicit activities</li>
          <li>Required to maintain banking or payment processor relationships</li>
        </ul>
        <p>
          If KYC is implemented, we will provide advance notice to users and ensure that verification processes are
          secure, privacy-preserving, and compliant with data protection laws.
        </p>
      </LegalSection>

      <LegalSection title="3. Anti-Money Laundering (AML)">
        <p>
          VEIL is committed to preventing money laundering, terrorist financing, and other financial crimes. We employ
          multiple measures to detect and prevent illicit activity:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Blockchain analytics and transaction monitoring</li>
          <li>Screening against known sanctioned addresses and entities</li>
          <li>Suspicious activity detection and reporting</li>
          <li>Cooperation with law enforcement when legally required</li>
        </ul>
        <p>
          We reserve the right to freeze, suspend, or terminate accounts suspected of involvement in illegal activities.
          Users engaging in money laundering or other financial crimes will be reported to appropriate authorities.
        </p>
        <p>
          If your account is flagged for suspicious activity, we may request additional information or documentation to
          verify the legitimacy of your transactions.
        </p>
      </LegalSection>

      <LegalSection title="4. Sanctions Compliance">
        <p>VEIL complies with international sanctions programs, including those administered by:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>U.S. Office of Foreign Assets Control (OFAC)</li>
          <li>United Nations Security Council</li>
          <li>European Union sanctions regimes</li>
          <li>Other applicable international sanctions authorities</li>
        </ul>
        <p>
          We screen wallet addresses against sanctions lists and prohibit access from sanctioned individuals, entities,
          and jurisdictions. Attempting to circumvent sanctions restrictions is strictly prohibited and may result in
          legal action.
        </p>
      </LegalSection>

      <LegalSection title="5. Restricted Jurisdictions">
        <p>
          VEIL may not be available in certain jurisdictions due to regulatory restrictions or legal prohibitions on
          prediction markets. Currently restricted jurisdictions include:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Countries subject to comprehensive international sanctions</li>
          <li>Jurisdictions where prediction markets are explicitly prohibited</li>
          <li>Regions where we cannot ensure regulatory compliance</li>
        </ul>
        <p>
          Users are solely responsible for ensuring they are legally permitted to use VEIL in their location. We employ
          geolocation and IP blocking to restrict access from prohibited jurisdictions, but these measures are not
          foolproof.
        </p>
        <p>
          Attempting to access VEIL from a restricted jurisdiction using VPNs, proxies, or other circumvention tools is
          a violation of our Terms of Service and may result in account termination and loss of funds.
        </p>
      </LegalSection>

      <LegalSection title="6. Tax Reporting and Compliance">
        <p>
          Users may be required to report their trading activity and profits to tax authorities in their jurisdiction.
          Tax obligations vary by country and individual circumstances.
        </p>
        <p>VEIL does not provide tax advice, reporting, or withholding services. You are solely responsible for:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Understanding your tax obligations in your jurisdiction</li>
          <li>Maintaining accurate records of your trades and profits</li>
          <li>Filing required tax returns and paying applicable taxes</li>
          <li>Consulting with qualified tax professionals</li>
        </ul>
        <p>
          We may provide transaction history and export tools to assist with tax reporting, but we do not guarantee the
          accuracy or completeness of this data for tax purposes.
        </p>
        <p>
          In some jurisdictions, we may be required to report user information to tax authorities. We will comply with
          such requirements while minimizing disclosure to the extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection title="7. Data Protection and Privacy Compliance">
        <p>VEIL complies with applicable data protection laws, including:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>General Data Protection Regulation (GDPR) for European users</li>
          <li>California Consumer Privacy Act (CCPA) for California residents</li>
          <li>Other applicable regional data protection regulations</li>
        </ul>
        <p>
          Our zero-knowledge architecture minimizes data collection and processing. We do not sell user data to third
          parties and only share information when legally required or necessary for platform operation.
        </p>
        <p>For more details on how we handle your data, please review our Privacy Policy.</p>
      </LegalSection>

      <LegalSection title="8. Securities Law Compliance">
        <p>
          VEIL prediction market shares are not intended to be securities, commodities, or other regulated financial
          instruments. They are utility tokens used solely for participation in prediction markets.
        </p>
        <p>
          However, regulatory classification of prediction market instruments is evolving and may vary by jurisdiction.
          We monitor regulatory developments and will adapt our compliance approach as needed.
        </p>
        <p>
          Users should not treat prediction market shares as investments or securities. They are speculative instruments
          for expressing opinions about future events, not investment products.
        </p>
      </LegalSection>

      <LegalSection title="9. Market Integrity and Manipulation">
        <p>
          VEIL prohibits market manipulation, insider trading, and other activities that undermine market integrity.
          Prohibited activities include:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Wash trading or self-dealing to create artificial volume</li>
          <li>Spoofing or layering to manipulate prices</li>
          <li>Trading on material non-public information</li>
          <li>Coordinated manipulation schemes</li>
          <li>Exploiting bugs or vulnerabilities for unfair advantage</li>
        </ul>
        <p>
          We employ monitoring systems to detect suspicious trading patterns and will investigate potential violations.
          Users found to be manipulating markets will face account termination and may be reported to authorities.
        </p>
      </LegalSection>

      <LegalSection title="10. Audit and Transparency">
        <p>
          VEIL smart contracts have been professionally audited by reputable security firms. Audit reports are publicly
          available for review. However, audits do not guarantee the absence of vulnerabilities.
        </p>
        <p>We maintain transparency through:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Open-source smart contract code</li>
          <li>Public blockchain transactions</li>
          <li>Regular security audits and bug bounty programs</li>
          <li>Transparent governance and decision-making processes</li>
        </ul>
      </LegalSection>

      <LegalSection title="11. Cooperation with Authorities">
        <p>
          VEIL will cooperate with law enforcement and regulatory authorities when legally required. This may include:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Responding to valid subpoenas and court orders</li>
          <li>Providing information in criminal investigations</li>
          <li>Reporting suspicious activity to financial intelligence units</li>
          <li>Complying with regulatory inquiries and examinations</li>
        </ul>
        <p>
          We will resist overly broad or unjustified requests and will notify affected users when legally permitted.
        </p>
      </LegalSection>

      <LegalSection title="12. Compliance Updates">
        <p>
          Our compliance policies and procedures are subject to change as regulations evolve. We will communicate
          material changes to users via email or platform notification.
        </p>
        <p>
          Users are responsible for staying informed about compliance requirements and ensuring their continued
          eligibility to use the Platform.
        </p>
      </LegalSection>

      <LegalSection title="13. Contact Compliance Team">
        <p>
          If you have questions about our compliance policies or need to report suspicious activity, please contact us
          at:
          <br />
          Email: compliance@veil.market
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
