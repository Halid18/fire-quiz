<template>
  <v-card >
    <v-container v-if="quiz">
      <v-layout v-if="done">
        <v-flex sm12>
          <p>Du hast {{score}} / {{totalScore}} Punkte</p>
          <div v-if="mistakes.length > 0">
            <h3>Deine Fehler:</h3>
            <p
              v-for="(m, i) in mistakes"
              :key="i"
            >
              Frage: {{m.question}} <br />
              Deine Antwort: {{m.chosenAnswer}} <br />
              Richtige Antwort: {{m.rightAnswer}}
              <br />
            </p>
          </div>

          <v-btn to="/">Beenden</v-btn>
        </v-flex>
      </v-layout>
      <v-stepper v-model="step" v-else>
        <v-stepper-header>
          <template v-for="s in quiz.questions.length">
            <v-stepper-step
              :key="s"
              :step="s"
              :complete="step > s"
            />
          </template>
          <v-divider></v-divider>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content
            v-for="(question, i) in quiz.questions"
            :key="i"
            :step="i + 1"
          >
            <h3>{{question.question}}</h3>
            <v-radio-group v-model="stepAnswer">
              <v-radio
                v-for="(answer, j) in question.answers"
                :key="j"
                :label="answer.answer"
                :value="j"
              ></v-radio>
            </v-radio-group>
            <v-btn color="primary" @click.native="next">Weiter</v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>
  </v-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'quiz',

    created() {
      this.getQuiz(this.$route.params.id);
    },

    computed: {
      ...mapGetters('quiz', {quiz: 'quiz'}),

      totalScore() {
        return this.quiz.questions.reduce((curr, question)   => {
          return curr + question.points;
        }, 0);
      }
    },

    methods: {
      ...mapActions('quiz', {getQuiz: 'get'}),

      next() {
        // Schaut ob die Antwort richtig ist
        if (this.stepAnswer == null) return;

        const question = this.quiz.questions[this.step - 1];
        const answer = question.answers[this.stepAnswer];

        if (answer.isRight)
          this.score += question.points;
        else {
          this.mistakes.push({
            question: question.question,
            rightAnswer: question.answers.find(answer => answer.isRight).answer,
            chosenAnswer: answer.answer
          });
        }

        // Schaut ob der Quiz fertig ist
        if (this.step < this.quiz.questions.length) {
          this.step++;
          this.stepAnswer = null;
        } else {
          console.log('hier');
          this.done = true;
        }
      }
    },

    data() {
      return {
        step: 1,
        score: 0,
        stepAnswer: null,
        done: false,
        mistakes: []
      }
    }
  }
</script>
