import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Player from '../Player.vue'

const mountPlayer = (props: Record<string, unknown>) =>
  mount(Player, {
    props: { name: 'Max Mustermann', position: 'Stürmer', nummer: 9, blok: {}, ...props },
    global: { directives: { editable: () => {} } },
  })

describe('Player', () => {
  it('trennt Vor- und Nachname und zeigt die Nummer', () => {
    const text = mountPlayer({}).text()
    expect(text).toContain('9')
    expect(text).toContain('Max')
    expect(text).toContain('Mustermann')
  })

  it('nutzt bei nur einem Namen diesen auch als Nachnamen', () => {
    const wrapper = mountPlayer({ name: 'Pele' })
    expect(wrapper.text().match(/Pele/g)).toHaveLength(2)
  })

  it('verkleinert Storyblok-Bilder', () => {
    const wrapper = mountPlayer({ bild: 'https://a.storyblok.com/f/1/p.jpg' })
    expect(wrapper.find('img').attributes('src')).toContain('/m/600x0/filters:format(webp)')
  })
})
