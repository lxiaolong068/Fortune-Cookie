/**
 * Client-side plain-text export (Profile "Export All"). Kept separate from
 * lib/pdf-export.ts so the pure text-building logic is testable without a
 * browser/jsPDF dependency.
 */

export interface TxtFortune {
  message: string;
  luckyNumbers?: number[];
}

/** Build the exported .txt content (pure, testable). */
export function buildFortunesTxt(fortunes: TxtFortune[]): string {
  return fortunes
    .map((f, i) => {
      const lucky = f.luckyNumbers?.length
        ? `\nLucky numbers: ${f.luckyNumbers.join(", ")}`
        : "";
      return `${i + 1}. ${f.message}${lucky}`;
    })
    .join("\n\n");
}

/** Build the text and trigger a browser download. */
export function exportFortunesToTxt(
  fortunes: TxtFortune[],
  filename = `fortune-cookies-${new Date().toISOString().slice(0, 10)}.txt`,
): void {
  const content = buildFortunesTxt(fortunes);
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
