document.addEventListener('DOMContentLoaded', () => {
    "use strict";
    const API_URL = 'http://127.0.0.1:8000/api';

    // --- ADMIN LOGIN LOGIC ---
    const loginBtn = document.getElementById('loginBtn');
    const adminLogin = document.getElementById('adminLogin');
    const adminContent = document.getElementById('adminContent');
    const adminPass = document.getElementById('adminPass');

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (adminPass.value === '1234') { // Your Password
                adminLogin.style.display = 'none';
                adminContent.style.display = 'flex'; 
                if (typeof window.loadAdmin === 'function') {
                    window.loadAdmin();
                }
            } else {
                alert("Unauthorized Access!");
            }
        });

        adminPass.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') loginBtn.click();
        });
    }

    // --- 0. THE PRINT ENGINE ---
    window.printTicket = (phone, from, to, date, seats) => {
        const ticketWindow = window.open('', '_blank', 'width=850,height=600');
        const ticketNo = "TL-" + Math.floor(100000 + Math.random() * 900000);
        ticketWindow.document.write(`
            <html>
            <head>
                <title>Boarding Pass - ${to}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Inter:wght@400;800&display=swap');
                    body { font-family: 'Inter', sans-serif; background: #e0e0e0; padding: 50px; }
                    .ticket-card { background: white; width: 800px; margin: auto; border-radius: 20px; display: flex; box-shadow: 0 15px 50px rgba(0,0,0,0.2); position: relative; background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png'); }
                    .ticket-main { padding: 40px; flex: 2.5; border-right: 3px dashed #ccc; }
                    .ticket-stub { padding: 40px; flex: 1; background: #f9fafb; border-radius: 0 20px 20px 0; text-align: center; display: flex; flex-direction: column; justify-content: space-between; }
                    .brand { font-weight: 800; font-size: 1.8rem; color: #0066cc; margin-bottom: 30px; }
                    .brand span { color: #00d2ff; }
                    .destination-banner { background: #1a1c23; color: white; padding: 15px 25px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                    .city-name { font-size: 1.5rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                    .info-item label { display: block; font-size: 10px; color: #888; text-transform: uppercase; font-weight: 700; margin-bottom: 5px; }
                    .info-item p { font-size: 15px; font-weight: 700; margin: 0; color: #333; }
                    .seat-box { border: 2px solid #0066cc; padding: 15px; border-radius: 10px; margin-top: 20px; text-align: center; }
                    .seat-box h2 { margin: 0; color: #0066cc; font-size: 2rem; font-family: 'Space Mono', monospace; }
                    .qr-section img { width: 120px; height: 120px; margin-bottom: 10px; }
                    .cut-top, .cut-bottom { position: absolute; right: 27.5%; width: 30px; height: 30px; background: #e0e0e0; border-radius: 50%; z-index: 10; }
                    .cut-top { top: -15px; } .cut-bottom { bottom: -15px; }
                    @media print { body { background: white; padding: 0; } .ticket-card { box-shadow: none; border: 1px solid #000; } .cut-top, .cut-bottom { display: none; } }
                </style>
            </head>
            <body onload="window.print()">
                <div class="ticket-card">
                    <div class="cut-top"></div><div class="cut-bottom"></div>
                    <div class="ticket-main">
                        <div class="brand">TRAVEL<span>LINK</span></div>
                        <div class="destination-banner"><div class="city-name">${from}</div><i class="fas fa-bus"></i><div class="city-name">${to}</div></div>
                        <div class="info-grid">
                            <div class="info-item"><label>Contact</label><p>${phone}</p></div>
                            <div class="info-item"><label>Travel Date</label><p>${date}</p></div>
                            <div class="info-item"><label>Time</label><p>08:00 AM</p></div>
                            <div class="info-item"><label>Status</label><p style="color:green">CONFIRMED</p></div>
                        </div>
                    </div>
                    <div class="ticket-stub">
                        <div><label>Seat</label><div class="seat-box"><h2>${seats}</h2></div></div>
                        <div class="qr-section"><img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=PASS-${ticketNo}"><p>${ticketNo}</p></div>
                    </div>
                </div>
            </body>
            </html>
        `);
        ticketWindow.document.close();
    };

    // --- 1. USER: LOAD ROUTES ---
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    if (fromSelect && toSelect) {
        (async function loadRoutes() {
            try {
                const res = await fetch(`${API_URL}/get-routes`);
                const data = await res.json();
                fromSelect.innerHTML = '<option value="">Departure</option>';
                toSelect.innerHTML = '<option value="">Destination</option>';
                data.from.forEach(t => fromSelect.innerHTML += `<option value="${t}">${t}</option>`);
                data.to.forEach(t => toSelect.innerHTML += `<option value="${t}">${t}</option>`);
            } catch (e) { console.error("Routes error"); }
        })();
    }

    // --- 2. USER: SEAT SELECTION ---
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const date = document.getElementById('date').value;
            if (!from || !to || !date) return alert("Fill all fields.");

            document.getElementById('step1').style.display = 'none';
            document.getElementById('seatSection').style.display = 'block';
            
            // Render Layout
            const grid = document.getElementById('busGrid');
            grid.innerHTML = ''; 
            for (let i = 1; i <= 40; i++) {
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.setAttribute('data-seat', i); 
                seat.innerHTML = `<i class="fas fa-chair"></i><br>${i}`;
                seat.addEventListener('click', function() {
                    if (!this.classList.contains('booked')) this.classList.toggle('selected');
                });
                grid.appendChild(seat);
            }

            // Fetch Booked
            try {
                const res = await fetch(`${API_URL}/booked-seats?from=${from}&to=${to}&date=${date}`);
                const booked = await res.json(); 
                document.querySelectorAll('.seat').forEach(seat => {
                    const num = seat.getAttribute('data-seat');
                    if (booked.includes(num) || booked.includes(parseInt(num))) {
                        seat.classList.add('booked');
                        seat.innerHTML = `<i class="fas fa-ban"></i><br>${num}`;
                    }
                });
            } catch (err) { }
        });
    }

    // --- 3. USER: PAYMENT ---
    const confirmBtn = document.getElementById('confirmSeatsBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            const selected = document.querySelectorAll('.seat.selected');
            const total = (parseInt(document.getElementById('adults').value) || 0) + (parseInt(document.getElementById('kids').value) || 0);
            if (selected.length !== total) return alert(`Select ${total} seats.`);
            document.getElementById('seatSection').style.display = 'none';
            document.getElementById('paymentSection').style.display = 'block';
        });
    }

    const payBtn = document.getElementById('payBtn');
    if (payBtn) {
        payBtn.addEventListener('click', async () => {
            const phone = document.getElementById('phoneInput').value;
            const selectedSeats = Array.from(document.querySelectorAll('.seat.selected')).map(s => s.getAttribute('data-seat'));
            const from = document.getElementById('from').value;
            const to = document.getElementById('to').value;
            const date = document.getElementById('date').value;

            const res = await fetch(`${API_URL}/process-booking`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ from, to, date, phone, seats: selectedSeats, status: "paid" })
            });

            if (res.ok) {
                document.getElementById('paymentSection').style.display = 'none';
                document.getElementById('otpSection').style.display = 'block';
                document.getElementById('ticketDetails').innerHTML = `Seats: ${selectedSeats.join(', ')}`;
                document.getElementById('printUserTicket').onclick = () => window.printTicket(phone, from, to, date, selectedSeats.join(', '));
            }
        });
    }

    // --- 4. ADMIN: DASHBOARD (GLOBAL) ---
    const adminTable = document.getElementById('adminTableBody');
    if (adminTable) {
        window.loadAdmin = async () => {
            try {
                const res = await fetch(`${API_URL}/all-bookings`);
                const data = await res.json();
                adminTable.innerHTML = '';
                let totalS = 0;
                data.forEach(b => {
                    const s = b.seats || [];
                    totalS += s.length;
                    const bId = b._id?.$oid || b._id;
                    adminTable.innerHTML += `
                        <tr>
                            <td>${b.phone}</td>
                            <td>${b.from} to ${b.to}</td>
                            <td>${b.date}</td>
                            <td><span class="badge">${s.join(', ')}</span></td>
                            <td>
                                <button class="btn-print" onclick="window.printTicket('${b.phone}', '${b.from}', '${b.to}', '${b.date}', '${s.join(', ')}')"><i class="fas fa-print"></i></button>
                                <button class="btn-delete" onclick="window.deleteBooking('${bId}')"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>`;
                });
                document.getElementById('totalCount').innerText = data.length;
                document.getElementById('totalRevenue').innerText = (totalS * 1500).toLocaleString();
            } catch (e) { }
        };

        window.deleteBooking = async (id) => {
            if (confirm("Delete?")) {
                await fetch(`${API_URL}/delete-booking/${id}`, { method: 'DELETE' });
                window.loadAdmin();
            }
        };
    }
});