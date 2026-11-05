
// ======================================
// 1. STUDENT CLASS
// ======================================

class Student {
    constructor(id, name, grades, attendance) {
        this.id = Number(id);
        this.name = name;
        this.grades = grades.map(Number);
        this.attendance = Number(attendance);
    }

    calculateAverage() {
        let total = this.grades.reduce((sum, grade) => sum + grade, 0);
        return total / this.grades.length;
    }

    calculateGrade() {
        let average = this.calculateAverage();

        if (average >= 90) return "A";
        else if (average >= 80) return "B";
        else if (average >= 70) return "C";
        else if (average >= 60) return "D";
        else if (average >= 50) return "E";
        else return "F";
    }

    finalResult() {
        let average = this.calculateAverage();

        if (average >= 50 && this.attendance >= 75) {
            return "ناجح";
        } else {
            return "يحتاج مراجعة";
        }
    }
}


// ======================================
// 2. STUDENTS DATA
// ======================================

let studentsList = [
    new Student(1, "Nada", [80, 90, 85], 90),
    new Student(2, "Ali", [45, 40, 45], 80),
    new Student(3, "Sara", [60, 70, 65], 90),
    new Student(4, "Omar", [42, 45, 48], 70)
];


// ======================================
// 3. MERCY COMMITTEE
// ======================================

function getMercyStudents() {

    // Filter students with average 40-49
    let strugglingStudents = studentsList.filter(student => {
        let average = student.calculateAverage();

        return average >= 40 && average <= 49;
    });

    // Map: Add 5 mercy marks
    let mercyStudents = strugglingStudents.map(student => {
        return {
            id: student.id,
            name: student.name,
            originalAverage: student.calculateAverage(),
            newAverage: student.calculateAverage() + 5
        };
    });

    // Reduce: Sum new averages
    let totalMercy = mercyStudents.reduce((sum, student) => {
        return sum + student.newAverage;
    }, 0);

    // Protect against division by zero
    let mercyAverage = mercyStudents.length > 0
        ? totalMercy / mercyStudents.length
        : 0;

    return { strugglingStudents, mercyStudents, mercyAverage };
}


// ======================================
// 4. CLASS STATISTICS
// ======================================

function getClassStatistics() {

    let totalAverage = studentsList.reduce((sum, student) => {
        return sum + student.calculateAverage();
    }, 0);

    let classAverage = studentsList.length > 0
        ? totalAverage / studentsList.length
        : 0;

    let passed = studentsList.filter(student =>
        student.finalResult() === "ناجح"
    ).length;

    let review = studentsList.length - passed;

    return {
        total: studentsList.length,
        passed,
        review,
        classAverage
    };
}


// ======================================
// 5. ANIMATED COUNTERS
// ======================================

function animateCounter(element, target, decimals = 0) {

    let start = 0;
    let duration = 900;
    let startTime = null;

    function update(timestamp) {

        if (!startTime) startTime = timestamp;

        let progress = Math.min((timestamp - startTime) / duration, 1);

        let eased = 1 - Math.pow(1 - progress, 3);

        let current = start + (target - start) * eased;

        element.textContent = current.toFixed(decimals);

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}


// ======================================
// 6. DASHBOARD STATISTICS
// ======================================

function updateStatistics() {

    let stats = getClassStatistics();

    animateCounter(
        document.getElementById("totalStudents"),
        stats.total
    );

    animateCounter(
        document.getElementById("passedStudents"),
        stats.passed
    );

    animateCounter(
        document.getElementById("failedStudents"),
        stats.review
    );

    animateCounter(
        document.getElementById("classAverage"),
        stats.classAverage,
        2
    );

    let passedPercent = stats.total
        ? stats.passed / stats.total * 100
        : 0;

    let reviewPercent = stats.total
        ? stats.review / stats.total * 100
        : 0;

    setTimeout(() => {
        document.getElementById("passedLine").style.width =
            passedPercent + "%";

        document.getElementById("failedLine").style.width =
            reviewPercent + "%";

        document.getElementById("averageLine").style.width =
            stats.classAverage + "%";
    }, 100);
}


// ======================================
// 7. STUDENTS TABLE
// ======================================

let searchInput = document.getElementById("searchInput");
let statusFilter = document.getElementById("statusFilter");
let sortAscending = false;

function renderStudents() {

    let searchValue = searchInput.value.toLowerCase().trim();
    let filterValue = statusFilter.value;

    let filteredStudents = studentsList.filter(student => {

        let matchesSearch =
            student.name.toLowerCase().includes(searchValue) ||
            String(student.id).includes(searchValue);

        let average = student.calculateAverage();

        let matchesFilter = true;

        if (filterValue === "passed") {
            matchesFilter = student.finalResult() === "ناجح";
        }

        if (filterValue === "review") {
            matchesFilter = student.finalResult() === "يحتاج مراجعة";
        }

        if (filterValue === "struggling") {
            matchesFilter = average >= 40 && average <= 49;
        }

        return matchesSearch && matchesFilter;
    });

    filteredStudents.sort((a, b) => {
        return sortAscending
            ? a.calculateAverage() - b.calculateAverage()
            : b.calculateAverage() - a.calculateAverage();
    });

    let table = document.getElementById("studentsTable");

    if (filteredStudents.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No students found.
                </td>
            </tr>
        `;
    } else {

        table.innerHTML = filteredStudents.map(student => {

            let result = student.finalResult();
            let resultClass =
                result === "ناجح" ? "passed" : "failed";

            return `
                <tr>
                    <td>
                        <div class="student-cell">
                            <div class="student-avatar">
                                ${student.name.charAt(0).toUpperCase()}
                            </div>
                            ${student.name}
                        </div>
                    </td>

                    <td class="muted">#${student.id}</td>

                    <td>
                        <strong>
                            ${student.calculateAverage().toFixed(2)}
                        </strong>
                    </td>

                    <td>
                        <span class="grade-badge">
                            ${student.calculateGrade()}
                        </span>
                    </td>

                    <td>
                        <div class="attendance">
                            <div class="attendance-track">
                                <span style="width:${student.attendance}%"></span>
                            </div>
                            ${student.attendance}%
                        </div>
                    </td>

                    <td>
                        <span class="result-badge ${resultClass}">
                            ${result}
                        </span>
                    </td>
                </tr>
            `;

        }).join("");
    }

    document.getElementById("showingCount").textContent =
        `Showing ${filteredStudents.length} of ${studentsList.length} students`;
}


// ======================================
// 8. MERCY TABLE
// ======================================

function renderMercy() {

    let { mercyStudents, mercyAverage } = getMercyStudents();

    let table = document.getElementById("mercyTable");

    if (mercyStudents.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="4" class="empty-state">
                    No struggling students found.
                </td>
            </tr>
        `;

    } else {

        table.innerHTML = mercyStudents.map(student => {

            return `
                <tr>
                    <td>
                        <div class="student-cell">
                            <div class="student-avatar">
                                ${student.name.charAt(0)}
                            </div>
                            ${student.name}
                        </div>
                    </td>

                    <td>${student.originalAverage.toFixed(2)}</td>

                    <td>
                        <strong>
                            ${student.newAverage.toFixed(2)}
                        </strong>
                    </td>

                    <td>
                        <span class="result-badge passed">
                            +5 Marks
                        </span>
                    </td>
                </tr>
            `;

        }).join("");
    }

    document.getElementById("mercyAverage").textContent =
        mercyAverage.toFixed(2);

    document.getElementById("mercyCount").textContent =
        `${mercyStudents.length} students supported`;
}


// ======================================
// 9. CHARTS
// ======================================

let performanceChart;
let gradeChart;

function renderCharts() {

    let subjects = ["Subject 1", "Subject 2", "Subject 3"];

    let subjectAverages = subjects.map((subject, index) => {

        let total = studentsList.reduce((sum, student) => {
            return sum + student.grades[index];
        }, 0);

        return studentsList.length
            ? total / studentsList.length
            : 0;
    });

    let gradeLabels = ["A", "B", "C", "D", "E", "F"];

    let gradeCounts = gradeLabels.map(grade => {
        return studentsList.filter(student =>
            student.calculateGrade() === grade
        ).length;
    });

    if (performanceChart) performanceChart.destroy();
    if (gradeChart) gradeChart.destroy();

    performanceChart = new Chart(
        document.getElementById("performanceChart"),
        {
            type: "bar",

            data: {
                labels: subjects,

                datasets: [{
                    label: "Average Score",
                    data: subjectAverages,
                    backgroundColor: ["#247b68", "#80b4a1", "#c1a66b"],
                    borderRadius: 6,
                    maxBarThickness: 48
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                animation: {
                    duration: 1000,
                    easing: "easeOutQuart"
                },

                plugins: {
                    legend: { display: false }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: { color: "#edf0f1" }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        }
    );

    let chartColors = [
        "#247b68", "#83b5a2", "#d3b66f",
        "#7593a3", "#d9a06b", "#c5cdd0"
    ];

    gradeChart = new Chart(
        document.getElementById("gradeChart"),
        {
            type: "doughnut",

            data: {
                labels: gradeLabels,

                datasets: [{
                    data: gradeCounts,
                    backgroundColor: chartColors,
                    borderWidth: 3,
                    borderColor: getComputedStyle(document.body)
                        .getPropertyValue("--surface").trim() || "#fff",
                    hoverOffset: 8
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "72%",

                animation: {
                    animateRotate: true,
                    duration: 1100
                },

                plugins: {
                    legend: { display: false }
                }
            }
        }
    );

    document.getElementById("gradeLegend").innerHTML =
        gradeLabels.map((grade, index) => `
            <span class="legend-item">
                <i class="legend-dot"
                   style="background:${chartColors[index]}"></i>
                ${grade}: ${gradeCounts[index]}
            </span>
        `).join("");
}


// ======================================
// 10. ADD STUDENT
// ======================================

let modal = document.getElementById("studentModal");

document.getElementById("addStudentBtn").addEventListener("click", () => {
    modal.classList.add("show");
});

document.getElementById("closeModal").addEventListener("click", () => {
    modal.classList.remove("show");
});

modal.addEventListener("click", event => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});

document.getElementById("studentForm").addEventListener("submit", event => {

    event.preventDefault();

    let id = Number(document.getElementById("newId").value);
    let name = document.getElementById("newName").value.trim();

    let grades = [
        Number(document.getElementById("grade1").value),
        Number(document.getElementById("grade2").value),
        Number(document.getElementById("grade3").value)
    ];

    let attendance = Number(
        document.getElementById("newAttendance").value
    );

    if (studentsList.some(student => student.id === id)) {
        showToast("This student ID already exists.");
        return;
    }

    if (!name || grades.some(grade => grade < 0 || grade > 100)
        || attendance < 0 || attendance > 100) {
        showToast("Please enter valid student data.");
        return;
    }

    let newStudent = new Student(id, name, grades, attendance);

    studentsList.push(newStudent);

    document.getElementById("studentForm").reset();
    modal.classList.remove("show");

    refreshDashboard();

    showToast("Student added successfully!");
});


// ======================================
// 11. SEARCH / FILTER / SORT
// ======================================

searchInput.addEventListener("input", renderStudents);

statusFilter.addEventListener("change", renderStudents);

document.getElementById("sortBtn").addEventListener("click", () => {

    sortAscending = !sortAscending;

    document.getElementById("sortBtn").textContent =
        sortAscending
            ? "↑ Lowest Average"
            : "↓ Highest Average";

    renderStudents();
});

document.getElementById("resetBtn").addEventListener("click", () => {

    searchInput.value = "";
    statusFilter.value = "all";
    sortAscending = false;

    document.getElementById("sortBtn").textContent =
        "↕ Sort by Average";

    renderStudents();

    showToast("Filters have been reset.");
});


// ======================================
// 12. EXPORT CSV
// ======================================

document.getElementById("exportBtn").addEventListener("click", () => {

    let headers = [
        "ID", "Name", "Subject 1", "Subject 2", "Subject 3",
        "Average", "Grade", "Attendance", "Result"
    ];

    let rows = studentsList.map(student => [
        student.id,
        student.name,
        ...student.grades,
        student.calculateAverage().toFixed(2),
        student.calculateGrade(),
        student.attendance,
        student.finalResult()
    ]);

    let csv = [headers, ...rows]
        .map(row => row.map(value =>
            `"${String(value).replace(/"/g, '""')}"`
        ).join(","))
        .join("\n");

    let blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    let url = URL.createObjectURL(blob);
    let link = document.createElement("a");

    link.href = url;
    link.download = "Student-Report.csv";
    link.click();

    URL.revokeObjectURL(url);

    showToast("Report exported successfully!");
});


// ======================================
// 13. DARK MODE
// ======================================

document.getElementById("themeToggle").addEventListener("click", () => {

    document.body.classList.toggle("dark");

    showToast(
        document.body.classList.contains("dark")
            ? "Dark mode enabled"
            : "Light mode enabled"
    );
});


// ======================================
// 14. MOBILE SIDEBAR
// ======================================

document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
});

document.querySelectorAll(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

        document.querySelectorAll(".nav-link").forEach(item =>
            item.classList.remove("active")
        );

        link.classList.add("active");

        document.getElementById("sidebar").classList.remove("open");
    });
});


// ======================================
// 15. NOTIFICATION
// ======================================

function showToast(message) {

    let toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.toastTimeout);

    window.toastTimeout = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


// ======================================
// 16. REFRESH DASHBOARD
// ======================================

function refreshDashboard() {

    updateStatistics();
    renderStudents();
    renderMercy();
    renderCharts();

}


// ======================================
// 17. CONSOLE REPORT
// ======================================

function printConsoleReport() {

    console.log("===== STUDENT MANAGEMENT SYSTEM =====");

    studentsList.forEach(student => {

        console.log({
            ID: student.id,
            Name: student.name,
            Average: student.calculateAverage(),
            Grade: student.calculateGrade(),
            Attendance: student.attendance,
            Result: student.finalResult()
        });

    });

    let mercy = getMercyStudents();

    console.log("===== MERCY COMMITTEE =====");
    console.log("Struggling Students:", mercy.mercyStudents);
    console.log("Mercy Average:", mercy.mercyAverage);

}


// ======================================
// 18. INITIALIZE
// ======================================

document.getElementById("today").textContent =
    new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date());

refreshDashboard();
printConsoleReport();
