// Al final de ravyRespond después de definir response y mood
let bubbleColor = "#81C784"; // default verde suave

switch(state.mood){
  case "calm":
    bubbleColor = "#81C784"; // verde suave
    break;
  case "happy":
    bubbleColor = "#66FF66"; // verde brillante
    break;
  case "tense":
    bubbleColor = "#FFCC33"; // amarillo/naranja
    break;
}

// Pasamos esto al callback
replyCallback({ text: response, color: bubbleColor });
