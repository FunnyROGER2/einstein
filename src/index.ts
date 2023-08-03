import Riddle, { Rule } from "./riddle";

export const SHUFFLES_NUMBER = 10;

const HOUSES_COUNT = 5;
const HOUSES_RULES: Rule[] = [
	{
		nation: 'english',
		color: 'red'
	},
	{
		nation: 'spanish',
		pet: 'dog'
	},
	{
		color: 'green',
		drink: 'coffee'
	},
	{
		nation: 'ukrainian',
		drink: 'tea'
	},
	{
		neighborFirst: {
			filterName: 'color',
			filterValue: 'green',
			side: ['right']
		},
		neighborSecond: {
			filterName: 'color',
			filterValue: 'white'
		}
	},
	{
		currency: 'bitcoin',
		pet: 'snail'
	},
	{
		color: 'yellow',
		currency: 'ethereum'
	},
	{
		drink: 'milk',
		position: 3
	},
	{
		nation: 'norwegian',
		position: 1
	},
	{
		neighborFirst: {
			filterName: 'currency',
			filterValue: 'stellar',
			side: ['left', 'right']
		},
		neighborSecond: {
			filterName: 'pet',
			filterValue: 'fox'
		}
	},
	{
		neighborFirst: {
			filterName: 'pet',
			filterValue: 'horse',
			side: ['left', 'right']
		},
		neighborSecond: {
			filterName: 'currency',
			filterValue: 'ethereum'
		}
	},
	{
		currency: 'iota',
		drink: 'juice'
	},
	{
		nation: 'japanese',
		currency: 'monero'
	},
	{
		neighborFirst: {
			filterName: 'nation',
			filterValue: 'norwegian',
			side: ['left', 'right']
		},
		neighborSecond: {
			filterName: 'color',
			filterValue: 'blue'
		}
	},
];

const STUFF_COUNT = 3;
// const STUFF_RULES: Rule[] = [
// 	{
// 		job: 'cashier',
// 		position: 1
// 	},
// 	{
// 		job: 'cashier',
// 		family: 'no'
// 	},
// 	{
// 		name: 'Bill',
// 		family: 'sister'
// 	},
// 	{
// 		neighborFirst: {
// 			filterName: 'name',
// 			filterValue: 'Mark',
// 			side: ['right']
// 		},
// 		neighborSecond: {
// 			filterName: 'job',
// 			filterValue: 'collector'
// 		}
// 	},
// 	{
// 		name: 'Mark',
// 		family: 'wife'
// 	},
// ]

let startDate = window.performance.now();;

new Riddle().generate(HOUSES_COUNT)
	.calculate(HOUSES_RULES)
	.shuffleMatching(SHUFFLES_NUMBER)
	// .showResult(true)
	.guess()

let finishDate = window.performance.now();
console.log('Время выполнения', finishDate - startDate, 'мс');
