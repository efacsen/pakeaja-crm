const fs = require('fs').promises;
const path = require('path');

class SessionTracker {
  constructor() {
    this.sessionFile = path.join(process.cwd(), '.claude', 'sessions.json');
    this.currentSession = null;
    this.sessions = [];
  }

  async loadSessions() {
    try {
      const data = await fs.readFile(this.sessionFile, 'utf-8');
      this.sessions = JSON.parse(data);
    } catch {
      this.sessions = [];
    }
  }

  async saveSessions() {
    try {
      await fs.mkdir(path.dirname(this.sessionFile), { recursive: true });
      await fs.writeFile(this.sessionFile, JSON.stringify(this.sessions, null, 2));
    } catch (error) {
      console.error('Failed to save sessions:', error.message);
    }
  }

  async startSession() {
    await this.loadSessions();
    
    this.currentSession = {
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
      endTime: null,
      commits: [],
      filesChanged: new Set(),
      features: [],
      todos: [],
      duration: 0
    };
  }

  async endSession() {
    if (!this.currentSession) return;
    
    this.currentSession.endTime = new Date().toISOString();
    this.currentSession.duration = this.calculateDuration(
      this.currentSession.startTime,
      this.currentSession.endTime
    );
    
    // Convert Set to Array for JSON serialization
    this.currentSession.filesChanged = Array.from(this.currentSession.filesChanged);
    
    this.sessions.push(this.currentSession);
    await this.saveSessions();
  }

  addCommit(message, files) {
    if (!this.currentSession) return;
    
    this.currentSession.commits.push({
      time: new Date().toISOString(),
      message,
      fileCount: files.length
    });
    
    files.forEach(f => this.currentSession.filesChanged.add(f.path));
  }

  addFeature(featureName) {
    if (!this.currentSession) return;
    
    if (!this.currentSession.features.includes(featureName)) {
      this.currentSession.features.push(featureName);
    }
  }

  addTodo(todo) {
    if (!this.currentSession) return;
    
    this.currentSession.todos.push({
      time: new Date().toISOString(),
      text: todo
    });
  }

  calculateDuration(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  async getSummary() {
    if (!this.currentSession) return 'No active session';
    
    const now = new Date();
    const start = new Date(this.currentSession.startTime);
    const duration = this.calculateDuration(start.toISOString(), now.toISOString());
    
    const lines = [
      `Session started: ${start.toLocaleTimeString()}`,
      `Duration: ${duration}`,
      `Commits: ${this.currentSession.commits.length}`,
      `Files changed: ${this.currentSession.filesChanged.size}`
    ];
    
    if (this.currentSession.features.length > 0) {
      lines.push(`Features: ${this.currentSession.features.join(', ')}`);
    }
    
    return lines.join('\n');
  }

  async getSessionSummary() {
    if (!this.currentSession) {
      return {
        duration: '0m',
        commits: 0,
        filesChanged: 0
      };
    }
    
    const now = new Date();
    const start = new Date(this.currentSession.startTime);
    
    return {
      duration: this.calculateDuration(start.toISOString(), now.toISOString()),
      commits: this.currentSession.commits.length,
      filesChanged: this.currentSession.filesChanged.size
    };
  }

  async getDailySummary(date = new Date()) {
    await this.loadSessions();
    
    const targetDate = date.toISOString().split('T')[0];
    const daySessions = this.sessions.filter(s => 
      s.startTime.split('T')[0] === targetDate
    );
    
    if (daySessions.length === 0) {
      return null;
    }
    
    const summary = {
      date: targetDate,
      sessions: daySessions.length,
      totalDuration: 0,
      totalCommits: 0,
      totalFilesChanged: new Set(),
      features: [],
      timeline: []
    };
    
    for (const session of daySessions) {
      // Calculate duration
      const start = new Date(session.startTime);
      const end = session.endTime ? new Date(session.endTime) : new Date();
      summary.totalDuration += (end - start);
      
      // Count commits
      summary.totalCommits += session.commits.length;
      
      // Collect unique files
      (session.filesChanged || []).forEach(f => summary.totalFilesChanged.add(f));
      
      // Collect features
      summary.features.push(...(session.features || []));
      
      // Build timeline
      summary.timeline.push({
        start: start.toLocaleTimeString(),
        end: session.endTime ? new Date(session.endTime).toLocaleTimeString() : 'ongoing',
        commits: session.commits.length
      });
    }
    
    // Format total duration
    const hours = Math.floor(summary.totalDuration / (1000 * 60 * 60));
    const minutes = Math.floor((summary.totalDuration % (1000 * 60 * 60)) / (1000 * 60));
    summary.totalDuration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    
    summary.totalFilesChanged = summary.totalFilesChanged.size;
    summary.features = [...new Set(summary.features)];
    
    return summary;
  }

  async getWeeklySummary() {
    await this.loadSessions();
    
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weekSessions = this.sessions.filter(s => 
      new Date(s.startTime) >= weekAgo
    );
    
    const summary = {
      startDate: weekAgo.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      totalSessions: weekSessions.length,
      totalCommits: 0,
      totalDuration: 0,
      mostProductiveDay: null,
      features: new Set(),
      dailyBreakdown: {}
    };
    
    for (const session of weekSessions) {
      const date = session.startTime.split('T')[0];
      
      if (!summary.dailyBreakdown[date]) {
        summary.dailyBreakdown[date] = {
          sessions: 0,
          commits: 0,
          duration: 0
        };
      }
      
      summary.dailyBreakdown[date].sessions++;
      summary.dailyBreakdown[date].commits += session.commits.length;
      
      const start = new Date(session.startTime);
      const end = session.endTime ? new Date(session.endTime) : new Date();
      const duration = end - start;
      summary.dailyBreakdown[date].duration += duration;
      
      summary.totalCommits += session.commits.length;
      summary.totalDuration += duration;
      
      (session.features || []).forEach(f => summary.features.add(f));
    }
    
    // Find most productive day
    let maxCommits = 0;
    for (const [date, data] of Object.entries(summary.dailyBreakdown)) {
      if (data.commits > maxCommits) {
        maxCommits = data.commits;
        summary.mostProductiveDay = date;
      }
    }
    
    // Format durations
    const totalHours = Math.floor(summary.totalDuration / (1000 * 60 * 60));
    const totalMinutes = Math.floor((summary.totalDuration % (1000 * 60 * 60)) / (1000 * 60));
    summary.totalDuration = totalHours > 0 ? `${totalHours}h ${totalMinutes}m` : `${totalMinutes}m`;
    
    summary.features = Array.from(summary.features);
    
    return summary;
  }

  async extractTodosFromCommits() {
    if (!this.currentSession) return [];
    
    const todos = [];
    
    for (const commit of this.currentSession.commits) {
      // Look for TODO patterns in commit messages
      const todoPattern = /TODO:?\s*(.+)|FIXME:?\s*(.+)|NOTE:?\s*(.+)/gi;
      let match;
      
      while ((match = todoPattern.exec(commit.message)) !== null) {
        const todo = match[1] || match[2] || match[3];
        if (todo) {
          todos.push({
            type: match[0].split(':')[0].toUpperCase(),
            text: todo.trim(),
            commit: commit.message,
            time: commit.time
          });
        }
      }
    }
    
    return todos;
  }

  async generateWorkReport(format = 'markdown') {
    const today = await this.getDailySummary();
    const week = await this.getWeeklySummary();
    
    if (format === 'markdown') {
      const lines = [
        '# Work Report',
        `Generated: ${new Date().toLocaleString()}`,
        ''
      ];
      
      if (today) {
        lines.push('## Today\'s Summary');
        lines.push(`- Sessions: ${today.sessions}`);
        lines.push(`- Duration: ${today.totalDuration}`);
        lines.push(`- Commits: ${today.totalCommits}`);
        lines.push(`- Files changed: ${today.totalFilesChanged}`);
        
        if (today.features.length > 0) {
          lines.push('- Features worked on:');
          today.features.forEach(f => lines.push(`  - ${f}`));
        }
        lines.push('');
      }
      
      if (week) {
        lines.push('## Weekly Summary');
        lines.push(`- Total sessions: ${week.totalSessions}`);
        lines.push(`- Total commits: ${week.totalCommits}`);
        lines.push(`- Total time: ${week.totalDuration}`);
        
        if (week.mostProductiveDay) {
          lines.push(`- Most productive day: ${week.mostProductiveDay}`);
        }
        
        if (week.features.length > 0) {
          lines.push('- Features completed:');
          week.features.forEach(f => lines.push(`  - ${f}`));
        }
        
        lines.push('');
        lines.push('### Daily Breakdown');
        for (const [date, data] of Object.entries(week.dailyBreakdown)) {
          const hours = Math.floor(data.duration / (1000 * 60 * 60));
          const minutes = Math.floor((data.duration % (1000 * 60 * 60)) / (1000 * 60));
          const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
          
          lines.push(`- ${date}: ${data.commits} commits, ${duration}`);
        }
      }
      
      return lines.join('\n');
    }
    
    return { today, week };
  }
}

module.exports = new SessionTracker();