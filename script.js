
$(document).ready(function () {
	// Toggle sidebar visibility
	$("#toggle").click(function () {
       
            $(".sidebar-menu").toggleClass("hidden");
        
    });
	// Toggle submenu
    $(".menu-item").click(function () {
	    $(this).next(".submenu").slideToggle();
		$(this).find("i").toggleClass("bx-chevron-down bx-chevron-up");
	});
});

document.addEventListener("DOMContentLoaded", () => {
	// Fungsi untuk toggle sidebar
	const toggleButton = document.querySelector("#toggle");
	const sidebar = document.querySelector(".sidebar-menu");

	toggleButton.addEventListener("click", () => {
		sidebar.classList.toggle("visible");
	});
});

const SPREADSHEET_ID = "1C8yEZtypCWUHJ3IB9WMi4OZD8AUWr7BDG7jux5A3l10";
const API_KEY = "AIzaSyA3CnJkI8Tv9QE9EbKH5kVOH6u4Kf7HQ7M";
const MASTER_SHEET = "Master!A2:F";

const SHEET_NAME = "Master";
const STOCK_OPNAME_SHEET = "StockOpname";


document.addEventListener("DOMContentLoaded", () => {
	// Fungsi untuk toggle submenu
	const sidebar = document.querySelectorAll(".first-child");
	sidebar.forEach(item => {
		item.addEventListener("click", () => {
			const subMenu = item.nextElementSibling;
			subMenu.classList.toggle("last-child");
		});
	});

	// Klik submenu Barang
	document.querySelector("#submenu-barang").addEventListener("click", e => {
		e.preventDefault();
		renderMasterBarang();
	});
});

function renderMasterBarang() {
	const content = document.querySelector(".content");
	content.innerHTML = ""; // Kosongkan konten sebelumnya

	// Header Tabel
	const title = document.createElement("h2");
	title.textContent = "Master Barang";

	// Pencarian
	const search = document.createElement("input");
	search.type = "text";
	search.placeholder = "Cari barang...";
	search.id = "search-barang";
    
	// Tabel
	const table = document.createElement("table");
	table.id = "master-barang-table";
	table.innerHTML = `
        <thead>
            <tr>
                <th>Kode</th>
                <th>Barcode</th>
                <th>Nama Barang</th>
                <th>Harga</th>
                <th>Supplier</th>
                <th>Lokasi</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

	content.appendChild(title);
	content.appendChild(search);
	content.appendChild(table);

	// Panggil data dari Google Spreadsheet
	fetchMasterBarang();

	// Tambahkan event untuk pencarian
	search.addEventListener("input", function () {
		filterTable(this.value.toLowerCase());
	});
}

async function fetchMasterBarang() {
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A2:F?key=${API_KEY}`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		populateTable(data.values);
	} catch (error) {
		console.error("Error fetching data:", error);
	}
}

function populateTable(data) {
	const tbody = document.querySelector("#master-barang-table tbody");
	tbody.innerHTML = "";

	data.forEach(row => {
		const tr = document.createElement("tr");
		row.forEach(cell => {
			const td = document.createElement("td");
			td.textContent = cell || "-";
			tr.appendChild(td);
		});
		tbody.appendChild(tr);
	});
}

function filterTable(searchTerm) {
	const rows = document.querySelectorAll("#master-barang-table tbody tr");
	rows.forEach(row => {
		const isVisible = Array.from(row.cells).some(cell =>
			cell.textContent.toLowerCase().includes(searchTerm)
		);
		row.style.display = isVisible ? "" : "none";
	});
}

//const SPREADSHEET_ID = "1C8yEZtypCWUHJ3IB9WMi4OZD8AUWr7BDG7jux5A3l10";
//const API_KEY = "AIzaSyA3CnJkI8Tv9QE9EbKH5kVOH6u4Kf7HQ7M";
//const MASTER_SHEET = "Master!A2:F";
//const STOCK_OPNAME_SHEET = "StockOpname";

document.querySelector("#submenu-stock").addEventListener("click", e => {
    e.preventDefault();
    renderInputStockPage();
});


function renderInputStockPage() {
	const content = document.querySelector(".content");
	if (!content) return;

	// Kosongkan konten sebelumnya
	content.innerHTML = "";

	// Buat form Input Stock
	const formContainer = document.createElement("div");
	formContainer.className = "form-control form-stock ";
	formContainer.innerHTML = `
		<h2>Input Stock</h2>
		<input type="text" id="input-kode-barcode" placeholder="Kode/Barcode" />
		<input type="number" id="input-qty" placeholder="Qty Stock" />
		<button id="btn-tambah-stock">Tambah</button>
	`;

	// Tambahkan form ke konten
	content.appendChild(formContainer);

	// Buat tabel hasil stock
	const tableContainer = document.createElement("table");
	tableContainer.id = "tabel-hasil-stock";
	tableContainer.innerHTML = `
		<thead>
			<tr>
				<th>Tanggal</th>
				<th>Kode</th>
				<th>Barcode</th>
				<th>Nama Barang</th>
				<th>Lokasi</th>
				<th>Qty Stock</th>
			</tr>
		</thead>
		<tbody></tbody>
	`;

	// Tambahkan tabel ke konten
	content.appendChild(tableContainer);

	// Tambahkan event listener untuk tombol tambah
	document.getElementById("btn-tambah-stock").addEventListener("click", handleTambahStock);

	// Render data hasil stock
	fetchHasilStock();
}

async function fetchHasilStock() {
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${STOCK_OPNAME_SHEET}?key=${API_KEY}`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		populateHasilStock(data.values);
	} catch (error) {
		console.error("Error fetching stock opname data:", error);
	}
}

function populateHasilStock(data) {
	const tbody = document.querySelector("#tabel-hasil-stock tbody");
	tbody.innerHTML = "";

	if (!data) return;

	data.forEach(row => {
		const tr = document.createElement("tr");
		row.forEach(cell => {
			const td = document.createElement("td");
			td.textContent = cell || "-";
			tr.appendChild(td);
		});
		tbody.appendChild(tr);
	});
}

// Cache untuk data master barang
let masterDataCache = [];

// Fungsi untuk menangani input dan menambahkan stok
async function handleTambahStock() {
    const kodeBarcode = document.getElementById("input-kode-barcode").value.trim();
    const qty = document.getElementById("input-qty").value.trim();

    if (!kodeBarcode || !qty) {
        alert("Harap isi semua field!");
        return;
    }

    // Pastikan data master sudah dimuat
    if (masterDataCache.length === 0) {
        masterDataCache = await fetchMasterData();
    }

    // Cari barang berdasarkan kode atau barcode
    const item = masterDataCache.find(
        row => row[0] === kodeBarcode || row[1] === kodeBarcode
    );

    if (!item) {
        alert("Kode/Barcode tidak ditemukan di Master Barang!");
        return;
    }

    // Ambil detail barang
    const [kode, barcode, namaBarang, , lokasi] = item;
    const tanggal = new Date().toLocaleDateString("id-ID");

    // Buat data untuk dikirim
    const stockData = { tanggal, kode, barcode, namaBarang, lokasi, qty };

    // Kirim data ke Google Spreadsheet
    const success = await tambahDataStock(stockData);
    if (success) {
        // Tambahkan data ke tabel hasil stock di frontend
        addRowToHasilStock(stockData);
    }
}

// Fungsi untuk menambahkan baris ke tabel hasil stock
function addRowToHasilStock({ tanggal, kode, barcode, namaBarang, lokasi, qty }) {
    const tbody = document.querySelector("#tabel-hasil-stock tbody");
    const tr = document.createElement("tr");

    [tanggal, kode, barcode, namaBarang, lokasi, qty].forEach(value => {
        const td = document.createElement("td");
        td.textContent = value || "-";
        tr.appendChild(td);
    });

    tbody.appendChild(tr);
}

// Fungsi untuk memuat data Master Barang (caching)
async function fetchMasterData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${MASTER_SHEET}?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.values || [];
    } catch (error) {
        console.error("Error fetching master data:", error);
        return [];
    }
}

// Fungsi untuk menambahkan data stock ke Google Spreadsheet
async function tambahDataStock({ tanggal, kode, barcode, namaBarang, lokasi, qty }) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/StockOpname:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    const body = {
        values: [[tanggal, kode, barcode, namaBarang, lokasi, qty]],
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            return true;
        } else {
            const errorDetails = await response.json();
            console.error("Error adding stock:", errorDetails);
            alert("Gagal menambahkan data ke Google Spreadsheet!");
            return false;
        }
    } catch (error) {
        console.error("Error adding stock:", error);
        alert("Gagal mengirim data! Periksa koneksi internet.");
        return false;
    }
}

async function loadDataLokasi() {
	//const LOKASI = "RAK 1 Food";
	const LOKASI = document.getElementById("input-lokasi").value.trim();
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${LOKASI}!A2:D?key=${API_KEY}`;
	if (!LOKASI) {
		alert("Isi lokasi terlebih dahulu");
		return;
	}
	try {
		const response = await fetch(url);
		const data = await response.json();
		console.log(data);
		populateTable(data.values);
	} catch (error) {
		console.error("Error fetching data:", error);
		alert(LOKASI + " tidak ada di Data Stock")
	}
	
}

function populateTable(data) {
	const tbody = document.getElementById("tabel-hasil-stock");
	tbody.innerHTML = "";

	data.forEach(row => {
		const tr = document.createElement("tr");
		row.forEach(cell => {
			const td = document.createElement("td");
			td.textContent = cell || "-";
			tr.appendChild(td);
		});
		tbody.appendChild(tr);
	});
}

//const API_KEY = 'YOUR_API_KEY'; // Ganti dengan API Key Anda
//const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Ganti dengan ID Spreadsheet Anda
const RANGE = 'user!A:B'; // Ganti dengan nama sheet dan range data (username & password)

async function fetchUserData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
    	throw new Error('Failed to fetch data');
    }
    const data = await response.json();
      	return data.values.slice(1).map(row => ({
        username: row[0],
        password: row[1],
    }));
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

	try {
		const users = await fetchUserData();
        const isValid = users.some(user => user.username === username && user.password === password);
        if (isValid) {
          	errorMessage.textContent = '';
          	document.getElementById('login-form').style.display = 'none';
          	document.querySelector('.main-container').style.display = 'block';
		document.getElementById('user-active').textContent = username;
		} else {
          	errorMessage.textContent = 'Invalid username or password';
        }
    } catch (error) {
		errorMessage.textContent = 'Error connecting to server.';
        console.error(error);
    }
}
