function ShowHideLines(ShowHideText)
{
    var DocumentElements = document.getElementsByName("demoFunction");

    for (let Counter = 0; Counter < DocumentElements.length; Counter++)
    {
        DocumentElements[Counter].style.display = ShowHideText;
    }
}

export function init_javaScriptDemoEvent()
{
    const buttonContainer = document.querySelector('.button-container');

    // Her er vist et eksempel på, at man SKAL addere en EventListener
    // i Callback funktionen for en given *.html fil, når man ønsker
    // at html elementer på siden, skal kunne nås efterfølgende !!!
    if (buttonContainer) 
    {
            // Lytter efter klik på hele containeren
            buttonContainer.addEventListener('click', (event) => {
            // event.target er det specifikke element, der blev klikket på
            const clickedButton = event.target;
            
            // Tjek, om det klikkede element er en af vores knapper
            if (clickedButton.classList.contains('action-button')) 
            {
                // Henter værdien af data-action attributten
                const actionParameter = clickedButton.dataset.action;
                
                // Kalder din funktion med den korrekte parameter
                ShowHideLines(actionParameter);
            }
        });
    } 
    else 
    {
        console.error("Fejl: Kunne ikke finde '.button-container'-klassen. Tjek din HTML.");
    }

    const buttonContainerInBlock = document.querySelector('.button-containerInBlock');
    if (buttonContainerInBlock)
    {
        // Definitionen her er den samme som vist herover for buttonContainer.addEventListener .
        // Det er bare syntaksen, der er lidt anderledes. Syntaksen her kan være lidt lettere
        // at forstå, hvis man ikke er bekendt med Lambda Expression syntaks.
        buttonContainerInBlock.addEventListener('click', function(event) { 
            // event.target er det specifikke element, der blev klikket på
            const clickedButton = event.target;
            
            // Tjek, om det klikkede element er en af vores knapper
            if (clickedButton.classList.contains('action-buttonInBlock')) 
            {
                // Henter værdien af data-action attributten
                const actionParameter = clickedButton.dataset.action;

                document.getElementById("TagsInOneBlock").style.display = actionParameter;
            }
        });
    }
    else 
    {
        console.error("Fejl: Kunne ikke finde '.button-containerInBlock'-klassen. Tjek din HTML.");
    }

    const buttoContainerSingle = document.querySelector('.button-containerSingle');
    if (buttoContainerSingle)
    {
        buttoContainerSingle.addEventListener('click', function(event) { 
            // event.target er det specifikke element, der blev klikket på
            const clickedButton = event.target;
            
            // Tjek, om det klikkede element er en af vores knapper
            if (clickedButton.classList.contains('action-buttonSingle')) 
            {
                // Henter værdien af data-action attributten
                const actionParameter = clickedButton.dataset.action;
                document.getElementById("demo").style.display = actionParameter;
            }
        });
    }
    else
    {
        console.error("Fejl: Kunne ikke finde '.button-containerSingle'-klassen. Tjek din HTML.");
    }
}