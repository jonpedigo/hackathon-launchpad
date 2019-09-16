import React, { useState, useEffect } from "react"
import './index.css';

import generatePoem from './romance.js'
import generatePoem2 from './romance2.js'

import Sentiment from 'sentiment'

let sentiment = new Sentiment();

// var result = sentiment.analyze('Cats are stupid smart');

// const words = require("similar-english-words");
// console.log(words.crazy)
let SAVED_POEMS = {}
export default function Home() {
  let [answers, setAnswers] = useState({
    before: '',
    become: '',
    now: '',
  })

  let [poems, setPoems] = useState({
    romance: [],
    terence: [],
  })

  function onChange(value, property){
    setAnswers({...answers, [property]: value})
  }

  const notAllowedDefault = ['i', 'that','not', 'to', 'want', 'my', 'don\'t', 'dont', 'of', 'have', 'was', 'instead']
  function filterWords(words, notAllowed = notAllowedDefault){

    return words.split(' ').filter((word) => {
      if(notAllowed.indexOf(word.toLowerCase()) >= 0) return false
      if(word.indexOf('\'') >= 0){
        return false
      }
      return true
    }).join(' ')
  }

  function replaceWords(words) {
    var regexAnd = /and/gi;
    var regexBut = /but/gi;
    return words.replace(regexAnd, ',').replace(regexBut, ',')
  }

  function generateTerencePoem() {
    let lines = [answers.before, answers.now, answers.become]
    const analysis = sentiment.analyze(lines.join(' '));
    return lines.map((words, i) => {
      words = replaceWords(words)
      words = filterWords(words)
      words = filterWords(words, analysis.negative)
      return generatePoem2(words, 1)
    });
  }

  function onSubmitClick() {
    const poem = generatePoem(filterWords([answers.before, answers.now, ,answers.become].join(' ')), 3)
    const terencePoem = generateTerencePoem()

    setPoems({
      romance: poem,
      terence: terencePoem,
    })

    SAVED_POEMS = {
      romance: poem,
      terence: terencePoem,
    }

    setAnswers({
      ...answers,
      submitted: true,
    })

    setTimeout(() => {
      setPoems({
        ...SAVED_POEMS,
        show: true,
      })
    }, 2000)
  }

  return <div className='home'>
    <div className='answers' style={{opacity: answers.submitted ? 0 : 1}}>
      <h1>Welcome,</h1>
      <p>
      To receive insight in the shape of a poem, <br></br>
      describe what it is that you wish to transform: <br></br></p>

      <h3>What was it before</h3>
      <textarea value={answers.before} onChange={(e) => onChange(e.target.value, 'before')}></textarea>

      <h3>What is it now</h3>
      <textarea value={answers.now} onChange={(e) => onChange(e.target.value, 'now')}></textarea>

      <h3>What do you wish it would become</h3>
      <textarea value={answers.become} onChange={(e) => onChange(e.target.value, 'become')}></textarea>

      <div>
        <button onClick={onSubmitClick}>Proceed</button>
      </div>
    </div>

    <div className='poems' style={{opacity: poems.show ? 1: 0}}>
      <div>
        {poems.terence.map((line) => <div>{line}</div>)}
      </div>
      <br></br>
      <p>Your story continues...<br></br><br></br>
          #metaforyou
        </p>
    </div>
  </div>
}
