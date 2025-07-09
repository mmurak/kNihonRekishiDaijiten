class GlobalManager {
	constructor() {
		this.mode = 0;
		this.ippan = document.getElementById("Ippan");
		this.shoshi = document.getElementById("Shoshi");
		this.chimeiIseki = document.getElementById("ChimeiIseki");
		this.nihonjinSeishi = document.getElementById("NihonjinSeishi");
		this.nihonjin = document.getElementById("Nihonjin");
		this.gaikokujinE = document.getElementById("GaikokujinE");
		this.gaikokujinW = document.getElementById("GaikokujinW");
		this.tennou = document.getElementById("Tennou");
		this.textEntry = document.getElementById("TextEntry");
		this.textEntry.addEventListener("focus", () => {this.textEntry.select();});
		this.indexSearch = document.getElementById("IndexSearch");
		this.indexSearch.addEventListener("click", searchIndex);
		this.eraseEntry = document.getElementById("EraseEntry");
		this.eraseEntry.addEventListener("click", eraseTextEntry);
		this.pageEntry = document.getElementById("PageEntry");
		this.pageEntry.addEventListener("focus", () => {this.pageEntry.select();});
		this.openPage = document.getElementById("OpenPage");
		this.openPage.addEventListener("click", openDirect);
		this.erasePage = document.getElementById("ErasePage");
		this.erasePage.addEventListener("click", erasePageEntry);
		this.nenpyo = document.getElementById("Nenpyo");
		this.nenpyo.addEventListener("keydown", openNenpyo);
		this.nengouSakuin = document.getElementById("NengouSakuin");
		this.nengouSakuin.addEventListener("click", openNengouSakuin);
		this.zuhyoSelector = document.getElementById("ZuhyoSelector");
		this.zuhyoSelector.addEventListener("change", zuhyoSelect);
		this.bekkanSelector = document.getElementById("BekkanSelector");
		this.bekkanSelector.addEventListener("change", bekkanSelect);
		this.photoMenuTable = document.getElementById("PhotoMenuTable");
		document.addEventListener("keyup", (evt) => {
			if (evt.key == "Enter") {
				if (isElementFocused(this.pageEntry)) {
					openDirect();
					this.pageEntry.focus();
				} else if (evt.shiftKey) {
					searchIndex();
					this.textEntry.focus();
				}
			} else if (evt.key == "Escape") {
				if (isElementFocused(this.pageEntry)) {
					erasePageEntry();
				} else if (isElementFocused(this.textEntry)) {
					eraseTextEntry();
				}
			}
		});
		//
		this.idxURL = "https://dl.ndl.go.jp/pid/12192280/1/";	// 10
		this.urls = [
			[],
			["https://dl.ndl.go.jp/pid/12192272/1/", 15],	// 1
			["https://dl.ndl.go.jp/pid/12195949/1/", 14],
			["https://dl.ndl.go.jp/pid/12196002/1/", 14],
			["https://dl.ndl.go.jp/pid/12195950/1/", 14],
			["https://dl.ndl.go.jp/pid/12196081/1/", 14],	// 5
			["https://dl.ndl.go.jp/pid/12192186/1/", 14],
			["https://dl.ndl.go.jp/pid/12192233/1/", 14],
			["https://dl.ndl.go.jp/pid/12195954/1/", 14],
			["https://dl.ndl.go.jp/pid/12192235/1/", 14],
			["https://dl.ndl.go.jp/pid/12192280/1/", 10],	// 10
			["https://dl.ndl.go.jp/pid/12192139/1/", 4],
			["https://dl.ndl.go.jp/pid/12883421/1/", 12],
		];
	}
}
const G = new GlobalManager();
const R = new Regulator();
G.textEntry.focus();

function setMode() {
	if (G.ippan.classList.contains("selected")) G.mode = 0;
	else if (G.shoshi.classList.contains("selected")) G.mode = 1;
	else if (G.chimeiIseki.classList.contains("selected")) G.mode = 2;
	else if (G.nihonjinSeishi.classList.contains("selected")) G.mode = 3;
	else if (G.nihonjin.classList.contains("selected")) G.mode = 4;
	else if (G.gaikokujinE.classList.contains("selected")) G.mode = 5;
	else if (G.gaikokujinW.classList.contains("selected")) G.mode = 6;
	else G.mode = 7;
}

function searchIndex() {
	setMode();
	let target = G.textEntry.value;
	target = target.replace(/[ァ-ン]/g, (s) => {
		return String.fromCharCode(s.charCodeAt(0) - 0x60);
	});
	let rTarget = R.regulate(target);
	if ((rTarget.length == 0) && (G.mode != 7))  return;
	let idx = bigIndex[G.mode].length - 1;
	while ((idx >= 0) && (bigIndex[G.mode][idx] > rTarget)) {
		idx--;
	}
	const page = bigIndex[G.mode][0] - idx;
	windowOpen(G.idxURL + page, "索引検索結果");
}

function openDirect() {
	const vPage = G.pageEntry.value;
	if (vPage == "")  return;
	const m = vPage.match(/^([0-9０-９][0-9０-９])[^0-9０-９]*([0-9０-９]+)$/);
	if (m == null)  return;
	const vol = Number(m[1]);
	const page = fixOverlayPages(vol, Number(m[2]));
	const rPage = Math.trunc(Number(page) / 2) + G.urls[vol][1];
	windowOpen(G.urls[vol][0] + rPage, "検索結果");
}

function fixOverlayPages(volNo, page) {
	const overlayPages = [		// VolNo, PageAt, NumberOfPages
		[1, 106, 8], [1, 218, 16], [1, 442, 16],
		[2, 140, 8], [2, 220, 16], [2, 444, 16],
		[3, 108, 8], [3, 220, 16], [3, 444, 16],
		[4, 108, 8], [4, 236, 16], [4, 492, 16],
		[5, 172, 8], [5, 236, 16], [5, 460, 16],
		[6, 108, 8], [6, 220, 16], [6, 444, 16],
		[7, 108, 8], [7, 220, 16], [7, 444, 16],
		[8, 108, 8], [8, 220, 16], [8, 444, 16],
		[9, 108, 8], [9, 236, 16], [9, 492, 16],
		[10, 76, 8], [10, 140, 16],
	];
	let offset = 0;
	for (let i = 0; i < overlayPages.length; i++) {
		if (volNo == overlayPages[i][0]) {
			if (page > overlayPages[i][1]) {
				offset += overlayPages[i][2];
			}
		}
	}
	return page + offset;
}


document.addEventListener('DOMContentLoaded', function() {
	const toggleButtons = document.querySelectorAll('.toggle-button');
	if (toggleButtons.length > 0) {
		toggleButtons[G.mode].classList.add('selected');
	}

	toggleButtons.forEach(button => {
		button.addEventListener('click', function() {
			toggleButtons.forEach(btn => {
				btn.classList.remove('selected');
			});
			this.classList.add('selected');
			G.textEntry.focus();
		});
	});

// 図表登録
	const zHeader = document.createElement("option");
	zHeader.value = -1;
	zHeader.innerHTML = "選択してください";
	G.zuhyoSelector.appendChild(zHeader);
	for (let i = 0; i < zu.length; i++) {
		const item = document.createElement("option");
		item.innerHTML = zu[i][0];
		item.value = zu[i][1];
		G.zuhyoSelector.appendChild(item);
	}
	for (let i = 0; i < hyou.length; i++) {
		const item = document.createElement("option");
		item.innerHTML = hyou[i][0];
		item.value = hyou[i][1];
		G.zuhyoSelector.appendChild(item);
	}
// 日本歴史地図登録
	const header = document.createElement("option");
	header.value = -1;
	header.innerHTML = "選択してください";
	G.bekkanSelector.appendChild(header);
	for (let i = 1; i < bekkan2.length; i++) {
		const item = document.createElement("option");
		item.value = bekkan2[0][1] + (i * 2);
		item.innerHTML = bekkan2[i];
		G.bekkanSelector.appendChild(item);
	}
});

function openNenpyo(evt) {
	const url = "https://dl.ndl.go.jp/pid/12192139/1/";
	const yearFrame = [
		[1, 400, 200, 7],
		[401, 600, 100, 9],
		[601, 640, 20, 11],
		[641,1330, 10, 13],
		[1331, 1338, 8, 82],
		[1339, 1848, 6, 83],
		[1849, 1853, 5, 168],
		[1854, 1869, 4, 169],
		[1870, 1874, 5, 173],
		[1875, 1922, 6, 174],
		[1923, 1927, 5, 182],
		[1928, 1983, 4, 183],
		[1984, 1984, 1, 197],
	];
	if (evt.key == "Enter") {
		const nen = Number(G.nenpyo.value);
		for (info of yearFrame) {
			if ((nen >= info[0]) && (nen <= info[1])) {
				const frameNo = Math.trunc((nen - info[0]) / info[2]) + info[3];
				window.open(url + frameNo, "年表");
				break;
			}
		}
		G.nenpyo.value = "";
		evt.preventDefault();
	}
}

function openNengouSakuin() {
	window.open(G.urls[11][0] + "5", "年表");
	G.nenpyo.value = "";
}

function zuhyoSelect() {
	const value = G.zuhyoSelector[G.zuhyoSelector.selectedIndex].value;
	if (value.match(/^\d+$/)) {
		window.open(G.urls[11][0] + value, "図表");
	} else {
		window.open(value, "図表");
	}
	G.zuhyoSelector.selectedIndex = 0;
}

function bekkanSelect() {
	const value = G.bekkanSelector[G.bekkanSelector.selectedIndex].value;
	window.open(bekkan2[0][0] + value, "日本歴史地図");
	G.bekkanSelector.selectedIndex = 0;
}

function photoMenu(val) {
	G.photoMenuTable.innerHTML = "";
	const cellMax = 5;
	let cellCounter = cellMax + 1;
	let tableRow;
	for (let dan of photoIndex[val]) {
		if (cellCounter >= cellMax) {
			tableRow = G.photoMenuTable.insertRow(-1);
			cellCounter = 0;
		}
		const cell = tableRow.insertCell(cellCounter);
		const anchor = document.createElement("a");
		anchor.href = G.urls[dan[1]][0] + dan[2];
		anchor.target = "写真";
		anchor.innerHTML = dan[0];
		cell.appendChild(anchor);
		cellCounter++;
	}
}

function eraseTextEntry() {
	G.textEntry.value = "";
	G.textEntry.focus();
}

function erasePageEntry() {
	G.pageEntry.value = "";
	G.pageEntry.focus();
}

function windowOpen(url, title) {
	window.open(url, title);
	G.textEntry.focus();
}

function isElementFocused(elem) {
	return document.activeElement === elem && document.hasFocus();
}

function authors() {
	// vol. 10 page. 244 (Frame 144)
	windowOpen(G.urls[10][0] + "144", "検索結果");
}
