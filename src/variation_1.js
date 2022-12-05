import testConfig from "./modules/testConfig/testConfig.js"
import variationCSS from "./modules/testConfig/variation-1.css";

import {DateTime} from "luxon";
import addStylesToDOM from "./modules/genericFunctions/addStylesToDOM.js"
import watchForChange from "./modules/genericFunctions/watchForChange.js"
import isMobileSite from "./modules/genericFunctions/isMobileSite.js"
import pollFunction from "./modules/genericFunctions/pollFunction.js"
import countdown from "./modules/genericFunctions/countdownTimer.js"
import gaSendEvent from "./modules/genericFunctions/gaSendEvent.js"
import peabody from "./modules/genericFunctions/peabody.js"

testConfig["variant"] = "Variation 1"
const bodyClass = `${testConfig.id}_loaded`.replace(/ /g, '-').toLowerCase()
const isMobile = isMobileSite()
peabody.registerTest(testConfig["variant"], {
	countdown: {
		time: {hour: 20, minute: 0},
		timezone: "Europe/London",
		targetSelector: ".nominated-day__info > .nominated-day__time-promise" 
	}
})

function init() {
	peabody.log('Init Function Called')
	if (!document.body.classList.contains(bodyClass)) {
		document.body.classList.add(bodyClass);
		peabody.log(`${bodyClass} Class Added`)
		gaSendEvent(testConfig["variant"], 'Loaded', true)
		addStylesToDOM(variationCSS)
		let countdownConfig = window.peabody[testConfig.id].countdown
		peabody.log({
			msg: "countdown pre-init",
			config: countdownConfig
		})
		countdownConfig = countdown.init(countdownConfig)
		peabody.log({
			msg: "countdown post-init",
			config: countdownConfig
		})
	}
}

function pollConditions() {
	let conditions = []
	peabody.log({message: `Polling: Conditions`, conditions})
	let result = conditions.every(a => a)
	peabody.log({message: `Polling: Result`, result})
	return result
}

peabody.log(`${testConfig["variant"]} Code Loaded`)
pollFunction(pollConditions, init)