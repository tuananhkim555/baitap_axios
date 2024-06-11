document.getElementById('employeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateForm()) {
        if (document.getElementById('employeeForm').dataset.mode === 'edit') {
            updateEmployee();
        } else {
            addEmployee();
        }
    }
});

document.getElementById('exportButton').addEventListener('click', function() {
    exportToExcel();
});

let employees = [];

function validateForm() {
    let isValid = true;

    // Validate employeeId
    const employeeId = document.getElementById('employeeId').value;
    const employeeIdError = document.getElementById('employeeIdError');
    if (!/^\d{4,6}$/.test(employeeId)) {
        employeeIdError.textContent = 'Mã nhân viên phải từ 4 đến 6 ký số';
        isValid = false;
    } else {
        employeeIdError.textContent = '';
    }

    // Validate employeeName
    const employeeName = document.getElementById('employeeName').value;
    const employeeNameError = document.getElementById('employeeNameError');
    if (!/^[\p{L} ]+$/u.test(employeeName)) { // Supports Unicode letters
        employeeNameError.textContent = 'Tên nhân viên phải là chữ cái (có dấu)';
        isValid = false;
    } else {
        employeeNameError.textContent = '';
    }

    // Validate basicSalary
    const basicSalary = document.getElementById('basicSalary').value;
    const basicSalaryError = document.getElementById('basicSalaryError');
    if (basicSalary < 1000000 || basicSalary > 20000000) {
        basicSalaryError.textContent = 'Lương cơ bản phải từ 1,000,000 đến 20,000,000';
        isValid = false;
    } else {
        basicSalaryError.textContent = '';
    }

    // Validate workingHours
    const workingHours = document.getElementById('workingHours').value;
    const workingHoursError = document.getElementById('workingHoursError');
    if (workingHours < 50 || workingHours > 150) {
        workingHoursError.textContent = 'Số giờ làm trong tháng phải từ 50 đến 150 giờ';
        isValid = false;
    } else {
        workingHoursError.textContent = '';
    }

    // Validate salaryMonth
    const salaryMonth = document.getElementById('salaryMonth').value;
    if (!salaryMonth) {
        isValid = false;
    }

    return isValid;
}

function addEmployee() {
    const employeeId = document.getElementById('employeeId').value;

    if (employees.some(employee => employee.id === employeeId)) {
        alert('Mã nhân viên đã tồn tại!');
        return;
    }

    const employeeName = document.getElementById('employeeName').value;
    const position = document.getElementById('position').value;
    const basicSalary = document.getElementById('basicSalary').value;
    const workingHours = document.getElementById('workingHours').value;
    const salaryMonth = document.getElementById('salaryMonth').value;

    const totalSalary = calculateTotalSalary(basicSalary, workingHours);
    const rating = rateEmployee(workingHours);

    const employee = {
        id: employeeId,
        name: employeeName,
        position: position,
        basicSalary: basicSalary,
        workingHours: workingHours,
        totalSalary: totalSalary,
        rating: rating,
        salaryMonth: salaryMonth
    };

    employees.push(employee);
    renderEmployeeTable();
    resetForm();
}

function renderEmployeeTable() {
    const employeeTable = document.getElementById('employeeTable');
    employeeTable.classList.remove('hidden');

    const tbody = employeeTable.querySelector('tbody');
    tbody.innerHTML = '';

    employees.forEach(employee => {
        const newRow = tbody.insertRow();

        newRow.insertCell(0).textContent = employee.id;
        newRow.insertCell(1).textContent = employee.name;
        newRow.insertCell(2).textContent = getPositionName(employee.position);
        newRow.insertCell(3).textContent = employee.basicSalary;
        newRow.insertCell(4).textContent = employee.totalSalary;
        newRow.insertCell(5).textContent = employee.workingHours;
        newRow.insertCell(6).textContent = employee.rating;
        newRow.insertCell(7).textContent = employee.salaryMonth;

        const actionCell = newRow.insertCell(8);

        const editButton = document.createElement('button');
        editButton.textContent = 'Chỉnh sửa';
        editButton.classList.add('edit-btn');
        editButton.onclick = function() {
            populateFormForEdit(employee);
        };
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Xóa';
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = function() {
            deleteEmployee(employee.id);
        };
        actionCell.appendChild(deleteButton);
    });
}

function deleteEmployee(employeeId) {
    employees = employees.filter(employee => employee.id !== employeeId);
    renderEmployeeTable();
    if (employees.length === 0) {
        document.getElementById('employeeTable').classList.add('hidden');
    }
}

function populateFormForEdit(employee) {
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('employeeName').value = employee.name;
    document.getElementById('position').value = employee.position;
    document.getElementById('basicSalary').value = employee.basicSalary;
    document.getElementById('workingHours').value = employee.workingHours;
    document.getElementById('salaryMonth').value = employee.salaryMonth;

    document.getElementById('employeeForm').dataset.mode = 'edit';
    document.getElementById('employeeId').disabled = true;
}

function updateEmployee() {
    const employeeId = document.getElementById('employeeId').value;
    const employeeName = document.getElementById('employeeName').value;
    const position = document.getElementById('position').value;
    const basicSalary = document.getElementById('basicSalary').value;
    const workingHours = document.getElementById('workingHours').value;
    const salaryMonth = document.getElementById('salaryMonth').value;

    const totalSalary = calculateTotalSalary(basicSalary, workingHours);
    const rating = rateEmployee(workingHours);

    const employeeIndex = employees.findIndex(employee => employee.id === employeeId);

    employees[employeeIndex] = {
        id: employeeId,
        name: employeeName,
        position: position,
        basicSalary: basicSalary,
        workingHours: workingHours,
        totalSalary: totalSalary,
        rating: rating,
        salaryMonth: salaryMonth
    };

    renderEmployeeTable();
    resetForm();
    document.getElementById('employeeForm').dataset.mode = '';
    document.getElementById('employeeId').disabled = false;
}

function resetForm() {
    document.getElementById('employeeForm').reset();
}

function calculateTotalSalary(basicSalary, workingHours) {
    return basicSalary * (workingHours / 100);
}

function rateEmployee(workingHours) {
    if (workingHours >= 140) {
        return 'Xuất sắc';
    } else if (workingHours >= 120) {
        return 'Giỏi';
    } else if (workingHours >= 100) {
        return 'Khá';
    } else if (workingHours >= 80) {
        return 'Trung bình';
    } else {
        return 'Yếu';
    }
}

function getPositionName(position) {
    switch (position) {
        case '1':
            return 'Nhân viên';
        case '2':
            return 'Quản lý';
        case '3':
            return 'Giám đốc';
        default:
            return '';
    }
}

function exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(employees);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees.xlsx");
}

