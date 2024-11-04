let selectedDate = null;
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

// Tarih seçici ayarları
flatpickr("#flatpickr-container", {
    inline: true,
    dateFormat: "d F, l",
    minDate: "today", 
    maxDate: new Date(new Date().setDate(new Date().getDate() + 60)), 
    onChange: (selectedDates, dateStr) => {
        selectedDate = dateStr;
        document.getElementById("timeSlots").classList.remove("hidden");

        
        if (timeSelected) { 
            document.getElementById("nextStepButton1").innerHTML = `Continue to ${selectedDate}, ${timeSelected} <i style="margin-right:0; margin-left:8px" class="fa-solid fa-angle-right"></i>`;
        } else { 
            document.getElementById("nextStepButton1").textContent = `Please Select Date`;
        }
    }
});


// Saat Seçimi
function selectTime(time) {
    timeSelected = time;
    document.querySelectorAll('.time-slot').forEach(slot => slot.classList.remove('selected'));
    document.querySelector(`[onclick="selectTime('${time}')"]`).classList.add('selected');

    // Buton metnini güncelle
    document.getElementById("nextStepButton1").innerHTML = ` Continue to ${selectedDate}, ${time} <i style="margin-right:0; margin-left:8px" class="fa-solid fa-angle-right"></i>`;
    document.getElementById("nextStepButton1").classList.remove("hidden");
}

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


