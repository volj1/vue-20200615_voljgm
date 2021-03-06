const { shallowMount } = require('@vue/test-utils');
const { getSolutionPath } = require('taskbook-test-utils');
const CounterButton = require(getSolutionPath('components/CounterButton.vue'))
  .default;

describe('6-module-1-task', () => {
  describe('CounterButton', () => {
    it('Компонент должен иметь необязательный числовой параметр count со значением 0 по умолчанию', () => {
      const wrapper = shallowMount(CounterButton);
      expect(wrapper.vm.$options.props.count.type).toBe(Number);
      expect(wrapper.vm.$options.props.count.required).toBeFalsy();
      expect(wrapper.vm.$options.props.count.default).toBe(0);
    });

    it.each([1, 42, 2020])(
      'Компонент должен рендерить кнопку со значением счётчика(%i)',
      (count) => {
        const wrapper = shallowMount(CounterButton, {
          propsData: { count },
        });
        expect(wrapper.find('button').exists()).toBe(true);
        expect(wrapper.text()).toBe(count.toString());
      },
    );

    it('При клике компонент должен порождать событие `increment` с увеличенным на 1 значением счётчика', async () => {
      const wrapper = shallowMount(CounterButton, {
        propsData: { count: 1 },
      });
      const button = wrapper.find('button');

      await button.trigger('click');
      expect(wrapper.emitted().increment).toBeTruthy();
      expect(wrapper.emitted().increment.length).toBe(1);
      expect(wrapper.emitted().increment[0]).toEqual([2]);
    });

    it('Компонент должен выводить новое значение счётчика при обновления параметра count', async () => {
      const wrapper = shallowMount(CounterButton, {
        propsData: { count: 1 },
      });
      wrapper.setProps({ count: 2 });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toBe('2');
    });

    it('Компонент должен выводить новое значение счётчика после клика', async () => {
      const wrapper = shallowMount(CounterButton, {
        propsData: { count: 1 },
      });
      await wrapper.find('button').trigger('click');
      expect(wrapper.text()).toBe('2');
    });

    it('Значение счётчика должно увеличиться на три после трёх кликов без v-model и count', async () => {
      const wrapper = shallowMount(CounterButton);
      const button = wrapper.find('button');
      await button.trigger('click');
      await button.trigger('click');
      await button.trigger('click');
      expect(wrapper.emitted().increment).toBeTruthy();
      expect(wrapper.emitted().increment.length).toBe(3);
      expect(wrapper.emitted().increment).toEqual([[1], [2], [3]]);
    });

    it('Компонент должен выводить значение счётчика при обновления параметра count после кликов', async () => {
      const wrapper = shallowMount(CounterButton, {
        propsData: { count: 2 },
      });
      const button = wrapper.find('button');
      await button.trigger('click');
      await button.trigger('click');
      await button.trigger('click');
      wrapper.setProps({ count: 1 });
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toBe('1');
    });
  });
});
