document.addEventListener('DOMContentLoaded', function() {
  const settingsForm = document.getElementById('settings');

  if (settingsForm) {
    settingsForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Предотвращаем отправку формы по умолчанию

      // Получаем значения из формы
      const timeLimit = document.getElementById('time-limit').value;
      const shuffleQuestions = document.getElementById('shuffle-questions').checked;
      const shuffleAnswers = document.getElementById('shuffle-answers').checked;

      // Создаем URL для перенаправления
      let url = 'test.html?';

      // Добавляем параметры
      url += 'time-limit=' + timeLimit;
      url += '&shuffle-questions=' + (shuffleQuestions ? 'on' : 'off');
      url += '&shuffle-answers=' + (shuffleAnswers ? 'on' : 'off');

      // Перенаправляем на страницу теста
      window.location.href = url;
    });
  } else {
    console.error('Form with id "settings" not found.');
  }
});


