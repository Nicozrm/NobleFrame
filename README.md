# LUNARA – Finale Website-Dateien

## 📦 Übersicht

Komplettes Website-Paket für LUNARA – Kuratierte Intimitätskollektion

**Inhaber:** Jaquelin Handt  
**Standort:** 48282 Emsdetten, Deutschland  
**Projekt:** E-Commerce-Plattform für exklusive Lingerie & Dessous

---

## 📁 Enthaltene Dateien

### Core-Dateien
- **index.html** – Hauptseite mit Hero, Features, Qualitätssystem
- **impressum.html** – TMG5-konformes Impressum
- **datenschutz.html** – DSGVO-konforme Datenschutzerklärung
- **agb.html** – Allgemeine Geschäftsbedingungen für Online-Shop
- **cookie-consent.js** – Cookie-Banner-Script (DSGVO/TTDSG)

---

## 🎨 Design-Features

### Farbpalette
- **Off-White:** #FAF9F7 (Haupthintergrund)
- **Beige:** #E8DED3 (Akzenthintergrund)
- **Sand:** #D4C4B0 (Sekundärfarbe)
- **Dusty Rose:** #D4B5AD (Primärfarbe, Links, CTA)
- **Dark Gray:** #2A2A2A (Haupttext)
- **Soft Gray:** #8A8A8A (Sekundärtext)

### Typography
- **Headlines:** Cormorant Garamond (serif, elegant)
- **Body:** Montserrat (sans-serif, modern)

### Logo-System
- Moon-inspiriertes SVG-Logo
- Crescent-Moon-Design mit subtilen Kreisen
- Responsive und skalierbar

---

## ⭐ Kern-Features

### 6-Punkte-Qualitätssystem
Jedes Produkt wird bewertet nach:
1. **Zustand** – Neuwertig bis gebraucht
2. **Duft** – Neutral bis parfümiert
3. **Waschzustand** – Frisch gewaschen, getragen, OVP
4. **Materialqualität** – Premium bis Standard
5. **Tragedauer** – Einmal bis intensiv getragen
6. **Extras** – Fotos, Notizen, Accessoires

Visualisierung per Ampelsystem (🟢🟡🔴) pro Kriterium.

### Diskretion & Privacy
- Neutrale Verpackung ohne Produkthinweise
- Diskreter Absender auf allen Versandetiketten
- DSGVO-konforme Datenverarbeitung
- SSL-Verschlüsselung für alle Transaktionen
- Keine Weitergabe von Kundendaten

### Zahlungsmethoden
- PayPal
- Kreditkarte (Visa, Mastercard)
- Girocard
- Maestro

---

## 🚀 Installation & Deployment

### 1. Upload auf Webserver
```bash
# Alle Dateien in das Root-Verzeichnis hochladen:
- index.html
- impressum.html
- datenschutz.html
- agb.html
- cookie-consent.js
```

### 2. Cookie-Script einbinden
Das Cookie-Consent-Script ist bereits in der `index.html` integriert.
Alternativ manuell einbinden:
```html
<script src="cookie-consent.js"></script>
```

### 3. SSL-Zertifikat
**Wichtig:** HTTPS ist Pflicht für:
- Datenschutz
- Zahlungsabwicklung
- Vertrauenswürdigkeit

Let's Encrypt bietet kostenlose SSL-Zertifikate.

### 4. Domain & Hosting
Empfohlene Hoster:
- **STRATO** (Deutschland, DSGVO-konform)
- **ALL-INKL** (Deutschland, datenschutzfreundlich)
- **Hetzner** (Deutschland, performant)

---

## ⚙️ Anpassungen

### Logo austauschen
Das SVG-Logo befindet sich inline in allen HTML-Dateien.
Suche nach: `<svg class="logo-icon"` und ersetze mit eigenem SVG.

### Farben ändern
Alle Farben sind als CSS-Variablen definiert:
```css
:root {
    --off-white: #FAF9F7;
    --dusty-rose: #D4B5AD;
    /* etc. */
}
```

### Kontaktdaten
Aktuell in allen Dateien:
- **E-Mail:** kontakt@lunara.de
- **Adresse:** 48282 Emsdetten

Suche & Ersetze diese Angaben bei Bedarf.

### Umsatzsteuer-ID
Im Impressum noch zu ergänzen:
```html
<p><strong>DE [wird nach Anmeldung ergänzt]</strong></p>
```

---

## 📋 Rechtliche Checkliste

### Vor Go-Live prüfen:
- [ ] Impressum mit korrekten Kontaktdaten
- [ ] Datenschutzerklärung aktualisiert
- [ ] AGB finalisiert
- [ ] Cookie-Banner funktionsfähig
- [ ] SSL-Zertifikat aktiv
- [ ] USt-ID beantragt und eingetragen
- [ ] Zahlungsdienstleister-Verträge (PayPal, Stripe)
- [ ] Hosting-Vertrag mit DSGVO-konformem Anbieter

---

## 🔒 Datenschutz & Sicherheit

### Implementiert:
✅ DSGVO-konforme Datenschutzerklärung  
✅ Cookie-Banner mit Opt-in  
✅ Nur technisch notwendige Cookies  
✅ Kein Tracking ohne Zustimmung  
✅ Hosting in Deutschland möglich  
✅ SSL-Ready  

### Empfohlen:
- Regelmäßige Backups
- 2FA für Admin-Zugang
- Firewall-Konfiguration
- Regelmäßige Updates

---

## 📞 Support & Nächste Schritte

### Phase 1: Website Live ✅
- [x] HTML-Seiten erstellt
- [x] Rechtstexte integriert
- [x] Design umgesetzt
- [x] Cookie-Consent implementiert

### Phase 2: Shop-Integration
- [ ] Produktdatenbank einrichten
- [ ] Payment-Gateway aktivieren (Stripe/PayPal)
- [ ] Warenkorb-Funktionalität
- [ ] Bestellverwaltung

### Phase 3: Marketing
- [ ] Social Media Profile
- [ ] Newsletter-System (z.B. Brevo)
- [ ] SEO-Optimierung
- [ ] Content Marketing

---

## 🎯 Brand Guidelines

### Tonalität
- Elegant, aber nicht abgehoben
- Diskret und respektvoll
- Transparent bei Qualität
- Vertrauenswürdig

### Kommunikation
- Direkte Ansprache ("Sie")
- Ehrliche Produktbeschreibungen
- Transparente Qualitätsbewertung
- Privatsphäre wird großgeschrieben

### Do's
✅ Hochwertige Produktfotos  
✅ Ausführliche Qualitätsbewertungen  
✅ Diskrete Kommunikation  
✅ Schneller Kundenservice  

### Don'ts
❌ Übertriebene Versprechungen  
❌ Versteckte Kosten  
❌ Indiskrete Verpackung  
❌ Intransparente Bewertungen  

---

## 📊 Analytics & Tracking

**Aktueller Stand:** Keine Analytics implementiert

**Optional einbindbar:**
- Google Analytics (mit Cookie-Consent)
- Matomo (datenschutzfreundlich, self-hosted)
- Plausible (DSGVO-konform, ohne Cookies)

**Empfehlung:** Plausible oder Matomo für maximale Privacy

---

## 🆘 Troubleshooting

### Cookie-Banner wird nicht angezeigt
- Browser-Cache leeren
- JavaScript-Konsole prüfen
- Cookie-Consent-Script korrekt eingebunden?

### Responsive Design funktioniert nicht
- Viewport-Meta-Tag vorhanden?
- Browser-DevTools für Debugging nutzen

### SSL-Fehler
- Zertifikat korrekt installiert?
- Mixed Content vermeiden (http:// → https://)

---

## 📄 Lizenz & Copyright

**© 2026 LUNARA – Jaquelin Handt**

Alle Rechte vorbehalten. Die Dateien sind für den Einsatz im LUNARA-Projekt lizenziert.

---

## 🎉 Viel Erfolg!

Alle Dateien sind produktionsbereit und DSGVO-konform.  
Bei Fragen zur Implementierung oder weiteren Features stehe ich gerne zur Verfügung.

**Keine Rückfragen – Direkte Umsetzung** ✨

---

**Erstellt:** Januar 2026  
**Version:** 1.0  
**Status:** Production Ready