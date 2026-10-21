# Laboratorio 03.16 — Chiamate HTTP con Angular

Soluzione della dispensa **«Chiamate HTTP: da JSONPlaceholder ai fatti sui gatti»**, in una cartella autonoma della repository `HTTPS-API-REST`. Il progetto usa Angular 20, Bootstrap 5.3.8, routing, `HttpClient`, servizi tipizzati e signal. Include i passi 1–9 e le tre attività «Prova tu» (paginazione, Pokédex e APOD per data).

## Avvio

Per usare la pagina NASA, richiedi una chiave gratuita su <https://api.nasa.gov/>. Dal terminale, nella cartella di questo progetto:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts
```

Su Windows PowerShell usa `Copy-Item` al posto di `cp`. Inserisci la tua chiave personale nel campo `nasaApiKey` **di entrambi i file creati**. Quindi:

```bash
npm install
npm start
```

Apri l'URL indicato dal terminale (di norma <http://localhost:4200/>). `npm run build` controlla la compilazione. Le due copie di `environment` sono ignorate da Git: **non aggiungerle alla repository**. Il file `environment.example.ts` resta un modello senza credenziali. Se vuoi provare temporaneamente la pagina senza registrarti, puoi inserire `DEMO_KEY`, soggetta a limiti molto bassi.

## Che cosa è stato aggiunto rispetto all'esercizio precedente

Il precedente progetto mostrava una lista di attività JSONPlaceholder con GET, POST e DELETE. Questo laboratorio è **un'altra app**, con quattro pagine accessibili dal menu:

| Pagina | Funzionamento |
| --- | --- |
| **Post** | Carica un post tramite ID, l'elenco completo, oppure invia un post con `POST /posts`. Mostra il JSON della risposta, uno spinner e gli errori (per esempio il `404` del post 999). L'estensione usa `_page` e `_limit=10` con pulsanti Precedente e Successiva, disabilitati ai limiti. |
| **Gatti** | Carica all'apertura un fatto da `catfact.ninja/fact` e ne chiede un altro con un pulsante disabilitato durante la richiesta. |
| **NASA** | Carica APOD all'apertura o per una data selezionata. Mostra foto o link al video, titolo, data e spiegazione. Distingue gli errori `403`, `429`, `0` e mostra il messaggio API per date non valide o future, se presente. |
| **Pokédex** | Carica i tipi da PokéAPI, cerca un Pokémon per nome o numero, mostra immagine, altezza in metri e peso in chilogrammi; il `404` produce «Pokémon non trovato». |

I servizi in `src/app/services/` centralizzano le richieste e ritornano `Observable` tipizzati con le interfacce in `src/app/modelli/`. I componenti avviano ogni richiesta con `subscribe({ next, error })` e aggiornano i `signal`, così caricamento, risposta ed errore cambiano nella pagina. `src/app/app.config.ts` configura `provideHttpClient()`, router e modalità senza ZoneJS. La decorazione dei servizi è `@Injectable({ providedIn: 'root' })`, quella prevista da Angular.

## Chiave NASA e sicurezza

`angular.json` sostituisce `environment.ts` con `environment.development.ts` quando usi `npm start`. In produzione `npm run build` usa `environment.ts`. Entrambi sono esclusi dal commit tramite `.gitignore`. La chiave nel frontend **è comunque visibile a chi apre la pagina**: questo accorgimento la tiene fuori dal repository, ma una chiave davvero segreta deve stare su un server che interroga l'API per conto del browser.

## Verifica nel browser

Apri **F12 → Network/Rete → Fetch/XHR** e osserva metodo, URL, stato, Payload e Response:

1. In **Post**, usa gli ID 1 e 999, «Carica tutti», «Invia un post» e poi «Carica pagina 1» → «Successiva». La POST restituisce l'ID 101 ma JSONPlaceholder non salva il nuovo post.
2. Passa a **Gatti** e richiedi un nuovo fatto; passa a **Pokédex** e prova `pikachu`, `25` e un nome inesistente.
3. In **NASA**, usa la tua chiave; prova una data precedente e una futura. La risposta del server alla data futura viene mostrata come errore in pagina. Se compare `429`, la chiave ha raggiunto il limite.
4. In modalità **Offline** del browser prova «Carica tutti»: Angular riceve un errore con stato `0`.

La tabella delle richieste e le risposte teoriche richieste dal laboratorio sono in [RISPOSTE.md](RISPOSTE.md). Le API esterne richiedono rete: se una è bloccata dalla rete locale, il componente mostra l'errore e le altre pagine restano utilizzabili.
