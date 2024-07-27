function transcribeAudio() {
    const audioInput = document.getElementById('audioInput');
    if (audioInput.files.length === 0) {
        alert('Please upload an audio file.');
        return;
    }

    const file = audioInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(event.target.result, function(buffer) {
            const recognizer = new webkitSpeechRecognition();
            recognizer.lang = 'en-US'; // Change this to the appropriate language code if necessary

            recognizer.onresult = function(event) {
                const transcription = event.results[0][0].transcript;
                document.getElementById('transcription').innerText = transcription;
            };

            recognizer.onerror = function(event) {
                console.error('Speech recognition error', event);
            };

            recognizer.onend = function() {
                console.log('Speech recognition ended');
            };

            const audioBufferSourceNode = audioContext.createBufferSource();
            audioBufferSourceNode.buffer = buffer;
            audioBufferSourceNode.connect(audioContext.destination);

            audioBufferSourceNode.start(0);
            recognizer.start();
        }, function(error) {
            console.error('Error decoding audio data', error);
        });
    };

    reader.onerror = function(error) {
        console.error('Error reading file', error);
    };

    reader.readAsArrayBuffer(file);
}
