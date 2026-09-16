<script setup lang="ts">
import { renderRichText, useStoryblok } from '@storyblok/vue'
import { STORYBLOK_VERSION } from '@/storyblok'

let story: Awaited<ReturnType<typeof useStoryblok>> | null = null
try {
    story = await useStoryblok(`datenschutz`, { version: STORYBLOK_VERSION })
} catch (e) {
    console.error('Storyblok-Story "datenschutz" konnte nicht geladen werden.', e)
}
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
                class="relative w-full bg-white rounded-xl border border-gray-200 shadow-sm p-6 px-4 md:p-10 text-gray-800">
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

                <div v-if="story?.content.content"
                    class="prose prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-lg max-w-none text-gray-800 prose-h5:mt-10 prose-h5:mb-3 prose-h5:text-[#032650] prose-h5:font-black prose-h5:uppercase prose-h5:tracking-widest [&_h5_strong]:text-[#032650] [&_h5_strong]:font-black"
                    v-html="renderRichText(story.content.content)">
                </div>

                <template v-else>
                    <div class="mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            1. Verantwortlicher
                        </h2>
                        <p class="leading-relaxed">
                            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
                        </p>
                        <p class="mt-2">Inlinehockey Club Blue Arrows Sasbach e. V.</p>
                        <p>Bühler Straße 25, 77880 Sasbach</p>
                        <p>E-Mail: <a href="mailto:mail@bluearrows.de"
                                class="text-blue-600 hover:underline">mail@bluearrows.de</a></p>
                        <p>vertreten durch Daniel Bühler (1. Vorsitzender)</p>

                        <p class="mt-4 font-bold text-[#032650]">Kontakt für Datenschutzfragen</p>
                        <p>Daniel Bühler</p>
                        <p>Telefon: 0178 / 47 44 1 44</p>
                        <p>E-Mail: <a href="mailto:mail@bluearrows.de"
                                class="text-blue-600 hover:underline">mail@bluearrows.de</a></p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            2. Hosting und Server-Logfiles
                        </h2>
                        <p class="leading-relaxed">
                            Beim Aufruf dieser Website erhebt unser Hosting-Anbieter automatisch Informationen in
                            sogenannten Server-Logfiles, die dein Browser übermittelt (z. B. IP-Adresse, Datum und
                            Uhrzeit der Anfrage, verwendeter Browser, Betriebssystem, Referrer-URL). Diese Daten
                            lassen keine direkten Rückschlüsse auf deine Person zu, sind aber aus technischen Gründen
                            für die Auslieferung der Website unverzichtbar und dienen zusätzlich unserer Statistik
                            sowie der Erkennung von Missbrauch. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
                            (berechtigtes Interesse an einem stabilen und sicheren Betrieb der Website).
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            3. Kontaktaufnahme
                        </h2>
                        <p class="leading-relaxed">
                            Wenn du uns per E-Mail oder telefonisch kontaktierst, werden deine Angaben zur
                            Bearbeitung der Anfrage und für den Fall von Anschlussfragen gespeichert. Die
                            Kommunikation via E-Mail kann grundsätzlich Sicherheitslücken aufweisen – auf dem Weg zu
                            uns können E-Mails theoretisch von Dritten eingesehen werden. Bitte übermittle uns daher
                            keine besonders vertraulichen Informationen unverschlüsselt per E-Mail. Rechtsgrundlage
                            ist Art. 6 Abs. 1 lit. b bzw. f DSGVO. Diese Daten geben wir nicht ohne deine Einwilligung
                            an Dritte weiter.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            4. Chat-Funktion
                        </h2>
                        <p class="leading-relaxed mb-3">
                            Auf dieser Website steht dir ein Chat-Assistent zur Beantwortung von Fragen zur
                            Verfügung. Bei aktiver Nutzung werden folgende Daten verarbeitet:
                        </p>
                        <ul class="list-disc pl-5 space-y-2 leading-relaxed">
                            <li>
                                <strong>Chatnachrichten:</strong> Der von dir eingegebene Text wird zur Erzeugung
                                einer Antwort an die Google Gemini API (Google Ireland Limited bzw. Google LLC)
                                übermittelt. Dabei kann es zu einer Datenübertragung in Länder außerhalb der EU/des
                                EWR (u. a. USA) kommen; Google verweist hierfür auf geeignete Garantien
                                (Standardvertragsklauseln). Die Gespräche werden aktuell nicht dauerhaft in einer
                                eigenen Datenbank gespeichert, sondern nur zur Erzeugung der Antwort verarbeitet.
                            </li>
                            <li>
                                <strong>IP-Adresse:</strong> wird zu technischen Zwecken (u. a. Schutz vor Missbrauch)
                                verarbeitet.
                            </li>
                        </ul>
                        <p class="leading-relaxed mt-3">
                            Rechtsgrundlage ist deine Einwilligung durch aktive Nutzung des Chats (Art. 6 Abs. 1 lit.
                            a DSGVO) sowie unser berechtigtes Interesse an einem funktionierenden Support-Angebot
                            (Art. 6 Abs. 1 lit. f DSGVO). Weitere Informationen zur Datenverarbeitung durch Google
                            findest du in der <a href="https://policies.google.com/privacy" target="_blank"
                                rel="noopener noreferrer" class="text-blue-600 hover:underline">Datenschutzerklärung
                                von Google</a>.
                        </p>
                        <p class="leading-relaxed mt-3 text-sm text-gray-500 italic">
                            Hinweis: Sobald Chatverläufe zusätzlich dauerhaft gespeichert werden (z. B. für
                            Auswertungen in einem Admin-Dashboard), wird dieser Abschnitt um Angaben zu Zweck und
                            Speicherdauer dieser Speicherung ergänzt.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            5. Google Maps (externer Link)
                        </h2>
                        <p class="leading-relaxed">
                            Auf einzelnen Seiten (z. B. Anschrift/Kontakt) verlinken wir auf Google Maps, um dir den
                            Weg zu unserer Vereinsstätte zu zeigen. Dabei ist keine Karte direkt eingebettet – erst
                            wenn du aktiv auf den Link klickst, öffnet sich Google Maps in einem neuen Tab und es
                            werden Daten (u. a. deine IP-Adresse) an Google übertragen. Beim bloßen Aufruf unserer
                            Website findet keine automatische Datenübermittlung an Google statt. Betreiber ist Google
                            Ireland Limited bzw. Google LLC; weitere Informationen findest du in den <a
                                href="https://www.google.com/intl/de_de/help/terms_maps.html" target="_blank"
                                rel="noopener noreferrer" class="text-blue-600 hover:underline">Nutzungsbedingungen
                                für Google Maps</a>.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            6. Soziale Medien (externe Links)
                        </h2>
                        <p class="leading-relaxed">
                            Wir verlinken auf unserer Website auf unsere Auftritte bei Facebook und Instagram. Diese
                            Links öffnen die jeweiligen Netzwerke in einem neuen Tab; es sind keine Social-Plugins
                            eingebunden, die schon beim bloßen Aufruf unserer Website Daten an diese Netzwerke
                            übermitteln. Sobald du einem Link folgst, gelten die Datenschutzbestimmungen des
                            jeweiligen Anbieters, auf deren Erhebung und Verwendung von Daten wir keinen Einfluss
                            haben.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            7. Eingebundene Schriftarten
                        </h2>
                        <p class="leading-relaxed">
                            Diese Website nutzt Schriftarten (Google Fonts), die lokal gehostet werden. Es findet
                            dabei keine Verbindung zu Servern von Google statt und es werden keine Daten an Google
                            übertragen.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            8. Minderjährigenschutz
                        </h2>
                        <p class="leading-relaxed">
                            Personen unter 18 Jahren sollten ohne Zustimmung der Eltern oder Erziehungsberechtigten
                            keine personenbezogenen Daten an uns übermitteln. Wir fordern personenbezogene Daten von
                            Kindern und Jugendlichen nur an, soweit sie im Zusammenhang mit deren sportlicher
                            Betätigung stehen (z. B. Meldungen zu Wettbewerben oder Trainingsangeboten). Eine
                            Weitergabe dieser Daten an Dritte erfolgt nicht.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            9. SSL-Verschlüsselung
                        </h2>
                        <p class="leading-relaxed">
                            Diese Website nutzt eine SSL-Verschlüsselung zum Schutz der Übertragung vertraulicher
                            Inhalte. Eine verschlüsselte Verbindung erkennst du daran, dass die Adresszeile deines
                            Browsers von „http://“ auf „https://“ wechselt.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6 mb-8">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            10. Deine Rechte
                        </h2>
                        <p class="leading-relaxed">
                            Du hast jederzeit das Recht auf Auskunft über deine gespeicherten personenbezogenen
                            Daten, auf Berichtigung, Löschung oder Einschränkung der Verarbeitung sowie auf
                            Datenübertragbarkeit. Außerdem kannst du einer Verarbeitung widersprechen und eine
                            erteilte Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen. Wende dich dazu
                            an die oben genannte Kontaktadresse. Dir steht zudem ein Beschwerderecht bei einer
                            Datenschutz-Aufsichtsbehörde zu.
                        </p>
                    </div>

                    <div class="border-t-2 border-gray-200 pt-6">
                        <h2 class="text-[#032650] text-sm font-black uppercase tracking-widest mb-3">
                            11. Änderungen dieser Datenschutzerklärung
                        </h2>
                        <p class="leading-relaxed">
                            Im Zuge der Weiterentwicklung dieser Website können Änderungen dieser
                            Datenschutzerklärung erforderlich werden. Wir empfehlen, sich diese Erklärung von Zeit zu
                            Zeit erneut durchzulesen.
                        </p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
