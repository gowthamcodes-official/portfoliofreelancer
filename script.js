async function sendMessage(userMessage) {
  try {

    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    const data = await response.json();

    addMessage(data.reply, "bot");

  } catch (error) {

    console.error(error);

    addMessage("AI connection error", "bot");
  }
}

function handleSend() {

  const input = document.getElementById("chat-input");

  const message = input.value.trim();

  if (!message) return;

  addMessage(message, "user");

  sendMessage(message);

  input.value = "";
}