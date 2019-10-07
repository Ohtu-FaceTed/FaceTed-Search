/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */

import {expect, fixture} from '@open-wc/testing';
import sinon from 'sinon';

import '../src/fs-question';

let element;

describe('question test', async () => {
    before(async () => {
        element = await fixture('<fs-question></fs-question');
    });

    it('gets initial question from backend', async () => {
        expect(element.question).to.be.equal(null);
        await sleep(1000);

        expect(element.question).to.be.not.equal(null);
    });

    it('has three answer buttons', async () => {
        const buttons = element.shadowRoot.querySelectorAll('button');

        expect(buttons.length).to.equal(3);
    });

    it('event listener added to buttons', async () => {
        const okButton = element.shadowRoot.querySelector('.ok');
        const okSpy = sinon.spy(okButton, 'addEventListener');

        const noButton = element.shadowRoot.querySelector('.no');
        const noSpy = sinon.spy(noButton, 'addEventListener');

        const skipButton = element.shadowRoot.querySelector('.skip');
        const skipSpy = sinon.spy(skipButton, 'addEventListener');
        element.addEventListeners();

        expect(okSpy.calledWith('click')).to.equal(true);
        expect(noSpy.calledWith('click')).to.equal(true);
        expect(skipSpy.calledWith('click')).to.equal(true);
    });

    it('it should dispatch event', async () => {
        const eventspy = sinon.spy();
        element.addEventListener('updateScores', eventspy);
        element.reply = {
            new_question: [],
            building_classes: [],
        };

        element.updateClasses();

        expect(eventspy.called).to.equal(true);
        element.reply = null;
    });

    it('gets reply from backend', async () => {
        expect(element.reply).to.be.equal(null);
        const okButton = element.shadowRoot.querySelector('.ok');
        okButton.click();
        await sleep(1500);

        expect(element.reply).to.be.not.equal(null);
    });

    it('question changes after answer is provided', async () => {
        const question = element.question.attribute_name;
        const noButton = element.shadowRoot.querySelector('.no');
        noButton.click();
        await sleep(1500);

        expect(element.question.attribute_name).to.be.not.equal(question);
    });

    it('provides new question with skip', async () => {
        const question = element.question.attribute_name;
        const skipButton = element.shadowRoot.querySelector('.skip');
        skipButton.click();
        await sleep(1500);

        expect(element.question.attribute_name).to.be.not.equal(question);
    });
});

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
