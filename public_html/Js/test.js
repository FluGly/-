import TestEngine from './TestEngine.js';
import Question from './Question.js';

document.addEventListener('DOMContentLoaded', () => {
    const settings = JSON.parse(localStorage.getItem('testSettings'));
    const questionsData = JSON.parse(localStorage.getItem('testQuestions'));
    
    if (!settings || !questionsData) {
        alert('Настройки теста не найдены. Вернитесь на страницу начала теста.');
        window.location.href = 'index.html';
        return;
    }
    
    // Добавьте в finishTest()


// Добавьте в начало test.js (после проверки настроек)
if (localStorage.getItem('testCompleted')) {
  localStorage.removeItem('testCompleted');
  window.location.href = 'index.html';
  return;
}
    
    const testEngine = new TestEngine(questionsData, settings);
    const questionButtonsContainer = document.getElementById('question-buttons');
    const answersContainer = document.getElementById('answers-container');
    const questionText = document.getElementById('question-text');
    const questionNumber = document.getElementById('question-number');
    const questionsTotal = document.getElementById('questions-total');
    const timeLeftElement = document.getElementById('time-left');
    
    questionsTotal.textContent = testEngine.questions.length;
    renderQuestionButtons();
    showCurrentQuestion();
    
    testEngine.startTimer(updateTime, finishTest);
    
    document.getElementById('force-finish').addEventListener('click', finishTest);
    
    function updateTime(time) {
        timeLeftElement.textContent = time;
    }
    
   function finishTest() {
       localStorage.setItem('testCompleted', 'true');
    const results = {
        questions: testEngine.questions,
        userAnswers: testEngine.userAnswers,
        score: testEngine.calculateScore()
        
    };
    
    console.log('Сохранение результатов:', results); 
    localStorage.setItem('testResults', JSON.stringify(results));
    window.location.href = 'results.html';
}
    
    function renderQuestionButtons() {
        questionButtonsContainer.innerHTML = '';
        testEngine.questions.forEach((question, index) => {
            const button = document.createElement('button');
            button.textContent = index + 1;
            button.className = 'question-button';
            
            if (index === testEngine.currentQuestionIndex) {
                button.classList.add('current');
            }
            
            button.addEventListener('click', () => {
                testEngine.moveToQuestion(index);
                showCurrentQuestion();
                updateQuestionButtons();
            });
            
            questionButtonsContainer.appendChild(button);
        });
    }
    
    function updateQuestionButtons() {
        const buttons = questionButtonsContainer.querySelectorAll('.question-button');
        buttons.forEach((button, index) => {
            button.classList.toggle('current', index === testEngine.currentQuestionIndex);
            
            const questionId = testEngine.questions[index].id;
            if (testEngine.userAnswers[questionId]) {
                button.classList.add('answered');
            } else if (index === testEngine.currentQuestionIndex) {
                button.classList.remove('answered');
            }
        });
    }
    
    function showCurrentQuestion() {
        const question = testEngine.getCurrentQuestion();
        questionNumber.textContent = testEngine.currentQuestionIndex + 1;
        questionText.textContent = question.text;
        answersContainer.innerHTML = '';
        
        const previousAnswer = testEngine.userAnswers[question.id];
        
        switch (question.type) {
            case 'single':
                renderSingleChoice(question, previousAnswer);
                break;
            case 'multiple':
                renderMultipleChoice(question, previousAnswer);
                break;
            case 'text':
                renderTextInput(question, previousAnswer);
                break;
            case 'dropdown':
                renderDropdown(question, previousAnswer);
                break;
        }
    }
    
    function renderSingleChoice(question, selectedAnswer) {
        question.answers.forEach(answer => {
            const div = document.createElement('div');
            div.className = 'answer-option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.id = `answer-${answer.id}`;
            input.value = answer.id;
            
            if (selectedAnswer === answer.id) {
                input.checked = true;
            }
            
            input.addEventListener('change', () => {
                testEngine.saveUserAnswer(question.id, answer.id);
                updateQuestionButtons();
            });
            
            const label = document.createElement('label');
            label.htmlFor = `answer-${answer.id}`;
            label.textContent = answer.text;
            
            div.appendChild(input);
            div.appendChild(label);
            answersContainer.appendChild(div);
        });
    }
    
    function renderMultipleChoice(question, selectedAnswers = []) {
        question.answers.forEach(answer => {
            const div = document.createElement('div');
            div.className = 'answer-option';
            
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `answer-${answer.id}`;
            input.value = answer.id;
            
            if (selectedAnswers && selectedAnswers.includes(answer.id)) {
                input.checked = true;
            }
            
            input.addEventListener('change', () => {
                const checkedBoxes = Array.from(
                    answersContainer.querySelectorAll('input[type="checkbox"]:checked')
                ).map(box => box.value);
                
                testEngine.saveUserAnswer(question.id, checkedBoxes);
                updateQuestionButtons();
            });
            
            const label = document.createElement('label');
            label.htmlFor = `answer-${answer.id}`;
            label.textContent = answer.text;
            
            div.appendChild(input);
            div.appendChild(label);
            answersContainer.appendChild(div);
        });
    }
    
    function renderTextInput(question, previousAnswer = '') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-answer';
        input.placeholder = 'Введите ваш ответ...';
        input.value = previousAnswer || '';
        
        input.addEventListener('input', () => {
            testEngine.saveUserAnswer(question.id, input.value);
            updateQuestionButtons();
        });
        
        answersContainer.appendChild(input);
    }
    
    window.addEventListener('beforeunload', (e) => {
  if (!localStorage.getItem('testResults')) {
    e.preventDefault();
    e.returnValue = 'Тест будет сброшен при обновлении страницы. Вы уверены?';
  }
});


    
    function renderDropdown(question, selectedAnswer = '') {
        const select = document.createElement('select');
        select.className = 'dropdown-answer';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = '-- Выберите ответ --';
        defaultOption.disabled = true;
        defaultOption.selected = !selectedAnswer;
        select.appendChild(defaultOption);
        
        question.answers.forEach(answer => {
            const option = document.createElement('option');
            option.value = answer.id;
            option.textContent = answer.text;
            option.selected = answer.id === selectedAnswer;
            select.appendChild(option);
        });
        
        select.addEventListener('change', () => {
            testEngine.saveUserAnswer(question.id, select.value);
            updateQuestionButtons();
        });
        
        answersContainer.appendChild(select);
    }
});