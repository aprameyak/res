# Makefile for Resume LaTeX Template
# Usage: make, make clean, make view, make help

# Variables
TEX_FILE = RESUME
PDF_FILE = $(TEX_FILE).pdf
AUX_FILES = *.aux *.log *.out *.fdb_latexmk *.fls *.synctex.gz

# Default target
all: $(PDF_FILE)

# Main compilation rule
$(PDF_FILE): $(TEX_FILE).tex
	@echo "Compiling $(TEX_FILE).tex..."
	pdflatex -interaction=nonstopmode $(TEX_FILE).tex
	@echo "Compilation complete: $(PDF_FILE)"

# Alternative compilation with XeLaTeX
xelatex: $(TEX_FILE).tex
	@echo "Compiling with XeLaTeX..."
	xelatex -interaction=nonstopmode $(TEX_FILE).tex
	@echo "Compilation complete: $(PDF_FILE)"

# Compile with multiple passes for better references
full: $(TEX_FILE).tex
	@echo "Compiling with multiple passes..."
	pdflatex -interaction=nonstopmode $(TEX_FILE).tex
	pdflatex -interaction=nonstopmode $(TEX_FILE).tex
	@echo "Full compilation complete: $(PDF_FILE)"

# Clean auxiliary files
clean:
	@echo "Cleaning auxiliary files..."
	rm -f $(AUX_FILES)
	@echo "Clean complete."

# Clean everything including PDF
clean-all: clean
	@echo "Removing PDF file..."
	rm -f $(PDF_FILE)
	@echo "Full clean complete."

# View the PDF (macOS)
view: $(PDF_FILE)
	@echo "Opening $(PDF_FILE)..."
	open $(PDF_FILE)

# View the PDF (Linux)
view-linux: $(PDF_FILE)
	@echo "Opening $(PDF_FILE)..."
	xdg-open $(PDF_FILE)

# Watch for changes and recompile (requires inotify-tools)
watch:
	@echo "Watching for changes... (Ctrl+C to stop)"
	@while true; do \
		inotifywait -e modify $(TEX_FILE).tex 2>/dev/null && \
		echo "Change detected, recompiling..." && \
		make $(PDF_FILE); \
	done

# Word count (estimated)
count:
	@echo "Estimating word count..."
	@if command -v detex >/dev/null 2>&1; then \
		detex $(TEX_FILE).tex | wc -w; \
	else \
		echo "detex not found. Install with: apt-get install detex (Ubuntu) or brew install detex (macOS)"; \
	fi

# Check for required packages
check:
	@echo "Checking LaTeX packages..."
	@kpsewhich fontawesome5.sty >/dev/null 2>&1 || echo "Missing: fontawesome5"
	@kpsewhich geometry.sty >/dev/null 2>&1 || echo "Missing: geometry"
	@kpsewhich hyperref.sty >/dev/null 2>&1 || echo "Missing: hyperref"
	@kpsewhich tabularx.sty >/dev/null 2>&1 || echo "Missing: tabularx"
	@echo "Package check complete."

# Install missing packages (TeX Live)
install-packages:
	@echo "Installing missing packages..."
	@tlmgr install fontawesome5 geometry hyperref tabularx titlesec enumitem multicol
	@echo "Package installation complete."

# Create backup
backup:
	@echo "Creating backup..."
	@mkdir -p backups
	@cp $(TEX_FILE).tex backups/$(TEX_FILE)_$$(date +%Y%m%d_%H%M%S).tex
	@echo "Backup created in backups/ directory."

# Show help
help:
	@echo "Resume Template Makefile"
	@echo "========================"
	@echo ""
	@echo "Available targets:"
	@echo "  all          - Compile resume (default)"
	@echo "  xelatex      - Compile with XeLaTeX"
	@echo "  full         - Compile with multiple passes"
	@echo "  clean        - Remove auxiliary files"
	@echo "  clean-all    - Remove auxiliary files and PDF"
	@echo "  view         - Compile and open PDF (macOS)"
	@echo "  view-linux   - Compile and open PDF (Linux)"
	@echo "  watch        - Watch for changes and auto-recompile"
	@echo "  count        - Estimate word count"
	@echo "  check        - Check for required packages"
	@echo "  install-pkgs - Install missing packages (TeX Live)"
	@echo "  backup       - Create backup of .tex file"
	@echo "  help         - Show this help message"
	@echo ""
	@echo "Examples:"
	@echo "  make              # Compile resume.pdf"
	@echo "  make view         # Compile and open PDF"
	@echo "  make clean        # Remove temporary files"

# Phony targets
.PHONY: all xelatex full clean clean-all view view-linux watch count check install-packages backup help

# Default goal
.DEFAULT_GOAL := all