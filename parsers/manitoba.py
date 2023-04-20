from PyPDF2 import PdfReader

reader = PdfReader("./location_pdf/manitoba.pdf")
number_pages = len(reader.pages)


for i in range(number_pages):
    page = reader.pages[i]
    text = page.extract_text()
    text = text.splitlines()
    for i in range(len(text)):
        currLine = text[i]
        print(currLine)

    # print(text)