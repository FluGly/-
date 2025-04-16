/**
 * @class Question
 * @classdesc Класс, представляющий вопрос теста.
 */
export default class Question {
  /**
   * Конструктор класса Question.
   * @param {number} id - Уникальный идентификатор вопроса.
   * @param {string} text - Текст вопроса.
   * @param {string} type - Тип вопроса (single/multiple/text/dropdown).
   * @param {Array<object>} answers - Массив вариантов ответов. Каждый элемент - объект вида {id: string, text: string, correct?: boolean}.
   * @param {string} correctAnswer - Правильный ответ (для текстовых вопросов).
   */
  constructor(id, text, type, answers, correctAnswer) {
    /**
     * Уникальный идентификатор вопроса.
     * @type {number}
     */
    this.id = id;
    /**
     * Текст вопроса.
     * @type {string}
     */
    this.text = text;
    /**
     * Тип вопроса (single/multiple/text/dropdown).
     * @type {string}
     */
    this.type = type;
    /**
     * Массив вариантов ответов.
     * @type {Array<object>}
     * @default []
     */
    this.answers = answers || [];
    /**
     * Правильный ответ (для текстовых вопросов).
     * @type {string}
     */
    this.correctAnswer = correctAnswer;
  }

  /**
   * Проверяет ответ пользователя.
   * @param {string|Array<string>} userAnswer - Ответ пользователя. Для single/dropdown - строка, для multiple - массив строк.
   * @returns {boolean} - Верный ли ответ.
   */
  checkAnswer(userAnswer) {
    switch (this.type) {
      case 'single':
      case 'dropdown':
        return this.answers.find(a => a.correct)?.id === userAnswer;

      case 'multiple':
        if (!Array.isArray(userAnswer)) return false; 
        const correctIds = this.answers
          .filter(a => a.correct)
          .map(a => a.id);
        return JSON.stringify(correctIds.sort()) ===
               JSON.stringify(userAnswer.sort());

      case 'text':
        return userAnswer.trim().toLowerCase() ===
               this.correctAnswer.toLowerCase();

      default:
        return false;
    }
  }

  /**
   * Возвращает текст правильного ответа (для отображения в результатах).
   * @returns {string} - Текст правильного ответа.
   */
  getCorrectAnswerText() {
    switch (this.type) {
      case 'single':
      case 'dropdown':
        return this.answers.find(a => a.correct)?.text || '';

      case 'multiple':
        return this.answers
          .filter(a => a.correct)
          .map(a => a.text)
          .join(', ');

      case 'text':
        return this.correctAnswer;

      default:
        return '';
    }
  }
 
/**
   * @method shuffleAnswers
   * @returns {void}
   */
  shuffleAnswers() {
    if (this.type === 'single' || this.type === 'multiple') {
      for (let i = this.answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.answers[i], this.answers[j]] = [this.answers[j], this.answers[i]];
      }
    }
  }
}