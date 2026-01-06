const form = document.getElementById("registrationForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("firstName", firstName.value);
  formData.append("lastName", lastName.value);
  formData.append("email", email.value);
  formData.append("phone", phone.value);
  formData.append("region", region.value);
  formData.append("dob", dob.value);
  formData.append("address", address.value);
  formData.append("photo", photo.files[0]);

  const res = await fetch("/api/register", {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (res.ok) {
    alert("Member ID: " + data.memberId);
  } else {
    alert(data.message);
  }
});
