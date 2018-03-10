let app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        if (id === 'deviceready') {
            let socket = io('https://telestrations-csm117.herokuapp.com/');

            let timeLeft = 60;
            let timerInterval;

            let homepage = document.getElementById('homepage');
            let playerName = document.getElementById('playerName');
            let joinGame = document.getElementById('joinGame');

            let roomList = document.getElementById('roomList');
            let playerList = document.getElementById('playerList');
            let startGame = document.getElementById('startGame');

            let startPhrase = document.getElementById('startPhrase');
            let startPhraseTextbox = document.getElementById('startPhraseTextbox');
            let countdown = document.getElementById('countdown');
            let uploadStartText = document.getElementById('uploadStartText');

            let drawingRound = document.getElementById('drawingRound');
            let caption = document.getElementById('caption');
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            let uploadPicture = document.getElementById('uploadPicture');
            let clearCanvas = document.getElementById('clearCanvas');

            let writingRound = document.getElementById('writingRound');
            let textbox = document.getElementById('textbox');
            let uploadText = document.getElementById('uploadText');
            let staticCanvas = document.getElementById('staticCanvas');
            let staticContext = staticCanvas.getContext('2d');

            staticCanvas.width = window.innerWidth - 20;
            staticCanvas.height = window.innerHeight - 100;
            staticCanvas.style.border = '1px dashed #000';

            let submittedDiv = document.getElementById('submittedDiv');
            let endGame = document.getElementById('endGame');


            joinGame.onclick = (e) => {
                if (!playerName.value) {
                    return;
                }

                socket.emit('setName', playerName.value);
                homepage.style.display = 'none';
                roomList.style.display = '';
            };

            startGame.onclick = (e) => {
                socket.emit('startGame');
            };

            uploadStartText.onclick = (e) => {
                clearInterval(timerInterval);
                timeLeft = 60;

                socket.emit('uploadText', startPhraseTextbox.value);

                startPhrase.style.display = 'none';
                submittedDiv.style.display = '';
            };

            uploadPicture.onclick = (e) => {
                clearInterval(timerInterval);
                timeLeft = 60;

                let picture = canvas.toDataURL();
                socket.emit('uploadPicture', picture);

                context.clearRect(0, 0, canvas.width, canvas.height);

                drawingRound.style.display = 'none';
                submittedDiv.style.display = '';
            };

            clearCanvas.onclick = (e) => {
                context.clearRect(0, 0, canvas.width, canvas.height);
            };

            uploadText.onclick = (e) => {
                clearInterval(timerInterval);
                timeLeft = 60;

                socket.emit('uploadText', textbox.value);
                textbox.value = '';

                writingRound.style.display = 'none';
                submittedDiv.style.display = '';
            };

            socket.on('downloadText', (text) => {
                countdown.innerHTML = `Time Left: ${timeLeft} seconds`;
                drawingRound.insertBefore(countdown, canvas);
                
                timerInterval = setInterval(() => {
                    if (timeLeft == 0) {
                        uploadPicture.click();
                    }

                    countdown.innerHTML = `Time Left: ${timeLeft--} seconds`;
                }, 1000);

                caption.innerHTML = text;

                startPhrase.style.display = 'none';
                writingRound.style.display = 'none';
                submittedDiv.style.display = 'none';
                drawingRound.style.display = '';
            });

            socket.on('downloadPicture', (picture) => {
                countdown.innerHTML = `Time Left: ${timeLeft} seconds`;
                writingRound.insertBefore(countdown, staticCanvas);

                timerInterval = setInterval(() => {
                    if (timeLeft == 0) {
                        uploadText.click();
                    }

                    countdown.innerHTML = `Time Left: ${timeLeft--} seconds`;
                }, 1000);

                staticContext.clearRect(0, 0, canvas.width, canvas.height);
                let img = new Image;
                img.onload = function() {
                    staticContext.drawImage(img, 0, 0);
                };
                img.src = picture;

                drawingRound.style.display = 'none';
                submittedDiv.style.display = 'none';
                writingRound.style.display = '';
            });

            socket.on('getNames', (names) => {
              let nameList = '';

              for (id in names) {
                nameList += `<li>${names[id]}</li>`;
              }

              playerList.innerHTML = nameList;
            });

            socket.on('startGame', () => {
                roomList.style.display = 'none';
                startPhrase.style.display = '';

                countdown.innerHTML = `Time Left: ${timeLeft} seconds`;

                timerInterval = setInterval(() => {
                    if (timeLeft == 0) {
                        uploadStartText.click();
                    }

                    countdown.innerHTML = `Time Left: ${timeLeft--} seconds`;
                }, 1000);
            });

            socket.on('endGame', (names, rounds) => {
                clearInterval(timerInterval);
                drawingRound.style.display = 'none';
                writingRound.style.display = 'none';
                submittedDiv.style.display = 'none';
                endGame.style.display = '';

                console.log(names);
                console.log(rounds);

            });
        }
    }
};

app.initialize();
