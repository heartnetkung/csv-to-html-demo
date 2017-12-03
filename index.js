const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;


const PREFIX =
	`<html><body><style>
sup{vertical-align: super,font-size: .83em}
strong{font-weight:bold}
span{font-size: 1.5em;font-weight:bold}
u{text-decoration:underline}
body{line-height:1.5}
</style>`;
const SUFFIX = '</body></html>';


const openHTML = function(filePath) {
	switch (process.platform) {
		case 'darwin':
			return exec('open ' + filePath);
		case 'win32':
		case 'win64':
			return exec('start ' + filePath);
		default:
			return exec('xdg-open ' + filePath);
	}
};


const render = function({ word, index, reading, pos, meaning, see_also, syn }) {
	var isMain = index === '1';
	return [
		isMain ? `<br><span>${word}</span>` : ',',
		isMain ? `<sup>${index}</sup>` : '',
		isMain ? `<span> – </span>` : '',
		reading ? `<u>(${reading})</u>` : '',
		pos,
		meaning,
		syn ? `(syn. ${meaning})` : ''
	].join(' ');
};


const text = fs.readFileSync(process.argv[2], 'utf8');
const data = parse(text, { columns: true, trim: true });
var ans = [];
for (var line of data)
	ans.push(render(line));
fs.writeFileSync('out.html', PREFIX + ans.join('\n').replace(/<br>/, '') + SUFFIX);
openHTML(path.resolve('out.html'));
