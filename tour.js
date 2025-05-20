// URL of the CSV file
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7TcPhsH4A5h-NN7KRWgfXr5cfYiHMZGj8Jxizzs3GFh74-gBo8u3d4Q09LUYgGUBVUr33yfVuUiX7/pub?gid=0&single=true&output=csv';

function reformatDate(dateString) {
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const date = new Date(dateString);
	const day = String(date.getDate()).padStart(2, '0');
	const month = months[date.getMonth()];
	const year = String(date.getFullYear()).slice(2);
	return `${day} ${month} ${year}`;
}

async function fetchCsvData() {
	const response = await fetch(csvUrl);
	const reader = response.body.getReader();
	const result = await reader.read(); // raw array
	const decoder = new TextDecoder('utf-8');
	const csv = decoder.decode(result.value); // the csv text
	return csv;
}

const now = new Date();



async function displayData() {
	const csvData = await fetchCsvData();
	// Parse the CSV data into an array of objects using Papa Parse
	const data = Papa.parse(csvData, { header: true }).data;
	// Log the data for debugging
	// console.log(data);

	const futureDates = data.filter(item => new Date(item.startDate) >= now);
	// Display the data on your page. This example assumes you have a <div> element with id 'tourDates' in your HTML
	const tourDatesElement = document.getElementById('tourDates');
	// If there are upcoming dates, add title and dates to the page
	if (futureDates.length > 0) {
		tourDatesElement.innerHTML = '<h1>UPCOMING EVENTS</h1>';
		futureDates.forEach(item => {
			const startDate = reformatDate(item.startDate);
			tourDatesElement.innerHTML += `<a target="_blank" href="${item.eventURL}">${startDate}, ${item.eventVenue}, ${item.eventCity}</a>`;
		});
	}
}

// Call displayData when the page loads
window.onload = displayData;