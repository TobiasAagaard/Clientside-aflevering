import { IS_DEBUG_MODE } from './javaScriptSettings.js';

let ButtonCounter = 0;
let TextBoxElement;
let DocumentButton;
// Denne variabel "holder state". Den gemmer en reference til knappen,
// der sidst blev klikket på, så vi kan opdatere den senere.
let lastClickedButton = null;

let btnAddNewButton = null;
let txtButtonContext = null;
let dynamicButtonsContainer = null;

const dynamicButtonAddedClassName = 'dynamic-button';

let textBoxDefaultText = "Init Text";

function AddNewButton() 
{
    // if (true == IS_DEBUG_MODE)
    // {
    //     debugger
    // }
    ButtonCounter++;
    const newButton = document.createElement('button');
    newButton.textContent = 'btnShow' + ButtonCounter.toString();
    newButton.className = dynamicButtonAddedClassName;
    newButton.style.backgroundColor = "blue";
    newButton.style.color = "white";
    dynamicButtonsContainer.appendChild(newButton);

    txtButtonContext.value = textBoxDefaultText;
}

function AddedButtonClicked(event) 
{
    // Sikrer, at vi kun reagerer på de dynamisk oprettede knapper
    if (event.target.classList.contains(dynamicButtonAddedClassName)) 
    {
        const clickedButton = event.target;
        
        // Gemmer en reference til den sidst klikkede knap i vores "state"
        lastClickedButton = clickedButton;

        // Opdaterer tekstboksen med knappens tekst
        txtButtonContext.value = clickedButton.textContent;
    }
}

function TextboxValueChanged()
{
    if (lastClickedButton) 
    {
        lastClickedButton.textContent = txtButtonContext.value;
        txtButtonContext.style.width = CalculateWidthOnControl(txtButtonContext);
    }
}

function CalculateWidthOnControl(Control_Object) 
{
    let ControlWidth = Control_Object.value.length;
    console.log(ControlWidth);
    console.log(ControlWidth * 9 + 25);
    return (ControlWidth * 9 + 25 + 'px');
}

// Callback funktion som bliver kaldt, når siden her javaScriptBindingDunamic.html
// er blevet loaded ind i klassen på index.html filen. Så der er ingen grund til
// at tjekke på DOMContentLoaded !!!
export function init_javaScriptBindingDynamic(numberOfButtonsToInsertOnStartup = 3)
{
    btnAddNewButton = document.getElementById("btnAddNewButton");

    if (btnAddNewButton)
    {
        btnAddNewButton.addEventListener('click', AddNewButton); 

        txtButtonContext = document.getElementById("txtButtonContext");
        if (txtButtonContext)
        {
            txtButtonContext.addEventListener('keyup', TextboxValueChanged);

            dynamicButtonsContainer = document.getElementById('ButtonsAdded');
            //const dynamicButtonsContainer = document.querySelector('.ButtonsAdded');
            if (dynamicButtonsContainer) 
            {
                // 2. Vi bruger event delegation på containeren til at fange klik på de dynamiske knapper.
                dynamicButtonsContainer.addEventListener('click', AddedButtonClicked);
            }
            else 
            {
                console.error("Fejl: Kunne ikke finde '#ButtonsAdded'-id. Tjek din HTML.");
            }
        }
        else 
        {
            console.error("Fejl: Kunne ikke finde 'txtButtonContext'-elementet. Tjek din HTML.");
        }

        for (let counter = 0; counter < numberOfButtonsToInsertOnStartup; counter++)
        {
            AddNewButton();
        }
    }
    else
    {
        console.error("Fejl: Kunne ikke finde 'btnAddNewButton'-elementet. Tjek din HTML.");
    }
}


