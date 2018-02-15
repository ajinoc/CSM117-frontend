let app = {
    socket: null,

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
            let textinputdiv = document.getElementById('textinputdiv');

            uploadText.onclick = (e) => {
                let text = textbox.value;
                this.socket.emit('uploadText', text);
            };

            this.socket.on('downloadText', (text) => {
                alert(text);
            });
        }
    }
};

app.initialize();
