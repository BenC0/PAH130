export default function isOutOfStock() {
	let outOfStock = false
	document.querySelectorAll('p.pdp-stock__message.pdp-stock__message--alert').forEach(e => {
		if (e.textContent.match(/out of stock/gi) !== null) {
			outOfStock = true
		}
	})
	return outOfStock
}