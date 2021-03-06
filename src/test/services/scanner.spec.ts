'use strict';

import * as assert from 'assert';

import { StorageService } from '../../services/storage';
import { ConfigService } from '../../services/config';
import { ScannerService } from '../../services/scanner';

import { IOptions } from '../../emitty';

const options = <IOptions>{
	scanner: {
		depth: 30,
		exclude: ['.git', '**/node_modules', '**/bower_components']
	}
};

describe('Services/Scanner', () => {

	let storage: StorageService;

	beforeEach(() => {
		storage = new StorageService();
	});

	it('Scan directory', () => {
		const config = new ConfigService('pug');
		const scanner = new ScannerService('fixtures', storage, config.getConfig(), options);

		return scanner.scan().then(() => {
			assert.equal(storage.keys().length, 5);

			assert.ok(storage.keys().indexOf('fixtures/pug/parser.pug') !== -1);
			assert.deepEqual(storage.get('fixtures/pug/a.pug').dependencies, [
				'fixtures/pug/b.pug',
				'fixtures/pug/c.pug'
			]);
		});
	});

	it('Scan File', () => {
		const config = new ConfigService('pug');
		const scanner = new ScannerService('fixtures', storage, config.getConfig(), options);

		return scanner.scan('fixtures/pug/parser.pug').then(() => {
			assert.equal(storage.keys().length, 5);
			assert.ok(storage.keys().indexOf('fixtures/pug/parser.pug') !== -1);
		});
	});

	it('Scan File with partials', () => {
		const config = new ConfigService('sass');
		const scanner = new ScannerService('fixtures', storage, config.getConfig(), options);

		return scanner.scan('fixtures/sass/parser.sass').then(() => {
			const dependencies = storage.get('fixtures/sass/parser.sass').dependencies;

			assert.equal(dependencies.length, 12);
			assert.ok(storage.keys().indexOf('fixtures/sass/parser.sass') !== -1);
			assert.ok(dependencies.indexOf('fixtures/sass/_test-0.sass') !== -1);
		});
	});

});
