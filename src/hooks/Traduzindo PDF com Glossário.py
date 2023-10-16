from google.cloud import translate_v3beta1 as translate
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/turia/OneDrive/Área de Trabalho/Desktop Boladão/Machine Translation/chaves/eighth-effect-259620-16c06c8f9d4d.json"


def translate_document(project_id: str, file_path: str, glossary_id: str):

    client = translate.TranslationServiceClient()
    location = "us-central1"
    parent = f"projects/{project_id}/locations/{location}"

    glossary = client.glossary_path(
        project_id, "us-central1", glossary_id  # The location of the glossary
    )

    glossary_config = translate.TranslateTextGlossaryConfig(glossary=glossary)


    # Supported file types: https://cloud.google.com/translate/docs/supported-formats
    with open(file_path, "rb") as document:
        document_content = document.read()

    document_input_config = {
        "content": document_content,
        "mime_type": "application/pdf",
    }

    response = client.translate_document(
        request={
            "parent": parent,
            "source_language_code": "en",
            "target_language_code": "es",
            "document_input_config": document_input_config,
            "glossary_config": glossary_config,
        }
    )



    # Write the translated file to disk
    output_file_path = os.path.join(os.path.dirname(file_path), "capaimemo.pdf")
    with open(output_file_path, "wb") as output_file:
        output_file.write(response.glossary_document_translation.byte_stream_outputs[0])



    print(f"Translated file saved to: {output_file_path}")
    print("Response: Detected Language Code - {}".format(response.document_translation.detected_language_code))

translate_document("eighth-effect-259620", "./1paginaingles.pdf", glossary_id = "pagina",)



"""

response = client.translate_text(
    contents = [source_text],
    parent = parent,
    mime_type = 'text/html',
    source_language_code = source_language,
    target_language_code = target_language,
    model = model_id,
    glossary_config = glossary_config,
    timeout = 90
)
google_translation = response.glossary_translations[0].translated_text # Here "glossary_translations" must be used instead of "translations", if you use glossary.

"""