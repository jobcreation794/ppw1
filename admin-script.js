<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Prosperity Party – Member Registration</title>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg">

<header>
    <img src="logo.png.png" class="logo">
    <h1>Prosperity Party – Ethiopia</h1>
    <p>Public Relations & Membership Registration</p>
</header>
// Admin credentials (In production, use proper authentication)
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'prosperity2024'
};

// Login handler
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        loadMembers();
    } else {
        alert('Invalid credentials!');
    }
});

// Load members from localStorage
function loadMembers() {
    const members = JSON.parse(localStorage.getItem('prosperityPartyMembers')) || [];
    const tableBody = document.getElementById('membersTableBody');
    
    tableBody.innerHTML = '';
    
    if (members.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <i class="fas fa-users-slash" style="font-size: 48px; color: #6c757d; margin-bottom: 20px;"></i>
                    <h3>No members registered yet</h3>
                </td>
            </tr>
        `;
        return;
    }
    
    members.forEach((member, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.data.firstName} ${member.data.lastName}</td>
            <td>${member.data.phone || 'N/A'}</td>
            <td>${member.data.region || 'N/A'}</td>
            <td>${new Date(member.registrationDate).toLocaleDateString()}</td>
            <td class="actions-cell">
                <button onclick="viewMember('${member.id}')" class="btn btn-edit">
                    <i class="fas fa-eye"></i> View
                </button>
                <button onclick="editMember('${member.id}')" class="btn btn-edit">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteMember('${member.id}')" class="btn btn-delete">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function viewMember(memberId) {
    sessionStorage.setItem('lookupMemberId', memberId);
    window.open('member-lookup.html', '_blank');
}

function editMember(memberId) {
    const members = JSON.parse(localStorage.getItem('prosperityPartyMembers')) || [];
    const member = members.find(m => m.id === memberId);
    
    if (member) {
        // Create edit form
        const editForm = `
            <div class="modal" id="editModal" style="display: flex;">
                <div class="modal-content">
                    <div class="modal-header success">
                        <i class="fas fa-edit"></i>
                        <h3>Edit Member: ${memberId}</h3>
                    </div>
                    <div class="modal-body" style="text-align: left;">
                        <form id="editMemberForm">
                            <div class="form-group">
                                <label>First Name</label>
                                <input type="text" id="editFirstName" value="${member.data.firstName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Last Name</label>
                                <input type="text" id="editLastName" value="${member.data.lastName || ''}" required>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="text" id="editPhone" value="${member.data.phone || ''}">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" id="editEmail" value="${member.data.email || ''}">
                            </div>
                            <div class="form-group">
                                <label>Address</label>
                                <textarea id="editAddress" rows="3">${member.data.address || ''}</textarea>
                            </div>
                            <div class="form-group">
                                <label>Region</label>
                                <input type="text" id="editRegion" value="${member.data.region || ''}">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button onclick="closeEditModal()" class="btn btn-close">Cancel</button>
                        <button onclick="saveMemberEdit('${memberId}')" class="btn btn-print">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', editForm);
    }
}

function saveMemberEdit(memberId) {
    const members = JSON.parse(localStorage.getItem('prosperityPartyMembers')) || [];
    const memberIndex = members.findIndex(m => m.id === memberId);
    
    if (memberIndex !== -1) {
        // Update member data
        members[memberIndex].data.firstName = document.getElementById('editFirstName').value;
        members[memberIndex].data.lastName = document.getElementById('editLastName').value;
        members[memberIndex].data.phone = document.getElementById('editPhone').value;
        members[memberIndex].data.email = document.getElementById('editEmail').value;
        members[memberIndex].data.address = document.getElementById('editAddress').value;
        members[memberIndex].data.region = document.getElementById('editRegion').value;
        
        // Save to localStorage
        localStorage.setItem('prosperityPartyMembers', JSON.stringify(members));
        
        // Close modal and refresh table
        closeEditModal();
        loadMembers();
        alert('Member updated successfully!');
    }
}

function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

function deleteMember(memberId) {
    if (confirm(`Are you sure you want to delete member ${memberId}?`)) {
        const members = JSON.parse(localStorage.getItem('prosperityPartyMembers')) || [];
        const filteredMembers = members.filter(m => m.id !== memberId);
        
        localStorage.setItem('prosperityPartyMembers', JSON.stringify(filteredMembers));
        loadMembers();
        alert('Member deleted successfully!');
    }
}

function exportToExcel() {
    const members = JSON.parse(localStorage.getItem('prosperityPartyMembers')) || [];
    
    if (members.length === 0) {
        alert('No data to export!');
        return;
    }
    
    // Create CSV content
    let csv = 'Member ID,Full Name,Phone,Email,Region,Address,Registration Date\n';
    
    members.forEach(member => {
        const fullName = `${member.data.firstName} ${member.data.middleName || ''} ${member.data.lastName}`.trim();
        const phone = member.data.phone || '';
        const email = member.data.email || '';
        const region = member.data.region || '';
        const address = (member.data.address || '').replace(/,/g, ';');
        const regDate = new Date(member.registrationDate).toLocaleDateString();
        
        csv += `"${member.id}","${fullName}","${phone}","${email}","${region}","${address}","${regDate}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prosperity-party-members-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function exportToPDF() {
    const members = JSON.parse(localStorage.getItem('prosperityPartyMembers')) || [];
    
    if (members.length === 0) {
        alert('No data to export!');
        return;
    }
    
    // Create HTML content for PDF
    let html = `
        <html>
        <head>
            <title>Prosperity Party Members</title>
            <style>
                body { font-family: Arial, sans-serif; }
                h1 { color: #dc3545; text-align: center; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #dc3545; color: white; }
            </style>
        </head>
        <body>
            <h1>Ethiopian Prosperity Party - Member Registry</h1>
            <p>Generated: ${new Date().toLocaleString()}</p>
            <table>
                <thead>
                    <tr>
                        <th>Member ID</th>
                        <th>Full Name</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Region</th>
                        <th>Registration Date</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    members.forEach(member => {
        const fullName = `${member.data.firstName} ${member.data.middleName || ''} ${member.data.lastName}`.trim();
        html += `
            <tr>
                <td>${member.id}</td>
                <td>${fullName}</td>
                <td>${member.data.phone || ''}</td>
                <td>${member.data.email || ''}</td>
                <td>${member.data.region || ''}</td>
                <td>${new Date(member.registrationDate).toLocaleDateString()}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </body>
        </html>
    `;
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
}

function logout() {
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
    document.getElementById('loginForm').reset();
}

// Set current year
document.getElementById('adminYear').textContent = new Date().getFullYear();