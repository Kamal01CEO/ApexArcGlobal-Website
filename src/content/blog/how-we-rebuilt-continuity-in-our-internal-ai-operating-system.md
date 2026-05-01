---
title: "How we rebuilt continuity in our internal AI operating system without bloating the prompt"
description: What broke, what the token audit exposed, and the continuity architecture we implemented to make the system more reliable.
publishDate: 2026-04-30
author: Kamal Rai
authorRole: CEO, ApexArcGlobal
category: AI Systems
tags:
  - AI systems
  - agent architecture
  - memory systems
  - prompt engineering
  - automation architecture
featured: true
draft: false
readingTime: 8 min read
---

Most agent memory discussions still chase the wrong fix.

When an AI system starts forgetting things, most builders react by adding more prompt history, more notes, more retrieval, and more tools. That feels logical. It is also how you end up with a system that gets heavier, more expensive, and still inconsistent.

That is the problem I ran into inside our internal AI operating system at ApexArcGlobal.

The issue was not that the system had no memory. The issue was that continuity had never been separated into clean layers. So the system kept spending tokens reloading context that should have been handled structurally.

## The real problem was self-reconstruction

The system could do useful work. It could reason, execute, inspect files, use tools, and carry forward some context. But it also had a bad habit: it kept reconstructing too much of its operating state across model calls.

That showed up in three ways:

- too much prior context being replayed again and again
- memory stores carrying temporary work they were never meant to carry
- continuation sessions and worker flows consuming input without producing proportional output

In plain terms, the system was spending too much of its intelligence budget on startup overhead.

## The audit made the pattern obvious

Instead of guessing, I pulled live telemetry from the local Hermes state database.

The totals were enough to expose the architecture problem.

On April 29, Telegram sessions consumed about 6.89 million input tokens and produced about 40.6 thousand output tokens.

On April 30, they consumed about 7.55 million input tokens and produced about 58.1 thousand output tokens.

That gap was too large to blame on normal usage.

The deeper problem showed up in continuation sessions that produced no user-visible messages while still consuming serious input. On April 29, those zero-message sessions burned about 1.21 million input tokens. On April 30, they burned about 2.78 million.

We also found that tool expansion had made the tool schema itself materially heavier, which meant the system was paying a repeated input cost just to re-describe capabilities it was not always using.

That changed the diagnosis.

We were not wasting tokens because the work was unusually hard.

We were wasting tokens because the operating system kept reloading itself.

## Why adding more memory would have made it worse

This is the mistake many teams make.

If continuity feels weak, they keep injecting more of everything:

- more session history
- more profile detail
- more project notes
- more tools
- more instructions

That does not create continuity. It creates prompt bloat.

A system does not become coherent just because it is carrying more text. It becomes coherent when each type of truth lives in the right place and gets loaded only when needed.

## The solution we implemented

The fix was to stop treating memory as one giant bucket and instead redesign continuity as an operating-system concern.

Here is the structure we moved to.

### 1. Keep identity separate from task context

The system now has a stable identity layer for reasoning style, operating rules, communication behavior, and permanent constraints.

That layer should not be rewritten every time a task changes. Identity is not a work log.

### 2. Keep durable user facts compact

Stable preferences, recurring corrections, and long-lived user facts belong in a separate compact memory layer.

That layer should contain things that are useful across sessions, not temporary plans or partial execution state.

### 3. Separate environment and project truth from user memory

Infrastructure facts, file locations, verified system behavior, architecture notes, and project-specific realities belong in their own durable layer.

That matters because "who the founder is" and "where token telemetry lives" are not the same kind of memory. Mixing them creates noise.

### 4. Shrink active context on purpose

Instead of dragging broad transcript history forward by default, the active context should mostly operate from the current task and the last several relevant turns.

That one decision removes a surprising amount of waste.

### 5. Replace prompt stuffing with retrieval on demand

If older continuity matters, the system should look it up deliberately instead of carrying it around on every call.

That means targeted recall, not permanent transcript inflation.

### 6. Use Obsidian as external memory, not prompt payload

We use Obsidian as the long-term archive for conversation journals, project continuity, and durable notes.

But the archive is not injected wholesale into the prompt. It exists so the system knows where to retrieve from when it actually needs something.

### 7. Treat workers as temporary instruments

Subagents and continuation flows only help if they receive narrower context and smaller tool exposure than the parent system.

If a worker gets the same giant prompt and the same oversized tool schema, it is not reducing cost. It is multiplying ceremony.

So the rule became simple: workers do focused work, return compressed findings, and do not own continuity.

## What changed after the redesign

The architecture is now cleaner because each kind of continuity has a home.

- identity has a fixed layer
- durable human facts have a compact layer
- system and project facts have a separate durable layer
- the active task window stays small
- older knowledge is retrieved when needed
- external notes stay in the archive until called for
- workers stay narrow instead of pretending to be full replacements for the main system

That is the difference between a prompt that feels clever and an operating system that can actually persist.

## The lesson

Continuity is not solved by making the prompt bigger.

It is solved by deciding what belongs in identity, what belongs in durable memory, what belongs in retrieval, and what should stay out of the prompt entirely.

That is a systems-design problem first.

## Why businesses should care

This matters far beyond internal AI experimentation.

If you are building AI into lead handling, operations, reporting, support, or founder workflows, continuity decides whether the system gets sharper over time or just more expensive over time.

A fragile agent can still look impressive in a demo.
A continuity-aware operating system is what survives repeated real use.

That is what businesses actually buy: reliability, speed, and lower coordination cost.

If your AI system keeps losing context, consuming too many tokens, or needing constant babysitting, the problem may not be model quality first. The problem is often that continuity has not been architected properly.

That is the part we are working on directly at ApexArcGlobal.

Not how to make AI remember everything.

How to make it know what belongs where, and retrieve only what matters when it matters.
