let selectedDate;
let timeSelected = null;
let platformSelected = null;
let whatsappNumber = null;

function showStep(stepNumber) {
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
    document.getElementById(`step${stepNumber}`).classList.add('active');

    if (stepNumber === 3) {
        displaySummary();
    }
}

function displaySummary() {
    document.getElementById("summaryDate").innerHTML = `<div class="summary-info-alt"><i class="fa-regular fa-calendar-check"></i> ${selectedDate}, ${timeSelected}</div> <div class="summary-info-alt"><i class="fa-solid fa-globe"></i> ${document.getElementById("timezoneSelect").value} </div>`;

    let platformText = ` ${platformSelected === 'whatsapp' ? '<div class="social-list"><img width="48" height="48" src = "https://img.icons8.com/color/48/whatsapp--v1.png" alt = "whatsapp--v1" /> WhatsApp</div > ' : platformSelected === 'zoom' ? ' <div class="social-list"><img width="48" height="48" src="https://img.icons8.com/color/48/zoom.png" alt = "zoom" /> Zoom</div > ' : '<div class="social-list"><img width="48" height="48" src = "https://img.icons8.com/color/48/google-meet--v1.png" alt = "google-meet--v1" /> Google Meet </div > '}`;
    document.getElementById("summaryPlatform").innerHTML =  platformText;

    if (platformSelected === 'whatsapp' && whatsappNumber) {
        const countryNumber = document.querySelector(".iti__a11y-text").textContent;
        document.getElementById("summaryWhatsApp").innerHTML = `<div class="social-list"><img width="48" height="48" src = "https://img.icons8.com/color/48/whatsapp--v1.png" alt = "whatsapp--v1" />${countryNumber} ${whatsappNumber}</div >`;
        document.getElementById("summaryWhatsApp").classList.remove("hidden");
    } else {
        document.getElementById("summaryWhatsApp").classList.add("hidden");
    }
}


    const doluSaatler = {
        '25 November, Monday': [
            "08:00",
            "08:30",
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
        ],
        '23 November, Saturday': [
            "08:00",
            "08:30",
            "09:00",
            "09:30",
            "10:00",
            "10:30",
            "11:00",
            "11:30",
            "12:00",
            "12:30",
            "13:00",
            "13:30",
            "14:00",
            "14:30",
            "15:00",
            "15:30",
            "16:00",
            "16:30",
            "17:00",
            "17:30",
            "18:00",
        ],
        
    };

    function formatNumber(num) {
        return num < 10 ? '0' + num : num; // 1 basamaklı sayılara sıfır ekle
    }

    function tarihVeSaatEkle() {
        const bugun = new Date();
        const gunler = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const aylar = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const gun = gunler[bugun.getDay()]; // Bugünün gününü al
        const ay = aylar[bugun.getMonth()]; // Bugünün ayını al
        const tarih = `${formatNumber(bugun.getDate())} ${ay}, ${gun}`; // İstenilen formatta tarih oluştur

        // Mevcut saat ve dakika
        const saat = bugun.getHours();
        const dakika = bugun.getMinutes();
        
        // Saat ve dakikayı birleştir
        const mevcutSaat = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate(), saat, dakika);

        // Dolu saatleri hesapla
        const doluSaatAraliklari = [];
        let eklenenSaat = new Date(bugun.getFullYear(), bugun.getMonth(), bugun.getDate(), 8, 0); // 08:00'den başla

        // Eğer mevcut saat 08:00'den ilerideyse, aralığı oluştur
        if (mevcutSaat >= eklenenSaat) {
            while (eklenenSaat <= mevcutSaat) {
                doluSaatAraliklari.push(`${formatNumber(eklenenSaat.getHours())}:${formatNumber(eklenenSaat.getMinutes())}`);
                eklenenSaat.setMinutes(eklenenSaat.getMinutes() + 30); // 30 dakika ekle
            }
        }

        // Yeni dolu saatleri mevcut tarih için ekle
        if (!doluSaatler[tarih]) {
            doluSaatler[tarih] = [];
        }

        doluSaatAraliklari.forEach(saat => {
            if (!doluSaatler[tarih].includes(saat)) {
                doluSaatler[tarih].push(saat);
            }
        });

        // Sonucu konsola yazdır
        console.log(JSON.stringify(doluSaatler, null, 2));
    }

    


tarihVeSaatEkle();

// Tarih seçici ayarları
flatpickr("#flatpickr-container", {
    inline: true,
    dateFormat: "d F, l",
    minDate: "today",
    maxDate: new Date(new Date().setDate(new Date().getDate() + 60)),
    onChange: (selectedDates, dateStr) => {
        selectedDate = dateStr;
        document.getElementById("timeSlots").classList.remove("hidden");

        // Saat slotlarını kontrol et ve dolu olanları işaretle
        kontrolEtVeGoster(dateStr);
        // Sayfa yüklendiğinde tarih ve saat ekle
        
        // Eğer önceki saat dolu ise, seçimi sıfırla
        if (timeSelected && doluSaatler[selectedDate]?.includes(timeSelected)) {
            timeSelected = null; // Seçilen saati sıfırla
            document.getElementById("nextStepButton1").classList.add("hidden"); // Butonu gizle
            document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected')); // Seçimi kaldır
        }

        // Buton metnini güncelle
        güncelleButonMetni();
    }
});

// Saat seçimi
function selectTime(time) {
    if (doluSaatler[selectedDate]?.includes(time)) {
        alert("This time slot is already reserved."); // Dolu saat için uyarı
        return; // Dolu saat seçildiğinde hiçbir şey yapma
    }

    const [hour, minute] = time.split(':').map(Number);
    const slotDateTime = new Date(`${selectedDate} ${hour}:${minute}`);
    const currentDateTime = new Date();

    // Eğer saat geçmişteyse, kullanıcıyı bilgilendir
    if (slotDateTime < currentDateTime) {
        alert("You cannot select a past time slot.");
        return; // Geçmiş saat seçildiğinde hiçbir şey yapma
    }

    timeSelected = time;
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    document.querySelector(`[onclick="selectTime('${time}')"]`).classList.add('selected');

    // Buton metnini güncelle
    güncelleButonMetni();
}

// Belirli tarihteki dolu saatleri kontrol et ve işaretle
function kontrolEtVeGoster(tarih) {
    const timeSlots = document.querySelectorAll('.time-slot');
    const currentDateTime = new Date();

    // Önce tüm saatleri varsayılan hale döndür
    timeSlots.forEach(slot => {
        slot.classList.remove('dolu');
        slot.textContent = slot.textContent.replace(' ', ''); // "" ibaresini kaldır
        slot.style.display = 'block'; // Varsayılan olarak görünür yap
        slot.onclick = () => selectTime(slot.textContent.trim()); // Tıklanabilir hale getir
    });

    // Seçilen tarihteki dolu saatleri işaretle ve geçmiş saatleri gizle
    const doluSaatlerGunu = doluSaatler[tarih] || [];
    timeSlots.forEach(slot => {
        const saat = slot.textContent.trim();
        const [hour, minute] = saat.split(':').map(Number);
        const slotDateTime = new Date(`${tarih} ${hour}:${minute}`);

        // Eğer saat dolu ise, dolu sınıfını ekle ve tıklanamaz yap
        if (doluSaatlerGunu.includes(saat)) {
            slot.classList.add('dolu');
            slot.textContent += ' ';
            slot.onclick = null; // Dolu saatleri tıklanamaz yap
        }

        // Eğer saat geçmişte ise, görünümünü gizle
        if (slotDateTime < currentDateTime) {
            slot.style.display = 'none'; // Geçmiş saatleri gizle
        }
    });
}

// Buton metnini güncelleme fonksiyonu
function güncelleButonMetni() {
    const button = document.getElementById("nextStepButton1");
    if (timeSelected) {
        button.innerHTML = `Continue to ${selectedDate}, ${timeSelected} <i style="margin-right:0; margin-left:8px" class="fa-solid fa-angle-right"></i>`;
        button.classList.remove("hidden");
    } else {
        button.textContent = `Please Select Date`;
    }
}

// CSS ile dolu saatleri belirt
document.head.insertAdjacentHTML('beforeend', `
<style>
    .dolu {
        background-color: #007bff;
        color: white;
        pointer-events: none;
        font-weight: bold;
        opacity: .3;
    }
</style>
`);




// Platform Seçimi
function selectPlatform(platform) {
    platformSelected = platform;
    document.querySelectorAll('.platform-option').forEach(option => option.classList.remove('selected'));
    document.querySelector(`[onclick="selectPlatform('${platform}')"]`).classList.add('selected');

    const platformMessage = document.getElementById("platformMessage");
    const whatsappInput = document.getElementById("whatsappInput");
    const whatsappInputC = document.querySelector(".whatsapp-input-containers");
    const nextStepButton2 = document.getElementById("nextStepButton2");

    if (platform === 'whatsapp') {
        platformMessage.classList.add("hidden");
        whatsappInputC.classList.remove("hidden");
        whatsappInput.value = '';
        nextStepButton2.classList.add("hidden");
    } else {
        platformMessage.textContent = "The platform link will be sent via email after the session is created.";
        platformMessage.classList.remove("hidden");
        whatsappInputC.classList.add("hidden");
        nextStepButton2.classList.remove("hidden");
    }
}

// WhatsApp numarası girildiğinde "Next" butonunu etkinleştir
function enableNextButton() {
    whatsappNumber = document.getElementById("whatsappInput").value.trim();
    document.getElementById("nextStepButton2").classList.toggle("hidden", whatsappNumber === '');
}

// Form doğrulama
function validateForm() {
   
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    document.getElementById("createAppointmentButton").classList.toggle("hidden",  !name || !email);
}

// Randevu Oluşturma Ekranı Yönlendirmesi
function redirectToConfirmation() {
    const confirmationScreen = document.getElementById("confirmationStep");
    confirmationScreen.classList.remove("hidden");
    const countryNumber = document.querySelector(".iti__a11y-text").textContent;

    // Platform adını düzgün formatta göstermek için
    let formattedPlatform;
    let platformIcon; // İkon değişkeni

    switch (platformSelected) {
        case 'whatsapp':
            formattedPlatform = 'WhatsApp';
            platformIcon = '<img width="24" height="24" src="https://img.icons8.com/color/24/whatsapp--v1.png" alt="WhatsApp" />';
            break;
        case 'zoom':
            formattedPlatform = 'Zoom';
            platformIcon = '<img width="24" height="24" src="https://img.icons8.com/color/24/zoom.png" alt="Zoom" />';
            break;
        case 'google_meet':
            formattedPlatform = 'Google Meet';
            platformIcon = '<img width="24" height="24" src="https://img.icons8.com/color/24/google-meet--v1.png" alt="Google Meet" />';
            break;
        default:
            formattedPlatform = platformSelected; // Varsayılan, tanımlı olmayan platformlar
            platformIcon = ''; // İkon yok
    }

    // WhatsApp numarası satırını yalnızca numara mevcutsa ekle
    const whatsappLine = whatsappNumber ? `${countryNumber}${whatsappNumber}` : ''; // Numarayı eklemek için doğru biçimde güncellendi

    // Tüm detayları gösteren divleri oluştur
    const confirmationDetails = document.getElementById("confirmationDetails");
    

    // Randevu bilgileri divlerini oluştur
    const details = [
        { icon: 'fa-regular fa-calendar', text: selectedDate },
        { icon: 'fa-regular fa-clock', text: timeSelected },
        { icon: 'fa-solid fa-globe', text: document.getElementById("timezoneSelect").value }, // İkon solid olarak güncellendi
        { icon: 'fa-regular fa-user', text: document.getElementById("name").value },
        { icon: 'fa-regular fa-envelope', text: document.getElementById("email").value },
        { icon: 'fa-regular fa-message', text: document.getElementById("message").value || 'No Message' }, // Mesaj kontrolü
        { icon: '', text: formattedPlatform, img: platformIcon }, // İkonu ekledik
    ];

    // Detayları oluştur ve ekle
    details.forEach(detail => {
        const detailDiv = document.createElement("div");
        detailDiv.className = "social-list";

        // İkonu ekle
        if (detail.img) {
            const iconElement = document.createElement("span");
            iconElement.innerHTML = detail.img; // İkonu HTML olarak ekle
            detailDiv.appendChild(iconElement);
        } else {
            const iconElement = document.createElement("i");
            iconElement.className = detail.icon; // Font Awesome ikonunu ekle
            detailDiv.appendChild(iconElement);
        }

        const textNode = document.createTextNode(detail.text);
        detailDiv.appendChild(textNode);
        confirmationDetails.appendChild(detailDiv);
    });

    // WhatsApp numarasını yalnızca platform WhatsApp ise ve numara mevcutsa ekle
    if (platformSelected === 'whatsapp' && whatsappNumber) {
        const whatsappDiv = document.createElement("div");
        whatsappDiv.className = "social-list";
        whatsappDiv.innerHTML = `<img width="24" height="24" src="https://img.icons8.com/color/24/whatsapp--v1.png" alt="WhatsApp" /> ${countryNumber}${whatsappNumber}`;
        confirmationDetails.appendChild(whatsappDiv);
    }

    // Bilgileri gizli inputlara aktar
    document.getElementById("confirmDate").value = selectedDate;
    document.getElementById("confirmTime").value = timeSelected;
    document.getElementById("confirmPlatform").value = formattedPlatform;
    document.getElementById("confirmWhatsApp").value = countryNumber + whatsappNumber;
    document.getElementById("confirmLocation").value = document.getElementById("timezoneSelect").value;
    document.getElementById("confirmName").value = document.getElementById("name").value;
    document.getElementById("confirmEmail").value = document.getElementById("email").value;
    document.getElementById("confirmMessage").value = document.getElementById("message").value || 'No Message'; // Mesaj kontrolü

    // İlk ekranı gizle
    document.querySelectorAll('.step').forEach(step => step.classList.remove('active'));
}


