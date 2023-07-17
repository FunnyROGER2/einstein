import Riddle, { Rule } from "./riddle";

export const SHUFFLES_NUMBER = 10;

const COUNT = 5;
const RULES: Rule[] = [
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

let startDate = window.performance.now();;

new Riddle().generate(COUNT)
	.calculate(RULES)
	// .baseMatching()
	// .reverseMatching()
	.shuffleMatching(SHUFFLES_NUMBER)
	// .addRules([
	// 	{
	// 		position: 3,
	// 		color: 'red'
	// 	},
	// 	{
	// 		position: 2,
	// 		nation: 'ukrainian'
	// 	},
	// ])
	.guess()
	// .shuffleMatching(10)


let finishDate = window.performance.now();
console.log(+finishDate - +startDate);

