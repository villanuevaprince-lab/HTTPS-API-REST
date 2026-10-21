# Risposte — laboratorio 03.16

## Passo 6 — Richieste HTTP

Questi valori sono stati verificati con richieste dirette a JSONPlaceholder durante lo svolgimento; in **F12 → Network → Fetch/XHR** si possono vedere le richieste prodotte dall'app Angular e verificare Payload e Response.

| Azione | Metodo | URL | Stato |
| --- | --- | --- | --- |
| Carica un post con ID 1 | GET | `https://jsonplaceholder.typicode.com/posts/1` | 200 |
| Carica un post con ID 999 | GET | `https://jsonplaceholder.typicode.com/posts/999` | 404 |
| Carica tutti | GET | `https://jsonplaceholder.typicode.com/posts` | 200 |
| Invia un post | POST | `https://jsonplaceholder.typicode.com/posts` | 201, risposta con `id: 101` |

In modalità Offline una richiesta non arriva al server e `HttpErrorResponse.status` è `0` (da verificare nella scheda Network del proprio browser). A seconda del browser può comparire prima della POST una richiesta `OPTIONS` di controllo CORS.

## Domande

1. **`provideHttpClient()`** registra il client HTTP tra i provider dell'app. Si trova in `src/app/app.config.ts`, insieme a `provideRouter(routes)`.
2. **Costruttore o `inject()`**: `constructor(public http: HttpClient)` riceve la dipendenza nel costruttore e la espone pubblicamente; `private readonly http = inject(HttpClient)` la acquisisce durante la creazione dell'istanza e la mantiene privata. **Entrambe funzionano** in un servizio decorato correttamente con `@Injectable({ providedIn: 'root' })`. L'annotazione `@Service()` presente in alcuni frammenti della dispensa non è un decorator Angular valido: così scritto, il servizio non compila, indipendentemente dalla notazione usata.
3. Un **Observable** rappresenta il risultato asincrono. `getPosts()` prepara l'Observable; la richiesta HTTP parte quando il componente chiama `subscribe(...)`. Due sottoscrizioni distinte producono normalmente due richieste.
4. **`next`** riceve una risposta riuscita; **`error`** riceve un `HttpErrorResponse` per problemi HTTP o di rete. Il post 999 chiama `error` con stato **404**.
5. **`post`, `posts`, `loading`, `errore`** sono `signal` perché le risposte arrivano dopo il click. `.set()` notifica Angular di aggiornare il template anche nella configurazione senza ZoneJS; assegnare una proprietà semplice da una callback asincrona non offre questa notifica affidabile.
6. Le interfacce **`Post`** e **`CatFact`** danno completamento automatico e rilevano errori di proprietà in compilazione. Scrivere `p.titolo` al posto di `p.title` causa un errore TypeScript, mentre con `any` passa inosservato. Le interfacce non verificano da sole il JSON ricevuto a runtime.
7. Il pipe **`json`** converte un oggetto in testo JSON leggibile e indentato. È utile per ispezionare la risposta completa della POST; richiede `JsonPipe` negli `imports` del componente.
8. JSONPlaceholder **simula** la creazione di un post dopo i suoi 100 post predefiniti e risponde con `id: 101` ogni volta, senza salvarlo. `HttpClient.post` riceve l'oggetto e lo serializza come JSON, quindi non si usa `JSON.stringify`.
9. I file `environment.ts` e `environment.development.ts` vengono creati copiando `environment.example.ts`; contengono la chiave personale e sono esclusi da `.gitignore`. `angular.json` usa quello di sviluppo con `npm start`. Il file `.example.ts` committato mostra a chi clona il progetto quali campi compilare, senza pubblicare la chiave.
10. Il codice di un'app **Angular gira nel browser**: anche la chiave incorporata nel bundle può essere letta dall'utente. Una chiave davvero riservata va tenuta sul backend; il browser chiama il backend e quest'ultimo interroga il servizio esterno.
