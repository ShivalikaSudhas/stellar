import React, { useState } from 'react';
import {
  HealthReading
} from '@/types';
import {
  UploadCloud,
  FileCode,
  FileSpreadsheet,
  AlertOctagon,
  CheckCircle2,
  Download,
  HelpCircle,
  Play
} from 'lucide-react';
import { validateHealthDataset, ValidationResult } from '@/core/validation/validator';

interface DataImportPageProps {
  onImportValidReadings: (readings: HealthReading[]) => Promise<void>;
  currentAstronautId: string;
}

export const DataImportPage: React.FC<DataImportPageProps> = ({
  onImportValidReadings,
  currentAstronautId
}) => {
  const [activeFormat, setActiveFormat] = useState<'csv' | 'json'>('csv');
  const [inputText, setInputText] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Sample CSV format
  const sampleCsv = `astronautId,metric,value,unit,timestamp,source,quality,notes
${currentAstronautId},heart_rate,72,bpm,2026-10-14T08:00:00Z,imported_csv,nominal,"Pre-EVA resting check"
${currentAstronautId},spo2,98.5,%,2026-10-14T08:05:00Z,imported_csv,nominal,"Nominal cabin atmosphere"
${currentAstronautId},sleep_duration,6.8,hours,2026-10-14T07:00:00Z,imported_csv,nominal,"Crew sleep quarters"
${currentAstronautId},activity,95,mins,2026-10-14T17:00:00Z,imported_csv,nominal,"ARED resistive workout"
${currentAstronautId},fatigue,3,scale_1_10,2026-10-14T21:00:00Z,imported_csv,nominal,"Post-exercise recovery"`;

  // Sample JSON format
  const sampleJson = JSON.stringify(
    {
      readings: [
        {
          astronautId: currentAstronautId,
          metric: 'heart_rate',
          value: 84,
          unit: 'bpm',
          timestamp: '2026-10-15T09:00:00Z',
          source: 'imported_json',
          quality: 'nominal',
          notes: 'Post-shift observation'
        },
        {
          astronautId: currentAstronautId,
          metric: 'spo2',
          value: 95.8,
          unit: '%',
          timestamp: '2026-10-15T09:05:00Z',
          source: 'imported_json',
          quality: 'nominal'
        },
        {
          astronautId: currentAstronautId,
          metric: 'sleep_duration',
          value: 4.8,
          unit: 'hours',
          timestamp: '2026-10-15T07:00:00Z',
          source: 'imported_json',
          quality: 'nominal'
        }
      ]
    },
    null,
    2
  );

  const handleValidate = () => {
    setImportSuccessMessage(null);
    if (!inputText.trim()) {
      setValidationResult({
        isValid: false,
        totalRecords: 0,
        validRecords: [],
        errors: [{
          row: 0,
          field: 'input',
          value: null,
          reason: 'Input payload is empty.',
          remediation: 'Paste or upload CSV or JSON data.'
        }],
        warnings: [],
        summary: { validCount: 0, errorCount: 1, metricsDetected: [], astronautsDetected: [] }
      });
      return;
    }

    const res = validateHealthDataset(
      inputText,
      activeFormat,
      activeFormat === 'csv' ? 'imported_csv' : 'imported_json'
    );
    setValidationResult(res);
  };

  const handleCommitImport = async () => {
    if (!validationResult || validationResult.validRecords.length === 0) return;
    setIsProcessing(true);
    try {
      await onImportValidReadings(validationResult.validRecords);
      setImportSuccessMessage(
        `Successfully committed ${validationResult.validRecords.length} telemetry observation(s) into local IndexedDB.`
      );
      setInputText('');
      setValidationResult(null);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSample = () => {
    if (activeFormat === 'csv') {
      setInputText(sampleCsv);
    } else {
      setInputText(sampleJson);
    }
    setValidationResult(null);
    setImportSuccessMessage(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UploadCloud size={20} className="text-cyan-accent" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Telemetry Data Import & Validation Engine
            </h1>
          </div>
          <p className="text-xs text-space-300 font-mono mt-0.5">
            Strict schema enforcement, bounds checking, unit verification, and source provenance
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1 bg-space-850 p-1 rounded-lg border border-space-700 font-mono text-xs">
          <button
            onClick={() => {
              setActiveFormat('csv');
              setValidationResult(null);
            }}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeFormat === 'csv'
                ? 'bg-cyan-accent text-space-950 font-bold'
                : 'text-space-300 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={14} />
            <span>CSV FORMAT</span>
          </button>

          <button
            onClick={() => {
              setActiveFormat('json');
              setValidationResult(null);
            }}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${
              activeFormat === 'json'
                ? 'bg-cyan-accent text-space-950 font-bold'
                : 'text-space-300 hover:text-white'
            }`}
          >
            <FileCode size={14} />
            <span>JSON FORMAT</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {importSuccessMessage && (
        <div className="p-4 rounded-lg bg-status-success/20 border border-status-success/50 text-status-success text-xs font-mono flex items-center gap-2 animate-fade-in">
          <CheckCircle2 size={18} />
          <span className="font-semibold">{importSuccessMessage}</span>
        </div>
      )}

      {/* Main Input Card */}
      <div className="aerospace-card p-6">
        <div className="flex items-center justify-between pb-3 border-b border-space-700 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-space-300">
            <span>Payload Input ({activeFormat.toUpperCase()}):</span>
          </div>
          <button
            onClick={loadSample}
            className="text-xs font-mono text-cyan-accent hover:underline flex items-center gap-1"
          >
            <Download size={13} />
            <span>Load Valid Sample Data</span>
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            setValidationResult(null);
          }}
          placeholder={
            activeFormat === 'csv'
              ? 'Paste CSV with headers: astronautId,metric,value,unit,timestamp,source,quality,notes...'
              : 'Paste JSON array or object with {"readings": [...]}...'
          }
          rows={10}
          className="w-full aerospace-input font-mono text-xs mb-4"
        />

        <div className="flex items-center justify-between pt-2">
          <div className="text-[11px] font-mono text-space-400 flex items-center gap-1">
            <HelpCircle size={13} />
            <span>Supports ISO 8601 timestamps, deduplication, and bounds checking.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setInputText('');
                setValidationResult(null);
              }}
              className="px-3 py-2 rounded bg-space-850 hover:bg-space-800 border border-space-700 text-xs font-mono text-space-300"
            >
              Clear
            </button>

            <button
              onClick={handleValidate}
              className="px-5 py-2 rounded-lg bg-space-800 hover:bg-space-700 border border-space-600 text-white font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <CheckCircle2 size={14} className="text-cyan-accent" />
              <span>Validate Dataset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Result Inspection Panel */}
      {validationResult && (
        <div className="aerospace-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-space-700">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white font-mono uppercase">
                Validation Report Summary
              </span>
              <span
                className={`text-xs font-mono uppercase px-2 py-0.5 rounded border ${
                  validationResult.isValid
                    ? 'bg-status-success/20 text-status-success border-status-success/40'
                    : 'bg-amber-400/20 text-amber-400 border-amber-400/40'
                }`}
              >
                {validationResult.isValid ? 'VALIDATED - READY TO IMPORT' : 'ERRORS DETECTED'}
              </span>
            </div>

            <div className="text-xs font-mono text-space-300">
              Valid: <strong className="text-status-success">{validationResult.summary.validCount}</strong> | Errors:{' '}
              <strong className="text-red-400">{validationResult.summary.errorCount}</strong>
            </div>
          </div>

          {/* Error List with Remediation Guidelines (Requirement: "Display import errors and explain how to correct them") */}
          {validationResult.errors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 font-mono">
                <AlertOctagon size={16} />
                <span>Identified Dataset Schema Violations ({validationResult.errors.length})</span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {validationResult.errors.map((err, i) => (
                  <div key={i} className="p-3 rounded-lg bg-red-950/20 border border-red-500/40 text-xs font-mono">
                    <div className="flex items-center justify-between text-red-300 mb-1">
                      <span>Row {err.row}: Field <code className="text-white font-bold">{err.field}</code></span>
                      <span className="text-space-400">Value: {String(err.value)}</span>
                    </div>
                    <div className="text-slate-200 mb-1">{err.reason}</div>
                    <div className="text-cyan-accent text-[11px]">
                      Remediation: {err.remediation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valid Records Commit Action */}
          {validationResult.validRecords.length > 0 && (
            <div className="pt-3 border-t border-space-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs font-mono text-space-300">
                Astronauts: <span className="text-white">{validationResult.summary.astronautsDetected.join(', ')}</span> | Metrics:{' '}
                <span className="text-white">{validationResult.summary.metricsDetected.join(', ')}</span>
              </div>

              <button
                onClick={handleCommitImport}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-lg bg-status-success text-space-950 font-bold font-mono text-xs hover:bg-emerald-400 transition-colors flex items-center gap-2 disabled:opacity-50 shadow-lg"
              >
                <Play size={14} />
                <span>
                  {isProcessing
                    ? 'Importing...'
                    : `Commit ${validationResult.validRecords.length} Valid Records to Database`}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Documented Schema Reference */}
      <div className="aerospace-card p-5 font-mono text-xs text-space-300">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">
          Specification: Standard Telemetry Import Schema
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
          <div className="bg-space-900 p-3 rounded border border-space-750">
            <span className="text-cyan-accent font-bold block mb-1">Mandatory Fields:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              <li><code>astronautId</code>: string (e.g. astro-01)</li>
              <li><code>metric</code>: 'heart_rate' | 'spo2' | 'sleep_duration' | 'activity' | 'fatigue' | 'stress'</li>
              <li><code>value</code>: number (finite numeric measurement)</li>
              <li><code>timestamp</code>: ISO 8601 string (e.g. 2026-10-14T08:00:00Z)</li>
            </ul>
          </div>
          <div className="bg-space-900 p-3 rounded border border-space-750">
            <span className="text-cyan-accent font-bold block mb-1">Optional & Metadata Fields:</span>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              <li><code>unit</code>: 'bpm', '%', 'hours', 'mins', 'scale_1_10'</li>
              <li><code>source</code>: 'imported_csv' | 'imported_json' | 'sensor'</li>
              <li><code>quality</code>: 'nominal' | 'degraded' | 'unreliable'</li>
              <li><code>notes</code>: string (operational remarks)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
