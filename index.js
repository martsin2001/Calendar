const container = document.getElementById('calendar');
const dataMouth = document.getElementById('data-mouth');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const dataJson = '{"quests":[{"id":"1","sub_id":"0","type_ob":"lide","ob_id":"120","xto":"930u1","komy":"930u1","quest":"Зателефонувати до Клієнта1","date_c":"2018-01-20 12:00","date_end":"2018-01-25 12:20","date_finish":"","xto_finihs":"930u1","status":"0","confirm_status":"0","quest_name":"Завдання 1","read":"1"},{"id":"2","sub_id":"0","type_ob":"lide","ob_id":"121","xto":"930u1","komy":"930u1","quest":"Зателефонувати до Клієнта2","date_c":"2018-01-23 12:01","date_end":"2018-01-25 12:40","date_finish":"","xto_finihs":"","status":"0","confirm_status":"0","quest_name":"Завдання 2","read":"0"},{"id":"3","sub_id":"0","type_ob":"lide","ob_id":"122","xto":"930u2","komy":"930u1","quest":"Зателефонувати до Клієнта3","date_c":"2018-01-22 12:00","date_end":"2018-01-25 12:50","date_finish":"","xto_finihs":"","status":"0","confirm_status":"1","quest_name":"Завдання 3","read":"0"}]}';
const dataUser = JSON.parse(dataJson);
const months = [
	"Січень", "Лютий", "Березень", "Квітень",
	"Травень", "Червень", "Липень", "Серпень", "Вересень",
	"Жовтень", "Листопад", "Грудень"
];

let daysWithTask = [];
let allDays = [];
let dataNow;
let dateDupl;
let mouthNow;
let quantityDays;
let elementsIs = false;
let quantityDaysFromPrevMonth = 0;
let oneLoad = true;


function addAllDataFromDate(data) {
	dataNow = new Date(data);
	mouthNow = months[dataNow.getMonth()];
	quantityDays = new Date(data);
	quantityDays.setDate(31);
	quantityDays = quantityDays.getDate() === 31 ? 31 : 30;
	createBlockDay(quantityDays, data);
}

function createDays(i, prev){
	let blockDay = document.createElement("DIV");
	let numberDay = document.createTextNode(i);
	if( prev ) {
		blockDay.setAttribute("class", "block-prev-day classForDel");
	} else {
		blockDay.setAttribute("class", "block-day classForDel");
	}
	blockDay.appendChild(numberDay);
	container.appendChild(blockDay);
	allDays.push(blockDay);
}

function createBlockDay(quantityDays, data) {
	dataMouth.textContent = months[dataNow.getMonth()]+ ", " +dataNow.getFullYear();
	let arrWithElementsDay = [];
	if( elementsIs ) {
		for (var i = 0; i < container.getElementsByClassName('classForDel').length; i++) {
			arrWithElementsDay.push(container.getElementsByClassName('classForDel')[i])
		}
		arrWithElementsDay.map(a=>{
			container.removeChild(a)
		})
		allDays = [];
	}
	dateDupl = data;
	setDateDay(dateDupl);
	for (var i = 1; i < quantityDays+1; i++) {
		createDays(i, false)
	}
	addDayTask(dataUser.quests)
}

function addDayTask(data) {
	let arrWithData = [];
	data.map(a=>{
		let getTime = a.date_c;
		getTime = getTime.split(' ')[0];
		let dataSt = new Date(getTime);
		arrWithData.push(dataSt);
	})
	arrWithData.map(a=>{
		if( 
			a.getFullYear() === dataNow.getFullYear() &&
			a.getMonth() === dataNow.getMonth() &&
			a.getDate() <= quantityDays
		) {
			addChangeInDay(a.getDate()-1, data[arrWithData.indexOf(a)]);
		}
	})
}

function addChangeInDay(index, data){
	let clip = document.createElement('DIV');
	clip.setAttribute('class', 'block-with-task');
	let imgClicp = document.createElement('I');
	imgClicp.setAttribute('class', 'fa fa-thumb-tack');
	clip.appendChild(imgClicp);
	var indexElement = index + quantityDaysFromPrevMonth;
	allDays[indexElement].appendChild(clip);
	allDays[indexElement].setAttribute('title', data.quest);
	allDays[indexElement].addEventListener('click', sentRequest)
	daysWithTask.push({
		day: allDays[indexElement],
		data: data
	});
}

function setDateDay(date) {
	let datePrev = new Date(date);
	let dateDup = new Date(date);
	datePrev.setDate(1);
	let quantityDaysPrevMonth = datePrev.getDay() > 0 ? datePrev.getDay() : 7;
	if ( quantityDaysPrevMonth > 1 ) {
		var monthPrev = dateDup.setMonth( dateDup.getMonth()-1 );
		monthPrev = new Date(monthPrev);
		var quantDays = monthPrev;
		quantDays.setDate(31);
		quantDays = quantDays.getDate() === 31 ? 31 : 30;
		var arrPrevMonth = [];
		for (var i = quantDays; i > (quantDays-(quantityDaysPrevMonth-1)); i--) {
			arrPrevMonth.push(i);
		};
		quantityDaysFromPrevMonth = arrPrevMonth.length;
		arrPrevMonth = arrPrevMonth.reverse();
		for (var i = 0; i < arrPrevMonth.length; i++) {
			createDays(arrPrevMonth[i], true);
		};
	} else quantityDaysFromPrevMonth = 0;
}

function sentRequest() {
	let dataForSent;
	daysWithTask.map(a=>{
		if(a.day === this) {
			dataForSent = JSON.stringify(a.data);
		}
	})
	$(document).ready(function(){
		$(this).click(function(){
			$.ajax({
				type: 'GET',
				url: 'https://dbonline.outsorcing.in.ua/office/',
				dataType: 'json',
				success: function(data){
					console.log( data )
				}
			})
		})
	});
}

var dat = new Date();

function clickNextMonth() {
	var month = dat.setMonth( dat.getMonth()+1 );
	elementsIs = true;
	dateDupl = month;
	addAllDataFromDate(month);
}

function clickPrevMonth() {
	var month = dat.setMonth( dat.getMonth()-1 );
	elementsIs = true;
	dateDupl = month;
	addAllDataFromDate(month);
}

prev.addEventListener('click', clickPrevMonth);
next.addEventListener('click', clickNextMonth);

let dateForSent = new Date();
addAllDataFromDate( dateForSent.setMonth(dateForSent.getMonth()) );