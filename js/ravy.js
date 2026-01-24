// Modificado addMessage para aceptar color opcional
function addMessage(content, sender = "user", bubbleColor = null) {
  const div = document.createElement("div");
  div.className = sender;
  div.textContent = typeof content === "object" ? content.text : content;

  // Si es mensaje de RAVY con color personalizado
  if(sender === "ravy" && typeof content === "object" && content.color){
    div.style.backgroundColor = content.color;
  } else if(bubbleColor){
    div.style.backgroundColor = bubbleColor;
  }

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if(!text) return;

  addMessage(text, "user");
  ravyRespond(text, res => addMessage(res, "ravy"));
  input.value = "";
});

input.addEventListener("keypress", e => {
  if(e.key === "Enter") sendBtn.click();
});
