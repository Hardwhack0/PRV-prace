
document.addEventListener('DOMContentLoaded', () => {
    
    const supportForm = document.getElementById('supportForm');
    const responseBox = document.getElementById('responseBox');
    const dotazInput = document.getElementById('dotaz');

    supportForm.addEventListener('submit', (udalost) => {
        udalost.preventDefault();

        if (dotazInput.value.trim() === '') {
            alert('Nejdříve prosím vyplňte svůj dotaz.');
            return;
        }

        responseBox.innerHTML = '<strong>Váš dotaz byl úspěšně odeslán.</strong> Naše technická podpora se jím právě zabývá a brzy se zde zobrazí odpověď.';
        responseBox.style.color = 'green';
        
        supportForm.reset();
    });
});