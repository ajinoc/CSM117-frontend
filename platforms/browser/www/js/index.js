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
            let endGameHTML = endGame.innerHTML;


            joinGame.onclick = (e) => {
                if (!playerName.value) {
                    return;
                }

                socket.emit('setName', playerName.value);
                playerName.value = '';

                homepage.style.display = 'none';
                roomList.style.display = '';
            };

            startGame.onclick = (e) => {
                socket.emit('startGame');
            };

            uploadStartText.onclick = (e) => {
                clearInterval(timerInterval);
                timeLeft = 60;

                if(startPhraseTextbox.value == '') {
                    console.log("User gave empty text");
                    startPhraseTextbox.value = '(Empty)';
                } else {
                    startPhraseTextbox.value = '"' + startPhraseTextbox.value + '"';
                }

                socket.emit('uploadText', startPhraseTextbox.value);
                startPhraseTextbox.value = '';

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
                console.log(timeLeft);
                countdown.innerHTML = `Time Left: ${timeLeft} seconds`;

                timerInterval = setInterval(() => {
                    if (timeLeft == 0) {
                        uploadStartText.click();
                    }

                    countdown.innerHTML = `Time Left: ${timeLeft--} seconds`;
                }, 1000);
                timeLeft = 60;
            });

            socket.on('endGame', (ids, names, rounds) => {
                clearInterval(timerInterval);
                drawingRound.style.display = 'none';
                writingRound.style.display = 'none';
                submittedDiv.style.display = 'none';
                endGame.style.display = '';

                document.getElementById('body').style = '';

                let position = ids.findIndex((e) => e == socket.id);

                let innerHTML = '';
                innerHTML += `<h2>${names[socket.id]}'s Results</h2>`;

                let innerCarouselIndicators = '';
                let innerCarousel = '';
                for (let i = 0; i < ids.length; i++) {
                    let nextPlayerIndex = (position + i) % ids.length;
                    let nextPlayerId = ids[nextPlayerIndex];
                    let nextPlayerName = names[nextPlayerId];

                    innerHTML += '<div>';
                    innerHTML += `<h3><em>Round ${i+1}</em></h3>`;

                    /*
                    // Add inner HTML for indicators
                    if( i == 0 ) {
                        innerCarouselIndicators += `<li data-target="#myCarousel" data-slide-to="${i}" class="active"></li>`;
                    } else {
                        innerCarouselIndicators += `<li data-target="#myCarousel" data-slide-to="${i}"></li>`;
                    }


                    // Add inner HTML for slide wrappers 

                    <div class="carousel-inner">
                        <div class="item active">
                            <img src="la.jpg" alt="Los Angeles">
                        </div>

                        <div class="item">
                            <img src="chicago.jpg" alt="Chicago">
                        </div>

                        <div class="item">
                            <img src="ny.jpg" alt="New York">
                        </div>
                    </div>
                    */
                    if (i % 2 == 0) {
                        // Round is text phrase
                        innerHTML += `<p>${nextPlayerName} wrote: ${rounds[i][nextPlayerId]}</p>`;
                        /*innerCarousel += `<div class="item active"> \
                                              <p>${nextPlayerName} wrote: ${rounds[i][nextPlayerId]}</p> \
                                          </div>`;*/
                    } else {
                        // Round is picture drawing
                        innerHTML += `<p>${nextPlayerName} drew: </p>`;
                        innerHTML += `<img width="${window.innerWidth - 20}" \
                                           height="${window.innerHeight - 200}" \
                                           style="border: 1px dashed #000; background: #efede6" \
                                           src="${rounds[i][nextPlayerId]}">`;

                    }

                    innerHTML += '</div>';
                }

                // document.getElementById('carousel-indicators').innerHTML = innerCarouselIndicators;
                endGame.innerHTML = innerHTML + endGameHTML;

                let restartGame = document.getElementById('restartGame');

                // Restart Game
                restartGame.onclick = (e) => {
                    socket.emit('restartGame');
                };
                
            });

            socket.on('restartGame', () => {
                endGame.innerHTML = endGameHTML;
                endGame.style.display = 'none';
                homepage.style.display = '';
            });
        }
    }
};

app.initialize();
