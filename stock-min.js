const kartuStock = document.getElementById("kartu-stock");
	kartuStock.addEventListener("click", e => {
    e.preventDefault();
    renderKartuStock();
});


function renderKartuStock() {
	const content = document.querySelector(".content");
	if (!content) return;

	// Kosongkan konten sebelumnya
	content.innerHTML = "";

	// Buat form Input Stock

	const inputLokasi = document.createElement("div");
	inputLokasi.className = "kartu-stock";
	inputLokasi.innerHTML = `
			
			<div class="d-flex p-2">
				<label for="input-lokasi">Lokasi : </label>
				<input type="text" id="input-lokasi" class="form-control p-2" style="width:200px;" required />
				<button id="buka" class="btn btn-primary" onClick="loadDataLokasi()">Buka</button>
			</div>
	`;

	// Tambahkan form ke konten
	//content.appendChild(inputLokasi);

	const buttonGroup = document.createElement("div");
	buttonGroup.id = "button-group-kartu-stock";
	buttonGroup.className = "button-group-kartu-stock";
	buttonGroup.innerHTML = `
		
		<button class="btn btn-primary" onclick="renderForm(false)">Tambah</button>
		<button class="btn btn-primary" onclick="renderForm(true)">Edit</button>
		<button class="btn btn-primary">Hapus</button>
	`;
	//content.appendChild(buttonGroup);

	const tableStockHeader = document.createElement("div");
	tableStockHeader.className = "kartu-stock-heder d-flex justify-content-between ";
	tableStockHeader.appendChild(buttonGroup);
	tableStockHeader.appendChild(inputLokasi);

	content.innerHTML = `<H2>Kartu Stock</H2>`
	content.appendChild(tableStockHeader);
	// Buat tabel hasil stock
	const tableContainer = document.createElement("table");
	tableContainer.id = "tabel-hasil";
	tableContainer.className = "table table-primary table-bordered table-striped table-hover";
	tableContainer.innerHTML = `
		<thead class="bg-primary text-center">
			<tr>
				<th class="bg-primary text-white">Kode</th>
				<th class="bg-primary text-white">Barcode</th>
				<th class="bg-primary text-white">Nama Barang</th>
				<th class="bg-primary text-white">Qty Stock</th>
			</tr>
		</thead>
		<tbody id="tabel-hasil-stock"></tbody>
	`;

	// Tambahkan tabel ke konten
	content.appendChild(tableContainer);

	 
}

function renderForm(isEdit = false, data = {}) {
    // Hapus form sebelumnya jika ada
    const existingForm = document.querySelector(".form-container");
    if (existingForm) {
        existingForm.remove();
    }

    // Buat elemen form
    const formContainer = document.createElement("div");
    formContainer.className = "form-container";

    formContainer.innerHTML = `
        <div class="form-content">
			<div class="input-group input-group">
            	<input type="text" id="inputKodeBarcode" placeholder="Masukkan Kode atau Barcode" />
            	<button type="button" id="searchButton">
					<i class="fas fa-search"></i> <!-- Ikon dari Font Awesome -->
				</button>
			</div>
            <div id="loadingIndicator" style="display: none;">
                <div class="spinner"></div>
                <span>Sedang memuat data...</span>
            </div>
            <form name="inputstock">
                <label for="kode_namaBarang">Kode - Nama Barang:</label>
                <input type="text" id="kode_namaBarang" name="barang" placeholder="Kode - Nama Barang" readonly />

                <label for="qty">Qty:</label>
                <input type="number" id="qty" name="qty" placeholder="Masukkan Qty" required />

                <button type="submit">Simpan</button>
                <button type="button" class="cancel-button" onclick="closeForm()">Batal</button>
            </form>
        </div>
    `;

    document.body.appendChild(formContainer);

    // Pasang event listener
    const inputField = document.querySelector("#inputKodeBarcode");
    const searchButton = document.querySelector("#searchButton");

    if (!inputField || !searchButton) {
        console.error("Element input or button not found.");
        return;
    }

    // Listener untuk Enter dan Tab
    inputField.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === "Tab") {
            event.preventDefault();
            const inputValue = this.value.trim();
            console.log("Input Value (Enter/Tab):", inputValue); // Log di sini
            if (inputValue) {
                fetchBarangData(inputValue);
            }
        }
    });

    // Listener untuk tombol
    searchButton.addEventListener("click", () => {
        const inputValue = inputField.value.trim();
        console.log("Input Value (Button Click):", inputValue); // Log di sini
        if (inputValue) {
            fetchBarangData(inputValue);
        }
    });
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwA6H0wiU1F4a17C7CrcBV2kmfoV7FcjayCRlkD3mCcUDCFmF2UY68V9DISe05o3o6O/exec'
    const form = document.forms['inputstock'];

    form.addEventListener('submit', e => {
        e.preventDefault();
        fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response => console.log('Success!', response))

            .catch(error => console.error('Error!', error.message))

           
    });
    
}

  async function fetchBarangData(inputValue) {
    const spreadsheetID = "1C8yEZtypCWUHJ3IB9WMi4OZD8AUWr7BDG7jux5A3l10";
    const apiKey = "AIzaSyA3CnJkI8Tv9QE9EbKH5kVOH6u4Kf7HQ7M";
    const sheetName = "Master";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${sheetName}?key=${apiKey}`;

	const loadingIndicator = document.getElementById("loadingIndicator");
    loadingIndicator.style.display = "flex"; // Aktifkan spinner
	//console.log("Fetching data for:", inputValue); // Log untuk debug
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const data = await response.json();
        const rows = data.values;

        // Cari data berdasarkan input (kode atau barcode)
        const matchedRow = rows.find(row => row[0] === inputValue || row[1] === inputValue);
        if (matchedRow) {
            const kode = matchedRow[0];
            const namaBarang = matchedRow[2];

            // Format kode_namaBarang untuk field input
            const formattedValue = `${kode}_${namaBarang}`;
            document.getElementById("kode_namaBarang").value = formattedValue;
        } else {
            alert("Data tidak ditemukan.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal mengambil data. Cek koneksi internet atau konfigurasi API.");
    } finally {
        loadingIndicator.style.display = "none"; // Matikan spinner
    }
}

function closeForm() {
	const existingForm = document.querySelector(".form-container");
	existingForm.remove();
}

