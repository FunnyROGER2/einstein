import House from "./house";

type BaseFilter = 'color' | 'nation' | 'drink' | 'pet' | 'currency' | 'position' | undefined

interface NeighborFilter {
	filterName: 'color' | 'nation' | 'drink' | 'pet' | 'currency',
	filterValue: string,
	side?: ('left' | 'right')[]
}

export interface Rule {
	[key: string]: number | string | undefined | NeighborFilter,
	position?: number,
	color?: string,
	nation?: string,
	drink?: string,
	pet?: string,
	currency?: string,
	neighborFirst?: NeighborFilter,
	neighborSecond?: NeighborFilter,
};

export default class Riddle {
	private filters = ['position', 'color', 'nation', 'drink', 'pet', 'currency'];
	private isMatched = false;
	private rules: Rule[] = [];
	private additionalRules: Rule[] = [];
	private guessOptions: Rule[] = [];
	private collection: House[] = [];
	private collectionGuess: House[] = [];

	findFilter(filterArgs: [], prop: string): BaseFilter {
		return Object.keys(filterArgs).find(localFilter => {
			return localFilter === prop;
		}) as BaseFilter
	}

	generate(num: number) {
		for (let index = 0; index < num; index++) {
			this.collection.push(new House(this.collection.length))
		}
		return this;
	}

	addRules(rules: Rule[]) {
		rules.forEach(rule => {
			this.additionalRules.push(rule);
		})
		return this;
	}

	hasErrors(log = false, collectionCheck: House[] = this.collection) {
		let errorsFound = false;
		collectionCheck.forEach(house => {
			if (this.checkEmpty(house)) {
				log && console.error('Пустые поля в доме:', house);
				errorsFound = true;
			}
			this.rules.forEach(rule => {
				if (this.checkMatch(house, rule)) {
					log && console.error('Ошибка в правиле:', rule, 'дом' , house.position[0]);
					errorsFound = true;
				}
			});
		})
		return errorsFound;
	}

	showResult(collectionCheck: House[] = this.collection, showHouses = false) {
		collectionCheck.forEach(
			(house) => {
				if (
					house.pet.length === 1 &&
					house.pet[0] === 'zebra' &&
					house.nation.length === 1
				) {
					console.warn(house.nation[0], 'has zebra');
				}
				if (
					house.drink.length === 1 &&
					house.drink[0] === 'water' &&
					house.nation.length === 1
				) {
					console.warn(house.nation[0], 'drinks water');
				}
			}
		)
		showHouses && collectionCheck.forEach(h => {
			console.log(h);
		})

		return this;
	}

	hasSuccess(collectionCheck: House[] = this.collection): boolean {
		return collectionCheck.every(house => (
			Object.keys(house).every(filter => {
				return house[filter].length === 1;
			})
		));
	}

	checkMatch(house: House, rule: Rule): boolean {
		if (rule.neighborFirst || rule.neighborSecond) {
			return false;
		} else {
			const ruleKeys = Object.keys(rule);
			if (
				house[ruleKeys[0]]?.length === 1 &&
				house[ruleKeys[1]]?.length === 1 &&
				(
					this.checkFilter(house, ruleKeys[0] as BaseFilter, rule[ruleKeys[0]]) !==
					this.checkFilter(house, ruleKeys[1] as BaseFilter, rule[ruleKeys[1]])
				)
			) {
				return true;
			}
		}

		return false;
	}

	checkEmpty(house: House) {
		return Object.keys(house).some(filter => (
			!house[filter].length
		))
	}

	guess() {
		const options: { [key: string]: any }[] = [];

		this.collection.forEach(
			house => {
				const houseKeys = Object.keys(house);
				houseKeys.forEach((filters, filtersIndex) => {
					if (house[filters].length === 2) {
						house[filters].forEach(option => {
							let optionObject: {[key: string]: any} = { position: house.position[0] };
							optionObject[houseKeys[filtersIndex]] = option;
							options.push(optionObject);
						});
					}
				})
			}
		);
		this.guessOptions = options;

		console.log('Недостаточно данных, проверим возможные варианты, добавляя свои правила');
		this.shuffleOptions(this.guessOptions);
		return this;
	}

	shuffleOptions(options: { [key: string]: any }[] = []) {
		mainLoop: while (true) {
			this.additionalRules = [];
			this.collectionGuess = JSON.parse(JSON.stringify(this.collection));

			const shuffledOptions = options
				.map(value => ({ value, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.map(({ value }) => value);

			for (const option of shuffledOptions) {
				if (!this.hasErrors(false, this.collectionGuess) && !this.hasSuccess(this.collectionGuess)) {
					console.log('Результатов нет, добавляем ещё одно правило');
					this.addRules([option]);
				} else if (this.hasErrors(false, this.collectionGuess)) {
					console.error('Ошибка. Начинаем заново');
					continue mainLoop;
				} else {
					console.log('Успех!');
					this.showResult(this.collectionGuess, true);
					break mainLoop;
				}
				this.shuffleMatching(10, this.collectionGuess);
			}
		}
	}

	calculate(rules: Rule[]) {
		this.rules = rules;
		this.baseMatching();
		return this;
	}

	baseMatching(rulesForCalculation = [...this.rules, ...this.additionalRules]) {
		rulesForCalculation.forEach(rule => {
			this.match(rule);
		});
		return this;
	}

	reverseMatching(rulesForCalculation = [...this.rules, ...this.additionalRules]) {
		rulesForCalculation.slice().reverse().forEach((rule) => {
			this.match(rule);
		});
		return this;
	}

	shuffleMatching(count: number, collectionCheck: House[] = this.collection, rulesForCalculation = [...this.rules, ...this.additionalRules]) {
		for (let index = 0; index < count; index++) {
			const shuffledArray = rulesForCalculation
				.map(value => ({ value, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.map(({ value }) => value);

			shuffledArray.forEach((rule) => {
				this.match(rule, collectionCheck);
			});
		}
		return this;
	}

	hasNeighborFilterSuccess(house: House, filter: NeighborFilter, isExact = false): boolean {
		return ((house[filter.filterName].length === 1) || isExact) && !!house[filter.filterName].find(value => (filter.filterValue === value));
	}

	filterNeighbors(house: House, filter: NeighborFilter, isInvert = false, collection: House[]) {
		(house[filter.filterName] as string[]) = (house[filter.filterName] as string[]).filter(itemFilter => {
			return isInvert ? itemFilter === filter.filterValue : itemFilter !== filter.filterValue
		});
		if (house[filter.filterName].length === 1) {
			collection.map(neighbor => {
				if (
					house !== neighbor &&
					neighbor[filter.filterName].length > 1 &&
					neighbor[filter.filterName].includes(house[filter.filterName][0])
				) {
					neighbor[filter.filterName] = neighbor[filter.filterName].filter(
						itemFilter => { return itemFilter !== house[filter.filterName][0] }
					)
				}
				return neighbor;
			})
		}
	}

	filterSideNeighbors({
		house,
		firstFilter,
		secondFilter,
		hasArgRightSide,
		collection
	}: {
		house: House,
		firstFilter: NeighborFilter,
		secondFilter: NeighborFilter,
		hasArgRightSide: boolean,
		collection: House[]
	}) {
		house[firstFilter.filterName] = house[firstFilter.filterName].filter(value => {
			const isCorrectPosition = house.position[0] !== (hasArgRightSide ? 1 : collection.length);
			const closestNeighbor = collection.find(h => (
				h.position[0] === (hasArgRightSide ? house.position[0] - 1 : house.position[0] + 1)
			));
			const isCorrectNeighbor = closestNeighbor ? closestNeighbor[secondFilter.filterName].includes(secondFilter.filterValue) : null;
			return (isCorrectPosition && isCorrectNeighbor && value === firstFilter.filterValue) ||
				value !== firstFilter.filterValue
		})
	}

	checkFilter(house: House, filter: BaseFilter, argFilter: string | number | NeighborFilter | undefined): boolean {
		return !!(filter && (house[filter] as []).find(value => (value === argFilter)));
	}

	checkNeighbors(house: House, filter: BaseFilter, argFilter: string | number | undefined, collection: House[]): boolean {
		return !collection.find(neighbor => (
			(neighbor !== house) && filter && (neighbor[filter] as []).find(value => (value === argFilter))
		));
	}

	checkSide(house: House, hasArgLeftSide: boolean, hasArgRightSide: boolean, collection: House[]): boolean {
		return house.position.length === 1 &&
			((hasArgLeftSide && house.position[0] !== 1) ||
			(hasArgRightSide && house.position[0] !== collection.length));
	}

	match({ }: Rule, collectionCheck: House[] = this.collection) {
		collectionCheck.forEach(
			(house: House, houseIndex) => {
				if (!houseIndex) {
					this.isMatched = false;
				}

				// Обычные фильтры
				if (!Object.keys(arguments[0]).includes('neighborFirst')) {
					this.baseMatch(arguments, house, collectionCheck);

					// Фильтры по "соседу"
				} else {
					this.neighborsMatch(arguments, house, collectionCheck);
				}
			}
		);

		return this;
	}

	baseMatch(args: IArguments, house: House, collection: House[]) {
		let firstFilter: BaseFilter = undefined;
		let secondFilter: BaseFilter = undefined;

		// Узнаем, какие фильтры получили
		this.filters.forEach(
			prop => {
				if (Object.keys(args[0]).includes(prop) && !firstFilter) {
					firstFilter = this.findFilter(args[0], prop);
				} else if (Object.keys(args[0]).includes(prop) && !secondFilter) {
					secondFilter = this.findFilter(args[0], prop);
				}
			}
		);

		const argFirstFilter = firstFilter && args[0][firstFilter];
		const argSecondFilter = secondFilter && args[0][secondFilter];

		// Фильтруем коллекцию
		if (
			this.checkFilter(house, firstFilter, argFirstFilter) &&
			this.checkFilter(house, secondFilter, argSecondFilter) &&
			(this.checkNeighbors(house, firstFilter, argFirstFilter, collection) || this.checkNeighbors(house, secondFilter, argSecondFilter, collection)) &&
			!this.isMatched
		) {
			// Если нашли полное совпадение

			firstFilter && argFirstFilter ? (house[firstFilter] as string[]) = [argFirstFilter] : null;
			secondFilter && argSecondFilter ? (house[secondFilter] as string[]) = [argSecondFilter] : null;

			this.isMatched = true;

			collection.map(neighbor => {
				if (house !== neighbor) {
					firstFilter ? (neighbor[firstFilter] as string[]) = (neighbor[firstFilter] as string[]).filter(itemFilter => { return itemFilter !== argFirstFilter }) : null;
					secondFilter ? (neighbor[secondFilter] as string[]) = (neighbor[secondFilter] as string[]).filter(itemFilter => { return itemFilter !== argSecondFilter }) : null;
				}
				return neighbor;
			});
		} else {
			if (
				!this.checkFilter(house, firstFilter, argFirstFilter) &&
				this.checkFilter(house, secondFilter, argSecondFilter)
			) {
				secondFilter ? (house[secondFilter] as string[]) = (house[secondFilter] as string[]).filter(value => (value !== argSecondFilter)) : null;
			}
			if (
				this.checkFilter(house, firstFilter, argFirstFilter) &&
				!this.checkFilter(house, secondFilter, argSecondFilter)
			) {
				firstFilter ? (house[firstFilter] as string[]) = (house[firstFilter] as string[]).filter(value => (value !== argFirstFilter)) : null;
			}
		}

		return this;
	}

	neighborsMatch(args: IArguments, house: House, collection: House[]) {
		const argNeighborFirstFilter: NeighborFilter = args[0]['neighborFirst'];
		const argNeighborSecondFilter: NeighborFilter = args[0]['neighborSecond'];
		const hasArgLeftSide = !!argNeighborFirstFilter.side?.find(pos => pos === 'left');
		const hasArgRightSide = !!argNeighborFirstFilter.side?.find(pos => pos === 'right');

		let neighborFiltered: House | undefined;

		let hasCurrentHouseFirstFilterSuccess = this.hasNeighborFilterSuccess(house, argNeighborFirstFilter);
		let hasCurrentHouseSecondFilterSuccess = this.hasNeighborFilterSuccess(house, argNeighborSecondFilter);

		// Если "сосед" имеет указанное свойство, текущий дом его не имеет.
		// Если после этого для текущего что-то выяснилось — фильтруем остальные
		if (hasCurrentHouseFirstFilterSuccess) {
			this.filterNeighbors(house, argNeighborSecondFilter, false, collection);
		} else if (hasCurrentHouseSecondFilterSuccess) {
			this.filterNeighbors(house, argNeighborFirstFilter, false, collection);
		}

		// Если "сосед" должен быть только с одной стороны, фильтруем все дома соответствующим образом
		if ((hasArgLeftSide && !hasArgRightSide) || (!hasArgLeftSide && hasArgRightSide)) {
			this.filterSideNeighbors({
				house,
				firstFilter: argNeighborFirstFilter,
				secondFilter: argNeighborSecondFilter,
				hasArgRightSide,
				collection
			});
			this.filterSideNeighbors({
				house,
				firstFilter: argNeighborSecondFilter,
				secondFilter: argNeighborFirstFilter,
				hasArgRightSide: hasArgLeftSide,
				collection
			});
		}

		hasCurrentHouseSecondFilterSuccess = this.hasNeighborFilterSuccess(house, argNeighborSecondFilter);
		hasCurrentHouseFirstFilterSuccess = this.hasNeighborFilterSuccess(house, argNeighborFirstFilter);

		if (hasCurrentHouseFirstFilterSuccess || hasCurrentHouseSecondFilterSuccess) {
			neighborFiltered = collection.find(neighbor =>
				neighbor !== house &&
				(this.checkSide(neighbor, hasArgLeftSide, hasArgRightSide, collection) || this.checkSide(house, hasArgLeftSide, hasArgRightSide, collection)) &&
				(Math.abs(neighbor.position[0] - house.position[0]) === 1) &&
				(
					hasCurrentHouseFirstFilterSuccess && this.hasNeighborFilterSuccess(neighbor, argNeighborSecondFilter, true) ||
					hasCurrentHouseSecondFilterSuccess && this.hasNeighborFilterSuccess(neighbor, argNeighborFirstFilter, true)
				)
			);

			if (neighborFiltered) {
				this.filterNeighbors(neighborFiltered, hasCurrentHouseFirstFilterSuccess ? argNeighborSecondFilter : argNeighborFirstFilter, true, collection);
			}
		}

		return this;
	}
}
