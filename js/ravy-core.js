let waitingForCity = false;

if (["clima", "tiempo", "llueve", "calor", "frio"].some(w => lowerText.includes(w))) {
  waitingForCity = true;
  replyCallback({
    text: "¿En qué ciudad estás? 🌍",
    color: bubbleColor
  });
  return;
}

if (waitingForCity) {
  waitingForCity = false;
  getWeather(text).then(result => {
    replyCallback({
      text: result,
      color: bubbleColor
    });
  });
  return;
}
