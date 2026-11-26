document.addEventListener('DOMContentLoaded', () => {
    const supportForm = document.getElementById('supportForm');
    const responseBox = document.getElementById('responseBox');
    const dotazInput = document.getElementById('dotaz');

    supportForm.addEventListener('submit', async (udalost) => {
        udalost.preventDefault();

        const dotazText = dotazInput.value.trim();
        if (dotazText === '') {
            alert('Nejdříve prosím vyplňte svůj dotaz.');
            return;
        }

        responseBox.innerHTML = 'Odesílám dotaz a čekám na odpověď...';
        responseBox.style.color = 'orange';

        try {
            const odpoved = await fetch('https://prv-prace.onrender.com/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: dotazText,
                    student: 'Hardwhack0' // volitelně můžeš vzít i z inputu pro e-mail
                })
            });

            if (!odpoved.ok) {
                throw new Error(`Chyba serveru: ${odpoved.status}`);
            }

            const data = await odpoved.json();
            responseBox.innerHTML = data.reply;
            responseBox.style.color = 'green';
            supportForm.reset();

        } catch (chyba) {
            console.error('Chyba:', chyba);
            responseBox.innerHTML = 'Nepodařilo se spojit se serverem.';
            responseBox.style.color = 'red';
        }
    });
});
