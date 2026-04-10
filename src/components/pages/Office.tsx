import { useState, useRef, useCallback, useEffect, createContext, useContext } from 'react'
import { Header } from '../shared/Header.tsx'
import { SplitLayout } from '../shared/SplitLayout.tsx'
import { PreviewPanel, TcLabel, TcText, TcStatRow, TcStat } from '../shared/PreviewPanel.tsx'
import { BottomTicker } from '../shared/BottomTicker.tsx'
import { officeCategories } from '../../lib/categories.ts'
import { useToast } from '../ui/Toast.tsx'
import { Upload, FileText, Check, Clock, AlertTriangle, ExternalLink, TrendingUp, Users, ShoppingCart, Target, CreditCard, Shield, Wifi, Smartphone, Car, Building, Mail, Download, Globe, CheckCircle, Circle, Send, Inbox } from 'lucide-react'

interface Props { toggleTheme: () => void }

/* ================================================================
   MOCK DATA — echte MCKAY Zahlen, Phase 0
   ================================================================ */

// Buchhaltung — Erwartete Belege pro Monat (abgeleitet aus Subscriptions, Verträgen, Emails)
type BelegSource = 'portal' | 'email' | 'download' | 'post'
interface ErwarteterBeleg {
  id: string; vendor: string; description: string; amount: number; frequency: 'monatlich' | 'quartalsweise' | 'jährlich'
  source: BelegSource; sourceDetail: string; status: 'vorhanden' | 'fehlt' | 'überfällig'
  uploadDate?: string // when it was uploaded
}

const sourceIcons: Record<BelegSource, typeof Globe> = { portal: Globe, email: Mail, download: Download, post: FileText }
const sourceLabels: Record<BelegSource, string> = {
  portal: 'Online-Portal', email: 'E-Mail Postfach', download: 'PDF Download', post: 'Briefpost',
}

// April 2026 — erwartete Belege aus Beleg-Analyse + Excel Übersicht_Betriebskosten
// Source-Details aus Excel-Spalte "Rechnung an"
const erwarteteBelege: ErwarteterBeleg[] = [
  // ── Monatlich wiederkehrend ──
  { id: 'eb1', vendor: 'Vodafone', description: '2x Red Business Prime Plus', amount: 152.80, frequency: 'monatlich', source: 'portal', sourceDetail: 'Vodafone Portal → MeinVodafone → Rechnung', status: 'fehlt' },
  { id: 'eb2', vendor: 'Business Center Ulm', description: 'Geschäftsadresse Pauschale', amount: 105.91, frequency: 'monatlich', source: 'email', sourceDetail: 'bills@mckay.agency', status: 'fehlt' },
  { id: 'eb3', vendor: 'Apple (ChatGPT)', description: 'ChatGPT Plus', amount: 22.99, frequency: 'monatlich', source: 'email', sourceDetail: 'mehtikaymaz@gmail.com → "Deine Rechnung von Apple"', status: 'fehlt' },
  { id: 'eb4', vendor: 'Apple (iCloud)', description: 'iCloud+ 2 TB', amount: 9.99, frequency: 'monatlich', source: 'email', sourceDetail: 'mehtikaymaz@gmail.com → "Deine Rechnung von Apple"', status: 'fehlt' },
  { id: 'eb5', vendor: 'Canva', description: 'Pro Abo', amount: 12.00, frequency: 'monatlich', source: 'email', sourceDetail: 'bills@mckay.agency', status: 'fehlt' },
  { id: 'eb6', vendor: 'Wix', description: 'Premium Basic (mckay.agency)', amount: 19.04, frequency: 'monatlich', source: 'portal', sourceDetail: 'Wix Portal → Account → Rechnungen download', status: 'fehlt' },
  { id: 'eb7', vendor: 'Google Workspace', description: 'Business Starter', amount: 8.10, frequency: 'monatlich', source: 'portal', sourceDetail: 'Workspace Hebammenbüro → Admin → Abrechnung', status: 'fehlt' },
  { id: 'eb8', vendor: 'Resend', description: 'Transactional Pro', amount: 18.50, frequency: 'monatlich', source: 'email', sourceDetail: '1@mckay.agency per Email (~$20 USD)', status: 'fehlt' },
  { id: 'eb9', vendor: 'Lovable', description: 'Pro Plan', amount: 23.00, frequency: 'monatlich', source: 'portal', sourceDetail: 'Lovable Dashboard → Billing (~$25 USD)', status: 'fehlt' },
  { id: 'eb10', vendor: 'Stripe', description: 'Processing Fees', amount: 30.00, frequency: 'monatlich', source: 'email', sourceDetail: '1@mckay.agency → Stripe Tax Invoice (variabel)', status: 'fehlt' },
  { id: 'eb11', vendor: 'Finom', description: 'Extra Wallet', amount: 2.00, frequency: 'monatlich', source: 'portal', sourceDetail: 'app.finom.co → Rechnungen', status: 'fehlt' },
  { id: 'eb12', vendor: 'Strato', description: 'Domains + Mail', amount: 5.00, frequency: 'monatlich', source: 'portal', sourceDetail: 'Strato Portal → Mein Strato → Rechnungen download', status: 'fehlt' },
  // ── Neu ab 2026 ──
  { id: 'eb13', vendor: 'Anthropic', description: 'Claude Pro Max', amount: 200.00, frequency: 'monatlich', source: 'email', sourceDetail: '1@mckay.agency → Anthropic Receipt', status: 'fehlt' },
  { id: 'eb16', vendor: 'Pathway', description: 'Stripe-DATEV Schnittstelle', amount: 49.00, frequency: 'monatlich', source: 'email', sourceDetail: 'bills@mckay.agency → Pathway Solutions Rechnung', status: 'fehlt' },
  // ── Variable monatliche Ausgaben ──
  { id: 'eb14', vendor: 'Tankbelege', description: 'Betriebsfahrten (variabel)', amount: 160.00, frequency: 'monatlich', source: 'post', sourceDetail: 'Kassenbelege aufbewahren + fotografieren', status: 'fehlt' },
  // ── Quartalsweise ──
  { id: 'eb15', vendor: 'DATEV', description: 'Unternehmen Online', amount: 40.27, frequency: 'quartalsweise', source: 'portal', sourceDetail: 'Datev Portal / 1@mckay.agency', status: 'fehlt' },
]

// Buchhaltung — Steuerberaterin Workflow
const steuerTermine = {
  letzterUpload: '2026-04-08',
  letzteÜbermittlung: '2026-03-31',
  nächsteFälligkeit: '2026-04-30',
  periode: 'April 2026',
}

// Subscriptions — echte Daten aus 5-Monats-Beleg-Analyse
interface Subscription {
  id: string; name: string; plan: string; monthly: number; annual: number
  category: 'saas' | 'ai' | 'domain' | 'hosting' | 'telco' | 'office' | 'finance' | 'tools'
  status: 'active' | 'free' | 'cancelled'; url: string; currency: 'EUR' | 'USD'
}

const subscriptions: Subscription[] = [
  // ── Telco & Büro ──
  { id: 's1', name: 'Vodafone', plan: '2x Red Business Prime Plus', monthly: 152.80, annual: 1833.60, category: 'telco', status: 'active', url: 'vodafone.de', currency: 'EUR' },
  { id: 's2', name: 'Business Center Ulm', plan: 'Geschäftsadresse', monthly: 105.91, annual: 1270.92, category: 'office', status: 'active', url: 'bcu-ulm.de', currency: 'EUR' },
  // ── SaaS & Tools ──
  { id: 's3', name: 'Wix', plan: 'Premium Basic (mckay.agency)', monthly: 19.04, annual: 228.48, category: 'saas', status: 'active', url: 'wix.com', currency: 'EUR' },
  { id: 's4', name: 'Canva', plan: 'Pro', monthly: 12.00, annual: 144.00, category: 'saas', status: 'active', url: 'canva.com', currency: 'EUR' },
  { id: 's5', name: 'Google Workspace', plan: 'Business Starter (variabel)', monthly: 8.10, annual: 97.20, category: 'saas', status: 'active', url: 'admin.google.com', currency: 'EUR' },
  { id: 's6', name: 'Lovable', plan: 'Pro (variabel)', monthly: 23.00, annual: 276.00, category: 'saas', status: 'active', url: 'lovable.dev', currency: 'USD' },
  { id: 's7', name: 'Resend', plan: 'Transactional Pro', monthly: 18.50, annual: 222.00, category: 'saas', status: 'active', url: 'resend.com', currency: 'USD' },
  // ── AI ──
  { id: 's8', name: 'ChatGPT Plus', plan: 'via Apple App Store', monthly: 22.99, annual: 275.88, category: 'ai', status: 'active', url: 'chat.openai.com', currency: 'EUR' },
  { id: 's9', name: 'Apple iCloud+', plan: '2 TB', monthly: 9.99, annual: 119.88, category: 'tools', status: 'active', url: 'apple.com', currency: 'EUR' },
  // ── Finance ──
  { id: 's10', name: 'Stripe', plan: 'Processing Fees (variabel)', monthly: 30.00, annual: 360.00, category: 'finance', status: 'active', url: 'dashboard.stripe.com', currency: 'EUR' },
  { id: 's11', name: 'Finom', plan: 'Start + Extra Wallet', monthly: 10.33, annual: 123.96, category: 'finance', status: 'active', url: 'app.finom.co', currency: 'EUR' },
  { id: 's12', name: 'DATEV', plan: 'Unternehmen Online', monthly: 13.42, annual: 161.08, category: 'finance', status: 'active', url: 'datev.de', currency: 'EUR' },
  // ── Domains (Strato) ──
  { id: 's13', name: 'Strato Domains', plan: '4 Domains + Mail + SSL', monthly: 5.00, annual: 60.00, category: 'domain', status: 'active', url: 'strato.de', currency: 'EUR' },
  // ── Hosting (Free Tiers bestätigt) ──
  { id: 's14', name: 'Vercel', plan: 'Free', monthly: 0, annual: 0, category: 'hosting', status: 'free', url: 'vercel.com', currency: 'USD' },
  { id: 's15', name: 'Supabase', plan: 'Free', monthly: 0, annual: 0, category: 'hosting', status: 'free', url: 'supabase.com', currency: 'USD' },
  // ── Free ──
  { id: 's16', name: 'GitHub', plan: 'Free', monthly: 0, annual: 0, category: 'tools', status: 'free', url: 'github.com', currency: 'EUR' },
  { id: 's17', name: 'Stitch (Google)', plan: 'Free', monthly: 0, annual: 0, category: 'tools', status: 'free', url: 'stitch.withgoogle.com', currency: 'EUR' },
  // ── Jährlich (auf monatlich umgelegt) ──
  { id: 's18', name: 'Microsoft 365', plan: 'Family', monthly: 8.25, annual: 99.00, category: 'tools', status: 'active', url: 'microsoft.com', currency: 'EUR' },
  { id: 's19', name: 'Wix Stillzentrum', plan: 'Business (jährlich)', monthly: 40.46, annual: 485.52, category: 'saas', status: 'active', url: 'wix.com', currency: 'EUR' },
  // ── Neu 2026 ──
  { id: 's22', name: 'Anthropic Claude', plan: 'Pro Max ($200 flat)', monthly: 200.00, annual: 2400.00, category: 'ai', status: 'active', url: 'console.anthropic.com', currency: 'USD' },
  { id: 's23', name: 'Pathway Solutions', plan: 'Stripe-DATEV Schnittstelle', monthly: 49.00, annual: 588.00, category: 'finance', status: 'active', url: 'pathway-solutions.de', currency: 'EUR' },
  // ── Gekündigt (zuletzt in 2025, nicht mehr in 2026 Q1) ──
  { id: 's20', name: 'Superchat', plan: 'Professional', monthly: 235.62, annual: 2827.44, category: 'saas', status: 'cancelled', url: 'superchat.de', currency: 'EUR' },
  { id: 's21', name: 'WixEngine (Freelancer)', plan: 'IT Maintenance', monthly: 600.00, annual: 7200.00, category: 'saas', status: 'cancelled', url: '-', currency: 'EUR' },
]

const subCategoryColors: Record<string, string> = {
  saas: 'var(--bl)', ai: 'var(--p)', domain: 'var(--a)', hosting: '#00F0FF', telco: 'var(--o)', office: '#FF2DAA', finance: '#FFD600', tools: 'var(--g)',
}
const subCategoryLabels: Record<string, string> = {
  saas: 'SaaS', ai: 'AI', domain: 'Domains', hosting: 'Hosting', telco: 'Telco & Mobilfunk', office: 'Büro', finance: 'Finanzen', tools: 'Tools',
}

// Verträge
interface Vertrag {
  id: string; name: string; provider: string; type: string; monthly: number; start: string; end: string
  kuendigung: string; status: 'active' | 'expiring'
  icon: 'phone' | 'car' | 'wifi' | 'building' | 'shield' | 'card'
}

// Verträge — echte Daten aus Belegen. Laufzeiten/Kündigungsfristen sind geschätzt wo nicht aus PDFs ersichtlich.
const vertraege: Vertrag[] = [
  { id: 'v1', name: 'Mobilfunk (2 Linien)', provider: 'Vodafone', type: 'Telekommunikation', monthly: 152.80, start: '2024-01-01', end: '2026-12-31', kuendigung: '2026-09-30', status: 'active', icon: 'phone' },
  { id: 'v2', name: 'Geschäftsadresse', provider: 'Business Center Ulm', type: 'Büro', monthly: 105.91, start: '2024-01-01', end: '-', kuendigung: '-', status: 'active', icon: 'building' },
  { id: 'v3', name: 'Finom Start Geschäftskonto', provider: 'Finom', type: 'Banking', monthly: 8.33, start: '2025-04-01', end: '2026-04-01', kuendigung: '2026-03-01', status: 'active', icon: 'card' },
  { id: 'v4', name: 'Wix Stillzentrum (jährlich)', provider: 'Wix', type: 'Website', monthly: 40.46, start: '2025-12-15', end: '2026-12-15', kuendigung: '2026-11-15', status: 'active', icon: 'wifi' },
  { id: 'v5', name: 'Strato Mail Plus (jährlich)', provider: 'Strato', type: 'Email/Hosting', monthly: 5.00, start: '2026-01-22', end: '2027-01-21', kuendigung: '2026-12-21', status: 'active', icon: 'wifi' },
  { id: 'v6', name: 'Strato Domain hebammen.agency', provider: 'Strato', type: 'Domain', monthly: 2.00, start: '2025-12-13', end: '2026-12-13', kuendigung: '2026-11-13', status: 'active', icon: 'wifi' },
  { id: 'v7', name: 'Microsoft 365 Family', provider: 'Microsoft', type: 'Software', monthly: 8.25, start: '2026-01-09', end: '2027-01-09', kuendigung: '2026-12-09', status: 'active', icon: 'shield' },
]

// Icon mapping for Verträge
const vertragIcons: Record<string, typeof Smartphone> = {
  phone: Smartphone, car: Car, wifi: Wifi, building: Building, shield: Shield, card: CreditCard,
}

/* ================================================================
   HELPER COMPONENTS — inline, kein extra File
   ================================================================ */

function KpiCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 5, letterSpacing: 0.3 }}>{label}</div>
    </div>
  )
}

function KpiRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', gap: 8 }}>{children}</div>
}

function StatusBadge({ status, label }: { status: 'green' | 'yellow' | 'orange' | 'blue' | 'red'; label: string }) {
  const colors = { green: '#00FF88', yellow: '#FFD600', orange: '#FF6B2C', blue: 'var(--bl)', red: '#FF2D55' }
  const c = colors[status]
  return (
    <span style={{ fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: `${c}15`, color: c, letterSpacing: 0.5 }}>
      {label}
    </span>
  )
}

function ProgressBar({ progress, color, height = 5 }: { progress: number; color: string; height?: number }) {
  return (
    <div style={{ width: '100%', height, borderRadius: height / 2, background: 'rgba(255,255,255,0.06)' }}>
      <div style={{ width: `${Math.min(100, Math.max(0, progress))}%`, height: '100%', borderRadius: height / 2, background: color, transition: 'width 0.5s ease' }} />
    </div>
  )
}

/* ================================================================
   FOLDER STATUS — live from iCloud BUCHHALTUNG
   ================================================================ */

interface FolderStatus { vendorsFound: string[]; totalFiles: number; files: { filename: string; vendor: string }[] }
const FolderCtx = createContext<{ status: FolderStatus | null; refresh: () => void }>({ status: null, refresh: () => {} })

function useFolderStatus() { return useContext(FolderCtx) }

function FolderStatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<FolderStatus | null>(null)
  const refresh = useCallback(() => {
    const now = new Date()
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const y = prev.getFullYear()
    const m = String(prev.getMonth() + 1).padStart(2, '0')
    fetch(`/api/belege/check-folder?year=${y}&month=${m}`)
      .then(r => r.json())
      .then(data => setStatus({ vendorsFound: data.vendorsFound || [], totalFiles: data.totalFiles || 0, files: data.files || [] }))
      .catch(() => {})
  }, [])
  useEffect(() => { refresh() }, [refresh])
  return <FolderCtx.Provider value={{ status, refresh }}>{children}</FolderCtx.Provider>
}

// Derive real status from folder contents
function getErwarteteBelegeWithStatus(folderStatus: FolderStatus | null) {
  return erwarteteBelege.map(b => {
    if (!folderStatus) return b
    // Check if this vendor has a file in the folder
    const found = folderStatus.vendorsFound.some(v => v.toLowerCase() === b.vendor.toLowerCase() || v.toLowerCase().includes(b.vendor.toLowerCase().split(' ')[0]))
      || folderStatus.files.some(f => f.filename.toLowerCase().includes(b.vendor.toLowerCase().split('(')[0].trim().split(' ')[0].toLowerCase()))
    return { ...b, status: found ? 'vorhanden' as const : b.status }
  })
}

/* ================================================================
   TAB CONTENT BUILDERS
   ================================================================ */

// ── BUCHHALTUNG ──────────────────────────────────────────────

function BuchhaltungUebersicht() {
  const { status: folderStatus } = useFolderStatus()
  const belege = getErwarteteBelegeWithStatus(folderStatus)
  const vorhanden = belege.filter(b => b.status === 'vorhanden').length
  const fehlend = belege.filter(b => b.status === 'fehlt').length
  const ueberfaellig = belege.filter(b => b.status === 'überfällig').length
  const total = belege.length
  const pct = Math.round((vorhanden / total) * 100)
  const totalAmount = belege.reduce((s, b) => s + b.amount, 0)
  const barColor = pct === 100 ? '#00FF88' : pct >= 50 ? '#FFD600' : '#FF6B2C'

  return (
    <>
      {/* Vollständigkeit — Hero */}
      <div style={{ padding: '16px 18px', borderRadius: 12, background: `${barColor}06`, border: `1px solid ${barColor}18` }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tx)' }}>{steuerTermine.periode}</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, fontWeight: 700, color: barColor }}>{pct}%</span>
            <span style={{ fontSize: 10, color: 'var(--tx3)' }}>vollständig</span>
          </div>
        </div>
        <ProgressBar progress={pct} color={barColor} />
        <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 6 }}>
          {vorhanden} von {total} Belegen vorhanden{fehlend > 0 ? ` · ${fehlend} fehlen` : ''}{ueberfaellig > 0 ? ` · ${ueberfaellig} überfällig` : ''}
        </div>
      </div>

      {/* KPIs — eine Reihe */}
      <KpiRow>
        <KpiCard value={`€${totalAmount.toFixed(0)}`} label="Rechnungssumme" color="var(--bl)" />
        <KpiCard value={`${total}`} label="Erwartet" color="var(--a)" />
        <KpiCard value={`${fehlend + ueberfaellig}`} label="Fehlen" color={fehlend > 0 ? '#FFD600' : '#00FF88'} />
        <KpiCard value={`${vorhanden}`} label="Vorhanden" color="#00FF88" />
      </KpiRow>

      {/* Steuerberaterin Timeline */}
      <TcLabel>Steuerberaterin</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {[
          { label: 'Letzter Upload', value: steuerTermine.letzterUpload, color: 'var(--bl)' },
          { label: 'Letzte Übermittlung', value: steuerTermine.letzteÜbermittlung, color: '#00FF88' },
          { label: 'Nächste Fälligkeit', value: steuerTermine.nächsteFälligkeit, color: '#FFD600' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{row.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: row.color }}>{row.value}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// Kontoauszug transaction type — from parsed bank statement
interface KontoauszugTransaction {
  date: string
  vendor: string
  description: string
  amount: number
  type: 'expense' | 'income'
  wallet: string
  matchedVendor: string | null
  hasFile: boolean
}

function BuchhaltungBelege() {
  const [dragOver, setDragOver] = useState(false)
  const [filter, setFilter] = useState<'alle' | 'fehlt' | 'vorhanden'>('alle')
  const [uploading, setUploading] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [scanResults, setScanResults] = useState<Array<{ vendor: string; filename: string; from: string; subject: string; account: string }> | null>(null)
  const [uploadedIds, setUploadedIds] = useState<Set<string>>(new Set())
  const [kontoauszugTx, setKontoauszugTx] = useState<KontoauszugTransaction[]>([])
  const [parsingKontoauszug, setParsingKontoauszug] = useState(false)
  const [kontoauszugPeriod, setKontoauszugPeriod] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const kontoauszugInputRef = useRef<HTMLInputElement>(null)
  const { addToast, updateToast } = useToast()
  const { status: folderStatus, refresh: refreshFolder } = useFolderStatus()
  const belege = getErwarteteBelegeWithStatus(folderStatus)

  // Vendor alias map: kontoauszug matched vendor → hardcoded vendor names
  const vendorAliases: Record<string, string[]> = {
    'anthropic': ['anthropic', 'claude'],
    'bcu': ['business center', 'bcu'],
    'google_workspace': ['google workspace', 'google'],
    'google_one': ['google', 'google one'],
    'apple': ['apple (chatgpt)', 'apple (icloud)', 'apple'],
    'finom': ['finom', 'pnl fintech'],
  }

  // Merge hardcoded belege with dynamic kontoauszug transactions
  const kontoauszugBelege: ErwarteterBeleg[] = kontoauszugTx
    .filter(tx => tx.type === 'expense') // Only expenses need receipts
    .filter(tx => !belege.some(b => {
      // Skip if already covered by hardcoded erwartete Belege
      const txVendor = (tx.matchedVendor || tx.vendor).toLowerCase()
      const bVendor = b.vendor.toLowerCase()

      // Direct match by first word
      const txFirst = txVendor.split(/[\s_(]/)[0]
      const bFirst = bVendor.split(/[\s_(]/)[0]
      if (txFirst === bFirst || txFirst.includes(bFirst) || bFirst.includes(txFirst)) return true

      // Check alias map
      const aliases = vendorAliases[txVendor] || vendorAliases[txFirst]
      if (aliases) {
        return aliases.some(a => bVendor.includes(a) || a.includes(bFirst))
      }

      return false
    }))
    .map((tx, i) => ({
      id: `ka-${i}`,
      vendor: tx.matchedVendor || tx.vendor,
      description: `Kontoauszug: ${tx.description.substring(0, 50)}`,
      amount: tx.amount,
      frequency: 'monatlich' as const,
      source: 'download' as BelegSource,
      sourceDetail: `Finom Kontoauszug ${tx.date}`,
      status: tx.hasFile ? 'vorhanden' as const : 'fehlt' as const,
    }))

  const allBelege = [...belege, ...kontoauszugBelege]

  const filtered = filter === 'alle' ? allBelege
    : allBelege.filter(b => filter === 'fehlt' ? (b.status === 'fehlt' || b.status === 'überfällig') : b.status === 'vorhanden')

  const fehlend = allBelege.filter(b => b.status === 'fehlt' || b.status === 'überfällig').length
  const vorhanden = allBelege.filter(b => b.status === 'vorhanden').length

  // ─── Kontoauszug upload handler ────────────────────────────
  const handleKontoauszugUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      addToast({ type: 'error', title: 'Nur PDF-Dateien', message: 'Bitte einen Finom Kontoauszug als PDF hochladen.', duration: 4000 })
      return
    }

    setParsingKontoauszug(true)
    const toastId = addToast({ type: 'loading', title: 'Kontoauszug wird analysiert...' })

    try {
      const reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const resp = await fetch('/api/belege/parse-kontoauszug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: base64, filename: file.name }),
      })
      const data = await resp.json()

      if (data.ok) {
        setKontoauszugTx(data.transactions || [])
        setKontoauszugPeriod(data.period ? `${data.period.von} - ${data.period.bis}` : '')
        const expenses = (data.transactions || []).filter((t: KontoauszugTransaction) => t.type === 'expense')
        const missing = expenses.filter((t: KontoauszugTransaction) => !t.hasFile)
        updateToast(toastId, {
          type: 'success',
          title: `${data.transactionCount} Transaktionen erkannt`,
          message: `${expenses.length} Ausgaben, ${missing.length} ohne Beleg`,
          duration: 5000,
        })
        refreshFolder()
      } else {
        updateToast(toastId, { type: 'error', title: 'Parsing fehlgeschlagen', message: data.error, duration: 5000 })
      }
    } catch (err) {
      updateToast(toastId, { type: 'error', title: 'Fehler', message: (err as Error).message, duration: 5000 })
    }

    setParsingKontoauszug(false)
  }, [addToast, updateToast, refreshFolder])

  // ─── Upload handler ─────────────────────────────────────────
  const handleUpload = useCallback(async (files: FileList | null, vendorHint?: string, belegId?: string) => {
    if (!files || files.length === 0) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const toastId = addToast({ type: 'loading', title: `Lade hoch: ${file.name}` })

      try {
        const reader = new FileReader()
        const base64 = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result as string
            resolve(result.split(',')[1]) // strip data:...;base64,
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const resp = await fetch('/api/belege/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            data: base64,
            vendor: vendorHint || '',
            description: file.name,
            erwarteterBelegId: belegId || '',
          }),
        })
        const data = await resp.json()

        if (data.ok) {
          updateToast(toastId, { type: 'success', title: 'Beleg hochgeladen', message: data.beleg?.filename || file.name, duration: 3000 })
          if (belegId) setUploadedIds(prev => new Set(prev).add(belegId))
        } else {
          updateToast(toastId, { type: 'error', title: 'Upload fehlgeschlagen', message: data.error, duration: 5000 })
        }
      } catch (err) {
        updateToast(toastId, { type: 'error', title: 'Upload Fehler', message: (err as Error).message, duration: 5000 })
      }
    }

    setUploading(false)
  }, [addToast, updateToast])

  // ─── Drag & Drop handler ────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }, [handleUpload])

  // ─── Email scan handler ─────────────────────────────────────
  // SSE-based: streams progress, runs in background, toast updates live
  const handleScanEmail = useCallback(() => {
    setScanning(true)
    const now = new Date()
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const targetMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`
    const monthName = prev.toLocaleString('de-DE', { month: 'long', year: 'numeric' })

    const toastId = addToast({ type: 'loading', title: `Belege-Scan: ${monthName}`, message: 'Verbinde mit Postfächern...' })

    // SSE connection — stays alive even on navigation (EventSource is global)
    const es = new EventSource(`/api/belege/scan-email?targetMonth=${targetMonth}`)

    es.addEventListener('progress', (e) => {
      try {
        const d = JSON.parse(e.data)
        if (d.step === 'start') {
          updateToast(toastId, { message: `0/${d.total} Postfächer gescannt`, progress: 0 })
        } else if (d.step === 'account-done') {
          const pct = Math.round((d.current / d.total) * 100)
          updateToast(toastId, { message: `${d.current}/${d.total} Postfächer · ${d.savedSoFar || 0} Belege gefunden`, progress: pct })
        } else if (d.step === 'account-error') {
          const pct = Math.round((d.current / d.total) * 100)
          updateToast(toastId, { message: `${d.current}/${d.total} · ${d.account.split('@')[0]}@ nicht erreichbar`, progress: pct })
        }
      } catch { /* parse error, ignore */ }
    })

    es.addEventListener('done', (e) => {
      es.close()
      try {
        const data = JSON.parse(e.data)
        const count = data.saved?.length || 0
        const skippedCount = data.skipped?.length || 0
        const errorCount = data.errors ? Object.keys(data.errors).length : 0

        updateToast(toastId, {
          type: count > 0 ? 'success' : 'info',
          title: count > 0 ? `${count} Belege extrahiert & gespeichert` : 'Keine neuen Rechnungen',
          message: count > 0
            ? `→ BUCHHALTUNG/${targetMonth.replace('-', '/')}/` + (skippedCount > 0 ? ` · ${skippedCount} übersprungen` : '') + (errorCount > 0 ? ` · ${errorCount} Fehler` : '')
            : `Alle Postfächer geprüft` + (skippedCount > 0 ? ` · ${skippedCount} ohne PDF` : '') + (errorCount > 0 ? ` · ${errorCount} nicht erreichbar` : ''),
          duration: 6000,
        })

        if (errorCount > 0) {
          addToast({ type: 'warning', title: `${errorCount} Postfächer fehlgeschlagen`, message: Object.entries(data.errors).map(([k, v]) => `${k}: ${String(v).slice(0, 30)}`).join(' · '), duration: 8000 })
        }

        try { setScanResults(data.saved || []) } catch { /* unmounted */ }
        refreshFolder() // Update folder status after scan
      } catch { /* parse error */ }
      try { setScanning(false) } catch { /* unmounted */ }
    })

    es.addEventListener('error', () => {
      es.close()
      updateToast(toastId, { type: 'error', title: 'Scan abgebrochen', message: 'Verbindung zum Server verloren', duration: 5000 })
      try { setScanning(false) } catch { /* unmounted */ }
    })
  }, [addToast, updateToast])

  // ─── Mark receipt handler ───────────────────────────────────
  const handleMark = useCallback(async (belegId: string, vendor: string) => {
    const toastId = addToast({ type: 'loading', title: `Markiere ${vendor}...` })

    try {
      const resp = await fetch('/api/belege/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ erwarteterBelegId: belegId, status: 'vorhanden' }),
      })
      const data = await resp.json()

      if (data.ok) {
        updateToast(toastId, { type: 'success', title: `${vendor} markiert`, message: 'Als vorhanden markiert', duration: 3000 })
        setUploadedIds(prev => new Set(prev).add(belegId))
      } else {
        updateToast(toastId, { type: 'error', title: 'Fehler', message: data.error, duration: 5000 })
      }
    } catch (err) {
      updateToast(toastId, { type: 'error', title: 'Fehler', message: (err as Error).message, duration: 5000 })
    }
  }, [addToast, updateToast])

  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.heic"
        multiple
        style={{ display: 'none' }}
        onChange={e => handleUpload(e.target.files)}
      />
      {/* Hidden kontoauszug file input */}
      <input
        ref={kontoauszugInputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={e => handleKontoauszugUpload(e.target.files)}
      />

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? 'var(--bl)' : uploading ? '#00F0FF55' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: 14, padding: '20px 16px', textAlign: 'center',
          background: dragOver ? 'rgba(0, 145, 255, 0.05)' : uploading ? 'rgba(0, 240, 255, 0.03)' : 'transparent',
          transition: 'all 0.2s ease', cursor: uploading ? 'wait' : 'pointer',
          opacity: uploading ? 0.7 : 1,
        }}
      >
        <Upload size={20} color={dragOver ? 'var(--bl)' : 'var(--tx3)'} style={{ margin: '0 auto 6px' }} />
        <div style={{ fontSize: 12, fontWeight: 600, color: dragOver ? 'var(--bl)' : 'var(--tx2)' }}>
          {uploading ? 'Wird hochgeladen...' : 'Beleg hochladen — Drag & Drop oder Klick'}
        </div>
        <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 3 }}>
          Auto-Rename: Datum_Anbieter_Typ.pdf
        </div>
      </div>

      {/* Action Buttons: Scan Email + Kontoauszug */}
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={handleScanEmail}
          disabled={scanning}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(0,240,255,0.15)',
            background: scanning ? 'rgba(0,240,255,0.08)' : 'rgba(0,240,255,0.04)',
            color: '#00F0FF', fontSize: 11, fontWeight: 700, cursor: scanning ? 'wait' : 'pointer',
            transition: 'all 0.2s ease', letterSpacing: 0.3,
          }}
        >
          <Inbox size={14} />
          {scanning ? 'Scan läuft im Hintergrund...' : 'E-Mail-Postfächer scannen'}
        </button>
        <button
          onClick={() => kontoauszugInputRef.current?.click()}
          disabled={parsingKontoauszug}
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(139,92,246,0.2)',
            background: parsingKontoauszug ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.04)',
            color: '#8B5CF6', fontSize: 11, fontWeight: 700, cursor: parsingKontoauszug ? 'wait' : 'pointer',
            transition: 'all 0.2s ease', letterSpacing: 0.3,
          }}
        >
          <CreditCard size={14} />
          {parsingKontoauszug ? 'Wird analysiert...' : 'Kontoauszug hochladen'}
        </button>
      </div>

      {/* Scan Results (if any) */}
      {scanResults && scanResults.length > 0 && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(0,240,255,0.04)', border: '1px solid rgba(0,240,255,0.1)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#00F0FF', marginBottom: 8, letterSpacing: 0.5 }}>
            GEFUNDENE RECHNUNGS-EMAILS ({scanResults.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {scanResults.slice(0, 8).map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <Mail size={10} color="var(--tx3)" />
                <span style={{ fontSize: 10, color: 'var(--tx2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.subject}</span>
                <span style={{ fontSize: 9, color: 'var(--tx3)', flexShrink: 0 }}>{r.date}</span>
                <span style={{ fontSize: 9, color: 'var(--tx3)', flexShrink: 0 }}>{r.account.split('@')[0]}</span>
              </div>
            ))}
            {scanResults.length > 8 && (
              <div style={{ fontSize: 9, color: 'var(--tx3)', textAlign: 'center', marginTop: 2 }}>
                +{scanResults.length - 8} weitere
              </div>
            )}
          </div>
        </div>
      )}

      {/* Kontoauszug Summary — shown after upload */}
      {kontoauszugTx.length > 0 && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8B5CF6', letterSpacing: 0.5 }}>
              KONTOAUSZUG {kontoauszugPeriod}
            </div>
            <div style={{ fontSize: 9, color: 'var(--tx3)' }}>
              {kontoauszugTx.length} Transaktionen · {kontoauszugBelege.length} neue Belege erkannt
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: '#FF6B2C' }}>
                {kontoauszugTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0).toFixed(2)}
              </span>
              <span style={{ fontSize: 9, color: 'var(--tx3)' }}>Ausgaben</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: '#00FF88' }}>
                {kontoauszugTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0).toFixed(2)}
              </span>
              <span style={{ fontSize: 9, color: 'var(--tx3)' }}>Einnahmen</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([['alle', `Alle (${allBelege.length})`], ['fehlt', `Fehlt (${fehlend})`], ['vorhanden', `Vorhanden (${vorhanden})`]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              fontSize: 10, fontWeight: 600, padding: '5px 12px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: filter === key ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: filter === key ? 'var(--tx)' : 'var(--tx3)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Beleg-Checkliste */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map(b => {
          const SourceIcon = sourceIcons[b.source]
          const isJustUploaded = uploadedIds.has(b.id)
          const effectiveStatus = isJustUploaded ? 'vorhanden' : b.status
          const statusColor = effectiveStatus === 'vorhanden' ? '#00FF88' : effectiveStatus === 'überfällig' ? '#FF6B2C' : '#FFD600'
          const isFromKontoauszug = b.id.startsWith('ka-')
          return (
            <div key={b.id} className="ghost-card" style={{ padding: '12px 14px', '--hc': `${statusColor}08` } as React.CSSProperties}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Status Icon */}
                {effectiveStatus === 'vorhanden'
                  ? <CheckCircle size={16} color="#00FF88" />
                  : <Circle size={16} color={statusColor} />
                }
                {/* Vendor + Description */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{b.vendor}</span>
                    <StatusBadge
                      status={effectiveStatus === 'vorhanden' ? 'green' : effectiveStatus === 'überfällig' ? 'orange' : 'yellow'}
                      label={effectiveStatus === 'vorhanden' ? 'Vorhanden' : effectiveStatus === 'überfällig' ? 'Überfällig' : 'Fehlt'}
                    />
                    {isFromKontoauszug && (
                      <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', letterSpacing: 0.5 }}>KONTOAUSZUG</span>
                    )}
                    {isJustUploaded && (
                      <span style={{ fontSize: 8, color: '#00FF88', fontWeight: 700, letterSpacing: 0.5 }}>NEU</span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>{b.description} · {b.frequency}</div>
                </div>
                {/* Amount */}
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: statusColor, whiteSpace: 'nowrap' }}>
                  €{b.amount.toFixed(2)}
                </div>
              </div>

              {/* Source hint — wo findet man den Beleg */}
              <div style={{ marginTop: 8, marginLeft: 26, padding: '6px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <SourceIcon size={11} color="var(--tx3)" />
                <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{sourceLabels[b.source]}:</span>
                <span style={{ fontSize: 10, color: 'var(--tx2)', flex: 1 }}>{b.sourceDetail}</span>
              </div>

              {/* Action buttons for missing receipts */}
              {effectiveStatus !== 'vorhanden' && (
                <div style={{ marginTop: 8, marginLeft: 26, display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => {
                      // Create a file input specific to this receipt
                      const input = document.createElement('input')
                      input.type = 'file'
                      input.accept = '.pdf,.png,.jpg,.jpeg,.heic'
                      input.onchange = () => handleUpload(input.files, b.vendor, b.id)
                      input.click()
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(0,240,255,0.15)',
                      background: 'rgba(0,240,255,0.06)', color: '#00F0FF',
                      fontSize: 9, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <Upload size={10} /> Hochladen
                  </button>
                  <button
                    onClick={() => handleMark(b.id, b.vendor)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 6, border: '1px solid rgba(0,255,136,0.15)',
                      background: 'rgba(0,255,136,0.06)', color: '#00FF88',
                      fontSize: 9, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    <Check size={10} /> Als vorhanden markieren
                  </button>
                </div>
              )}

              {/* Upload date if vorhanden */}
              {(b.uploadDate || isJustUploaded) && (
                <div style={{ marginTop: 4, marginLeft: 26, fontSize: 9, color: 'var(--tx3)' }}>
                  Hochgeladen: {b.uploadDate || new Date().toISOString().split('T')[0]}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

function BuchhaltungDatev() {
  return (
    <>
      <TcLabel>Datev Unternehmen Online</TcLabel>
      <div className="ghost-card" style={{ padding: '18px 20px', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--tx)' }}>Schnittstelle</span>
          <StatusBadge status="blue" label="Geplant" />
        </div>
        <TcText>Datev-Anbindung wird in einer späteren Phase ausgebaut. Aktuell werden Belege manuell an die Steuerberaterin übermittelt.</TcText>
      </div>

      <TcLabel>Aktueller Workflow</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { step: '1', label: 'Belege im Beleg-Tab sammeln', icon: Upload, color: 'var(--bl)' },
          { step: '2', label: 'Vollständigkeit prüfen (alle grün)', icon: CheckCircle, color: '#00FF88' },
          { step: '3', label: 'Belege an Steuerberaterin senden', icon: Send, color: 'var(--p)' },
          { step: '4', label: 'USt-Voranmeldung prüfen (quartalsweise)', icon: FileText, color: 'var(--a)' },
        ].map(s => (
          <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={13} color={s.color} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── SUBSCRIPTIONS ─────────────────────────────────────────────

function SubscriptionsUebersicht() {
  const totalMonthly = subscriptions.reduce((s, sub) => s + sub.monthly, 0)
  const activeCount = subscriptions.filter(s => s.status === 'active').length
  const freeCount = subscriptions.filter(s => s.status === 'free').length
  return (
    <>
      <KpiRow>
        <KpiCard value={`€${totalMonthly.toFixed(0)}`} label="Pro Monat" color="var(--p)" />
        <KpiCard value={`€${Math.round(totalMonthly * 12).toLocaleString()}`} label="Pro Jahr" color="var(--bl)" />
        <KpiCard value={`${activeCount}`} label="Aktiv" color="#00FF88" />
        <KpiCard value={`${freeCount}`} label="Free" color="var(--a)" />
      </KpiRow>

      <TcLabel>Top 5 Kosten</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {subscriptions.filter(s => s.monthly > 0).sort((a, b) => b.monthly - a.monthly).slice(0, 5).map((s, i) => {
          const pct = (s.monthly / totalMonthly) * 100
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--tx3)', width: 14, textAlign: 'right' }}>{i + 1}</span>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: subCategoryColors[s.category], flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--tx)', flex: 1 }}>{s.name}</span>
              <div style={{ width: 60 }}><ProgressBar progress={pct} color={subCategoryColors[s.category]} /></div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: subCategoryColors[s.category], width: 65, textAlign: 'right' }}>
                €{s.monthly.toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

function SubscriptionsServices() {
  return (
    <>
      <TcLabel>Alle Services ({subscriptions.length})</TcLabel>
      {/* Table header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 2px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontSize: 9, color: 'var(--tx3)', width: 6 }} />
        <span style={{ fontSize: 9, color: 'var(--tx3)', flex: 1, letterSpacing: 0.5 }}>SERVICE</span>
        <span style={{ fontSize: 9, color: 'var(--tx3)', width: 55, textAlign: 'right', letterSpacing: 0.5 }}>KATEGORIE</span>
        <span style={{ fontSize: 9, color: 'var(--tx3)', width: 65, textAlign: 'right', letterSpacing: 0.5 }}>BETRAG</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {subscriptions.map(s => {
          const catColor = subCategoryColors[s.category]
          return (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 2px', borderBottom: '1px solid rgba(255,255,255,0.025)', cursor: 'default' }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: catColor, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                <div style={{ fontSize: 9, color: 'var(--tx3)', marginTop: 1 }}>{s.plan}{s.currency === 'USD' ? ' (USD)' : ''}</div>
              </div>
              <span style={{ fontSize: 9, color: catColor, width: 55, textAlign: 'right', fontWeight: 600 }}>
                {subCategoryLabels[s.category]}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: s.monthly > 0 ? 'var(--tx)' : 'var(--tx3)', width: 65, textAlign: 'right' }}>
                {s.monthly > 0 ? `€${s.monthly.toFixed(2)}` : 'Free'}
              </span>
            </div>
          )
        })}
      </div>
    </>
  )
}

function SubscriptionsKosten() {
  const allCats = ['telco', 'office', 'saas', 'hosting', 'ai', 'finance', 'domain', 'tools'] as const
  const totalMonthly = subscriptions.reduce((s, sub) => s + sub.monthly, 0)
  // Only show categories that have services
  const activeCats = allCats.filter(cat => subscriptions.some(s => s.category === cat))

  return (
    <>
      {/* Gesamt — prominent oben */}
      <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx)' }}>Gesamt / Monat</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: 'var(--p)' }}>
            €{totalMonthly.toFixed(2)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 10, color: 'var(--tx3)' }}>Hochgerechnet / Jahr</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--tx2)' }}>
            €{Math.round(totalMonthly * 12).toLocaleString()}
          </span>
        </div>
      </div>

      <TcLabel>Aufschlüsselung nach Kategorie</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {activeCats.map(cat => {
          const subs = subscriptions.filter(s => s.category === cat)
          const catTotal = subs.reduce((s, sub) => s + sub.monthly, 0)
          const pct = totalMonthly > 0 ? (catTotal / totalMonthly) * 100 : 0
          return (
            <div key={cat}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: subCategoryColors[cat] }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx)' }}>{subCategoryLabels[cat]}</span>
                  <span style={{ fontSize: 9, color: 'var(--tx3)' }}>({subs.length})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: subCategoryColors[cat] }}>
                    €{catTotal.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--tx3)' }}>{Math.round(pct)}%</span>
                </div>
              </div>
              <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ width: `${Math.min(100, pct)}%`, height: '100%', borderRadius: 3, background: subCategoryColors[cat], transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ── VERTRÄGE ──────────────────────────────────────────────────

function calcVertragProgress(start: string, end: string): number {
  if (end === '-') return 50 // Unbefristet
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  const now = Date.now()
  if (now >= e) return 100
  if (now <= s) return 0
  return ((now - s) / (e - s)) * 100
}

function daysUntil(dateStr: string): number {
  if (dateStr === '-') return Infinity
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
}

function VertraegeUebersicht() {
  const activeCount = vertraege.length
  const monthlyTotal = vertraege.reduce((s, v) => s + v.monthly, 0)
  // Nächste Kündigung: nur zukünftige, sortiert nach Datum
  const futureKuendigungen = vertraege.filter(v => v.kuendigung !== '-' && daysUntil(v.kuendigung) > 0).sort((a, b) => daysUntil(a.kuendigung) - daysUntil(b.kuendigung))
  const pastKuendigungen = vertraege.filter(v => v.kuendigung !== '-' && daysUntil(v.kuendigung) <= 0)
  const expiringCount = vertraege.filter(v => {
    const d = daysUntil(v.end)
    return v.end !== '-' && d <= 90
  }).length
  return (
    <>
      <KpiRow>
        <KpiCard value={`${activeCount}`} label="Aktive Verträge" color="var(--a)" />
        <KpiCard value={`€${monthlyTotal.toFixed(0)}`} label="Monatlich" color="var(--bl)" />
        <KpiCard value={futureKuendigungen[0] ? `${daysUntil(futureKuendigungen[0].kuendigung)}d` : '—'} label="Nächste Künd." color="#FFD600" />
        <KpiCard value={`${expiringCount + pastKuendigungen.length}`} label="Achtung" color={expiringCount + pastKuendigungen.length > 0 ? '#FF6B2C' : '#00FF88'} />
      </KpiRow>

      {/* Vergangene Kündigungsfristen = Warnung */}
      {pastKuendigungen.length > 0 && (
        <div style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,45,85,0.06)', border: '1px solid rgba(255,45,85,0.15)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={14} color="#FF2D55" />
          <div style={{ fontSize: 11, color: '#FF2D55' }}>
            {pastKuendigungen.map(v => `${v.name} (${v.provider})`).join(', ')} — Kündigungsfrist abgelaufen!
          </div>
        </div>
      )}

      {futureKuendigungen.length > 0 && (
        <>
          <TcLabel>Nächste Kündigungsfristen</TcLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {futureKuendigungen.slice(0, 4).map(v => {
              const days = daysUntil(v.kuendigung)
              const urgent = days <= 90
              return (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{v.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{v.kuendigung}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: urgent ? '#FF6B2C' : 'var(--tx3)' }}>
                      {days}d
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </>
  )
}

function VertragRow({ v }: { v: Vertrag }) {
  const Icon = vertragIcons[v.icon] || FileText
  const progress = calcVertragProgress(v.start, v.end)
  const daysLeft = daysUntil(v.end)
  const isExpiring = daysLeft <= 90 && v.end !== '-'
  return (
    <div className="ghost-card" style={{ padding: '14px 16px', '--hc': 'rgba(255,255,255,0.04)' } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={isExpiring ? '#FF6B2C' : 'var(--a)'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>{v.name}</span>
            {isExpiring && <StatusBadge status="orange" label={`${daysLeft}d`} />}
            {v.end === '-' && <StatusBadge status="blue" label="Unbefristet" />}
          </div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>
            {v.provider} · {v.type} · {v.start} → {v.end}
          </div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: v.monthly > 0 ? 'var(--a)' : 'var(--tx3)' }}>
          {v.monthly > 0 ? `€${v.monthly.toFixed(2)}` : '—'}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <ProgressBar progress={progress} color={isExpiring ? '#FF6B2C' : 'var(--a)'} />
        </div>
        <span style={{ fontSize: 9, color: 'var(--tx3)', whiteSpace: 'nowrap' }}>{Math.round(progress)}% Laufzeit</span>
      </div>
      {v.kuendigung !== '-' && (
        <div style={{ fontSize: 10, color: isExpiring ? '#FF6B2C' : 'var(--tx3)', marginTop: 6 }}>
          Kündigungsfrist: {v.kuendigung} ({daysUntil(v.kuendigung)} Tage)
        </div>
      )}
    </div>
  )
}

function VertraegeAktiv() {
  return (
    <>
      <TcLabel>Aktive Verträge ({vertraege.length})</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {vertraege.map(v => <VertragRow key={v.id} v={v} />)}
      </div>
    </>
  )
}

function VertraegeAuslaufend() {
  const expiring = vertraege.filter(v => daysUntil(v.end) <= 90 && v.end !== '-')
  return (
    <>
      <TcLabel>Auslaufend in 90 Tagen ({expiring.length})</TcLabel>
      {expiring.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', color: 'var(--tx3)', fontSize: 12 }}>
          <Check size={20} color="#00FF88" style={{ margin: '0 auto 8px' }} />
          Keine Verträge laufen in den nächsten 90 Tagen aus.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {expiring.map(v => <VertragRow key={v.id} v={v} />)}
        </div>
      )}

      <TcLabel>Nächste Kündigungsfristen</TcLabel>
      {vertraege.filter(v => v.kuendigung !== '-').sort((a, b) => daysUntil(a.kuendigung) - daysUntil(b.kuendigung)).slice(0, 4).map(v => (
        <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <span style={{ fontSize: 12, color: 'var(--tx2)' }}>{v.name}</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: daysUntil(v.kuendigung) <= 90 ? '#FF6B2C' : 'var(--tx3)' }}>
            {v.kuendigung} ({daysUntil(v.kuendigung)}d)
          </span>
        </div>
      ))}
    </>
  )
}

// ── KUNDEN ────────────────────────────────────────────────────

function KundenUebersicht() {
  return (
    <>
      <KpiRow>
        <KpiCard value="2" label="Businesses" color="var(--g)" />
        <KpiCard value="~€800" label="Revenue/Mo" color="#00FF88" />
        <KpiCard value="~112" label="Kunden" color="var(--a)" />
        <KpiCard value="€66.6k" label="Pipeline ARR" color="var(--p)" />
      </KpiRow>
      <TcLabel>Revenue Split</TcLabel>
      <div style={{ display: 'flex', gap: 10 }}>
        <div className="ghost-card" style={{ flex: 1, padding: '14px 16px', textAlign: 'center', '--hc': 'rgba(0,255,136,0.05)' } as React.CSSProperties}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: '#00FF88' }}>€800</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>Hebammen.Agency</div>
          <div style={{ fontSize: 9, color: '#00FF88', marginTop: 4 }}>LIVE</div>
        </div>
        <div className="ghost-card" style={{ flex: 1, padding: '14px 16px', textAlign: 'center', '--hc': 'rgba(255,214,0,0.05)' } as React.CSSProperties}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 700, color: '#FFD600' }}>€0</div>
          <div style={{ fontSize: 10, color: 'var(--tx3)', marginTop: 2 }}>Hebammenbüro</div>
          <div style={{ fontSize: 9, color: '#FFD600', marginTop: 4 }}>PRE-LAUNCH</div>
        </div>
      </div>
    </>
  )
}

function KundenHebamAgency() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>findemeinehebamme.de</span>
        <StatusBadge status="green" label="LIVE" />
      </div>
      <TcText style={{ marginBottom: 12 }}>Matching-Plattform für Schwangere die eine Hebamme suchen. ~100 Bestellungen in 10 Wochen. Proof of Concept validiert.</TcText>

      <KpiRow>
        <KpiCard value="~100" label="Bestellungen" color="var(--g)" />
        <KpiCard value="€800" label="Revenue/Mo" color="#00FF88" />
        <KpiCard value="10w" label="Seit Launch" color="var(--a)" />
      </KpiRow>

      <TcLabel>Business Model</TcLabel>
      <TcText>Commission-basiert · ~€8 pro Bestellung</TcText>

      <TcLabel>Key Facts</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { label: 'Stack', value: 'Lovable (vibecoded)' },
          { label: 'Revenue/Jahr', value: '~€9.600' },
          { label: 'Hosting', value: 'Lovable (inkl.)' },
          { label: 'Nächster Schritt', value: 'v2 Rebuild als MCKAY-Projekt' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{f.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{f.value}</span>
          </div>
        ))}
      </div>

      <TcLabel>Wettbewerb</TcLabel>
      <TcText style={{ fontSize: 11 }}>HebRech Cloud launcht April 2026 — Zeitfenster wird enger. v2 geplant als vollständiges MCKAY-Produkt.</TcText>
    </>
  )
}

function KundenHebamBuero() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx)' }}>hebammenbuero.de</span>
        <StatusBadge status="yellow" label="PRE-LAUNCH" />
      </div>
      <TcText style={{ marginBottom: 12 }}>Multi-Tenant SaaS für Hebammenpraxen. Verwaltung, Terminplanung, Abrechnung. 12 Pilot-Kunden im Beta.</TcText>

      <KpiRow>
        <KpiCard value="12" label="Pilot-Kunden" color="#FFD600" />
        <KpiCard value="€0" label="Revenue/Mo" color="var(--tx3)" />
        <KpiCard value="€24k" label="Target ARR" color="var(--p)" />
      </KpiRow>

      <TcLabel>Business Model</TcLabel>
      <TcText>SaaS Per-Seat · Target: €2.000/Monat</TcText>

      <TcLabel>Key Facts</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {[
          { label: 'Stack', value: 'React + Vite + Supabase' },
          { label: 'Phase', value: 'Phase 3 — Feature Build' },
          { label: 'Pilot-Kunden', value: '12 aktiv (kostenlos)' },
          { label: 'Go-Live Target', value: 'Q2 2026' },
          { label: 'Compliance', value: 'GDPR Health + Abrechnungslogik' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <span style={{ fontSize: 11, color: 'var(--tx3)' }}>{f.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx)' }}>{f.value}</span>
          </div>
        ))}
      </div>

      <TcLabel>Roadmap</TcLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[
          { step: 'Pilot-Feedback auswerten', done: true },
          { step: 'Abrechnungsmodul finalisieren', done: false },
          { step: 'Preismodell validieren', done: false },
          { step: 'Go-Live mit Bezahlkunden', done: false },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${r.done ? '#00FF88' : 'rgba(255,255,255,0.15)'}`, background: r.done ? '#00FF8815' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {r.done && <Check size={8} color="#00FF88" />}
            </div>
            <span style={{ fontSize: 11, color: r.done ? 'var(--tx3)' : 'var(--tx2)', textDecoration: r.done ? 'line-through' : 'none' }}>{r.step}</span>
          </div>
        ))}
      </div>
    </>
  )
}

// ── BUSINESS EMAIL (bleibt minimal) ──────────────────────────

function BusinessEmailUebersicht() {
  return (
    <>
      <TcLabel>Business E-Mails</TcLabel>
      <TcText>Business-E-Mails werden im Hub verwaltet. Hier siehst du eine Kurzübersicht.</TcText>
      <TcStatRow>
        <TcStat value="3" label="Postfächer" color="var(--o)" />
        <TcStat value="5" label="Ungelesen" color="#FFD600" />
      </TcStatRow>
      <div style={{ marginTop: 8, padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <ExternalLink size={14} color="var(--bl)" />
        <span style={{ fontSize: 11, color: 'var(--tx2)' }}>Vollständige Email-Verwaltung → <span style={{ color: 'var(--bl)', fontWeight: 600 }}>Hub</span></span>
      </div>
    </>
  )
}

/* ================================================================
   TAB CONFIG — maps category IDs to real content
   ================================================================ */

const categoryTabs: Record<string, { label: string; content: React.ReactNode }[]> = {
  buchhaltung: [
    { label: 'Übersicht', content: <BuchhaltungUebersicht /> },
    { label: 'Belege', content: <BuchhaltungBelege /> },
    { label: 'Datev', content: <BuchhaltungDatev /> },
  ],
  subscriptions: [
    { label: 'Übersicht', content: <SubscriptionsUebersicht /> },
    { label: 'Services', content: <SubscriptionsServices /> },
    { label: 'Kosten', content: <SubscriptionsKosten /> },
  ],
  vertraege: [
    { label: 'Übersicht', content: <VertraegeUebersicht /> },
    { label: 'Aktiv', content: <VertraegeAktiv /> },
    { label: 'Auslaufend', content: <VertraegeAuslaufend /> },
  ],
  kunden: [
    { label: 'Übersicht', content: <KundenUebersicht /> },
    { label: 'Hebam Agency', content: <KundenHebamAgency /> },
    { label: 'Hebammenbüro', content: <KundenHebamBuero /> },
  ],
  'business-email': [
    { label: 'Übersicht', content: <BusinessEmailUebersicht /> },
  ],
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function Office({ toggleTheme }: Props) {
  return (
    <FolderStatusProvider>
      <OfficeInner toggleTheme={toggleTheme} />
    </FolderStatusProvider>
  )
}

function OfficeInner({ toggleTheme }: Props) {
  const [sel, setSel] = useState(0)
  const [tab, setTab] = useState(0)

  const cat = officeCategories[sel]
  const tabs = categoryTabs[cat.id] || [{ label: 'Übersicht', content: <TcText>Inhalt wird geladen...</TcText> }]

  return (
    <div style={{ width: '100%', padding: '0 7.5%', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        backLink={{ label: 'Cockpit', href: '/' }}
        title="Office"
        toggleTheme={toggleTheme}
      />

      <SplitLayout
        ratio="55% 45%"
        left={
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="st" style={{ padding: '0 2px' }}>Bereiche</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600, color: 'var(--tx3)' }}>
                {officeCategories.length} Bereiche
              </span>
            </div>

            {/* Category cards grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {officeCategories.map((c, i) => (
                <div
                  key={c.id}
                  className="ghost-card"
                  style={{
                    '--hc': c.glow, padding: '18px 22px', gap: 8, cursor: 'pointer',
                    outline: sel === i ? `1.5px solid ${c.color}` : 'none',
                    outlineOffset: -1,
                  } as React.CSSProperties}
                  onClick={() => { setSel(i); setTab(0) }}
                >
                  {/* Emoji + Name + Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--tx)' }}>{c.name}</span>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
                      background: `${c.color}15`, color: c.color, letterSpacing: 1, marginLeft: 'auto',
                    }}>
                      {c.badge}
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{ fontSize: 12, color: 'var(--tx2)', lineHeight: 1.5 }}>{c.desc}</div>

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
                    {c.stats.map((s, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: c.color }}>{s.value}</span>
                        <span style={{ fontSize: 10, color: 'var(--tx3)' }}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Color accent bar */}
                  <div style={{ width: 32, height: 3, borderRadius: 2, background: c.color, opacity: 0.5, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </>
        }
        right={
          <PreviewPanel
            title={cat.name}
            ledColor={cat.color}
            ledGlow={cat.glow}
            badge={{ label: cat.badge, bg: `${cat.color}15`, color: cat.color }}
            tabs={tabs}
            activeTab={tab}
            onTabChange={setTab}
            accentColor={cat.color}
          />
        }
      />

      <BottomTicker
        label="OFFICE"
        ledColor="var(--bl)"
        ledGlow="var(--blg)"
        items={[
          { color: 'var(--bl)', label: 'BUCHHALTUNG', labelColor: 'var(--bl)', text: `${erwarteteBelege.filter(b => b.status === 'vorhanden').length}/${erwarteteBelege.length} Belege vorhanden · €${erwarteteBelege.reduce((s, b) => s + b.amount, 0).toFixed(2)} Rechnungssumme · Fällig: ${steuerTermine.nächsteFälligkeit}` },
          { color: 'var(--p)', label: 'SUBSCRIPTIONS', labelColor: 'var(--p)', text: `${subscriptions.length} Services · €${subscriptions.reduce((s, sub) => s + sub.monthly, 0).toFixed(2)}/Monat · €${subscriptions.reduce((s, sub) => s + sub.annual, 0).toLocaleString()}/Jahr` },
          { color: 'var(--a)', label: 'VERTRÄGE', labelColor: 'var(--a)', text: `${vertraege.length} aktiv · €${vertraege.reduce((s, v) => s + v.monthly, 0).toFixed(2)}/Monat · Nächste Kündigung: ${vertraege.filter(v => v.kuendigung !== '-').sort((a, b) => daysUntil(a.kuendigung) - daysUntil(b.kuendigung))[0]?.kuendigung || '-'}` },
          { color: 'var(--g)', label: 'KUNDEN', labelColor: 'var(--g)', text: 'Hebammen.Agency ~€800/mo LIVE · Hebammenbüro 12 Pilot-Kunden PRE-LAUNCH' },
        ]}
      />
    </div>
  )
}
