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
                    student: 'Hardwhack0'
                })
            });

            const data = await odpoved.json();

            if (!odpoved.ok) {
                throw new Error(data.error || `Chyba serveru: ${odpoved.status}`);
            }

            responseBox.innerHTML = data.reply;
            responseBox.style.color = 'green';
            supportForm.reset();

        } catch (chyba) {
            console.error('Chyba:', chyba);
            if (chyba.message.includes('503')) {
                responseBox.innerHTML = 'AI je momentálně přetížená (chyba 503 ze strany Googlu). Zkuste dotaz odeslat znovu za chvilku.';
            } else {
                responseBox.innerHTML = `Chyba: ${chyba.message}`;
            }
            responseBox.style.color = 'red';
        }
    });
});
