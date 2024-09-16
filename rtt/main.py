import av.option
from flask import Flask,request,jsonify
from flask_socketio import emit,SocketIO
import io
from flask_cors import CORS
import av

import soundfile as sf


app=Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins="*")


@socketio.on('audio')
def handle_audio(data):
#    audio_stream = io.BytesIO(data.data)
    for key in data:
        audio_stream = io.BytesIO(data[key])
        print(audio_stream.read())
        num_canali = 1         # 1 per mono, 2 per stereo
        frequenza_campionamento = 44100  # 44.1 kHz
        bit_per_sample = 16  
        emit('transcript', {'transcript': 'Testo trascritto in tempo reale'})
            
        #file_wav.setnchannels(num_canali)               
        #file_wav.setsampwidth(bit_per_sample // 8)   
        #file_wav.setframerate(frequenza_campionamento)  
        # Scrivere i dati audio nel file
        #file_wav.writeframes(audio_stream)
        
if __name__ == '__main__':
    socketio.run(app,port=5001,allow_unsafe_werkzeug=True,debug=True)
