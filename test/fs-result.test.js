/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import {expect, fixture} from '@open-wc/testing';
import sinon from 'sinon';

import '../src/fs-result';
import {classifications, mockResponse} from './data';

let elem;
let apiData;

describe('List element test suite', () => {
    before(async () => {
        sinon.stub(window, 'fetch').resolves(mockResponse(classifications));

        elem = await fixture('<fs-result></fs-result>');
        apiData = classifications;
    });

    after(() => {
        window.fetch.restore();
    });

    it('has fetched data', () => {
        expect(elem.data).to.not.equal(null);
    });

    it('renders 10 rows after fetch', () => {
        const rows = elem.shadowRoot.querySelectorAll('tr');

        expect(rows.length).to.be.equal(10);
    });

    it('sends detail event on click', () => {
        const eventspy = sinon.spy();
        elem.addEventListener('showDetails', eventspy);

        const firstRow = elem.shadowRoot.querySelector('td');
        firstRow.click();

        expect(firstRow).to.have.class('selected');
        expect(eventspy.called).to.equal(true);
    });

    it('updates list based on scores', () => {
        // construct some test data
        let data = apiData.filter((item) => item.level === 3 && item.code !== '1919');
        data = data.map((item, i) => {
            return {
                class_name: item.classificationItemNames[0].name,
                class_id: item.code,
                score: i,
            };
        });
        // add a duplicate
        data.push({class_id: '0512', class_name: 'asd', score: 0});
        const event = {
            detail: data,
        };
        elem.updateScores(event);
        const firstRow = elem.shadowRoot.querySelector('td');

        // 0512 is the last one on the list
        // so it has highest score so it should be the first one displayed
        expect(firstRow.id).to.equal('id0512');
    });

    it('sends complex objects correctly', () => {
        // generate test data
        let data = apiData.filter((item) => item.level === 3 && item.code !== '1919');
        data = data.map((item, i) => {
            return {
                class_name: item.classificationItemNames[0].name,
                class_id: item.code,
                score: i,
            };
        });
        // 0512 has fields ex ja inca so we want it on top of list
        data.find((item) => item.class_id === '0512').score = 999;
        const event = {
            detail: data,
        };
        elem.updateScores(event);
        const firstRow = elem.shadowRoot.querySelector('td');
        // check we got the correct one
        expect(firstRow.id).to.equal('id0512');

        const eventspy = sinon.spy();
        elem.addEventListener('showDetails', eventspy);
        firstRow.click();

        expect(eventspy.called).to.equal(true);
    });

    it('is hidden if no data is provided', () => {
        const event = {
            detail: null,
        };
        elem.updateScores(event);

        expect(elem.hidden).to.equal(true);
    });
});
