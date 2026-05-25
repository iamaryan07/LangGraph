from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader

BASE_DIR = Path(__file__).resolve().parent

PATH = BASE_DIR / "Hands-On Machine Learning with Scikit-Learn and Pytorch.pdf"


def load_pdf():
    loader = PyPDFLoader(str(PATH))
    return loader.load()