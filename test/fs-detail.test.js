/* eslint-disable no-unused-expressions */
import {expect, fixture} from '@open-wc/testing';

import '../src/fs-detail';

let el;

describe('Detail element tests', () => {
    before(async () => {
        el = await fixture('<fs-detail></fs-detail>');
    });

    it('default classification is null', () => {
        expect(el.classification).to.equal(null);
    });

    it('is hidden initially', async () => {
        expect(el.hidden).to.equal(true);
    });

    it('renders correctly when it contains data', () => {
        const classification = {
            code: '0110',
            name: 'Omakotitalot',
            note: 'Pientalot, joissa on yksi asuinhuoneisto.',
        };
        const data = {
            detail: classification,
        };
        el.updateDetail(data);

        const nameh3 = el.shadowRoot.querySelector('h3');
        const includes = el.shadowRoot.querySelector('.includes');

        expect(el.hidden).to.equal(false);
        expect(nameh3).to.contain.html('0110 Omakotitalot');
        expect(includes).to.equal(null);
    });

    it('renders all fields correctly', async () => {
        const classification = {
            code: '0110',
            name: 'Omakotitalot',
            note: 'Pientalot, joissa on yksi asuinhuoneisto.',
            includes: ['pientalot'],
            excludes: ['kerrostalot'],
            includesAlso: ['luhtitalot'],
            keywords: 'yhden asunnon talo, yksiasuntoinen pientalo, yhden asunnon pientalo, yhden asuinhuoneiston talo, townhouse-talo, kaupunkipientalo',
        };
        const data = {
            detail: classification,
        };
        el.updateDetail(data);
        const sr = el.shadowRoot;

        expect(sr.querySelector('.note')).to.contain.html('Pientalot, joissa on yksi asuinhuoneisto.');
        expect(sr.querySelector('.includes')).to.contain.html('pientalot');
        expect(sr.querySelector('.excludes')).to.contain.html('kerrostalot');
        expect(sr.querySelector('.includesAlso')).to.contain.html('luhtitalot');
        expect(sr.querySelector('.keywords')).to.contain.html('townhouse-talo');
    });
});
