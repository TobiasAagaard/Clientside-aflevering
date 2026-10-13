import { IS_LOG_ENABLED, IS_DEBUG_MODE } from '../javaScriptFiles/javaScriptSettings.js';
import * as signalR from '@microsoft/signalr';
//import '../javaScriptFiles/Shared.js';

let MAIN_URL: string;

if (IS_DEBUG_MODE) {
    MAIN_URL = "https://localhost:7167";
} else {
    //MAIN_URL = "http://ltpe3.web.techcollege.dk";
     MAIN_URL = "https://todoitems.buchwaldshave34.dk";
}

const API_URL: string = `${MAIN_URL}/api/todoitems`;
const SWAGGER_URL: string = `${MAIN_URL}/swagger/index.html`;
const LOGINFO_URL: string = `${MAIN_URL}/api/loginfo`;
const DATABASEINFO_URL: string = `${MAIN_URL}/api/databaseinfo`;

const ForklaringsTekst: string = "Åben link i et Browser Tab for at blive klogere på ServerSide info/opbygning !!!";
const UrlsToInfo: [string, string, string][] = [
    ["Api", API_URL, ForklaringsTekst],
    ["Swagger", SWAGGER_URL, ForklaringsTekst],
    ["Log Info", LOGINFO_URL, ForklaringsTekst],
    ["Database Info", DATABASEINFO_URL, ForklaringsTekst],
];

const MIN_USERNAME_LENGTH: number = 3;

// Globale variabler
let USER_NAME: string = 'Default VSCode User';
let todoArray: TodoItem[] = [];
let currentPage: number = 1;
let pageSize: number = 5;
let UserNameControl: HTMLInputElement;
let loadingdataSpinner: HTMLElement;
let pageSizeElement: HTMLInputElement;

// Interface til at definere strukturen af TodoItem
interface ITodoItem {
    id: number;
    name: string;
    isComplete: boolean;
}

// Klient-side klasse, der afspejler server-side klassen
class TodoItem implements ITodoItem {
    static todoCount: number = 0;
    id: number;
    name: string;
    isComplete: boolean;

    constructor({ id, name, isComplete }: ITodoItem) {
        this.id = id;
        this.name = name;
        this.isComplete = isComplete;
        TodoItem.todoCount++;
    }

    toString(): string {
        return `TodoItem: ID=${this.id}, Name="${this.name}", Complete=${this.isComplete}`;
    }
}

// Håndtering af Web API og data
async function getItems(): Promise<void> {
    if (loadingdataSpinner) {
        loadingdataSpinner.style.display = "block";
    }

    const params = new URLSearchParams({ userName: USER_NAME });
    const url: string = `${API_URL}?${params.toString()}`;

    if (IS_LOG_ENABLED) {
        console.log(url);
    }

    try {
        const response: Response = await fetch(url, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ITodoItem[] = await response.json();

        todoArray = data.map(item => new TodoItem(item));
        updateUI();
    } catch (error) {
        console.error("Fejl ved hentning af data:", error);
    } finally {
        if (loadingdataSpinner) {
            loadingdataSpinner.style.display = "none";
        }
    }
}

async function addItem(name: string): Promise<void> {
    const params = new URLSearchParams({ userName: USER_NAME });
    const url: string = `${API_URL}?${params.toString()}`;
    const newTodo: { name: string, isComplete: boolean } = { name, isComplete: false };

    try {
        const response: Response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTodo)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Fejl ved tilføjelse af data:", error);
    }
}

async function updateItem(id: number, name: string, isComplete: boolean): Promise<void> {
    const params = new URLSearchParams({ userName: USER_NAME });
    const url: string = `${API_URL}/${id}?${params.toString()}`;
    const updatedTodo: ITodoItem = { id, name, isComplete };

    try {
        const response: Response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTodo)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Fejl ved opdatering af data:", error);
    }
}

async function deleteItem(id: number): Promise<void> {
    const params = new URLSearchParams({ userName: USER_NAME });
    const url: string = `${API_URL}/${id}?${params.toString()}`;

    try {
        const response: Response = await fetch(url, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Fejl ved sletning af data:", error);
    }
}

// Håndtering af brugergrænsefladen
function displayItems(): void {
    const tbody: HTMLTableSectionElement = document.getElementById('table-body') as HTMLTableSectionElement;
    tbody.innerHTML = '';

    const startIndex: number = (currentPage - 1) * pageSize;
    const endIndex: number = startIndex + pageSize;
    const itemsToShow: TodoItem[] = todoArray.slice(startIndex, endIndex);

    itemsToShow.forEach((item: TodoItem) => {
        const row: HTMLTableRowElement = tbody.insertRow();

        const completeCell: HTMLTableDataCellElement = row.insertCell(0);
        const checkbox: HTMLInputElement = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.disabled = true;
        checkbox.checked = item.isComplete;
        completeCell.appendChild(checkbox);

        const nameCell: HTMLTableDataCellElement = row.insertCell(1);
        nameCell.textContent = item.name;

        const actionsCell: HTMLTableDataCellElement = row.insertCell(2);
        const editBtn: HTMLButtonElement = document.createElement('button');
        editBtn.textContent = 'Ret';
        editBtn.className = 'btn btn-warning btn-sm me-2';
        editBtn.onclick = () => {
            (document.getElementById('edit-id') as HTMLInputElement).value = item.id.toString();
            (document.getElementById('edit-name') as HTMLInputElement).value = item.name;
            (document.getElementById('edit-isComplete') as HTMLInputElement).checked = item.isComplete;
            (document.getElementById('editForm') as HTMLElement).classList.remove('d-none');
            (document.getElementById('addForm') as HTMLElement).classList.add('d-none');
        };

        const deleteBtn: HTMLButtonElement = document.createElement('button');
        deleteBtn.textContent = 'Slet';
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.onclick = async () => {
            await deleteItem(item.id);
        };

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
    });

    (document.getElementById('total-count') as HTMLElement).textContent = todoArray.length.toString();
}

function displayPagination(): void {
    const pagination: HTMLUListElement = document.getElementById('pagination') as HTMLUListElement;
    pagination.innerHTML = '';

    const pageCount: number = Math.ceil(todoArray.length / pageSize);

    for (let i = 1; i <= pageCount; i++) {
        const li: HTMLLIElement = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const a: HTMLAnchorElement = document.createElement('a');
        a.className = 'page-link';
        a.href = '#';
        a.textContent = i.toString();
        a.onclick = (e: MouseEvent) => {
            e.preventDefault();
            currentPage = i;
            updateUI();
        };
        li.appendChild(a);
        pagination.appendChild(li);
    }
}

function updateUI(): void {
    displayItems();
    displayPagination();
}

function SaveUserNameInLocalStorage(): void {
    if (UserNameControl.value.length >= MIN_USERNAME_LENGTH) {
        localStorage.setItem('userName', UserNameControl.value);
        USER_NAME = UserNameControl.value;
    } else {
        alert(`User Name skal være på minimum ${MIN_USERNAME_LENGTH} karakterer !!!`);
        UserNameControl.value = USER_NAME;
    }
}

function GetUserNameFromLocalStorage(): string {
    const userName: string | null = localStorage.getItem('userName');
    if (userName) {
        USER_NAME = userName;
    }
    return USER_NAME;
}

export function init_TypeScriptTodoItemsWebApi(): void {
    UserNameControl = document.getElementById('user-name') as HTMLInputElement;
    UserNameControl.value = GetUserNameFromLocalStorage();

    pageSizeElement = document.getElementById('pageSize') as HTMLInputElement;
    pageSizeElement.value = pageSize.toString();

    const tbodyUrls: HTMLTableSectionElement = document.getElementById('table-body-urls') as HTMLTableSectionElement;
    tbodyUrls.innerHTML = '';
    for (const raekke of UrlsToInfo) {
        const row: HTMLTableRowElement = tbodyUrls.insertRow();
        row.insertCell(0).textContent = raekke[0];
        row.insertCell(1).textContent = raekke[1];
        row.insertCell(2).textContent = raekke[2];
    }

    loadingdataSpinner = document.getElementById('loadingDataSpinner') as HTMLElement;

    document.getElementById('addFormElement')!.addEventListener('submit', async (e: Event) => {
        e.preventDefault();
        const name: string = (document.getElementById('add-name') as HTMLInputElement).value.trim();
        if (name) {
            await addItem(name);
            await getItems();
            (document.getElementById('add-name') as HTMLInputElement).value = '';
        }
    });

    document.getElementById('editFormElement')!.addEventListener('submit', async (e: Event) => {
        e.preventDefault();
        const id: number = parseInt((document.getElementById('edit-id') as HTMLInputElement).value, 10);
        const name: string = (document.getElementById('edit-name') as HTMLInputElement).value.trim();
        const isComplete: boolean = (document.getElementById('edit-isComplete') as HTMLInputElement).checked;
        await updateItem(id, name, isComplete);
        await getItems();
        (document.getElementById('editForm') as HTMLElement).classList.add('d-none');
        (document.getElementById('addForm') as HTMLElement).classList.remove('d-none');
    });

    document.getElementById('cancel-btn')!.addEventListener('click', () => {
        (document.getElementById('editForm') as HTMLElement).classList.add('d-none');
        (document.getElementById('addForm') as HTMLElement).classList.remove('d-none');
    });

    document.getElementById('pageSize')!.addEventListener('change', async (e: Event) => {
        const target = e.target as HTMLSelectElement;
        pageSize = parseInt(target.value, 10);
        if (pageSize < 1) pageSize = 1;
        currentPage = 1;
        await getItems();
    });

    document.getElementById('btnUserName')!.addEventListener('click', SaveUserNameInLocalStorage);

    // SignalR-forbindelse
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(`${MAIN_URL}/TodoHub`)
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ReceiveMessage", async function (user: string, message: string) {
        console.log("SignalR: " + user + " - " + message);
        await getItems();
    });

    connection.start().then(() => {
        console.log("SignalR-forbindelse oprettet.");
    }).catch((err: Error) => {
        return console.error(err.toString());
    });

    getItems();
}