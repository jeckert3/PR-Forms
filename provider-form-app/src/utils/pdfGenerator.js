import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { providerVisit2026 } from '../forms/providerVisit2026';
import { siteEvaluationTool } from '../forms/siteEvaluationTool';

const PW = 612;
const MARGIN = 40;
const CW = PW - MARGIN * 2;
const BLUE = [30, 77, 183];
const DARK = [15, 50, 130];
const TEAL = [0, 174, 203];
const LGRAY = [245, 245, 245];
const MGRAY = [180, 180, 180];
const DGRAY = [80, 80, 80];
const SHOW_UPLOADED_DOCUMENT_HEADERS = false;

function drawSectionHeader(doc, text, y) {
  doc.setFillColor(...BLUE);
  doc.rect(MARGIN, y, CW, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(text, MARGIN + 4, y + 10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  return y + 18;
}

function drawCheckbox(doc, x, y, checked, size = 8) {
  if (checked) {
    doc.setFillColor(...BLUE);
    doc.rect(x, y, size, size, 'F');
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(1.2);
    doc.line(x + 1.5, y + 4.5, x + 3.2, y + 6.5);
    doc.line(x + 3.2, y + 6.5, x + 6.5, y + 1.5);
  } else {
    doc.setDrawColor(...MGRAY);
    doc.setFillColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.rect(x, y, size, size, 'FD');
  }
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
}

function drawField(doc, label, value, x, y, labelW, valueW) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DGRAY);
  doc.text(label + ':', x, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(8.5);
  const val = value || '';
  doc.text(val, x + labelW, y, { maxWidth: valueW });
  doc.setDrawColor(...MGRAY);
  doc.setLineWidth(0.3);
  doc.line(x + labelW - 2, y + 1.5, x + labelW + valueW, y + 1.5);
}

function checkPageBreak(doc, y, needed = 30) {
  if (y + needed > 760) {
    doc.addPage();
    return 40;
  }
  return y;
}

function appendNotesAndPhotos(doc, notes, photos) {
  if (!notes && (!photos || photos.length === 0)) return;
  doc.addPage();
  let y = 40;
  if (notes) {
    y = drawSectionHeader(doc, 'Additional Notes', y);
    const lines = doc.splitTextToSize(notes, CW - 8);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(lines, MARGIN + 4, y);
    y += lines.length * 12 + 14;
  }
  if (photos && photos.length > 0) {
    y = checkPageBreak(doc, y, 50);
    y = drawSectionHeader(doc, 'Photos', y);
    const imgW = (CW - 10) / 2;
    let col = 0;
    let rowMaxH = 0;
    for (const photo of photos) {
      const ar = (photo && photo.aspectRatio) ? photo.aspectRatio : (4 / 3);
      const imgH = Math.round(imgW / ar);
      rowMaxH = Math.max(rowMaxH, imgH);
      y = checkPageBreak(doc, y, imgH + 12);
      const x = MARGIN + col * (imgW + 10);
      try {
        doc.addImage(photo.dataUrl, 'JPEG', x, y, imgW, imgH);
      } catch {
        // skip unembeddable image
      }
      col++;
      if (col >= 2) {
        col = 0;
        y += rowMaxH + 8;
        rowMaxH = 0;
      }
    }
    if (col > 0) y += rowMaxH + 8;
  }
}

// ─── PROVIDER VISIT 2026 ───────────────────────────────────────────────────

export function generateProviderVisitPDF(answers, photos = []) {
  const doc = new jsPDF('p', 'pt', 'letter');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('PROVIDER VISIT 2026', PW / 2, 30, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...DGRAY);
  doc.text('801 Seventh Avenue Box 2488  |  Fort Worth, Texas 76113-2488  |  888-243-3312', PW / 2, 42, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  let y = 55;

  // Visit Types row
  const visitTypes = ['Orientation', 'Education/Servicing', 'APM/PIP Reports', 'Problem Resolution'];
  const selTypes = answers.visit_types || [];
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...DGRAY);
  doc.text('Type of Visit:', MARGIN, y);
  let cx = MARGIN + 68;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  for (const t of visitTypes) {
    drawCheckbox(doc, cx, y - 7, selTypes.includes(t));
    doc.setFontSize(7.5);
    doc.text(t, cx + 11, y);
    cx += doc.getStringUnitWidth(t) * 7.5 * 0.352 + 26;
  }
  y += 16;

  // Info fields (two-column layout)
  const leftFields = [
    { label: 'Provider/Group Name/Specialty', key: 'provider_name', lw: 148 },
    { label: 'Address/City/State/Zip', key: 'address', lw: 120 },
    { label: 'Group NPI/Tax ID', key: 'group_npi_tax', lw: 95 },
  ];
  const rightFields = [
    { label: 'Date of Visit', key: 'date_of_visit', lw: 70 },
    { label: 'Office Hours', key: 'office_hours', lw: 70 },
    { label: 'PR Representative', key: 'pr_representative', lw: 95 },
  ];

  doc.setFontSize(8);
  for (let i = 0; i < leftFields.length; i++) {
    const lf = leftFields[i];
    drawField(doc, lf.label, answers[lf.key], MARGIN, y, lf.lw, 155);
    if (rightFields[i]) {
      const rf = rightFields[i];
      drawField(doc, rf.label, answers[rf.key], MARGIN + CW / 2, y, rf.lw, 120);
    }
    y += 16;
  }

  drawField(doc, 'Contact Name/Title/Contact Info', answers.contact_info, MARGIN, y, 155, CW - 155);
  y += 16;

  // LOB row
  const lobs = ['CHIP', 'CHIP Perinate', 'STAR', 'STAR KIDS'];
  const selLobs = answers.lob || [];
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...DGRAY);
  doc.text('Line of Business (LOB):', MARGIN, y);
  cx = MARGIN + 115;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  for (const l of lobs) {
    drawCheckbox(doc, cx, y - 7, selLobs.includes(l));
    doc.setFontSize(7.5);
    doc.text(l, cx + 11, y);
    cx += doc.getStringUnitWidth(l) * 7.5 * 0.352 + 30;
  }
  y += 18;

  // Items Discussed
  y = drawSectionHeader(doc, 'Items Discussed', y);
  const allItems = [
    'Access2Care', 'Ask Me3', 'CCHP Webinar Schedule', 'CCHP Website',
    'Complaints and Appeals Process', 'Demographic Change Form', 'Interpreter Services',
    'Member Rights and Responsibilities', 'PEMS', 'Provider Manual', 'Provider Portal',
    'Provider Relations Intro', 'QRG', 'VAS', 'Recruiting', 'Claims Issues',
    'Compliance & Quality', 'Other',
  ];
  const selItems = answers.items_discussed || [];
  const colW = CW / 3;
  let col = 0;
  let rowY = y;
  for (let i = 0; i < allItems.length; i++) {
    const item = allItems[i];
    const colX = MARGIN + col * colW;
    drawCheckbox(doc, colX, rowY - 7, selItems.includes(item));
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(item, colX + 12, rowY);
    col++;
    if (col >= 3) { col = 0; rowY += 13; }
  }
  if (col > 0) rowY += 13;
  y = rowY + 2;
  if (selItems.includes('Other') && answers.other_item) {
    doc.setFontSize(7.5);
    doc.text('Other: ' + answers.other_item, MARGIN + 12, y);
    y += 13;
  }
  y += 4;

  // PCP / Pediatrics
  y = drawSectionHeader(doc, 'PCP / Pediatrics', y);
  const pcpItems = [
    'CHIP Perinatal Reference Guide', 'THSteps Quick Ref Guide', 'Periodicity Schedule Guide',
    'CHIP Well Child Education', 'Texas Health Steps Education',
  ];
  const selPCP = answers.pcp_items || [];
  cx = MARGIN;
  for (const item of pcpItems) {
    drawCheckbox(doc, cx, y - 7, selPCP.includes(item));
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(item, cx + 12, y);
    cx += doc.getStringUnitWidth(item) * 7.5 * 0.352 + 28;
    if (cx > MARGIN + CW - 120) { cx = MARGIN; y += 13; }
  }
  y += 16;

  // New Provider Orientation
  y = checkPageBreak(doc, y);
  y = drawSectionHeader(doc, 'New Provider Orientation', y);
  const oriItems = [
    'PCP Orientation', 'Specialty, Ancillary & Facility Orientation',
    'PIP/APM: PIP Brochure', 'Secure Provider Portal Training',
  ];
  const selOri = answers.orientation_items || [];
  cx = MARGIN;
  for (const item of oriItems) {
    drawCheckbox(doc, cx, y - 7, selOri.includes(item));
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(item, cx + 12, y);
    cx += doc.getStringUnitWidth(item) * 7.5 * 0.352 + 26;
    if (cx > MARGIN + CW - 130) { cx = MARGIN; y += 13; }
  }
  y += 16;

  // Access and Availability
  y = checkPageBreak(doc, y);
  y = drawSectionHeader(doc, 'Access and Availability', y);
  const accItems = [
    'Access standards for Behavioral Health Providers',
    'Access standards for Case Management for Children and Pregnant Women Providers',
    'Access standards for LTSS Providers',
    'Access standards for OBGYN Providers',
    'Access standards for Primary Care Providers',
    'Access standards for Specialty Care Providers',
    'Access standards for Therapy Providers',
  ];
  const selAcc = answers.access_standards || [];
  for (const item of accItems) {
    y = checkPageBreak(doc, y);
    drawCheckbox(doc, MARGIN, y - 7, selAcc.includes(item));
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(item, MARGIN + 12, y, { maxWidth: CW - 14 });
    y += 13;
  }
  y += 4;

  // Talking Points / Action Items
  y = checkPageBreak(doc, y, 60);
  y = drawSectionHeader(doc, 'Provider Relations Talking Points / Action Items', y);
  const tpItems = [
    'Claims/Referrals/Authorization', 'Support/Satisfaction/Improvements',
    'ND Demographic/Roster Updates (upcoming changes)', 'Contracting/Credentialing',
    'Member Issues (no-shows, open panel)', 'New Practice Manager/Office Contact',
    'Provider Education/Notifications', 'New Credentialing Contact',
    'CCHP Dept. Support', 'Specialty Care Gap', 'Data Reporting', 'Delegated Credentialing Group',
  ];
  const selTP = answers.talking_points || [];
  col = 0; rowY = y;
  for (let i = 0; i < tpItems.length; i++) {
    const item = tpItems[i];
    const colX = MARGIN + col * (CW / 2);
    drawCheckbox(doc, colX, rowY - 7, selTP.includes(item));
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(item, colX + 12, rowY, { maxWidth: CW / 2 - 14 });
    col++;
    if (col >= 2) { col = 0; rowY += 13; }
  }
  if (col > 0) rowY += 13;
  y = rowY + 2;

  if (selTP.includes('Specialty Care Gap') && answers.specialty_care_gap_detail) {
    drawField(doc, 'Specialty Care Gap', answers.specialty_care_gap_detail, MARGIN, y, 95, CW - 97);
    y += 14;
  }
  if (selTP.includes('Delegated Credentialing Group')) {
    const yn = answers.delegated_credentialing_yn || '';
    const name = answers.delegated_credentialing_name || '';
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...DGRAY);
    doc.text('Delegated Credentialing Group:', MARGIN, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(yn + (name ? '  —  ' + name : ''), MARGIN + 145, y);
    y += 14;
  }
  y += 4;

  // Provider Comments
  y = checkPageBreak(doc, y, 60);
  y = drawSectionHeader(doc, 'Provider Questions / Comments / Action Items', y);
  const comments = answers.provider_comments || '';
  if (comments) {
    const lines = doc.splitTextToSize(comments, CW - 8);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(lines, MARGIN + 4, y);
    y += lines.length * 11 + 4;
  } else {
    doc.setDrawColor(...MGRAY);
    doc.setLineWidth(0.3);
    for (let i = 0; i < 3; i++) {
      doc.line(MARGIN, y + i * 13, MARGIN + CW, y + i * 13);
    }
    y += 45;
  }

  // Signature / Email
  y = checkPageBreak(doc, y, 40);
  drawField(doc, 'Email Address', answers.rep_email, MARGIN, y, 80, 180);
  y += 20;
  doc.setDrawColor(...MGRAY);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, MARGIN + 200, y);
  doc.setFontSize(7);
  doc.setTextColor(...DGRAY);
  doc.text('Office Representative Signature', MARGIN, y + 9);

  appendNotesAndPhotos(doc, answers._extra_notes || '', photos);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...MGRAY);
    doc.text(`Page ${i} of ${totalPages}`, PW / 2, 785, { align: 'center' });
    doc.text('Cook Children\'s Health Plan — Confidential', MARGIN, 785);
  }

  return doc;
}

// ─── SITE EVALUATION TOOL ─────────────────────────────────────────────────

function calcScore(section, answers) {
  let earned = 0;
  let possible = 0;
  for (const q of section.questions) {
    if (q.type !== 'yes-no-na') continue;
    const pv = q.pointValue || 0;
    const ans = answers[q.id];
    if (ans === 'Yes') { earned += pv; possible += pv; }
    else if (ans === 'No') { possible += pv; }
    // NA: not counted toward possible
  }
  return { earned, possible };
}

export function generateSiteEvalPDF(answers, photos = []) {
  const doc = new jsPDF('p', 'pt', 'letter');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text('SITE EVALUATION TOOL', PW / 2, 30, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  let y = 48;

  // Provider info block
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...BLUE);
  doc.text('Provider Information', MARGIN, y);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  y += 12;

  const half = CW / 2;
  const provRows = [
    [{ label: 'Provider Name', key: 'provider_name', lw: 85 }, { label: 'Provider Specialty/Type', key: 'provider_specialty', lw: 120 }],
    [{ label: 'Address', key: 'address', lw: 55 }, { label: 'Telephone Number', key: 'telephone', lw: 100 }],
    [{ label: 'Contact Name', key: 'contact_name', lw: 80 }, { label: 'Email Address', key: 'email', lw: 80 }],
  ];
  for (const row of provRows) {
    drawField(doc, row[0].label, answers[row[0].key], MARGIN, y, row[0].lw, half - row[0].lw - 10);
    drawField(doc, row[1].label, answers[row[1].key], MARGIN + half, y, row[1].lw, half - row[1].lw - 10);
    y += 16;
  }
  y += 6;

  // Scoring sections
  const scoringSections = siteEvaluationTool.sections.filter((s) => s.scoring);
  let totalEarned = 0;
  let totalPossible = 0;

  for (const section of scoringSections) {
    y = checkPageBreak(doc, y, 40);

    const { earned, possible } = calcScore(section, answers);
    totalEarned += earned;
    totalPossible += possible;

    const tableBody = section.questions.map((q) => {
      const ans = answers[q.id] || '';
      const pv = q.pointValue || 0;
      const score = ans === 'Yes' ? String(pv) : ans === 'No' ? '0' : ans === 'NA' ? 'N/A' : '';
      return [
        q.label,
        pv > 0 ? String(pv) : '',
        ans === 'Yes' ? '✓' : '',
        ans === 'No' ? '✓' : '',
        ans === 'NA' ? '✓' : '',
        score,
      ];
    });

    const headerTitle = section.title + (section.description ? ' (' + section.description + ')' : '');

    autoTable(doc, {
      startY: y,
      head: [[
        { content: headerTitle, colSpan: 1, styles: { fontStyle: 'bold', fillColor: BLUE, textColor: [255, 255, 255] } },
        { content: 'Point\nValue', styles: { fontStyle: 'bold', fillColor: BLUE, textColor: [255, 255, 255], halign: 'center' } },
        { content: 'Yes', styles: { fontStyle: 'bold', fillColor: BLUE, textColor: [255, 255, 255], halign: 'center' } },
        { content: 'No', styles: { fontStyle: 'bold', fillColor: BLUE, textColor: [255, 255, 255], halign: 'center' } },
        { content: 'NA', styles: { fontStyle: 'bold', fillColor: BLUE, textColor: [255, 255, 255], halign: 'center' } },
        { content: 'Point\nScore', styles: { fontStyle: 'bold', fillColor: BLUE, textColor: [255, 255, 255], halign: 'center' } },
      ]],
      body: tableBody,
      margin: { left: MARGIN, right: MARGIN },
      columnStyles: {
        0: { cellWidth: 275, fontSize: 7.5 },
        1: { cellWidth: 40, halign: 'center', fontSize: 7.5 },
        2: { cellWidth: 40, halign: 'center', fontSize: 9, fontStyle: 'bold' },
        3: { cellWidth: 40, halign: 'center', fontSize: 9, fontStyle: 'bold' },
        4: { cellWidth: 40, halign: 'center', fontSize: 9, fontStyle: 'bold' },
        5: { cellWidth: 57, halign: 'center', fontSize: 7.5 },
      },
      styles: { fontSize: 7.5, cellPadding: 3, lineColor: [200, 200, 200], lineWidth: 0.3 },
      alternateRowStyles: { fillColor: [248, 250, 255] },
      headStyles: { fontSize: 8, minCellHeight: 14 },
      theme: 'grid',
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // Total Score row
  y = checkPageBreak(doc, y, 25);
  doc.setFillColor(...LGRAY);
  doc.rect(MARGIN, y, CW, 18, 'F');
  doc.setDrawColor(...MGRAY);
  doc.setLineWidth(0.5);
  doc.rect(MARGIN, y, CW, 18, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...DARK);
  doc.text('Total Points Possible:', MARGIN + 4, y + 12);
  doc.text(String(totalPossible), MARGIN + 130, y + 12);
  doc.text('Total Score Earned:', MARGIN + 280, y + 12);
  doc.setTextColor(...BLUE);
  doc.setFontSize(11);
  doc.text(String(totalEarned), MARGIN + 400, y + 13);
  doc.setTextColor(0, 0, 0);
  const pct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`(${pct}%)`, MARGIN + 425, y + 12);
  y += 28;

  // Recommendation section
  y = checkPageBreak(doc, y, 80);
  y = drawSectionHeader(doc, 'Recommendation', y);

  const result = answers.review_result || '';
  const reviewOptions = ['Accepted Review', 'Unaccepted Review'];
  let cx = MARGIN;
  for (const opt of reviewOptions) {
    drawCheckbox(doc, cx, y - 7, result === opt);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(opt, cx + 12, y);
    cx += 130;
  }
  if (result === 'Unaccepted Review' && answers.revisit_date) {
    drawField(doc, 'Revisit Date', answers.revisit_date, MARGIN + 270, y, 70, 100);
  }
  y += 16;

  drawField(doc, 'CCHP Reviewer', answers.cchp_reviewer, MARGIN, y, 85, 180);
  drawField(doc, 'Date', answers.review_date, MARGIN + CW / 2, y, 32, 140);
  y += 18;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DGRAY);
  doc.text('Office Personnel Present for Review:', MARGIN, y);
  y += 14;
  drawField(doc, 'Print Name', answers.office_personnel_name, MARGIN, y, 65, 200);
  y += 22;
  doc.setDrawColor(...MGRAY);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, MARGIN + 220, y);
  doc.setFontSize(7);
  doc.setTextColor(...DGRAY);
  doc.text('Signature', MARGIN, y + 9);
  y += 22;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...DGRAY);
  doc.text('Credentialing Committee Action / Recommendation:', MARGIN, y);
  y += 12;
  const ccAction = answers.credentialing_committee_action || '';
  if (ccAction) {
    const lines = doc.splitTextToSize(ccAction, CW);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text(lines, MARGIN, y);
    y += lines.length * 11 + 4;
  } else {
    for (let i = 0; i < 3; i++) {
      doc.setDrawColor(...MGRAY);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, y + i * 13, MARGIN + CW, y + i * 13);
    }
    y += 44;
  }

  drawField(doc, 'Date', answers.committee_date, MARGIN, y, 32, 120);

  appendNotesAndPhotos(doc, answers._extra_notes || '', photos);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...MGRAY);
    doc.text(`Page ${i} of ${totalPages}`, PW / 2, 785, { align: 'center' });
    doc.text('Cook Children\'s Health Plan — Confidential', MARGIN, 785);
  }

  return doc;
}

// ─── CUSTOM FORM PDF ──────────────────────────────────────────────────────

export function generateCustomFormPDF(form, answers, photos = []) {
  const doc = new jsPDF('p', 'pt', 'letter');
  let y = 40;
  if (SHOW_UPLOADED_DOCUMENT_HEADERS) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(0, 0, 0);
    doc.text(form.name.toUpperCase(), PW / 2, 30, { align: 'center' });
    if (form.description) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...DGRAY);
      doc.text(form.description, PW / 2, 42, { align: 'center' });
      doc.setTextColor(0, 0, 0);
    }
    y = 55;
  }

  for (const section of (form.sections || [])) {
    y = checkPageBreak(doc, y, 30);
    y = drawSectionHeader(doc, section.title, y);

    for (const q of (section.questions || [])) {
      y = checkPageBreak(doc, y, 20);
      const val = answers[q.id];
      const display = Array.isArray(val) ? val.join(', ') : (val || '');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...DGRAY);
      doc.text(q.label + ':', MARGIN, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(8);
      if (display) {
        const lines = doc.splitTextToSize(display, CW - 4);
        doc.text(lines, MARGIN, y + 11);
        y += lines.length * 11 + 14;
      } else {
        doc.setDrawColor(...MGRAY);
        doc.setLineWidth(0.3);
        doc.line(MARGIN, y + 11, MARGIN + CW, y + 11);
        y += 22;
      }
    }
    y += 4;
  }

  appendNotesAndPhotos(doc, answers._extra_notes || '', photos);

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...MGRAY);
    doc.text(`Page ${i} of ${totalPages}`, PW / 2, 785, { align: 'center' });
  }

  return doc;
}

// ─── DISPATCHER ──────────────────────────────────────────────────────────

export function generatePDF(form, answers, photos = []) {
  let doc;
  if (form.id === 'provider-visit-2026') {
    doc = generateProviderVisitPDF(answers, photos);
  } else if (form.id === 'site-evaluation-tool') {
    doc = generateSiteEvalPDF(answers, photos);
  } else {
    doc = generateCustomFormPDF(form, answers, photos);
  }
  const safeName = form.name.replace(/[^a-z0-9]/gi, '_');
  doc.save(`${safeName}_${new Date().toISOString().slice(0, 10)}.pdf`);
}
