import {DateTime} from "luxon";
import peabody from "./peabody.js"

export function calcTimeUntil(config) {
	let now = DateTime.now();
	let nowUTC = now.toUTC();
	let deadlineTimeZone = DateTime.fromObject(config.time, {zone: config.timezone})
	let deadlineTimeZoneUTC = deadlineTimeZone.toUTC()
	let diff = deadlineTimeZoneUTC.diff(nowUTC, ["hours", "minutes", "seconds"])
	return diff
}

export function formatDiff(diff) {
	if (diff.hours === 0) {
		return diff.toFormat("m 'mins' s 'seconds'");
	}
	return diff.toFormat("h 'hrs' m 'mins'");
}

export function createCountdownHTML(time) {
	return `<span class="nominated-day__time-promise countdownTimer">Order within <span class="time">${time}</span></span>`
}

export function createCountdownElement(targetSelector = "body", time) {
    let template = document.createElement('template');
    template.innerHTML = createCountdownHTML(time);
    let tempEl = template.content.firstChild;
	let target = document.querySelector(targetSelector)
	target.insertAdjacentElement("beforeEnd", tempEl)
	document.querySelector('.nominated-day__selected-date').textContent = "Next Day Delivery"
}

export function updateCountdownElement(formattedTime) {
	document.querySelector('.nominated-day__selected-date').textContent = "Next Day Delivery"
	document.querySelector('.countdownTimer .time').textContent = formattedTime
}

function progressCountdown(config) {
	let timeUntil = calcTimeUntil(config)
	let formattedTime = formatDiff(timeUntil)
	let isEligible = isEligibleForCountdown()
	if(document.querySelector('.countdownTimer') === null && isEligible){
		createCountdownElement(config.targetSelector, formattedTime)
	} else if (!!document.querySelector('.countdownTimer') && isEligible) {
		updateCountdownElement(formattedTime)
	}
}

export function isEligibleForCountdown() {
	let conditions = []
	conditions.push(!!document.querySelector('.nominated-day__radio.active+.nominated-day__label[for="Tomorrow"],.nominated-day__radio.active+.nominated-day__label[for="tomorrow"]'))
	let result = conditions.every(a => a)
	return result
}

export function init(config) {
	let timeUntil = calcTimeUntil(config)
	let formattedTime = formatDiff(timeUntil)
	createCountdownElement(config.targetSelector, formattedTime)
	window.setInterval(_ => {
		progressCountdown(config)
	}, 1000)
	return config
}

export const countdown = {
	init,
	formatDiff,
	calcTimeUntil,
	createCountdownHTML,
	createCountdownElement,
	isEligibleForCountdown,
}

export default countdown