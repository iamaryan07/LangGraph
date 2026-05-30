from rag.vector_store import load_vector_store

vector_store = load_vector_store()

retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 2}
)