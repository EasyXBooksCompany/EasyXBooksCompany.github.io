
// var rec;
// let blob;

record.disabled = false;
stoprecord.disabled = true;
exportFile.disabled = true;

navigator.mediaDevices.getUserMedia({audio:true});

// navigator.mediaDevices.getUserMedia({audio:true})
//     .then(stream => {handlerFunction(stream)});
// function handlerFunction(stream) {
//     rec = new MediaRecorder(stream);
//     rec.ondataavailable = e => {
//         audioChunks.push(e.data);
//         if (rec.state === "inactive"){
//             blob = new Blob(audioChunks,{type:'audio/mpeg'});
//             recordedAudio.src = URL.createObjectURL(blob);
//             recordedAudio.controls= true;
//             recordedAudio.autoplay= false;
//         }
//     }
// }
// Speech to text and Record
let scriptSS = '';
const r = document.getElementById('result');
const speechRecognizer = new webkitSpeechRecognition();

function startRecord() {
    // var audioChunks = [];
    document.getElementById('my_timer').innerHTML = '00'+':'+'00'+':'+'00';
    active = true;
    start_timer();
    // rec.start();
    //
    record.disabled = true;
    stoprecord.disabled = false;

    r.innerHTML = '';
    if ('webkitSpeechRecognition' in window){
        speechRecognizer.continuous = true;
        speechRecognizer.interimResults = true;
        speechRecognizer.lang = 'ja-JP';
        speechRecognizer.start();

        let finalTranscripts = '';
        speechRecognizer.onresult = function (event) {
            var interimTranscripts = '';
            for(var i = event.resultIndex; i < event.results.length; i++){
                var transcript = event.results[i][0].transcript;
                transcript.replace("\n","<br>");
                if(event.results[i].isFinal){
                    finalTranscripts += transcript;
                    scriptSS = finalTranscripts;
                }
                else {
                    interimTranscripts += transcript;
                }
            }
            r.innerHTML = finalTranscripts + '<span style="color: #999">'+interimTranscripts+'</span>'
        };
        speechRecognizer.onerror = function (event) {

        }
    }
    else {
        r.innerHTML = 'Your window is not support'
    }
}
function stopRecord() {
    // rec.stop();
    speechRecognizer.stop();
    active = false;
    // exportDoc();
    record.disabled = false;
    stoprecord.disabled = true;
    exportFile.disabled = false;
}
function exportDoc() {
    var headerDoc = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' "+
        "xmlns='http://www.w3.org/TR/REC-html40'> " +
        "<head><meta charset='utf-8'><title>"+ "conversation"+"</title></head><body>";
    var bodyDoc = "<h2 style='text-align: center;'>"+"Conversation"+"</h2>" +
        "<p>"+scriptSS+"</p>";
    var footerDoc = "</body></html>";
    var sourceHTML = headerDoc + bodyDoc + footerDoc;
    var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    var fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = "Conversation.doc";
    fileDownload.click();
    document.body.removeChild(fileDownload);
}

var active = false;
function start_timer(){
    if(active){
        setTimeout(start_timer,1000);
        const timer = document.getElementById('my_timer').innerHTML;
        const arr = timer.split(":");
        var hour = arr[0];
        var min = arr[1];
        var sec = arr[2];

        if (sec == 59) {
            if (min == 59) {
                hour++;
                min = 0;
                if (hour<10) hour = "0" + hour;
            }else{
                min++;
            }
            if (min <10) min = "0" + min;
            sec = 0;
        }else{
            sec++;
            if (sec < 10) sec = "0" + sec;
        }

        document.getElementById('my_timer').innerHTML = hour + ":" + min + ":" + sec;

    }
}







