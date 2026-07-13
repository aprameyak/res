import type { ContactInfo, ResumeDocument, ResumeSection } from "../../shared/src/types/resume";

function escapeLatex(text: string): string {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, (m) => `\\${m}`)
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function formatContactLink(label: string, url?: string): string {
  if (!url?.trim()) return "";
  const href = url.startsWith("http") ? url : `https://${url}`;
  return `\\underline{\\href{${href}}{${escapeLatex(label)}}} ~`;
}

function buildHeading(contact: ContactInfo): string {
  const links = [
    contact.phone ? `\\underline{${escapeLatex(contact.phone)}} ~` : "",
    contact.email ? `\\underline{${escapeLatex(contact.email)}} ~` : "",
    formatContactLink("linkedin.com/in/profile", contact.linkedin),
    formatContactLink("github.com/username", contact.github),
    formatContactLink("portfolio.com", contact.portfolio),
  ]
    .filter(Boolean)
    .join("\n    ");

  return `%----------HEADING----------
\\begin{center}
    {\\Large \\scshape ${escapeLatex(contact.name || "Your Name")}} \\\\[2mm]
    \\footnotesize
    ${links}
    \\vspace{-8pt}
\\end{center}`;
}

function sectionToLatex(section: ResumeSection): string {
  const content = section.content.trim();
  if (!content) return "";

  const lines = content.split("\n").filter((l) => l.trim());
  const bullets = lines
    .map((line) => {
      const text = line.replace(/^[-•*]\s*/, "").trim();
      return `  \\resumeItem{${escapeLatex(text)}}`;
    })
    .join("\n");

  return `%-----------${section.title.toUpperCase()}-----------
\\section{${escapeLatex(section.title)}}
\\resumeSubHeadingListStart
\\resumeItemListStart
${bullets}
\\resumeItemListEnd
\\resumeSubHeadingListEnd
\\vspace{-12pt}`;
}

const LATEX_PREAMBLE = `\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tabularx}
\\usepackage{fontawesome5}
\\usepackage{multicol}
\\setlength{\\multicolsep}{-3.0pt}
\\setlength{\\columnsep}{-1pt}
\\input{glyphtounicode}
\\usepackage[top=0.6cm, left=1.4cm, right=1.4cm, bottom=1.4cm]{geometry}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.15in}
\\addtolength{\\textwidth}{0.3in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large\\bfseries
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{0pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{1.0\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & \\textbf{\\small #2} \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{1.001\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & \\textbf{\\small #2}\\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.0in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}`;

export function generateLatex(doc: ResumeDocument): string {
  const sections = doc.sections.map(sectionToLatex).filter(Boolean).join("\n\n");

  return `${LATEX_PREAMBLE}

\\begin{document}

${buildHeading(doc.contact)}

${sections}

\\end{document}
`;
}
