import db from '@/db';
import firebase from '@/firebase';


import {
  UPDATE_INFORMAITON,
  ADD_QUESTION,
  UPDATE_QUESTION,
  REMOVE_QUESTION,
  ADD_ANSWER,
  REMOVE_ANSWER,
  UPDATE_ANSWER,
  RESET_QUIZ,
  RESET_QUIZ_LIST,
  PUSH_QUIZ,
  SET_QUIZ
} from './mutations';

const state = {
  newQuiz: {
    title: "FireQuiz 2019",
    description: "Beschreibung",
    questions: [
      {
        question: "Erste Frage",
        points: 50,
        answers: [
          {
            isRight: false,
            answer: "Erste Antwort"
          },
          {
            isRight: false,
            answer: "Zweite Antwort"
          },
          {
            isRight: false,
            answer: "Dritte Antwort"
          }
        ]
      }
    ]
  },

  list: [],

  quiz: null
};

const getters = {
  newQuiz: ({newQuiz}) => newQuiz,
  list: ({list}) => list,
  quiz: ({quiz}) => quiz
};

const mutations = {
  [RESET_QUIZ](state) {
    state.newQuiz = {
      title: "",
      description: "",
      questions: []
    }
  },

  [UPDATE_INFORMAITON](state, info) {
    state.newQuiz.title = info.title;
    state.newQuiz.description = info.description;
  },

  [ADD_QUESTION](state) {
    state.newQuiz
      .questions
      .push({
        question: "Frage",
        points: 0,
        answers: []
      })
  },

  [UPDATE_QUESTION](state, payload) {
    const question = state.newQuiz
            .questions[payload.questionIndex];

    question.question = payload.question;
    question.points = payload.points;
  },

  [REMOVE_QUESTION](state, questionIndex) {
    if (state.newQuiz.questions.length > 1) {
      state.newQuiz
        .questions
        .splice(questionIndex, 1);
    }
  },

  [ADD_ANSWER](state, questionIndex) {
    const answers = state.newQuiz.questions[questionIndex].answers;
    if (answers.length < 5) {
      answers.push({
        answer: "Weitere Frage",
        isRight: false
      });
    }
  },

  [UPDATE_ANSWER](state, payload) {
    const questionIndex = payload.questionIndex;
    const answerIndex = payload.answerIndex;
    const answerText = payload.answer;

    const answer = state.newQuiz
      .questions[questionIndex]
      .answers[answerIndex];

    answer.isRight = payload.isRight;
    answer.answer = answerText;
  },

  [REMOVE_ANSWER](state, payload) {
    const questionIndex = payload.questionIndex;
    const answerIndex = payload.answerIndex;

    const question = state.newQuiz.questions[questionIndex];

    if (question.answers.length > 1) {
      question.answers.splice(answerIndex, 1);
    }
  },

  [PUSH_QUIZ](state, quiz) {
    state.list.push(quiz);
  },

  [RESET_QUIZ_LIST](state) {
    state.list = [];
  },

  [SET_QUIZ](state, quiz) {
    state.quiz = quiz;
  }

};

const actions = {
  async create({state}) {
    const user = firebase.auth().currentUser;
    if (user) {
      const quiz = state.newQuiz;

      if (!quiz.title || !quiz.description)
        throw new Error('Quiz-Informationen werden benötigt!');


      if (quiz.questions.length == 0)
        throw new Error('Quiz ist leer!');

      // Schaut ob eine Frage vorhanden ist, bei welcher es keine richtige Antwort gibt
      quiz.questions.map(question => {
        if (question.answers.length == 0) {
          throw new Error(`Frage: '${question.question}' hat keine Antworten!`)
        }

        let hasRightAnswer = false;

        question.answers.map(answer => {
          if (answer.isRight) hasRightAnswer = true;
        });

        if (!hasRightAnswer) {
          throw new Error(`Frage: '${question.question}' hat keine richtige Antwort!`)
        }
      });

      // In der Datenbank speichern
      await db.collection('quizes').add({
        ...state.newQuiz,
        userId: user.uid
      });

      alert('Quiz erstellt');

    } else {
      alert('Nicht eingeloggt');
    }
    //db.collection('quizes')
  },

  list({commit}) {
    commit(RESET_QUIZ_LIST);

    db.collection('quizes').onSnapshot(snapshot => {
      snapshot.docChanges.forEach(function(change) {
        if (change.type === "added") {
          commit(PUSH_QUIZ, {
            id: change.doc.id,
            ...change.doc.data()
          });
        }
      });
    });
  },

  async get({commit}, id) {
    const quiz = await db.collection('quizes').doc(id).get();

    if (quiz.exists) {
      commit(SET_QUIZ, {
        id: quiz.id,
        ...quiz.data()
      });
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};