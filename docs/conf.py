# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Setting up backend for documentation-------------------------------------

import os
import sys

sys.path.insert(0, os.path.abspath("../backend"))

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "REEV"
copyright = "2023, REEV Authors"
author = "REEV Authors"

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ["sphinx.ext.autodoc", "sphinxcontrib.bibtex"]

templates_path = ["_templates"]
exclude_patterns = ["_build", "Thumbs.db", ".DS_Store"]


# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = "furo"
html_static_path = ["_static"]

# -- Configuration for sphinxcontrib-bibtex ----------------------------------
# https://sphinxcontrib-bibtex.readthedocs.io/en/latest/usage.html

bibtex_bibfiles = ["refs.bib"]

# -- Special LaTeX Errors ----------------------------------------------------
# cf. https://stackoverflow.com/a/28454426/84349
latex_elements = {
    "preamble": r"\usepackage{enumitem}\setlistdepth{99}",
}
