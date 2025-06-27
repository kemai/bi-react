"use client";

import  { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useToast } from "../hooks/use-toast";
import { Loader2, Send, BarChart2, BrainCircuit } from "lucide-react";
import DynamicChart from "../charts/dynamic-chart";

/* -------------------------------------------------------------------------- */
/*  Tipi                                                                      */
/* -------------------------------------------------------------------------- */
interface ChartSpec {
  type: "bar" | "line" | "area" | "scatter";
  xKey: string;
  yKeys: { key: string; label: string }[];
  data: Record<string, unknown>[];
}
interface ApiResult {
  sql?: string;
  rows?: Record<string, unknown>[];
  insights?: string[];
  summary?: string;
  chartSpec?: ChartSpec;
}
type StreamMsg =
  | { type: "status"; payload: string }
  | { type: "sql"; payload: string }
  | { type: "rows"; payload: Record<string, unknown>[] }
  | { type: "insights"; payload: string[] }
  | { type: "analysis"; payload: string[] }
  | { type: "summary"; payload: string }
  | { type: "chart"; payload: ChartSpec }
  | { type: "error"; payload: string };

/* -------------------------------------------------------------------------- */
/*  Costanti                                                                   */
/* -------------------------------------------------------------------------- */
const API =  "http://127.0.0.1:8000";
const LOOKER_IFRAME_URL =
  "https://lookerstudio.google.com/embed/reporting/2afacd1f-b32e-4c12-baff-dd379e85fdea/page/tCwDE";

/* -------------------------------------------------------------------------- */
/*  Utilità                                                                    */
/* -------------------------------------------------------------------------- */
function renderCell(v: unknown) {
  if (v && typeof v === "object" && "value" in v) {
    return new Date((v as { value: string }).value).toLocaleDateString("it-IT");
  }
  return String(v);
}

/* -------------------------------------------------------------------------- */
/*  Componente principale                                                     */
/* -------------------------------------------------------------------------- */
export default function LookerBIQuerySection() {
  const { toast } = useToast();

  const [question, setQuestion] = useState("");
  const [runQuery, setRunQuery] = useState(true);
  const [makeChart, setMakeChart] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [apiRes, setApiRes] = useState<ApiResult | null>(null);

  const rows = apiRes?.rows ?? [];

  const fx = "animate-in fade-in slide-in-from-left duration-300";
  const oneLine = (sql: string) => sql.replace(/\s+/g, " ").trim();


  /* ----------------------------- Submit ---------------------------------- */
  async function handleSubmit() {
    if (!question.trim()) {
      toast({
        variant: "destructive",
        title: "Input richiesto",
        description: "Per favore, inserisci una domanda.",
      });
      return;
    }

    setIsLoading(true);
    setApiRes(null);
    setStatus("Ragionamento in corso…");

    try {
      const res = await fetch(`${API}/ask-legacy-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, run_query: runQuery, make_chart: makeChart }),
        cache: "no-store",
      });
      if (!res.ok) {
        const { detail } = (await res.json().catch(() => ({}))) as { detail?: string };
        throw new Error(detail || `${res.status} ${res.statusText}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffered = "";

      /* ---- funzione helper per ogni messaggio ---- */
      const handleMsg = (msg: StreamMsg) => {
        switch (msg.type) {
          case "status":
            setStatus(msg.payload);
            break;

         case "sql":
            setApiRes(pr => ({
              ...(pr ?? {}),
              sql: msg.payload,
              updatedAt: Date.now(),        
            }));  
            break;

          case "rows":
            setApiRes(pr => ({ ...(pr ?? {}), rows: msg.payload }));
            break;

          case "insights":
            setApiRes(pr => ({
              ...(pr ?? {}),
              insights: [...(pr?.insights ?? []), ...msg.payload],
            }));
            break;

          case "analysis":
            setApiRes(pr => ({ ...(pr ?? {}), insights: msg.payload }));
            break;

          case "summary":
            setApiRes(pr => ({ ...(pr ?? {}), summary: msg.payload }));
            break;

          case "chart":
            setApiRes(pr => ({ ...(pr ?? {}), chartSpec: msg.payload }));
            break;

          case "error":
            throw new Error(msg.payload);
        }
      };

      /* ---- lettura streaming ---- */
      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          if (buffered.trim()) handleMsg(JSON.parse(buffered) as StreamMsg);
          break;
        }

        buffered += decoder.decode(value, { stream: true });
        const lines = buffered.split("\n");
        buffered = lines.pop()!;

        for (const line of lines) {
          if (line.trim()) handleMsg(JSON.parse(line) as StreamMsg);
        }
      }

      setStatus(null);
    } catch (err: Error | unknown) {
      setStatus(null);
      toast({
        variant: "destructive",
        title: "Errore nella richiesta",
        description: err ?? "Si è verificato un errore sconosciuto durante la comunicazione.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex flex-col gap-6">
      {/* ---------------- Dashboard Looker ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <BarChart2 className="mr-3 h-7 w-7 text-primary" />
            Report Vendite · Looker Studio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-muted">
            <iframe
              src={LOOKER_IFRAME_URL}
              className="h-full w-full border-0"
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              title="Looker Studio Report Vendite"
            />
          </div>
        </CardContent>
      </Card>

      {/* ---------------- Blocchi risultati ---------------- */}
      <div
        className={`
          transform transition-all duration-300
          ${apiRes || isLoading ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-4 pointer-events-none"}
        `}
      >
        {(isLoading || apiRes) && (
          <Card className="overflow-hidden mb-4 min-h-[34rem]">
            <CardHeader>
              <CardTitle className="text-lg">
                {isLoading ? "Ragionamento in corso…" : "Risultati BI Assistant"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* SQL -------------------------------------------------- */}
              {apiRes?.sql ? (
                <section key={apiRes.sql + "_"} className={fx}>
                  <h3 className="mb-2 text-base font-semibold">SQL generata</h3>
                  <pre className="rounded bg-muted p-3 text-sm overflow-x-auto whitespace-pre-wrap break-words max-w-full">
                    {oneLine(apiRes.sql)}
                  </pre>
                </section>
              ) : isLoading ? (
                <section className="space-y-2 animate-pulse">
                  <div className="h-5 w-1/3 bg-gray-300 rounded" />
                  <div className="h-24 bg-gray-200 rounded" />
                </section>
              ) : null}

              {/* Tabella --------------------------------------------- */}
              {apiRes?.rows !== undefined ? (
                <section className="animate-in fade-in slide-in-from-left duration-300 delay-75">
                  <h3 className="mb-2 text-base font-semibold">
                    Dati estratti ({rows.length} righe)
                  </h3>
                  {rows.length > 0 ? (
                    <div className="h-80 overflow-auto rounded border max-w-full">
                      <Table>
                        <TableHeader className="sticky top-0 bg-card">
                          <TableRow>
                            {Object.keys(rows[0]!).map(col => (
                              <TableHead key={col}>{col}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rows.map((row, i) => (
                            <TableRow key={i} className={fx}>
                              {Object.keys(rows[0]!).map(col => (
                                <TableCell key={col}>{renderCell(row[col])}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="italic text-sm text-muted-foreground">(nessun dato)</p>
                  )}
                </section>
              ) : isLoading ? (
                <section className="space-y-2 animate-pulse">
                  <div className="h-5 w-1/4 bg-gray-300 rounded" />
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded" />
                  ))}
                </section>
              ) : null}

              {/* Insight ------------------------------------------------------- */}
              {(isLoading || apiRes?.insights?.length) && (
                <section className="animate-in fade-in slide-in-from-left duration-300 delay-150">
                  <h3 className="mb-2 text-base font-semibold">Insight</h3>

                  {apiRes?.insights?.length ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {apiRes.insights.map((t, i) => (
                        <li key={i} className={fx} >{t}</li>
                      ))}
                    </ul>
                  ) : (
                    /* scheletro mentre aspetti il primo insight */
                    <div className="space-y-1 animate-pulse">
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                    </div>
                  )}
                </section>
              )}

              {/* Summary -------------------------------------------- */}
              {status === null && apiRes?.summary && (
                <section key={apiRes.summary} className={`${fx} delay-200`}>
                  <h3 className="mb-2 text-base font-semibold">Riassunto</h3>
                  <p className="whitespace-pre-line text-sm">{apiRes.summary}</p>
                </section>
              )}

              {/* Chart ---------------------------------------------- */}
              {apiRes?.chartSpec ? (
                <section className="animate-in fade-in slide-in-from-left duration-300 delay-250">
                  <DynamicChart spec={apiRes.chartSpec} />
                </section>
              ) : isLoading ? (
                <section className="space-y-2 animate-pulse">
                  <div className="h-5 w-1/5 bg-gray-300 rounded" />
                  <div className="h-48 bg-gray-200 rounded" />
                </section>
              ) : null}
            </CardContent>
          </Card>
        )}
      </div>

      {/* ---------------- Form di input ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-2xl">
            <BrainCircuit className="mr-3 h-7 w-7 text-primary" />
            BI Assistant
          </CardTitle>
          <CardDescription>
            Scrivi in linguaggio naturale per ottenere analisi e visualizzazioni.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Domanda */}
          <div>
            <Label htmlFor="bi-question" className="mb-2 block text-base">
              La tua domanda:
            </Label>
            <Textarea
              id="bi-question"
              rows={4}
              placeholder="Esempio: Quali sono state le vendite totali per regione nel Q1 2024?"
              value={question}
              onChange={e => setQuestion(e.target.value)}
            />
          </div>

          {/* Opzioni */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="runQuery"
                checked={runQuery}
                onCheckedChange={c => setRunQuery(Boolean(c))}
              />
              <Label htmlFor="runQuery" className="text-sm">
                Esegui query sui dati
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="makeChart"
                checked={makeChart}
                onCheckedChange={c => setMakeChart(Boolean(c))}
              />
              <Label htmlFor="makeChart" className="text-sm">
                Includi grafico
              </Label>
            </div>
          </div>

          {/* Bottone */}
          <Button
            size="lg"
            className="w-full sm:w-auto text-base"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Send className="mr-2 h-5 w-5" />
            )}
            {isLoading ? "..." : "Esegui"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
