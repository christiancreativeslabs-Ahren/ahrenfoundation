type PdfTextBlock = {
  text: string;
  size?: number;
  x?: number;
  align?: "left" | "center";
  gapAfter?: number;
};

const PAGE_WIDTH = 842;
const PAGE_HEIGHT = 595;

function toPdfSafeText(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function estimateWidth(text: string, fontSize: number) {
  return text.length * fontSize * 0.48;
}

function textLine(block: Required<Omit<PdfTextBlock, "gapAfter">>, y: number) {
  const x =
    block.align === "center"
      ? Math.max(48, (PAGE_WIDTH - estimateWidth(block.text, block.size)) / 2)
      : block.x;

  return `BT /F1 ${block.size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${toPdfSafeText(block.text)}) Tj ET`;
}

function streamFromLines(blocks: PdfTextBlock[], startY = 500) {
  let y = startY;
  const commands = [
    "0.06 0.45 0.41 rg",
    "36 36 770 523 re f",
    "0.98 0.96 0.88 rg",
    "52 52 738 491 re f",
    "0.06 0.45 0.41 RG",
    "5 w",
    "70 70 702 455 re S",
    "0.05 0.09 0.17 rg",
  ];

  for (const block of blocks) {
    const normalized = {
      text: block.text,
      size: block.size ?? 14,
      x: block.x ?? 92,
      align: block.align ?? "left",
    };
    commands.push(textLine(normalized, y));
    y -= block.gapAfter ?? normalized.size + 12;
  }

  return commands.join("\n");
}

function buildPdf(contentStream: string) {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(contentStream, "latin1")} >>\nstream\n${contentStream}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets.slice(1)) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "latin1");
}

export function createCertificatePdf(input: {
  name: string;
  certificateNumber: string;
  issuedAt: string;
}) {
  return buildPdf(
    streamFromLines(
      [
        { text: "AHREN FOUNDATION", size: 18, align: "center", gapAfter: 58 },
        { text: "Certificate of Completion", size: 38, align: "center", gapAfter: 38 },
        { text: "This certifies that", size: 16, align: "center", gapAfter: 34 },
        { text: input.name, size: 32, align: "center", gapAfter: 34 },
        {
          text: "has successfully completed the 6-week Ahren Christian Creativity Masterclass",
          size: 16,
          align: "center",
          gapAfter: 64,
        },
        { text: input.issuedAt, size: 13, x: 100, gapAfter: 0 },
        { text: "Executive Director Signature", size: 13, x: 555, gapAfter: 30 },
        { text: input.certificateNumber, size: 11, align: "center" },
      ],
      500,
    ),
  );
}

export function createMentorGuidelinesPdf() {
  return buildPdf(
    streamFromLines(
      [
        { text: "AHREN FOUNDATION - MENTOR GUIDELINES", size: 18, align: "center", gapAfter: 28 },
        { text: "Thank you for answering the call to shape a generation.", size: 13, align: "center", gapAfter: 24 },
        { text: "Our vision", size: 15, gapAfter: 18 },
        {
          text: "A global network of believers in tech using their skills and creativity to build valuable products and services.",
          size: 11,
          gapAfter: 18,
        },
        { text: "Your role", size: 15, gapAfter: 18 },
        {
          text: "Encourage, ask wise questions, share honest stories, pray, open doors, and keep loving accountability.",
          size: 11,
          gapAfter: 18,
        },
        { text: "What we ask of you", size: 15, gapAfter: 18 },
        {
          text: "Commit 1 hour per month for 3 months, read weekly reflections, respond within 48 hours, and log sessions.",
          size: 11,
          gapAfter: 18,
        },
        { text: "Golden rules", size: 15, gapAfter: 18 },
        {
          text: "Be on time, keep conversations confidential, pray with your mentee, communicate schedule changes, and report concerns.",
          size: 11,
          gapAfter: 18,
        },
        {
          text: "Never meet alone with a mentee in a private, unrecorded setting. Use approved platforms or public/group settings.",
          size: 11,
          gapAfter: 18,
        },
        { text: "The 6-week module structure", size: 15, gapAfter: 18 },
        {
          text: "Weeks 1-2: identity and the Holy Spirit. Weeks 3-4: character, habits, and leadership. Weeks 5-6: tools, purpose, impact, and commissioning.",
          size: 11,
          gapAfter: 18,
        },
        {
          text: "After a successful cycle, verified mentors receive dashboard access, mentor resources, training opportunities, and event invitations.",
          size: 11,
          gapAfter: 26,
        },
        { text: "Welcome to the team. Let's build something eternal.", size: 13, align: "center" },
      ],
      505,
    ),
  );
}
