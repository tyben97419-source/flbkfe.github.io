/* ==========================================
   ZONE DE CONFIGURATION
   ========================================== */
const CLIENT_DATA = {
    info: {
        name: "FLB KFé", 
        tagline: "Votre escale gourmande à La Possession",
        phone: "0262919952",
        mapsLink: "https://maps.app.goo.gl/cH84DyL5syq457Jy8",
        
        // --- HORAIRES ---
        manualOverride: null, 

        horaires: {
            1: ["06:00-18:00"], 
            2: ["06:00-18:00"],
            3: ["06:00-18:00"],
            4: ["06:00-18:00"],
            5: ["06:00-18:00"],
            6: ["08:00-19:00"], 
            0: [] // Fermé Dimanche
        }
    },
    
    // --- LE MENU (TEXTES INCHANGÉS) ---
    menu: [
        {
            category: "Les Plats Cuisinés 🍛",
            items: [
                { name: "Rougail Saucisse", desc: "Saucisse fumée, riz, grains, rougail", price: "7.00€" },
                { name: "Cary Poulet", desc: "Poulet péi frais, riz, grains, rougail", price: "7.00€" },
                { name: "Civet Canard", desc: "riz, grains, rougail", price: "7.00€" },
                { name: "Massalé Cabri", desc: "riz, grains, rougail", price: "7.00€" }
            ]
        },
        {
            category: "Nos Sandwichs 🥖",
            items: [
                { name: "Sandwich", desc: "Bouchon, Sarcive, Dakatine, Crudité, Fromage, Sardine, Thon-Maïs, Jambon-Beurre", price: "2.50€" },
                { name: "Américain Bouchon", desc: "Bouchons porc/combava, frites, gratiné", price: "4.00€" },
                { name: "Américain Sarcive", desc: "Sarcive , frites, gratiné", price: "4.00€" },
                { name: "Le Spécial FLB Kfé", desc: "Steak, Oeuf, Jambon, Fromage, Frites", price: "4.50€" }
            ]
        },
        {
            category: "Boissons Fraîches 🥤",
            items: [
                { name: "Cot", desc: "La base", price: "1.20€" },
                { name: "Dodo 33cl", desc: "Bien glacée", price: "1.30€" },
                { name: "Coca 50cl", desc: "", price: "1.50€" },
                { name: "Eau 1L", desc: "", price: "1.50€" }
            ]
        },
        {
            category: "Snacking & Matin 🥐",
            items: [
                { name: "Café Allongé", desc: "", price: "1.50€" },
                { name: "Pain Chocolat", desc: "", price: "1.20€" },
                { name: "Pain Raisin", desc: "", price: "1.30€" },
                { name: "Samoussa", desc: "Fromage, Poisson, Poulet", price: "0.40€" },
                { name: "Bonbon Piment", desc: "", price: "0.40€" }
            ]
        }
    ]
};

/* ==========================================
   LOGIQUE TECHNIQUE
   ========================================== */

function checkOpenStatus(horaires, override) {
    if (override) return override;

    const now = new Date();
    const day = now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const todaySlots = horaires[day];
    if (!todaySlots || todaySlots.length === 0) return "FERMÉ";

    let isOpen = false;
    todaySlots.forEach(slot => {
        const [start, end] = slot.split('-');
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        if (currentMinutes >= startTotal && currentMinutes < endTotal) {
            isOpen = true;
        }
    });

    return isOpen ? "OUVERT" : "FERMÉ";
}

document.addEventListener('DOMContentLoaded', () => {
    const info = CLIENT_DATA.info;

    // 1. Textes & Titres
    document.title = info.name;
    document.getElementById('shop-name').textContent = info.name;
    document.getElementById('shop-tagline').textContent = info.tagline;
    document.getElementById('footer-text').textContent = `© ${new Date().getFullYear()} ${info.name} - 37 Rue du 20 Decembre 1848, La Possession`;

    // 2. Liens
    const telLinks = document.querySelectorAll('#btn-tel, #sticky-call');
    telLinks.forEach(link => link.href = `tel:${info.phone}`);
    document.getElementById('btn-maps').href = info.mapsLink;

    // 3. Status
    const badge = document.getElementById('status-badge');
    const status = checkOpenStatus(info.horaires, info.manualOverride);
    
    if (status === "FERMÉ") {
        badge.textContent = "ACTUELLEMENT FERMÉ";
        badge.style.backgroundColor = "#718096"; // Gris
        badge.style.color = "white";
    } else {
        badge.textContent = "OUVERT • BIENVENUE";
        // VERT FONCÉ (Comme demandé)
        badge.style.backgroundColor = "#2E7D32"; 
        badge.style.color = "white";
    }

    // 4. Génération du Menu
    const menuContainer = document.getElementById('menu-container');
    
    CLIENT_DATA.menu.forEach(section => {
        const sectionBlock = document.createElement('section');
        sectionBlock.className = 'menu-section';

        const catTitle = document.createElement('h2');
        catTitle.className = 'category-title';
        catTitle.textContent = section.category;
        sectionBlock.appendChild(catTitle);

        section.items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'item-card';
            el.innerHTML = `
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <div class="item-desc">${item.desc}</div>
                </div>
                <div class="item-price">${item.price}</div>
            `;
            sectionBlock.appendChild(el);
        });

        menuContainer.appendChild(sectionBlock);
    });
});