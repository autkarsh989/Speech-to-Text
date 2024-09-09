// Check if the browser supports SpeechRecognition
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
  alert('Your browser does not support Speech Recognition. Please use Chrome or another supported browser.');
} else {
  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.continuous = false;

  const languageSelect = document.getElementById('language');
  const startBtn = document.getElementById('start-btn');
  const copyBtn = document.getElementById('copy-btn');
  const resultDiv = document.getElementById('result');
  
  let finalTranscript = '';
  
  // Throttling for interim results
  let interimThrottleTimeout;
  
  // Update language dynamically based on selection
  languageSelect.addEventListener('change', () => {
    recognition.lang = languageSelect.value;
  });

  // Start speech recognition when the user clicks the start button
  startBtn.addEventListener('click', () => {
    finalTranscript = ''; // Reset previous results
    resultDiv.textContent = 'Listening...';
    copyBtn.style.display = 'none'; // Hide copy button initially
    recognition.start();
  });

  // Handle interim and final results
  recognition.addEventListener('result', (event) => {
    let interimTranscript = '';
    
    // Loop through the speech recognition results
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript;
      } else {
        interimTranscript += result[0].transcript;
      }
    }

    // Update final results and append to the text area dynamically
    if (interimTranscript) {
      if (!interimThrottleTimeout) {
        interimThrottleTimeout = setTimeout(() => {
          resultDiv.textContent = finalTranscript + '\n' + interimTranscript;
          interimThrottleTimeout = null;
        }, 500); // Throttle interim updates every 500ms
      }
    } else {
      resultDiv.textContent = finalTranscript;
    }
  });

  // On recognition end, enable copy button if text was recorded
  recognition.addEventListener('end', () => {
    if (finalTranscript) {
      copyBtn.style.display = 'inline';
      resultDiv.textContent = finalTranscript; // Display final transcript only
    } else {
      resultDiv.textContent = 'No speech was detected. Please try again.';
    }
  });

  // Copy the transcribed text to clipboard
  copyBtn.addEventListener('click', () => {
    const textToCopy = resultDiv.textContent;
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Text copied to clipboard!');
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  });

  // Handle errors during speech recognition
  recognition.addEventListener('error', (event) => {
    console.error('Speech recognition error detected: ' + event.error);
    if (event.error === 'no-speech') {
      resultDiv.textContent = 'No speech detected. Please try again.';
    } else if (event.error === 'audio-capture') {
      resultDiv.textContent = 'Microphone not detected. Please check your settings.';
    } else {
      resultDiv.textContent = 'An error occurred: ' + event.error;
    }
  });
}
