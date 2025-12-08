let students = [];

// =====================
// تحميل بيانات الطلاب عند بداية الموقع
// =====================
async function loadStudents() {
  try {
    const res = await fetch("students.json");
    const data = await res.json();
    students = data.map(s => ({
      ...s,
      total: s.arabic + s.english + s.science + s.social + s.math
    }));
  } catch(err) {
    console.error("فشل تحميل قاعدة البيانات:", err);
  }
}

// نبدأ بتحميل الطلاب فور فتح الصفحة
loadStudents();

// =====================
// تسجيل الدخول (index.html)
// =====================
async function login() {
  const seat = document.getElementById("seat").value.trim();
  const msg = document.getElementById("msg");

  if (!/^\d{3}$/.test(seat)) {
    msg.innerText = "رقم الجلوس يجب أن يكون مكون من 3 أرقام!";
    return;
  }

  // إذا الطلاب لم يتم تحميلهم بعد، نعيد تحميلهم
  if (!students.length) {
    await loadStudents();
  }

  const student = students.find(s => s.id == seat);

  if (!student) {
    msg.innerText = "رقم الجلوس غير صحيح! حاول مرة أخرى.";
    return;
  }

  localStorage.setItem("currentStudent", JSON.stringify(student));
  window.location.href = "students.html";
}

// =====================
// عرض البيانات حسب الصفحة
// =====================
window.onload = () => {
  const page = location.pathname.split("/").pop();

  // ---- صفحة الطالب ----
  if (page === "students.html") {
    const s = JSON.parse(localStorage.getItem("currentStudent"));

    if (!s) {
      alert("الرجاء تسجيل الدخول أولاً!");
      window.location.href = "index.html";
      return;
    }

    document.getElementById("name").innerText = `الاسم: ${s.name}`;
    document.getElementById("arabic").innerText = s.arabic;
    document.getElementById("english").innerText = s.english;
    document.getElementById("science").innerText = s.science;
    document.getElementById("social").innerText = s.social;
    document.getElementById("math").innerText = s.math;
    document.getElementById("total").innerText = s.total;
  }

  // ---- صفحة أفضل 10 طلاب ----
  if (page === "top10.html") {
    // إذا الطلاب لم يتم تحميلهم بعد، ننتظر ونحملهم
    if (!students.length) {
      setTimeout(() => window.location.reload(), 500);
      return;
    }

    const sorted = [...students]
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const tbody = document.getElementById("top10");
    sorted.forEach((s, i) => {
      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${s.name}</td>
          <td>${s.total}</td>
        </tr>
      `;
    });
  }
};
