"""Convert plain-text resume content to PDF for hiring-agent evaluation."""
from io import BytesIO

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer


def _escape_xml(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def text_to_pdf_bytes(text: str) -> bytes:
    """Render resume plain text as a simple PDF suitable for PDFHandler."""
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )
    styles = getSampleStyleSheet()
    heading = styles["Heading2"]
    body = styles["BodyText"]
    body.fontSize = 10
    body.leading = 14

    story = []
    for line in text.split("\n"):
        stripped = line.strip()
        if not stripped:
            story.append(Spacer(1, 8))
            continue
        if stripped.isupper() and len(stripped) < 48:
            story.append(Paragraph(_escape_xml(stripped), heading))
        else:
            story.append(Paragraph(_escape_xml(stripped), body))

    doc.build(story)
    buffer.seek(0)
    return buffer.read()
