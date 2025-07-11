# Agent Communication Protocol v2.0

## Overview

This protocol defines standardized communication patterns for multi-agent development teams. It addresses the communication failures identified in the PakeAja CRM project and establishes clear, verifiable, and efficient communication standards.

## Core Communication Principles

1. **Evidence-Based Communication** - Every claim must have verifiable evidence
2. **Structured Formats** - Use templates for consistency
3. **Async-First Design** - Optimize for asynchronous work
4. **Traceable Decisions** - Document why, not just what
5. **Fail-Safe Mechanisms** - Clear escalation paths

## Agent Roles and Responsibilities

### 🎯 Orchestrator Agent (Leader)
```yaml
Responsibilities:
  - Monitor overall progress
  - Resolve blockers
  - Coordinate integration
  - Verify completion claims
  - Manage resource allocation

Communication Duties:
  - Daily planning messages
  - Blocker resolution responses
  - Integration approvals
  - Quality gate decisions
  - Sprint summaries
```

### 💻 Work Agents (Feature Developers)
```yaml
Responsibilities:
  - Implement features
  - Write tests
  - Update documentation
  - Report progress
  - Flag blockers early

Communication Duties:
  - Hourly progress updates
  - Blocker notifications
  - Completion requests
  - Integration readiness
  - Knowledge sharing
```

### 🔍 QA Agents (Quality Assurance)
```yaml
Responsibilities:
  - Continuous testing
  - Quality metrics
  - Regression prevention
  - Performance monitoring
  - Security checks

Communication Duties:
  - Test results reports
  - Quality alerts
  - Coverage updates
  - Bug discoveries
  - Performance reports
```

### 🔄 Integration Agents
```yaml
Responsibilities:
  - Merge coordination
  - Conflict resolution
  - Integration testing
  - Deployment preparation
  - Rollback management

Communication Duties:
  - Integration status
  - Conflict alerts
  - Merge success/failure
  - Deployment readiness
  - Rollback notifications
```

## Message Types and Templates

### 1. Progress Update (Hourly)
```markdown
## PROGRESS_UPDATE
**Type**: PROGRESS_UPDATE
**Agent**: [Agent-ID]
**Feature**: [Feature-Name]
**Timestamp**: [ISO-8601]
**Session**: [Session-ID]

### STATUS
- **Current**: [🔴 BLOCKED | 🟡 IN_PROGRESS | 🟢 READY]
- **Progress**: [0-100]% (calculated, not estimated)
- **Confidence**: [HIGH | MEDIUM | LOW]

### COMPLETED (Last Hour)
- [ ] Task description [evidence-link]
- [ ] Task description [evidence-link]

### IN PROGRESS
- [ ] Task description [expected-completion]
- [ ] Task description [expected-completion]

### EVIDENCE
```json
{
  "code_changes": {
    "files_modified": 5,
    "lines_added": 234,
    "lines_removed": 45,
    "test_coverage": 82.5
  },
  "commits": ["abc123", "def456"],
  "artifacts": ["screenshot-1.png", "demo-video.mp4"]
}
```

### BLOCKERS
- 🔴 **CRITICAL**: [Description] [needs-from] [impact]
- 🟡 **WARNING**: [Description] [mitigation-plan]

### NEXT STEPS
1. [Specific action] [expected-outcome]
2. [Specific action] [expected-outcome]

### METRICS
- **Velocity**: [story-points/hour]
- **Quality**: [defect-rate]
- **Integration**: [compatibility-score]
```

### 2. Blocker Alert
```markdown
## BLOCKER_ALERT
**Type**: BLOCKER_ALERT
**Priority**: [🔴 CRITICAL | 🟡 HIGH | 🔵 MEDIUM]
**Agent**: [Agent-ID]
**Timestamp**: [ISO-8601]

### ISSUE
**Summary**: [One-line description]
**Details**: [Full context]
**Impact**: [What's blocked and why]
**Attempted Solutions**: 
1. [What you tried]
2. [Why it didn't work]

### REQUIRED ACTION
**From**: [Orchestrator | Other-Agent | External]
**Action**: [Specific action needed]
**Deadline**: [When needed by]

### WORKAROUND
**Available**: [YES | NO]
**Description**: [If yes, describe temporary solution]
**Trade-offs**: [Impact of workaround]

### ESCALATION
**Auto-escalate**: [Time-limit]
**Escalation-path**: [Who to notify next]
```

### 3. Integration Request
```markdown
## INTEGRATION_REQUEST
**Type**: INTEGRATION_REQUEST
**Agent**: [Agent-ID]
**Feature**: [Feature-Name]
**Target**: [Branch-Name]
**Timestamp**: [ISO-8601]

### PRE-FLIGHT CHECK
- [x] All tests passing
- [x] Code coverage >80%
- [x] Documentation updated
- [x] Lint warnings resolved
- [x] Performance benchmarks met
- [x] Security scan passed

### CHANGES SUMMARY
**Scope**: [New Feature | Bug Fix | Enhancement | Refactor]
**Size**: [Small <100 | Medium <500 | Large >500 lines]
**Risk**: [Low | Medium | High]

### DEPENDENCIES
**New**: [List new dependencies]
**Updated**: [List updated dependencies]
**Removed**: [List removed dependencies]

### INTEGRATION NOTES
**Breaking Changes**: [YES | NO]
**Migration Required**: [YES | NO]
**Feature Flags**: [List flags]

### VERIFICATION
```bash
# Commands to verify integration
flutter test
flutter analyze
./integration-test.sh --feature [feature-name]
```

### ROLLBACK PLAN
**Strategy**: [Git revert | Feature flag | Database rollback]
**Commands**: [Specific rollback commands]
**Time to rollback**: [Estimated minutes]
```

### 4. Completion Claim
```markdown
## COMPLETION_CLAIM
**Type**: COMPLETION_CLAIM
**Agent**: [Agent-ID]
**Feature**: [Feature-Name]
**Timestamp**: [ISO-8601]

### ACCEPTANCE CRITERIA
- [x] Criteria 1 [evidence]
- [x] Criteria 2 [evidence]
- [x] Criteria 3 [evidence]

### DELIVERABLES
| Deliverable | Location | Status |
|-------------|----------|--------|
| Source Code | /lib/features/[name] | ✅ Complete |
| Unit Tests | /test/features/[name] | ✅ 95% coverage |
| Integration Tests | /integration_test/[name] | ✅ All passing |
| Documentation | /docs/features/[name] | ✅ Updated |
| API Docs | /api-docs/[name] | ✅ Generated |

### QUALITY METRICS
```json
{
  "test_coverage": 95.2,
  "code_complexity": 3.2,
  "lint_score": 98,
  "performance_score": "A",
  "security_score": "Pass",
  "documentation_coverage": 100
}
```

### DEMO
**Type**: [Video | Interactive | Screenshots]
**Link**: [URL or path]
**Duration**: [For videos]
**Key Points**: 
1. [What to notice]
2. [What to notice]

### KNOWN LIMITATIONS
- [Limitation 1] [planned resolution]
- [Limitation 2] [accepted trade-off]

### VERIFICATION COMMANDS
```bash
# Run these to verify completion
cd /path/to/worktree
flutter test --coverage
flutter run --release
./verify-feature.sh [feature-name]
```
```

### 5. Knowledge Share
```markdown
## KNOWLEDGE_SHARE
**Type**: KNOWLEDGE_SHARE  
**Agent**: [Agent-ID]
**Topic**: [Brief description]
**Relevance**: [Who needs to know]

### CONTEXT
[Why this is important to share]

### KEY LEARNING
[Main insight or solution]

### DETAILS
```[language]
# Code example or detailed explanation
```

### APPLICATION
- **When to use**: [Scenarios]
- **When NOT to use**: [Anti-patterns]
- **Trade-offs**: [Pros and cons]

### REFERENCES
- [Link to documentation]
- [Link to source]
```

## Communication Channels

### Primary Channels
```yaml
Real-time:
  - progress_updates: Hourly automated posts
  - blocker_alerts: Immediate notification
  - integration_status: Continuous feed

Async:
  - daily_summaries: End-of-day rollup
  - retrospectives: Weekly analysis
  - knowledge_base: Searchable archive
```

### Channel Rules
```yaml
progress_updates:
  - Automated every hour
  - Structured format only
  - No discussion threads
  
blocker_alerts:
  - Human-readable title
  - @mention required parties
  - Update when resolved

integration_status:
  - Success/failure only
  - Link to details
  - No speculation
```

## Verification Protocol

### Message Verification
```python
class MessageVerifier:
    def verify_progress_update(self, message):
        required_fields = [
            'status', 'progress', 'evidence',
            'completed', 'next_steps', 'metrics'
        ]
        
        validations = {
            'progress_is_calculated': self._verify_calculated_progress,
            'evidence_exists': self._verify_evidence_links,
            'metrics_are_measurable': self._verify_metrics,
            'tasks_have_proof': self._verify_task_completion
        }
        
        return all(validations[check](message) for check in validations)
```

### Evidence Requirements
```yaml
Code Changes:
  Required:
    - Git commit hashes
    - File paths
    - Line count changes
    - Test coverage delta

UI Changes:
  Required:
    - Screenshots or video
    - Device/platform tested
    - Accessibility check
    - Performance impact

API Changes:
  Required:
    - Endpoint documentation
    - Request/response examples
    - Breaking change flag
    - Migration guide
```

## Escalation Protocol

### Escalation Triggers
```yaml
Automatic Escalation:
  - Blocker unresolved for 2 hours
  - Integration failing for 3 attempts  
  - Agent unresponsive for 1 hour
  - Critical bug discovered
  - Security vulnerability found

Escalation Path:
  1. Work Agent → Team Lead Agent
  2. Team Lead → Orchestrator Agent
  3. Orchestrator → Human Supervisor
  4. Human Supervisor → Project Manager
```

### Escalation Message
```markdown
## ESCALATION
**Level**: [1 | 2 | 3 | 4]
**Original Issue**: [Reference]
**Time Elapsed**: [Duration]
**Attempts**: [Number]

### SITUATION
[Current state and impact]

### ACTIONS TAKEN
1. [Action] → [Result]
2. [Action] → [Result]

### RECOMMENDATION
[Suggested resolution]

### AUTHORITY NEEDED
[What permissions or decisions needed]
```

## Communication Metrics

### Quality Metrics
```yaml
Message Quality:
  - Completeness: All required fields present
  - Accuracy: Claims match evidence  
  - Timeliness: Sent within SLA
  - Clarity: Unambiguous content

Response Metrics:
  - Blocker Response Time: <15 minutes
  - Integration Decision Time: <30 minutes
  - Question Resolution Time: <2 hours
```

### Effectiveness Tracking
```sql
-- Weekly communication analysis
SELECT 
  agent_id,
  AVG(message_completeness) as avg_completeness,
  AVG(evidence_accuracy) as avg_accuracy,
  COUNT(CASE WHEN blocker_resolved < interval '2 hours' THEN 1 END) as quick_resolutions,
  COUNT(escalations) as escalation_count
FROM agent_communications
WHERE week = CURRENT_WEEK
GROUP BY agent_id;
```

## Best Practices

### DO's
- ✅ Use templates for consistency
- ✅ Provide evidence for all claims
- ✅ Update status in real-time
- ✅ Be specific about blockers
- ✅ Include reproduction steps
- ✅ Quantify progress objectively
- ✅ Link to actual code/artifacts
- ✅ Acknowledge message receipt

### DON'Ts
- ❌ Estimate progress subjectively
- ❌ Use vague descriptions
- ❌ Delay blocker notifications  
- ❌ Skip evidence links
- ❌ Combine multiple issues
- ❌ Use informal formats
- ❌ Assume context is known
- ❌ Edit messages after sending

## Implementation Guide

### Phase 1: Setup (Day 1)
1. Configure communication channels
2. Set up message templates
3. Implement verification bots
4. Train agents on protocol

### Phase 2: Enforcement (Week 1)
1. Soft enforcement with reminders
2. Collect feedback on friction points
3. Refine templates based on usage
4. Monitor compliance metrics

### Phase 3: Optimization (Week 2+)
1. Automate common messages
2. Add AI assistance for formatting
3. Implement smart notifications
4. Create communication dashboard

## Tools and Automation

### Message Automation
```bash
# Auto-generate progress update
./generate-progress-update.sh --agent work-auth --feature authentication

# Validate message format
./validate-message.sh --type PROGRESS_UPDATE --file message.md

# Send with verification
./send-verified-message.sh --channel progress_updates --message message.md
```

### Communication Bots
```yaml
Bots:
  FormatBot:
    - Validates message structure
    - Suggests corrections
    - Rejects malformed messages
  
  EvidenceBot:
    - Verifies evidence links
    - Checks artifact existence
    - Validates metrics
  
  EscalationBot:
    - Monitors response times
    - Auto-escalates when needed
    - Tracks resolution
```

## Conclusion

This communication protocol ensures that multi-agent teams can work effectively without the miscommunication and false progress reporting that plagued the original project. By requiring evidence-based communication and providing clear templates, we create an environment where trust is built through transparency and verification.