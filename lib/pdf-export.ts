/**
 * Client-side PDF export for Event Master batches (spec 4.2 "Print Export").
 * Lays fortunes onto A4 as cuttable strips (~real fortune-cookie size) with
 * dashed cut guides. jspdf is dynamically imported so it stays out of the
 * main bundle.
 */

export interface PdfFortune {
  message: string;
  luckyNumbers?: number[];
}

export interface PdfExportOptions {
  includeLuckyNumbers?: boolean;
  includeDate?: boolean;
  title?: string;
}

// A4 in millimetres.
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;

// Strip cell geometry (close to a real ~7cm x 1.5cm fortune strip, padded).
const COLS = 2;
const STRIP_W = 85;
const STRIP_H = 20;
const GAP_X = 8;
const GAP_Y = 4;

const START_X = (PAGE_W - (COLS * STRIP_W + (COLS - 1) * GAP_X)) / 2;

/**
 * Build the jsPDF document (no download). Separated from `exportFortunesToPDF`
 * so the layout logic is testable without a browser.
 */
export async function buildFortunesPdfDoc(
  fortunes: PdfFortune[],
  options: PdfExportOptions = {},
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const title = options.title?.trim() || "Fortune Cookie Messages";
  const dateStr = new Date().toISOString().slice(0, 10);

  // Page 1 header
  let contentTop = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, PAGE_W / 2, contentTop + 2, { align: "center" });
  if (options.includeDate) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(dateStr, PAGE_W / 2, contentTop + 8, { align: "center" });
    doc.setTextColor(0);
  }
  contentTop += 16;

  const rowsPerPage = Math.floor((PAGE_H - contentTop - MARGIN + GAP_Y) / (STRIP_H + GAP_Y));
  const perPage = rowsPerPage * COLS;

  fortunes.forEach((fortune, index) => {
    const pageIndex = Math.floor(index / perPage);
    const indexOnPage = index % perPage;

    if (indexOnPage === 0 && pageIndex > 0) {
      doc.addPage();
      contentTop = MARGIN; // subsequent pages: no header
    }
    const topOffset = pageIndex === 0 ? contentTop : MARGIN;

    const col = indexOnPage % COLS;
    const row = Math.floor(indexOnPage / COLS);
    const x = START_X + col * (STRIP_W + GAP_X);
    const y = topOffset + row * (STRIP_H + GAP_Y);

    // Dashed cut guide
    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.setLineDashPattern([1.2, 1.2], 0);
    doc.rect(x, y, STRIP_W, STRIP_H);
    doc.setLineDashPattern([], 0);

    // Message (wrapped, centered vertically-ish)
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(20);
    const lines = doc.splitTextToSize(fortune.message, STRIP_W - 8) as string[];
    const maxLines = options.includeLuckyNumbers ? 2 : 3;
    const shown = lines.slice(0, maxLines);
    const lineH = 4.2;
    const textBlockH = shown.length * lineH;
    let textY = y + (STRIP_H - textBlockH) / 2 + 3;
    if (options.includeLuckyNumbers) textY -= 1.5;
    shown.forEach((line) => {
      doc.text(line, x + STRIP_W / 2, textY, { align: "center" });
      textY += lineH;
    });

    // Optional lucky numbers
    if (options.includeLuckyNumbers && fortune.luckyNumbers?.length) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(150);
      doc.text(
        `Lucky: ${fortune.luckyNumbers.join("  ")}`,
        x + STRIP_W / 2,
        y + STRIP_H - 2.5,
        { align: "center" },
      );
      doc.setTextColor(0);
    }
  });

  return doc;
}

/** Build the PDF and trigger a browser download. */
export async function exportFortunesToPDF(
  fortunes: PdfFortune[],
  options: PdfExportOptions = {},
): Promise<void> {
  const doc = await buildFortunesPdfDoc(fortunes, options);
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`fortune-cookies-${dateStr}.pdf`);
}
