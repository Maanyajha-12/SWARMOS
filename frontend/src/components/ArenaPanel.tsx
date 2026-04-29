import React, { useState, useEffect } from "react";
import "../styles/Arena.css";

// ============================================================
// Types
// ============================================================

interface TournamentResult {
  round: number;
  agent_name: string;
  agent_id: number;
  generation: number;
  score: number;
  feedback: string;
}

interface LeaderboardEntry {
  rank: number;
  agent_id: number;
  agent_name: string;
  generation: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_score: number;
  best_score: number;
  total_earnings: number;
  breeding_count: number;
}

interface HistoryEntry {
  tournament_id: string;
  round: number;
  winner: string;
  avg_score: number;
  participation: number;
  timestamp: string;
}

type TabId = "tournament" | "leaderboard" | "history" | "stats";

const API = "http://localhost:5000";

// ============================================================
// Helpers
// ============================================================

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="match-bar-track">
      <div className="match-bar-fill" style={{ width: `${score}%` }} />
    </div>
  );
}

// ============================================================
// Component
// ============================================================

export default function ArenaPanel() {
  const [tournament, setTournament] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("tournament");
  const [customPrompt, setCustomPrompt] = useState("");

  useEffect(() => {
    loadStaticData();
  }, []);

  const loadStaticData = async () => {
    try {
      const [lb, hist, st] = await Promise.all([
        fetch(`${API}/api/arena/leaderboard`).then((r) => r.json()),
        fetch(`${API}/api/arena/history`).then((r) => r.json()),
        fetch(`${API}/api/arena/stats`).then((r) => r.json()),
      ]);
      setLeaderboard(lb.leaderboard ?? []);
      setHistory(hist.history ?? []);
      setStats(st);
    } catch (err) {
      console.error("[Arena] Failed to load static data:", err);
    }
  };

  const runTournament = async (custom = false) => {
    setLoading(true);
    try {
      const endpoint = custom ? "/api/arena/custom-tournament" : "/api/arena/tournament";
      const body = custom
        ? { prompt: customPrompt || "Create governance proposal", num_rounds: 5 }
        : { numRounds: 5 };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setTournament(data);
      setActiveTab("tournament");
      // Refresh leaderboard after tournament
      await loadStaticData();
    } catch (err) {
      console.error("[Arena] Tournament failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: "tournament",  label: "🎮 Current Tournament" },
    { id: "leaderboard", label: "🏆 Leaderboard" },
    { id: "history",     label: "📜 History" },
    { id: "stats",       label: "📊 Statistics" },
  ];

  // Unique rounds in the tournament
  const rounds: number[] = tournament
    ? [...new Set<number>(tournament.results.map((r: TournamentResult) => r.round))].sort()
    : [];

  return (
    <div className="arena-panel">
      {/* ── Header ── */}
      <div className="arena-header">
        <h1>⚔️ Agent Arena — Competitive Tournament</h1>
        <p>Agents compete, evolve, and improve through natural selection</p>
      </div>

      {/* ── Controls ── */}
      <div className="arena-controls">
        <button
          className="tournament-btn"
          onClick={() => runTournament(false)}
          disabled={loading}
        >
          {loading ? "⏳ Running…" : "🎮 Start Standard Tournament"}
        </button>

        <div className="custom-tournament">
          <input
            type="text"
            placeholder="Custom prompt (e.g. Launch decentralised governance)"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            disabled={loading}
            onKeyDown={(e) => e.key === "Enter" && !loading && runTournament(true)}
          />
          <button
            className="custom-btn"
            onClick={() => runTournament(true)}
            disabled={loading}
          >
            🎯 Custom
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="arena-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`arena-tab${activeTab === t.id ? " active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tournament Tab ── */}
      {activeTab === "tournament" && (
        <div className="arena-tab-content">
          {!tournament ? (
            <div className="arena-empty">
              <p>🎮 Run a tournament to see results here</p>
            </div>
          ) : (
            <>
              {/* Info banner */}
              <div className="tournament-info">
                <div className="tournament-info-item">
                  <label>Tournament ID</label>
                  <span>{tournament.tournament_id}</span>
                </div>
                <div className="tournament-info-item">
                  <label>Prompt</label>
                  <span>{tournament.prompt}</span>
                </div>
                <div className="tournament-info-item">
                  <label>Rounds</label>
                  <span>{tournament.rounds}</span>
                </div>
              </div>

              {/* Bracket */}
              <div className="tournament-bracket">
                {rounds.map((round) => {
                  const roundResults: TournamentResult[] = tournament.results
                    .filter((r: TournamentResult) => r.round === round)
                    .sort((a: TournamentResult, b: TournamentResult) => b.score - a.score);

                  return (
                    <div key={round} className="bracket-round">
                      <p className="bracket-round-title">Round {round}</p>
                      <div className="agents-in-round">
                        {roundResults.map((result, idx) => (
                          <div key={result.agent_id} className="agent-match">
                            <div className="match-header">
                              <span className="match-rank">#{idx + 1}</span>
                              <span className="match-score">{result.score}%</span>
                            </div>
                            <div className="match-name">
                              {result.agent_name}{" "}
                              <span className="match-gen">Gen {result.generation}</span>
                            </div>
                            <ScoreBar score={result.score} />
                            <div className="match-feedback">{result.feedback}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Winner + Stats */}
              <div className="tournament-bottom">
                <div className="winner-card">
                  <h2>🏆 Tournament Winner</h2>
                  <p className="winner-name">{tournament.winner.agent_name}</p>
                  <p className="winner-score">{tournament.winner.score}%</p>
                  <p className="winner-gen">Generation {tournament.winner.generation}</p>
                </div>

                <div className="tournament-stats-card">
                  <h3>Tournament Statistics</h3>
                  <div className="stat-mini-grid">
                    <div className="stat-mini">
                      <label>Average Score</label>
                      <span className="stat-mini-value">{tournament.statistics.average_score}%</span>
                    </div>
                    <div className="stat-mini">
                      <label>Highest Score</label>
                      <span className="stat-mini-value">{tournament.statistics.highest_score}%</span>
                    </div>
                    <div className="stat-mini">
                      <label>Lowest Score</label>
                      <span className="stat-mini-value">{tournament.statistics.lowest_score}%</span>
                    </div>
                    <div className="stat-mini">
                      <label>Total Matchups</label>
                      <span className="stat-mini-value">{tournament.statistics.total_matchups}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Leaderboard Tab ── */}
      {activeTab === "leaderboard" && (
        <div className="arena-tab-content">
          <h2 className="leaderboard-header">🏆 Global Leaderboard</h2>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Agent</th>
                <th>Gen</th>
                <th>Wins</th>
                <th>Win Rate</th>
                <th>Avg Score</th>
                <th>Best</th>
                <th>Breeding</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.rank} className={entry.rank === 1 ? "top-row" : ""}>
                  <td className="lb-rank">
                    {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
                  </td>
                  <td className="lb-name">{entry.agent_name}</td>
                  <td>{entry.generation}</td>
                  <td>{entry.wins}</td>
                  <td>
                    <div className="win-rate-cell">
                      <div className="win-rate-track">
                        <div className="win-rate-fill" style={{ width: `${entry.win_rate}%` }} />
                      </div>
                      <span>{entry.win_rate}%</span>
                    </div>
                  </td>
                  <td className="lb-score">{entry.avg_score}%</td>
                  <td>{entry.best_score}%</td>
                  <td>{entry.breeding_count}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === "history" && (
        <div className="arena-tab-content">
          <h2 className="history-header">📜 Tournament History</h2>
          <div className="history-list">
            {history.map((entry, idx) => (
              <div key={idx} className="history-item">
                <span className="history-round-badge">#{entry.round}</span>
                <div>
                  <p className="history-winner">🏆 {entry.winner}</p>
                  <p className="history-meta">
                    Avg Score: {entry.avg_score}% &nbsp;·&nbsp;{" "}
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats Tab ── */}
      {activeTab === "stats" && stats && (
        <div className="arena-tab-content">
          <h2 className="stats-header">📊 Arena Statistics</h2>
          <div className="stats-grid">
            {[
              { label: "Total Tournaments",  value: stats.total_tournaments },
              { label: "Total Rounds",        value: stats.total_rounds },
              { label: "Total Matchups",      value: stats.total_matchups },
              { label: "Active Agents",       value: stats.agents_active },
              { label: "Highest Avg Score",   value: `${stats.highest_avg_score}%` },
              { label: "Lowest Avg Score",    value: `${stats.lowest_avg_score}%` },
              { label: "Avg Winner Score",    value: `${stats.avg_winner_score}%` },
              { label: "Breeding Events",     value: stats.total_breeding_events },
              { label: "Generations Created", value: stats.generations_created },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <h3>{s.label}</h3>
                <p className="stat-value">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
