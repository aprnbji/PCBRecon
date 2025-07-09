let currentProjectId = null;

async function loadProjects() {
  try {
    const response = await fetch('/projects');
    if (!response.ok) throw new Error('Failed to fetch projects');
    const projects = await response.json();
    renderProjects(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

/**
 * @param {string} name 
 * @param {string} imagePath 
 * @param {string} imageBase64 
 */
async function createProject(name, imagePath, imageBase64) {
  const response = await fetch('/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, image_path: imagePath, image_base64: imageBase64 }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create project');
  }
  return response.json();
}

/**
 * @param {number} projectId 
 */
async function getProjectDetails(projectId) {
  const response = await fetch(`/projects/${projectId}`);
  if (!response.ok) throw new Error('Failed to fetch project details');
  return response.json();
}

/**
 * @param {number} projectId 
 * @param {string} message 
 */
async function postChatMessage(projectId, message) {
  const response = await fetch(`/projects/${projectId}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
}

/**
 * @param {Event} event 
 * @param {number} projectId 
 */
async function deleteProject(event, projectId) {
  event.stopPropagation(); 
  if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
    return;
  }
  try {
    const response = await fetch(`/projects/${projectId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete project');
    loadProjects(); 
  } catch (error) {
    console.error('Error deleting project:', error);
    alert('Error deleting project.');
  }
}


/**
 * @param {Array} projects 
 */
function renderProjects(projects) {
  const grid = document.getElementById('deviceGrid');
  grid.innerHTML = '';

  if (projects.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        <p class="text-gray-400 text-lg">No devices uploaded yet</p>
        <p class="text-gray-500">Upload your first PCB to get started</p>
      </div>`;
    return;
  }

  projects.forEach(proj => {
    const card = document.createElement('div');
    card.className = 'glass-effect rounded-xl p-6 cursor-pointer transition-all duration-300 card-hover relative';
    card.onclick = () => openProjectDialog(proj.id);
    card.innerHTML = `
      <div class="absolute top-3 right-3 z-10">
          <button onclick="deleteProject(event, ${proj.id})" class="w-8 h-8 bg-red-500/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors" title="Delete Project">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
      </div>
      <div class="relative mb-4">
        <img src="${proj.image_base64}" alt="${proj.name}" class="w-full h-48 object-cover rounded-lg bg-gray-900" />
      </div>
      <div>
        <h4 class="font-bold text-xl text-white mb-2 truncate">${proj.name}</h4>
        <p class="text-gray-400 mb-4">Advanced PCB analysis and component identification.</p>
        <div class="flex items-center text-orange-400 font-medium">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          View Analysis
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

/**
 * @param {object} message 
 * @param {HTMLElement} chatBox 
 */
function renderChatMessage(message, chatBox) {
    const msgDiv = document.createElement('div');
    const isUser = message.sender === 'user';
    msgDiv.className = isUser ? 'bg-orange-600 text-white p-3 rounded-lg ml-8' : 'bg-gray-800 text-gray-100 p-3 rounded-lg mr-8';
    
    const icon = isUser 
        ? `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`
        : `<svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`;
    
    const senderName = isUser ? 'You' : 'AI Assistant';
    const messageContent = isUser ? message.message : marked.parse(message.message);

    msgDiv.innerHTML = `
        <div class="flex items-start space-x-2">
            <div class="flex-shrink-0">${icon}</div>
            <div class="flex-1">
                <div class="font-medium text-sm mb-1">${senderName}</div>
                <div>${messageContent}</div>
            </div>
        </div>
    `;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function openProjectDialog(projectId) {
  try {
    const project = await getProjectDetails(projectId);
    currentProjectId = projectId; 

    document.getElementById('dialogTitle').innerText = project.name;
    document.getElementById('dialogImage').src = project.image_base64;
    document.getElementById('dialogDescription').innerHTML = marked.parse(project.analysis || "No analysis available.");

    const chatBox = document.getElementById('dialogChatBox');
    chatBox.innerHTML = '';
    project.chat_messages.forEach(msg => renderChatMessage(msg, chatBox));

    document.getElementById('deviceDialog').classList.remove('hidden');
  } catch (error) {
    console.error(`Error opening dialog for project ${projectId}:`, error);
    alert('Could not load project details.');
  }
}

function closeDeviceDialog() {
  document.getElementById('deviceDialog').classList.add('hidden');
  currentProjectId = null; 
}

function closeUploadModal() {
  document.getElementById('uploadModal').classList.add('hidden');
  document.getElementById('uploadForm').reset();
}

function openUploadModal() {
  document.getElementById('uploadModal').classList.remove('hidden');
}


async function handleUpload(event) {
  event.preventDefault();
  const name = document.getElementById('projectName').value;
  const imageFile = document.getElementById('projectImage').files[0];
  if (!name || !imageFile) return alert('Please provide a project name and an image file.');

  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<svg class="w-5 h-5 inline-block mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Analyzing...`;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const imageBase64 = e.target.result;
      await createProject(name, imageFile.name, imageBase64);
      loadProjects(); 
      closeUploadModal();
    } catch (error) {
      console.error('Error creating project:', error);
      alert(`Error: ${error.message}`);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }
  };
  reader.readAsDataURL(imageFile);
}


async function sendDialogMessage() {
  const input = document.getElementById('dialogChatInput');
  const message = input.value.trim();
  if (!message || !currentProjectId) return;

  const chatBox = document.getElementById('dialogChatBox');
  renderChatMessage({ sender: 'user', message: message }, chatBox);
  const userMessage = input.value; 
  input.value = '';

  try {
    const botResponse = await postChatMessage(currentProjectId, userMessage);
    renderChatMessage(botResponse, chatBox);
  } catch (error) {
    console.error('Error sending message:', error);
    
    renderChatMessage({ sender: 'bot', message: 'Sorry, I encountered an error and could not get a response.' }, chatBox);
  }
}


document.addEventListener('DOMContentLoaded', () => {
  loadProjects();

  document.getElementById('uploadForm').addEventListener('submit', handleUpload);
  document.getElementById('send-message-btn').addEventListener('click', sendDialogMessage);
  document.getElementById('dialogChatInput').addEventListener('keypress', (e) => {

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      sendDialogMessage();
    }
  });
});
