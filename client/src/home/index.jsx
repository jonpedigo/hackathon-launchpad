import React, { useState, useEffect } from "react"
import './index.css';

import generatePoem from './romance.js'
import generatePoem2 from './romance2.js'

import Sentiment from 'sentiment'

let sentiment = new Sentiment();

// var result = sentiment.analyze('Cats are stupid smart');

// const words = require("similar-english-words");
// console.log(words.crazy)

export default function Home() {
  let [answers, setAnswers] = useState({
    before: 'waitress, serving other people, same routine, same schedule, no $$. GM of small company - got better b/c I could make my own decisions, but still ultimately worked for the CEO and was not in control of the direction of my job. ',
    become: 'I make decisions about my life and my life only. I don’t have to answer to anyone else. I don’t have to rely on someone else to make a living. I wish I was more self-made instead of depending on a client needing my time.',
    now: 'scheduling someone else’s life, answering to someone else, constantly trying to read and please that person and be perfect for someone else.',
  })

  let [poems, setPoems] = useState({
    romance: [],
    terence: [],
  })
  // useEffect(() => {
  //
  // }, [])

  function onChange(value, property){
    setAnswers({...answers, [property]: value})
  }

  const notAllowedDefault = ['i', 'that','not', 'to']
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
    console.log('replacedand', words.replace(regexAnd, ','))
    return words.replace(regexAnd, ',').replace(regexBut, ',')
  }

  function generateTerencePoem() {
    let lines = [answers.before, answers.now, answers.become]
    const analysis = sentiment.analyze(lines.join(' '));
    return lines.map((words) => {
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
      terence: terencePoem
    })
  }

  return <div className='home'>
    <h3>What it was before</h3>
    <input value={answers.before} onChange={(e) => onChange(e.target.value, 'before')}/>

    <h3>What is it now</h3>
    <input value={answers.now} onChange={(e) => onChange(e.target.value, 'now')}/>

    <h3>What do you wish it would become</h3>
    <input value={answers.become} onChange={(e) => onChange(e.target.value, 'become')}/>

    <div>
      <button onClick={onSubmitClick}>Submit your POEMS</button>
    </div>

    <h5>ROMANCE.js POEM</h5>
    <div>
      {poems.romance.map((line) => <div>{line}</div>)}
    </div>

    <h5>TERENCE POEM</h5>
    <div>
      {poems.terence.map((line) => <div>{line}</div>)}
    </div>
  </div>
}
