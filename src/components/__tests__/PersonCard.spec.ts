import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PersonCard from '../PersonCard.vue'

describe('PersonCard', () => {
  it('zeigt Name, Rolle, Bild und Kontaktlinks', () => {
    const wrapper = mount(PersonCard, {
      props: {
        person: {
          _uid: '1',
          name: 'Max Mustermann',
          role: 'Trainer',
          image: { filename: 'https://example.com/max.jpg' },
          email: 'max@example.com',
          phone: '0123 456',
        },
      },
    })
    expect(wrapper.text()).toContain('Max Mustermann')
    expect(wrapper.text()).toContain('Trainer')
    expect(wrapper.find('img').attributes('alt')).toBe('Max Mustermann')
    expect(wrapper.find('a[href="mailto:max@example.com"]').exists()).toBe(true)
    expect(wrapper.find('a[href="tel:0123 456"]').exists()).toBe(true)
  })

  it('zeigt ohne Bild und Kontaktdaten nur den Namen', () => {
    const wrapper = mount(PersonCard, { props: { person: { _uid: '2', name: 'Erika' } } })
    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('a').exists()).toBe(false)
  })
})
