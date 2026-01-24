function addMessage(content, sender="user") {
  const div = document.createElement("div");
  div.className = sender;

  if(sender === "ravy" && content.color){
    div.style.backgroundColor = content.color;
    div.textContent = content.text;
  } else {
    div.textContent = content;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}
