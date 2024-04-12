import React from 'react'
import './App.scss'
import Spinner from 'react-bootstrap/Spinner'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App">
      <TweetArea />
      <Footer />
    </div>
  )
}

function TweetArea() {
  const [sentences, setSentences] = React.useState([])
  const [srcTweet, setSrcTweet] = React.useState()
  const [tweetText, setTweetText] = React.useState('')
  const [index, setIndex] = React.useState(0)

  async function loadSentences() {
    // previously it was using '/generator' endpoint which actually generated sentence on compiled model using python3
    // then I generated ~1000 sentences and saved to text file, leaving /generator to read from this file
    // unfortunately I have little RAM so I had to stop nodejs server and make the file static
    const response = await fetch('/generated.txt')
    const sentences = await response.text()
    setSentences(sentences.split('\n').filter(Boolean))
  }

  React.useEffect(() => {
    loadNewSentence(sentences)
  }, [sentences])

  async function loadNewSentence(sentences) {
    setSrcTweet(sentences[Math.floor(Math.random() * sentences.length)])
    setIndex(0)
    setTweetText('')
  }

  React.useEffect(() => {
    loadSentences()
  }, [])

  const handleReset = async () => {
    await new Promise(resolve => setTimeout(resolve, 500))
    loadNewSentence(sentences)
  }

  return (
    <div id="area">
      <div id="tweet-inner">
        <div id="tweet-heading">
          <svg viewBox="0 0 24 24"><g><path d="M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"></path></g></svg>
        </div>
        <div id="tweet-content">
          <div id="user-avatar">
            <img src="/picture.png" width="48" height="48" alt="Автарка"/>
          </div>
          <div id="tweet-editor">
            <TweetText 
              value={tweetText}
              onHit={() => {
                setTweetText(tweetText + (srcTweet[index] ?? ''))
                setIndex(index + 1)
              }}
            />
            <div id="tweet-buttonbar">
              <div id="tweet-bar-buttons">
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
              </div>
              <TweetButton 
                disabled={tweetText === ''}
                onReset={handleReset} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TweetText({ value, onHit }) {
  const textarea = React.useRef()

  const handleKeyDown = event => {
    event.preventDefault()
    textarea.current.scrollTo(0, 99999)
    onHit()
    return false
  }

  const handleChange = (e) => {
    if(e.target.value !== value) {
      handleKeyDown(e)
    }
  }

  return (
    <textarea 
      spellCheck="false" 
      placeholder="Что происходит? Напечатайте текст на клавиатуре..." 
      value={value}
      ref={textarea}
      id="tweet-text"
      onChange={handleChange}
    />
  )
}

function ButtonPlaceholder() {
  return <div className="button-placeholder"></div>
}

function TweetButton({ onReset, disabled }) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    document.querySelector('#tweet-text').setAttribute('disabled', 'disabled')
    await onReset()
    setIsLoading(false)
    document.querySelector('#tweet-text').removeAttribute('disabled')
  }

  return (
    <button disabled={disabled} id="tweet-action" onClick={handleClick}>{
      isLoading?
      <Spinner animation="border" variant="light" size="sm" />
      :'Твитнуть'
    }</button>
  )
}

function Footer() {
  return (
    <footer>
      <p>
        Шизоньян — генератор твитов <a href="https://twitter.com/M_Simonyan">Маргариты Симоньян</a>.
        Автор: VityaSchel / 2021
      </p>
      <p>
        ИИ использует цепи маркова, натренировано на ~15 тыс твитах Маргариты с 2012 по 2021 годы.
      </p>
    </footer>
  )
}

export default App
