// site-wide cursor
document.addEventListener('DOMContentLoaded', () => {
    const siteWideCursor = document.querySelector(".custom-cursor.site-wide");
    const mouseText = document.getElementById('mouse-text');
    const entryArea = document.querySelector('.entryarea');
    const threeContainer = document.getElementById('three-container');
    const overlay = document.getElementById('instr-overlay');
    const hoverableElements = document.querySelectorAll('.hoverable');
    const userInputElement = document.getElementById('userInput');

    function shouldDisableForMobile() {
        return window.matchMedia("(max-width: 1100px)").matches;
    }

    function trackCursor(evt) {
        const w = siteWideCursor.clientWidth;
        const h = siteWideCursor.clientHeight;
        siteWideCursor.style.transform = `translate(${evt.clientX - w / 2}px, ${evt.clientY - h / 2}px)`;
    }

    function isMouseOverElement(event, element) {
        const rect = element.getBoundingClientRect();
        return (
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom
        );
    }

    if (!shouldDisableForMobile()) {
        document.addEventListener('mouseenter', () => {
            siteWideCursor.style.display = 'block';
        });

        document.addEventListener('mouseleave', () => {
            siteWideCursor.style.display = 'none';
        });

        document.addEventListener('mousemove', trackCursor);

        document.addEventListener('mousedown', () => siteWideCursor.classList.add('active'));
        document.addEventListener('mouseup', () => siteWideCursor.classList.remove('active'));

        document.addEventListener('mousemove', (e) => {
            mouseText.style.top = `${e.clientY + 15}px`;
            mouseText.style.left = `${e.clientX + 15}px`;

            if (isMouseOverElement(e, entryArea)) {
                mouseText.innerText = 'Ask anything about me Here! 👏';
            } else if (isMouseOverElement(e, threeContainer)) {
                mouseText.innerText = 'Voice Control By Click Me 🤫';
            } else {
                mouseText.innerText = '';
            }
        });
    }

    overlay.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    window.addEventListener('resize', () => {
        if (shouldDisableForMobile()) {
            siteWideCursor.style.display = 'none';
        }
    });

    hoverableElements.forEach(element => {
        element.addEventListener('click', () => {
            userInputElement.value = element.innerText;
        });
    });
});