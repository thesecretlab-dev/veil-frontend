import { LegalPageLayout, LegalSection } from "@/components/legal-page-layout"

export default function RiskPage() {
  return (
    <LegalPageLayout title="Risk Disclosure" lastUpdated="January 10, 2025">
      <div
        className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 p-6 backdrop-blur-xl"
        style={{
          boxShadow: "0 0 30px rgba(239, 68, 68, 0.15)",
        }}
      >
        <p
          className="font-semibold"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "rgba(239, 68, 68, 0.9)",
          }}
        >
          ⚠️ Important Warning
        </p>
        <p
          className="mt-2"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Trading on prediction markets involves significant financial risk. You may lose your entire investment. Only
          trade with funds you can afford to lose. This disclosure outlines the key risks associated with using VEIL.
        </p>
      </div>

      <LegalSection title="1. Market Risk">
        <p>
          Prediction markets are highly volatile and speculative. Share prices can fluctuate dramatically based on news,
          events, and trader sentiment. There is no guarantee that you will profit from any trade.
        </p>
        <p>
          Market outcomes are uncertain by nature. Even markets with high probability outcomes can resolve unexpectedly.
          Past performance and current odds do not guarantee future results.
        </p>
        <p>
          You may lose your entire investment in any market. Never invest more than you can afford to lose, and
          diversify your positions to manage risk.
        </p>
      </LegalSection>

      <LegalSection title="2. Smart Contract Risk">
        <p>
          VEIL operates on smart contracts deployed to the Avalanche blockchain. While our contracts have been
          professionally audited, smart contracts may contain bugs, vulnerabilities, or design flaws that could result
          in loss of funds.
        </p>
        <p>
          Smart contract code is immutable once deployed. If a vulnerability is discovered, it may not be possible to
          fix it without migrating to new contracts, which could be disruptive or result in temporary loss of access to
          funds.
        </p>
        <p>
          You should review our smart contract code and audit reports before using the Platform. VEIL is not liable for
          losses resulting from smart contract vulnerabilities.
        </p>
      </LegalSection>

      <LegalSection title="3. Oracle Risk">
        <p>
          Market resolution depends on decentralized oracles that provide real-world data to the blockchain. While
          designed to be accurate and tamper-resistant, oracles may occasionally provide incorrect data or be subject to
          manipulation.
        </p>
        <p>
          Oracle failures or disputes can delay market resolution or result in incorrect outcomes. VEIL uses multiple
          oracle sources and dispute resolution mechanisms to minimize this risk, but it cannot be eliminated entirely.
        </p>
        <p>
          In the event of an oracle dispute, market resolution may be delayed while the community votes on the correct
          outcome. This could temporarily lock your funds.
        </p>
      </LegalSection>

      <LegalSection title="4. Liquidity Risk">
        <p>
          Some markets may have low liquidity, making it difficult to enter or exit positions at desired prices. You may
          not be able to sell your shares when you want to, or you may have to accept unfavorable prices.
        </p>
        <p>
          Low liquidity can also lead to high price slippage, where the execution price differs significantly from the
          displayed price. Always check the order book depth before placing large trades.
        </p>
        <p>
          VEIL does not guarantee liquidity in any market. Market makers may withdraw liquidity at any time, especially
          during periods of high volatility or uncertainty.
        </p>
      </LegalSection>

      <LegalSection title="5. Regulatory Risk">
        <p>
          Prediction markets may be subject to regulatory restrictions or prohibitions in certain jurisdictions. Laws
          and regulations are evolving rapidly, and future regulatory changes could affect your ability to use VEIL.
        </p>
        <p>
          You are solely responsible for ensuring compliance with all applicable local, state, national, and
          international laws and regulations. VEIL does not provide legal advice and cannot guarantee that the Platform
          is legal in your jurisdiction.
        </p>
        <p>
          Regulatory enforcement actions could result in the Platform being shut down, restricted, or modified in ways
          that affect your positions or ability to withdraw funds.
        </p>
      </LegalSection>

      <LegalSection title="6. Blockchain and Network Risk">
        <p>
          VEIL operates on the Avalanche blockchain. Blockchain networks can experience congestion, downtime, or forks
          that may affect your ability to trade or access funds.
        </p>
        <p>
          High network congestion can lead to increased gas fees and delayed transaction confirmations. In extreme
          cases, transactions may fail or be stuck pending for extended periods.
        </p>
        <p>
          Blockchain forks or protocol upgrades could result in temporary disruptions or require manual intervention to
          access your funds. VEIL will communicate any necessary actions during such events.
        </p>
      </LegalSection>

      <LegalSection title="7. Wallet and Key Management Risk">
        <p>
          You are solely responsible for maintaining the security of your wallet and private keys. If you lose your
          private keys or they are stolen, you will permanently lose access to your funds. VEIL cannot recover lost or
          stolen funds.
        </p>
        <p>
          Phishing attacks, malware, and social engineering scams are common in the cryptocurrency space. Always verify
          that you are interacting with the official VEIL website and never share your private keys with anyone.
        </p>
        <p>
          Use hardware wallets or other secure key management solutions for large amounts. Enable all available security
          features in your wallet, including two-factor authentication where supported.
        </p>
      </LegalSection>

      <LegalSection title="8. Counterparty Risk">
        <p>
          When you trade on VEIL, you are trading against other users. If the Platform experiences a catastrophic
          failure or exploit, there may not be sufficient funds to honor all positions.
        </p>
        <p>
          While VEIL uses smart contracts to minimize counterparty risk, extreme scenarios such as oracle failures or
          smart contract exploits could result in losses that cannot be recovered.
        </p>
      </LegalSection>

      <LegalSection title="9. Tax and Accounting Risk">
        <p>
          Trading on prediction markets may have tax implications in your jurisdiction. You are responsible for
          understanding and complying with all applicable tax laws and reporting requirements.
        </p>
        <p>
          VEIL does not provide tax advice or reporting. You should consult with a qualified tax professional to
          understand your obligations. Failure to properly report and pay taxes could result in penalties and legal
          consequences.
        </p>
      </LegalSection>

      <LegalSection title="10. Operational Risk">
        <p>
          VEIL may experience technical issues, bugs, or downtime that affect your ability to trade or access the
          Platform. While we strive for high availability, we cannot guarantee uninterrupted service.
        </p>
        <p>
          User interface bugs or errors could result in unintended trades or actions. Always double-check transaction
          details before confirming, as blockchain transactions are irreversible.
        </p>
      </LegalSection>

      <LegalSection title="11. Acknowledgment of Risks">
        <p>
          By using VEIL, you acknowledge that you have read, understood, and accepted all risks outlined in this
          disclosure. You agree that you are solely responsible for your trading decisions and any resulting losses.
        </p>
        <p>
          If you do not understand these risks or are not comfortable accepting them, you should not use the Platform.
          Consider consulting with financial, legal, and technical advisors before participating in prediction markets.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact and Support">
        <p>
          If you have questions about these risks or need assistance, please contact us at:
          <br />
          Email: risk@veil.market
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
