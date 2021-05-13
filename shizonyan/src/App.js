import React from 'react'
import logo from './logo.svg';
import './App.scss';
import Spinner from 'react-bootstrap/Spinner'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <div className="App">
      <TweetArea />
      <Footer />
    </div>
  );
}

function TweetArea() {
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
            <TweetText />
            <div id="tweet-buttonbar">
              <div id="tweet-bar-buttons">
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
                <ButtonPlaceholder />
              </div>
              <TweetButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

let srcTweet; let index;
function TweetText() {
  const textarea = React.useRef()

  const handleKeyDown = event => {
    if(['a', 'ф'].includes(event.key) && event.ctrlKey) { return; }
    event.preventDefault()
    textarea.current.value += srcTweet[index]??''
    index++;
    textarea.current.scrollTo(0, 99999)
  }

  return (
    <textarea onKeyDown={handleKeyDown} ref={textarea} spellCheck="false"
      placeholder="Что происходит?" id="tweet-text"></textarea>
  )
}

function ButtonPlaceholder() {
  return <div className="button-placeholder"></div>
}

function TweetButton() {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    document.querySelector('#tweet-text').setAttribute('disabled', 'disabled')
    await loadNewSentence()
    setIsLoading(false)
    document.querySelector('#tweet-text').removeAttribute('disabled')
  }

  return (
    <button id="tweet-action" onClick={handleClick}>{
      isLoading?
      <Spinner animation="border" variant="light" size="sm" />
      :'Твитнуть'
    }</button>
  )
}

async function loadNewSentence() {
  let newSentenceResponse = await fetch('/generator')
  let newSentence = await newSentenceResponse.text()
  document.querySelector('#tweet-text').value = ''
  srcTweet = newSentence
  index = 0
  return true;
}

window.addEventListener('load', () => loadNewSentence())

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

export default App;
