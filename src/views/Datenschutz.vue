<script setup lang="ts">
import { renderRichText, useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
  story = await useStoryblok(`datenschutz`, { version: STORYBLOK_VERSION })
} catch (e) {
  console.error('Storyblok-Story "datenschutz" konnte nicht geladen werden.', e)
}

// Ersatztext, falls die Storyblok-Story "datenschutz" nicht geladen werden kann.
// Bei Änderungen in Storyblok hier mitpflegen.
const fallbackSections: { title: string; paragraphs: string[][] }[] = [
  {
    title: '1. Verantwortlicher',
    paragraphs: [
      ['Verantwortlich für die Datenverarbeitung auf dieser Website ist:'],
      [
        'Inlinehockey Club Blue Arrows Sasbach e. V.',
        'Bühler Straße 25, 77880 Sasbach',
        'vertreten durch Daniel Bühler (1. Vorsitzender)',
        'E-Mail: mail@bluearrows.de',
      ],
      [
        'Kontakt für Datenschutzfragen:',
        'Daniel Bühler',
        'Telefon: 0178 / 47 44 1 44',
        'E-Mail: mail@bluearrows.de',
      ],
    ],
  },
  {
    title: '2. Hosting und Server-Logfiles',
    paragraphs: [
      [
        'Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf der Website erhebt Vercel automatisch Informationen in sogenannten Server-Logfiles, die dein Browser übermittelt (z. B. IP-Adresse, Datum und Uhrzeit der Anfrage, aufgerufene Seite, verwendeter Browser, Betriebssystem, Referrer-URL). Diese Daten sind aus technischen Gründen für die Auslieferung der Website erforderlich und dienen der Erkennung und Abwehr von Missbrauch. Sie werden nur kurzzeitig gespeichert und anschließend automatisch gelöscht. Vercel liefert die Website über ein weltweites Servernetz aus, eine Übermittlung in die USA ist daher möglich. Vercel ist unter dem EU-US Data Privacy Framework zertifiziert, für das die EU-Kommission ein angemessenes Datenschutzniveau festgestellt hat. Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem stabilen und sicheren Betrieb der Website). Weitere Informationen findest du in der Datenschutzerklärung von Vercel.',
      ],
    ],
  },
  {
    title: '3. Bereitstellung der Inhalte (Storyblok)',
    paragraphs: [
      [
        'Die Texte und Bilder dieser Website verwalten wir mit dem Content-Management-System Storyblok der Storyblok GmbH, Linz (Österreich). Beim Aufruf einer Seite lädt dein Browser die Inhalte und Bilder direkt von den Servern von Storyblok. Dabei wird technisch bedingt deine IP-Adresse an Storyblok übermittelt. Storyblok nutzt für die Auslieferung Server und Netzwerke von Dienstleistern, sodass eine Übermittlung in Länder außerhalb der EU nicht ausgeschlossen werden kann. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer zuverlässigen und effizienten Bereitstellung unserer Inhalte). Weitere Informationen findest du in der Datenschutzerklärung von Storyblok.',
      ],
    ],
  },
  {
    title: '4. Spielpläne und Tabellen (ISHD)',
    paragraphs: [
      [
        'Spielpläne, Ergebnisse und Tabellen beziehen wir vom Spielbetrieb des ISHD (ishd.de). Die Abfrage erfolgt über unseren Server, dein Browser stellt dabei keine Verbindung zu ishd.de her. Es werden keine personenbezogenen Daten von dir an den ISHD übermittelt.',
      ],
    ],
  },
  {
    title: '5. Kontaktaufnahme',
    paragraphs: [
      [
        'Wenn du uns per E-Mail oder telefonisch kontaktierst, werden deine Angaben zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen gespeichert. Wir löschen sie, sobald sie dafür nicht mehr benötigt werden und keine gesetzlichen Aufbewahrungspflichten entgegenstehen. Die Kommunikation per E-Mail kann Sicherheitslücken aufweisen. Bitte übermittle uns daher keine besonders vertraulichen Informationen unverschlüsselt per E-Mail. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Wir geben diese Daten nicht ohne deine Einwilligung an Dritte weiter.',
      ],
    ],
  },
  {
    title: '6. Anmeldung zur Laufschule (Microsoft Forms)',
    paragraphs: [
      [
        'Für die Anmeldung zur Laufschule verlinken wir auf ein Online-Formular von Microsoft Forms (Microsoft Ireland Operations Limited). Das Formular öffnet sich erst, wenn du den Link anklickst. Die dort eingegebenen Daten (z. B. Name des Kindes, Kontaktdaten der Eltern) werden auf Servern von Microsoft gespeichert und von uns ausschließlich zur Organisation der Laufschule verwendet. Eine Übermittlung in die USA ist dabei nicht ausgeschlossen, Microsoft stützt sich hierfür auf Standardvertragsklauseln. Wir löschen die Angaben, sobald sie für die Durchführung nicht mehr erforderlich sind. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Durchführung der Anmeldung). Bei Kindern muss die Anmeldung durch einen Erziehungsberechtigten erfolgen. Weitere Informationen findest du in der Datenschutzerklärung von Microsoft.',
      ],
    ],
  },
  {
    title: '7. Cookies und Speicherung im Browser',
    paragraphs: [
      [
        'Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Dienste. Nur in einem Fall legt sie kurzzeitig einen Eintrag im Sitzungsspeicher (sessionStorage) deines Browsers ab: Wurde die Website während deines Besuchs aktualisiert, merkt sie sich, dass eine Seite bereits einmal neu geladen wurde, damit sie nicht wiederholt neu lädt. Der Eintrag enthält keine personenbezogenen Daten und wird beim Schließen des Browser-Tabs gelöscht. Diese Speicherung ist technisch erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG).',
      ],
    ],
  },
  {
    title: '8. Eingebundene Schriftarten',
    paragraphs: [
      [
        'Diese Website nutzt die Schriftarten Inter, Montserrat und Anton. Sie sind lokal auf unserem Server gespeichert und werden von dort geladen. Es findet keine Verbindung zu Servern von Google oder anderen Anbietern statt.',
      ],
    ],
  },
  {
    title: '9. Google Maps (externer Link)',
    paragraphs: [
      [
        'Auf einzelnen Seiten (z. B. Kontakt und Vereinsstätte) verlinken wir auf Google Maps, um dir den Weg zu unserer Vereinsstätte zu zeigen. Es ist keine Karte direkt eingebettet. Erst wenn du aktiv auf den Link klickst, öffnet sich Google Maps in einem neuen Tab, und es werden Daten (u. a. deine IP-Adresse) an Google übertragen. Beim bloßen Aufruf unserer Website findet keine Datenübermittlung an Google statt. Betreiber ist Google Ireland Limited bzw. Google LLC. Weitere Informationen findest du in der Datenschutzerklärung von Google.',
      ],
    ],
  },
  {
    title: '10. Soziale Medien (externe Links)',
    paragraphs: [
      [
        'Wir verlinken auf unsere Auftritte bei Facebook und Instagram. Die Links öffnen die jeweiligen Netzwerke in einem neuen Tab. Es sind keine Social-Plugins eingebunden, die schon beim bloßen Aufruf unserer Website Daten an diese Netzwerke übermitteln. Sobald du einem Link folgst, gelten die Datenschutzbestimmungen des jeweiligen Anbieters.',
      ],
    ],
  },
  {
    title: '11. Fotos auf dieser Website',
    paragraphs: [
      [
        'Auf unserer Website zeigen wir Fotos von Mitgliedern, Spielen und Veranstaltungen. Wir veröffentlichen Fotos nur mit Einwilligung der abgebildeten Personen, bei Minderjährigen mit Einwilligung der Erziehungsberechtigten. Wenn du nicht mehr auf einem Foto zu sehen sein möchtest, genügt eine kurze Nachricht an die oben genannte Kontaktadresse, und wir entfernen das Foto.',
      ],
    ],
  },
  {
    title: '12. Minderjährigenschutz',
    paragraphs: [
      [
        'Personen unter 16 Jahren sollten ohne Zustimmung der Eltern oder Erziehungsberechtigten keine personenbezogenen Daten an uns übermitteln. Wir verarbeiten personenbezogene Daten von Kindern und Jugendlichen nur, soweit sie im Zusammenhang mit deren sportlicher Betätigung stehen (z. B. Meldungen zu Wettbewerben oder Trainingsangeboten). Eine Weitergabe dieser Daten an Dritte erfolgt nur, soweit dies für diese Zwecke erforderlich ist (z. B. Meldung an den Verband).',
      ],
    ],
  },
  {
    title: '13. SSL-/TLS-Verschlüsselung',
    paragraphs: [
      [
        'Diese Website nutzt eine SSL- bzw. TLS-Verschlüsselung zum Schutz der Übertragung. Eine verschlüsselte Verbindung erkennst du am Schloss-Symbol und an „https://“ in der Adresszeile deines Browsers.',
      ],
    ],
  },
  {
    title: '14. Deine Rechte',
    paragraphs: [
      [
        'Du hast das Recht auf Auskunft über deine gespeicherten personenbezogenen Daten (Art. 15 DSGVO), auf Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO) und Datenübertragbarkeit (Art. 20 DSGVO). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO).',
      ],
      [
        'Widerspruchsrecht: Soweit wir Daten auf Grundlage unseres berechtigten Interesses verarbeiten (Art. 6 Abs. 1 lit. f DSGVO), kannst du dieser Verarbeitung aus Gründen, die sich aus deiner besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO).',
      ],
      [
        'Wende dich dazu an die oben genannte Kontaktadresse. Außerdem hast du das Recht, dich bei einer Datenschutz-Aufsichtsbehörde zu beschweren. Für uns zuständig ist der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg (www.baden-wuerttemberg.datenschutz.de).',
      ],
    ],
  },
  {
    title: '15. Änderungen dieser Datenschutzerklärung',
    paragraphs: [
      [
        'Wir passen diese Datenschutzerklärung an, wenn sich die Website oder die rechtlichen Vorgaben ändern. Es gilt die jeweils aktuelle Fassung auf dieser Seite.',
      ],
    ],
  },
]
</script>

<template>
  <div class="mb-15">
    <div class="w-full py-13 bg-[#032650] text-center px-4">
      <h1 class="text-3xl font-black text-white uppercase tracking-wider">
        {{ story?.content.title || 'Datenschutzerklärung' }}
      </h1>
    </div>

    <div class="max-w-4xl w-[95%] mx-auto mt-15 px-4">
      <div
        class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 px-4 md:p-10 text-gray-800"
      >
        <div
          class="absolute -top-2 -left-2 w-6 h-6 border-t-[3px] border-l-[3px] border-[#032650] rounded-tl-md pointer-events-none"
        ></div>
        <div
          class="absolute -top-2 -right-2 w-6 h-6 border-t-[3px] border-r-[3px] border-[#032650] rounded-tr-md pointer-events-none"
        ></div>
        <div
          class="absolute -bottom-2 -left-2 w-6 h-6 border-b-[3px] border-l-[3px] border-[#032650] rounded-bl-md pointer-events-none"
        ></div>
        <div
          class="absolute -bottom-2 -right-2 w-6 h-6 border-b-[3px] border-r-[3px] border-[#032650] rounded-br-md pointer-events-none"
        ></div>

        <div
          v-if="story?.content.content"
          class="prose prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-lg max-w-none text-gray-800 prose-h5:mt-10 prose-h5:mb-3 prose-h5:text-[#032650] prose-h5:font-black prose-h5:uppercase prose-h5:tracking-widest [&_h5_strong]:text-[#032650] [&_h5_strong]:font-black"
          v-html="renderRichText(story.content.content)"
        ></div>

        <template v-else>
          <div
            v-for="(section, index) in fallbackSections"
            :key="section.title"
            :class="index > 0 ? 'border-t-2 border-gray-200 pt-6 mb-8' : 'mb-8'"
          >
            <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
              {{ section.title }}
            </h2>
            <p
              v-for="(lines, pIndex) in section.paragraphs"
              :key="pIndex"
              class="leading-relaxed mt-3 first-of-type:mt-0"
            >
              <template v-for="(line, lIndex) in lines" :key="lIndex">
                <br v-if="lIndex > 0" />{{ line }}
              </template>
            </p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
