export default class House {
	[key: string]: string[] | number[];
	position: number[] = [0];
	color = ['red', 'green', 'blue', 'white', 'yellow'];
	nation = ['norwegian', 'spanish', 'english', 'ukrainian', 'japanese'];
	drink = ['tea', 'coffee', 'juice', 'milk', 'water'];
	pet = ['snail', 'dog', 'horse', 'fox', 'zebra'];
	currency = ['bitcoin', 'ethereum', 'iota', 'monero', 'stellar'];

	constructor(num: number) {
		this.position = [num + 1];
	}
}
