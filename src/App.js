import './App.css';
import { useTranslate } from './hooks/useTranslate';
import { useState } from 'react';

const languages = [
  'ingles',
  'espanhol',
  'portugues',
  'frances',
  'italiano'
]

function App() {
  const { translatePDFGoogle} = useTranslate()
  const [wordsNum, setWordsNum] = useState()
  const [text, setText] = useState('');
  const [file, setFile] = useState()
  const [loading, setLoading] = useState(false)
  const [namePDF, setNamePDF] = useState('Meu PDF')

  const handleSubmit = async (e) => {
    e.preventDefault()

    setWordsNum('')

    setText('')

    const labels = document.querySelectorAll('.multiselect-dropdown-list .checked label')

    let labelsChecked = []

    labels.forEach(function(label) {

      const valorDoLabel = label.innerText;
  
      labelsChecked.push(valorDoLabel)
    });

    if (labelsChecked.length === 0) {

      setText("Escolha o idioma para tradução")

      return
    }

    setLoading(true)

    const {message, countWord} = await translatePDFGoogle(file, namePDF, labelsChecked)

    setWordsNum(countWord)

    setText(message)

    setLoading(false)
  }

  const onFileChange = (e) => {

    setFile(e.target.files[0])
    const name = e.target.files[0].name
    setNamePDF(name.slice(0, -4))

  }

  return (
    <div className="main">
      {/* <button onClick={handleClick}>Criar</button> */}
        <form onSubmit={handleSubmit}>
          {file ? file.name : "Sem arquivo"}
          <label htmlFor='archive' id='label-file' >
            clique aqui para upar arquivo
          </label>
          <input type="file" name='archive' id='archive' onChange={onFileChange} required/>
          <label>Para qual nome gostaria de renomear:</label>
          <input id='name' type='text' value={namePDF} onChange={(e) => setNamePDF(e.target.value)} />
          <label>Para qual idioma quer traduzir seu pdf?</label>
            <select name='select'>
              {languages.map((item, index) => (
                <option key={index}>{item}</option>
              )
              )}
            </select>
          <button disabled={!file}>Traduzir PDF</button>
        </form>
          {loading && (
            <p>
            Estamos gerando a tradução do seu PDF
            </p>
          )}
          {wordsNum && (
            <p>
              O seu PDF tem {wordsNum} Palavras
            </p>
          )}
        <p>
          {text}
        </p>
    </div>
  );
}

export default App;
