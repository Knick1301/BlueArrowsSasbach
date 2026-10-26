<script setup lang="ts">
import { useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'
import { computed, nextTick, reactive, ref } from 'vue'
import KontaktBlock from '@/components/KontaktBlock.vue'
import { useDaniel } from '@/utils/kontakt'
import {
  ERFAHRUNG,
  ERWACHSENENKURS,
  GESCHLECHTER,
  LEIHAUSRUESTUNG,
  MAX_LAENGE,
  MAX_LAENGE_NACHRICHT,
  WOCHENTAGE,
  brauchtLeihDetails,
  leereAnmeldung,
  validiereAnmeldung,
  type AnmeldungsFehler,
} from '@/utils/laufschulAnmeldung'

const API_URL = import.meta.env.VITE_ANMELDUNG_API_URL || '/api/anmeldung'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`skating/laufschule`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "skating/laufschule" konnte nicht geladen werden.', e)
}

const daniel = await useDaniel()

const formular = reactive(leereAnmeldung())
const fehler = ref<AnmeldungsFehler>({})
const status = ref<'bereit' | 'sendet' | 'erfolg' | 'fehler'>('bereit')

const heute = new Date().toLocaleDateString('sv-SE')
const zeigeLeihDetails = computed(() => brauchtLeihDetails(formular.leihausruestung))

const absenden = async () => {
  fehler.value = validiereAnmeldung(formular)
  if (Object.keys(fehler.value).length > 0) {
    await nextTick()
    document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
    return
  }

  status.value = 'sendet'
  try {
    const antwort = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formular, warteliste: !!story?.value?.content?.fullyBooked }),
    })
    const daten = await antwort.json().catch(() => null)
    if (!antwort.ok || !daten?.ok) {
      if (daten?.fehler) fehler.value = daten.fehler
      throw new Error(daten?.error ?? `HTTP ${antwort.status}`)
    }
    status.value = 'erfolg'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e) {
    console.error('Laufschul-Anmeldung konnte nicht gesendet werden.', e)
    status.value = 'fehler'
  }
}

const neueAnmeldung = () => {
  const { erziehungsberechtigter, telefon, email, wohnort } = formular
  Object.assign(formular, leereAnmeldung(), { erziehungsberechtigter, telefon, email, wohnort })
  fehler.value = {}
  status.value = 'bereit'
}

const eingabeKlasse = (feld: keyof AnmeldungsFehler) => [
  'w-full rounded-lg border-2 bg-white px-3 py-2 text-gray-800 font-medium focus:outline-none focus:border-[#032650] transition-colors',
  fehler.value[feld] ? 'border-red-500' : 'border-gray-200',
]
const labelKlasse = 'block text-[#032650] font-bold mb-1'
const auswahlKlasse =
  'flex items-center gap-3 rounded-lg border-2 border-gray-200 px-3 py-2 cursor-pointer font-medium text-gray-700 hover:border-[#032650] has-[:checked]:border-[#032650] has-[:checked]:bg-[#f0f7fd] has-[:checked]:text-[#032650] transition-colors'
const fehlerKlasse = 'mt-1 text-sm font-bold text-red-600'
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">Anmeldung Laufschule</h1>
    </div>

    <div class="max-w-4xl w-[95%] mx-auto mt-15 px-4">
      <div
        class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8 md:p-10 text-gray-800">
        <div
          class="absolute -top-2 -left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-[#032650] rounded-tl-md pointer-events-none">
        </div>
        <div
          class="absolute -top-2 -right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-[#032650] rounded-tr-md pointer-events-none">
        </div>
        <div
          class="absolute -bottom-2 -left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-[#032650] rounded-bl-md pointer-events-none">
        </div>
        <div
          class="absolute -bottom-2 -right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-[#032650] rounded-br-md pointer-events-none">
        </div>

        <div v-if="status === 'erfolg'" class="text-center py-6">
          <h2
            class="text-[#032650] text-2xl font-black uppercase tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1">
            Danke für die Anmeldung!
          </h2>
          <p class="text-lg font-medium text-gray-700 leading-relaxed max-w-xl mx-auto mb-8">
            <template v-if="story?.content?.fullyBooked">
              Euer Kind steht jetzt auf der Warteliste. Wir melden uns, sobald ein Platz frei wird.
            </template>
            <template v-else>
              Wir haben die Anmeldung erhalten und melden uns, sobald die Gruppen eingeteilt sind.
            </template>
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-3">
            <button type="button"
              class="bg-[#032650] text-white px-4 py-2 rounded font-bold hover:bg-blue-900 transition-colors text-sm cursor-pointer"
              @click="neueAnmeldung">
              Weiteres Kind anmelden
            </button>
            <router-link :to="{ name: 'laufschule' }"
              class="border-1 border-gray-200 text-gray-700 px-4 py-2 rounded font-bold hover:bg-gray-100 transition-colors text-sm">
              Zurück zur Laufschule
            </router-link>
          </div>
        </div>

        <template v-else>
          <h2
            class="text-[#032650] text-2xl sm:text-3xl font-black mt-0 uppercase tracking-wide mb-4 border-b-[3px] border-[#032650] inline-block pb-1">
            Laufschule 2026
          </h2>

          <div v-if="story?.content?.fullyBooked"
            class="bg-orange-50 border border-orange-200 text-orange-800 px-4 py-3 mb-6 font-bold text-base rounded-lg">
            Aktuell sind alle Kurse voll belegt! Mit diesem Formular kommt ihr auf die Warteliste.
          </div>

          <p class="mb-4 text-lg font-medium text-gray-700 leading-relaxed">
            Liebe Eltern, über dieses Formular könnt ihr eure Kinder für die Laufschule anmelden.
            Wir teilen die Kinder nach Alter und Können in Gruppen ein. Bitte gebt alle Wochentage
            an, an denen euer Kind Zeit hätte.
          </p>
          <p class="mb-6 text-gray-600 font-medium leading-relaxed">
            Voraussichtlicher Start ist im März, das Ende Mitte November. In den Pfingst- und
            Sommerferien pausiert die Laufschule.
          </p>

          <KontaktBlock :person="daniel" class="mb-10" />

          <form novalidate class="space-y-10" @submit.prevent="absenden">
            <div class="absolute -left-[9999px]" aria-hidden="true">
              <label for="website">Website</label>
              <input id="website" v-model="formular.website" type="text" name="website" tabindex="-1"
                autocomplete="off" />
            </div>

            <fieldset>
              <legend class="text-gray-500 text-sm font-black uppercase tracking-widest mb-4">
                Angaben zum Kind
              </legend>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label for="vorname" :class="labelKlasse">Vorname *</label>
                  <input id="vorname" v-model="formular.vorname" type="text" autocomplete="off" :maxlength="MAX_LAENGE"
                    :aria-invalid="!!fehler.vorname" :class="eingabeKlasse('vorname')" />
                  <p v-if="fehler.vorname" :class="fehlerKlasse">{{ fehler.vorname }}</p>
                </div>
                <div>
                  <label for="name" :class="labelKlasse">Nachname *</label>
                  <input id="name" v-model="formular.name" type="text" autocomplete="off" :maxlength="MAX_LAENGE"
                    :aria-invalid="!!fehler.name" :class="eingabeKlasse('name')" />
                  <p v-if="fehler.name" :class="fehlerKlasse">{{ fehler.name }}</p>
                </div>
                <div>
                  <label for="geburtsdatum" :class="labelKlasse">Geburtsdatum *</label>
                  <input id="geburtsdatum" v-model="formular.geburtsdatum" type="date" :max="heute"
                    :aria-invalid="!!fehler.geburtsdatum" :class="eingabeKlasse('geburtsdatum')" />
                  <p v-if="fehler.geburtsdatum" :class="fehlerKlasse">
                    {{ fehler.geburtsdatum }}
                  </p>
                </div>
                <fieldset>
                  <legend :class="labelKlasse">Geschlecht *</legend>
                  <div class="grid grid-cols-2 gap-3">
                    <label v-for="option in GESCHLECHTER" :key="option" :class="auswahlKlasse">
                      <input v-model="formular.geschlecht" type="radio" name="geschlecht" :value="option"
                        :aria-invalid="!!fehler.geschlecht" class="accent-[#032650] w-4 h-4" />
                      {{ option }}
                    </label>
                  </div>
                  <p v-if="fehler.geschlecht" :class="fehlerKlasse">{{ fehler.geschlecht }}</p>
                </fieldset>
              </div>
            </fieldset>

            <fieldset>
              <legend class="text-gray-500 text-sm font-black uppercase tracking-widest mb-4">
                Kontakt der Eltern
              </legend>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="sm:col-span-2">
                  <label for="erziehungsberechtigter" :class="labelKlasse">
                    Name des Erziehungsberechtigten *
                  </label>
                  <input id="erziehungsberechtigter" v-model="formular.erziehungsberechtigter" type="text"
                    autocomplete="name" :maxlength="MAX_LAENGE" :aria-invalid="!!fehler.erziehungsberechtigter"
                    :class="eingabeKlasse('erziehungsberechtigter')" />
                  <p v-if="fehler.erziehungsberechtigter" :class="fehlerKlasse">
                    {{ fehler.erziehungsberechtigter }}
                  </p>
                </div>
                <div>
                  <label for="telefon" :class="labelKlasse">Handynummer *</label>
                  <input id="telefon" v-model="formular.telefon" type="tel" autocomplete="tel" :maxlength="MAX_LAENGE"
                    :aria-invalid="!!fehler.telefon" :class="eingabeKlasse('telefon')" />
                  <p v-if="fehler.telefon" :class="fehlerKlasse">{{ fehler.telefon }}</p>
                </div>
                <div>
                  <label for="email" :class="labelKlasse">E-Mail-Adresse *</label>
                  <input id="email" v-model="formular.email" type="email" autocomplete="email" :maxlength="MAX_LAENGE"
                    :aria-invalid="!!fehler.email" :class="eingabeKlasse('email')" />
                  <p v-if="fehler.email" :class="fehlerKlasse">{{ fehler.email }}</p>
                </div>
                <div class="sm:col-span-2">
                  <label for="wohnort" :class="labelKlasse">Wohnort *</label>
                  <input id="wohnort" v-model="formular.wohnort" type="text" autocomplete="address-level2"
                    :maxlength="MAX_LAENGE" :aria-invalid="!!fehler.wohnort" :class="eingabeKlasse('wohnort')" />
                  <p v-if="fehler.wohnort" :class="fehlerKlasse">{{ fehler.wohnort }}</p>
                </div>
              </div>
            </fieldset>

            <fieldset>
              <legend class="text-gray-500 text-sm font-black uppercase tracking-widest mb-4">
                Laufschule
              </legend>
              <div class="space-y-6">
                <fieldset>
                  <legend :class="labelKlasse">Erfahrung auf Skates *</legend>
                  <div class="grid grid-cols-1 gap-3">
                    <label v-for="option in ERFAHRUNG" :key="option" :class="auswahlKlasse">
                      <input v-model="formular.erfahrung" type="radio" name="erfahrung" :value="option"
                        :aria-invalid="!!fehler.erfahrung" class="accent-[#032650] w-4 h-4 shrink-0" />
                      {{ option }}
                    </label>
                  </div>
                  <p v-if="fehler.erfahrung" :class="fehlerKlasse">{{ fehler.erfahrung }}</p>
                </fieldset>

                <fieldset>
                  <legend :class="labelKlasse">An welchen Tagen könnte euer Kind? *</legend>
                  <p class="text-sm text-gray-500 font-medium mb-2">
                    Bitte alle möglichen Tage auswählen (Anfänger 17:40 Uhr, Fortgeschrittene 18:25
                    Uhr).
                  </p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label v-for="tag in WOCHENTAGE" :key="tag" :class="auswahlKlasse">
                      <input v-model="formular.wochentage" type="checkbox" :value="tag"
                        :aria-invalid="!!fehler.wochentage" class="accent-[#032650] w-4 h-4 shrink-0" />
                      {{ tag }}
                    </label>
                  </div>
                  <p v-if="fehler.wochentage" :class="fehlerKlasse">{{ fehler.wochentage }}</p>
                </fieldset>

                <fieldset>
                  <legend :class="labelKlasse">Mein Kind benötigt Leihausrüstung</legend>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label v-for="teil in LEIHAUSRUESTUNG" :key="teil" :class="auswahlKlasse">
                      <input v-model="formular.leihausruestung" type="checkbox" :value="teil"
                        class="accent-[#032650] w-4 h-4 shrink-0" />
                      {{ teil }}
                    </label>
                  </div>
                  <p v-if="fehler.leihausruestung" :class="fehlerKlasse">
                    {{ fehler.leihausruestung }}
                  </p>
                  <div v-if="zeigeLeihDetails" class="mt-3">
                    <label for="leihDetails" :class="labelKlasse">
                      Schuhgröße bzw. was wird benötigt? *
                    </label>
                    <input id="leihDetails" v-model="formular.leihDetails" type="text" :maxlength="MAX_LAENGE"
                      :aria-invalid="!!fehler.leihDetails" :class="eingabeKlasse('leihDetails')" />
                    <p v-if="fehler.leihDetails" :class="fehlerKlasse">
                      {{ fehler.leihDetails }}
                    </p>
                  </div>
                </fieldset>

                <fieldset>
                  <legend :class="labelKlasse">
                    Ich habe Interesse an einem Kurs für Erwachsene *
                  </legend>
                  <div class="grid grid-cols-2 gap-3 sm:max-w-sm">
                    <label v-for="option in ERWACHSENENKURS" :key="option" :class="auswahlKlasse">
                      <input v-model="formular.erwachsenenkurs" type="radio" name="erwachsenenkurs" :value="option"
                        :aria-invalid="!!fehler.erwachsenenkurs" class="accent-[#032650] w-4 h-4" />
                      {{ option }}
                    </label>
                  </div>
                  <p v-if="fehler.erwachsenenkurs" :class="fehlerKlasse">
                    {{ fehler.erwachsenenkurs }}
                  </p>
                </fieldset>

                <div>
                  <label for="nachricht" :class="labelKlasse">Fragen, Anregungen, Wünsche</label>
                  <textarea id="nachricht" v-model="formular.nachricht" rows="4" :maxlength="MAX_LAENGE_NACHRICHT"
                    :aria-invalid="!!fehler.nachricht" :class="eingabeKlasse('nachricht')"></textarea>
                  <p v-if="fehler.nachricht" :class="fehlerKlasse">{{ fehler.nachricht }}</p>
                </div>
              </div>
            </fieldset>

            <div class="border-t-2 border-gray-200 pt-8">
              <label class="flex items-start gap-3 cursor-pointer text-gray-700 font-medium">
                <input v-model="formular.datenschutz" type="checkbox" :aria-invalid="!!fehler.datenschutz"
                  class="accent-[#032650] w-4 h-4 mt-1 shrink-0" />
                <span>
                  Ich bin erziehungsberechtigt und einverstanden, dass die Angaben zur Organisation
                  der Laufschule verwendet werden. Mehr dazu in der
                  <router-link :to="{ name: 'datenschutz' }" target="_blank"
                    class="text-blue-600 hover:underline">Datenschutzerklärung</router-link>. *
                </span>
              </label>
              <p v-if="fehler.datenschutz" :class="fehlerKlasse">{{ fehler.datenschutz }}</p>

              <div v-if="status === 'fehler'" role="alert"
                class="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 font-bold rounded-lg">
                Die Anmeldung konnte leider nicht gesendet werden. Bitte versucht es später noch
                einmal oder meldet euch telefonisch bei {{ daniel.name }} ({{ daniel.phone }}).
              </div>

              <button type="submit" :disabled="status === 'sendet'"
                class="mt-6 w-full sm:w-auto bg-[#032650] text-white px-8 py-3 rounded-lg font-black uppercase tracking-wider hover:bg-blue-900 transition-colors disabled:opacity-60 disabled:cursor-wait cursor-pointer">
                {{ status === 'sendet' ? 'Wird gesendet …' : 'Anmeldung absenden' }}
              </button>
              <p class="mt-3 text-sm text-gray-500 font-medium">* Pflichtfeld</p>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>
