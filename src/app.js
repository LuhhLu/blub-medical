let mediaRecorder;
let audioChunks = [];

async function sendText() {
    const userInputElement = document.getElementById('userInput');
    const userInput = userInputElement.value;
    console.log('Sending text:', userInput);

    // Clear the input field after sending the text
    userInputElement.value = '';

    try {
        const response = await fetch('/text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        });

        if (!response.ok) {
            console.error('Failed to send text:', response.statusText);
            document.getElementById('response').innerText = 'Error: ' + response.statusText;
            return;
        }

        const data = await response.json();
        console.log('Received response:', data);

        // Display the response
        document.getElementById('response').innerText = data.reply;

        document.querySelector('.answerarea').style.display = 'block';

        // Hide the instruction overlay and instruction texts
        document.getElementById('instr-overlay').style.display = 'none';
        const instrElements = document.querySelectorAll('.instr, .instr1, .instr2, .instr3, .instr4');
        instrElements.forEach(elem => elem.style.display = 'none');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response').innerText = 'Error: ' + error.message;
    }
}


document.getElementById('sendButton').addEventListener('click', function(event) {
    event.preventDefault();
    sendText();
});

document.getElementById('userInput').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendText();
    }
});



document.getElementById('three-container').addEventListener('click', function(event) {
    event.preventDefault();
    window.location.href = "https://hume-ai-plum.vercel.app/";
});


function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            console.log('Recording started');
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
        })
        .catch(error => {
            console.error('Error accessing microphone:', error);
        });
}

async function stopRecording() {
    mediaRecorder.stop();
    console.log('Recording stopped');
    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        audioChunks = [];
        const audioUrl = URL.createObjectURL(audioBlob);
        document.getElementById('audioPlayback').src = audioUrl;

        const formData = new FormData();
        formData.append('file', audioBlob);

        console.log('Sending audio to server');
        const response = await fetch('/audio', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            console.error('Failed to send audio:', response.statusText);
            document.getElementById('response').innerText = 'Error: ' + response.statusText;
            return;
        }

        const data = await response.json();
        console.log('Received response:', data);
        document.getElementById('response').innerText = data.reply;
    };
}
