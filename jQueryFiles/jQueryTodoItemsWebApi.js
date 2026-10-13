import '../javaScriptFiles/Shared.js';

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
let API_URL = MAIN_URL + "/api/todoitems";
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
function getItems() {
    $(loadingdataSpinner).show();
    const params = { userName: USER_NAME };
    const url = `${API_URL}`;

    if (IS_LOG_ENABLED)
    {
        console.log(url);
    }

    $.ajax({
        url: url,
        type: 'GET',
        data: params,
        success: function(data) {
            todoArray = data.map(item => new TodoItem(item));
            updateUI();
        },
        error: function(xhr, status, error) {
            console.error("Fejl ved hentning af data:", error);
        },
        complete: function() {
            $(loadingdataSpinner).hide();
        }
    });
}

// POST: Tilføj en ny opgave
function addItem(name) {
    const params = { userName: USER_NAME };
    const newTodo = { name, isComplete: false };

    $.ajax({
        url: API_URL,
        type: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(newTodo),
        success: function() {
            // SignalR vil opdatere UI på alle klienter
        },
        error: function(xhr, status, error) {
            console.error("Fejl ved tilføjelse af data:", error);
        }
    });
}

// PUT: Opdater en eksisterende opgave
function updateItem(id, name, isComplete) {
    const params = { userName: USER_NAME };
    const url = `${API_URL}/${id}`;
    const updatedTodo = { id, name, isComplete };

    $.ajax({
        url: url,
        type: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify(updatedTodo),
        success: function() {
            // SignalR vil opdatere UI på alle klienter
        },
        error: function(xhr, status, error) {
            console.error("Fejl ved opdatering af data:", error);
        }
    });
}

// DELETE: Slet en opgave
function deleteItem(id) {
    const params = { userName: USER_NAME };
    const url = `${API_URL}/${id}`;
    
    $.ajax({
        url: url,
        type: 'DELETE',
        data: params,
        success: function() {
            // SignalR vil opdatere UI på alle klienter
        },
        error: function(xhr, status, error) {
            console.error("Fejl ved sletning af data:", error);
        }
    });
}

// Håndtering af brugergrænsefladen
// ---
function displayItems() {
    const $tbody = $('#table-body');
    $tbody.empty();
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const itemsToShow = todoArray.slice(startIndex, endIndex);

    $.each(itemsToShow, function(index, item) {
        const row = `
            <tr>
                <td><input type="checkbox" disabled ${item.isComplete ? 'checked' : ''}></td>
                <td>${item.name}</td>
                <td>
                    <button class="btn btn-warning btn-sm me-2 edit-btn" data-id="${item.id}" data-name="${item.name}" data-complete="${item.isComplete}">Ret</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${item.id}">Slet</button>
                </td>
            </tr>
        `;
        $tbody.append(row);
    });

    $('#total-count').text(todoArray.length);
}

// Bemærk: jQuery her er ikke super relevant, da det er ren DOM
function displayPagination() {
    const $pagination = $('#pagination');
    $pagination.empty();

    const pageCount = Math.ceil(todoArray.length / pageSize);

    for (let i = 1; i <= pageCount; i++) {
        const liClass = `page-item ${i === currentPage ? 'active' : ''}`;
        const pageLink = `<li class="${liClass}"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        $pagination.append(pageLink);
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
        $(UserNameControl).val(USER_NAME);
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

export function init_jQueryTodoItemsWebApi()
{
    // Event Listeners med jQuery
    UserNameControl = $('#user-name')[0];
    $(UserNameControl).val(GetUserNameFromLocalStorage());

    const pageSizeElement = $('#pageSize');
    pageSizeElement.val(pageSize.toString());

    const $tbodyUrls = $('#table-body-urls');
    $tbodyUrls.empty();
    $.each(UrlsToInfo, function(index, raekke) {
        const row = `
            <tr>
                <td>${raekke[0]}</td>
                <td>${raekke[1]}</td>
                <td>${raekke[2]}</td>
            </tr>
        `;
        $tbodyUrls.append(row);
    });
    
    loadingdataSpinner = $('#loadingDataSpinner')[0];

    $('#addFormElement').on('submit', function(e) {
        e.preventDefault();
        const name = $('#add-name').val().trim();
        if (name) {
            addItem(name);
            $('#add-name').val('');
        }
    });

    $('#editFormElement').on('submit', function(e) {
        e.preventDefault();
        const id = $('#edit-id').val();
        const name = $('#edit-name').val().trim();
        const isComplete = $('#edit-isComplete').prop('checked');
        updateItem(id, name, isComplete);
        $('#editForm').addClass('d-none');
        $('#addForm').removeClass('d-none');
    });

    $('#cancel-btn').on('click', function() {
        $('#editForm').addClass('d-none');
        $('#addForm').removeClass('d-none');
    });

    $('#pageSize').on('change', function() {
        pageSize = parseInt($(this).val(), 10);
        if (pageSize < 1) pageSize = 1;
        currentPage = 1;
        updateUI();
    });

    $('#btnUserName').on('click', SaveUserNameInLocalStorage);

    // Event delegation for "Ret" og "Slet" knapper
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const name = $(this).data('name');
        const isComplete = $(this).data('complete') === 'true'; // Vigtigt: data er altid string
        
        $('#edit-id').val(id);
        $('#edit-name').val(name);
        $('#edit-isComplete').prop('checked', isComplete);
        $('#editForm').removeClass('d-none');
        $('#addForm').addClass('d-none');
    });

    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        deleteItem(id);
    });

    $(document).on('click', '#pagination a.page-link', function(e) {
        e.preventDefault();
        currentPage = parseInt($(this).data('page'), 10);
        updateUI();
    });

    // SignalR-forbindelse
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(MAIN_URL + "/TodoHub")
        .configureLogging(signalR.LogLevel.Information)
        .build();

    connection.on("ReceiveMessage", function (user, message) {
        console.log("SignalR: " + user + " - " + message);
        getItems();
    });

    connection.start().then(function () {
        console.log("SignalR-forbindelse oprettet.");
    }).catch(function (err) {
        return console.error(err.toString());
    });

    getItems();
}