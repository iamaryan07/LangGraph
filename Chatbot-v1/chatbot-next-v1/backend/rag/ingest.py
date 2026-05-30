from rag.loader import load_pdf
from rag.splitter import splitter
from rag.vector_store import create_vector_store


docs = load_pdf()

chunks = splitter(docs)

create_vector_store(chunks)

print("FAISS index created")