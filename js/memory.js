export let memory = [];

export function saveMessage(msg) {
  memory.push(msg);
  if(memory.length > 50) memory.shift();
}

export function getMemory() {
  return memory;
}
