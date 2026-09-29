import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import type { SecurityFinding, FindingStatus, Severity } from '../types/finding';

interface FindingsTableProps {
  findings: SecurityFinding[];
  selectedFindingId: string | null;
  onSelectFinding: (finding: SecurityFinding) => void;
  selectedCategory: string | null;
  onClearCategoryFilter: () => void;
}

export const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  selectedCategory,
  onClearCategoryFilter
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = findings.filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.affectedComponent.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (sev: Severity) => {
    switch (sev) {
      case 'Critical':
        return <span className="ws-badge ws-sev-critical">Critical</span>;
      case 'High':
        return <span className="ws-badge ws-sev-high">High</span>;
      case 'Medium':
        return <span className="ws-badge ws-sev-medium">Medium</span>;
      case 'Low':
        return <span className="ws-badge ws-sev-low">Low</span>;
      default:
        return <span className="ws-badge ws-sev-info">Info</span>;
    }
  };

  const getStatusBadge = (status: FindingStatus) => {
    switch (status) {
      case 'Confirmed':
        return (
          <span className="ws-status-chip ws-chip-confirmed">
            <ShieldAlert className="w-3 h-3" /> Confirmed
          </span>
        );
      case 'Needs Validation':
        return (
          <span className="ws-status-chip ws-chip-validation">
            <AlertTriangle className="w-3 h-3" /> Needs Validation
          </span>
        );
      case 'Potential':
        return (
          <span className="ws-status-chip ws-chip-potential">
            <Layers className="w-3 h-3" /> Potential
          </span>
        );
      case 'Remediated':
        return (
          <span className="ws-status-chip ws-chip-remediated">
            <CheckCircle className="w-3 h-3" /> Remediated
          </span>
        );
    }
  };

  return (
    <div className="ws-panel ws-panel-findings">
      <div className="ws-panel-header">
        <div className="ws-panel-title-group">
          <span className="ws-panel-title">Security Findings</span>
          <span className="ws-badge-neutral">{filtered.length} of {findings.length}</span>
        </div>

        {selectedCategory && (
          <div className="ws-active-filter-pill">
            <span>Filter: {selectedCategory}</span>
            <button onClick={onClearCategoryFilter} className="ws-btn-clear-filter">
              ×
            </button>
          </div>
        )}
      </div>

      <div className="ws-findings-toolbar">
        <div className="ws-search-box">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search findings, components, IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="ws-filter-group">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ws-select-filter"
          >
            <option value="ALL">All Statuses</option>
            <option value="Needs Validation">Needs Validation</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Potential">Potential</option>
            <option value="Remediated">Remediated</option>
          </select>
        </div>
      </div>

      <div className="ws-findings-table-wrap">
        {findings.length === 0 ? (
          <div className="ws-empty-state">
            <Layers className="w-10 h-10 text-slate-600 mb-2" />
            <div className="ws-empty-title">Assessment Not Yet Run</div>
            <div className="ws-empty-sub">
              Click &quot;Run Assessment&quot; in the header to execute deterministic security checks
              against the local World Monitor target.
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ws-empty-state">
            <Search className="w-8 h-8 text-slate-600 mb-2" />
            <div className="ws-empty-title">No matching findings</div>
            <div className="ws-empty-sub">Try adjusting your filters or search keywords.</div>
          </div>
        ) : (
          <div className="ws-findings-list">
            {filtered.map((item) => {
              const isSelected = item.id === selectedFindingId;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectFinding(item)}
                  className={`ws-finding-row ${isSelected ? 'ws-finding-row-selected' : ''}`}
                >
                  <div className="ws-finding-row-header">
                    <div className="ws-finding-id-sev">
                      <span className="ws-finding-id">{item.id}</span>
                      {getSeverityBadge(item.severity)}
                      {item.isDemo && (
                        <span className="ws-demo-badge" title="Benchmark demonstration record">
                          DEMO / NOT VERIFIED
                        </span>
                      )}
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="ws-finding-row-title">{item.title}</div>

                  <div className="ws-finding-row-footer">
                    <span className="ws-finding-category">{item.category}</span>
                    <span className="ws-finding-component" title={item.affectedComponent}>
                      {item.location || item.affectedComponent}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
