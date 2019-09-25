/* eslint-disable no-unused-expressions */
import {fixture, expect} from '@open-wc/testing';

import '../src/fs-detail';

describe('test1', () => {
    it('has by default an empty string as content', async () => {
        const el = await fixture('<fs-detail></fs-detail>');

        expect(el.label).to.equal('');
    });
});

describe('classification test', () => {
    it('has by default a null value as classification', async () => {
        const el = await fixture('<fs-detail></fs-detail>');

        expect(el.classification).to.equal(null);
    });
});