let projects = [];

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyCri7yRXQOgRBdhb24i0zIL6Qelp7QODHA'; 
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
}

// Analyze PCB image with Gemini
async function analyzePCBImage(imageBase64, projectName) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `Analyze this PCB image for "${projectName}". Provide a concise technical summary in markdown format with these key points:

 Board Overview
- Type: [board type and complexity]
- Primary Function: [main purpose]
- Estimated Layers: [layer count]

Key Components
- Main IC: [primary processor/controller]
- Interfaces: [connectors and communication protocols]
- Power: [voltage levels and power management]

Notable Features
- [2-3 key design features or observations]

Keep the analysis brief, technical, and focused on the most important aspects visible in the image.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.4
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error analyzing PCB:', error);
    return `Error analyzing PCB: ${error.message}. Please check your API key and try again.`;
  }
}

// Chat with Gemini about the PCB
async function chatWithGemini(message, projectName, imageBase64) {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `You are an expert PCB (Printed Circuit Board) analyst. You have already analyzed the PCB image for the project "${projectName}". 

User question: ${message}

Please provide a helpful, technical response about this PCB. Be specific and reference what you can see in the image when relevant.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error chatting with Gemini:', error);
    return `Error: ${error.message}. Please check your API key and internet connection.`;
  }
}

function openUploadModal() {
  document.getElementById('uploadModal').classList.remove('hidden');
}

function closeUploadModal() {
  document.getElementById('uploadModal').classList.add('hidden');
  document.getElementById('uploadForm').reset();
}

function closeDeviceDialog() {
  document.getElementById('deviceDialog').classList.add('hidden');
}

document.getElementById('uploadForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('projectName').value;
  const image = document.getElementById('projectImage').files[0];
  if (!image) return;

  // Show loading state
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = `
    <svg class="w-5 h-5 inline-block mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
    </svg>
    Analyzing...
  `;
  submitBtn.disabled = true;

  try {
    // Convert image to base64 for display and API
    const imageBase64 = await fileToBase64(image);
    const reader = new FileReader();
    
    reader.onload = async function () {
      const imgSrc = reader.result;
      
      // Analyze the PCB with Gemini
      const analysis = await analyzePCBImage(imageBase64, name);
      
      // Parse the analysis into bullet points
      const descriptionLines = analysis.split('\n')
        .filter(line => line.trim())
        .slice(0, 8) // Limit to first 8 lines for the description
        .map(line => line.replace(/^\d+\.\s*/, '').replace(/^\*\s*/, '').trim());

      const project = {
        name,
        imgSrc,
        imageBase64,
        description: descriptionLines,
        fullAnalysis: analysis,
        chatHistory: [{
          sender: 'bot',
          text: `Hello! I've completed my analysis of your ${name} PCB. I can see the components and layout clearly. Feel free to ask me anything about the design, components, functionality, or potential improvements!`
        }]
      };

      projects.push(project);
      renderProjects();
      closeUploadModal();
    };
    
    reader.readAsDataURL(image);
    
  } catch (error) {
    console.error('Error processing image:', error);
    alert('Error processing image. Please try again.');
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

function renderProjects() {
  const grid = document.getElementById('deviceGrid');
  // Clear all existing content first
  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }
  
  if (projects.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'col-span-full text-center py-12';
    emptyState.innerHTML = `
      <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
      </svg>
      <p class="text-gray-400 text-lg">No devices uploaded yet</p>
      <p class="text-gray-500">Upload your first PCB to get started</p>
    `;
    grid.appendChild(emptyState);
    return;
  }
  
  projects.forEach((proj, index) => {
    const card = document.createElement('div');
    card.className = 'glass-effect rounded-xl p-6 cursor-pointer transition-all duration-300 card-hover';
    card.innerHTML = `
      <div class="relative mb-4">
        <img src="${proj.imgSrc}" alt="PCB" class="w-full h-48 object-cover rounded-lg bg-gray-900" />
        <div class="absolute top-2 right-2 orange-gradient text-white px-2 py-1 rounded-full text-xs font-medium">
          PCB
        </div>
      </div>
      <div>
        <h4 class="font-bold text-xl text-white mb-2">${proj.name}</h4>
        <p class="text-gray-400 mb-4">Advanced PCB analysis and component identification</p>
        <div class="flex items-center text-orange-400 font-medium">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
          View Analysis
        </div>
      </div>
    `;
    card.onclick = () => openProjectDialog(index);
    grid.appendChild(card);
  });
}

function openProjectDialog(index) {
  const proj = projects[index];
  document.getElementById('dialogTitle').innerText = proj.name;
  document.getElementById('dialogImage').src = proj.imgSrc;
  
  const desc = document.getElementById('dialogDescription');
  desc.innerHTML = marked.parse(proj.fullAnalysis);

  const chatBox = document.getElementById('dialogChatBox');
  chatBox.innerHTML = '';
  proj.chatHistory.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.className = msg.sender === 'user' 
      ? 'bg-orange-600 text-white p-3 rounded-lg ml-8' 
      : 'bg-gray-800 text-gray-100 p-3 rounded-lg mr-8';
    msgDiv.innerHTML = `
      <div class="flex items-start space-x-2">
        <div class="flex-shrink-0">
          ${msg.sender === 'user' 
            ? '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
            : '<svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>'
          }
        </div>
        <div class="flex-1">
          <div class="font-medium text-sm mb-1">${msg.sender === 'user' ? 'You' : 'AI Assistant'}</div>
          <div>${msg.sender === 'bot' ? marked.parse(msg.text) : msg.text}</div>
        </div>
      </div>
    `;
    chatBox.appendChild(msgDiv);
  });
  chatBox.scrollTop = chatBox.scrollHeight;

  document.getElementById('dialogChatInput').dataset.index = index;
  document.getElementById('deviceDialog').classList.remove('hidden');
}

function sendDialogMessage() {
  const input = document.getElementById('dialogChatInput');
  const question = input.value.trim();
  if (!question) return;
  
  const index = input.dataset.index;
  const project = projects[index];
  const chatBox = document.getElementById('dialogChatBox');

  const userMsg = { sender: 'user', text: question };
  project.chatHistory.push(userMsg);
  
  const userDiv = document.createElement('div');
  userDiv.className = 'bg-orange-600 text-white p-3 rounded-lg ml-8';
  userDiv.innerHTML = `
    <div class="flex items-start space-x-2">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <div class="flex-1">
        <div class="font-medium text-sm mb-1">You</div>
        <div>${question}</div>
      </div>
    </div>
  `;
  chatBox.appendChild(userDiv);

  // Show loading message
  const botMsg = { sender: 'bot', text: 'Analyzing your question...' };
  project.chatHistory.push(botMsg);
  
  const botDiv = document.createElement('div');
  botDiv.className = 'bg-gray-800 text-gray-100 p-3 rounded-lg mr-8';
  botDiv.innerHTML = `
    <div class="flex items-start space-x-2">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 text-orange-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
        </svg>
      </div>
      <div class="flex-1">
        <div class="font-medium text-sm mb-1">Gemini AI</div>
        <div>Analyzing your question...</div>
      </div>
    </div>
  `;
  chatBox.appendChild(botDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = '';

  // Get response from Gemini
  chatWithGemini(question, project.name, project.imageBase64)
    .then(response => {
      botMsg.text = response;
      botDiv.innerHTML = `
        <div class="flex items-start space-x-2">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-medium text-sm mb-1">Gemini AI</div>
            <div>${marked.parse(response)}</div>
          </div>
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
    })
    .catch(error => {
      console.error('Chat error:', error);
      botMsg.text = 'Sorry, I encountered an error. Please try again.';
      botDiv.innerHTML = `
        <div class="flex items-start space-x-2">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <div class="font-medium text-sm mb-1">Gemini AI</div>
            <div>Sorry, I encountered an error. Please try again.</div>
          </div>
        </div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Handle enter key in chat input
document.getElementById('dialogChatInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    sendDialogMessage();
  }
});

// Initialize empty state
renderProjects();