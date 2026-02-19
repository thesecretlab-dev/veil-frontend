import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout"

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="January 10, 2025">
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing and using VEIL ("the Platform"), you accept and agree to be bound by these Terms of Service
          ("Terms"). If you do not agree to these Terms, please do not use the Platform. These Terms constitute a
          legally binding agreement between you and VEIL.
        </p>
        <p>
          We reserve the right to modify these Terms at any time. Continued use of the Platform after changes
          constitutes acceptance of the modified Terms. We will notify users of material changes via email or platform
          notification.
        </p>
      </LegalSection>

      <LegalSection title="2. Eligibility and Account Requirements">
        <p>
          You must be at least 18 years old and legally permitted to participate in prediction markets in your
          jurisdiction. By using VEIL, you represent and warrant that you meet these eligibility requirements.
        </p>
        <p>
          You are responsible for ensuring compliance with all applicable local, state, national, and international laws
          and regulations. VEIL is not available in jurisdictions where prediction markets are prohibited or restricted
          by law.
        </p>
        <p>
          You must connect a compatible Web3 wallet to use the Platform. You are solely responsible for maintaining the
          security of your wallet and private keys. VEIL cannot recover lost or stolen funds.
        </p>
      </LegalSection>

      <LegalSection title="3. Market Participation and Trading">
        <p>
          VEIL provides a decentralized platform for users to trade on prediction markets. All trades are executed via
          smart contracts on the Avalanche blockchain and are final and non-reversible once confirmed.
        </p>
        <p>
          Market outcomes are determined by decentralized oracle consensus. VEIL does not control or manipulate market
          outcomes. Users trade at their own risk and should conduct their own research before participating in any
          market.
        </p>
        <p>
          Trading fees and gas costs apply to all transactions. These fees are clearly displayed before you confirm any
          trade. VEIL reserves the right to adjust fee structures with advance notice to users.
        </p>
      </LegalSection>

      <LegalSection title="4. Privacy and Zero-Knowledge Technology">
        <p>
          VEIL uses zero-knowledge cryptography to protect user privacy. We do not collect or store personally
          identifiable information beyond what is necessary for blockchain transactions (wallet addresses).
        </p>
        <p>
          Your trading positions, balances, and activity are encrypted and private. However, certain transaction data is
          recorded on the public Avalanche blockchain for transparency and security purposes.
        </p>
        <p>For more details on how we handle your data, please review our Privacy Policy.</p>
      </LegalSection>

      <LegalSection title="5. Prohibited Activities">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Use the Platform for any illegal or unauthorized purpose</li>
          <li>Manipulate markets or engage in wash trading</li>
          <li>Attempt to exploit bugs or vulnerabilities in smart contracts</li>
          <li>Use bots or automated systems without prior authorization</li>
          <li>Impersonate other users or provide false information</li>
          <li>Interfere with the proper functioning of the Platform</li>
        </ul>
        <p>
          Violation of these prohibitions may result in immediate suspension or termination of your access to the
          Platform, and we may report illegal activities to appropriate authorities.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>
          All content, trademarks, logos, and intellectual property on the Platform are owned by VEIL or its licensors.
          You may not copy, modify, distribute, or create derivative works without explicit written permission.
        </p>
        <p>
          The VEIL smart contracts are open source and available under the MIT License. However, the VEIL brand, design,
          and user interface remain proprietary.
        </p>
      </LegalSection>

      <LegalSection title="7. Disclaimers and Limitation of Liability">
        <p>
          VEIL is provided "as is" without warranties of any kind, either express or implied. We do not guarantee that
          the Platform will be uninterrupted, secure, or error-free.
        </p>
        <p>
          Trading on prediction markets involves significant risk, and you may lose your entire investment. Past
          performance does not guarantee future results. VEIL is not responsible for any losses incurred through use of
          the Platform.
        </p>
        <p>
          To the maximum extent permitted by law, VEIL shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, including loss of profits, data, or other intangible losses.
        </p>
      </LegalSection>

      <LegalSection title="8. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless VEIL and its officers, directors, employees, and agents from
          any claims, damages, losses, liabilities, and expenses arising from your use of the Platform or violation of
          these Terms.
        </p>
      </LegalSection>

      <LegalSection title="9. Dispute Resolution and Governing Law">
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which VEIL
          operates, without regard to conflict of law principles.
        </p>
        <p>
          Any disputes arising from these Terms or use of the Platform shall be resolved through binding arbitration,
          except where prohibited by law. You waive your right to participate in class action lawsuits.
        </p>
      </LegalSection>

      <LegalSection title="10. Termination">
        <p>
          We reserve the right to suspend or terminate your access to the Platform at any time, with or without cause,
          and with or without notice. Upon termination, your right to use the Platform will immediately cease.
        </p>
        <p>
          Provisions of these Terms that by their nature should survive termination shall survive, including ownership
          provisions, warranty disclaimers, and limitations of liability.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact Information">
        <p>
          If you have questions about these Terms, please contact us at:
          <br />
          Email: legal@veil.market
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
