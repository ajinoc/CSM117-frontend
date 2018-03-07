let app = {
    socket: null,
    timeLeft: 60,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {
        if (id === 'deviceready') {
            this.socket = io('https://telestrations-csm117.herokuapp.com/');

            let uploadText = document.getElementById('uploadText');
            let textbox = document.getElementById('textbox');

            let uploadPicture = document.getElementById('uploadPicture');
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');

            let clearCanvas = document.getElementById('clearCanvas');

            let timerInterval = setInterval(() => {
                if (this.timeLeft == 0) {
                    uploadText.click();
                }

                document.getElementById('timeLeft').innerHTML = `Time Left: ${this.timeLeft--} seconds`;
            }, 1000);

            uploadText.onclick = (e) => {
                clearInterval(timerInterval);
                this.timeLeft = 60;

                let text = textbox.value;
                this.socket.emit('uploadText', text);

                document.getElementById('startSentence').innerHTML = '<p>Submitted! Waiting for other players...</p>';
            };

            uploadPicture.onclick = (e) => {
                let picture = canvas.toDataURL();
                this.socket.emit('uploadPicture', picture);
            };

            clearCanvas.onclick = (e) => {
                context.clearRect(0, 0, canvas.width, canvas.height);
            };

            this.socket.on('downloadText', (text) => {
                alert(text);
            });

            this.socket.on('downloadPicture', (picture) => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                
                var img = new Image;
                img.onload = function() {
                    context.drawImage(img, 0, 0);
                };
                img.src = picture;
            });
        }
    }
};

app.initialize();
