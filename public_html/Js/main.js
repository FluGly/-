import TestEngine from './TestEngine.js';

document.getElementById('settings').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const settings = {
        timeLimit: parseInt(document.getElementById('time-limit').value),
        shuffleQuestions: document.getElementById('shuffle-questions').checked,
        shuffleAnswers: document.getElementById('shuffle-answers').checked
    };
    
    fetch('data/database.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('testSettings', JSON.stringify(settings));
            localStorage.setItem('testQuestions', JSON.stringify(data.questions));
            
            window.location.href = 'test.html';
        })
        .catch(error => console.error('Ошибка загрузки вопросов:', error));
});