// public/js/cost-calculator.js
document.addEventListener('DOMContentLoaded', () => {
    const simulateForm = document.getElementById('simulate-form');
    if (!simulateForm) return;

    // DOM Attachments
    const empContainer = document.getElementById('employees-list');
    const conContainer = document.getElementById('constraints-list');
    const sideVarsList = document.getElementById('side-vars-list');
    const liveObj = document.getElementById('live-obj');
    const totalCostEl = document.getElementById('total-cost');
    const baseCostInput = document.getElementById('base-flight-cost');
    const vCount = document.getElementById('v-count');
    const cCount = document.getElementById('c-count');

    const btnAddEmp = document.getElementById('btn-add-emp');
    const btnRemEmp = document.getElementById('btn-rem-emp');
    const btnAddCon = document.getElementById('btn-add-constraint');
    const btnRemCon = document.getElementById('btn-rem-constraint');

    // State Variables
    let employees = [
        {name: "Ravi", rate: 3000},
        {name: "Priya", rate: 5000}
    ];

    let constraints = [
        {name: "Min Shifts Target", coeffs: [2, 1], ineq: ">=", rhs: 6},
        {name: "Combination Logic", coeffs: [1, 2], ineq: ">=", rhs: 5}
    ];

    // Rendering Engine
    function render() {
        // Enforce Bounds
        if(employees.length > 10) employees.length = 10;
        if(constraints.length > 9) constraints.length = 9;
        
        vCount.innerText = employees.length;
        cCount.innerText = constraints.length;

        // 1. Render Employees
        empContainer.innerHTML = '';
        employees.forEach((emp, i) => {
            const num = i + 1;
            const div = document.createElement('div');
            div.className = 'emp-row';
            div.innerHTML = `
                <div style="flex:1;">
                    <label>Variable Name (x${num})</label>
                    <input type="text" class="e-name" data-idx="${i}" value="${emp.name}" placeholder="e.g. Pilot Type ${num}">
                </div>
                <div style="flex:1;">
                    <label>Cost Unit Objective</label>
                    <input type="number" class="e-rate" data-idx="${i}" value="${emp.rate}" step="100">
                </div>
            `;
            empContainer.appendChild(div);
        });

        // 2. Render Constraints
        conContainer.innerHTML = '';
        constraints.forEach((c, cIdx) => {
            // Re-pad constraint coeffs if employee length changed
            while (c.coeffs.length < employees.length) c.coeffs.push(1); // Set to 1 so they contribute mathematically.
            c.coeffs = c.coeffs.slice(0, employees.length);

            const div = document.createElement('div');
            div.className = 'eq-row';
            
            let rowHTML = `<input type="text" style="width:140px;" class="c-name" data-cidx="${cIdx}" value="${c.name}"> <span style="margin:0 10px;">|</span> `;
            
            employees.forEach((emp, eIdx) => {
                rowHTML += `
                    <input type="number" class="c-val c-box" data-cidx="${cIdx}" data-eidx="${eIdx}" step="0.1" value="${c.coeffs[eIdx]}">
                    <span style="font-family:var(--font-mono); color:var(--accent-cyan); font-weight:bold;">x<sub style="font-size:0.7em">${eIdx+1}</sub></span> 
                    ${eIdx < employees.length - 1 ? '<span style="margin:0 10px;">+</span>' : ''}
                `;
            });

            rowHTML += `
                <select class="c-ineq" data-cidx="${cIdx}" style="padding:10px; border-radius:8px; margin-left:15px; border-color:var(--accent-purple);">
                    <option value=">=" ${c.ineq === '>=' ? 'selected' : ''}>≥</option>
                    <option value="<=" ${c.ineq === '<=' ? 'selected' : ''}>≤</option>
                    <option value="=" ${c.ineq === '=' ? 'selected' : ''}>=</option>
                </select>
                <input type="number" class="c-rhs c-box" data-cidx="${cIdx}" value="${c.rhs}" style="margin-left:15px;" step="0.1">
            `;

            div.innerHTML = rowHTML;
            conContainer.appendChild(div);
        });

        bindInputs();
        updateCosts();
    }

    // Input Listeners Re-binding
    function bindInputs() {
        // Employees Input
        document.querySelectorAll('.e-name').forEach(el => {
            el.addEventListener('input', (e) => {
                employees[e.target.dataset.idx].name = e.target.value;
                updateCosts();
            });
        });
        document.querySelectorAll('.e-rate').forEach(el => {
            el.addEventListener('input', (e) => {
                employees[e.target.dataset.idx].rate = parseFloat(e.target.value) || 0;
                updateCosts();
            });
        });

        // Constraint Inputs
        document.querySelectorAll('.c-name').forEach(el => {
            el.addEventListener('input', (e) => { constraints[e.target.dataset.cidx].name = e.target.value; });
        });
        document.querySelectorAll('.c-val').forEach(el => {
            el.addEventListener('input', (e) => { constraints[e.target.dataset.cidx].coeffs[e.target.dataset.eidx] = parseFloat(e.target.value) || 0; });
        });
        document.querySelectorAll('.c-ineq').forEach(el => {
            el.addEventListener('change', (e) => { constraints[e.target.dataset.cidx].ineq = e.target.value; });
        });
        document.querySelectorAll('.c-rhs').forEach(el => {
            el.addEventListener('input', (e) => { constraints[e.target.dataset.cidx].rhs = parseFloat(e.target.value) || 0; });
        });

        // Base Cost
        baseCostInput.removeEventListener('input', updateCosts);
        baseCostInput.addEventListener('input', updateCosts);
    }

    function updateCosts() {
        const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
        const baseCost = parseFloat(baseCostInput.value) || 0;
        
        totalCostEl.textContent = inr.format(baseCost);
        
        // Build Objective Text
        let objArr = employees.map((emp, i) => `${emp.rate || 0}x${i+1}`);
        liveObj.innerText = `Min Z = ${objArr.join(' + ')}`;

        // Build Side Variables
        sideVarsList.innerHTML = employees.map((emp, i) => {
            return `<div style="margin-bottom:5px;">x<sub style="font-size:0.7em">${i+1}</sub> = <b>${emp.name}</b> <span style="opacity:0.6;">(${inr.format(emp.rate)}/u)</span></div>`;
        }).join('');
    }

    // Buttons
    btnAddEmp.addEventListener('click', () => {
        if (employees.length < 10) {
            employees.push({name: `New Variable ${employees.length + 1}`, rate: 1000});
            render();
        } else {
            alert("Maximum 10 variables mapped to Dual Simplex limits.");
        }
    });

    btnRemEmp.addEventListener('click', () => {
        if (employees.length > 2) {
            employees.pop();
            render();
        } else {
            alert("Minimum 2 variables required for simplex geometry.");
        }
    });

    btnAddCon.addEventListener('click', () => {
        if (constraints.length < 9) {
            const arr = Array.from({length: employees.length}, () => Math.floor(Math.random() * 5) + 1);
            const ineqs = ['<=', '>=', '='];
            const rIneq = ineqs[Math.floor(Math.random() * ineqs.length)];
            const rRhs = Math.floor(Math.random() * 20) + 5;
            constraints.push({name: `Constraint ${constraints.length + 1}`, coeffs: arr, ineq: rIneq, rhs: rRhs});
            render();
        } else {
            alert("Maximum 9 constraints reached.");
        }
    });

    btnRemCon.addEventListener('click', () => {
        if(constraints.length > 0) {
            constraints.pop();
            render();
        }
    });

    // Form submission intercept
    simulateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('solve-btn');
        const loader = document.getElementById('loading-display');
        if (btn) btn.style.display = 'none';
        if (loader) loader.style.display = 'block';

        const modelData = {
            baseCost: parseFloat(baseCostInput.value) || 0,
            employees: employees,
            constraints: constraints
        };
        localStorage.setItem('dualSimplexModel', JSON.stringify(modelData));

        setTimeout(() => window.location.href = '/results', 1200);
    });

    render();
});
