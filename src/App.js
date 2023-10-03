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
  const { translatePDF, TextForPDF } = useTranslate()
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

    const {message, countWord} = await translatePDF(file, labelsChecked, namePDF)

    setWordsNum(countWord)

    setText(message)

    setLoading(false)
  }

  const onFileChange = (e) => {

    setFile(e.target.files[0])
    const name = e.target.files[0].name
    setNamePDF(name.slice(0, -4))

  }

  const handleClick = () => {
    TextForPDF(`
    Ouviram do Ipiranga as margens plácidas
De um povo heroico, o brado retumbante
E o Sol da liberdade, em raios fúlgidos
Brilhou no céu da pátria nesse instante

Se o penhor dessa igualdade
Conseguimos conquistar com braço forte
Em teu seio, ó liberdade
Desafia o nosso peito a própria morte

Ó Pátria amada
Idolatrada
Salve! Salve!

Brasil, um sonho intenso, um raio vívido
De amor e de esperança, à terra desce
Se em teu formoso céu, risonho e límpido
A imagem do Cruzeiro resplandece

Gigante pela própria natureza
És belo, és forte, impávido colosso
E o teu futuro espelha essa grandeza

Terra adorada
Entre outras mil
És tu, Brasil
Ó Pátria amada!
Dos filhos deste solo, és mãe gentil
Pátria amada, Brasil!

Deitado eternamente em berço esplêndido
Ao som do mar e à luz do céu profundo
Fulguras, ó Brasil, florão da América
Iluminado ao Sol do Novo Mundo!

Do que a terra mais garrida
Teus risonhos, lindos campos têm mais flores
Nossos bosques têm mais vida
Nossa vida, no teu seio, mais amores

Ó Pátria amada
Idolatrada
Salve! Salve!

Brasil, de amor eterno seja símbolo
O lábaro que ostentas estrelado
E diga o verde-louro dessa flâmula
Paz no futuro e glória no passado

Mas se ergues da justiça a clava forte
Verás que um filho teu não foge à luta
Nem teme, quem te adora, a própria morte

Terra adorada
Entre outras mil
És tu, Brasil
Ó Pátria amada!
Dos filhos deste solo, és mãe gentil
Pátria amada, Brasil!
    `, "hino nacional")
  }

  const handleClickTest = () => {
    console.log('crico');
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
            <select name='select' multiple className='multiselect'>
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
