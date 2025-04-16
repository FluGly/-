import Question from './Question.js';


export default class TestEngine {
    /**
     * Конструктор класса TestEngine.
     * @param {object[]} questionsData - Массив объектов с данными вопросов.
     * @param {object} settings - Объект с настройками теста.
     */
    constructor(questionsData, settings) {
        /**
         * Массив объектов Question, представляющих вопросы теста.
         * @type {Question[]}
         */
        this.questions = questionsData.map(q => new Question(
            q.id,
            q.text,
            q.type,
            q.answers,
            q.correctAnswer
        ));
        /**
         * Объект с настройками теста.
         * @type {object}
         */
        this.settings = settings;
        /**
         * Индекс текущего вопроса в массиве questions.
         * @type {number}
         * @default 0
         */
        this.currentQuestionIndex = 0;
        /**
         * Объект, хранящий ответы пользователя на вопросы. Ключ - id вопроса, значение - ответ пользователя.
         * @type {object}
         */
        this.userAnswers = {};
        /**
         * Время начала теста (timestamp).
         * @type {number}
         */
        this.startTime = Date.now();
        /**
         * Идентификатор таймера (setInterval).
         * @type {number}
         */
        this.timer = null;
        /**
         * Оставшееся время на тест в секундах.
         * @type {number}
         * @default settings.timeLimit * 60
         */
        this.timeLeft = settings.timeLimit * 60;

        this.applySettings();
    }

    /**
     * Применяет настройки теста: перемешивает вопросы и/или ответы.
     */
    applySettings() {
        if (this.settings.shuffleQuestions) {
            this.shuffleQuestions();
        }
        if (this.settings.shuffleAnswers) {
            this.shuffleAllAnswers();
        }
    }

    /**
     * Перемешивает порядок вопросов в массиве questions случайным образом.
     */
    shuffleQuestions() {
        this.questions = [...this.questions].sort(() => Math.random() - 0.5);
    }

    /**
     * Перемешивает порядок ответов для каждого вопроса с типом 'single', 'multiple' или 'dropdown'.
     */
    shuffleAllAnswers() {
        this.questions.forEach(question => {
            if (question.type === 'single' || question.type === 'multiple' || question.type === 'dropdown') {
                question.answers = [...question.answers].sort(() => Math.random() - 0.5);
            }
        });
    }

    /**
     * Запускает таймер.
     * @param {function} updateCallback - Функция, вызываемая каждую секунду для обновления отображения времени.
     * @param {function} finishCallback - Функция, вызываемая при завершении времени.
     */
    startTimer(updateCallback, finishCallback) {
        this.timer = setInterval(() => {
            this.timeLeft--;

            if (this.timeLeft <= 0) {
                this.finishTest();
                if (finishCallback) finishCallback();
                return;
            }

            if (updateCallback) updateCallback(this.getFormattedTime());
        }, 1000);
    }

    /**
     * Форматирует оставшееся время в строку вида "MM:SS".
     * @returns {string} Строка с отформатированным временем.
     */
    getFormattedTime() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    /**
     * Сохраняет ответ пользователя на вопрос.
     * @param {number} questionId - ID вопроса.
     * @param {any} answer - Ответ пользователя.
     */
    saveUserAnswer(questionId, answer) {
        this.userAnswers[questionId] = answer;
    }

    /**
     * Возвращает текущий вопрос.
     * @returns {Question} Текущий вопрос.
     */
    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    /**
     * Перемещает к вопросу с указанным индексом.
     * @param {number} index - Индекс вопроса.
     * @returns {boolean} Успешность перемещения.
     */
    moveToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentQuestionIndex = index;
            return true;
        }
        return false;
    }

    /**
     * Завершает тест и сохраняет результаты в localStorage.
     */
    finishTest() {
        clearInterval(this.timer);

        const results = {
            questions: this.questions,
            userAnswers: this.userAnswers,
            score: this.calculateScore(),
            total: this.questions.length,
            timeSpent: (this.settings.timeLimit * 60) - this.timeLeft
        };

        localStorage.setItem('testResults', JSON.stringify(results));
    }

    /**
     * Подсчитывает количество правильных ответов пользователя.
     * @returns {number} Количество правильных ответов.
     */
    calculateScore() {
        let score = 0;
        this.questions.forEach(question => {
            const userAnswer = this.userAnswers[question.id];
            if (userAnswer && question.checkAnswer(userAnswer)) {
                score++;
            }
        });
        return score;
    }
}