<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <div class="headline">
          <v-icon>question_answer</v-icon> Neues Quiz
        </div>
      </div>
    </v-card-title>
    <v-subheader>Quiz Informationen</v-subheader>
    <quiz-information />

    <v-subheader>Quiz Fragen</v-subheader>
    <quiz-questions />

    <quiz-actions
      :action="createQuiz"
      actionName="Erstellen"
    />

  </v-card>
</template>

<script>
  import { mapActions } from 'vuex';

  import QuizInformation from '@/components/quiz/QuizInformation';
  import QuizQuestions from '@/components/quiz/QuizQuestions';
  import QuizActions from '@/components/quiz/QuizActions';

  export default {
    name: 'create-quiz',

    components: {
      QuizInformation,
      QuizQuestions,
      QuizActions
    },

    methods: {
      ...mapActions('quiz', {
        create: 'create'
      }),

      async createQuiz() {
        try {
          await this.create();
          this.$router.push('/');
        } catch(error) {
          alert(error);
        }

      }
    }
  }
</script>