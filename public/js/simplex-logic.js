// public/js/simplex-logic.js

document.addEventListener('DOMContentLoaded', () => {
    const rawData = localStorage.getItem('dualSimplexModel');
    if (!rawData) {
        document.getElementById('solve-status').innerText = "NO DATA FOUND";
        document.getElementById('res-z').innerText = "ERROR";
        return;
    }

    const modelObj = JSON.parse(rawData);
    
    const cDisplay = document.getElementById('model-constraints-display');
    const objStr = modelObj.employees.map((e, idx) => `${e.rate}x${idx+1}`).join(' + ');
    let eqHTML = `<div style="color:var(--accent-cyan); font-weight:bold; margin-bottom:10px;">Objective Equation:</div><div>Min Z = ${objStr}</div><div style="margin-top:15px; margin-bottom:10px; color:var(--accent-cyan); font-weight:bold;">Constraints Bound:</div>`;
    
    modelObj.constraints.forEach((c, idx) => {
        const cStr = c.coeffs.map((coeff, jdx) => `${coeff}x${jdx+1}`).join(' + ');
        eqHTML += `<div style="margin-bottom:5px;">C${idx+1}: [ ${cStr} ] ${c.ineq} ${c.rhs}</div>`;
    });
    cDisplay.innerHTML = eqHTML;

    // --- 1. BUILD N-DIMENSIONAL SOLVER MODEL ---
    const lpModel = {
        optimize: "cost",
        opType: "min",
        constraints: {},
        variables: {}
    };

    modelObj.constraints.forEach((c, i) => {
        let limits = {};
        if (c.ineq === ">=") { limits.min = c.rhs; }
        else if (c.ineq === "<=") { limits.max = c.rhs; }
        else if (c.ineq === "=") { limits.equal = c.rhs; }
        lpModel.constraints[`C${i}`] = limits;
    });

    modelObj.employees.forEach((emp, i) => {
        let vName = `x${i+1}`;
        let vObj = { cost: emp.rate };
        
        modelObj.constraints.forEach((c, cIdx) => {
            vObj[`C${cIdx}`] = c.coeffs[i];
        });

        lpModel.variables[vName] = vObj;
    });

    // --- 2. EXECUTE SOLVER ---
    try {
        const results = solver.Solve(lpModel);
        
        const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
        
        if (results.feasible === false || results.result === undefined || isNaN(results.result)) {
            document.getElementById('solve-status').innerText = "PRIMAL INFEASIBLE";
            document.getElementById('solve-status').style.color = "var(--accent-pink)";
            document.getElementById('res-z').innerText = "INFEASIBLE";
            document.getElementById('optimal-shifts-list').innerHTML = `
                <div style="color:var(--accent-pink);">No logical combination of constraints exists to satisfy the geometry. Check if your requirements are contradictory.</div>
            `;
            
            // Still show Tableau for diagnosis
            if (modelObj.employees.length > 2) {
                document.getElementById('vis-n-tableau').style.display = 'block';
                document.getElementById('vis-title').innerText = `Matrix N-Dimensional Diagnosis`;
                document.getElementById('n-tableau-content').innerHTML = `<div style="color:var(--accent-pink);">ERROR: Simplex branch failed. Bounded feasible region not found. Matrix cannot be solved.</div>`;
            }
            return;
        }

        document.getElementById('solve-status').innerText = "OPTIMUM REACHED";
        document.getElementById('solve-status').style.color = "var(--accent-green)";

        // Recalculate Z based on rounded integers since we dropped IP
        let calculatedZ = 0;
        const shiftList = document.getElementById('optimal-shifts-list');
        let shiftHTML = "";
        
        modelObj.employees.forEach((emp, i) => {
            const val = Math.round(results[`x${i+1}`] || 0); // Round manually to prevent hanging
            calculatedZ += (val * emp.rate);
            shiftHTML += `
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:5px;">
                    <span>x<sub style="font-size:0.75rem">${i+1}</sub> (${emp.name})</span>
                    <span style="font-weight:bold; color:var(--accent-cyan);">${val} Shifts</span>
                </div>
            `;
        });
        shiftList.innerHTML = shiftHTML;

        const finalZ = calculatedZ + modelObj.baseCost;
        document.getElementById('res-z').innerText = inr.format(finalZ);

        // --- 3. GRAPHING BRANCH ---
        if (modelObj.employees.length === 2) {
            document.getElementById('vis-2d-graph').style.display = 'block';
            document.getElementById('vis-title').innerText = "2D Feasible Region Intersection";
            calculateAndRender2D(modelObj, results);
        } else {
            document.getElementById('vis-n-tableau').style.display = 'block';
            document.getElementById('vis-title').innerText = `Matrix N-Dimensional Space (${modelObj.employees.length}D)`;
            
            let tableauHTMLStr = `
                <div style="color:#00c9ff; margin-bottom: 15px;">Model solved natively across ${modelObj.employees.length} distinct intersecting planes using Dual Simplex mapping.</div>
                <div style="border-top: 1px dashed rgba(255,255,255,0.3); padding-top:15px;">Raw Math Trace Output:</div><br/>
                <div style="padding:10px; background:rgba(0,0,0,0.3); border-left:3px solid var(--accent-orange); margin-bottom:15px;">Optimal Extraction Z: ${calculatedZ.toFixed(2)}</div>
            `;
            
            tableauHTMLStr += `<table style="width:100%; border-collapse: collapse; text-align:left;">`;
            tableauHTMLStr += `<tr style="border-bottom:1px solid rgba(255,255,255,0.2);"><th style="padding:5px;">Variable Matrix State</th><th style="padding:5px;">Raw Convergence</th><th style="padding:5px;">Integer Bound</th></tr>`;
            
            modelObj.employees.forEach((emp, i) => {
                const rawV = (results[`x${i+1}`] || 0).toFixed(4);
                const intV = Math.round(results[`x${i+1}`] || 0);
                tableauHTMLStr += `<tr style="border-bottom:1px solid rgba(255,255,255,0.05);"><td style="padding:8px; color:var(--accent-purple);">Basic [x${i+1}]</td><td style="padding:8px;">${rawV}</td><td style="padding:8px; font-weight:bold; color:var(--accent-cyan);">${intV}</td></tr>`;
            });
            tableauHTMLStr += `</table>`;

            document.getElementById('n-tableau-content').innerHTML = tableauHTMLStr;
        }

    } catch (e) {
        document.getElementById('solve-status').innerText = "MATH ENGINE ERROR";
        document.getElementById('res-z').innerText = "ERROR";
        console.error("Solver exception: ", e);
    }
});


function calculateAndRender2D(modelObj, solverResults) {
    const allConstraints = [...modelObj.constraints, 
        {name: "X1 bound", coeffs: [1, 0], ineq: ">=", rhs: 0},
        {name: "X2 bound", coeffs: [0, 1], ineq: ">=", rhs: 0}
    ];

    let intersections = [];
    for(let i = 0; i < allConstraints.length; i++) {
        for(let j = i + 1; j < allConstraints.length; j++) {
            const c1 = allConstraints[i];
            const c2 = allConstraints[j];
            
            const ax = c1.coeffs[0], ay = c1.coeffs[1], arhs = c1.rhs;
            const bx = c2.coeffs[0], by = c2.coeffs[1], brhs = c2.rhs;

            const d = (ax * by) - (ay * bx);
            if (Math.abs(d) > 0.0001) { 
                const dx = (arhs * by) - (ay * brhs);
                const dy = (ax * brhs) - (arhs * bx);
                intersections.push({x: parseFloat((dx/d).toFixed(4)), y: parseFloat((dy/d).toFixed(4))});
            }
        }
    }

    let feasiblePoints = [];
    intersections.forEach(pt => {
        let isFeasible = true;
        for(let c of allConstraints) {
            const val = (c.coeffs[0] * pt.x) + (c.coeffs[1] * pt.y);
            if (c.ineq === ">=" && val < c.rhs - 0.001) isFeasible = false;
            if (c.ineq === "<=" && val > c.rhs + 0.001) isFeasible = false;
            if (c.ineq === "=" && Math.abs(val - c.rhs) > 0.001) isFeasible = false;
        }
        if (isFeasible) {
            const exists = feasiblePoints.some(p => Math.abs(p.x - pt.x) < 0.01 && Math.abs(p.y - pt.y) < 0.01);
            if (!exists) feasiblePoints.push(pt);
        }
    });

    const optimalPoint = {
        x: Math.round(solverResults.x1 || 0),
        y: Math.round(solverResults.x2 || 0)
    };

    renderChartGraph(modelObj, feasiblePoints, optimalPoint);
}


function renderChartGraph(modelObj, feasiblePoints, optimalPoint) {
    const ctx = document.getElementById('lpGraph');
    if(!ctx) return;

    let maxX = 10, maxY = 10;
    if (feasiblePoints.length > 0) {
        maxX = Math.max(...feasiblePoints.map(p => p.x)) * 1.5;
        maxY = Math.max(...feasiblePoints.map(p => p.y)) * 1.5;
        if(maxX < 5) maxX = 10;
        if(maxY < 5) maxY = 10;
    }

    const datasets = [];
    const colors = ['#ff7e5f', '#00c9ff', '#9d50bb', '#ff0844', '#f12711', '#11998e'];
    
    // Draw lines
    modelObj.constraints.forEach((c, i) => {
        let ax = c.coeffs[0], ay = c.coeffs[1], rhs = c.rhs;
        let lineData = [];
        
        if (ay !== 0 && ax !== 0) {
            lineData.push({ x: 0, y: rhs / ay });
            lineData.push({ x: maxX, y: (rhs - ax * maxX) / ay });
        } else if (ay === 0) {
            lineData.push({ x: rhs / ax, y: 0 });
            lineData.push({ x: rhs / ax, y: maxY });
        } else if (ax === 0) {
            lineData.push({ x: 0, y: rhs / ay });
            lineData.push({ x: maxX, y: rhs / ay });
        }

        datasets.push({
            label: `C${i+1}`,
            data: lineData,
            borderColor: colors[i % colors.length],
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0
        });
    });

    if (feasiblePoints.length > 2) {
        const cx = feasiblePoints.reduce((sum, p) => sum + p.x, 0) / feasiblePoints.length;
        const cy = feasiblePoints.reduce((sum, p) => sum + p.y, 0) / feasiblePoints.length;
        
        let sortedPoints = [...feasiblePoints].sort((a, b) => {
            return Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx);
        });
        sortedPoints.push(sortedPoints[0]);

        datasets.push({
            label: 'Feasible Geometry',
            data: sortedPoints,
            backgroundColor: 'rgba(0, 242, 254, 0.4)',
            borderColor: 'var(--accent-cyan)',
            borderWidth: 1,
            pointRadius: 3,
            fill: true,
            type: 'line',
            order: 2
        });
    }

    if (optimalPoint) {
        datasets.push({
            label: 'Optimal Solution Point',
            data: [{ x: optimalPoint.x, y: optimalPoint.y }],
            backgroundColor: '#ff0844',
            borderColor: 'white',
            pointRadius: 10,
            pointBorderWidth: 3,
            type: 'scatter',
            order: 1
        });
    }

    Chart.defaults.color = "#222222";
    Chart.defaults.font.family = "Nunito, sans-serif";

    new Chart(ctx, {
        type: 'scatter',
        data: { datasets: datasets },
        options: {
            responsive: true,
            animation: { duration: 1500, easing: 'easeOutBounce' },
            scales: {
                x: { 
                    type: 'linear', position: 'bottom', min: 0, max: maxX, 
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#222222', font: { weight: 'bold' } },
                    title: { display: true, text: `${modelObj.employees[0].name} (x₁) Shifts`, color: '#222222', font: { weight: 'bold', size: 14 } }
                },
                y: { 
                    min: 0, max: maxY, 
                    grid: { color: 'rgba(0, 0, 0, 0.1)' },
                    ticks: { color: '#222222', font: { weight: 'bold' } },
                    title: { display: true, text: `${modelObj.employees[1].name} (x₂) Shifts`, color: '#222222', font: { weight: 'bold', size: 14 } }
                }
            },
            plugins: {
                legend: { position: 'bottom', labels: { color: "#222222", font: { weight: 'bold', size: 13 } } }
            }
        }
    });
}
