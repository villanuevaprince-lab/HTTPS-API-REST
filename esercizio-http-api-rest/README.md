# Esercizio: HTTP e API REST con Angular

Questa cartella svolge le attività pratiche della dispensa **03.15 - [TEO] - HTTP e API REST**. L'app carica le cose da fare da [JSONPlaceholder](https://jsonplaceholder.typicode.com/), invia una nuova attività e aggiunge la funzione **Elimina** richiesta nel secondo riquadro «Prova tu». È un progetto Angular autonomo, separato dagli altri esercizi.

## Come avviarlo

Servono Node.js compatibile con Angular 20 e una connessione Internet. Apri un terminale **in questa cartella** ed esegui:

```bash
npm install
npm start
```

Apri l'indirizzo mostrato dal terminale, normalmente `http://localhost:4200/`. Per verificare la compilazione usa `npm run build`.

## Che cosa fa l'app

1. All'avvio `ngOnInit()` chiama `carica(1)` e mostra le attività dell'utente 1.
2. I pulsanti **Utente 1**, **Utente 2** e **Utente 99** inviano `GET /todos?userId=...`. L'utente 99 permette di vedere una lista vuota, distinta da un errore.
3. Il campo **Nuova attività** invia `POST /todos` con `userId`, `title` e `completed`; l'ID viene assegnato nella risposta e mostrato con il pipe `json`.
4. **Elimina** invia `DELETE /todos/{id}`. Solo quando la risposta arriva, `this.todos.update(...)` e `filter(...)` rimuovono l'elemento dalla lista locale. Se la richiesta fallisce, l'elemento resta e compare l'errore.

JSONPlaceholder simula POST e DELETE: risponde alle richieste ma **non salva le modifiche**. Se ricarichi l'elenco, l'attività eliminata può ricomparire; quella creata non vi compare. La POST mostra la risposta senza fingere che l'attività sia stata salvata.

## Dove si trovano le parti dell'esercizio

| File | Funzione |
| --- | --- |
| `src/app/modelli/todo.ts` | Interfaccia `Todo` che descrive il JSON dell'API. |
| `src/app/services/todo-service.ts` | Servizio `@Injectable` con `HttpClient` e i metodi tipizzati GET, POST e DELETE. |
| `src/app/app.config.ts` | Configura `provideHttpClient()` e il rilevamento dei cambiamenti senza ZoneJS. |
| `src/app/app.ts` | Usa `subscribe({ next, error })`, `signal` per dati/caricamento/errori e `computed` per il conteggio. |
| `src/app/app.html` | Mostra caricamento, errori, lista vuota, modulo di invio e pulsanti Elimina. |

Le chiamate HTTP restituiscono `Observable`: partono quando il componente chiama `subscribe`. `next` gestisce la risposta, `error` gestisce errori HTTP o di rete. I signal avvisano Angular quando i dati asincroni cambiano. Nel servizio la decorazione corretta è `@Injectable({ providedIn: 'root' })`.

## Verifica richiesta dalla dispensa

Apri gli strumenti di sviluppo del browser con **F12**, seleziona **Network/Rete** e il filtro **Fetch/XHR**:

1. Cambia utente: osserva una richiesta `GET` a `/todos?userId=2` e il codice di risposta.
2. Invia un'attività: osserva `POST /todos`, il JSON in **Payload** e il codice di stato.
3. Premi **Elimina**: osserva `DELETE /todos/{id}`, il codice di risposta e la rimozione dalla lista. Il codice effettivo dipende dalla risposta dell'API: leggilo nella scheda **Headers**.
4. Per il primo «Prova tu», visita `https://jsonplaceholder.typicode.com/todos/999` e controlla **Headers** e **Response**: confronta il codice di stato con `404 Not Found`. Questa richiesta a una singola risorsa è diversa da `GET /todos?userId=99`, che chiede una lista filtrata e può riuscire anche quando è vuota.

## Concetti HTTP usati

Una richiesta comprende metodo, URL, header e, quando necessario, body. La risposta comprende codice di stato, header e body. `GET` legge, `POST` crea, `PUT` sostituisce, `PATCH` modifica in parte e `DELETE` elimina. In una API REST `/todos` indica la collezione e `/todos/1` una singola risorsa; `?userId=1` è un filtro. In generale, `2xx` indica successo, `4xx` un problema nella richiesta o nei permessi e `5xx` un problema del server.

La tipizzazione `http.get<Todo[]>()` aiuta TypeScript ma non verifica il JSON ricevuto a runtime. `Omit<Todo, 'id'>` descrive il body della POST senza un ID. `HttpClient` serializza l'oggetto in JSON: non serve chiamare `JSON.stringify`. L'esercizio non usa chiavi API; per credenziali davvero segrete serve un backend, perché il codice Angular è visibile nel browser.
