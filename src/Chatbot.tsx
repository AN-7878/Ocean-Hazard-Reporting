import React, { useState } from 'react';

const defaultResponses = [
  { q: 'What is a cyclone?', a: 'A cyclone is a large scale air mass that rotates around a strong center of low atmospheric pressure.' },
  { q: 'Where are the nearest shelters?', a: 'You can view nearby shelters in the Shelters tab.' },
  { q: 'How do I report a hazard?', a: 'Go to the Report tab and fill out the hazard report form.' },
  { q: 'Who are the verified officials?', a: 'Verified officials are listed in your Profile section under emergency contacts.' },
];

function getBotResponse(userMessage: string) {
  const found = defaultResponses.find(r =>
    userMessage.toLowerCase().includes(r.q.toLowerCase())
  );
  return found ? found.a : "Sorry, I don't have an answer for that. Please contact an official for urgent queries.";
}

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! How can I help you with ocean hazards or safety today?' }
  ]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(true);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    const botMsg = { sender: 'bot', text: getBotResponse(input) };
    setMessages([...messages, userMsg, botMsg]);
    setInput('');
  };

  if (!open) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
        onClick={() => setOpen(true)}
      >
        Open Chatbot
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 z-50 w-80">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-blue-700">OceanGuard Chatbot</span>
        <button
          className="text-gray-500 hover:text-red-500 text-lg font-bold"
          onClick={() => setOpen(false)}
          title="Close"
        >
          ×
        </button>
      </div>
      <div className="h-56 overflow-y-auto mb-2 border rounded p-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 text-sm ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-2 py-1 rounded ${msg.sender === 'user' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none"
          placeholder="Ask a question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;