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
            let textbox = document.getElementById('textbox');
            let countdown = document.getElementById('countdown');
            let uploadText = document.getElementById('uploadText');

            let drawingRound = document.getElementById('drawingRound');
            let caption = document.getElementById('caption');
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            let uploadPicture = document.getElementById('uploadPicture');
            let clearCanvas = document.getElementById('clearCanvas');


            joinGame.onclick = (e) => {
                socket.emit('setName', playerName.value);
                homepage.style.display = 'none';
                roomList.style.display = '';
            };

            startGame.onclick = (e) => {
                socket.emit('startGame');
            };

            uploadText.onclick = (e) => {
                clearInterval(timerInterval);
                timeLeft = 60;
                socket.emit('uploadText', textbox.value);
                startPhrase.innerHTML = '<p>Submitted! Waiting for other players...</p>';
            };

            uploadPicture.onclick = (e) => {
                let picture = canvas.toDataURL();
                socket.emit('uploadPicture', picture);
                drawingRound.innerHTML = '<p>Submitted! Waiting for other players...</p>';
            };

            clearCanvas.onclick = (e) => {
                context.clearRect(0, 0, canvas.width, canvas.height);
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
                drawingRound.style.display = '';
            });

            socket.on('downloadPicture', (picture) => {
                console.log(picture);
                /*context.clearRect(0, 0, canvas.width, canvas.height);
                
                var img = new Image;
                img.onload = function() {
                    context.drawImage(img, 0, 0);
                };
                img.src = picture;*/
            });

            socket.on('startGame', () => {
                roomList.style.display = 'none';
                startPhrase.style.display = '';

                countdown.innerHTML = `Time Left: ${timeLeft} seconds`;

                timerInterval = setInterval(() => {
                    if (timeLeft == 0) {
                        uploadText.click();
                    }

                    countdown.innerHTML = `Time Left: ${timeLeft--} seconds`;
                }, 1000);
            });

            socket.on('getNames', (names) => {
              let nameList = '';

              for (id in names) {
                nameList += `<li>${names[id]}</li>`;
              }

              playerList.innerHTML = nameList;
            });
        }
    }
};

app.initialize();
