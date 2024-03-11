class App {
  constructor() {
    this.clearButton = document.getElementById("clear-btn");
    this.loadButton = document.getElementById("load-btn");
    this.carContainerElement = document.getElementById("cars-container");
    this.loadButton.addEventListener("click", this.handleLoadButtonClick);
  }

  handleLoadButtonClick = async () => {
    this.clear();
    await this.loadFilter();
  };

  async init() {
    await this.load();
    this.run();
  }

  run = () => {
    Car.list.forEach((car) => {
      const node = document.createElement("div");
      node.classList.add("col-lg-4", "my-2");
      node.innerHTML = car.render();
      this.carContainerElement.appendChild(node);
    });
  };

  async load() {
    const cars = await Binar.listCars();
    Car.init(cars);
    console.log(cars);
  }

  async loadFilter() {
    // Mendapatkan nilai dari elemen input dan menyimpannya ke dalam variabel lokal
    const tipeDriverValue = document.getElementById("tipeDriver").value;
    const tanggalValue = document.getElementById("tanggal").value;
    const waktuJemputValue = document.getElementById("waktuJemput").value;
    const jumlahPenumpangValue = parseInt(
      document.getElementById("jumlahPenumpang").value
    );

    // Membuat filter berdasarkan input dari pengguna
    const filterer = (car) => {
      const carDate = new Date(car.availableAt);
      const carAvailable = car.available;
      const carCapacity = car.capacity;

      // Filter berdasarkan tipe driver
      const matchTipeDriver =
        tipeDriverValue === "default" ||
        (tipeDriverValue === "true" && carAvailable) ||
        (tipeDriverValue === "false" && !carAvailable);

      // Filter berdasarkan tanggal dan waktu jemput
      const matchTanggalWaktu =
        tanggalValue === "" ||
        waktuJemputValue === "false" ||
        new Date(`${tanggalValue} ${waktuJemputValue}`).getTime() <=
          carDate.getTime();

      // Filter berdasarkan jumlah penumpang. mobil yang akan muncul jumlah penumpang lebih dari sama dengan yang di inputkan
      const matchJumlahPenumpang =
        isNaN(jumlahPenumpangValue) || carCapacity >= jumlahPenumpangValue;

      return matchTipeDriver && matchTanggalWaktu && matchJumlahPenumpang;
    };

    try {
      // Mendapatkan data mobil dan melakukan filter
      const cars = await Binar.listCars(filterer);
      // Inisialisasi data mobil setelah penundaan
      Car.init(cars);
      console.log(cars.length);
    } catch (error) {
      console.error("Error loading cars:", error);
    }
  }

  clear = () => {
    let child = this.carContainerElement.firstElementChild;

    while (child) {
      child.remove();
      child = this.carContainerElement.firstElementChild;
    }
  };
}
