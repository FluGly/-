document.addEventListener('DOMContentLoaded', () => {
    try {
        let results = JSON.parse(localStorage.getItem('testResults')) || 
                     JSON.parse(sessionStorage.getItem('testResultsBackup'));
        
        if (!results) {
            throw new Error('Данные результатов не найдены');
        }

        console.log('Загруженные результаты:', results);
        
        const resultsBody = document.getElementById('results-body');
        const totalScoreElement = document.getElementById('total-score');
        
        if (!resultsBody || !totalScoreElement) {
            throw new Error('Не найдены элементы таблицы результатов');
        }
        
        resultsBody.innerHTML = '';
        
        let totalScore = 0;
        
        results.questions.forEach((question, index) => {
            const row = document.createElement('tr');
            const userAnswer = results.userAnswers[question.id];
            const isCorrect = userAnswer && checkAnswer(question, userAnswer);
            
            if (isCorrect) totalScore++;
            
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHtml(question.text)}</td>
                <td>${formatUserAnswer(question, userAnswer)}</td>
                <td>${formatCorrectAnswer(question)}</td>
                <td>${isCorrect ? '1' : '0'}</td>
            `;
            
            row.classList.add(isCorrect ? 'correct' : 'incorrect');
            resultsBody.appendChild(row);
        });
        
        totalScoreElement.textContent = totalScore;
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert(`Ошибка: ${error.message}\n\nВернитесь на страницу теста.`);
        window.location.href = 'test.html';
    }
    
    function checkAnswer(question, userAnswer) {
        switch (question.type) {
            case 'single':
            case 'dropdown':
                return question.answers.find(a => a.correct)?.id === userAnswer;
            case 'multiple':
                const correctIds = question.answers.filter(a => a.correct).map(a => a.id);
                return JSON.stringify(correctIds.sort()) === JSON.stringify(userAnswer.sort());
            case 'text':
                return userAnswer.trim().toLowerCase() === question.correctAnswer.toLowerCase();
            default:
                return false;
        }
    }
    
    function formatUserAnswer(question, userAnswer) {
        if (!userAnswer || (Array.isArray(userAnswer) && userAnswer.length === 0)) {
            return '<span class="wrong-answer">Нет ответа</span>';
        }
        
        switch (question.type) {
            case 'single':
            case 'dropdown':
                const answer = question.answers.find(a => a.id === userAnswer);
                const isCorrect = checkAnswer(question, userAnswer);
                return `<span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${
                    escapeHtml(answer ? answer.text : userAnswer)
                }</span>`;
                
            case 'multiple':
                return userAnswer.map(id => {
                    const a = question.answers.find(a => a.id === id);
                    const isCorrect = a?.correct;
                    return `<span class="${isCorrect ? 'correct-answer' : 'wrong-answer'}">${
                        escapeHtml(a ? a.text : id)
                    }</span>`;
                }).join(', ');
                
            case 'text':
                const textIsCorrect = checkAnswer(question, userAnswer);
                return `<span class="${textIsCorrect ? 'correct-answer' : 'wrong-answer'}">${
                    escapeHtml(userAnswer)
                }</span>`;
                
            default:
                return escapeHtml(userAnswer);
        }
    }
    
    function formatCorrectAnswer(question) {
        switch (question.type) {
            case 'single':
            case 'dropdown':
                const correctSingle = question.answers.find(a => a.correct);
                return `<span class="correct-answer">${escapeHtml(correctSingle?.text || '')}</span>`;
                
            case 'multiple':
                return question.answers
                    .filter(a => a.correct)
                    .map(a => `<span class="correct-answer">${escapeHtml(a.text)}</span>`)
                    .join(', ');
                    
            case 'text':
                return `<span class="correct-answer">${escapeHtml(question.correctAnswer)}</span>`;
                
            default:
                return '';
        }
    }
    
    document.getElementById('restart-test').addEventListener('click', () => {
  localStorage.removeItem('testResults');
  localStorage.removeItem('testSettings');
  localStorage.removeItem('testQuestions');
  window.location.href = 'index.html';
});

    function escapeHtml(unsafe) {
        if (!unsafe) return '';
        return unsafe.toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});