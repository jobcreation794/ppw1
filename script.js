// Generate unique member ID
function generateMemberId() {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PP-${timestamp}-${random}`;
}

// Handle photo preview
document.getElementById('photo').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const preview = document.getElementById('photoPreview');
    
    if (file) {
        if (file.size > 2 * 1024 * 1024) {
            alert('File size must be less than 2MB');
            this.value = '';
            preview.innerHTML = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Photo Preview">`;
        }
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
});

// Handle form submission
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Generate member ID
    const memberId = generateMemberId();
    
    // Get form data
    const formData = new FormData(this);
    formData.append('memberId', memberId);
    
    // In a real application, you would send this to a server
    // For this demo, we'll store in localStorage
    const memberData = {};
    formData.forEach((value, key) => {
        memberData[key] = value;
    });
    
    // Handle photo separately
    const photoInput = document.getElementById('photo');
    if (photoInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            memberData.photoData = e.target.result;
            saveMemberData(memberId, memberData);
        }
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        saveMemberData(memberId, memberData);
    }
});

function saveMemberData(memberId, data) {
    // Get existing members or initialize empty array
    const members = JSON.parse(localStorage.getItem('prosperityPartyMembers')) || [];
    
    // Add new member
    members.push({
        id: memberId,
        data: data,
        registrationDate: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('prosperityPartyMembers', JSON.stringify(members));
    
    // Show success modal
    document.getElementById('generatedMemberId').textContent = memberId;
    document.getElementById('successModal').style.display = 'flex';
    
    // Reset form
    document.getElementById('registrationForm').reset();
    document.getElementById('photoPreview').innerHTML = '';
}

function lookupMember() {
    const memberId = document.getElementById('memberIdLookup').value.trim();
    
    if (!memberId) {
        alert('Please enter a Member ID');
        return;
    }
    
    // Store member ID for lookup page
    sessionStorage.setItem('lookupMemberId', memberId);
    
    // Redirect to member lookup page
    window.location.href = 'member-lookup.html';
}

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

function printMemberId() {
    const memberId = document.getElementById('generatedMemberId').textContent;
    const printContent = `
        <html>
        <head>
            <title>Prosperity Party - Member ID</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .id-card { border: 2px solid #dc3545; padding: 30px; display: inline-block; }
                .logo { width: 100px; height: 100px; }
                .member-id { font-size: 24px; font-weight: bold; margin: 20px 0; }
                .date { color: #666; }
            </style>
        </head>
        <body>
            <div class="id-card">
                <h2>Ethiopian Prosperity Party</h2>
                <p>Member Identification Card</p>
                <div class="member-id">${memberId}</div>
                <p class="date">Issued: ${new Date().toLocaleDateString()}</p>
            </div>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();