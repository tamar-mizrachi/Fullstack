import React, { useState, useEffect } from 'react';

const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  let recognition: any;

  useEffect(() => {
    if ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'he-IL';

      recognition.onresult = (event: any) => { // שינוי מ-SpeechRecognitionEvent ל-any
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => { // שינוי מ-SpeechRecognitionErrorEvent ל-any
        console.error('שגיאה בזיהוי דיבור:', event.error);
      };
    } else {
      alert('הדפדפן שלך לא תומך בזיהוי דיבור.');
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <div style={{ background: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
      <h3>תמלול בזמן אמת</h3>
      <button onClick={startListening} disabled={isListening}>התחלת תמלול</button>
      <button onClick={stopListening} disabled={!isListening}>סיום תמלול</button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechToText;
