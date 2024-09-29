from systems.recommendation.prepare_data import PrepareData

def preprocess_books(books, top_n=10):
    prepare_data = PrepareData(
        top_n,
        text_format='plain',
        attributes=["title", "topics", "subtopics", "description"],
        keys=["book_id", "keywords", "subject", "audience_level"]
    )
    
    prepare_data.fit(books)
    processed_books = prepare_data.transform(books)
    return processed_books

def preprocess_notes(notes, top_n=15):
    prepare_data = PrepareData(
        top_n,
        text_format='markdown',  # Assuming notes might be in Markdown or HTML
        attributes=["title", "note_text", "examples_illustrations"],  # Attributes relevant to notes
        keys=["note_id", "subtopic_id", "keywords", "connected_notes", "relevance_score", "subject", "audience_level"]
    )

    prepare_data.fit(notes)
    processed_notes = prepare_data.transform(notes)
    return processed_notes