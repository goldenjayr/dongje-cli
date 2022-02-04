#!/usr/bin/env node

import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'
import chalkPipe from 'chalk-pipe'
import util from 'util'
import bluebird from 'bluebird'
import { promisify } from '@google-cloud/promisify'

let playerInfo

const sleep = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms))

async function welcome() {
  const [data] = await promisify(figlet)('WELCOME TO DONGJE SHOW')
  console.log(gradient.pastel.multiline(data) + '\n')

  const rainbowTitle = chalkAnimation.rainbow(
    `Programming isn't about what you know; it's about making the command line look cool`
  )

  await sleep()
  rainbowTitle.stop()

  console.log(`
  ${chalk.bgBlue('HOW TO PLAY')}
  I am a process on your computer.
  If you get any question wrong I will be ${chalk.bgRed('killed')}
  So get all the questions right... \n
`)
}

async function askName() {
  const questions = [
    {
      type: 'input',
      name: 'first_name',
      message: "What's your first name"
    },
    {
      type: 'input',
      name: 'last_name',
      message: "What's your last name",
      default() {
        return 'Doe'
      }
    }
    // {
    //   type: 'input',
    //   name: 'fav_color',
    //   message: "What's your favorite color",
    //   transformer(color, answers, flags) {
    //     const text = chalkPipe(color)(color)
    //     if (flags.isFinal) {
    //       return text + '!'
    //     }

    //     return text
    //   }
    // },
    // {
    //   type: 'input',
    //   name: 'phone',
    //   message: "What's your phone number",
    //   validate(value) {
    //     const pass = value.match(
    //       /^([01]{1})?[-.\s]?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\s?((?:#|ext\.?\s?|x\.?\s?){1}(?:\d+)?)?$/i
    //     )
    //     if (pass) {
    //       return true
    //     }

    //     return 'Please enter a valid phone number'
    //   }
    // }
  ]

  const answers = await inquirer.prompt(questions)
  const answersKaraoke = chalkAnimation.neon(JSON.stringify(answers, null, '  '))
  await sleep()
  answersKaraoke.stop()
  playerInfo = answers
}

async function handleAnswer(isCorrect) {
  const spinner = createSpinner('Checking answer...').start()
  await sleep()

  if (isCorrect) {
    spinner.success({ text: `Nice work ${playerInfo.first_name}. That's a legit answer` })
  } else {
    spinner.error({ text: `💀💀💀 Game over, you lose ${playerInfo.first_name}!` })
    process.exit(1)
  }
}

async function askQuestion() {
  const questions = [
    {
      name: 'question_1',
      type: 'list',
      message: 'JavaScript was created in 10 days then released on\n',
      choices: ['May 23rd, 1995', 'Nov 24th, 1995', 'Dec 4th, 1995', 'Dec 17, 1996'],
      answer: 'Dec 4th, 1995'
    },
    {
      name: 'question_2',
      type: 'list',
      message: 'What is x? var x = 1_1 + "1" + Number(1)\n',
      choices: ['4', '"4"', '"1111"', '69420'],
      answer: '"1111"'
    },
    {
      name: 'question_3',
      type: 'list',
      message: `What is the first element in the array? ['🐏', '🦙', '🐍'].length = 0\n`,
      choices: ['0', '🐏', '🐍', 'undefined'],
      answer: 'undefined'
    },
    {
      name: 'question_4',
      type: 'list',
      message: 'Which of the following is NOT a primitive type?\n',
      choices: [
        'boolean',
        'number',
        'null',
        'object' // Correct
      ],
      answer: 'object'
    },
    {
      name: 'question_5',
      type: 'list',
      message:
        'JS is a high-level single-threaded, garbage-collected,\n' +
        'interpreted(or just-in-time compiled), prototype-based,\n' +
        'multi-paradigm, dynamic language with a ____ event loop\n',
      choices: ['multi-threaded', 'non-blocking', 'synchronous', 'promise-based'],
      answer: 'non-blocking'
    }
  ]

  await bluebird.each(questions, async (question) => {
    const transformAnswer = (answer) => Object.values(answer)
    const [answer] = await inquirer.prompt(question).then(transformAnswer)
    await handleAnswer(answer === question.answer)
  })
}

async function winner() {
  console.clear()
  figlet(`Congrats , ${playerInfo.first_name} !\n $ 1 , 0 0 0 , 0 0 0`, (err, data) => {
    console.log(gradient.pastel.multiline(data) + '\n')
    process.exit(0)
  })
}

await welcome()
await askName()
await askQuestion()
await winner()
