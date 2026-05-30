from langchain_text_splitters import RecursiveCharacterTextSplitter


def splitter(docs):

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )

    return text_splitter.split_documents(docs)