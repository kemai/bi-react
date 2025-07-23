// "use client";

// import { useState, useEffect, useRef } from "react";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
// } from "../ui/card";
// import { Button } from "../ui/button";
// import { Checkbox } from "../ui/checkbox";
// import { Label } from "../ui/label";
// import { Textarea } from "../ui/textarea";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { useToast } from "../hooks/use-toast";
// import {
//   Loader2,
//   Send,
//   BrainCircuit,
//   ChevronRight,
//   CalendarDays,
//   Menu,
// } from "lucide-react";
// import DynamicChart from "../charts/dynamic-chart";
// import type { ChartSpec } from "../charts/dynamic-chart";

// interface ApiResult {
//   sql?: string;
//   rows?: Record<string, unknown>[];
//   insights?: string[];
//   summary?: string;
//   chartSpec?: ChartSpec;
// }

// interface SessionInfo {
//   id: string;
//   createdAt: string;
// }

// interface HistoryEntry {
//   question: string;
//   result: ApiResult;
// }

// type StreamMsg =
//   | { type: "status"; payload: string }
//   | { type: "sql"; payload: string }
//   | { type: "rows"; payload: Record<string, unknown>[] }
//   | { type: "insights"; payload: string[] }
//   | { type: "analysis"; payload: string[] }
//   | { type: "summary"; payload: string }
//   | { type: "chart"; payload: ChartSpec }
//   | { type: "error"; payload: string };

// const API = import.meta.env.VITE_API || "http://127.0.0.1:8000";

// function renderCell(v: unknown) {
//   if (v && typeof v === "object" && "value" in v) {
//     return new Date((v as { value: string }).value).toLocaleDateString("it-IT");
//   }
//   return String(v);
// }

// export default function LookerBIQuerySection() {
//   const { toast } = useToast();

//   // form + results
//   const [question, setQuestion] = useState("");
//   const [runQuery, setRunQuery] = useState(true);
//   const [makeChart, setMakeChart] = useState(false);

//   const [isLoading, setIsLoading] = useState(false);
//   const [status, setStatus] = useState<string | null>(null);
//   const [apiRes, setApiRes] = useState<ApiResult | null>(null);

//   // sessions & history
//   const fetchedSessions = useRef(false);
//   const [sessions, setSessions] = useState<SessionInfo[]>([]);
//   const [sessionsLoading, setSessionsLoading] = useState(true);
//   const [sessionId, setSessionId] = useState<string | null>(null);
//   const [creatingSession, setCreatingSession] = useState(false);

//   const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
//   const [historyLoading, setHistoryLoading] = useState(false);

//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   const rows = apiRes?.rows ?? [];
//   const fx = "animate-in fade-in slide-in-from-left duration-300";
//   const oneLine = (sql: string) => sql.replace(/\s+/g, " ").trim();

//   // load existing sessions once
//   useEffect(() => {
//     if (fetchedSessions.current) return;
//     fetchedSessions.current = true;
//     fetch(`${API}/sessions`)
//       .then((r) =>
//         r.status === 404 ? [] : (r.json() as Promise<SessionInfo[]>)
//       )
//       .then((list) =>
//         setSessions(
//           list.sort(
//             (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
//           )
//         )
//       )
//       .catch(() =>
//         toast({
//           variant: "destructive",
//           title: "Errore caricamento sessioni",
//           description: "Non è stato possibile recuperare le sessioni.",
//         })
//       )
//       .finally(() => setSessionsLoading(false));
//   }, []);

//   // load history when sessionId changes
//   useEffect(() => {
//     if (!sessionId) return;
//     setHistoryLoading(true);
//     fetch(`${API}/sessions/${sessionId}/history`)
//       .then((r) => r.json())
//       .then((list: HistoryEntry[]) => setHistoryEntries(list))
//       .catch(() =>
//         toast({
//           variant: "destructive",
//           title: "Errore",
//           description: "Impossibile caricare la cronologia.",
//         })
//       )
//       .finally(() => setHistoryLoading(false));
//   }, [sessionId]);

//   // ensure we have a session before ask-stream
//   async function ensureSession() {
//     if (sessionId) return;
//     setCreatingSession(true);
//     const res = await fetch(`${API}/sessions`, { method: "POST" });
//     if (!res.ok) throw new Error("Impossibile creare sessione");
//     const json = (await res.json()) as SessionInfo;
//     setSessionId(json.id);
//     setSessions((s) => [{ id: json.id, createdAt: json.createdAt }, ...s]);
//     setCreatingSession(false);
//   }

//   // submit handler
//   async function handleSubmit() {
//     if (!question.trim()) {
//       toast({
//         variant: "destructive",
//         title: "Input richiesto",
//         description: "Per favore, inserisci una domanda.",
//       });
//       return;
//     }
//     try {
//       await ensureSession();
//     } catch (e) {
//       return toast({
//         variant: "destructive",
//         title: "Errore",
//         description: String(e),
//       });
//     }

//     setIsLoading(true);
//     setApiRes(null);
//     setStatus("Ragionamento in corso…");

//     try {
//       const res = await fetch(`${API}/ask-stream`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question,
//           run_query: runQuery,
//           make_chart: makeChart,
//           session_id: sessionId,
//         }),
//         cache: "no-store",
//       });
//       if (!res.ok) {
//         const { detail } = (await res.json().catch(() => ({}))) as {
//           detail?: string;
//         };
//         throw new Error(detail || `${res.status} ${res.statusText}`);
//       }

//       const reader = res.body!.getReader();
//       const decoder = new TextDecoder("utf-8");
//       let buffered = "";

//       const handleMsg = (msg: StreamMsg) => {
//         switch (msg.type) {
//           case "status":
//             setStatus(msg.payload);
//             break;
//           case "sql":
//             setApiRes((pr) => ({
//               ...(pr ?? {}),
//               sql: msg.payload,
//             }));
//             break;
//           case "rows":
//             setApiRes((pr) => ({ ...(pr ?? {}), rows: msg.payload }));
//             break;
//           case "insights":
//             setApiRes((pr) => ({
//               ...(pr ?? {}),
//               insights: [...(pr?.insights ?? []), ...msg.payload],
//             }));
//             break;
//           case "summary":
//             setApiRes((pr) => ({ ...(pr ?? {}), summary: msg.payload }));
//             break;
//           case "chart":
//             setApiRes((pr) => ({ ...(pr ?? {}), chartSpec: msg.payload }));
//             break;
//           case "error":
//             throw new Error(msg.payload);
//         }
//       };

//       // stream loop
//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) {
//           if (buffered.trim()) handleMsg(JSON.parse(buffered) as StreamMsg);
//           break;
//         }
//         buffered += decoder.decode(value, { stream: true });
//         const lines = buffered.split("\n");
//         buffered = lines.pop()!;
//         for (const line of lines) {
//           if (line.trim()) handleMsg(JSON.parse(line) as StreamMsg);
//         }
//       }
//       setStatus(null);
//     } catch (err: unknown) {
//       setStatus(null);
//       const message =
//         typeof err === "string"
//           ? err
//           : err instanceof Error
//           ? err.message
//           : "Errore sconosciuto.";
//       toast({
//         variant: "destructive",
//         title: "Errore nella richiesta",
//         description: message,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   return (
//     <div className="flex flex-col md:flex-row gap-6 items-start">
//       {/* ───── COLONNA PRINCIPALE ───── */}
//       <div className="flex-1 flex flex-col gap-6">
//         {/* ─ Risultati / Cronologia / Placeholder ─ */}
//         {isLoading ? (
//           <Card className="overflow-hidden mb-4 min-h-[34rem]">
//             <CardHeader>
//               <CardTitle>Ragionamento in corso…</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-2 animate-pulse">
//                 <div className="h-5 w-1/2 bg-gray-200 rounded" />
//                 <div className="h-40 bg-gray-200 rounded" />
//               </div>
//             </CardContent>
//           </Card>
//         ) : apiRes ? (
//           <Card className="overflow-hidden mb-4 min-h-[34rem]">
//             <CardHeader>
//               <CardTitle>Risultati BI Assistant</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* SQL */}
//               {apiRes.sql && (
//                 <section className={fx}>
//                   <h3 className="font-semibold">SQL generata</h3>
//                   <pre className="rounded bg-muted p-3 text-sm overflow-x-auto">
//                     {oneLine(apiRes.sql)}
//                   </pre>
//                 </section>
//               )}
//               {/* Tabella */}
//               {apiRes.rows && (
//                 <section className={`${fx} delay-75`}>
//                   <h3 className="font-semibold">
//                     Dati estratti ({rows.length} righe)
//                   </h3>
//                   {rows.length > 0 ? (
//                     <div className="h-80 overflow-auto rounded border">
//                       <Table>
//                         <TableHeader className="sticky top-0 bg-card">
//                           <TableRow>
//                             {Object.keys(rows[0]!).map((col) => (
//                               <TableHead key={col}>{col}</TableHead>
//                             ))}
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {rows.map((row, i) => (
//                             <TableRow key={i} className={fx}>
//                               {Object.keys(rows[0]!).map((col) => (
//                                 <TableCell key={col}>
//                                   {renderCell(row[col])}
//                                 </TableCell>
//                               ))}
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   ) : (
//                     <p className="italic text-sm text-muted-foreground">
//                       (nessun dato)
//                     </p>
//                   )}
//                 </section>
//               )}
//               {/* Insight */}
//               {apiRes.insights && (
//                 <section className={`${fx} delay-150`}>
//                   <h3 className="font-semibold">Insight</h3>
//                   <ul className="list-disc pl-5">
//                     {apiRes.insights.map((t, i) => (
//                       <li key={i}>{t}</li>
//                     ))}
//                   </ul>
//                 </section>
//               )}
//               {/* Summary */}
//               {apiRes.summary && (
//                 <section className={`${fx} delay-200`}>
//                   <h3 className="font-semibold">Riassunto</h3>
//                   <p className="whitespace-pre-line">{apiRes.summary}</p>
//                 </section>
//               )}
//               {/* Chart */}
//               {apiRes.chartSpec && (
//                 <section className={`${fx} delay-250`}>
//                   <DynamicChart spec={apiRes.chartSpec} />
//                 </section>
//               )}
//             </CardContent>
//           </Card>
//         ) : historyLoading ? (
//           <div className="h-80 flex items-center justify-center">
//             Caricamento cronologia…
//           </div>
//         ) : historyEntries.length > 0 ? (
//           <Card className="mb-4">
//             <CardHeader>
//               <CardTitle>Domande precedenti</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               {historyEntries.map((h, i) => (
//                 <div
//                   key={i}
//                   className="p-2 rounded hover:bg-primary/10 cursor-pointer"
//                   onClick={() => {
//                     setQuestion(h.question);
//                     setApiRes(h.result);
//                   }}
//                 >
//                   <strong className="block truncate">{h.question}</strong>
//                   {h.result.summary && (
//                     <p className="text-sm text-muted-foreground truncate">
//                       {h.result.summary}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="h-80 flex items-center justify-center rounded border border-dashed text-gray-400">
//             Inserisci una domanda per avviare BI-Assistant
//           </div>
//         )}

//         {/* ─ Form di input ─ */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <BrainCircuit className="mr-2 h-6 w-6 text-primary" />
//               BI Assistant
//             </CardTitle>
//             <CardDescription>
//               Scrivi in linguaggio naturale per ottenere analisi e visualizzazioni.
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <Label htmlFor="bi-question">La tua domanda:</Label>
//               <Textarea
//                 id="bi-question"
//                 rows={4}
//                 placeholder="Esempio: Quali sono state le vendite totali per regione nel Q1 2024?"
//                 value={question}
//                 onChange={(e) => setQuestion(e.target.value)}
//               />
//             </div>
//             <div className="flex flex-wrap gap-4">
//               <div className="flex items-center">
//                 <Checkbox
//                   id="runQuery"
//                   checked={runQuery}
//                   onCheckedChange={(c) => setRunQuery(!!c)}
//                 />
//                 <Label htmlFor="runQuery">Esegui query sui dati</Label>
//               </div>
//               <div className="flex items-center">
//                 <Checkbox
//                   id="makeChart"
//                   checked={makeChart}
//                   onCheckedChange={(c) => setMakeChart(!!c)}
//                 />
//                 <Label htmlFor="makeChart">Includi grafico</Label>
//               </div>
//             </div>
//             <Button onClick={handleSubmit} disabled={isLoading || creatingSession}>
//               {isLoading || creatingSession ? (
//                 <Loader2 className="animate-spin mr-2 h-5 w-5" />
//               ) : (
//                 <Send className="mr-2 h-5 w-5" />
//               )}
//               {isLoading || creatingSession ? "..." : "Esegui"}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ───── SIDEBAR SESSIONI ───── */}
//       <aside
//         onClick={() => !sidebarOpen && setSidebarOpen(true)}
//         className={`flex-shrink-0 transition-width duration-200 ${
//           sidebarOpen ? "w-64" : "w-12"
//         }`}
//       >
//         <Card className="flex flex-col m-2 border rounded-lg shadow max-h-[calc(100vh-2rem)] overflow-y-auto">
//           {sidebarOpen && (
//             <>
//               <CardHeader>
//                 <CardTitle className="text-center">Sessioni</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-1">
//                 {sessionsLoading ? (
//                   <div className="space-y-2 animate-pulse">
//                     {[...Array(4)].map((_, i) => (
//                       <div key={i} className="h-4 bg-slate-200 rounded" />
//                     ))}
//                   </div>
//                 ) : sessions.length === 0 ? (
//                   <p className="text-sm text-slate-500">
//                     Nessuna sessione. Inizia una conversazione.
//                   </p>
//                 ) : (
//                   sessions.map((s) => (
//                     <div
//                       key={s.id}
//                       onClick={() => setSessionId(s.id)}
//                       className={`flex items-center px-3 py-2 rounded cursor-pointer ${
//                         s.id === sessionId ? "bg-primary/20" : "hover:bg-primary/10"
//                       }`}
//                     >
//                       <CalendarDays className="mr-2 h-5 w-5 text-primary" />
//                       <span className="text-sm truncate">{s.id}</span>
//                     </div>
//                   ))
//                 )}
//               </CardContent>
//               <div className="border-t p-2 flex justify-center">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSidebarOpen((o) => !o);
//                   }}
//                 >
//                   {sidebarOpen ? <ChevronRight /> : <Menu />}
//                 </Button>
//               </div>
//             </>
//           )}
//         </Card>
//       </aside>
//     </div>
//   );
// }
