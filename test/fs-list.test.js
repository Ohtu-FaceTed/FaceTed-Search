/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import {expect, fixture} from '@open-wc/testing';
import sinon from 'sinon';

import '../src/fs-list';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let elem;

describe('List element test suite', () => {
    before(async () => {
        elem = await fixture('<fs-list></fs-list>');
    });

    it('is hidden until there are results to show', () => {
        expect(elem.hidden).to.be.equal(true);
    });

    it('finds data from api', async () => {
        expect(elem.data).to.be.equal(null);
        await sleep(1000);

        expect(elem.data).to.be.not.equal(null);
    });

    it('renders 10 list items after fetch', () => {
        const lis = elem.shadowRoot.querySelectorAll('li');

        expect(lis.length).to.be.equal(10);
    });


    it('sends detail event on click', async () => {
        const eventspy = sinon.spy();
        elem.addEventListener('tkshowdetail', eventspy);

        const li = elem.shadowRoot.querySelector('li');
        li.click();

        expect(eventspy.called).to.equal(true);
    });

    it('updates list based on scores', async () => {
        // fetch and construct some test data
        let data = await elem.fetchData();
        data = data.filter((item) => item.level === 3 && item.code !== '1919');
        data = data.map((item, i) => {
            return {
                class_name: item.classificationItemNames[0].name,
                class_id: item.code,
                score: i,
            };
        });
        // add a duplicate
        data.push({class_id: '1912', class_name: 'asd', score: 0});
        const event = {
            detail: data,
        };
        elem.updateScores(event);
        const li = elem.shadowRoot.querySelector('li');

        // 1912 is the last one on the list
        // so it has highest score so it should be the first one displayed
        expect(li.id).to.equal('1912');
    });
});
