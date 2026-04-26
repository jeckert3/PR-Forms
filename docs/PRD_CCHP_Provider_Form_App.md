# Product Requirements Document
## CCHP Provider Form App
**Cook Children's Health Plan — Provider Relations**
**Version 1.0 | April 2026**

---

## 1. Executive Summary

The CCHP Provider Form App is a mobile-first, browser-based web application that digitizes the paper-based Provider Relations workflow for Cook Children's Health Plan (CCHP). Field representatives complete guided, section-by-section questionnaires on a device and the application automatically generates a professionally formatted, print-ready PDF that precisely mirrors the official CCHP forms. The application eliminates handwritten data entry errors, speeds up field visits, and ensures every required field is captured consistently.

---

## 2. Problem Statement

CCHP Provider Relations representatives currently complete official forms by hand during or after provider office visits. This process introduces:
- Illegible handwriting / data entry errors
- Missed required fields
- Delays in post-visit documentation
- No consistent format across representatives
- No way to save in-progress work and resume later
- Manual PDF layout work when forms need to be filed

---

## 3. Product Vision

> *A single, trusted digital tool that every Provider Relations rep can use to capture visit data in the field, review it, and instantly produce a completed, regulation-aligned CCHP PDF — with zero manual formatting.*

---

## 4. Users & Personas

| Persona | Role | Primary Goal |
|---|---|---|
| **Field Representative** | Provider Relations Staff | Complete a form during or after a provider visit; download the finished PDF |
| **Admin** | Provider Relations Manager / Power User | Manage the form library — add, edit, or remove custom forms |

---

## 5. Scope

### 5.1 In Scope
- Two built-in, pixel-accurate digital reproductions of official CCHP paper forms
- Guided, section-by-section questionnaire flow for each form
- Auto-save draft functionality (browser localStorage)
- Review screen with inline section editing
- PDF generation and direct download
- Admin panel to create and manage custom forms
- Responsive design (desktop, tablet, mobile)

### 5.2 Out of Scope (v1.0)
- User authentication / login
- Cloud storage / backend database
- Form submission to an external system
- Signature capture (electronic)
- Push notifications
- Offline Progressive Web App (PWA) support

---

## 6. Built-In Forms

### 6.1 Provider Visit 2026
- **Source document:** `12550 South Fwy Ste 106.pdf`
- **Form ID:** `provider-visit-2026`
- **Purpose:** Documents a CCHP Provider Relations representative's visit to a provider office, capturing visit type, items discussed, action items, access standards, and a representative signature.
- **CCHP contact info on PDF:** 801 Seventh Avenue Box 2488, Fort Worth, TX 76113-2488 | 888-243-3312

#### Sections & Fields

| Section | Fields / Questions |
|---|---|
| **Visit Information** | Type of Visit (multicheck: Orientation, Education/Servicing, APM/PIP Reports, Problem Resolution); Date of Visit; Provider/Group Name/Specialty; Address/City/State/Zip; Group NPI/Tax ID; Contact Name/Title/Contact Info; Office Hours; Line of Business — LOB (multicheck: CHIP, CHIP Perinate, STAR, STAR KIDS); PR Representative |
| **Items Discussed** | 18-item multicheck: Access2Care, Ask Me3, CCHP Webinar Schedule, CCHP Website, Complaints and Appeals Process, Demographic Change Form, Interpreter Services, Member Rights and Responsibilities, PEMS, Provider Manual, Provider Portal, Provider Relations Intro, QRG, VAS, Recruiting, Claims Issues, Compliance & Quality, Other; conditional free-text when "Other" is selected |
| **PCP / Pediatrics** | 5-item multicheck: CHIP Perinatal Reference Guide, THSteps Quick Ref Guide, Periodicity Schedule Guide, CHIP Well Child Education, Texas Health Steps Education |
| **New Provider Orientation** | 4-item multicheck: PCP Orientation, Specialty Ancillary & Facility Orientation, PIP/APM: PIP Brochure, Secure Provider Portal Training |
| **Access & Availability** | 7-item multicheck (Access Standards for): Behavioral Health Providers, Case Management for Children and Pregnant Women Providers, LTSS Providers, OBGYN Providers, Primary Care Providers, Specialty Care Providers, Therapy Providers |
| **Talking Points / Action Items** | 12-item multicheck: Claims/Referrals/Authorization, Support/Satisfaction/Improvements, ND Demographic/Roster Updates, Contracting/Credentialing, Member Issues (no-shows / open panel), New Practice Manager/Office Contact, Provider Education/Notifications, New Credentialing Contact, CCHP Dept. Support, Specialty Care Gap, Data Reporting, Delegated Credentialing Group; conditional: Specialty Care Gap text detail; conditional: Delegated Credentialing Group Y/N + name |
| **Provider Comments** | Provider Questions/Comments/Action Items (long text / textarea) |
| **Signature** | Email Address; Office Representative Signature (signature line rendered in PDF) |

---

### 6.2 Site Evaluation Tool
- **Source document:** `Site Evaluation Tool.pdf`
- **Form ID:** `site-evaluation-tool`
- **Purpose:** Structured site evaluation conducted by a CCHP reviewer at a provider facility, scoring each item on a 100-point scale across multiple categories to produce an Accepted or Unaccepted recommendation.

#### Sections & Fields

**Provider Information (non-scored)**

| Field | Type |
|---|---|
| Provider Name | Text |
| Provider Specialty / Type | Text |
| Address | Text |
| Telephone Number | Phone |
| Contact Name | Text |
| Email Address | Email |

**Scored Sections** — each item answered Yes / No / NA; points awarded only for "Yes" answers; NA items do not count against possible points.

| Section | Items | Max Points |
|---|---|---|
| **Accessibility** | Office name/address visible; Adequate parking; Handicapped parking; Handicapped building access; Waiting room condition; Adequate waiting room seating; Restroom handicap access; Restroom cleanliness; Exam room cleanliness & privacy | 10 |
| **Appointment Availability / Accessibility** | Urgent care within 24 hrs; Routine care within 2 weeks; Routine specialty care within 30 days; Non-high-risk prenatal care within 2 weeks; Preventive services for children within 90 days; Preventive services within 2 weeks of birth; Patient wait time ≤45 min | 13 |
| **Hazard Controls / Infection Control** | X-ray hazard signs posted; Sterilization method in use; Hand wash/sanitizer access; Exam rooms adequately sized & cleaned; Hazardous waste receptacles/sharps containers; Hazardous waste policy manual; Pick-up/drop-off slips for hazardous waste; OSHA Publication 3165 posted | 11 |
| **Emergency Preparedness** | Smoke detectors/fire alarms; Fire extinguishers visible & accessible; Fire extinguisher routine inspection; Exit signs visible; Passageways unobstructed; Evacuation plan; Emergency medical instructions; Emergency phone numbers posted; CPR-trained staff on-site; Emergency equipment present (ambu bag, O2, airways) | 15 |
| **Medical Records** | Standard format for all records; Identifier data on every page; All papers secured in file; Records in secure area; Files organized per facility size; Records legible and reproducible | 8 |
| **Patient Education / Patient Rights** | TDI complaint process & toll-free number (English & Spanish); Texas Medical Board complaint poster (English & Spanish); Patient privacy procedure in place | 3 |
| **Credentialing & Staffing** | Documented credentialing process; Licenses/certifications posted; Risk management / QM review program (facilities); Referral policy for suicidal/homicidal patients (facilities); Seclusion/restraint written policy (facilities); Activity coordinator or resident programs (facilities) | 11 |
| **Total** | | **100** |

**Recommendation (non-scored)**

| Field | Type |
|---|---|
| Review Result | Radio (Accepted Review / Unaccepted Review) |
| Revisit Date | Date (conditional — only if Unaccepted Review) |
| CCHP Reviewer | Text |
| Review Date | Date |
| Office Personnel Present — Print Name | Text |
| Office Personnel Present — Signature | Signature line (PDF only) |
| Credentialing Committee Action/Recommendation | Long text |
| Committee Date | Date |

---

## 7. Feature Requirements

### 7.1 Home / Form Library

| ID | Requirement |
|---|---|
| FR-H-01 | The home screen SHALL display all available forms (built-in + custom) in a scrollable card list |
| FR-H-02 | Each form card SHALL display the form name, description, and a color-coded icon |
| FR-H-03 | If a saved draft exists for a form, the card SHALL show a "Draft in progress" badge and present both "Continue Draft" and "Start Fresh" actions |
| FR-H-04 | Starting fresh SHALL clear the existing draft before navigating to the form |
| FR-H-05 | A header SHALL show the Cook Children's Health Plan brand and an "Admin" button accessible from the home screen |

### 7.2 Questionnaire (Form Completion)

| ID | Requirement |
|---|---|
| FR-Q-01 | The questionnaire SHALL present one section at a time with a progress bar showing current section, total sections, and section title |
| FR-Q-02 | The questionnaire SHALL support the following question types: text, email, phone (tel), date, long text (textarea), single choice (radio), multiple choice (multicheck), and scored Yes/No/NA |
| FR-Q-03 | Yes/No/NA sections SHALL be rendered as an interactive table with columns for Yes, No, N/A, and earned points |
| FR-Q-04 | The questionnaire SHALL support conditional question visibility based on another field's value (includes / equals logic) |
| FR-Q-05 | Answers SHALL be auto-saved to localStorage on every change |
| FR-Q-06 | A manual "Save" button SHALL provide explicit confirmation feedback (momentary "Saved!" state) |
| FR-Q-07 | "Back" navigation SHALL go to the previous section; on the first section it SHALL return to the Home screen |
| FR-Q-08 | "Next" navigation on the final section SHALL navigate to the Review screen |
| FR-Q-09 | Page SHALL scroll to the top on every section transition |

### 7.3 Review Screen

| ID | Requirement |
|---|---|
| FR-R-01 | The review screen SHALL display all sections with their answers for user verification before PDF generation |
| FR-R-02 | Sections SHALL be collapsible/expandable; each SHALL display answered/total question counts |
| FR-R-03 | Scored sections SHALL display earned/possible point totals per section |
| FR-R-04 | If the form contains scored sections, a total score summary SHALL be shown in the page header (earned / possible / percentage) |
| FR-R-05 | Each section SHALL have an "Edit" button that navigates back to the corresponding section in the questionnaire |
| FR-R-06 | A "Download Completed PDF" button SHALL trigger PDF generation and direct browser download |
| FR-R-07 | PDF generation SHALL show a loading state ("Generating PDF…") |
| FR-R-08 | After successful download, the UI SHALL show a success state with a "New Form" option that clears the draft |

### 7.4 PDF Generation

| ID | Requirement |
|---|---|
| FR-P-01 | Built-in forms (Provider Visit 2026, Site Evaluation Tool) SHALL each have a hand-crafted PDF renderer that precisely replicates the original CCHP paper form layout |
| FR-P-02 | Custom forms SHALL use a generic PDF renderer |
| FR-P-03 | All PDFs SHALL include: branded CCHP header (blue banner, white text), page numbers, and a "Cook Children's Health Plan — Confidential" footer |
| FR-P-04 | Provider Visit 2026 PDF SHALL render checkboxes with a filled blue check for selected items |
| FR-P-05 | Site Evaluation Tool PDF SHALL render scored sections as formatted tables with Point Value, Yes, No, NA, and Point Score columns, plus a total score summary row |
| FR-P-06 | PDF filenames SHALL follow the pattern: `[FormName]_[YYYY-MM-DD].pdf` |
| FR-P-07 | PDFs SHALL auto-handle page breaks, adding new pages as content overflows |

### 7.5 Admin Panel

| ID | Requirement |
|---|---|
| FR-A-01 | The Admin panel SHALL be accessible via the "Admin" button in the home screen header |
| FR-A-02 | Built-in forms SHALL be displayed as read-only in the Admin panel (no edit or delete) |
| FR-A-03 | Admins SHALL be able to create new custom forms with a name, description, and one or more sections |
| FR-A-04 | Each section SHALL support multiple questions, each with a label, question type, and optional required flag |
| FR-A-05 | Supported admin question types: Text, Text (multi-line), Date, Email, Phone number, Single choice (radio), Multiple choice (checkboxes), Yes/No/NA (scored) |
| FR-A-06 | Yes/No/NA questions SHALL support a configurable point value (0–10) |
| FR-A-07 | Radio and checkbox question types SHALL support adding and removing individual options inline |
| FR-A-08 | Form validation SHALL enforce: form name required; at least one section; all questions must have a label |
| FR-A-09 | Custom forms SHALL be saved to and read from localStorage |
| FR-A-10 | Admins SHALL be able to edit existing custom forms |
| FR-A-11 | Admins SHALL be able to delete custom forms, with a two-step confirmation (click Delete → click Confirm) |

---

## 8. Technical Architecture

### 8.1 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite 5) |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| Icons | Lucide React |
| PDF Generation | jsPDF 2.5 + jspdf-autotable 3.8 |
| State Persistence | Browser localStorage |
| Build / Dev Server | Vite 5 |
| Deployment | Netlify (via `netlify.toml`) |

### 8.2 Application Routes

| Route | Component | Purpose |
|---|---|---|
| `/` | `Home` | Form library landing page |
| `/form/:formId` | `Questionnaire` | Section-by-section form completion |
| `/review/:formId` | `Review` | Answer review + PDF download |
| `/admin` | `Admin` | Form library management |
| `*` | — | Redirects to `/` |

### 8.3 Source Structure

```
src/
├── App.jsx                    # Route definitions
├── main.jsx                   # React entry point
├── index.css                  # Global styles + Tailwind utilities
├── components/
│   ├── Header.jsx             # Sticky branded top bar
│   ├── ProgressBar.jsx        # Section progress indicator
│   └── QuestionRenderer.jsx   # Renders all question types + YesNoNASection
├── forms/
│   ├── index.js               # Exports BUILT_IN_FORMS array
│   ├── providerVisit2026.js   # Provider Visit 2026 form definition
│   └── siteEvaluationTool.js  # Site Evaluation Tool form definition
├── pages/
│   ├── Home.jsx               # Form library
│   ├── Questionnaire.jsx      # Form wizard
│   ├── Review.jsx             # Answer review + download
│   └── Admin.jsx              # Admin panel + form builder
└── utils/
    ├── pdfGenerator.js        # PDF renderers (ProviderVisit, SiteEval, Custom)
    └── storage.js             # localStorage CRUD helpers
```

### 8.4 Data Storage (localStorage)

| Key | Description |
|---|---|
| `cchp_custom_forms` | JSON array of custom form objects created via Admin panel |
| `cchp_saved_answers` | JSON object keyed by `formId` containing draft answers |

### 8.5 Form Data Model

```js
{
  id: string,            // unique form identifier
  name: string,          // display name
  description: string,   // short description
  color: 'blue' | 'teal' | 'purple',
  builtIn: boolean,
  sections: [
    {
      id: string,
      title: string,
      description?: string,
      scoring?: boolean,   // true = YesNoNA table layout
      questions: [
        {
          id: string,
          type: 'text'|'textarea'|'date'|'email'|'tel'|'radio'|'multicheck'|'yes-no-na',
          label: string,
          required?: boolean,
          options?: string[],      // radio, multicheck
          pointValue?: number,     // yes-no-na only
          hint?: string,
          placeholder?: string,
          conditional?: {
            field: string,         // answer field ID to check
            includes?: string,     // trigger if field includes this value
            equals?: string,       // trigger if field equals this value
          }
        }
      ]
    }
  ]
}
```

---

## 9. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Usability | The application SHALL be fully usable on mobile devices (≥320px wide) with touch-friendly tap targets (≥44px) |
| NFR-02 | Performance | PDF generation SHALL complete within 3 seconds for typical form responses |
| NFR-03 | Persistence | All draft answers SHALL survive a page reload without explicit user save action (auto-save on every change) |
| NFR-04 | Branding | The application SHALL use CCHP brand colors (primary blue `#1e4db7`, dark blue `#0f3282`) throughout |
| NFR-05 | Accessibility | Interactive elements SHALL have descriptive `aria-label` attributes; color SHALL NOT be the sole differentiator |
| NFR-06 | Compatibility | The application SHALL function in all modern browsers (Chrome, Safari, Firefox, Edge) |
| NFR-07 | Confidentiality | All data SHALL remain client-side (localStorage only); no data is sent to any external server |

---

## 10. Acceptance Criteria Summary

| Feature | Acceptance Criteria |
|---|---|
| Form Library | All built-in and custom forms appear; draft badge appears when in-progress |
| Questionnaire | All 8 question types render and accept input; progress bar is accurate; auto-save persists on reload |
| Conditional Logic | Conditional fields appear/hide correctly based on parent field value |
| Review | All sections shown; score totals correct; Edit redirects to correct section |
| PDF — Provider Visit | Checkbox marks, field values, LOB, signature line, and footer match source layout |
| PDF — Site Eval | Scored tables render with correct point values and totals; total score row is accurate |
| Admin — Create | Valid form saved and appears in Home library; invalid form shows error message |
| Admin — Edit | Edits persist correctly after save |
| Admin — Delete | Two-step confirmation deletes form and clears its saved answers |

---

*Document owner: Provider Relations, Cook Children's Health Plan*
*Last updated: April 2026*
