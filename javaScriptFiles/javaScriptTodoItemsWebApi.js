import { IS_LOG_ENABLED } from '../javaScriptFiles/javaScriptSettings.js'
import { IS_DEBUG_MODE } from '../javaScriptFiles/javaScriptSettings.js'

let MAIN_URL;

if (IS_DEBUG_MODE)
{
    MAIN_URL = "https://localhost:7167";
}
else
{
    //MAIN_URL = "http://ltpe3.web.techcollege.dk";
    MAIN_URL = "https://todoitems.buchwaldshave34.dk";
}
let API_URL = MAIN_URL + "/api/todoitems"; // OPDATÉR MED DIN API URL
let SWAGGER_URL = MAIN_URL + "/swagger/index.html";
let LOGINFO_URL = MAIN_URL + "/api/loginfo";
let DATABASEINFO_URL = MAIN_URL + "/api/databaseinfo";

const ForklaringsTekst = "Åben link i et Browser Tab for at blive klogere på ServerSide info/opbygning !!!";
const UrlsToInfo = [
    ["Api", API_URL, ForklaringsTekst],
    ["Swagger", SWAGGER_URL, ForklaringsTekst],
    ["Log Info", LOGINFO_URL, ForklaringsTekst],
    ["Database Info", DATABASEINFO_URL, ForklaringsTekst],
];

const MIN_USERNAME_LENGTH = 3;

// Globale variabler
let USER_NAME = 'Default VSCode User';
let todoArray = [];
let currentPage = 1;
let pageSize = 5;
let UserNameControl;
let loadingdataSpinner;

// Klient-side klasse, der afspejler server-side klassen
class TodoItem {
    static todoCount = 0;

    constructor({ id, name, isComplete }) {
        this.id = id;
        this.name = name;
        this.isComplete = isComplete;
        TodoItem.todoCount++;
    }

    toString() {
        return `TodoItem: ID=${this.id}, Name="${this.name}", Complete=${this.isComplete}`;
    }
}

// Håndtering af Web API og data
// ---
// GET: Hent alle opgaver fra API'et
async function getItems() {
    loadingdataSpinner.style.display = "block";
    const params = new URLSearchParams({ userName: USER_NAME });
    const url = `${API_URL}?${params.toString()}`;

    if (IS_LOG_ENABLED)
    {
        console.log(url);
    }

    try {
        const response = await fetch(url, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Konverterer de hentede data til TodoItem objekter
        todoArray = data.map(item => new TodoItem(item));
        updateUI();
    } catch (error) {
        console.error("Fejl ved hentning af data:", error);
    }
    finally {
        loadingdataSpinner.style.display = "none";
    }
}

// POST: Tilføj en ny opgave
async function addItem(name) {
    const params = new URLSearchParams({ userName: USER_NAME });
    const url = `${API_URL}?${params.toString()}`;
    const newTodo = { name, isComplete: false };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // SignalR vil opdatere UI på alle klienter
    } catch (error) {
        console.error("Fejl ved tilføjelse af data:", error);
    }
}

// PUT: Opdater en eksisterende opgave
async function updateItem(id, name, isComplete) {
    const params = new URLSearchParams({ userName: USER_NAME });
    const url = `${API_URL}/${id}?${params.toString()}`;
    const updatedTodo = { id, name, isComplete };

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // SignalR vil opdatere UI på alle klienter
    } catch (error) {
        console.error("Fejl ved opdatering af data:", error);
    }
}

// DELETE: Slet en opgave
async function deleteItem(id) {
    const params = new URLSearchParams({ userName: USER_NAME });
    const url = `${API_URL}/${id}?${params.toString()}`;
    
    try {
        const response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // SignalR vil opdatere UI på alle klienter
    } catch (error) {
        console.error("Fejl ved sletning af data:", error);
    }
}

// Håndtering af brugergrænsefladen
// ---
function displayItems() {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = '';
    
    // Paging logik
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const itemsToShow = todoArray.slice(startIndex, endIndex);

    itemsToShow.forEach(item => {
        const row = tbody.insertRow();
        
        // Gennemført (checkbox)
        const completeCell = row.insertCell(0);
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.disabled = true;
        checkbox.checked = item.isComplete;
        completeCell.appendChild(checkbox);

        // Opgavenavn
        const nameCell = row.insertCell(1);
        nameCell.textContent = item.name;

        // Handlinger (ret/slet)
        const actionsCell = row.insertCell(2);
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Ret';
        editBtn.className = 'btn btn-warning btn-sm me-2';
        editBtn.onclick = () => {
            document.getElementById('edit-id').value = item.id;
            document.getElementById('edit-name').value = item.name;
            document.getElementById('edit-isComplete').checked = item.isComplete;
            document.getElementById('editForm').classList.remove('d-none');
            document.getElementById('addForm').classList.add('d-none');
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Slet';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.onclick = () => {
            deleteItem(item.id);
        };
        
        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
    });

    document.getElementById('total-count').textContent = todoArray.length;
}

function displayPagination() {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const pageCount = Math.ceil(todoArray.length / pageSize);

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const a = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = i;
        a.onclick = (e) => {
            e.preventDefault();
            currentPage = i;
            updateUI();
        };
        li.appendChild(a);
        pagination.appendChild(li);
    }
}

function updateUI() {
    displayItems();
    displayPagination();
}

function SaveUserNameInLocalStorage()
{
    if (UserNameControl.value.length >= MIN_USERNAME_LENGTH)
    {
        localStorage.setItem('userName', UserNameControl.value);
        USER_NAME = UserNameControl.value;
    }
    else
    {
        alert("User Name skal være på minimum " + MIN_USERNAME_LENGTH + " karakterer !!!");
        UserNameControl.value = USER_NAME;
    }
}

function GetUserNameFromLocalStorage()
{
    let userName = localStorage.getItem('userName');

    if (userName)
    {
        USER_NAME = userName;
    }

    return (USER_NAME);
}

export function init_javaScriptTodoItemsWebApi()
{
    // Event Listeners
    UserNameControl = document.getElementById('user-name');
    UserNameControl.value = GetUserNameFromLocalStorage();

    const tbody = document.getElementById('table-body-urls');
    tbody.innerHTML = '';
    for (let counter = 0; counter < UrlsToInfo.length; counter++)
    {
        const raekke = UrlsToInfo[counter];
        const row = tbody.insertRow();

        const UrlContentCell = row.insertCell(0);
        UrlContentCell.textContent = raekke[0];

        const UrlCell = row.insertCell(1);
        UrlCell.textContent = raekke[1];
        
        const ForklaringCell = row.insertCell(2);
        ForklaringCell.textContent = raekke[2];
    }
   
    loadingdataSpinner = document.getElementById('loadingDataSpinner');

    document.getElementById('addFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('add-name').value.trim();
        if (name) {
            addItem(name);
            document.getElementById('add-name').value = '';
        }
    });

    document.getElementById('editFormElement').addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-id').value;
        const name = document.getElementById('edit-name').value.trim();
        const isComplete = document.getElementById('edit-isComplete').checked;
        updateItem(id, name, isComplete);
        document.getElementById('editForm').classList.add('d-none');
        document.getElementById('addForm').classList.remove('d-none');
    });

    document.getElementById('cancel-btn').addEventListener('click', () => {
        document.getElementById('editForm').classList.add('d-none');
        document.getElementById('addForm').classList.remove('d-none');
    });

    document.getElementById('pageSize').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value, 10);
        if (pageSize < 1) pageSize = 1;
        currentPage = 1; // Nulstil til første side
        updateUI();
    });

    document.getElementById('btnUserName').addEventListener('click', SaveUserNameInLocalStorage)

    // SignalR-forbindelse
    // ---
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(MAIN_URL + "/TodoHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ReceiveMessage", function (user, message) {
        console.log("SignalR: " + user + " - " + message);
        //if (user !== USER_NAME) { // Forhindrer opdatering på egen klient efter lokal ændring
            getItems();
        //}
    });

    connection.start().then(function () {
        console.log("SignalR-forbindelse oprettet.");
    }).catch(function (err) {
        return console.error(err.toString());
    });

    // Initialiser applikationen ved opstart
    getItems();
}