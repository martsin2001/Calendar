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
let mouthNow;
let quantityDays;
let elementsIs = false;


function addAllDataFromDate(data) {
	dataNow = data;
	mouthNow = months[dataNow.getMonth()];
	quantityDays = ((months.indexOf(mouthNow)-1)%2 === 0) ? 31 : 30;
	createBlockDay(quantityDays);
}

function createBlockDay(quantityDays) {
	dataMouth.textContent = months[dataNow.getMonth()]+ ", " +dataNow.getFullYear();
	let arrWithElementsDay = [];
	if( elementsIs ) {
		for (var i = 0; i < container.getElementsByClassName('block-day').length; i++) {
			arrWithElementsDay.push(container.getElementsByClassName('block-day')[i])
		}
		arrWithElementsDay.map(a=>{
			container.removeChild(a)
		})
		allDays = [];
	}
	for (var i = 1; i < quantityDays+1; i++) {
		let blockDay = document.createElement("DIV");
		let numberDay = document.createTextNode(i);
		blockDay.setAttribute("class", "block-day");
		blockDay.appendChild(numberDay);
		container.appendChild(blockDay);
		allDays.push(blockDay);
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
	allDays[index].appendChild(clip);
	allDays[index].setAttribute('title', data.quest);
	allDays[index].addEventListener('click', sentRequest)
	daysWithTask.push({
		day: allDays[index],
		data: data
	});
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
	addAllDataFromDate(new Date(month));
}

function clickPrevMonth() {
	var month = dat.setMonth( dat.getMonth()-1 );
	elementsIs = true;
	addAllDataFromDate(new Date(month));
}

prev.addEventListener('click', clickPrevMonth);
next.addEventListener('click', clickNextMonth);

addAllDataFromDate(new Date());