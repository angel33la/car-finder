// Imports your SCSS stylesheet
import './styles/index.scss';
import carData from './data/car-dataset.json';

class CarFinder {
    constructor() {
        this.yearSelect = document.getElementById("year");
        this.makeSelect = document.getElementById("make");
        this.modelSelect = document.getElementById("model");

        this.carData = this.processCarData(carData);
        this.initializeSelects();
        this.setupEventListeners();
    }

    processCarData(data) {
        // Process the data to get unique years, makes, and models
        const processed = {
            years: new Set(),
            makesByYear: {},
            modelsByMake: {},
        };

        data.forEach((car) => {
            const year = car.year;
            const make =
                car.Manufacturer.charAt(0).toUpperCase() + car.Manufacturer.slice(1); // Capitalize manufacturer name
            const model = car.model;

            // Add year
            processed.years.add(year);

            // Add make for the year
            if (!processed.makesByYear[year]) {
                processed.makesByYear[year] = new Set();
            }
            processed.makesByYear[year].add(make);

            // Add model for the make
            const makeKey = `${year}-${make}`;
            if (!processed.modelsByMake[makeKey]) {
                processed.modelsByMake[makeKey] = new Set();
            }
            processed.modelsByMake[makeKey].add(model);
        });

        // Convert Sets to sorted arrays
        return {
            years: Array.from(processed.years).sort((a, b) => b - a),
            makesByYear: Object.fromEntries(
                Object.entries(processed.makesByYear).map(([year, makes]) => [
                    year,
                    Array.from(makes).sort(),
                ])
            ),
            modelsByMake: Object.fromEntries(
                Object.entries(processed.modelsByMake).map(([makeKey, models]) => [
                    makeKey,
                    Array.from(models).sort(),
                ])
            ),
            rawData: data,
        };
    }

    initializeSelects() {
        // Populate years
        this.yearSelect.innerHTML = '<option value="">Select Year</option>';
        this.carData.years.forEach((year) => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            this.yearSelect.appendChild(option);
        });
    }

    setupEventListeners() {
        this.yearSelect.addEventListener("change", () => this.handleYearChange());
        this.makeSelect.addEventListener("change", () => this.handleMakeChange());
        this.modelSelect.addEventListener("change", () => this.handleModelChange());
    }

    handleYearChange() {
        const selectedYear = this.yearSelect.value;
        this.makeSelect.disabled = !selectedYear;
        this.modelSelect.disabled = true;

        // Reset makes and models
        this.makeSelect.innerHTML = '<option value="">Select Make</option>';
        this.modelSelect.innerHTML = '<option value="">Select Model</option>';

        if (selectedYear) {
            const makes = this.carData.makesByYear[selectedYear] || [];
            makes.forEach((make) => {
                const option = document.createElement("option");
                option.value = make;
                option.textContent = make;
                this.makeSelect.appendChild(option);
            });
        }
    }

    handleMakeChange() {
        const selectedYear = this.yearSelect.value;
        const selectedMake = this.makeSelect.value;
        this.modelSelect.disabled = !selectedMake;

        // Reset models
        this.modelSelect.innerHTML = '<option value="">Select Model</option>';

        if (selectedMake) {
            const makeKey = `${selectedYear}-${selectedMake}`;
            const models = this.carData.modelsByMake[makeKey] || [];
            models.forEach((model) => {
                const option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                this.modelSelect.appendChild(option);
            });
        }
    }

    handleModelChange() {
        const selectedYear = this.yearSelect.value;
        const selectedMake = this.makeSelect.value;
        const selectedModel = this.modelSelect.value;

        if (selectedYear && selectedMake && selectedModel) {
            // Find the exact car details from the raw data
            const selectedCar = this.carData.rawData.find(
                (car) =>
                car.year === parseInt(selectedYear) &&
                car.Manufacturer.toLowerCase() === selectedMake.toLowerCase() &&
                car.model === selectedModel
            );

            if (selectedCar) {
                console.log("Selected Car Details:", {
                    Year: selectedCar.year,
                    Make: selectedCar.Manufacturer,
                    Model: selectedCar.model,
                    Price: `£${selectedCar.price}`,
                    Transmission: selectedCar.transmission,
                    Mileage: `${selectedCar.mileage} miles`,
                    "Fuel Type": selectedCar.fuelType,
                    "Road Tax": `£${selectedCar.tax}`,
                    MPG: selectedCar.mpg,
                    "Engine Size": `${selectedCar.engineSize}L`,
                });
            }
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new CarFinder();
});